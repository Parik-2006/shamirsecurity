import React from 'react';
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import VaultPage from './VaultPage';

// --- Onboarding Modal (only popup) ---
// ...existing code...

// --- Dev Info Panel (shows only in development) ---
// ...existing code...

// --- Error Boundary for UI safety ---
// ...existing code...



function AboutModal({ show, onClose }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0B0D10ee', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-modal="true" role="dialog" tabIndex={-1}
    >
      <div style={{ background: '#151A21', borderRadius: 24, padding: 36, maxWidth: 480, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} aria-label="Close onboarding modal" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#FFD700', fontSize: 24, cursor: 'pointer' }}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Welcome to Shamir Vault</h2>
        <p style={{ fontSize: 18, marginBottom: 18 }}>This app uses advanced cryptography to keep your secrets safe.<br /><br />
          <b>Steps to use:</b><br />
          1. Register with a strong password<br />
          2. Complete Google authentication<br />
          3. Download and keep your <b>local_share.enc</b> safe<br />
          4. Use it to unlock your vault anytime
        </p>
        <p style={{ fontSize: 18, color: '#FFD700bb', wordBreak: 'break-word', lineHeight: 1.7, marginTop: 24, textAlign: 'center' }}>
          For feedback or bug reports, email <a href="mailto:parikshithbb.cs25@rvce.edu.in" style={{ color: '#FFD700', textDecoration: 'underline', fontSize: 18 }}>mail</a> or join our <a href="https://discord.gg/YEwrW4M2" style={{ color: '#FFD700', textDecoration: 'underline', fontSize: 18 }}>Discord</a>.
        </p>
      </div>
    </motion.div>
  );
}

// DownloadShareModal removed (popup logic eliminated)

// Global handler for WebGL context loss
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}
// removed conflict marker
// removed conflict marker

function AuthSuccessPage() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    async function notifyOpener() {
      if (regComplete) {
        // Always store reg_complete in localStorage for main tab, regardless of window.opener
        localStorage.setItem('reg_complete', regComplete);
      }
      if (window.opener && !window.opener.closed && regComplete) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_id: regComplete })
          });
          const contentType = res.headers.get('Content-Type');
          let raw = '';
          let data = null;
          try {
            raw = await res.text();
            if (raw && contentType && contentType.includes('application/json')) {
              data = JSON.parse(raw);
            }
          } catch (jsonErr) {
            data = null;
            console.error('[AuthSuccessPage] Failed to parse JSON:', jsonErr, 'Raw response:', raw);
          }
          if (data && data.status === 'success') {
            window.opener.postMessage({
              type: 'registration-complete',
              reg_complete: regComplete,
              local_share: data.local_share,
              golden_key: data.golden_key,
              username: data.username
            }, '*');
            if (window.opener && !window.opener.closed) {
              setTimeout(() => {
                window.close();
              }, 2000);
            }
          } else {
            window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete, error: data && data.message ? data.message : 'Unknown error' }, '*');
            if (window.opener && !window.opener.closed) {
              setTimeout(() => {
                window.close();
              }, 3000);
            }
          }
        } catch (err) {
          console.error('[AuthSuccessPage] Error fetching registration data:', err);
          window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete, error: err.message || 'Network error' }, '*');
          if (window.opener && !window.opener.closed) {
            setTimeout(() => {
              window.close();
            }, 3000);
          }
        }
      }
    }
    notifyOpener();
  }, []);
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 480, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Authentication Complete</h2>
        <p style={{ fontSize: 20, marginBottom: 18 }}>Authentication flow complete.<br />You may close this window or tab.</p>
        <p style={{ fontSize: 16, color: '#FFD66B99' }}>(This tab will close automatically.)</p>
      </div>
    </div>
  );
}
// removed conflict marker

  // Only show AuthSuccessPage on /auth-success route (OAuth callback)
  if (window.location.pathname.startsWith('/auth-success')) {
    return <div>Auth Success Page</div>;
  }
  // Otherwise, render documentation/verification/vault pages only
  return null;
}

// --- Registration Completion Refactor ---
// Always try to fetch registration data until we get local_share, golden_key, and username, or a clear error.
function ensureRegistrationData(regComplete, setLocalShare, setGoldenKey, setVaultUser, setShowDownloadModal, setDownloadError, maxAttempts = 5) {
  let attempts = 0;
  async function tryFetch() {
    attempts++;
    try {
      const res = await fetch(`${API_URL}/api/register/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg_id: regComplete })
      });
      const contentType = res.headers.get('Content-Type');
      let raw = '';
      let data = null;
      try {
        raw = await res.text();
        if (raw && contentType && contentType.includes('application/json')) {
          data = JSON.parse(raw);
        } else {
          throw new Error('Response is not JSON: ' + raw);
        }
      } catch (jsonErr) {
        setDownloadError('Failed to parse registration data.\n' + (jsonErr.message || jsonErr) + '\nRaw: ' + raw);
        setShowDownloadModal(true);
        return;
      }
      if (data && data.status === 'success' && data.local_share && data.golden_key && data.username) {
        setLocalShare(data.local_share);
        setGoldenKey(data.golden_key);
        setVaultUser(data.username);
        setShowDownloadModal(true);
        setDownloadError('');
      } else if (data && data.status === 'error') {
        let msg = 'Backend error: ' + (data.message || 'Unknown error.');
        setDownloadError(msg);
        setShowDownloadModal(true);
      } else if (attempts < maxAttempts) {
        setTimeout(tryFetch, 1000); // Retry after 1s
      } else {
        let msg = 'Registration complete, but failed to retrieve vault share after multiple attempts.';
        if (data && data.message) msg += '\n' + data.message;
        setDownloadError(msg);
        setShowDownloadModal(true);
      }
    } catch (err) {
      if (attempts < maxAttempts) {
        setTimeout(tryFetch, 1000);
      } else {
        setDownloadError('Network or unexpected error fetching registration data.\n' + (err.message || err));
        setShowDownloadModal(true);
      }
    }
  }
  tryFetch();
}