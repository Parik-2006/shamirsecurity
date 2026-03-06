# --- Imports and App Initialization ---
import secrets
import os
import json
import base64
import random
import hashlib
# Flask and CORS
from flask import Flask, request, jsonify, redirect, send_from_directory
from flask_cors import CORS
# ...existing code...
import logging

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

# --- CHECK CREDENTIALS ENDPOINT ---
@app.route('/api/check_credentials', methods=['POST'])
def check_credentials():
    """
    Step 1: Validate username and password only (no local_share required).
    Used for the first step of the new unlock flow.
    """
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return jsonify({"status": "error", "message": "Username and password required."}), 400

        # Fetch share2 from Supabase to check if user exists
        try:
            response = supabase_retry(lambda: supabase.table("shares").select("share_data").eq("username", username).not_.is_("share_data", "null").execute())
        except Exception as e:
            print(f"[CHECK_CREDENTIALS] Supabase fetch error for user {username}: {e}")
            return jsonify({"status": "error", "message": f"Supabase fetch error: {e}"}), 500
        if not response.data:
            print(f"[CHECK_CREDENTIALS] No vault found for user {username}")
            return jsonify({"status": "error", "message": f"No vault found for user '{username}'"}), 404

        # Try to fetch salt from user's local_share.enc in Supabase (if stored), or just return success (since we can't check password without local_share)
        # For now, just return success if user exists. Password will be checked in the next step with local_share.
        # Optionally, you could store a password hash in Supabase for stricter checking.
        print(f"[CHECK_CREDENTIALS] User {username} exists. Password will be checked with local_share in next step.")
        return jsonify({"status": "success", "message": "User exists. Proceed to upload local_share."})
    except Exception as e:
        print(f"[CHECK_CREDENTIALS] Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Credential check failed: {str(e)}"}), 500
# Flask and CORS
from flask import Flask, request, jsonify, redirect, send_from_directory
from flask_cors import CORS
# ...existing code...
import logging

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

import traceback
# --- GLOBAL ERROR HANDLERS FOR JSON RESPONSES ---
@app.errorhandler(404)
def not_found_error(error):
    print("[ERROR 404]", error)
    return jsonify({"status": "error", "message": "Not Found", "code": 404}), 404

@app.errorhandler(Exception)
def handle_exception(e):
    print("[GLOBAL EXCEPTION]", e)
    traceback.print_exc()
    from werkzeug.exceptions import HTTPException
    if isinstance(e, HTTPException):
        print("[HTTPException]", e.description)
        return jsonify({
            "status": "error",
            "message": e.description,
            "code": e.code
        }), e.code
    print("[Non-HTTP Exception]", str(e))
    return jsonify({
        "status": "error",
        "message": str(e),
        "code": 500
    }), 500

# --- GOOGLE LOGIN CALLBACK ENDPOINT ---

