import React, { useState } from 'react';

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
      // Call backend to verify using username, password, and localShare
      // Backend should try both Supabase and Drive shares, whichever is fastest
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com'}/api/login`, {
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
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="cyber-card" style={{ maxWidth: 520, width: '90vw', textAlign: 'center', position: 'relative' }}>
        <h2 className="cyber-glow" style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Unlock Vault</h2>
        <p style={{ color: '#00ffe7', fontSize: 18, marginBottom: 18 }}>
          Please upload your <b>local_share.enc</b> file to unlock your vault.
        </p>
        <input type="file" accept=".enc,.txt" onChange={handleFileChange} style={{ marginBottom: 18, borderRadius: 8, border: '1.5px solid #00ffe7', background: '#10141a', color: '#00ffe7', fontWeight: 600 }} />
        <br />
        <button
          className="cyber-btn"
          onClick={handleUnlock}
          disabled={loading || !localShare}
          style={{ marginTop: 18, fontSize: 20, padding: '14px 36px', opacity: loading || !localShare ? 0.6 : 1 }}
        >
          {loading ? 'Verifying...' : 'Unlock Vault'}
        </button>
        <button className="cyber-btn" onClick={onBack} style={{ marginLeft: 16, background: 'transparent', color: '#00ffe7', border: '2px solid #00ffe7', fontWeight: 700, fontSize: 16 }}>Back</button>
        {error && <div style={{ color: '#ef4444', fontWeight: 600, margin: '18px 0' }}>{error}</div>}
      </div>
    </div>
  );
}
