<<<<<<< HEAD
// UnlockWithShare.jsx
// Restored: Handles uploading the user's share after login
import React, { useRef, useState } from 'react';
import { API_URL } from './config';
=======
import React, { useState } from 'react';
>>>>>>> copy_parik2

export default function UnlockWithShare({ username, password, onUnlock, onBack }) {
  const [localShare, setLocalShare] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setLocalShare(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleUnlock = async () => {
    setError('');
    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await fetch(`${API_URL}/api/login`, {
=======
      // Call backend to verify using username, password, and localShare
      // Backend should try both Supabase and Drive shares, whichever is fastest
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com'}/api/login`, {
>>>>>>> copy_parik2
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare })
      });
      const data = await res.json();
      if (data.status === 'success') {
        onUnlock(data.golden_key, username);
      } else {
        setError(data.message || 'Unlock failed.');
      }
    } catch (e) {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Unlock Vault</h2>
        <p style={{ color: '#FFD66B', fontSize: 18, marginBottom: 18 }}>
          Please upload your <b>local_share.enc</b> file to unlock your vault.
        </p>
        <input type="file" accept=".enc,.txt" onChange={handleFileChange} style={{ marginBottom: 18 }} />
        <br />
        <button
          onClick={handleUnlock}
          disabled={loading || !localShare}
          style={{ background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 12, padding: '14px 36px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s', opacity: loading || !localShare ? 0.6 : 1 }}
        >
          {loading ? 'Verifying...' : 'Unlock Vault'}
        </button>
        <button onClick={onBack} style={{ marginLeft: 16, background: 'transparent', color: '#FFD66B', border: '2px solid #FFD66B', borderRadius: 12, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Back</button>
        {error && <div style={{ color: '#ef4444', fontWeight: 600, margin: '18px 0' }}>{error}</div>}
      </div>
=======
    <div className="modern-card" style={{ maxWidth: 520, width: '90vw', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Unlock Vault</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 18 }}>
        Please upload your <b>local_share.enc</b> file to unlock your vault.
      </p>
      <input type="file" accept=".enc,.txt" onChange={handleFileChange} className="modern-input" style={{ marginBottom: 18 }} />
      <br />
      <button
        className="modern-btn"
        onClick={handleUnlock}
        disabled={loading || !localShare}
        style={{ marginTop: 18, opacity: loading || !localShare ? 0.6 : 1 }}
      >
        {loading ? 'Verifying...' : 'Unlock Vault'}
      </button>
      <button className="modern-btn" style={{ background: 'transparent', color: 'var(--cyan)', border: '2px solid var(--cyan)', marginLeft: 16 }} onClick={onBack}>
        Back
      </button>
      {error && <div className="modern-error" style={{ margin: '18px 0' }}>{error}</div>}
>>>>>>> copy_parik2
    </div>
  );
}
