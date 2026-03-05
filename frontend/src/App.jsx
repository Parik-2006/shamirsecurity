// frontend/src/App.jsx
import React, { useState } from 'react';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';
import Cyber3DShapes from './Cyber3DShapes';
import VaultPage from './VaultPage';
import logoLock from './assets/shamir_logo_lock.png';

function TopRightNav({ onNavigate }) {
  const gold = '#FFD700';
  const btnStyle = {
    background: 'linear-gradient(90deg, #151A21 60%, #FFD700 100%)',
    color: gold,
    border: `2.5px solid ${gold}`,
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 15,
    padding: '10px 22px',
    margin: 0,
    boxShadow: '0 4px 18px #FFD70055, 0 1.5px 16px #FFD70022',
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
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => onNavigate('documentation')} style={btnStyle}>
        <span style={{ color: gold }}>Documentation</span>
      </button>
      <button onClick={() => onNavigate('verification')} style={btnStyle}>
        <span style={{ color: gold }}>Verification</span>
      import VaultPage from './VaultPage';
      </button>
    </div>
  );
}

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

  const handleNavigate = (target) => {
    setPage(target);
  };

  // Helper: get local share from localStorage
  const getLocalShare = (username) => {
    try {
      return localStorage.getItem(`local_share_${username}`);
    } catch {
      return null;
    }
  };

  // Helper: set local share in localStorage
  const setLocalShare = (username, value) => {
    try {
      localStorage.setItem(`local_share_${username}`, value);
    } catch {}
  };

  // Handler: Create New Vault
  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      // Call backend to create vault
      const res = await fetch('/api/create_vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLocalShare(username, data.local_share); // Save local share
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

  // Handler: Unlock Vault (Login)
  const handleUnlockVault = async () => {
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
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <TopRightNav onNavigate={handleNavigate} />
      </div>
      {page === 'login' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(ellipse at 60% 40%, #23272b 60%, #181c20 100%)', boxShadow: '0 0 120px #FFD70022 inset' }}>
          <div style={{ maxWidth: 440, width: '98vw', padding: '44px 28px', background: 'linear-gradient(135deg, #181c20 80%, #23272b 100%)', borderRadius: 32, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #FFD70022', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #FFD70055', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <img src={logoLock} alt="Shamir Lock Logo" style={{ height: 38, width: 'auto', marginBottom: 6, background: 'none', borderRadius: 12, border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033', padding: 0, objectFit: 'contain', filter: 'drop-shadow(0 1px 6px #FFD70066)' }} />
              <h1 className="floating" style={{ color: '#FFD700', fontWeight: 800, fontSize: 28, textAlign: 'center', margin: 0, letterSpacing: 1.1, textShadow: '0 1px 6px #FFD70055, 0 1.5px 8px #FFD70022' }}>Shamir Vault</h1>
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
                  padding: '16px',
                  fontSize: 19,
                  fontWeight: 800,
                  background: 'linear-gradient(120deg, #23272b 60%, #181c20 100%)',
                  color: '#FFD700',
                  border: '2px solid #FFD700',
                  borderRadius: 14,
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: 10,
                  boxShadow: '0 2px 8px #FFD70022',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  opacity: loading ? 0.7 : 1,
                  textShadow: '0 1px 6px #FFD70055',
                  perspective: 400,
                  transformStyle: 'preserve-3d',
                }}
                disabled={loading}
                onClick={handleCreateVault}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04) rotateY(6deg)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                {loading ? 'Creating...' : 'Create New Vault'}
              </button>
              <button
                className="floating"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 19,
                  fontWeight: 800,
                  background: 'linear-gradient(120deg, #23272b 60%, #181c20 100%)',
                  color: '#FFD700',
                  border: '2px solid #FFD700',
                  borderRadius: 14,
                  cursor: loading ? 'wait' : 'pointer',
                  marginBottom: 10,
                  boxShadow: '0 2px 8px #FFD70022',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  opacity: loading ? 0.7 : 1,
                  textShadow: '0 1px 6px #FFD70055',
                  perspective: 400,
                  transformStyle: 'preserve-3d',
                }}
                disabled={loading}
                onClick={handleUnlockVault}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04) rotateY(-6deg)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                {loading ? 'Unlocking...' : 'Unlock Vault'}
              </button>
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