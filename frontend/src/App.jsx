<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import CyberLogin3D from './CyberLogin3D';
import UnlockWithShare from './UnlockWithShare';
import VaultPage from './VaultPage';
import FloatingShapes from './FloatingShapes';
import FloatingOrbs from './FloatingOrbs';
import Nav3D from './components/Nav3D';
import AboutPage from './pages/about.jsx';
import { API_URL } from './config';
import './App.css';
import './index.css';

// --- OAuth callback page for registration completion ---
function AuthSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    async function notifyOpener() {
      if (regComplete) {
        try {
          localStorage.setItem('reg_complete', regComplete);
        } catch {/* ignore */}
      }
      if (window.opener && !window.opener.closed && regComplete) {
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
            }
          } catch {
            data = null;
          }
          if (data && data.status === 'success') {
            window.opener.postMessage({
              type: 'registration-complete',
              reg_complete: regComplete,
              local_share: data.local_share,
              golden_key: data.golden_key,
              username: data.username
            }, '*');
            setTimeout(() => { if (window.opener && !window.opener.closed) window.close(); }, 2000);
          } else {
            window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete, error: (data && data.message) || 'Unknown error' }, '*');
            setTimeout(() => { if (window.opener && !window.opener.closed) window.close(); }, 3000);
          }
        } catch (err) {
          window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete, error: err.message || 'Network error' }, '*');
          setTimeout(() => { if (window.opener && !window.opener.closed) window.close(); }, 3000);
        }
      }
    }
    notifyOpener();
  }, []);
=======
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import UnlockWithShare from './UnlockWithShare';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

// Set your backend API URL here:
const API_URL = "https://shamirsecurity-098.onrender.com"; // <-- CHANGE THIS to your backend URL

// Global handler for WebGL context loss
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}

// --- OAuth callback page for registration completion (single-tab flow) ---
export function AuthSuccessPage() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const regComplete = params.get('reg_complete');
  const message = error ? decodeURIComponent(error.replace(/\+/g, ' ')) : (regComplete ? 'Registration complete! You may now download your share.' : '');
