import React, { useState } from 'react';
// DEBUG: Log component mount
console.log('[DownloadShare] Component loaded');
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';


export default function DownloadShare() {
<<<<<<< HEAD
  const [error, setError] = useState('');
=======
>>>>>>> copy_parik2
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
  // Defensive: check for window and location
  // All hooks must be called before any return


  useEffect(() => {
    if (typeof window === 'undefined' || !window.location) return;
    const params = new URLSearchParams(location.search);
    const regComplete = params.get('reg_complete');
    if (!regComplete) {
      setTimeout(() => {
        setError('Missing registration completion token.');
      }, 0);
      return;
    }
    fetch(`${API_URL}/api/register/complete`, {
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
        }
        return data;
      })
      .then(data => {
        if (data && data.status === 'success' && data.local_share) {
          setLocalShareData(data.local_share);
        } else {
          setError((data && data.message) || 'Failed to retrieve vault share.');
        }
      })
      .catch(() => {
        setError('Network error while fetching vault share.');
      });
  }, [location]);
=======
  const params = new URLSearchParams(location.search);
  console.log('[DownloadShare] location.pathname:', location.pathname, 'location.search:', location.search);
  const localShareData = params.get('local_share');
  const goldenKey = params.get('golden_key');
  const username = params.get('username');
  let error = '';
  if (!localShareData || !goldenKey || !username) {
    error = 'Missing registration data. Please retry registration.';
    console.warn('[DownloadShare] Missing registration data:', { localShareData, goldenKey, username });
  }
  // Store credentials for vault page as soon as possible
  if (username && goldenKey) {
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    localStorage.setItem('justRegistered', 'true');
    console.log('[DownloadShare] Setting vaultUser:', username, 'goldenKey:', goldenKey);
    console.log('[DownloadShare] localStorage after set:', localStorage.getItem('vaultUser'), localStorage.getItem('goldenKey'));
  }
>>>>>>> copy_parik2

  if (typeof window === 'undefined' || !window.location) {
    return <div style={{ color: 'red', padding: 40 }}>Error: Environment not supported.</div>;
  }

  const handleDownload = () => {
    console.log('[DownloadShare] Download button clicked');
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
    // Immediately navigate to registration vault page after download (SPA navigation)
    console.log('[DownloadShare] Navigating to /registration-vault');
    navigate('/registration-vault', { replace: true });
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
        {/* After download, user is immediately redirected. No post-download UI. */}
      </div>
    </div>
  );
}
