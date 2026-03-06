import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// --- API Configuration ---
const API_URL = import.meta.env.VITE_API_URL;

// --- Imports ---
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import FloatingShapes from './FloatingShapes';
import CyberLogin3D from './CyberLogin3D';
import VaultPage from './VaultPage';

// --- Helper Components ---

/**
 * Minimal test button for debugging window.open functionality
 */
function TestWindowOpen() {
  return (
    <button
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999, padding: 16, 
        background: '#FFD700', color: '#151A21', border: 'none', borderRadius: 12, 
        fontWeight: 800, fontSize: 18, boxShadow: '0 2px 8px #FFD66B33', 
        cursor: 'pointer', letterSpacing: 1.1 
      }}
      onClick={() => window.open('https://accounts.google.com/', '_blank', 'noopener,noreferrer')}
    >
      TEST window.open
    </button>
  );
}

/**
 * Top Navigation with 3D Styled Buttons
 */
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
    display: 'flex',
    alignItems: 'center',
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

/**
 * Information Modal
 */
function AboutModal({ show, onClose }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        background: '#0B0D10ee', zIndex: 2000, display: 'flex', 
        alignItems: 'center', justifyContent: 'center' 
      }}
    >
      <div style={{ 
        background: '#151A21', borderRadius: 24, padding: 36, maxWidth: 480, 
        width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', 
        color: '#FFD66B', textAlign: 'center', position: 'relative' 
      }}>
        <button onClick={onClose} style={{ 
          position: 'absolute', top: 16, right: 16, background: 'none', 
          border: 'none', color: '#FFD700', fontSize: 24, cursor: 'pointer' 
        }}>×</button>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Welcome to Shamir Vault</h2>
        <p style={{ fontSize: 18, marginBottom: 18 }}>
          This app uses advanced cryptography to keep your secrets safe.<br /><br />
          <b>Steps to use:</b><br />
          1. Register with a strong password<br />
          2. Complete Google authentication<br />
          3. Download and keep your <b>local_share.enc</b> safe<br />
          4. Use it to unlock your vault anytime
        </p>
        <p style={{ fontSize: 18, color: '#FFD700bb', marginTop: 24 }}>
          For feedback, email <a href="mailto:parikshithbb.cs25@rvce.edu.in" style={{ color: '#FFD700' }}>mail</a>.
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Modal to trigger the download of the local share file
 */
function DownloadShareModal({ show, onDownload, onClose }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        background: '#0B0D10ee', zIndex: 3000, display: 'flex', 
        alignItems: 'center', justifyContent: 'center' 
      }}
    >
      <div style={{ 
        background: '#151A21', borderRadius: 24, padding: 36, maxWidth: 420, 
        width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', 
        color: '#FFD66B', textAlign: 'center', position: 'relative' 
      }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 18 }}>Download Your Vault Share</h2>
        <p style={{ fontSize: 17, marginBottom: 24 }}>
          Click below to download your <b>local_share.enc</b> file. <br />
          Keep it safe! You need it to unlock your vault.
        </p>
        <button
          style={{
            padding: '14px 32px', fontSize: 18, fontWeight: 700, 
            background: '#FFD66B', color: '#151A21', border: 'none', 
            borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #FFD66B33',
          }}
          onClick={onDownload}
        >
          Download local_share.enc
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Page displayed in the OAuth popup after successful sign-in
 */
function AuthSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'registration-complete', reg_complete: regComplete }, '*');
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', width: '100vw', background: '#0B0D10', 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      <div style={{ 
        background: '#151A21', borderRadius: 24, padding: 48, maxWidth: 480, 
        width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', 
        color: '#FFD66B', textAlign: 'center' 
      }}>
        <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Authentication Complete</h2>
        <p style={{ fontSize: 20, marginBottom: 18 }}>Authentication flow complete.<br />You may close this window or tab.</p>
        <p style={{ fontSize: 16, color: '#FFD66B99' }}>(This tab will close automatically.)</p>
      </div>
    </div>
  );
}