>>>>>>> copy_parik2
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Registration Status</h2>
        <div style={{ color: error ? '#ef4444' : '#FFD66B', fontWeight: 600, marginBottom: 18 }}>{message}</div>
            }
        <button
            export default function App() {
            background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 12px #0006', transition: 'background 0.2s'
          }}
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default function App() {
  const navigate = useNavigate();
  const [page, setPage] = useState('login');
  const [unlockStep, setUnlockStep] = useState(null); // null | 'uploadShare' | 'vault'
  const [vaultData, setVaultData] = useState(null); // Store credentials/share
=======
function App() {
    const location = useLocation();
  // --- HOOKS: All hooks at the top, correct order ---
    // Always get credentials from localStorage at the top
    // Only read from localStorage at the top for initial state, but always re-read before rendering VaultPage
    let vaultUser = localStorage.getItem('vaultUser');
    let goldenKey = localStorage.getItem('goldenKey');
    let justRegistered = localStorage.getItem('justRegistered') === 'true';
    const [credentialsReady, setCredentialsReady] = useState(false);
    console.log('[App.jsx] (top) vaultUser from localStorage:', vaultUser);
    console.log('[App.jsx] (top) goldenKey from localStorage:', goldenKey);
    console.log('[App.jsx] (top) justRegistered:', justRegistered);
  const navigate = useNavigate(); // Must be first in component
  const [page, setPage] = useState('login');
  const [unlockStep, setUnlockStep] = useState('login'); // 'login' or 'uploadShare'
  const [pendingUnlock, setPendingUnlock] = useState({ username: '', password: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Removed goldenKey and vaultUser logic
  const [vaultPage, setVaultPage] = useState(false);
  const [localShare, setLocalShare] = useState(null);
>>>>>>> copy_parik2
  const [showAbout, setShowAbout] = useState(() => {
    try {
      const seen = sessionStorage.getItem('about_seen');
      return !seen;
    } catch {
      return true;
    }
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);

<<<<<<< HEAD
  // Registration complete: redirect to download share
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      navigate(`/download-share?reg_complete=${encodeURIComponent(regComplete)}`);
=======
  // Restore vault credentials from localStorage if missing
  useEffect(() => {
    // If on /vault or /download-share, check for credentials and set credentialsReady
    if (location.pathname === '/vault' || location.pathname === '/download-share') {
      const vaultUser = localStorage.getItem('vaultUser');
      const goldenKey = localStorage.getItem('goldenKey');
      if (vaultUser && goldenKey) {
        setCredentialsReady(true);
        setVaultPage(true);
      } else {
        setCredentialsReady(false);
      }
    }
  }, [location]);
  // No polling for registration completion in main app; handled by postMessage only

  // --- Listen for registration-complete message from AuthSuccessPage ---
  useEffect(() => {
    function handleRegistrationComplete(event) {
      if (event.data && (event.data.type === 'registration-complete' || event.data.type === 'registration-finish')) {
        setRegistrationComplete(false);
        navigate(`/download-share?reg_complete=${encodeURIComponent(event.data.reg_complete)}`);
        try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
      }
    }
    window.addEventListener('message', handleRegistrationComplete);
    return () => window.removeEventListener('message', handleRegistrationComplete);
  }, [navigate]);

  // --- Step 1: Start registration, get Google OAuth URL ---
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try { window.sessionStorage.setItem('registration_attempted', '1'); } catch {}
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      if (!API_URL) {
        setError('API URL is not configured.'); setLoading(false); return;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Faster timeout for fetch
      let res;
      try {
        res = await fetch(`${API_URL}/api/register/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          signal: controller.signal
        });
      } catch (err) {
        console.error('[CreateVault] Fetch error:', err);
        if (err.name === 'AbortError') {
          setError('Vault creation timed out. Please try again or check your connection.');
          setLoading(false);
          return;
        } else {
          setError('Network error: ' + err.message + (err.stack ? ('\n' + err.stack) : ''));
          setLoading(false);
          return;
        }
      } finally {
        clearTimeout(timeoutId);
      }
      if (!res) {
        setError('No response received from backend.');
        setLoading(false);
        return;
      }
      const contentType = res.headers.get('Content-Type');
      let raw = '';
      let data = null;
      try {
        raw = await res.text();
        if (raw && contentType && contentType.includes('application/json')) {
          data = JSON.parse(raw);
        }
      } catch (jsonErr) {
        console.error('[CreateVault] JSON parse error:', jsonErr, 'Raw:', raw);
        setError('Error parsing backend response: ' + jsonErr.message + '\nRaw: ' + raw);
        setLoading(false);
        return;
      }
      if (data && data.auth_url) {
        setSuccess('Redirecting to Google sign-in...');
        // Redirect to Google OAuth in the same tab
        window.location.href = data.auth_url;
        return;
      }
      if (data && data.message) {
        setError('Vault creation failed: ' + data.message);
        console.error('[CreateVault] Backend error:', data.message);
      } else if (raw) {
        setError('Vault creation failed. Backend says: ' + raw);
        console.error('[CreateVault] Backend says:', raw);
      } else {
        setError('Vault creation failed. No response from backend.');
        console.error('[CreateVault] No response from backend.');
      }
    } catch (err) {
      console.error('[CreateVault] General error:', err);
      setError('Could not connect to the server. Error: ' + err.message + (err.stack ? ('\n' + err.stack) : ''));
    } finally {
      setLoading(false);
    }
  };

  // --- Unlock Vault: Step 1 (login) ---
  const handleUnlockLogin = async () => {
    setError(''); setSuccess(''); setLoading(true);
    // Here, just check username/password validity (simulate or call backend if needed)
    if (!username || !password) {
      setError('Please enter username and password.'); setLoading(false); return;
>>>>>>> copy_parik2
    }
    // Optionally, call backend to check credentials (not unlocking yet)
    // If valid, proceed to upload share step
    setPendingUnlock({ username, password });
    setUnlockStep('uploadShare');
    setLoading(false);
  };

  // --- Unlock Vault: Step 2 (upload share) ---
  const handleUnlockWithShare = (goldenKey, username) => {
    // Save credentials if needed, then open vault
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    setVaultPage(true);
    setCredentialsReady(true); // Ensure unlock flow works
    setUnlockStep('login');
    setPendingUnlock({ username: '', password: '' });
  };

  // --- Step 2: After Google OAuth, complete registration and redirect to download page ---
  // No auto-redirect on reg_complete param; handled by postMessage only

  // Handler for Nav3D navigation
  const handleNavigate = (target) => {
    if (target === 'about') {
      setShowAbout(true);
    } else {
      setPage(target);
    }
  };

<<<<<<< HEAD
  // Handle login success (simulate, should be called from CyberLogin3D)
  const handleLoginSuccess = (credentials) => {
    setUnlockStep('uploadShare');
    setVaultData({ credentials });
    setPage('unlock');
  };

  // Handle unlock with share success
  const handleUnlockSuccess = (share) => {
    // Store credentials and share in localStorage
    if (vaultData && vaultData.credentials) {
      localStorage.setItem('vault_credentials', JSON.stringify(vaultData.credentials));
    }
    localStorage.setItem('vault_share', share);
    setUnlockStep('vault');
    setPage('vault');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('vault_credentials');
    localStorage.removeItem('vault_share');
    setVaultData(null);
    setUnlockStep(null);
    setPage('login');
  };

  // --- Route: OAuth callback ---
  if (window.location.pathname.startsWith('/auth-success')) {
    return <AuthSuccessPage />;
  }
  // Show vault page if unlocked
  if (vaultPage && goldenKey && vaultUser) {
    return (
      <VaultPage
        username={vaultUser}
        goldenKey={goldenKey}
        onLogout={() => {
          setVaultPage(false);
          setGoldenKey(null);
          setVaultUser(null);
          setPage('login');
          setShowLocalShareStep(false);
          setLocalShare(null);
        }}
      />
    );
=======

  // --- Route: Vault page ---
  // If justRegistered, always show RegistrationVaultPage (no credential checks)
  if (vaultPage && localStorage.getItem('justRegistered') === 'true') {
    setTimeout(() => localStorage.setItem('justRegistered', 'false'), 0);
    return <RegistrationVaultPage />;
  }
  // For unlock flow, only allow if credentials are present (set after verification)
  if (vaultPage && credentialsReady && localStorage.getItem('justRegistered') !== 'true') {
    vaultUser = localStorage.getItem('vaultUser');
    goldenKey = localStorage.getItem('goldenKey');
    return <VaultPage 
      username={vaultUser}
      goldenKey={goldenKey}
      onLogout={() => {
        setVaultPage(false);
        setPage('login');
        localStorage.removeItem('vaultUser');
        localStorage.removeItem('goldenKey');
      }} 
    />;
>>>>>>> copy_parik2
  }

  // Handler for creating a new vault
  const handleCreateVault = () => {
    if (username && password) {
      setLoading(true);
      setSuccess('');
      setError('');
      setVaultUser(username);
      setGoldenKey(generateGoldenKey());
      setVaultPage(true);
      setLocalShare(null);
      setShowLocalShareStep(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  // Handler for unlocking a vault
  const handleUnlockVault = () => {
    if (username && password) {
      setLoading(true);
      setSuccess('');
      setError('');
      setVaultUser(username);
      setGoldenKey(generateGoldenKey());
      setVaultPage(true);
      setLocalShare(null);
      setShowLocalShareStep(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  // Handler for uploading a local_share.enc
  const handleLocalShareUpload = () => {
    if (localShare) {
      const blob = new Blob([localShare], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'local_share.enc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShowDownloadModal(false);
      setVaultPage(true);
    }
  };

  // Main app UI
  return (
<<<<<<< HEAD
    <div className="app-wrapper" style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <FloatingShapes zIndex={0} />
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <Nav3D onNavigate={handleNavigate} />
      </div>
      <AnimatePresence mode="wait">
        {showAbout && <AboutPage show={showAbout} onClose={() => setShowAbout(false)} />}
        {page === 'login' && !showLocalShareStep && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            <FloatingOrbs zIndex={2} />
            <CyberLogin3D onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}
        {page === 'unlock' && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            <UnlockWithShare onUnlockSuccess={handleUnlockSuccess} />
          </motion.div>
        )}
        {page === 'vault' && (
          <motion.div
            key="vault"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            <VaultPage onLogout={handleLogout} />
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
            <div className="glass-card card-glow" style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
              <h2 className="gradient-text" style={{ fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 18 }}>Upload Your local_share.enc</h2>
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
                className="btn-gradient-cyan floating"
                style={{ width: '100%', padding: '16px', fontSize: 20, fontWeight: 800, border: '2px solid #23272f', borderRadius: 14, cursor: 'pointer', marginBottom: 8, letterSpacing: 1.1, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', textShadow: '0 2px 8px #00fff733', opacity: loading ? 0.7 : 1 }}
                onClick={handleLocalShareUpload}
                disabled={loading}
              >
                Unlock Vault
              </button>
              <button
                className="btn-ghost"
                style={{ marginTop: 10, fontWeight: 600, fontSize: 16 }}
                onClick={() => { setShowLocalShareStep(false); setLocalShare(null); setError(''); setSuccess(''); }}
              >
                &larr; Back to Login
              </button>
              {error && <div className="error-message" style={{ margin: '10px 0', fontWeight: 600 }}>{error}</div>}
              {success && <div style={{ color: '#00ff85', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ...existing code for DownloadShareModal, TestWindowOpen, etc. ... */}
      <DownloadShareModal show={showDownloadModal} onDownload={handleDownloadShare} onClose={() => setShowDownloadModal(false)} />
      <TestWindowOpen />
=======
    <div className="cyber-bg cyber-login-wrapper">
      {/* Cybersecurity animated SVG/circuit background */}
      <svg className="cyber-bg-svg" width="100%" height="100%" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyber-neon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00fff7" />
            <stop offset="100%" stopColor="#00ff85" />
          </linearGradient>
        </defs>
        <g opacity="0.13">
          <rect x="0" y="0" width="1920" height="1080" fill="#0B0D10" />
          <g stroke="url(#cyber-neon)" strokeWidth="2">
            <rect x="80" y="80" width="1760" height="920" rx="48" />
            <rect x="200" y="200" width="1520" height="680" rx="32" />
            <rect x="400" y="320" width="1120" height="440" rx="24" />
            <path d="M200 200 L1720 880" />
            <path d="M1720 200 L200 880" />
          </g>
        </g>
      </svg>
      {page === 'login' && unlockStep === 'login' && (
        <div className="cyber-login-card animate-fade-in">
          <div className="cyber-login-header">
            <span className="cyber-vault-icon">
              <svg width="48" height="48" viewBox="0 0 54 64" fill="none">
                <rect x="7" y="28" width="40" height="28" rx="8" fill="#0B0D10" stroke="#00fff7" strokeWidth="3.5" filter="url(#glow)" />
                <rect x="20" y="38" width="14" height="10" rx="5" fill="#00fff7" opacity="0.7" />
                <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#00fff7" strokeWidth="3" fill="none" />
                <defs>
                  <filter id="glow" x="-10" y="-10" width="74" height="74" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </span>
            <h1 className="cyber-title">Shamir Vault</h1>
          </div>
          <p className="cyber-subtitle">Secure Multi-Key Secret Management</p>
          <div className="cyber-login-form">
            <div className="cyber-input-group">
              <input
                className="cyber-input"
                type="text"
                id="login-username"
                name="username"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="cyber-input-group">
              <input
                className="cyber-input"
                type="password"
                id="login-password"
                name="password"
                placeholder="Master Password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              className="cyber-btn cyber-btn-neon"
              onClick={handleCreateVault}
              disabled={loading}
            >
              Create New Vault
            </button>
            <button
              className="cyber-btn cyber-btn-outline"
              onClick={handleUnlockLogin}
              disabled={loading}
            >
              Unlock Vault
            </button>
            {error && <div className="cyber-error-msg">{error}</div>}
            {success && <div className="cyber-success-msg">{success}</div>}
          </div>
        </div>
      )}
      {page === 'login' && unlockStep === 'uploadShare' && (
        <UnlockWithShare
          username={pendingUnlock.username}
          password={pendingUnlock.password}
          onUnlock={handleUnlockWithShare}
          onBack={() => { setUnlockStep('login'); setPendingUnlock({ username: '', password: '' }); }}
        />
      )}
>>>>>>> copy_parik2
    </div>
  );
}
export default App;