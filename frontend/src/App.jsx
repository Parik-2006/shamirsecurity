import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import VaultPage from './VaultPage';
import CyberLogin3D from './CyberLogin3D';

// Safely resolve API URL from environment
const API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';


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
// --- Download Share Modal ---
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    async function notifyOpener() {
      if (regComplete) {
        try {
          localStorage.setItem('reg_complete', regComplete);
        } catch {}
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
          } catch (jsonErr) {
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

  // --- Poll for registration completion after registration attempt ---
  useEffect(() => {
    let intervalId;
    try {
      if (!window.sessionStorage.getItem('registration_attempted')) return;
      const onLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
      if (onLoginPage) {
        intervalId = setInterval(() => {
          let regCompleteStored = null;
          try { regCompleteStored = localStorage.getItem('reg_complete'); } catch {}
          if (regCompleteStored) {
            navigate(`/download-share?reg_complete=${encodeURIComponent(regCompleteStored)}`);
            try { localStorage.removeItem('reg_complete'); } catch {}
            try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
            clearInterval(intervalId);
          }
        }, 500);
      }
    } catch {}
    return () => intervalId && clearInterval(intervalId);
  }, [navigate]);

  // --- Listen for registration-complete message from AuthSuccessPage ---
  useEffect(() => {
    function handleRegistrationComplete(event) {
      if (event.data && event.data.type === 'registration-complete') {
        if (event.data.reg_complete) {
          try { localStorage.setItem('reg_complete', event.data.reg_complete); } catch {}
          navigate(`/download-share?reg_complete=${encodeURIComponent(event.data.reg_complete)}`);
        } else if (event.data.username) {
          navigate(`/download-share?username=${encodeURIComponent(event.data.username)}`);
        }
      }
    }
    window.addEventListener('message', handleRegistrationComplete);
    // On mount, check localStorage for reg_complete
    let regCompleteStored = null;
    try { regCompleteStored = localStorage.getItem('reg_complete'); } catch {}
    const onLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
    if (regCompleteStored && window.location.pathname !== '/download-share') {
      navigate(`/download-share?reg_complete=${encodeURIComponent(regCompleteStored)}`);
      try { localStorage.removeItem('reg_complete'); } catch {}
      try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
    } else if (window.sessionStorage.getItem('registration_attempted') && onLoginPage) {
      // No reg_complete found after registration attempt
    }
    // Also check URL params for reg_complete on login page
    if (onLoginPage) {
      const params = new URLSearchParams(window.location.search);
      const regComplete = params.get('reg_complete');
      if (regComplete) {
        navigate(`/download-share?reg_complete=${encodeURIComponent(regComplete)}`);
        try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
      }
    }
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
        setSuccess('Redirecting to Google sign-in...');
        window.location.href = data.auth_url;
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      navigate(`/download-share?reg_complete=${encodeURIComponent(regComplete)}`);
    }
  }, [navigate]);

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
  // --- Handler for downloading local_share.enc from modal ---
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
      setVaultPage(true);
    }
  };

  // --- FloatingShapes and CyberLogin3D are visual only, skip logic ---
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top navigation remains */}
      {(page === 'login' || page === 'verification') && (
        <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
          <TopRightNav onNavigate={handleNavigate} />
        </div>
      )}
      <AnimatePresence mode="wait">
        {showAbout && <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />}
        {/* DownloadShareModal for local_share.enc download */}
        {typeof DownloadShareModal !== 'undefined' && (
          <DownloadShareModal show={showDownloadModal} onDownload={handleDownloadShare} onClose={() => setShowDownloadModal(false)} />
        )}
        {page === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}
          >
            {/* Render the advanced dark-themed floating login UI/UX */}
            <CyberLogin3D />
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