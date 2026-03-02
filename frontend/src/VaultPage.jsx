// frontend/src/VaultPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Particles configuration for vault page
const particlesConfig = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: ['#6366f1', '#8b5cf6', '#06b6d4'] },
    links: { color: '#6366f1', distance: 100, enable: true, opacity: 0.06, width: 1 },
    move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: true, speed: 0.5, straight: false },
    number: { density: { enable: true, area: 1200 }, value: 30 },
    opacity: { value: { min: 0.05, max: 0.25 } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 2 } },
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
      id="tsparticles-vault"
      init={particlesInit}
      options={particlesConfig}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

// Floating background orbs (subtle)
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
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.12)" />
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.15)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0.12)" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.08)" />
          <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.08)" />
        </linearGradient>
      </defs>
      <g className="wave-parallax">
        <path className="wave wave1" fill="url(#waveGrad1)" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        <path className="wave wave2" fill="url(#waveGrad2)" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </g>
    </svg>
  </div>
);

// SVG Icons
const Icons = {
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m1 1 22 22M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    </svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  vault: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="8" x2="12" y2="4"/>
      <line x1="12" y1="20" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  key: (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
};

// Animated loading spinner
const LoadingSpinner = ({ text = "Loading..." }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ textAlign: 'center', padding: '60px' }}
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
      className="gradient-text"
      style={{ marginTop: '25px' }}
    >
      {text}
    </motion.p>
  </motion.div>
);

