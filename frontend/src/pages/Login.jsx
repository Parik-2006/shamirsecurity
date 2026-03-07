import React from 'react';
import CyberLogin3D from '../CyberLogin3D';

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <CyberLogin3D zIndex={1} />
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 420, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Welcome to Shamir Vault</h2>
        <p style={{ fontSize: 18, marginBottom: 18, color: '#FFD66B' }}>
          Please log in or register to access your secure vault.
        </p>
        {/* Place your login form or Google OAuth button here */}
        <button style={{ background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 12, padding: '14px 36px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s' }}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
