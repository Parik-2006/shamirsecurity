import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DownloadShare() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const localShareData = params.get('local_share');
  const goldenKey = params.get('golden_key');
  const username = params.get('username');
  let error = '';
  if (!localShareData || !goldenKey || !username) {
    error = 'Missing registration data. Please retry registration.';
  }
  // Store credentials for vault page as soon as possible
  if (username && goldenKey) {
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    localStorage.setItem('justRegistered', 'true');
  }

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
    // Credentials are now set above on every render
    // Immediately navigate to vault after download
    navigate('/vault');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Vault Share Download</h2>
        <div style={{ fontSize: 12, color: '#FFD66B', marginBottom: 8 }}>User: {username || 'N/A'}</div>
        <p style={{ fontSize: 18, marginBottom: 18, color: '#FFD66B' }}>
          <b>Why download this file?</b><br />
          <span style={{ color: '#fff', fontWeight: 400 }}>
            <br />
            <b>local_share.enc</b> is a critical part of your vault security. It is unique to your account and required to recover your vault or reset your password.<br /><br />
            <b>Keep this file safe!</b> Without it, you may lose access to your vault forever. Store it in a secure location and do not share it with anyone.<br /><br />
            You will need this file if you ever want to restore your account or access your encrypted data from a new device.
          </span>
        </p>
        {error && (
          <div style={{ color: '#ef4444', fontWeight: 600, margin: '18px 0' }}>{error}</div>
        )}
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
    </div>
  );
}
