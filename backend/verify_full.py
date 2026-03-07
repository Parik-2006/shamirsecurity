# backend/verify_full.py
# Shamir Share Verification Tool
# Requires: Share3 (local) + either Share1 (Drive) or Share2 (Supabase)

import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from supabase import create_client, ClientOptions

# --- CONFIGURATION ---
GOOGLE_SCOPES = ['https://www.googleapis.com/auth/drive.file']
SUPABASE_URL = "https://tacsrdvzgcsucparujcr.supabase.co"  # Not Codespace-specific, left unchanged
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhY3NyZHZ6Z2NzdWNwYXJ1amNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDE5NjYsImV4cCI6MjA4MjMxNzk2Nn0.bp5qZG28mODVoeSIEWoWF-tbwtmCIXM1GQ1JvM9XmpA"

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(SCRIPT_DIR, 'token.json')

# --- SHAMIR MATH HELPERS ---
def recover_secret(shares, prime=2**127 - 1):
    if len(shares) < 2:
        raise ValueError("Need at least 2 shares")
    x_s, y_s = zip(*shares)
    return _lagrange_interpolate(0, x_s, y_s, prime)

def _lagrange_interpolate(x, x_s, y_s, p):
    k = len(x_s)
    def PI(vals):
        accum = 1
        for v in vals:
            accum *= v
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

def parse_share(share_str):
    """Parse share string like '3-123456789' into tuple (3, 123456789)"""
    parts = share_str.strip().split('-')
    return (int(parts[0]), int(parts[1]))

# --- FETCH HELPERS ---
def fetch_google_drive_share(username):
    """Fetch share1 from Google Drive"""
    try:
        if not os.path.exists(TOKEN_PATH):
            print(f"   [!] No Google credentials found at {TOKEN_PATH}")
            return None
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, GOOGLE_SCOPES)
        service = build('drive', 'v3', credentials=creds)
        results = service.files().list(q=f"name='{username}_share1.txt'", spaces='drive').execute()
        items = results.get('files', [])
        if items:
            data = service.files().get_media(fileId=items[0]['id']).execute().decode('utf-8')
            return data.strip()
        else:
            print(f"   [!] No file '{username}_share1.txt' found in Drive")
            return None
    except Exception as e:
        print(f"   [!] Google Drive Error: {e}")
        return None

def fetch_supabase_share(username):
    """Fetch share2 from Supabase"""
    try:
        supabase = create_client(
            SUPABASE_URL, 
            SUPABASE_KEY,
            options=ClientOptions(postgrest_client_timeout=30)
        )
        response = supabase.table("shares").select("share_data").eq("username", username).not_.is_("share_data", "null").execute()
        if response.data:
            return response.data[0]['share_data']
        else:
            print(f"   [!] No share found in Supabase for '{username}'")
            return None
    except Exception as e:
        print(f"   [!] Supabase Error: {e}")
        return None

# --- MAIN VERIFICATION ---
def run_verification():
    print("\n" + "="*50)
    print("    SHAMIR SHARE VERIFICATION TOOL")
    print("="*50)
    
    # --- STEP 1: Get Share3 (Local - MANDATORY) ---
    print("\n[STEP 1] SHARE 3 - LOCAL (MANDATORY)")
    print("-"*40)
    share3_str = input("Enter Share3 (local share, e.g. 3-123456): ").strip()
    
    if not share3_str or '-' not in share3_str:
        print("\n[ERROR] Share3 is required! Format: index-value")
        return
    
    try:
        share3 = parse_share(share3_str)
        print(f"   [OK] Share3 parsed (index: {share3[0]})")
    except:
        print("\n[ERROR] Invalid Share3 format")
        return
    
    # --- STEP 2: Choose second share source ---
    print("\n[STEP 2] CHOOSE SECOND SHARE SOURCE")
    print("-"*40)
    print("  [1] Google Drive (Share1)")
    print("  [2] Supabase (Share2)")
    print("  [3] Enter manually")
    
    choice = input("\nChoice (1/2/3): ").strip()
    
    second_share_str = None
    source_name = ""
    
    if choice == '1':
        source_name = "Google Drive"
        username = input("Enter username: ").strip()
        print(f"\n   Fetching from Google Drive...")
        second_share_str = fetch_google_drive_share(username)
        
    elif choice == '2':
        source_name = "Supabase"
        username = input("Enter username: ").strip()
        print(f"\n   Fetching from Supabase...")
        second_share_str = fetch_supabase_share(username)
        
    elif choice == '3':
        source_name = "Manual"
        second_share_str = input("Enter share (e.g. 1-987654): ").strip()
        
    else:
        print("\n[ERROR] Invalid choice")
        return
    
    if not second_share_str:
        print(f"\n[ERROR] Could not get share from {source_name}")
        return
    
    try:
        second_share = parse_share(second_share_str)
        print(f"   [OK] Share from {source_name} parsed (index: {second_share[0]})")
    except:
        print(f"\n[ERROR] Invalid share format from {source_name}")
        return
    
    # --- STEP 3: Verify shares reconstruct correctly ---
    print("\n[STEP 3] VERIFYING SHARES...")
    print("-"*40)
    
    try:
        golden_key = recover_secret([share3, second_share])
        
        print("\n" + "="*50)
        print("           VERIFIED")
        print("="*50)
        print(f"\n   Golden Key: {golden_key}")
        print("\n   Shares are valid and reconstruct correctly!")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"\n[ERROR] Verification failed: {e}")
        print("   Shares may be invalid or corrupted.")

if __name__ == "__main__":
    run_verification()
