// frontend/src/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import VaultPage from './VaultPage';

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

// Animated Shield SVG Icon (reduced glow)
const ShieldIcon = () => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="shield-icon-wrapper"
  >
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{ stopColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#6366f1'] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.stop
            offset="100%"
            animate={{ stopColor: ['#8b5cf6', '#06b6d4', '#10b981', '#8b5cf6'] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </linearGradient>
      </defs>
      <motion.path
        d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11.99H18C17.47 15.11 15.72 17.77 12 18.93V12H6V6.3L12 4.19V11.99Z"
        fill="url(#shieldGradient)"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  </motion.div>
);

// Loading spinner component
const LoadingSpinner = ({ message, subMessage }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ textAlign: 'center', padding: '40px 20px' }}
  >
    <div className="spinner-container">
      <motion.div
        className="spinner-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="spinner-ring spinner-ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="gradient-text"
      style={{ fontSize: '1rem', marginBottom: '10px', marginTop: '25px' }}
    >
      {message}
    </motion.p>
    {subMessage && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ color: '#94a3b8', fontSize: '0.8rem' }}
      >
        {subMessage}
      </motion.p>
    )}
  </motion.div>
);

function App() {
  const [page, setPage] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  // Handle Login
  const handleLogin = async () => {
    setError('');
    const localShare = window.localStorage.getItem('local_share');
    if (!localShare) return setError('No local secret key found on this browser! Please use the device where you created the vault.');
    
    setLoading(true);
    setLoadingMsg('Unlocking your vault...');
    
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
    } finally {
      setLoading(false);
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
    setLoadingMsg('Creating your secure vault...');
    
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // --- RENDER LOGIN PAGE ---
  return (
    <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100dvh', flexDirection: 'column', padding: '10px' }}>
      <ParticlesBackground />
      <FloatingOrbs />
      <FlowingWaves />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ textAlign: 'center', marginBottom: 'clamp(15px, 4vh, 40px)', zIndex: 1 }}
      >
        <ShieldIcon />
        <motion.h1 
          className="gradient-text-animated"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', margin: 'clamp(10px, 2vh, 20px) 0 0 0', letterSpacing: '-1px', fontWeight: 700 }}
        >
          Shamir Vault
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: '#94a3b8', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', marginTop: '8px' }}
        >
          Secure Multi-Key Secret Management
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="glass-card card-glow" 
        style={{ padding: 'clamp(20px, 5vw, 50px)', width: 'clamp(300px, 90vw, 420px)', maxWidth: '95vw', zIndex: 1 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner 
              key="loading"
              message={loadingMsg} 
              subMessage="Please wait..."
            />
          ) : (
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <motion.input 
                  placeholder="Enter Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  className={focusedInput === 'username' ? 'input-focused' : ''}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="input-group">
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <motion.input 
                  placeholder="Master Password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className={focusedInput === 'password' ? 'input-focused' : ''}
                />
              </motion.div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 15 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                variants={itemVariants}
                style={{ marginTop: 'clamp(15px, 3vh, 25px)', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <motion.button 
                  onClick={handleRegister} 
                  className="btn-gradient-rainbow"
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Create New Vault
                </motion.button>
                
                <motion.button 
                  onClick={handleLogin} 
                  className="btn-gradient-cyan"
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                  </svg>
                  Unlock Vault
                </motion.button>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                style={{ marginTop: 'clamp(15px, 3vh, 30px)', textAlign: 'center' }}
              >
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;