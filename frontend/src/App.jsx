// frontend/src/App.jsx
import React, { useState } from 'react';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';
import Cyber3DShapes from './Cyber3DShapes';
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
        // You can now route to the main vault page or setPage('vault')
      } else {
        setError(data.message || 'Unlock failed.');
      }
    } catch (e) {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <TopRightNav onNavigate={handleNavigate} />
      </div>
<<<<<<< HEAD
      {page === 'login' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', background: '#151A21', borderRadius: 28, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #00F5D422', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 className="floating" style={{ color: '#FFD66B', fontWeight: 800, fontSize: 40, textAlign: 'center', marginBottom: 8, letterSpacing: 1.2, textShadow: '0 2px 6px #FFD66B55' }}>Shamir Vault</h1>
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
                  border: '1.5px solid #00F5D4',
                  marginBottom: 14,
                  background: '#181c20',
                  color: '#eaf6fb',
                  outline: 'none',
                }}
              />
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
                  border: '1.5px solid #40E0FF',
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
                  background: 'linear-gradient(90deg, #151A21 60%, #00F5D4 100%)',
                  color: '#00F5D4',
                  border: '2px solid #00F5D4',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 18,
                  boxShadow: '0 2px 8px #00F5D422',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
                onClick={handleCreateVault}
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
                  background: 'linear-gradient(90deg, #151A21 60%, #40E0FF 100%)',
                  color: '#40E0FF',
                  border: '2px solid #40E0FF',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #40E0FF22',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
                onClick={handleUnlockVault}
              >
                Unlock Vault
              </button>
                    {error && <div style={{ color: '#ef4444', margin: '10px 0', fontWeight: 600 }}>{error}</div>}
                    {success && <div style={{ color: '#22c55e', margin: '10px 0', fontWeight: 600 }}>{success}</div>}
          <h1 className="floating" style={{ color: '#FFD66B', fontWeight: 800, fontSize: 40, textAlign: 'center', marginBottom: 8, letterSpacing: 1.2, textShadow: '0 2px 6px #FFD66B55' }}>Shamir Vault</h1>
      <Cyber3DShapes zIndex={1} />
          <p style={{ color: '#FFD66B', fontSize: '1.1rem', textAlign: 'center', marginBottom: 28, letterSpacing: 0.7, textShadow: '0 1px 4px #FFD66B44' }}>
            Secure Multi-Key Secret Management
          </p>
          {page === 'login' && (
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
                  border: '1.5px solid #00F5D4',
                  marginBottom: 14,
                  background: '#181c20',
                  color: '#eaf6fb',
                  outline: 'none',
                }}
              />
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
                  border: '1.5px solid #40E0FF',
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
                  background: 'linear-gradient(90deg, #151A21 60%, #00F5D4 100%)',
                  color: '#00F5D4',
                  border: '2px solid #00F5D4',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 18,
                  boxShadow: '0 2px 8px #00F5D422',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
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
                  background: 'linear-gradient(90deg, #151A21 60%, #40E0FF 100%)',
                  color: '#40E0FF',
                  border: '2px solid #40E0FF',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #40E0FF22',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
              >
                Unlock Vault
              </button>
            </div>
          </div>
        </div>
      )}
      {page === 'documentation' && (
        <Documentation onBack={() => setPage('login')} />
      )}
      {page === 'verification' && (
        <Verification onBack={() => setPage('login')} />
      )}
    </div>
  );
}