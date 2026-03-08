import React from 'react';
import './App.css';

// This page is for direct access after registration/download, no credential checks
export default function RegistrationVaultPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Welcome to Your Vault!</h2>
        <div style={{ color: '#FFD66B', fontWeight: 600, marginBottom: 18 }}>
          This is your registration vault page. You can now store and manage your passwords securely.<br /><br />
          <b>Note:</b> This page does not require credentials and is only shown after registration.
        </div>
        <button
          style={{
            background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s'
          }}
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
