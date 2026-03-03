// frontend/src/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { getErrorMessage, safeJSONParse } from './utils';
import * as FM from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import VaultPage from './VaultPage';

// API base URL - uses env variable in production, localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.info('[FRONTEND INIT] API_URL =', API_URL);

// Particles configuration - flowing dots moving gently
const particlesConfig = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'] },
    links: {
      color: '#6366f1',
      distance: 120,
      enable: true,
      opacity: 0.08,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'bounce' },
      random: true,
      speed: 0.8,
      straight: false,
      attract: { enable: true, rotateX: 600, rotateY: 1200 },
    },
    number: { density: { enable: true, area: 1000 }, value: 40 },
    opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.5, minimumValue: 0.1 } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

// Particles Background Component
const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesConfig}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

// Floating orb component (subtle version)
const FloatingOrbs = () => (
  <>
    <div className="floating-orb orb-1" />
    <div className="floating-orb orb-2" />
    <div className="floating-orb orb-3" />
    <div className="floating-orb orb-4" />
  </>
);

// AnimatedShapes removed (unused) to fix lint/errors

// Animated flowing wave at bottom
const FlowingWaves = () => (
  <div className="waves-container">
    <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0.15)" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
          <stop offset="50%" stopColor="rgba(16, 185, 129, 0.15)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
        </linearGradient>
      </defs>
      <g className="wave-parallax">
        <path className="wave wave1" fill="url(#waveGrad1)" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        <path className="wave wave2" fill="url(#waveGrad2)" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        <path className="wave wave3" fill="rgba(99, 102, 241, 0.05)" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </g>
    </svg>
  </div>
);

// Animated Shield SVG Icon (static position, only colors animate)
const ShieldIcon = () => (
  <div className="shield-icon-wrapper">
    <svg
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <FM.motion.stop
            offset="0%"
            animate={{ stopColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#6366f1'] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <FM.motion.stop
            offset="100%"
            animate={{ stopColor: ['#8b5cf6', '#06b6d4', '#10b981', '#8b5cf6'] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11.99H18C17.47 15.11 15.72 17.77 12 18.93V12H6V6.3L12 4.19V11.99Z"
        fill="url(#shieldGradient)"
      />
    </svg>
  </div>
);

// Loading spinner component
const LoadingSpinner = ({ message, subMessage }) => (
  <FM.motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ textAlign: 'center', padding: '40px 20px' }}
  >
    <div className="spinner-container">
      <FM.motion.div
        className="spinner-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <FM.motion.div
        className="spinner-ring spinner-ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <FM.motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="gradient-text"
      style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '25px' }}
    >
      {message}
    </FM.motion.p>
    {subMessage && (
      <FM.motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ color: '#94a3b8', fontSize: '0.8rem' }}
      >
        {subMessage}
      </FM.motion.p>
    )}
  </FM.motion.div>
);

