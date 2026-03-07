
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Define API_URL for backend requests (Render default)
const API_URL = import.meta.env.VITE_API_URL || "https://shamirsecurity-1tv2.onrender.com";

// Pages
import Documentation from './pages/documentation.jsx';
import Verification from './pages/verification.jsx';
import VaultPage from './VaultPage';

// 3D & UI Components
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
                {/* Animated Logo and Heading */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 14 }}>
                  <svg width="38" height="38" viewBox="0 0 54 64" fill="none">
                    <rect x="7" y="28" width="40" height="28" rx="8" fill="#FFD700" stroke="#FFF8DC" strokeWidth="3" />
                    <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#FFD700" strokeWidth="3" fill="none" />
                  </svg>
                  <span style={{ fontWeight: 900, fontSize: 32, color: '#FFD700' }}>Shamir Vault</span>
                </div>
                {/* Subheading */}
                <div style={{ color: '#FFD66B', fontSize: 18, fontWeight: 600, marginBottom: 24, letterSpacing: 1.1, textAlign: 'center', width: '100%' }}>
                  Multi-Key Secret Management
                </div>
                {/* Inputs */}
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f', background: '#181c20', color: '#fff', marginBottom: 14 }}
                />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Master Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f', background: '#181c20', color: '#fff', marginBottom: 22 }}
                />
                {/* Button Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 0, width: '100%', background: '#FFD66B', borderRadius: 18, marginTop: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#23272f', fontSize: 16, paddingLeft: 10, textAlign: 'left' }}>
                    Create<br />New<br />Vault
                  </div>
                  <button
                    className="btn-gold"
                    style={{ width: '100%', fontWeight: 800, fontSize: 20, padding: '18px 0', borderRadius: 14, background: '#FFD66B', color: '#23272f', border: 'none', boxShadow: 'none' }}
                    onClick={() => { window.location.href = API_URL + '/api/google/login'; }}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create New Vault'}
                  </button>
                  <button
                    className="btn-dark"
                    style={{ width: '100%', fontWeight: 700, fontSize: 16, padding: '0 0', borderRadius: 14, background: 'transparent', color: '#23272f', border: 'none', textAlign: 'right', paddingRight: 10 }}
                    onClick={handleUnlock}
                    disabled={loading}
                  >
                    {'>'} Unlock<br />Existing<br />Vault
                  </button>
                </div>
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
        <DownloadShareModal show={showDownloadModal} onDownload={handleDownloadShare} onClose={() => setShowDownloadModal(false)} />
      </div>
    </ErrorBoundary>
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

function App() {
  // --- Move all useState hooks to the top ---
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

  // Show download modal if registration just completed and user lands on main window
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete && !showDownloadModal && !vaultPage) {
      // Try to fetch the registration result directly
      fetch(`${API_URL}/api/register/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg_id: regComplete })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setLocalShare(data.local_share);
            setGoldenKey(data.golden_key);
            setVaultUser(data.username);
            setShowDownloadModal(true);
            window.history.replaceState({}, document.title, window.location.pathname); // Clean up URL
          } else {
            setError(data.message || 'Registration failed.');
          }
        })
        .catch(() => setError('Failed to complete registration.'));
    }
  }, [showDownloadModal, vaultPage]);

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
            if (err && err.stack) {
              console.error('Registration completion error:', err.stack);
            } else {
              console.error('Registration completion error:', err);
            }
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
    <ErrorBoundary>

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

              {/* Animated Logo and Heading */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 14 }}>
                <svg width="38" height="38" viewBox="0 0 54 64" fill="none">
                  <rect x="7" y="28" width="40" height="28" rx="8" fill="#FFD700" stroke="#FFF8DC" strokeWidth="3" />
                  <path d="M14 28v-8a13 13 0 0 1 26 0v8" stroke="#FFD700" strokeWidth="3" fill="none" />
                </svg>
                <span style={{ fontWeight: 900, fontSize: 32, color: '#FFD700' }}>Shamir Vault</span>
              </div>

              {/* Subheading centered above input, with extra margin */}
              <div style={{ color: '#FFD66B', fontSize: 18, fontWeight: 600, marginBottom: 24, letterSpacing: 1.1, textAlign: 'center', width: '100%' }}>
                Multi-Key Secret Management
              </div>

              <input
                id="login-username"
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f',
                  background: '#181c20', color: '#fff', marginBottom: 14 
                }}
              />
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Master Password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #23272f',
                  background: '#181c20', color: '#fff', marginBottom: 22 
                }}
              />



              <button
                className="btn-gold"
                style={{ width: '100%', marginBottom: 14, fontWeight: 800, fontSize: 18, padding: '14px', borderRadius: 12 }}
                onClick={() => {
                  // Immediately trigger Google OAuth flow
                  window.location.href = API_URL + '/api/google/login';
                }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create New Vault'}
              </button>

              <button
                className="btn-dark"
                style={{ width: '100%', fontWeight: 800, fontSize: 18, padding: '14px', borderRadius: 12, background: '#23272f', color: '#FFD700', border: '2px solid #FFD700', marginBottom: 8 }}
                onClick={handleUnlock}
                disabled={loading}
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
      {/* <TestWindowOpen /> */}
    </div>
    </ErrorBoundary>
  );
}
export default App;