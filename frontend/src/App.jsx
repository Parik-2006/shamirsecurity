// frontend/src/App.jsx
import React, { useState } from 'react';
import VaultPage from './VaultPage';

function App() {
  const [page, setPage] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // Handle Login (NO Google - uses Supabase + local share)
  const handleLogin = async () => {
    setError('');
    const localShare = window.localStorage.getItem('local_share');
    if (!localShare) return setError('No local secret key found on this browser! Please use the device where you created the vault.');
    
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare }),
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setPage('vault');
      } else {
        setError('Login Error: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      console.error('Login error:', e);
      if (e.message.includes('Failed to fetch')) {
        setError("Cannot connect to backend. Make sure the server is running on port 5000.");
      } else {
        setError("Login failed: " + (e.message || "Unknown error"));
      }
    }
  };

  // Handle Registration
  const handleRegister = async () => {
    setError('');
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true);
    setLoadingMsg('Opening Google sign-in...');
    
    try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        setLoading(false);
        
        if (data.status === 'success') {
          window.localStorage.setItem('local_share', data.local_share);
          // Go directly to vault page with the golden key
          setGoldenKey(data.golden_key);
          setPage('vault');
        } else {
          setError('Registration Error: ' + (data.message || 'Unknown error'));
        }
    } catch (e) {
      console.error('Registration error:', e);
      setLoading(false);
      if (e.message.includes('Failed to fetch')) {
        setError("Cannot connect to backend. Make sure the server is running on port 5000.");
      } else {
        setError("Registration failed: " + (e.message || "Unknown error"));
      }
    }
  };

  // Global Logout
  const handleLogout = () => { 
    setGoldenKey(null); 
    setPage('login'); 
    setUsername(''); 
    setPassword(''); 
    setError('');
  };

  // --- RENDER VAULT PAGE ---
  if (page === 'vault' && goldenKey) {
    return <VaultPage username={username} goldenKey={goldenKey} onLogout={handleLogout} />;
  }

  // --- RENDER LOGIN PAGE ---
  return (
    <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-1px' }}>🛡️ Shamir Vault</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Secure Multi-Key Secret Management</p>
      </div>
      
      <div className="glass-card" style={{ padding: '50px', width: '380px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
            <p style={{ color: '#4ade80', fontSize: '1rem' }}>{loadingMsg}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '10px' }}>A Google sign-in popup will appear. Complete sign-in there.</p>
          </div>
        ) : (
          <>
            <input placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Master Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleRegister} style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Create New Vault</button>
              <button onClick={handleLogin} style={{ backgroundColor: '#6366f1', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Unlock Vault</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;