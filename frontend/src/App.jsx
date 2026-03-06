import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';
import CyberLogin3D from './CyberLogin3D';
import VaultPage from './VaultPage';

// --- Utility: Password Strength Meter ---
function getPasswordStrength(password) {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function PasswordStrengthBar({ password }) {
  const score = getPasswordStrength(password);
  const colors = ['#ef4444', '#f59e42', '#f7e13e', '#a3e635', '#22c55e'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div style={{ width: '100%', marginBottom: 8 }}>
      <div style={{ height: 8, borderRadius: 4, background: '#23272f', overflow: 'hidden', marginBottom: 2 }}>
        <div style={{ width: `${score * 20}%`, height: '100%', background: colors[score - 1] || '#23272f', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, color: colors[score - 1] || '#888', fontWeight: 600 }}>{password ? labels[score - 1] || 'Too Short' : ''}</span>
    </div>
  );
}

// --- Tooltip Component ---
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', background: '#23272f', color: '#FFD700', padding: '6px 12px', borderRadius: 8, fontSize: 13, whiteSpace: 'nowrap', zIndex: 100, boxShadow: '0 2px 8px #23272f88' }}>{text}</span>
      )}
    </span>
  );
}

// --- Top Navigation with 3D Buttons ---
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
      <Tooltip text="Read the full documentation."><button onClick={() => onNavigate('documentation')} style={btn3D}>Documentation</button></Tooltip>
      <Tooltip text="Verify your vault integrity."><button onClick={() => onNavigate('verification')} style={btn3D}>Verification</button></Tooltip>
    </div>
  );
}

// --- Loading Skeleton ---
function LoadingSkeleton({ width = '100%', height = 24, style = {} }) {
  return <div style={{ width, height, background: '#23272f', borderRadius: 8, marginBottom: 8, ...style, animation: 'pulse 1.2s infinite alternate' }} />;
}

// --- About Modal ---
function AboutModal(props) {
  const { show, onClose } = props;
  function handleClose() {
    if (typeof onClose === 'function') {
      onClose();
    }
  }
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
        <button onClick={handleClose} aria-label="Close about modal" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#FFD700', fontSize: 24, cursor: 'pointer' }}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>About Shamir Vault</h2>
        <p style={{ fontSize: 18, marginBottom: 18 }}>
          Shamir Vault is a secure, open-source secret management app using advanced cryptography and multi-party computation.<br /><br />
          <b>Version:</b> 1.0.0<br />
          <b>Maintainer:</b> Parik-2006
        </p>
        <p style={{ fontSize: 15, color: '#FFD700bb' }}>For feedback or bug reports, see the Contact Support section.</p>
      </div>
    </motion.div>
  );
}

// --- Contact Support Section ---
function ContactSupport() {
  return (
    <div style={{ marginTop: 18, background: '#23272f', borderRadius: 12, padding: 16, color: '#FFD66B', fontSize: 14, textAlign: 'center' }}>
      <b>Need help?</b> Email <a href="mailto:support@shamirvault.app" style={{ color: '#FFD700', textDecoration: 'underline' }}>support@shamirvault.app</a> or join our <a href="https://discord.gg/shamirvault" style={{ color: '#FFD700', textDecoration: 'underline' }}>Discord</a>.
    </div>
  );
}

// --- Dev Info Panel (shows only in development) ---
function isDev() {
  // Use a safe check for dev mode (works in browser)
  return (typeof window !== 'undefined' && window.location.hostname === 'localhost');
}
function DevInfoPanel({ username, vaultUser, goldenKey, localShare }) {
  if (!isDev()) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, background: '#23272fdd', color: '#FFD700', fontSize: 12, padding: 10, zIndex: 3000, borderTopRightRadius: 12 }}>
      <div><b>Dev Info:</b></div>
      <div>Username: {username}</div>
      <div>VaultUser: {vaultUser}</div>
      <div>GoldenKey: {goldenKey ? 'Loaded' : 'None'}</div>
      <div>LocalShare: {localShare ? 'Loaded' : 'None'}</div>
    </div>
  );
}

// --- Error Boundary for UI safety ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Only log in dev mode
    if (isDev()) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: '#ef4444', padding: 32, textAlign: 'center' }}>Something went wrong: {this.state.error?.message || 'Unknown error.'}</div>;
    }
    return this.props.children;
  }
}