function App() {
  const [page, setPage] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [error, setError] = useState('');
  const [mfaWarning, setMfaWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  // (now using shared getErrorMessage imported from ./utils)

  // ===== Handle Google OAuth callback (after redirect back from Google) =====
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regComplete = params.get('reg_complete');
    const regError = params.get('reg_error');
    
    // Clean the URL params
    if (regComplete || regError) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (regError) {
      console.warn('[FRONTEND] reg_error from backend:', regError);
      setLoading(false);
      // Handle Drive quota-specific error messages
      const lower = regError.toLowerCase();
      if (lower.includes('drive storage quota') || lower.includes('storagequotaexceeded') || lower.includes('quota')) {
        setError('Registration failed: Your Google Drive is full. Please free up space or sign in with a different Google account.');
        return;
      }
      setError('Registration failed: ' + regError);
      return;
    }

    const regMfa = params.get('reg_mfa');
    if (regMfa) {
      // Mark MFA warning but do NOT block the registration completion flow.
      setMfaWarning(true);
      setError('Warning: Your Google account does not appear to have 2-step verification (MFA) enabled. For better security, enable MFA in your Google account settings before continuing.');
      // continue — if reg_complete is present we'll finish registration below
    }

    if (regComplete) {
      setLoading(true);
      setLoadingMsg('Finalizing your vault...');

      fetch(`${API_URL}/api/register/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg_id: regComplete }),
      })
        .then(async (res) => {
          const text = await res.text();
          const data = safeJSONParse(text) || { status: 'error', message: 'Invalid JSON response', raw: text };
          console.info('[FRONTEND] /api/register/complete status=', res.status, 'ok=', res.ok, 'body=', data);
          if (!res.ok) {
            setLoading(false);
            setError('Registration complete failed: ' + (data.message || text || res.statusText));
            return;
          }
          if (data.status === 'success') {
            window.localStorage.setItem('local_share', data.local_share);
            setUsername(data.username);
            setGoldenKey(data.golden_key);
            setPage('vault');
          } else {
            setError('Registration Error: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(e => {
          const msg = getErrorMessage(e);
          console.error('Registration complete error:', e);
          setError('Failed to complete registration: ' + msg);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // Handle Login (unchanged - no Google needed)
  const handleLogin = async () => {
    setError('');
    const localShare = window.localStorage.getItem('local_share');
    if (!localShare) return setError('No local secret key found on this browser! Please use the device where you created the vault.');
    
    setLoading(true);
    setLoadingMsg('Unlocking your vault...');
    
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare }),
      });
      const text = await res.text();
      const data = safeJSONParse(text) || { status: 'error', message: 'Invalid JSON response', raw: text };
      console.info('[FRONTEND] /api/login status=', res.status, 'ok=', res.ok, 'body=', data);
      if (!res.ok) {
        setError('Login Error: ' + (data.message || text || res.statusText));
      } else if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setPage('vault');
      } else {
        setError('Login Error: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      const msg = getErrorMessage(e);
      console.error('Login error:', e);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError("Cannot connect to backend. Make sure the server is running.");
      } else {
        setError("Login failed: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration (NEW: redirects to Google for EACH user)
  const handleRegister = async () => {
    setError('');
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    setLoading(true);
    setLoadingMsg('Setting up your vault...');
    
    try {
          console.log('[FRONTEND] register:init ->', { API_URL, username });
        const res = await fetch(`${API_URL}/api/register/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        const data = safeJSONParse(text) || { status: 'error', message: 'Invalid JSON response', raw: text };
        console.info('[FRONTEND] /api/register/init status=', res.status, 'ok=', res.ok, 'body=', data);

        if (!res.ok) {
          setLoading(false);
          setError('Registration Error: ' + (data.message || text || res.statusText));
          return;
        }

        if (data.status === 'redirect') {
          setLoadingMsg('Redirecting to Google sign-in...');
          window.location.href = data.auth_url;
          return;
        } else if (data.status === 'success') {
          window.localStorage.setItem('local_share', data.local_share);
          setGoldenKey(data.golden_key);
          setPage('vault');
          setLoading(false);
        } else {
          setError('Registration Error: ' + (data.message || 'Unknown error'));
          setLoading(false);
        }
    } catch (e) {
      const msg = getErrorMessage(e);
      console.error('Registration error:', e);
      setLoading(false);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError("Cannot connect to backend. Make sure the server is running.");
      } else {
        setError("Registration failed: " + msg);
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
    return <VaultPage username={username} goldenKey={goldenKey} onLogout={handleLogout} mfaWarning={mfaWarning} />;
  }

  // animation variants removed (unused)

  // --- RENDER LOGIN PAGE ---
  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <FloatingOrbs />
      
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        zIndex: 10,
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <ShieldIcon />
          <h1 
            className="gradient-text-animated"
            style={{ fontSize: '1.6rem', margin: '6px 0 0 0', letterSpacing: '-0.5px', fontWeight: 700 }}
          >
            Shamir Vault
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Secure Multi-Key Secret Management
          </p>
        </div>
        
        <div 
          className="glass-card card-glow" 
          style={{ padding: '20px', width: '100%' }}
        >
        <FM.AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner 
              key="loading"
              message={loadingMsg} 
              subMessage="Please wait..."
            />
          ) : (
            <div key="form">
              <div className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input 
                  placeholder="Enter Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  className={focusedInput === 'username' ? 'input-focused' : ''}
                />
              </div>
              
              <div className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input 
                  placeholder="Master Password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className={focusedInput === 'password' ? 'input-focused' : ''}
                />
              </div>
              
              {error && (
                <div className="error-message" style={{ marginTop: 15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {error}
                </div>
              )}
              
              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={handleRegister} 
                  className="btn-gradient-rainbow"
                  style={{ width: '100%' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Create New Vault
                </button>
                
                <button 
                  onClick={handleLogin} 
                  className="btn-gradient-cyan"
                  style={{ width: '100%' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                  </svg>
                  Unlock Vault
                </button>
              </div>
              
              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <div className="security-badge" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#badgeGrad)" strokeWidth="2">
                    <defs>
                      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span style={{ background: 'linear-gradient(90deg, var(--pink), var(--purple), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Protected by Shamir's Secret Sharing</span>
                </div>
              </div>
            </div>
          )}
        </FM.AnimatePresence>
      </div>
      </div>
    </div>
  );
}

export default App;