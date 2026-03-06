import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

// Global API URL for all API calls
const API_URL = import.meta.env.VITE_API_URL;
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import FloatingShapes from './FloatingShapes';
import CyberLogin3D from './CyberLogin3D';
import VaultPage from './VaultPage';

// --- Onboarding Modal (only popup) ---
// ...existing code...

// --- Dev Info Panel (shows only in development) ---
// ...existing code...

// --- Error Boundary for UI safety ---
// ...existing code...

// --- Top Navigation with 3D Buttons ---
const TopRightNav = ({ onNavigate }) => {
  const btn3D = {
    background: 'linear-gradient(145deg, #151A21 60%, #23272f 100%)',
    color: '#FFD700',
    border: '2.5px solid #FFD700',
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 15,
    padding: '12px 28px',
    margin: 0,
    boxShadow: '4px 4px 16px #0a192f99, -4px -4px 16px #23272f55, 0 2px 8px #FFD70033',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
    textShadow: '0 2px 8px #FFD70044',
    letterSpacing: 0.7,
    minWidth: 0,
    minHeight: 0,
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    perspective: 400,
    transformStyle: 'preserve-3d',
  };
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <button onClick={() => onNavigate('documentation')} style={btn3D}>
        <span style={{ color: '#FFD700' }}>Documentation</span>
      </button>
      <button onClick={() => onNavigate('verification')} style={btn3D}>
        <span style={{ color: '#FFD700' }}>Verification</span>
      </button>
      <button onClick={() => onNavigate('about')} style={btn3D}>
        <span style={{ color: '#FFD700' }}>About</span>
      </button>
    </div>
  );
};

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

function DownloadShareModal({ show, onDownload, onClose }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0B0D10ee', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-modal="true" role="dialog" tabIndex={-1}
    >
      <div style={{ background: '#151A21', borderRadius: 24, padding: 36, maxWidth: 420, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} aria-label="Close download modal" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#FFD700', fontSize: 24, cursor: 'pointer' }}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 18 }}>Download Your Vault Share</h2>
        <p style={{ fontSize: 17, marginBottom: 24 }}>Click below to download your <b>local_share.enc</b> file. <br />Keep it safe! You need it to unlock your vault.</p>
        <button
          style={{
            marginTop: 8,
            padding: '14px 32px',
            fontSize: 18,
            fontWeight: 700,
            background: '#FFD66B',
            color: '#151A21',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #FFD66B33',
          }}
          onClick={onDownload}
        >
          Download local_share.enc
        </button>
      </div>
    </motion.div>
  );
}

// Global handler for WebGL context loss
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}
<<<<<<< HEAD
=======

function AuthSuccessPage() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    // Always try to notify opener
    if (window.opener) {
      window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete }, '*');
    }
    // Always close after delay
    setTimeout(() => {
      window.close();
    }, 2000);
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
>>>>>>> parik4

export default function App() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [vaultUser, setVaultUser] = useState(null);
  const [vaultPage, setVaultPage] = useState(false);
  const [localShare, setLocalShare] = useState(null);
  // Show About modal only once per session
  const [showAbout, setShowAbout] = useState(() => {
    const seen = sessionStorage.getItem('about_seen');
    return !seen;
  });
  // State to trigger add password mode after registration
  // const [openVaultAdd, setOpenVaultAdd] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);


  // Step 1: Start registration, get Google OAuth URL
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const res = await fetch(`${API_URL}/api/register/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const contentType = res.headers.get('Content-Type');
      let raw = '';
      let data = null;
      try {
        raw = await res.text();
        if (raw && contentType && contentType.includes('application/json')) {
          data = JSON.parse(raw);
        } else {
          data = null;
        }
      } catch (jsonErr) {
        data = null;
        console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
      }
      if (data && data.auth_url) {
        setSuccess('Redirecting to Google sign-in...');
        window.open(data.auth_url, '_blank', 'noopener,noreferrer'); // Open Google sign-in in new tab
        return;
      }
      console.error('Backend response:', raw);
      if (data && data.message) {
        setError('Vault creation failed: ' + data.message);
      } else if (raw) {
        setError('Vault creation failed. Backend says: ' + raw);
      } else {
        setError('Vault creation failed. No response from backend.');
      }
    } catch {
      setError('Could not connect to the server. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: After Google OAuth, complete registration and download local_share
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
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
          } catch (jsonErr) {
            data = null;
            console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
          }
          return data;
        })
        .then(data => {
          if (data && data.status === 'success') {
            // If in popup, notify opener and show close message
            if (window.opener) {
              window.opener.postMessage({ type: 'registration-complete', local_share: data.local_share, golden_key: data.golden_key, username: data.username }, '*');
              setSuccess('Authentication flow complete. You may close this tab.');
            } else {
              setSuccess('Authentication flow complete. You may close this tab or window.');
              setLocalShare(data.local_share);
              setGoldenKey(data.golden_key);
              setVaultUser(data.username);
              setShowDownloadModal(true);
            }
          } else {
            setError((data && data.message) || 'Vault creation failed.');
          }
        });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Listen for registration-complete message from popup
  React.useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === 'registration-complete') {
<<<<<<< HEAD
        setLocalShare(event.data.local_share);
        setGoldenKey(event.data.golden_key);
        setVaultUser(event.data.username);
        setShowDownloadModal(true);
=======
        // If local_share/golden_key/username are present, use them; otherwise, trigger fetch
        if (event.data.local_share && event.data.golden_key && event.data.username) {
          setLocalShare(event.data.local_share);
          setGoldenKey(event.data.golden_key);
          setVaultUser(event.data.username);
          setShowDownloadModal(true);
        } else if (event.data.reg_complete) {
          // Fetch registration completion if only reg_complete is sent
          fetch(`${API_URL}/api/register/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_id: event.data.reg_complete })
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
              } catch (jsonErr) {
                data = null;
                console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
              }
              return data;
            })
            .then(data => {
              if (data && data.status === 'success') {
                setLocalShare(data.local_share);
                setGoldenKey(data.golden_key);
                setVaultUser(data.username);
                setShowDownloadModal(true);
              }
            });
        }
