// Unified App.jsx: All logic/UI from parik3 and parik4
import React, { useState, useRef, useEffect } from 'react';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';
import Cyber3DShapes from './Cyber3DShapes';
import VaultPage from './VaultPage';
import logoLock from './assets/shamir_logo_lock.png';

function TopRightNav({ onNavigate }) {
  // Merge both button styles for 3D/cyber look
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
  // Merge all state from both branches
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
  const [regId, setRegId] = useState(null);
  const fileInputRef = useRef();

  // Navigation
  const handleNavigate = (target) => setPage(target);

  // Helper: get/set local share (from parik3)
  const getLocalShare = (username) => {
    try {
      return localStorage.getItem(`local_share_${username}`);
    } catch {
      return null;
    }
  };
  const saveLocalShare = (username, value) => {
    try {
      localStorage.setItem(`local_share_${username}`, value);
    } catch {}
  };

  // Handler: Create New Vault (parik3 logic)
  const handleCreateVaultClassic = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const res = await fetch('/api/create_vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        saveLocalShare(username, data.local_share);
        setSuccess('Vault created! You can now unlock your vault.');
      } else {
        setError(data.message || 'Vault creation failed.');
      }
    } catch (e) {
      setError('Network error creating vault.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Create New Vault (parik4 logic, Google OAuth)
  const handleCreateVaultOAuth = async () => {
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
        setRegId(data.reg_id);
        setSuccess('Redirecting to Google for authentication...');
        window.location.href = data.auth_url;
      } else {
        setError(data.message || 'Vault creation failed.');
      }
    } catch (e) {
      setError('Network error creating vault.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Unlock Vault (classic)
  const handleUnlockVaultClassic = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const local_share = getLocalShare(username);
      if (!local_share) {
        setError('No local share found. Please create a vault first.'); setLoading(false); return;
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setSuccess('Vault unlocked!');
        setVaultUser(username);
        setVaultPage(true);
      } else {
        setError(data.message || 'Unlock failed.');
      }
    } catch (e) {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Unlock Vault (OAuth/local_share upload)
  const handleUnlockVaultOAuth = async () => {
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
    } catch (e) {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth registration completion (parik4)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    if (regComplete) {
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
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // File upload handler for local_share.enc (parik4)
  const handleLocalShareUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setLocalShare(evt.target.result);
    };
    reader.readAsText(file);
  };

  if (vaultPage && goldenKey && vaultUser) {
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); }} />;
  }
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
      {/* Cybersecurity 3D animated elements for login page */}
      {page === 'login' && <React.Suspense fallback={null}>
        {React.createElement(require('./CyberLogin3D.jsx').default, { zIndex: 2 })}
      </React.Suspense>}
