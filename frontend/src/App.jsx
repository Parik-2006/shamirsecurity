import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import CyberLogin3D from './CyberLogin3D';
import UnlockWithShare from './UnlockWithShare';
import VaultPage from './VaultPage';

// Safely resolve API URL from environment
const API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : '';


// --- Top Navigation with classic buttons ---
const TopNav = ({ onNavigate }) => {
  const btnStyle = {
    background: '#23272f',
    color: '#FFD700',
    border: '2px solid #FFD700',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    padding: '10px 22px',
    margin: '0 8px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
    textShadow: '0 2px 8px #FFD70044',
    letterSpacing: 0.7,
    minWidth: 0,
    minHeight: 0,
    lineHeight: 1.2,
    display: 'inline-block',
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => onNavigate('documentation')} style={btnStyle}>Documentation</button>
      <button onClick={() => onNavigate('verification')} style={btnStyle}>Verification</button>
      <button onClick={() => onNavigate('about')} style={btnStyle}>About</button>
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
  const navigate = useNavigate();
  const [page, setPage] = useState('login');
  const [unlockStep, setUnlockStep] = useState(null); // null | 'uploadShare' | 'vault'
  const [vaultData, setVaultData] = useState(null); // Store credentials/share
  const [showAbout, setShowAbout] = useState(() => {
    try {
      const seen = sessionStorage.getItem('about_seen');
      return !seen;
    } catch {
      return true;
    }
  });

  // Registration complete: redirect to download share
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
      navigate(`/download-share?reg_complete=${encodeURIComponent(regComplete)}`);
    }
  }, [navigate]);

  // Handle navigation for docs, verification, about
  const handleNavigate = (target) => {
    if (target === 'about') {
      setShowAbout(true);
    } else {
      setPage(target);
    }
  };

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

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <TopNav onNavigate={handleNavigate} />
      </div>
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
      </AnimatePresence>
    </div>
  );
}