import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CyberLogin3D from '../CyberLogin3D';
import FloatingShapes from '../FloatingShapes';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    window.sessionStorage.setItem('registration_attempted', '1');
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
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
        } else {
          data = null;
        }
      } catch (jsonErr) {
        data = null;
        setError('Failed to parse backend response.');
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

  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password) {
        setError('Please enter username and password.'); setLoading(false); return;
      }
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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
        setError('Failed to parse backend response.');
      }
      if (data && data.status === 'success') {
        setSuccess('Vault unlocked! Redirecting...');
        setTimeout(() => navigate('/vault'), 1000);
      } else {
        setError((data && data.message) || 'Unlock failed.');
      }
    } catch {
      setError('Network error unlocking vault.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}>
        <CyberLogin3D zIndex={2} />
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
      </div>
    </div>
  );
}
