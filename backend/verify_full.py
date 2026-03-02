# backend/verify_full.py
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from supabase import create_client
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# --- CONFIGURATION (Must match app.py) ---
SUPABASE_URL = "https://tacsrdvzgcsucparujcr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA"
GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.file']

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- MATH HELPER (The Magic) ---
def recover_secret(shares, prime=2**127 - 1):
    if len(shares) < 2: raise ValueError("Need at least 2 shares")
    x_s, y_s = zip(*shares)
    return _lagrange_interpolate(0, x_s, y_s, prime)

def _lagrange_interpolate(x, x_s, y_s, p):
    k = len(x_s)
    def PI(vals):
        accum = 1
        for v in vals: accum *= v
        return accum
    nums = []
    dens = []
    for i in range(k):
        others = list(x_s)
        cur = others.pop(i)
        nums.append(PI(x - o for o in others))
        dens.append(PI(cur - o for o in others))
    den = PI(dens)
    num = sum([_divmod(nums[i] * den * y_s[i] % p, dens[i], p) for i in range(k)])
    return (_divmod(num, den, p) + p) % p

def _extended_gcd(a, b):
    x = 0
    last_x = 1
    y = 1
    last_y = 0
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

# --- MAIN SCRIPT ---
def run_verification():
    print("\n--- 🔐 FULL SYSTEM VERIFICATION 🔐 ---")
    
    # 1. Get Inputs
    username = input("Enter Username (to find cloud shares): ").strip()
    password = input("Enter Master Password (to unlock local file): ").strip()
    
    shares_found = []

    # --- STEP 1: FETCH GOOGLE DRIVE (SHARE 1) ---
    print("\n[1/3] Fetching Google Drive...")
    try:
        creds = None
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', GOOGLE_SCOPES)
        service = build('drive', 'v3', credentials=creds)
        results = service.files().list(q=f"name='{username}_share1.txt'", spaces='drive').execute()
        items = results.get('files', [])
        
        if items:
            data = service.files().get_media(fileId=items[0]['id']).execute().decode('utf-8')
            idx, val = map(int, data.split('-'))
            shares_found.append((idx, val))
            print(f"   ✅ Found Share 1 (Index {idx})")
        else:
            print("   ❌ Share 1 missing.")
    except Exception as e:
        print(f"   ❌ Drive Error: {e}")

    # --- STEP 2: FETCH SUPABASE (SHARE 2) ---
    print("\n[2/3] Fetching Supabase...")
    try:
        response = supabase.table("shares").select("share_data").eq("username", username).execute()
        if response.data:
            data = response.data[0]['share_data'] # NOTE: Changed to match your column name if needed
            idx, val = map(int, data.split('-'))
            shares_found.append((idx, val))
            print(f"   ✅ Found Share 2 (Index {idx})")
        else:
            print("   ❌ Share 2 missing.")
    except Exception as e:
        print(f"   ❌ Supabase Error: {e}")

    # --- STEP 3: DECRYPT LOCAL FILE (SHARE 3) ---
    print("\n[3/3] Decrypting Local File...")
    try:
        if os.path.exists("local_share.txt"):
            with open("local_share.txt", "r") as f:
                encrypted_blob = f.read().strip()
            
            raw_bytes = base64.b64decode(encrypted_blob)
            salt, encrypted_data = raw_bytes.split(b"::", 1)
            key = derive_key(password, salt)
            f = Fernet(key)
            decrypted_data = f.decrypt(encrypted_data).decode()
            
            idx, val = map(int, decrypted_data.split('-'))
            shares_found.append((idx, val))
            print(f"   ✅ Success! Password unlocked Share 3 (Index {idx})")
        else:
            print("   ❌ 'local_share.txt' not found.")
    except Exception as e:
        print("   ❌ Failed to unlock local file. Wrong password?")

    # --- FINAL RECONSTRUCTION ---
    print("\n--- RESULTS ---")
    if len(shares_found) < 2:
        print("❌ Not enough shares to recover the secret (Need 2, found {len(shares_found)}).")
    else:
        print(f"✅ Collected {len(shares_found)} Shares. Attempting reconstruction...")
        
        # Recover using the shares we found
        secret = recover_secret(shares_found)
        
        print("\n🎉 THE GOLDEN KEY IS RECOVERED!")
        print(f"🔑 Secret Value: {secret}")
        print("(This number is the mathematical secret that was split apart!)")

if __name__ == "__main__":
    run_verification()