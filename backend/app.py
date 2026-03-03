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
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
BACKEND_URL  = os.environ.get('BACKEND_URL', 'http://localhost:5000')

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://tacsrdvzgcsucparujcr.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA')

GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.file']
GOOGLE_REDIRECT_URI = f'{BACKEND_URL}/api/google/callback'

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
pending_registrations = {}

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
    creds_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'credentials.json')
    
    with open(creds_path, 'r') as f:
        creds_data = json.load(f)
    
    if 'installed' in creds_data:
        # Convert "installed" (Desktop) credentials to work as web flow
        # NOTE: For production, create a "Web application" OAuth client in Google Console!
        print("[GOOGLE] Using 'installed' credentials adapted for web flow")
        client_config = {
            'web': {
                'client_id': creds_data['installed']['client_id'],
                'client_secret': creds_data['installed']['client_secret'],
                'auth_uri': creds_data['installed']['auth_uri'],
                'token_uri': creds_data['installed']['token_uri'],
                'redirect_uris': [GOOGLE_REDIRECT_URI]
            }
        }
        flow = Flow.from_client_config(client_config, scopes=GOOGLE_SCOPES)
    else:
        # Proper "web" type credentials (production)
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

@app.route('/api/register/init', methods=['POST'])
def register_init():
    """
    STEP 1: User submits username + password.
    - Generate Shamir shares
    - Store share2 in Supabase
    - Return Google OAuth URL so user signs in with THEIR account
    """
    try:
        data = request.json
        password, username = data.get('password'), data.get('username')
        
        if not username or not password:
            return jsonify({"status": "error", "message": "Username and password required"}), 400
        
        print(f"[REGISTER INIT] Starting for user: {username}")
        
        # Generate Shamir shares
        golden_key_int = random.SystemRandom().randint(0, 2**127 - 1)
        shares = make_random_shares(golden_key_int, 2, 3)
        share1, share2, share3 = [f"{s[0]}-{s[1]}" for s in shares]
        print(f"[REGISTER INIT] Generated 3 Shamir shares")

        # Store share2 in Supabase
        print(f"[REGISTER INIT] Storing share2 in Supabase...")
        supabase_retry(lambda: supabase.table("shares").delete().eq("username", username).execute())
        supabase_retry(lambda: supabase.table("shares").insert({"username": username, "share_data": share2}).execute())
        print(f"[REGISTER INIT] Share2 stored")

        # Encrypt share3 with user's master password
        salt = os.urandom(16)
        key = derive_key(password, salt)
        f = Fernet(key)
        encrypted_share3 = f.encrypt(share3.encode())
        local_share_package = base64.b64encode(salt + b"::" + encrypted_share3).decode()

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

        # Generate Google OAuth URL -- user will sign in with THEIR Google account
        flow = get_google_flow()
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent',
            state=reg_id  # Pass reg_id so we can match it in callback
        )
        
        print(f"[REGISTER INIT] OAuth URL generated. Waiting for user to sign in...")
        return jsonify({
            "status": "redirect",
            "auth_url": auth_url,
            "reg_id": reg_id
        })
        
    except Exception as e:
        print(f"[REGISTER INIT] Error: {e}")
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
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Upload share1 to THIS USER'S Google Drive
        print(f"[GOOGLE CALLBACK] Uploading share1 to user's Google Drive...")
        service = build('drive', 'v3', credentials=credentials)
        file_metadata = {'name': f'{username}_share1.txt'}
        media = MediaIoBaseUpload(io.BytesIO(share1.encode()), mimetype='text/plain')
        service.files().create(body=file_metadata, media_body=media).execute()
        print(f"[GOOGLE CALLBACK] Share1 uploaded to {username}'s Drive!")
        
        # Mark registration as complete
        pending_registrations[state]['completed'] = True
        
        # Redirect back to frontend with success
        print(f"[GOOGLE CALLBACK] Redirecting to frontend...")
        return redirect(f"{FRONTEND_URL}?reg_complete={state}")
        
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
        
        print(f"[REGISTER COMPLETE] Keys delivered to {username}'s browser!")
        return jsonify(result)
        
    except Exception as e:
        print(f"[REGISTER COMPLETE] Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login using Supabase share2 + local share3 (NO Google required)"""
    try:
        data = request.json
        password, username, local_share_package = data.get('password'), data.get('username'), data.get('local_share')
        
        if not local_share_package:
            return jsonify({"status": "error", "message": "No local share found. Please create a vault first."}), 400
        
        # Decrypt local share3
        try:
            raw_package = base64.b64decode(local_share_package)
            salt, encrypted_data = raw_package.split(b"::")
            f = Fernet(derive_key(password, salt))
            share3_str = f.decrypt(encrypted_data).decode()
            print(f"[LOGIN] Share3 decrypted successfully")
        except Exception as decrypt_err:
            return jsonify({"status": "error", "message": "Wrong password or corrupted local share"}), 401
        
        # Fetch share2 from Supabase with retry
        print(f"[LOGIN] Fetching share2 from Supabase...")
        response = supabase_retry(lambda: supabase.table("shares").select("share_data").eq("username", username).not_.is_("share_data", "null").execute())
        
        if not response.data:
            return jsonify({"status": "error", "message": f"No vault found for user '{username}'"}), 404
        
        share2_str = response.data[0]['share_data']
        print(f"[LOGIN] Share2 retrieved from Supabase")
        
        # Reconstruct golden key from share2 + share3
        s2 = (int(share2_str.split('-')[0]), int(share2_str.split('-')[1]))
        s3 = (int(share3_str.split('-')[0]), int(share3_str.split('-')[1]))
        recovered_int = recover_secret([s2, s3])
        
        print(f"[LOGIN] Login successful!")
        return jsonify({"status": "success", "golden_key": str(recovered_int)})
    except Exception as e:
        print(f"[LOGIN] Error: {e}")
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

@app.route("/")
def home():
    return "Backend is running!"


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(debug=debug, port=port, host='0.0.0.0')