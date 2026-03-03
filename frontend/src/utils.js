// frontend/src/utils.js
export function getErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.toString) return err.toString();
  try { return JSON.stringify(err); } catch { return String(err); }
}

export function safeJSONParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

// --- Web Crypto helpers for PBKDF2 and AES-GCM ---
export async function deriveKeyPBKDF2(password, salt, iterations = 100000) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptAESGCM(plaintext, password) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyPBKDF2(password, salt);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  // Format: [salt (16)] + [iv (12)] + [ciphertext]
  const out = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return out;
}

export async function decryptAESGCM(encBytes, password) {
  const salt = encBytes.slice(0, 16);
  const iv = encBytes.slice(16, 28);
  const ciphertext = encBytes.slice(28);
  const key = await deriveKeyPBKDF2(password, salt);
  const plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plaintext);
}

export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
