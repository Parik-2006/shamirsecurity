import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DownloadShare() {
  const [showAuthComplete, setShowAuthComplete] = useState(true);
  // Defensive: check for window and location
  if (typeof window === 'undefined' || !window.location) {
    return <div style={{ color: 'red', padding: 40 }}>Error: Environment not supported.</div>;
  }
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [localShareData, setLocalShareData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regComplete = params.get('reg_complete');
    if (!regComplete) {
      // cleaned up
      setTimeout(() => {
        setError('Missing registration completion token.');
      }, 0);
      return;
    } else {
      // cleaned up
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/register/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reg_id: regComplete })
    })
      .then(async res => {
        const contentType = res.headers.get('Content-Type');
        let raw = '';
        let data = null;
        try {
          raw = await res.text();
          if (raw && contentType && contentType.includes('application/json')) {
            data = JSON.parse(raw);
          }
        } catch {
          data = null;
          // cleaned up
        }
        return data;
      })
      .then(data => {
        if (data && data.status === 'success' && data.local_share) {
          setLocalShareData(data.local_share);
          // cleaned up
        } else {
          setError((data && data.message) || 'Failed to retrieve vault share.');
          // cleaned up
        }
      })
      .catch(() => {
        setError('Network error while fetching vault share.');
        // cleaned up
      });
  }, [location]);

  const handleDownload = () => {
    if (!localShareData) return;
    setDownloading(true);
    const blob = new Blob([localShareData], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'local_share.enc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloading(false);
    setDownloaded(true);
    // Immediately navigate to vault after download
    navigate('/vault');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showAuthComplete && (
        <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 480, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Authentication Complete</h2>
          <p style={{ fontSize: 20, marginBottom: 18 }}>Google authentication flow complete.<br />You may close this window.</p>
          <button onClick={() => setShowAuthComplete(false)} style={{ marginTop: 24, background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', cursor: 'pointer', boxShadow: '0 2px 12px #0006' }}>Continue</button>
        </div>
      )}
      {!showAuthComplete && (
        <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Vault Share Download</h2>
          <p style={{ fontSize: 18, marginBottom: 18, color: '#FFD66B' }}>
            <b>Why download this file?</b><br />
            <span style={{ color: '#fff', fontWeight: 400 }}>
              <br />
              <b>local_share.enc</b> is a critical part of your vault security. It is unique to your account and required to recover your vault or reset your password.<br /><br />
              <b>Keep this file safe!</b> Without it, you may lose access to your vault forever. Store it in a secure location and do not share it with anyone.<br /><br />
              You will need this file if you ever want to restore your account or access your encrypted data from a new device.
            </span>
          </p>
          {error && <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>}
          {!error && !downloaded && localShareData && (
            <button
              onClick={handleDownload}
              style={{
                background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 12, padding: '14px 36px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s'
              }}
              disabled={downloading}
            >
              {downloading ? 'Preparing Download...' : 'Download local_share.enc'}
            </button>
          )}
          {downloaded && !error && (
            <p style={{ color: '#FFD66B', fontWeight: 600, marginTop: 18 }}>Download started! Redirecting to your vault...</p>
          )}
        </div>
      )}
    </div>
  );
}