# New: JSON callback endpoint for Google OAuth
@app.route('/api/login/google/callback')
def login_google_callback():
    """
    Google redirects here after login OAuth.
    - Exchange code for credentials
    - Check for MFA in ID token
    - Return JSON with MFA status or error
    """
    try:
        code = request.args.get('code')
        error = request.args.get('error')
        if error:
            print(f"[LOGIN CALLBACK] Error from Google: {error}")
            return jsonify({"status": "error", "message": "Google authentication was denied"}), 400
        flow = get_google_flow()
        code_verifier = request.args.get('code_verifier')
        if code_verifier:
            flow.fetch_token(code=code, code_verifier=code_verifier)
        else:
            flow.fetch_token(code=code)
        credentials = flow.credentials
        id_token = credentials.id_token
        import jwt
        mfa_enabled = False
        if id_token:
            try:
                decoded = jwt.decode(id_token, options={"verify_signature": False})
                amr = decoded.get('amr', [])
                if 'mfa' in amr or 'otp' in amr or 'sms' in amr:
                    mfa_enabled = True
            except Exception as e:
                print(f"[LOGIN CALLBACK] Failed to decode ID token for MFA check: {e}")
        print(f"[LOGIN CALLBACK] MFA enabled: {mfa_enabled}")
        return jsonify({"status": "success", "mfa_enabled": mfa_enabled})
    except Exception as e:
        print(f"[LOGIN CALLBACK] Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# --- GOOGLE LOGIN ENDPOINT (for unlocking vault) ---
@app.route('/api/login/google')
def login_google():
    """
    Initiate Google OAuth login for unlocking vault.
    - If user has MFA, require it.
    - If not, warn on frontend but allow login.
    """
    try:
        flow = get_google_flow()
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            prompt='consent',
            max_auth_age=0  # Always require fresh login and MFA if enabled
        )
        # Store code_verifier in session or temp store if needed (not required for login-only flow)
        return jsonify({
            "status": "redirect",
            "auth_url": auth_url
        })
    except Exception as e:
        print(f"[LOGIN GOOGLE] Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# --- HEALTH CHECK ENDPOINT FOR RENDER ---
def check_frontend_build():
    dist_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
    index_path = os.path.join(dist_dir, 'index.html')
    assets_path = os.path.join(dist_dir, 'assets')
    if not os.path.exists(index_path):
        logging.warning('FRONTEND BUILD MISSING: index.html not found in dist folder!')
    if not os.path.exists(assets_path):
        logging.warning('FRONTEND BUILD MISSING: assets folder not found in dist folder!')
# ...existing code...
import io
import time
import secrets
from flask import Flask, request, jsonify, redirect, send_from_directory
from flask_cors import CORS
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from supabase import create_client, ClientOptions
import httpx

# Google Imports (web OAuth flow - works for ALL users)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload



app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

# --- HEALTH CHECK ENDPOINT FOR RENDER ---
@app.route('/healthz')
def healthz():
    return 'OK', 200

# --- STATIC FILE SERVING FOR FRONTEND (PRODUCTION) ---

# Serve static assets (JS, CSS, images, etc.) from frontend/dist/assets
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    dist_assets = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist', 'assets')
    try:
        if not os.path.exists(dist_assets):
            print(f"[STATIC SERVE] Assets directory missing: {dist_assets}")
            return jsonify({"status": "error", "message": "Assets directory missing", "path": dist_assets}), 500
        asset_path = os.path.join(dist_assets, filename)
        if not os.path.exists(asset_path):
            print(f"[STATIC SERVE] Asset not found: {asset_path}")
            return jsonify({"status": "error", "message": "Asset not found", "path": asset_path}), 404
        print(f"[STATIC SERVE] Serving asset: {asset_path}")
        return send_from_directory(dist_assets, filename)
    except Exception as e:
        print(f"[STATIC SERVE] Exception: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# Serve favicon if present
@app.route('/favicon.ico')
def favicon():
    dist_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
    favicon_path = os.path.join(dist_dir, 'favicon.ico')
    try:
        if os.path.exists(favicon_path):
            print(f"[FAVICON] Serving favicon: {favicon_path}")
            return send_from_directory(dist_dir, 'favicon.ico')
        else:
            print(f"[FAVICON] Favicon not found: {favicon_path}")
            return ('', 204)
    except Exception as e:
        print(f"[FAVICON] Exception: {e}")
        return ('', 204)


# Serve index.html for all other routes (SPA fallback)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    dist_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
    index_path = os.path.join(dist_dir, 'index.html')
    try:
        print(f"[SPA FALLBACK] Request path: {path}")
        if os.path.exists(index_path):
            print(f"[SPA FALLBACK] Serving index.html: {index_path}")
            return send_from_directory(dist_dir, 'index.html')
        else:
            print(f"[SPA FALLBACK] index.html not found: {index_path}")
            # Return a styled HTML info page with diagnostics if frontend build is missing
            html = '''
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Shamir Vault - Backend Running</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #181c20; color: #fff; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 60px auto; background: #23272b; border-radius: 12px; box-shadow: 0 2px 16px #0008; padding: 32px; }
                    h1 { color: #ffb300; }
                    code { background: #222; color: #ffb300; padding: 2px 6px; border-radius: 4px; }
                    .diagnostics { margin-top: 24px; background: #222; padding: 16px; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Shamir Vault Backend is Running</h1>
                    <p>The backend server is up, but the frontend build (<code>frontend/dist/index.html</code>) is missing or not deployed.</p>
                    <div class="diagnostics">
                        <h2>Deployment Diagnostics</h2>
                        <ul>
                            <li><b>Backend URL:</b> {backend_url}</li>
                            <li><b>Frontend URL:</b> {frontend_url}</li>
                            <li><b>Checked for:</b> <code>{index_path}</code></li>
                            <li><b>Timestamp:</b> {timestamp}</li>
                        </ul>
                        <p style="color:#ffb300;">To fix: Build your frontend and deploy <code>dist</code> to the correct location.</p>
                    </div>
                </div>
            </body>
            </html>
            '''.format(
                backend_url=BACKEND_URL,
                frontend_url=FRONTEND_URL,
                index_path=index_path,
                timestamp=time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
            )
            return html, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        print(f"[SPA FALLBACK] Exception: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
# backend/app.py
import os
import json
import base64
import random
import hashlib 
import io
import time
import secrets
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from supabase import create_client, ClientOptions
import httpx

# Google Imports (web OAuth flow - works for ALL users)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))

# --- CONFIGURATION ---
# Set these as environment variables when deploying:
#   FRONTEND_URL  = https://your-frontend.onrender.com
#   BACKEND_URL   = https://your-backend.onrender.com
#   SUPABASE_URL  = your supabase project url
#   SUPABASE_KEY  = your supabase anon key
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://shamirsecurity-1234.onrender.com')
BACKEND_URL  = os.environ.get('BACKEND_URL', 'http://localhost:5000')

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://tacsrdvzgcsucparujcr.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA')
GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]
GOOGLE_REDIRECT_URI = f'{BACKEND_URL}/api/google/callback'


# Allow all origins for CORS on /api/* endpoints (for development/testing)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Allow OAuth over HTTP for local dev only
if 'localhost' in BACKEND_URL:
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Create Supabase client with timeout settings
supabase = create_client(
    SUPABASE_URL, 
    SUPABASE_KEY,
    options=ClientOptions(
        postgrest_client_timeout=120,
        storage_client_timeout=120
    )
)
print(f"[INIT] Supabase client created")
print(f"[INIT] Frontend: {FRONTEND_URL}")
print(f"[INIT] Backend:  {BACKEND_URL}")
print(f"[INIT] Google redirect: {GOOGLE_REDIRECT_URI}")

# --- PENDING REGISTRATIONS (in-memory store) ---
# Each entry: { username, share1, local_share, golden_key, created_at, completed }
import json
PENDING_REG_PATH = 'pending_registrations.json'
def load_pending_registrations():
    try:
        with open(PENDING_REG_PATH, 'r') as f:
            return json.load(f)
    except Exception:
        return {}

def save_pending_registrations():
    try:
        with open(PENDING_REG_PATH, 'w') as f:
            json.dump(pending_registrations, f)
    except Exception as e:
        print(f"[PERSIST] Failed to save pending_registrations: {e}")

pending_registrations = load_pending_registrations()

# --- RETRY HELPER FOR SUPABASE OPERATIONS ---
def supabase_retry(operation, max_retries=3, delay=2):
    """Execute a Supabase operation with retries"""
    last_error = None
    for attempt in range(max_retries):
        try:
            result = operation()
            return result
        except Exception as e:
            last_error = e
            print(f"[SUPABASE] Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
    raise last_error


# --- GOOGLE OAUTH HELPER (WEB FLOW) ---
def get_google_flow():
    """Create a Google OAuth Flow for web-based authentication.
    Works with both 'web' and 'installed' type credentials.json.
    Each user signs in with THEIR OWN Google account."""
    # Try to load credentials.json from disk first (convenient for local dev).
    creds_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'credentials.json')

    creds_data = None
    if os.path.exists(creds_path):
        try:
            with open(creds_path, 'r') as f:
                creds_data = json.load(f)
        except Exception as e:
            print(f"[GOOGLE] Failed to read credentials.json: {e}")

    # If credentials.json not present, try loading from environment variable
    if creds_data is None:
        env_json = os.environ.get('GOOGLE_CREDENTIALS_JSON')
        if env_json:
            try:
                creds_data = json.loads(env_json)
                print("[GOOGLE] Loaded credentials from GOOGLE_CREDENTIALS_JSON env var")
            except Exception as e:
                print(f"[GOOGLE] Failed to parse GOOGLE_CREDENTIALS_JSON: {e}")

    if creds_data is None:
        raise FileNotFoundError("credentials.json not found and GOOGLE_CREDENTIALS_JSON not set")

    # Support both 'installed' (desktop) and 'web' credentials formats
    if 'installed' in creds_data:
        print("[GOOGLE] Using 'installed' credentials adapted for web flow")
        client_config = {
            'web': {
                'client_id': creds_data['installed']['client_id'],
                'client_secret': creds_data['installed']['client_secret'],
                'auth_uri': creds_data['installed'].get('auth_uri', 'https://accounts.google.com/o/oauth2/auth'),
                'token_uri': creds_data['installed'].get('token_uri', 'https://oauth2.googleapis.com/token'),
                'redirect_uris': [GOOGLE_REDIRECT_URI]
            }
        }
        flow = Flow.from_client_config(client_config, scopes=GOOGLE_SCOPES)
    else:
        # Use web client config structure
        try:
            flow = Flow.from_client_config(creds_data, scopes=GOOGLE_SCOPES)
        except Exception:
            # Fallback to file-based method if possible
            flow = Flow.from_client_secrets_file(creds_path, scopes=GOOGLE_SCOPES)

    flow.redirect_uri = GOOGLE_REDIRECT_URI
    return flow

# --- SHAMIR MATH HELPERS ---
def make_random_shares(secret_int, minimum, shares, prime=2**127 - 1):
    poly = [secret_int] + [random.SystemRandom().randint(0, prime - 1) for i in range(minimum - 1)]
    return [(i, sum(coef * (i ** exp) for exp, coef in enumerate(poly)) % prime) for i in range(1, shares + 1)]

def recover_secret(shares, prime=2**127 - 1):
    x_s, y_s = zip(*shares)
    return _lagrange_interpolate(0, x_s, y_s, prime)

def _lagrange_interpolate(x, x_s, y_s, p):
    k = len(x_s)
    def PI(vals):
        accum = 1
        for v in vals: accum *= v
        return accum
    nums, dens = [], []
    for i in range(k):
        others = list(x_s)
        cur = others.pop(i)
        nums.append(PI(x - o for o in others))
        dens.append(PI(cur - o for o in others))
    den = PI(dens)
    num = sum([_divmod(nums[i] * den * y_s[i] % p, dens[i], p) for i in range(k)])
    return (_divmod(num, den, p) + p) % p

def _extended_gcd(a, b):
    x, last_x, y, last_y = 0, 1, 1, 0
    while b != 0:
        quot = a // b
        a, b = b, a % b
        x, last_x = last_x - quot * x, x
        y, last_y = last_y - quot * y, y
    return last_x, last_y

def _divmod(num, den, p):
    inv, _ = _extended_gcd(den, p)
    return num * inv

def derive_key(password, salt):
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def golden_int_to_fernet(golden_int):
    key_bytes = hashlib.sha256(str(golden_int).encode()).digest()
    return base64.urlsafe_b64encode(key_bytes)

# --- ROUTES ---

# ========== REGISTRATION (3-step web OAuth flow) ==========

# --- CHECK CREDENTIALS ENDPOINT (STUB) ---
@app.route('/api/check_credentials', methods=['POST'])
def check_credentials():
    """
    Stub endpoint for deployment compatibility.
    Returns success for any POST request.
    """
    return jsonify({"status": "success", "message": "Credentials check stub."}), 200

@app.route('/api/register/init', methods=['POST'])
def register_init():
    """
    STEP 1: User submits username + password.
    - Generate Shamir shares
    - Store share2 in Supabase
    - Return Google OAuth URL so user signs in with THEIR account
    """
    try:
        print("[DEBUG] /api/register/init called")
        print(f"[TRACE] Incoming data: {request.json}")
        # Check for scope mismatch in environment and code
        expected_scopes = set([
            'openid',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ])
        print(f"[TRACE] GOOGLE_SCOPES: {GOOGLE_SCOPES}")
        actual_scopes = set(GOOGLE_SCOPES)
        if actual_scopes != expected_scopes:
            print(f"[ERROR] Google OAuth scope mismatch: expected {expected_scopes}, got {actual_scopes}")
            return jsonify({
                "status": "error",
                "message": "Google OAuth scope mismatch. Please ensure your Google Cloud Console OAuth consent screen and backend GOOGLE_SCOPES match exactly: " + ', '.join(expected_scopes)
            }), 400
        data = request.json
        print(f"[TRACE] Parsed data: {data}")
        password, username = data.get('password'), data.get('username')
        print(f"[TRACE] username: {username}, password: {'set' if password else 'unset'}")
        
        if not username or not password:
            print(f"[ERROR] Username or password missing: username={username}, password={'set' if password else 'unset'}")
            return jsonify({"status": "error", "message": "Username and password required"}), 400
        
        print(f"[REGISTER INIT] Starting for user: {username}")
        
        # Generate Shamir shares
        golden_key_int = random.SystemRandom().randint(0, 2**127 - 1)
        print(f"[TRACE] Generating Shamir shares...")
        try:
            shares = make_random_shares(golden_key_int, 2, 3)
        except Exception as e:
            print(f"[ERROR] Failed to generate Shamir shares: {e}")
            return jsonify({"status": "error", "message": f"Failed to generate Shamir shares: {e}"}), 500
        share1, share2, share3 = [f"{s[0]}-{s[1]}" for s in shares]
        print(f"[REGISTER INIT] Generated 3 Shamir shares")

        # Store share2 in Supabase
        print(f"[REGISTER INIT] Storing share2 in Supabase...")
        print(f"[TRACE] Storing share2 in Supabase...")
        try:
            supabase_retry(lambda: supabase.table("shares").delete().eq("username", username).execute())
            supabase_retry(lambda: supabase.table("shares").insert({"username": username, "share_data": share2}).execute())
        except Exception as e:
            print(f"[ERROR] Supabase error: {e}")
            return jsonify({"status": "error", "message": f"Supabase error: {e}"}), 500
        print(f"[REGISTER INIT] Share2 stored")

        # Encrypt share3 with user's master password
        salt = os.urandom(16)
        print(f"[TRACE] Encrypting share3 with user password...")
        try:
            key = derive_key(password, salt)
            f = Fernet(key)
            encrypted_share3 = f.encrypt(share3.encode())
            local_share_package = base64.b64encode(salt + b"::" + encrypted_share3).decode()
        except Exception as e:
            print(f"[ERROR] Encryption error: {e}")
            return jsonify({"status": "error", "message": f"Encryption error: {e}"}), 500

        # Create a unique registration ID and store pending data
        reg_id = secrets.token_urlsafe(32)
        pending_registrations[reg_id] = {
            'username': username,
            'share1': share1,
            'local_share': local_share_package,
            'golden_key': str(golden_key_int),
            'created_at': time.time(),
            'completed': False
        }
        # Clean up expired pending registrations (> 10 min old)
        now = time.time()
        expired = [k for k, v in pending_registrations.items() if now - v.get('created_at', 0) > 600]
        for k in expired:
            del pending_registrations[k]
        save_pending_registrations()

        # Generate Google OAuth URL -- user will sign in with THEIR Google account
        print(f"[TRACE] Generating Google OAuth URL...")
        try:
            flow = get_google_flow()
            auth_url, _ = flow.authorization_url(
                access_type='offline',
                prompt='consent',
                state=reg_id,  # Pass reg_id so we can match it in callback
                login_hint=username,
                max_auth_age=0  # Always require fresh login and MFA
            )
            # Store code_verifier in pending_registrations
            pending_registrations[reg_id]['code_verifier'] = getattr(flow, 'code_verifier', None)
            print(f"[REGISTER INIT] OAuth URL generated: {auth_url}")
            return jsonify({
                "status": "redirect",
                "auth_url": auth_url,
                "reg_id": reg_id
            })
        except Exception as e:
            print(f"[ERROR] Google OAuth error: {e}")
            return jsonify({"status": "error", "message": f"Google OAuth error: {e}"}), 500
        
    except Exception as e:
        print(f"[REGISTER INIT] Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/google/callback')
def google_callback():
    """
    STEP 2: Google redirects here after user signs in.
    - Exchange auth code for credentials
    - Upload share1 to THIS USER'S Google Drive
    - Redirect back to frontend
    """
    try:
        code = request.args.get('code')
        state = request.args.get('state')  # This is our reg_id
        error = request.args.get('error')
        
        if error:
            print(f"[GOOGLE CALLBACK] Error from Google: {error}")
            return redirect(f"{FRONTEND_URL}?reg_error=Google+authentication+was+denied")
        
        if not state or state not in pending_registrations:
            print(f"[GOOGLE CALLBACK] Invalid/expired registration state")
            return redirect(f"{FRONTEND_URL}?reg_error=Registration+expired.+Please+try+again.")
        
        reg_data = pending_registrations[state]
        username = reg_data['username']
        share1 = reg_data['share1']
        
        print(f"[GOOGLE CALLBACK] Processing for user: {username}")
        
        # Exchange authorization code for user's Google credentials
        flow = get_google_flow()
        code_verifier = reg_data.get('code_verifier')
        if code_verifier:
            flow.fetch_token(code=code, code_verifier=code_verifier)
        else:
            flow.fetch_token(code=code)
        credentials = flow.credentials
        # Check for MFA (2-step verification) in ID token
        id_token = credentials.id_token
        import jwt
        mfa_enabled = False
        if id_token:
            try:
                decoded = jwt.decode(id_token, options={"verify_signature": False})
                amr = decoded.get('amr', [])
                if 'mfa' in amr or 'otp' in amr or 'sms' in amr:
                    mfa_enabled = True
            except Exception as e:
                print(f"[GOOGLE CALLBACK] Failed to decode ID token for MFA check: {e}")
        # Mark registration as complete
        pending_registrations[state]['completed'] = True
        pending_registrations[state]['mfa_enabled'] = mfa_enabled
        save_pending_registrations()
        
        # Upload share1 to THIS USER'S Google Drive
        print(f"[GOOGLE CALLBACK] Uploading share1 to user's Google Drive...")
        service = build('drive', 'v3', credentials=credentials)
        file_metadata = {'name': f'{username}_share1.txt'}
        media = MediaIoBaseUpload(io.BytesIO(share1.encode()), mimetype='text/plain')
        service.files().create(body=file_metadata, media_body=media).execute()
        print(f"[GOOGLE CALLBACK] Share1 uploaded to {username}'s Drive!")
        
        # Mark registration as complete
        pending_registrations[state]['completed'] = True
        save_pending_registrations()
        
        # Redirect to /auth-success for a dedicated close-message page
        print(f"[GOOGLE CALLBACK] Redirecting to frontend /auth-success...")
        return redirect(f"{FRONTEND_URL.rstrip('/')}/auth-success?reg_complete={state}")
        
    except Exception as e:
        print(f"[GOOGLE CALLBACK] Error: {e}")
        error_msg = str(e)[:200].replace(' ', '+')
        return redirect(f"{FRONTEND_URL}?reg_error={error_msg}")


@app.route('/api/register/complete', methods=['POST'])
def register_complete():
    """
    STEP 3: Frontend calls this after Google redirect to get local_share + golden_key.
    """
    try:
        data = request.json
        reg_id = data.get('reg_id')
        
        if not reg_id or reg_id not in pending_registrations:
            return jsonify({"status": "error", "message": "Invalid or expired registration. Please try again."}), 400
        
        reg_data = pending_registrations[reg_id]
        
        if not reg_data.get('completed'):
            return jsonify({"status": "error", "message": "Google authentication not completed yet."}), 400
        
        username = reg_data['username']
        result = {
            "status": "success",
            "local_share": reg_data['local_share'],
            "golden_key": reg_data['golden_key'],
            "username": username
        }
        
        # Clean up - remove from pending
        del pending_registrations[reg_id]
        save_pending_registrations()
        
        print(f"[REGISTER COMPLETE] Keys delivered to {username}'s browser!")
        return jsonify(result)
        
    except Exception as e:
        print(f"[REGISTER COMPLETE] Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login using Supabase share2 + local share3 (NO Google required)"""
    try:
        print("[DEBUG] /api/login called")
        data = request.json
        password, username, local_share_package = data.get('password'), data.get('username'), data.get('local_share')
        
        if not local_share_package:
            print(f"[ERROR] No local share provided for user {username}")
            return jsonify({"status": "error", "message": "No local share found. Please create a vault first."}), 400
        
        # Decrypt local share3
        try:
            raw_package = base64.b64decode(local_share_package)
            salt, encrypted_data = raw_package.split(b"::")
            f = Fernet(derive_key(password, salt))
            share3_str = f.decrypt(encrypted_data).decode()
            print(f"[LOGIN] Share3 decrypted successfully for user {username}")
        except Exception as decrypt_err:
            print(f"[ERROR] Decryption failed for user {username}: {decrypt_err}")
            return jsonify({"status": "error", "message": "Wrong password or corrupted local share"}), 401
        
        # Fetch share2 from Supabase with retry
        print(f"[LOGIN] Fetching share2 from Supabase for user {username}...")
        try:
            response = supabase_retry(lambda: supabase.table("shares").select("share_data").eq("username", username).not_.is_("share_data", "null").execute())
        except Exception as e:
            print(f"[ERROR] Supabase fetch error for user {username}: {e}")
            return jsonify({"status": "error", "message": f"Supabase fetch error: {e}"}), 500
        if not response.data:
            print(f"[ERROR] No vault found for user {username}")
            return jsonify({"status": "error", "message": f"No vault found for user '{username}'"}), 404
        share2_str = response.data[0]['share_data']
        print(f"[LOGIN] Share2 retrieved from Supabase for user {username}")
        
        # Reconstruct golden key from share2 + share3
        try:
            s2 = (int(share2_str.split('-')[0]), int(share2_str.split('-')[1]))
            s3 = (int(share3_str.split('-')[0]), int(share3_str.split('-')[1]))
            recovered_int = recover_secret([s2, s3])
        except Exception as e:
            print(f"[ERROR] Failed to reconstruct golden key for user {username}: {e}")
            return jsonify({"status": "error", "message": f"Failed to reconstruct golden key: {e}"}), 500
        print(f"[LOGIN] Login successful for user {username}!")
        return jsonify({"status": "success", "golden_key": str(recovered_int)})
    except Exception as e:
        print(f"[LOGIN] Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Login failed: {str(e)}"}), 401

@app.route('/api/add_password', methods=['POST'])
def add_password():
    """Add a new password to the vault (Supabase)"""
    try:
        data = request.json
        username = data.get('username')
        golden_key = data.get('golden_key') 
        s_name = data.get('service_name')
        s_user = data.get('service_username')
        s_pass = data.get('password_to_save')

        if not all([username, golden_key, s_name, s_pass]):
            return jsonify({"status": "error", "message": "Missing required fields: username, golden_key, service_name, password"}), 400

        print(f"[ADD_PASSWORD] Adding password for service: {s_name}")
        
        f = Fernet(golden_int_to_fernet(int(golden_key)))
        encrypted_pass = f.encrypt(s_pass.encode()).decode()

        # Store in Supabase with retry
        supabase_retry(lambda: supabase.table("shares").insert({
            "username": username,
            "service_name": s_name,
            "service_username": s_user,
            "encrypted_password": encrypted_pass
        }).execute())
        print(f"[ADD_PASSWORD] Password stored in Supabase")
        
        return jsonify({"status": "success", "message": "Password stored!"})
    except Exception as e:
        print(f"[ADD_PASSWORD] Error: {e}")
        return jsonify({"status": "error", "message": f"Failed to store password: {str(e)}"}), 500

@app.route('/api/get_passwords', methods=['POST'])
def get_passwords():
    """Get all passwords for a user (Supabase)"""
    try:
        data = request.json
        username, golden_key = data.get('username'), data.get('golden_key')
        
        if not username or not golden_key:
            return jsonify({"status": "error", "message": "Missing username or golden_key"}), 400
        
        print(f"[GET_PASSWORDS] Fetching passwords for user: {username}")
        
        f = Fernet(golden_int_to_fernet(int(golden_key)))
        
        # Fetch from Supabase with retry
        response = supabase_retry(lambda: supabase.table("shares").select("*").eq("username", username).not_.is_("encrypted_password", "null").execute())
        
        decrypted_list = []
        for row in response.data:
            try:
                dec_pass = f.decrypt(row['encrypted_password'].encode()).decode()
                decrypted_list.append({
                    "service": row['service_name'], 
                    "username": row.get('service_username', ''), 
                    "password": dec_pass
                })
            except: 
                continue
        
        print(f"[GET_PASSWORDS] Retrieved {len(decrypted_list)} passwords")
        return jsonify({"status": "success", "passwords": decrypted_list})
    except Exception as e:
        print(f"[GET_PASSWORDS] Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/')
def index():
    """Root route - confirms backend is running"""
    return jsonify({
        "status": "ok",
        "message": "Shamir Vault Backend is running!",
        "endpoints": ["/api/register/init", "/api/login", "/api/add_password", "/api/get_passwords", "/api/health"]
    })


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint for deployment platforms"""
    return jsonify({"status": "ok", "frontend": FRONTEND_URL, "backend": BACKEND_URL})


@app.route('/api/debug_google_creds', methods=['GET'])
def debug_google_creds():
    """Debug endpoint: reports presence of credentials.json and GOOGLE_CREDENTIALS_JSON env var.
    Returns masked client_id if available (first/last 6 chars visible).
    """
    creds_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'credentials.json')
    file_exists = os.path.exists(creds_path)
    env_json = os.environ.get('GOOGLE_CREDENTIALS_JSON')
    env_set = bool(env_json)
    masked_client_id = None

    def mask(s):
        if not s or len(s) < 12:
            return '***masked***'
        return s[:6] + '...' + s[-6:]

    try:
        if file_exists:
            with open(creds_path, 'r') as f:
                data = json.load(f)
                # support web/installed
                cid = None
                if 'web' in data and 'client_id' in data['web']:
                    cid = data['web']['client_id']
                elif 'installed' in data and 'client_id' in data['installed']:
                    cid = data['installed']['client_id']
                masked_client_id = mask(cid)
        elif env_set:
            try:
                data = json.loads(env_json)
                cid = None
                if 'web' in data and 'client_id' in data['web']:
                    cid = data['web']['client_id']
                elif 'installed' in data and 'client_id' in data['installed']:
                    cid = data['installed']['client_id']
                masked_client_id = mask(cid)
            except Exception:
                masked_client_id = 'invalid_json'
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({
        "status": "ok",
        "credentials_json_on_disk": file_exists,
        "google_credentials_env_set": env_set,
        "masked_client_id": masked_client_id
    })


if __name__ == '__main__':
    check_frontend_build()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)