// --- Main App Component ---
export default function App() {
  // --- State ---
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [vaultUser, setVaultUser] = useState(null);
  const [vaultPage, setVaultPage] = useState(false);
  const [localShare, setLocalShare] = useState('');
  // regId state removed (was unused)
  const fileInputRef = useRef();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAbout, setShowAbout] = useState(true);

  // --- Navigation ---
  const handleNavigate = (target) => {
    setPage(target);
    setError('');
    setSuccess('');
    setLoading(false);
  };

  // --- Registration: Step 1 ---
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      if (getPasswordStrength(password) < 3) {
        setError('Password is too weak. Use a mix of upper, lower, numbers, and symbols.'); setLoading(false); return;
      }
      const res = await fetch('/api/register/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError(`Server error: ${res.status} ${res.statusText}`);
        setLoading(false); return;
      }
      const data = await res.json();
      if (data.status === 'redirect' && data.auth_url && data.reg_id) {
        setSuccess('Redirecting to Google for authentication...');
        window.location.href = data.auth_url;
      } else if (data.status === 'error') {
        setError(data.message || 'Vault creation failed.');
      } else {
        setError('Unexpected server response during registration.');
      }
    } catch (err) {
      setError(`Network or unexpected error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Registration: Step 2 (OAuth Complete) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      fetch('/api/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg_id: regComplete })
      })
        .then(res => {
          if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          if (data.status === 'success') {
            setSuccess('Vault created! Download your local share.');
            setLocalShare(data.local_share);
            setGoldenKey(data.golden_key);
            setVaultUser(data.username);
            // Download local_share.enc
            try {
              const blob = new Blob([data.local_share], { type: 'text/plain' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'local_share.enc';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } catch (downloadErr) {
              setError('Vault created, but failed to trigger download: ' + downloadErr?.message);
            }
          } else if (data.status === 'error') {
            setError(data.message || 'Vault creation failed.');
          } else {
            setError('Unexpected server response during registration completion.');
          }
        })
        .catch(err => setError(`Network or unexpected error: ${err?.message || err}`));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- Vault Unlock (with local_share) ---
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
      if (!res.ok) {
        setError(`Server error: ${res.status} ${res.statusText}`);
        setLoading(false); return;
      }
      const data = await res.json();
      if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setVaultUser(username);
        setVaultPage(true);
        setSuccess('Vault unlocked!');
      } else if (data.status === 'error') {
        setError(data.message || 'Unlock failed.');
      } else {
        setError('Unexpected server response during unlock.');
      }
    } catch (err) {
      setError(`Network or unexpected error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // --- File Upload Handler (for local_share.enc) ---
  const handleLocalShareUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) { setError('No file selected.'); return; }
      const reader = new FileReader();
      reader.onload = (evt) => {
        setLocalShare(evt.target.result);
        setSuccess('local_share.enc loaded!');
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read local_share.enc');
        setSuccess('');
      };
      reader.readAsText(file);
    } catch (err) {
      setError('File upload error: ' + (err?.message || err));
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    setVaultPage(false);
    setGoldenKey(null);
    setVaultUser(null);
    setPage('login');
    setPassword('');
    setLocalShare('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  // --- Onboarding Modal ---
  const OnboardingModal = () => (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: 'anticipate' }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0B0D10ee', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#151A21', borderRadius: 24, padding: 36, maxWidth: 480, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Welcome to Shamir Vault</h2>
        <p style={{ fontSize: 18, marginBottom: 18 }}>This app uses advanced cryptography to keep your secrets safe. <br />
          <b>Steps:</b><br />
          1. Register with a strong password<br />
          2. Complete Google authentication<br />
          3. Download and keep your <b>local_share.enc</b> safe<br />
          4. Use it to unlock your vault anytime
        </p>
        <button style={{ padding: '12px 32px', fontWeight: 700, fontSize: 18, borderRadius: 12, background: '#FFD700', color: '#151A21', border: 'none', cursor: 'pointer', marginTop: 12 }} onClick={() => setShowOnboarding(false)}>Get Started</button>
      </div>
    </motion.div>
  );

  // --- About Modal ---
  const handleAboutClose = () => setShowAbout(false);

  // --- Vault Page ---
  if (vaultPage && goldenKey && vaultUser) {
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={handleLogout} />;
  }

  // --- Main UI ---
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <FloatingShapes zIndex={0} />
        {(page === 'login' || page === 'verification') && (
          <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
            <TopRightNav onNavigate={handleNavigate} />
          </div>
        )}
        <AnimatePresence mode="wait">
          {showAbout && <AboutModal show={showAbout} onClose={handleAboutClose} />}
          {showOnboarding && <OnboardingModal />}
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
                    autoComplete="username"
                  />
                  <div style={{ width: '100%' }}>
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
                        marginBottom: 4,
                      }}
                      autoComplete="current-password"
                    />
                    <PasswordStrengthBar password={password} />
                  </div>
                  <div style={{ width: '100%', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#FFD70099' }}>Need help?</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste your local_share.enc content here (for unlock)"
                    value={localShare}
                    onChange={e => setLocalShare(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: 15,
                      borderRadius: 8,
                      border: '1.5px solid #23272f',
                      background: '#181c20',
                      color: '#eaf6fb',
                      outline: 'none',
                      marginBottom: 10,
                    }}
                    autoComplete="off"
                  />
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: 15,
                      fontWeight: 700,
                      background: '#FFD700',
                      color: '#151A21',
                      border: 'none',
                      borderRadius: 10,
                      marginBottom: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    Upload local_share.enc
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
                      cursor: loading ? 'not-allowed' : 'pointer',
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
                      cursor: loading ? 'not-allowed' : 'pointer',
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
                  {loading && <LoadingSkeleton width="100%" height={32} />}
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
        <DevInfoPanel username={username} vaultUser={vaultUser} goldenKey={goldenKey} localShare={localShare} />
      </div>
    </ErrorBoundary>
  );
}