// Generate dynamic vibrant color based on string
const getServiceColor = (str) => {
  const colors = [
    ['#ec4899', '#f472b6', '#fce7f3'], // Pink
    ['#8b5cf6', '#a78bfa', '#ede9fe'], // Purple
    ['#06b6d4', '#22d3ee', '#cffafe'], // Cyan
    ['#10b981', '#34d399', '#d1fae5'], // Emerald
    ['#f97316', '#fb923c', '#ffedd5'], // Orange
    ['#f43f5e', '#fb7185', '#ffe4e6'], // Rose
    ['#6366f1', '#818cf8', '#e0e7ff'], // Indigo
    ['#14b8a6', '#2dd4bf', '#ccfbf1'], // Teal
    ['#eab308', '#facc15', '#fef9c3'], // Yellow
    ['#d946ef', '#e879f9', '#fae8ff'], // Fuchsia
    ['#0ea5e9', '#38bdf8', '#e0f2fe'], // Sky
    ['#84cc16', '#a3e635', '#ecfccb'], // Lime
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Password row component with animations
const PasswordRow = ({ item, index, isVisible, onToggleVisibility }) => {
  const [copied, setCopied] = useState(false);
  const colors = getServiceColor(item.service);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(item.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ backgroundColor: `${colors[0]}08` }}
    >
      <td style={{ padding: '14px 16px' }}>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'white',
              boxShadow: `0 3px 12px ${colors[0]}30`,
              border: `2px solid ${colors[2]}`
            }}
          >
            {item.service.charAt(0).toUpperCase()}
          </motion.div>
          <span style={{ fontWeight: 500, color: colors[0] }}>{item.service}</span>
        </motion.div>
      </td>
      <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '0.9rem' }}>
        {item.username || <span style={{ color: '#64748b', fontStyle: 'italic' }}>No username</span>}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.span 
            style={{ fontFamily: 'monospace', letterSpacing: isVisible ? '0' : '2px' }}
          >
            {isVisible ? item.password : '••••••••••••'}
          </motion.span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <motion.button 
              onClick={() => onToggleVisibility(index)}
              className="icon-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isVisible ? 'Hide' : 'Show'}
            >
              {isVisible ? Icons.eyeOff : Icons.eye}
            </motion.button>
            <motion.button
              onClick={handleCopy}
              className={`icon-btn ${copied ? 'icon-btn-success' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Copy"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : Icons.copy}
            </motion.button>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

function VaultPage({ username, goldenKey, onLogout }) {
  const [vaultData, setVaultData] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('view');
  const [refreshing, setRefreshing] = useState(false);
  
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const fetchVault = useCallback(async (isRefresh = false) => {
    if (!goldenKey) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/get_passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, golden_key: goldenKey }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setVaultData(data.passwords);
      } else {
        setError('Failed to load vault: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      console.error("Vault Fetch Error", e);
      setError('Network error loading vault');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [username, goldenKey]);

  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  const handleAddPassword = async () => {
    if (!newService || !newPass) {
      setError("Please fill Service name and Password");
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/add_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          golden_key: goldenKey,
          service_name: newService, 
          service_username: newServiceUser, 
          password_to_save: newPass
        }),
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        setNewService(''); 
        setNewServiceUser(''); 
        setNewPass('');
        await fetchVault();
        setPage('view'); 
      } else {
        setError("Save Error: " + (data.message || "Unknown error"));
      }
    } catch (e) {
      console.error("Storage Error:", e);
      setError("Save failed: " + (e.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Add Entry Form View
  if (page === 'add') {
    return (
      <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh' }}>
        <FloatingOrbs />
        <motion.div 
          className="glass-card card-glow" 
          style={{ padding: '50px', width: '480px', zIndex: 1 }}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '30px' }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5 }}
              className="form-icon gradient-icon"
            >
              {Icons.lock}
            </motion.div>
            <h2 className="gradient-text-animated" style={{ margin: '15px 0 0 0', fontSize: '1.8rem' }}>Add New Secret</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
              Encrypt and store securely in your vault
            </p>
          </motion.div>
          
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: '20px' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="input-group">
              <div className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <input 
                placeholder="Service (e.g. GitHub, Netflix)" 
                value={newService} 
                onChange={e => setNewService(e.target.value)}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="input-group">
              <div className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input 
                placeholder="Service Username (optional)" 
                value={newServiceUser} 
                onChange={e => setNewServiceUser(e.target.value)}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="input-group">
              <div className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input 
                type="password" 
                placeholder="Password to encrypt" 
                value={newPass} 
                onChange={e => setNewPass(e.target.value)}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ marginTop: '25px' }}>
              <motion.button 
                onClick={handleAddPassword} 
                disabled={loading}
                className="btn-gradient-primary"
                style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ display: 'flex' }}
                    >
                      {Icons.refresh}
                    </motion.span>
                    Encrypting...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    {Icons.lock}
                    Store in Vault
                  </span>
                )}
              </motion.button>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ marginTop: '12px' }}>
              <motion.button 
                onClick={() => { setError(''); setPage('view'); }} 
                className="btn-ghost"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {Icons.back}
                Back to Vault
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main Vault View
  return (
    <div className="app-wrapper" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <ParticlesBackground />
      <FloatingOrbs />
      <FlowingWaves />
      
      <motion.header 
        className="vault-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: 'clamp(10px, 2vw, 20px) clamp(15px, 3vw, 30px)', flexWrap: 'wrap', gap: 'clamp(10px, 2vw, 15px)' }}
      >
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 15px)' }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="header-icon"
            style={{ width: 'clamp(36px, 8vw, 48px)', height: 'clamp(36px, 8vw, 48px)' }}
          >
            {Icons.vault}
          </motion.div>
          <div>
            <h2 className="gradient-text-animated" style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>{username}'s Vault</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 'clamp(0.7rem, 2vw, 0.8rem)' }}>
              {vaultData.length} secret{vaultData.length !== 1 ? 's' : ''} stored securely
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          style={{ display: 'flex', gap: 'clamp(6px, 2vw, 12px)', flexWrap: 'wrap' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            onClick={() => setPage('add')} 
            className="btn-gradient-rainbow"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {Icons.plus}
            <span style={{ marginLeft: '8px' }}>Add New</span>
          </motion.button>
          <motion.button 
            onClick={() => fetchVault(true)} 
            className="btn-gradient-cyan"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={refreshing}
          >
            <motion.span 
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              style={{ display: 'flex' }}
            >
              {Icons.refresh}
            </motion.span>
            <span style={{ marginLeft: '8px' }}>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </motion.button>
          <motion.button 
            onClick={onLogout} 
            className="btn-gradient-pink"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {Icons.logout}
            <span style={{ marginLeft: '8px' }}>Logout</span>
          </motion.button>
        </motion.div>
      </motion.header>

      <main style={{ padding: 'clamp(15px, 4vw, 40px) clamp(15px, 5vw, 50px)', position: 'relative', zIndex: 1, flex: 1, overflow: 'auto' }}>
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ marginBottom: '25px' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner key="loading" text="Decrypting your vault..." />
          ) : (
            <motion.div 
              key="content"
              className="glass-card" 
              style={{ overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {vaultData.length === 0 ? (
                <motion.div 
                  style={{ textAlign: 'center', padding: '80px 40px' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="empty-state-icon"
                  >
                    {Icons.key}
                  </motion.div>
                  <h3 style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '10px', marginTop: '20px' }}>
                    Your vault is empty
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '25px' }}>
                    Start by adding your first secret
                  </p>
                  <motion.button
                    onClick={() => setPage('add')}
                    className="btn-gradient-success"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {Icons.plus}
                    <span style={{ marginLeft: '8px' }}>Add Your First Secret</span>
                  </motion.button>
                </motion.div>
              ) : (
                <table className="vault-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Username</th>
                      <th>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {vaultData.map((item, i) => (
                        <PasswordRow
                          key={`${item.service}-${i}`}
                          item={item}
                          index={i}
                          isVisible={visiblePasswords[i]}
                          onToggleVisibility={(idx) => 
                            setVisiblePasswords({...visiblePasswords, [idx]: !visiblePasswords[idx]})
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default VaultPage;