// --- Main App Logic ---

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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAbout, setShowAbout] = useState(() => !sessionStorage.getItem('about_seen'));

  // OAuth Message Listener
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === 'registration-complete') {
        if (event.data.local_share) {
          setLocalShare(event.data.local_share);
          setGoldenKey(event.data.golden_key);
          setVaultUser(event.data.username);
          setShowDownloadModal(true);
          console.log('[DEBUG] Received local_share directly from message, showing download modal.');
        } else if (event.data.reg_complete) {
          fetch(`${API_URL}/api/register/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_id: event.data.reg_complete })
          })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
              setLocalShare(data.local_share);
              setGoldenKey(data.golden_key);
              setVaultUser(data.username);
              setShowDownloadModal(true);
              console.log('[DEBUG] Registration complete via reg_id, showing download modal.');
            } else {
              setError(data.message || 'Registration failed.');
            }
          })
          .catch(err => {
            setError('Failed to complete registration.');
          });
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNavigate = (target) => {
    if (target === 'about') {
      setShowAbout(true);
      sessionStorage.setItem('about_seen', '1');
    } else {
      setPage(target);
    }
  };

  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); 
        setLoading(false); return;
      }
      const res = await fetch(`${API_URL}/api/register/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.auth_url) {
        setSuccess('Redirecting to Google sign-in...');
        window.open(data.auth_url, '_blank', 'noopener,noreferrer');
      } else {
        setError(data.message || 'Creation failed.');
      }
    } catch {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

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

  // Route Handling for OAuth success
  if (window.location.pathname.startsWith('/auth-success')) {
    return <AuthSuccessPage />;
  }

  // Final Vault View
  if (vaultPage && goldenKey && vaultUser) {
    return (
      <VaultPage 
        username={vaultUser} 
        goldenKey={goldenKey} 
        onLogout={() => { 
          setVaultPage(false); setGoldenKey(null); setPage('login'); 
        }} 
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', width: '100vw', background: '#0B0D10', 
      position: 'relative', overflow: 'hidden', display: 'flex', 
      flexDirection: 'column' 
    }}>
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
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <CyberLogin3D zIndex={2} />
            <div style={{ 
              maxWidth: 420, width: '95vw', padding: '40px 24px', 
              background: '#151A21', borderRadius: 28, 
              boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              zIndex: 3 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 14 }}>
                <svg width="38" height="38" viewBox="0 0 54 64" fill="none">
                  <rect x="7" y="28" width="40" height="28" rx="8" fill="#FFD700" stroke="#FFF8DC" strokeWidth="3" />
                  <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#FFD700" strokeWidth="3" fill="none" />
                </svg>
                <span style={{ fontWeight: 900, fontSize: 32, color: '#FFD700' }}>Shamir Vault</span>
              </div>

              <input
                type="text" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f',
                  background: '#181c20', color: '#fff', marginBottom: 14 
                }}
              />
              <input
                type="password" placeholder="Master Password" value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f',
                  background: '#181c20', color: '#fff', marginBottom: 22 
                }}
              />

              <button 
                onClick={handleCreateVault} 
                disabled={loading}
                style={{ 
                  width: '100%', padding: 16, background: '#FFD66B', color: '#151A21', 
                  borderRadius: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 12 
                }}
              >
                Create New Vault
              </button>

              <button 
                onClick={() => setPage('verification')}
                style={{ 
                  width: '100%', padding: 16, background: 'transparent', color: '#FFD66B', 
                  border: '2px solid #23272f', borderRadius: 14, fontWeight: 800, cursor: 'pointer' 
                }}
              >
                Unlock Existing Vault
              </button>

              {error && <div style={{ color: '#ef4444', marginTop: 12 }}>{error}</div>}
              {success && <div style={{ color: '#FFD66B', marginTop: 12 }}>{success}</div>}
            </div>
          </motion.div>
        )}

        {page === 'documentation' && (
          <motion.div key="doc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', height: '100%' }}>
            <Documentation onBack={() => setPage('login')} />
          </motion.div>
        )}

        {page === 'verification' && (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', height: '100%' }}>
            <Verification onBack={() => setPage('login')} />
          </motion.div>
        )}
      </AnimatePresence>

      <DownloadShareModal 
        show={showDownloadModal} 
        onDownload={handleDownloadShare} 
        onClose={() => setShowDownloadModal(false)} 
      />
      <TestWindowOpen />
    </div>
  );
}