// Minimal test button for window.open
function TestWindowOpen() {
  return (
    <button
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: 16, background: '#FFD700', color: '#151A21', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 18, boxShadow: '0 2px 8px #FFD66B33', cursor: 'pointer', letterSpacing: 1.1 }}
      onClick={() => window.open('https://accounts.google.com/', '_blank', 'noopener,noreferrer')}
    >
      TEST window.open
    </button>
  );
}
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

  // ...existing code...
  // (Insert the full, latest App.jsx code from parik4 branch here, as already read above)
      </div>
    </div>
  );
}
// removed conflict marker

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
  const [showLocalShareStep, setShowLocalShareStep] = useState(false);
  // Show About modal only once per session
  const [showAbout, setShowAbout] = useState(() => {
    const seen = sessionStorage.getItem('about_seen');
    return !seen;
  });
  // State to trigger add password mode after registration
  // const [openVaultAdd, setOpenVaultAdd] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);


<<<<<<< HEAD
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
        {page === 'login' && !showLocalShareStep && (
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Show local_share upload if credentials valid */}
        {page === 'login' && showLocalShareStep && (
          <motion.div
            key="localshare"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            <CyberLogin3D zIndex={2} />
            <div style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', background: '#151A21', borderRadius: 28, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
              <h2 style={{ color: '#FFD66B', fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 18 }}>Upload Your local_share.enc</h2>
              <input
                type="file"
                accept=".enc,.txt"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setLocalShare(ev.target.result);
                    reader.readAsText(file);
                  }
                }}
                style={{ marginBottom: 18 }}
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
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #23272f55',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  textShadow: '0 2px 8px #FFD66B33',
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={handleLocalShareUpload}
                disabled={loading}
              >
                Unlock Vault
              </button>
              <button
                style={{ marginTop: 10, color: '#FFD66B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}
                onClick={() => { setShowLocalShareStep(false); setLocalShare(null); setError(''); setSuccess(''); }}
              >
                &larr; Back to Login
              </button>
              {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{error}</div>}
              {success && <div style={{ color: '#FFD66B', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
            </div>
          </motion.div>
        )}
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
                onClick={() => setPage('verification')}
                disabled={loading}
              >
                Unlock Existing Vault
              </button>
              {error && <div style={{ color: '#ff4d4f', marginTop: 8, fontWeight: 700 }}>{error}</div>}
              {success && <div style={{ color: '#00e676', marginTop: 8, fontWeight: 700 }}>{success}</div>}
            </div>
          </motion.div>
        )}
        {page === 'verification' && (
          <Verification
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            setVaultPage={setVaultPage}
            setGoldenKey={setGoldenKey}
=======
  // Step 1: Start registration, get Google OAuth URL
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const res = await fetch(`${API_BASE}/api/register/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const contentType = res.headers.get('Content-Type');
      let raw = '';
      let data = null;
      if (!res.ok) {
        // Try to get text for error
        try {
          raw = await res.text();
        } catch (e) {
          raw = '';
        }
        setError('Server error: ' + (raw || res.statusText));
        setLoading(false);
        return;
      }
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
        setSuccess('Opening Google sign-in...');
        const win = window.open(data.auth_url, '_blank');
        if (!win) {
          window.location.href = data.auth_url;
        }
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
    } catch (e) {
      setError('Network error: ' + (e?.message || e?.toString() || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: After Google OAuth, complete registration and download local_share
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      fetch(`${API_BASE}/api/register/complete`, {
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
            setSuccess('Vault created! Download your local share.');
            setLocalShare(data.local_share);
            setGoldenKey(data.golden_key);
            setVaultUser(data.username);
            setShowDownloadModal(true); // Show modal for download
          } else {
            setError((data && data.message) || 'Vault creation failed.');
          }
        });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Step 3a: Validate username/password only
  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
>>>>>>> 3cc3c33 (feat: two-step unlock vault flow (username/password, then local_share.enc))
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
<<<<<<< HEAD
      const res = await fetch(`${API_URL}/api/login`, {
=======
      // Try to fetch share2 from backend to check if user exists and password is correct (simulate login)
      const res = await fetch(`${API_BASE}/api/check_credentials`, {
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
        }
      } catch (jsonErr) {
        data = null;
        console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
      }
      if (data && data.status === 'success') {
        setShowLocalShareStep(true);
        setSuccess('Credentials valid! Please upload your local_share.enc file.');
      } else {
        setError((data && data.message) || 'Invalid username or password.');
      }
    } catch (e) {
      setError('Network error validating credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3b: After credentials, upload local_share.enc to unlock vault
  const handleLocalShareUpload = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!localShare) {
        setError('Please upload your local_share.enc file.'); setLoading(false); return;
      }
      const res = await fetch(`${API_BASE}/api/login`, {
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
    } catch (e) {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };
  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
<<<<<<< HEAD
=======
      // Try to fetch share2 from backend to check if user exists and password is correct (simulate login)
      const res = await fetch(`${API_BASE}/api/check_credentials`, {
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
        }
      } catch (jsonErr) {
        data = null;
        console.error('Failed to parse JSON:', jsonErr, 'Raw response:', raw);
      }
      if (data && data.status === 'success') {
        setShowLocalShareStep(true);
        setSuccess('Credentials valid! Please upload your local_share.enc file.');
      } else {
        setError((data && data.message) || 'Invalid username or password.');
      }
    } catch (e) {
      setError('Network error validating credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3b: After credentials, upload local_share.enc to unlock vault
  const handleLocalShareUpload = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!localShare) {
        setError('Please upload your local_share.enc file.'); setLoading(false); return;
      }
>>>>>>> 13b2684 (feat: two-step unlock vault flow (username/password, then local_share.enc))
      const res = await fetch(`${API_BASE}/api/login`, {
>>>>>>> 3cc3c33 (feat: two-step unlock vault flow (username/password, then local_share.enc))
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

  // Only show AuthSuccessPage on /auth-success route (OAuth callback)
  if (window.location.pathname.startsWith('/auth-success')) {
    return <AuthSuccessPage />;
  }
  // Otherwise, render the normal app (login page, etc.)
  if (vaultPage && goldenKey && vaultUser) {
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); setShowLocalShareStep(false); setLocalShare(null); }} />;
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
<<<<<<< HEAD
                  id="login-username"
                  name="username"
=======
<<<<<<< HEAD
>>>>>>> 3cc3c33 (feat: two-step unlock vault flow (username/password, then local_share.enc))
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
=======
                  id="login-username"
                  {page === 'login' && !showLocalShareStep && (
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
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Show local_share upload if credentials valid */}
                  {page === 'login' && showLocalShareStep && (
                    <motion.div
                      key="localshare"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.6, ease: 'anticipate' }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
                    >
                      <CyberLogin3D zIndex={2} />
                      <div style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', background: '#151A21', borderRadius: 28, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
                        <h2 style={{ color: '#FFD66B', fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 18 }}>Upload Your local_share.enc</h2>
                        <input
                          type="file"
                          accept=".enc,.txt"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = ev => setLocalShare(ev.target.result);
                              reader.readAsText(file);
                            }
                          }}
                          style={{ marginBottom: 18 }}
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
                            marginBottom: 8,
                            boxShadow: '0 2px 8px #23272f55',
                            letterSpacing: 1.1,
                            transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                            textShadow: '0 2px 8px #FFD66B33',
                            opacity: loading ? 0.7 : 1,
                          }}
                          onClick={handleLocalShareUpload}
                          disabled={loading}
                        >
                          Unlock Vault
                        </button>
                        <button
                          style={{ marginTop: 10, color: '#FFD66B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}
                          onClick={() => { setShowLocalShareStep(false); setLocalShare(null); setError(''); setSuccess(''); }}
                        >
                          &larr; Back to Login
                        </button>
                        {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{error}</div>}
                        {success && <div style={{ color: '#FFD66B', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
                      </div>
                    </motion.div>
                  )}
>>>>>>> 13b2684 (feat: two-step unlock vault flow (username/password, then local_share.enc))
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}