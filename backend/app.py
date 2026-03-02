# backend/app.py
import os
import json
import base64
import secrets
import random
import hashlib 
from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from supabase import create_client

# Google Imports
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import io

app = Flask(__name__)
# Enable CORS for the updated Vite port 5174
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}}, supports_credentials=True)

# --- CONFIGURATION ---
SUPABASE_URL = "https://tacsrdvzgcsucparujcr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA"
GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.file']

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

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

# --- FIXED GOOGLE HELPER ---
def get_google_service(silent=False):
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', GOOGLE_SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except:
                if silent: raise Exception("Auth required")
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', GOOGLE_SCOPES)
                creds = flow.run_local_server(port=0)
        elif silent:
            raise Exception("Google Drive session expired. Please Register once to re-auth.")
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', GOOGLE_SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            
    return build('drive', 'v3', credentials=creds)

def derive_key(password, salt):
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def golden_int_to_fernet(golden_int):
    key_bytes = hashlib.sha256(str(golden_int).encode()).digest()
    return base64.urlsafe_b64encode(key_bytes)

# --- ROUTES ---

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        password, username = data.get('password'), data.get('username')
        golden_key_int = random.SystemRandom().randint(0, 2**127 - 1)
        shares = make_random_shares(golden_key_int, 2, 3)
        share1, share2, share3 = [f"{s[0]}-{s[1]}" for s in shares]

        service = get_google_service(silent=False)
        file_metadata = {'name': f'{username}_share1.txt'}
        media = MediaIoBaseUpload(io.BytesIO(share1.encode()), mimetype='text/plain')
        service.files().create(body=file_metadata, media_body=media).execute()

        supabase.table("shares").insert({"username": username, "share_data": share2}).execute()

        salt = os.urandom(16)
        key = derive_key(password, salt)
        f = Fernet(key)
        encrypted_share3 = f.encrypt(share3.encode())
        final_local_package = base64.b64encode(salt + b"::" + encrypted_share3).decode()
        
        return jsonify({"status": "success", "local_share": final_local_package})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        password, username, local_share_package = data.get('password'), data.get('username'), data.get('local_share')
        raw_package = base64.b64decode(local_share_package)
        salt, encrypted_data = raw_package.split(b"::")
        f = Fernet(derive_key(password, salt))
        share3_str = f.decrypt(encrypted_data).decode()
        
        service = get_google_service(silent=True)
        results = service.files().list(q=f"name='{username}_share1.txt'", spaces='drive').execute()
        items = results.get('files', [])
        if not items: return jsonify({"status": "error", "message": "Share 1 missing"}), 404
        share1_data = service.files().get_media(fileId=items[0]['id']).execute().decode('utf-8')

        s1 = (int(share1_data.split('-')[0]), int(share1_data.split('-')[1]))
        s3 = (int(share3_str.split('-')[0]), int(share3_str.split('-')[1]))
        recovered_int = recover_secret([s1, s3])
        
        return jsonify({"status": "success", "golden_key": str(recovered_int)})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401

# FIXED: Standardized response for Vault Storage
@app.route('/api/add_password', methods=['POST'])
def add_password():
    try:
        data = request.json
        username = data.get('username')
        golden_key = data.get('golden_key') 
        s_name = data.get('service_name')
        s_user = data.get('service_username')
        s_pass = data.get('password_to_save')

        if not all([username, golden_key, s_name, s_pass]):
            return jsonify({"status": "error", "message": "Missing fields"}), 400

        f = Fernet(golden_int_to_fernet(int(golden_key)))
        encrypted_pass = f.encrypt(s_pass.encode()).decode()

        supabase.table("shares").insert({
            "username": username,
            "service_name": s_name,
            "service_username": s_user,
            "encrypted_password": encrypted_pass
        }).execute()

        return jsonify({"status": "success", "message": "Stored in Supabase!"})
    except Exception as e:
        print(f"Store Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get_passwords', methods=['POST'])
def get_passwords():
    try:
        data = request.json
        username, golden_key = data.get('username'), data.get('golden_key')
        f = Fernet(golden_int_to_fernet(int(golden_key)))
        
        response = supabase.table("shares").select("*").eq("username", username).not_.is_("encrypted_password", "null").execute()
        
        decrypted_list = []
        for row in response.data:
            try:
                dec_pass = f.decrypt(row['encrypted_password'].encode()).decode()
                decrypted_list.append({
                    "service": row['service_name'], 
                    "username": row.get('service_username', ''), 
                    "password": dec_pass
                })
            except: continue 
        return jsonify({"status": "success", "passwords": decrypted_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)