import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import VaultPage from './VaultPage';

// Safely resolve API URL from environment
const API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';

const TopRightNav = ({ onNavigate }) => (
  <nav>
    <button onClick={() => onNavigate('documentation')}>Documentation</button>
    <button onClick={() => onNavigate('verification')}>Verification</button>
    <button onClick={() => onNavigate('about')}>About</button>
  </nav>
);

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

// Global handler for WebGL context loss
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}

// --- OAuth callback page for registration completion ---
function AuthSuccessPage() {
  const [showCloseMsg, setShowCloseMsg] = React.useState(false);
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (window.opener && !window.opener.closed && regComplete) {
      window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete }, '*');
    }
  }, []);
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 480, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Authentication Complete</h2>
        {!showCloseMsg ? (
          <>
            <p style={{ fontSize: 20, marginBottom: 18 }}>Registration successful.<br />Click continue to finish.</p>
            <button onClick={() => setShowCloseMsg(true)} style={{ marginTop: 24, background: '#FFD66B', color: '#151A21', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 32px', cursor: 'pointer', boxShadow: '0 2px 12px #0006' }}>Continue</button>
          </>
        ) : (
          <p style={{ fontSize: 20, marginBottom: 18 }}>Google authentication flow complete.<br />You may close this window.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // --- HOOKS: All hooks at the top, correct order ---
  const navigate = useNavigate(); // Must be first in component
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
  const [showAbout, setShowAbout] = useState(() => {
    try {
      const seen = sessionStorage.getItem('about_seen');
      return !seen;
    } catch {
      return true;
    }
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // No polling for registration completion in main app; handled by postMessage only

  // --- Listen for registration-complete message from AuthSuccessPage ---
  useEffect(() => {
    function handleRegistrationComplete(event) {
      if (event.data && event.data.type === 'registration-complete') {
        setRegistrationComplete(true);
        try { localStorage.setItem('reg_complete', event.data.reg_complete); } catch {}
      }
    }
    window.addEventListener('message', handleRegistrationComplete);
    return () => window.removeEventListener('message', handleRegistrationComplete);
  }, []);

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
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      let res;
      try {
        res = await fetch(`${API_URL}/api/register/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          signal: controller.signal
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Vault creation timed out. Please try again or check your connection.');
          setLoading(false);
          return;
        } else {
          throw err;
        }
      } finally {
        clearTimeout(timeoutId);
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
        data = null;
      }
      if (data && data.auth_url) {
        setSuccess('Please complete Google sign-in in the new tab.');
        // Open Google OAuth in a new tab
        window.open(data.auth_url, '_blank', 'noopener,noreferrer');
        return;
      }
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

  // --- Step 2: After Google OAuth, complete registration and redirect to download page ---
  // No auto-redirect on reg_complete param; handled by postMessage only

  // --- Step 3: Unlock vault (user uploads local_share.enc) ---
  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password || !localShare) {
        setError('Please enter username, password, and upload your local_share.enc file.'); setLoading(false); return;
      }
      if (!API_URL) {
        setError('API URL is not configured.'); setLoading(false); return;
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
      } catch {
        data = null;
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
      try { sessionStorage.setItem('about_seen', '1'); } catch {}
    } else {
      setPage(target);
    }
  };

  // --- Route: OAuth callback ---
  if (window.location.pathname.startsWith('/auth-success')) {
    return <AuthSuccessPage />;
  }

  // --- Route: Vault page ---
  if (vaultPage && goldenKey && vaultUser) {
    if (!vaultUser || !goldenKey) {
      return <div style={{ color: 'red', padding: 40, textAlign: 'center' }}>Error: Missing credentials for vault access.</div>;
    }
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); }} />;
  }

  // --- Main App UI ---
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
                {registrationComplete && (
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
                      opacity: 1,
                    }}
                    onClick={() => {
                      // After registration, allow user to continue to download share
                      const regCompleteStored = localStorage.getItem('reg_complete');
                      if (regCompleteStored) {
                        navigate(`/download-share?reg_complete=${encodeURIComponent(regCompleteStored)}`);
                        try { localStorage.removeItem('reg_complete'); } catch {}
                        try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
                        setRegistrationComplete(false);
                      }
                    }}
                  >
                    Continue
                  </button>
                )}
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