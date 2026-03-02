# backend/verify_local.py
import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

def derive_key(password, salt):
    """Regenerates the Key from the Password + Salt"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def test_password():
    print("--- MASTER PASSWORD VERIFIER ---")
    print("This tool checks if a password can unlock a local encrypted file.")
    
    # 1. Input the Encrypted Blob
    encrypted_blob = input("\nPaste the 'local_share' string here: ").strip()
    
    # Remove quotes if the user pasted them accidentally
    if encrypted_blob.startswith('"') and encrypted_blob.endswith('"'):
        encrypted_blob = encrypted_blob[1:-1]

    # 2. Input the Password to Test
    password_guess = input("Enter the Master Password to test: ")

    try:
        # 3. Decode the Package (Separate Salt from Data)
        # The app stores it as Base64( Salt + "::" + EncryptedData )
        raw_bytes = base64.b64decode(encrypted_blob)
        
        if b"::" not in raw_bytes:
            print("\n❌ ERROR: Invalid format. This is not a valid local share.")
            return

        salt, encrypted_data = raw_bytes.split(b"::", 1)

        # 4. Generate Key from the Guess Password
        key = derive_key(password_guess, salt)
        f = Fernet(key)

        # 5. Attempt Decryption
        decrypted_secret = f.decrypt(encrypted_data).decode()
        
        print("\n✅ SUCCESS! PASSWORD IS CORRECT.")
        print(f"🔓 The Encrypted File contained Share 3: {decrypted_secret}")
        print("(This proves your password unlocked the file.)")

    except Exception as e:
        print("\n❌ FAILED. Wrong Password.")
        print("The lock refused to open.")

if __name__ == "__main__":
    test_password()