<<<<<<< HEAD
=======
>>>>>>> b6f7a91 (Manually resolve merge conflicts in App.jsx: combine all logic and UI/UX from both branches, remove conflict markers, ensure clean build.)
=======
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <TopRightNav onNavigate={handleNavigate} />
      </div>
      {page === 'login' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(ellipse at 60% 40%, #23272b 60%, #181c20 100%)', boxShadow: '0 0 120px #FFD70022 inset' }}>
          <div style={{ maxWidth: 440, width: '98vw', padding: '44px 28px', background: 'linear-gradient(135deg, #181c20 80%, #23272b 100%)', borderRadius: 32, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #FFD70022', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #FFD70055', position: 'relative' }}>
<<<<<<< HEAD
<<<<<<< HEAD
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <img src={logoLock} alt="Shamir Lock Logo" style={{ height: 38, width: 'auto', marginBottom: 6, background: 'none', borderRadius: 12, border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033', padding: 0, objectFit: 'contain', filter: 'drop-shadow(0 1px 6px #FFD70066)' }} />
              <h1 className="floating" style={{ color: '#FFD700', fontWeight: 800, fontSize: 28, textAlign: 'center', margin: 0, letterSpacing: 1.1, textShadow: '0 1px 6px #FFD70055, 0 1.5px 8px #FFD70022' }}>Shamir Vault</h1>
=======
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 22 }}>
              <img src={logoLock} alt="Shamir Lock Logo" style={{ height: 70, width: 'auto', marginRight: 0, background: 'none', borderRadius: 18, border: '2.5px solid #FFD700', boxShadow: '0 4px 24px #FFD70033, 0 1.5px 16px #FFD70022', padding: 0, objectFit: 'contain', filter: 'drop-shadow(0 2px 12px #FFD70066) drop-shadow(0 0 0 #0000)' }} />
              <h1 className="floating" style={{ color: '#FFD700', fontWeight: 900, fontSize: 44, textAlign: 'center', margin: 0, letterSpacing: 1.3, textShadow: '0 2px 12px #FFD70055, 0 1.5px 16px #FFD70022' }}>Shamir Vault</h1>
>>>>>>> b6f7a91 (Manually resolve merge conflicts in App.jsx: combine all logic and UI/UX from both branches, remove conflict markers, ensure clean build.)
=======
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <img src={logoLock} alt="Shamir Lock Logo" style={{ height: 38, width: 'auto', marginBottom: 6, background: 'none', borderRadius: 12, border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033', padding: 0, objectFit: 'contain', filter: 'drop-shadow(0 1px 6px #FFD70066)' }} />
              <h1 className="floating" style={{ color: '#FFD700', fontWeight: 800, fontSize: 28, textAlign: 'center', margin: 0, letterSpacing: 1.1, textShadow: '0 1px 6px #FFD70055, 0 1.5px 8px #FFD70022' }}>Shamir Vault</h1>
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
            </div>
            <Cyber3DShapes zIndex={1} />
            <p style={{ color: '#FFD700', fontSize: '1.18rem', textAlign: 'center', marginBottom: 32, letterSpacing: 0.8, textShadow: '0 1px 8px #FFD70033' }}>
              Secure Multi-Key Secret Management
            </p>
            <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 18,
                  borderRadius: 12,
                  border: '2px solid #FFD700',
                  marginBottom: 0,
                  background: 'linear-gradient(90deg, #23272b 80%, #181c20 100%)',
                  color: '#FFD700',
                  outline: 'none',
                  boxShadow: '0 2px 12px #FFD70022',
                  fontWeight: 700,
                  letterSpacing: 0.7,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  textShadow: '0 1px 8px #FFD70033',
                }}
              />
              <input
                type="password"
                placeholder="Master Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 18,
                  borderRadius: 12,
                  border: '2px solid #FFD700',
                  background: 'linear-gradient(90deg, #23272b 80%, #181c20 100%)',
                  color: '#FFD700',
                  outline: 'none',
                  marginBottom: 0,
                  boxShadow: '0 2px 12px #FFD70022',
                  fontWeight: 700,
                  letterSpacing: 0.7,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  textShadow: '0 1px 8px #FFD70033',
                }}
              />
              <button
                className="floating"
                style={{
                  width: '100%',
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
                  padding: '16px',
                  fontSize: 19,
                  fontWeight: 800,
                  background: 'linear-gradient(120deg, #23272b 60%, #181c20 100%)',
                  color: '#FFD700',
                  border: '2px solid #FFD700',
                  borderRadius: 14,
<<<<<<< HEAD
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: 10,
                  boxShadow: '0 2px 8px #FFD70022',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  opacity: loading ? 0.7 : 1,
                  textShadow: '0 1px 6px #FFD70055',
=======
                  padding: '18px',
                  fontSize: 22,
                  fontWeight: 900,
                  background: 'linear-gradient(120deg, #FFD700 60%, #bfa43a 100%)',
                  color: '#181c20',
                  border: '2.5px solid #FFD700',
                  borderRadius: 18,
=======
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: 10,
                  boxShadow: '0 2px 8px #FFD70022',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  opacity: loading ? 0.7 : 1,
<<<<<<< HEAD
                  textShadow: '0 2px 12px #FFD70055',
>>>>>>> b6f7a91 (Manually resolve merge conflicts in App.jsx: combine all logic and UI/UX from both branches, remove conflict markers, ensure clean build.)
=======
                  textShadow: '0 1px 6px #FFD70055',
>>>>>>> 6e5db6e (UI: Add animated 3D cybersecurity elements to login page (padlock, shield, key))
                  perspective: 400,
                  transformStyle: 'preserve-3d',
                }}
                disabled={loading}
                onClick={handleCreateVault}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04) rotateY(6deg)'}
                if (vaultPage && goldenKey && vaultUser) {
                  return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setGoldenKey(null); setVaultUser(null); setPage('login'); }} />;
                }
                return (
                  <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <FloatingShapes zIndex={0} />
                    {/* Cybersecurity 3D animated elements for login page */}
                    {page === 'login' && <React.Suspense fallback={null}>
                      {React.createElement(require('./CyberLogin3D.jsx').default, { zIndex: 2 })}
                    </React.Suspense>}
                    {(page === 'login' || page === 'verification') && (
                      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
                        <TopRightNav onNavigate={handleNavigate} />
                      </div>
                    )}
                    {page === 'login' && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(ellipse at 60% 40%, #23272b 60%, #181c20 100%)', boxShadow: '0 0 120px #FFD70022 inset' }}>
                        <div style={{ maxWidth: 440, width: '98vw', padding: '44px 28px', background: 'linear-gradient(135deg, #181c20 80%, #23272b 100%)', borderRadius: 32, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #FFD70022', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #FFD70055', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 22 }}>
                            <img src={logoLock} alt="Shamir Lock Logo" style={{ height: 70, width: 'auto', marginRight: 0, background: 'none', borderRadius: 18, border: '2.5px solid #FFD700', boxShadow: '0 4px 24px #FFD70033, 0 1.5px 16px #FFD70022', padding: 0, objectFit: 'contain', filter: 'drop-shadow(0 2px 12px #FFD70066) drop-shadow(0 0 0 #0000)' }} />
                            <h1 className="floating" style={{ color: '#FFD700', fontWeight: 900, fontSize: 44, textAlign: 'center', margin: 0, letterSpacing: 1.3, textShadow: '0 2px 12px #FFD70055, 0 1.5px 16px #FFD70022' }}>Shamir Vault</h1>
                          </div>
                          <Cyber3DShapes zIndex={1} />
                          <p style={{ color: '#FFD700', fontSize: '1.18rem', textAlign: 'center', marginBottom: 32, letterSpacing: 0.8, textShadow: '0 1px 8px #FFD70033' }}>
                            Secure Multi-Key Secret Management
                          </p>
                          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                            <input
                              type="text"
                              placeholder="Username"
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: 18,
                                borderRadius: 12,
                                border: '2px solid #FFD700',
                                marginBottom: 0,
                                background: 'linear-gradient(90deg, #23272b 80%, #181c20 100%)',
                                color: '#FFD700',
                                outline: 'none',
                                boxShadow: '0 2px 12px #FFD70022',
                                fontWeight: 700,
                                letterSpacing: 0.7,
                                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                                textShadow: '0 1px 8px #FFD70033',
                              }}
                            />
                            <input
                              type="password"
                              placeholder="Master Password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: 18,
                                borderRadius: 12,
                                border: '2px solid #FFD700',
                                background: 'linear-gradient(90deg, #23272b 80%, #181c20 100%)',
                                color: '#FFD700',
                                outline: 'none',
                                marginBottom: 0,
                                boxShadow: '0 2px 12px #FFD70022',
                                fontWeight: 700,
                                letterSpacing: 0.7,
                                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                                textShadow: '0 1px 8px #FFD70033',
                              }}
                            />
                            {/* Classic and OAuth registration buttons */}
                            <button className="floating" style={{ width: '100%', padding: '18px', fontSize: 22, fontWeight: 900, background: 'linear-gradient(120deg, #FFD700 60%, #bfa43a 100%)', color: '#181c20', border: '2.5px solid #FFD700', borderRadius: 18, cursor: loading ? 'wait' : 'pointer', marginBottom: 10, boxShadow: '0 6px 24px #FFD70033, 0 1.5px 16px #FFD70022', letterSpacing: 1.2, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', opacity: loading ? 0.7 : 1, textShadow: '0 2px 12px #FFD70055', perspective: 400, transformStyle: 'preserve-3d' }} disabled={loading} onClick={handleCreateVaultClassic}>Classic Create Vault</button>
                            <button className="floating" style={{ width: '100%', padding: '18px', fontSize: 22, fontWeight: 900, background: 'linear-gradient(120deg, #00F5D4 60%, #40E0FF 100%)', color: '#181c20', border: '2.5px solid #40E0FF', borderRadius: 18, cursor: loading ? 'wait' : 'pointer', marginBottom: 10, boxShadow: '0 6px 24px #40E0FF33, 0 1.5px 16px #40E0FF22', letterSpacing: 1.2, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', opacity: loading ? 0.7 : 1, textShadow: '0 2px 12px #40E0FF55', perspective: 400, transformStyle: 'preserve-3d' }} disabled={loading} onClick={handleCreateVaultOAuth}>Google OAuth Create Vault</button>
                            {/* File upload for OAuth local_share */}
                            <input type="file" accept=".enc,.txt" ref={fileInputRef} style={{ margin: '10px 0', width: '100%' }} onChange={handleLocalShareUpload} />
                            {/* Classic and OAuth unlock buttons */}
                            <button className="floating" style={{ width: '100%', padding: '18px', fontSize: 22, fontWeight: 900, background: 'linear-gradient(120deg, #FFD700 60%, #bfa43a 100%)', color: '#181c20', border: '2.5px solid #FFD700', borderRadius: 18, cursor: loading ? 'wait' : 'pointer', marginBottom: 10, boxShadow: '0 6px 24px #FFD70033, 0 1.5px 16px #FFD70022', letterSpacing: 1.2, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', opacity: loading ? 0.7 : 1, textShadow: '0 2px 12px #FFD70055', perspective: 400, transformStyle: 'preserve-3d' }} disabled={loading} onClick={handleUnlockVaultClassic}>Classic Unlock Vault</button>
                            <button className="floating" style={{ width: '100%', padding: '18px', fontSize: 22, fontWeight: 900, background: 'linear-gradient(120deg, #00F5D4 60%, #40E0FF 100%)', color: '#181c20', border: '2.5px solid #40E0FF', borderRadius: 18, cursor: loading ? 'wait' : 'pointer', marginBottom: 10, boxShadow: '0 6px 24px #40E0FF33, 0 1.5px 16px #40E0FF22', letterSpacing: 1.2, transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', opacity: loading ? 0.7 : 1, textShadow: '0 2px 12px #40E0FF55', perspective: 400, transformStyle: 'preserve-3d' }} disabled={loading} onClick={handleUnlockVaultOAuth}>OAuth Unlock Vault</button>
                            {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 700, fontSize: 16 }}>{error}</div>}
                            {success && <div style={{ color: '#22c55e', margin: '10px 0', fontWeight: 700, fontSize: 16 }}>{success}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    {page === 'documentation' && (
                      <div style={{ marginTop: 32 }}>
                        <Documentation />
                      </div>
                    )}
                    {page === 'verification' && (
                      <div style={{ marginTop: 32 }}>
                        <Verification />
                      </div>
                    )}
                  </div>
                );
              }