>>>>>>> parik4
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Step 3: Unlock vault (user uploads local_share.enc)
  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password || !localShare) {
        setError('Please enter username, password, and upload your local_share.enc file.'); setLoading(false); return;
      }
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare })
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
        console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
      }
      if (data && data.status === 'success') {
        setGoldenKey(data.golden_key);
        setVaultUser(username);
        setVaultPage(true);
        setSuccess('Vault unlocked!');
      } else {
        setError((data && data.message) || 'Unlock failed.');
      }
    } catch {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (target) => {
    if (target === 'about') {
      setShowAbout(true);
      sessionStorage.setItem('about_seen', '1');
    } else {
      setPage(target);
    }
  };

<<<<<<< HEAD
=======

  // Render AuthSuccessPage if on /auth-success route (with or without query params)
  if (window.location.pathname.startsWith('/auth-success')) {
    return <AuthSuccessPage />;
  }

>>>>>>> parik4
  if (vaultPage && goldenKey && vaultUser) {
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); }} />;
  }

  // Handler for downloading local_share.enc from modal
  const handleDownloadShare = () => {
    if (localShare) {
      const blob = new Blob([localShare], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'local_share.enc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShowDownloadModal(false);
      // After download, go to vault page
      setVaultPage(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
      {(page === 'login' || page === 'verification') && (
        <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
          <TopRightNav onNavigate={handleNavigate} />
        </div>
      )}
      <AnimatePresence mode="wait">
        {showAbout && <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />}
        {page === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            <CyberLogin3D zIndex={2} />
            <div style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', background: '#151A21', borderRadius: 28, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 8, gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', height: 40, marginRight: 6 }}>
                  <svg width="38" height="38" viewBox="0 0 54 64" fill="none" style={{ display: 'block', verticalAlign: 'middle' }}>
                    <rect x="7" y="28" width="40" height="28" rx="8" fill="#FFD700" stroke="#FFF8DC" strokeWidth="3" />
                    <rect x="20" y="38" width="14" height="10" rx="5" fill="#FFF8DC" />
                    <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#FFD700" strokeWidth="3" fill="none" />
                  </svg>
                </span>
                <h1 className="floating" style={{ color: '#FFD66B', fontWeight: 800, fontSize: 40, textAlign: 'center', margin: 0, letterSpacing: 1.2, textShadow: '0 2px 6px #FFD66B55', lineHeight: 1, verticalAlign: 'middle' }}>Shamir Vault</h1>
              </div>
              <p style={{ color: '#FFD66B', fontSize: '1.1rem', textAlign: 'center', marginBottom: 28, letterSpacing: 0.7, textShadow: '0 1px 4px #FFD66B44' }}>
                Secure Multi-Key Secret Management
              </p>
              <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="text"
                  id="login-username"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: 17,
                    borderRadius: 10,
                    border: '1.5px solid #23272f',
                    marginBottom: 14,
                    background: '#181c20',
                    color: '#eaf6fb',
                    outline: 'none',
                  }}
                />
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Master Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: 17,
                    borderRadius: 10,
                    border: '1.5px solid #23272f',
                    background: '#181c20',
                    color: '#eaf6fb',
                    outline: 'none',
                    marginBottom: 22,
                  }}
                />
                <button
                  className="floating"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: 20,
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #23272f 60%, #151A21 100%)',
                    color: '#FFD66B',
                    border: '2px solid #23272f',
                    borderRadius: 14,
                    cursor: 'pointer',
                    marginBottom: 18,
                    boxShadow: '0 2px 8px #23272f55',
                    letterSpacing: 1.1,
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                    textShadow: '0 2px 8px #FFD66B33',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onClick={handleCreateVault}
                  disabled={loading}
                >
                  Create New Vault
                </button>
                <button
                  className="floating"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: 20,
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #23272f 60%, #151A21 100%)',
                    color: '#FFD66B',
                    border: '2px solid #23272f',
                    borderRadius: 14,
                    cursor: 'pointer',
                    marginBottom: 8,
                    boxShadow: '0 2px 8px #23272f55',
                    letterSpacing: 1.1,
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                    textShadow: '0 2px 8px #FFD66B33',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onClick={handleUnlockVault}
                  disabled={loading}
                >
                  Unlock Vault
                </button>
                {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{error}</div>}
                {success && <div style={{ color: '#FFD66B', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
                {/* Download button now appears in modal only */}
              </div>
            </div>
          </motion.div>
        )}
        {page === 'documentation' && (
          <motion.div
            key="documentation"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ width: '100%', height: '100%' }}
          >
            <Documentation onBack={() => setPage('login')} />
          </motion.div>
        )}
        {page === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ width: '100%', height: '100%' }}
          >
            <Verification onBack={() => setPage('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}