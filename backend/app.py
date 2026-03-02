# backend/app.py
import os
import base64
import random
import hashlib 
import io
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from supabase import create_client, ClientOptions
import httpx

# Google Imports (for storing share1 backup)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# --- CONFIGURATION ---
SUPABASE_URL = "https://tacsrdvzgcsucparujcr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA"  
GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Create Supabase client with timeout settings
supabase = create_client(
    SUPABASE_URL, 
    SUPABASE_KEY,
    options=ClientOptions(
        postgrest_client_timeout=120,
        storage_client_timeout=120
    )
)
print("[INIT] Supabase client created with 120s timeout")

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


# --- GOOGLE HELPER ---
def get_google_service():
    """Get Google service - will show popup if needed (for registration)"""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', GOOGLE_SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except:
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', GOOGLE_SCOPES)
                creds = flow.run_local_server(port=0)
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', GOOGLE_SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            
    return build('drive', 'v3', credentials=creds)

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

@app.route('/api/register', methods=['POST'])
def register():
    """Register new vault - stores share1 in Google Drive, share2 in Supabase"""
    try:
        data = request.json
        password, username = data.get('password'), data.get('username')
        print(f"[REGISTER] Starting registration for user: {username}")
        
        golden_key_int = random.SystemRandom().randint(0, 2**127 - 1)
        shares = make_random_shares(golden_key_int, 2, 3)
        share1, share2, share3 = [f"{s[0]}-{s[1]}" for s in shares]
        print(f"[REGISTER] Generated 3 shares")

        # Delete old token to force fresh Google sign-in every time
        if os.path.exists('token.json'):
            os.remove('token.json')
            print(f"[REGISTER] Cleared old Google token")
        
        # Store share1 in Google Drive
        print(f"[REGISTER] Getting Google service (opening browser for sign-in)...")
        service = get_google_service()
        print(f"[REGISTER] Google service obtained, uploading share1...")
        file_metadata = {'name': f'{username}_share1.txt'}
        media = MediaIoBaseUpload(io.BytesIO(share1.encode()), mimetype='text/plain')
        service.files().create(body=file_metadata, media_body=media).execute()
        print(f"[REGISTER] Share1 uploaded to Google Drive")

        # Store share2 in Supabase with retry
        print(f"[REGISTER] Storing share2 in Supabase...")
        supabase_retry(lambda: supabase.table("shares").delete().eq("username", username).execute())
        supabase_retry(lambda: supabase.table("shares").insert({"username": username, "share_data": share2}).execute())
        print(f"[REGISTER] Share2 stored in Supabase")

        # Encrypt share3 with user's password and return to browser
        salt = os.urandom(16)
        key = derive_key(password, salt)
        f = Fernet(key)
        encrypted_share3 = f.encrypt(share3.encode())
        final_local_package = base64.b64encode(salt + b"::" + encrypted_share3).decode()
        
        # Also save to local_share.txt for verification scripts
        with open("local_share.txt", "w") as file:
            file.write(final_local_package)
        print(f"[REGISTER] Share3 saved to local_share.txt")
        
        print(f"[REGISTER] Registration complete!")
        return jsonify({
            "status": "success", 
            "local_share": final_local_package, 
            "golden_key": str(golden_key_int)
        })
    except Exception as e:
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)