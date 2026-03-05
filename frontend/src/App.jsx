// frontend/src/App.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';
import CyberLogin3D from './CyberLogin3D';
import VaultPage from './VaultPage';



function TopRightNav({ onNavigate }) {
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
    </div>
  );
}



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
  // Registration ID logic removed (setRegId not used)
  const [localShare, setLocalShare] = useState(null);
  // const fileInputRef = useRef(); // No longer used

  const handleNavigate = (target) => setPage(target);

  // Step 1: Start registration, get Google OAuth URL
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const res = await fetch('/api/register/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'redirect' && data.auth_url && data.reg_id) {
        setSuccess('Redirecting to Google for authentication...');
        window.location.href = data.auth_url;
      } else {
        setError(data.message || 'Vault creation failed.');
      }
    } catch {
      setError('Network error creating vault.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: After Google OAuth, complete registration and download local_share
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      // Call backend to get local_share and golden_key
      fetch('/api/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg_id: regComplete })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setSuccess('Vault created! Download your local share.');
            setLocalShare(data.local_share);
            setGoldenKey(data.golden_key);
            setVaultUser(data.username);
            // Download local_share.enc
            const blob = new Blob([data.local_share], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'local_share.enc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            setError(data.message || 'Vault creation failed.');
          }
        });
      // Remove query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Step 3: Unlock vault (user uploads local_share.enc)
  // const handleLocalShareUpload = (e) => { /* removed with file upload */ };

  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password || !localShare) {
        setError('Please enter username, password, and upload your local_share.enc file.'); setLoading(false); return;
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setVaultUser(username);
        setVaultPage(true);
        setSuccess('Vault unlocked!');
      } else {
        setError(data.message || 'Unlock failed.');
      }
    } catch {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  if (vaultPage && goldenKey && vaultUser) {
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); }} />;
  }
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
      {(page === 'login' || page === 'verification') && (
        <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
          <TopRightNav onNavigate={handleNavigate} />
        </div>
      )}
      <AnimatePresence mode="wait">
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 24, gap: 18, flexWrap: 'nowrap' }}>
                {/* 3D Lock SVG Logo */}
                <motion.svg
                  width="48" height="48" viewBox="0 0 54 64" fill="none"
                  style={{ marginRight: 10, verticalAlign: 'middle', display: 'inline-block', flexShrink: 0 }}
                  initial={{ rotate: 0, scale: 1 }}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <defs>
                    <radialGradient id="lock3dGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0.7" />
                    </radialGradient>
                  </defs>
                  <rect x="7" y="28" width="40" height="28" rx="8" fill="url(#lock3dGlow)" stroke="#FFD700" strokeWidth="3" />
                  <rect x="20" y="38" width="14" height="10" rx="5" fill="#FFF8DC" />
                  <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#FFD700" strokeWidth="3" fill="none" />
                  {/* 3D effect: shadow and highlight */}
                  <ellipse cx="27" cy="54" rx="12" ry="4" fill="#FFD70033" />
                  <ellipse cx="27" cy="32" rx="10" ry="3" fill="#FFF8DC44" />
                </motion.svg>
                <h1 className="floating" style={{ color: '#FFD66B', fontWeight: 800, fontSize: 38, textAlign: 'center', margin: 0, letterSpacing: 1.2, textShadow: '0 2px 6px #FFD66B55', lineHeight: 1, verticalAlign: 'middle', display: 'inline-block', whiteSpace: 'nowrap' }}>Shamir Vault</h1>
              </div>
              <p style={{ color: '#FFD66B', fontSize: '1.1rem', textAlign: 'center', marginBottom: 28, letterSpacing: 0.7, textShadow: '0 1px 4px #FFD66B44' }}>
                Secure Multi-Key Secret Management
              </p>
              <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Username"
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
                  placeholder="Master Password"
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
                    width: '95%',
                    padding: '12px',
                    fontSize: 16,
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #23272f 60%, #151A21 100%)',
                    color: '#FFD66B',
                    border: '2px solid #23272f',
                    borderRadius: 14,
                    cursor: 'pointer',
                    marginBottom: 14,
                    boxShadow: '0 2px 8px #23272f55',
                    letterSpacing: 1.1,
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                    textShadow: '0 2px 8px #FFD66B33',
                  }}
                  onClick={handleCreateVault}
                  disabled={loading}
                >
                  Create New Vault
                </button>
                <button
                  className="floating"
                  style={{
                    width: '95%',
                    padding: '12px',
                    fontSize: 16,
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
                  }}
                  onClick={handleUnlockVault}
                  disabled={loading}
                >
                  Unlock Vault
                </button>
                {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{error}</div>}
                {success && <div style={{ color: '#FFD66B', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
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