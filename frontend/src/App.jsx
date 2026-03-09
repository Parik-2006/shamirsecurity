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

  // Handler for Nav3D navigation
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
    </div>
  );
}