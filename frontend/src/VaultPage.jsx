// frontend/src/VaultPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from './utils';
import * as FM from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import FloatingShapes from './FloatingShapes';

// API base URL - uses env variable in production, localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  <FM.motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ textAlign: 'center', padding: '60px' }}
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
      className="gradient-text"
      style={{ marginTop: '25px' }}
    >
      {text}
    </FM.motion.p>
  </FM.motion.div>
);

// Generate dynamic color based on string (dark palette only)
const getServiceColor = (str) => {
  const colors = [
    ['#00fff7', '#22d3ee', '#0a192f'], // Cyan
    ['#00ff85', '#34d399', '#181c20'], // Green
    ['#ffe600', '#facc15', '#181c20'], // Yellow
    ['#0a192f', '#181c20', '#eaf6fb'], // Deep blue/charcoal
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Map common service names to their domains for logo fetching
const getServiceDomain = (serviceName) => {
  const normalizedName = serviceName.toLowerCase().trim();
  
  // Common service mappings
  const domainMap = {
    'netflix': 'netflix.com',
    'prime': 'amazon.com',
    'amazon prime': 'amazon.com',
    'amazon': 'amazon.com',
    'github': 'github.com',
    'google': 'google.com',
    'gmail': 'gmail.com',
    'facebook': 'facebook.com',
    'instagram': 'instagram.com',
    'twitter': 'twitter.com',
    'x': 'x.com',
    'linkedin': 'linkedin.com',
    'spotify': 'spotify.com',
    'discord': 'discord.com',
    'slack': 'slack.com',
    'dropbox': 'dropbox.com',
    'microsoft': 'microsoft.com',
    'outlook': 'outlook.com',
    'apple': 'apple.com',
    'icloud': 'icloud.com',
    'paypal': 'paypal.com',
    'stripe': 'stripe.com',
    'twitch': 'twitch.tv',
    'reddit': 'reddit.com',
    'pinterest': 'pinterest.com',
    'snapchat': 'snapchat.com',
    'tiktok': 'tiktok.com',
    'youtube': 'youtube.com',
    'whatsapp': 'whatsapp.com',
    'telegram': 'telegram.org',
    'zoom': 'zoom.us',
    'notion': 'notion.so',
    'figma': 'figma.com',
    'adobe': 'adobe.com',
    'canva': 'canva.com',
    'trello': 'trello.com',
    'jira': 'atlassian.com',
    'bitbucket': 'bitbucket.org',
    'gitlab': 'gitlab.com',
    'heroku': 'heroku.com',
    'vercel': 'vercel.com',
    'netlify': 'netlify.com',
    'aws': 'aws.amazon.com',
    'azure': 'azure.microsoft.com',
    'digitalocean': 'digitalocean.com',
    'cloudflare': 'cloudflare.com',
    'steam': 'steampowered.com',
    'epic': 'epicgames.com',
    'epic games': 'epicgames.com',
    'playstation': 'playstation.com',
    'psn': 'playstation.com',
    'xbox': 'xbox.com',
    'nintendo': 'nintendo.com',
    'hotstar': 'hotstar.com',
    'disney': 'disney.com',
    'disney+': 'disneyplus.com',
    'disneyplus': 'disneyplus.com',
    'hbo': 'hbomax.com',
    'hulu': 'hulu.com',
    'crunchyroll': 'crunchyroll.com',
    'ebay': 'ebay.com',
    'walmart': 'walmart.com',
    'target': 'target.com',
    'flipkart': 'flipkart.com',
    'myntra': 'myntra.com',
    'zomato': 'zomato.com',
    'swiggy': 'swiggy.com',
    'uber': 'uber.com',
    'ola': 'olacabs.com',
    'airbnb': 'airbnb.com',
    'booking': 'booking.com',
    'expedia': 'expedia.com',
    'coursera': 'coursera.org',
    'udemy': 'udemy.com',
    'skillshare': 'skillshare.com',
    'duolingo': 'duolingo.com',
    'khan academy': 'khanacademy.org',
    'medium': 'medium.com',
    'substack': 'substack.com',
    'wordpress': 'wordpress.com',
    'tumblr': 'tumblr.com',
    'quora': 'quora.com',
    'stackoverflow': 'stackoverflow.com',
    'stack overflow': 'stackoverflow.com',
    'hackerrank': 'hackerrank.com',
    'leetcode': 'leetcode.com',
    'codechef': 'codechef.com',
    'codeforces': 'codeforces.com',
    'behance': 'behance.net',
    'dribbble': 'dribbble.com',
    'producthunt': 'producthunt.com',
    'product hunt': 'producthunt.com',
  };
  
  // Check direct mapping
  if (domainMap[normalizedName]) {
    return domainMap[normalizedName];
  }
  
  // Check if service name contains a known keyword
  for (const [key, domain] of Object.entries(domainMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return domain;
    }
  }
  
  // Try to construct domain from service name
  const cleanName = normalizedName.replace(/[^a-z0-9]/g, '');
  return `${cleanName}.com`;
};

// ServiceLogo component - fetches real logos dynamically
const ServiceLogo = ({ serviceName }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  useEffect(() => {
    const domain = getServiceDomain(serviceName);
    // Use Google's favicon service (more reliable) with fallback to Clearbit
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const clearbitLogo = `https://logo.clearbit.com/${domain}`;
    
    // Try Clearbit first for higher quality logos
    const img = new Image();
    img.onload = () => {
      setLogoUrl(clearbitLogo);
      setLogoLoaded(true);
    };
    img.onerror = () => {
      // Fallback to Google favicon
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setLogoUrl(googleFavicon);
        setLogoLoaded(true);
      };
      fallbackImg.onerror = () => {
        setLogoError(true);
      };
      fallbackImg.src = googleFavicon;
    };
    img.src = clearbitLogo;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [serviceName]);
  
  // Fallback to letter-based icon
  if (logoError || !logoLoaded) {
    return (
      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
        {serviceName.charAt(0).toUpperCase()}
      </span>
    );
  }
  
  return (
    <img
      src={logoUrl}
      alt={serviceName}
      style={{
        width: '24px',
        height: '24px',
        objectFit: 'contain',
        borderRadius: '4px',
      }}
      onError={() => setLogoError(true)}
    />
  );
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
    <FM.motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ backgroundColor: `${colors[0]}08` }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <td style={{ padding: '16px 20px', width: '25%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'white',
              boxShadow: `0 4px 12px ${colors[0]}30`,
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <ServiceLogo serviceName={item.service} colors={colors} />
          </div>
          <span style={{ fontWeight: 700, color: colors[0], textTransform: 'uppercase', fontSize: '0.95rem', letterSpacing: '0.5px' }}>{item.service}</span>
        </div>
      </td>
      <td style={{ padding: '16px 20px', color: '#cbd5e1', fontSize: '0.95rem', width: '25%' }}>
        {item.username || <span style={{ color: '#64748b', fontStyle: 'italic' }}>-</span>}
      </td>
      <td style={{ padding: '16px 20px', width: '25%' }}>
        <span style={{ 
          fontFamily: 'monospace', 
          letterSpacing: isVisible ? '1px' : '3px', 
          fontSize: '1rem', 
          color: isVisible ? '#10b981' : '#e2e8f0',
          fontWeight: isVisible ? 500 : 400
        }}>
          {isVisible ? item.password : '••••••••••••'}
        </span>
      </td>
      <td style={{ padding: '16px 20px', width: '25%' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
          <FM.motion.button 
            onClick={() => onToggleVisibility(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isVisible ? 'Hide Password' : 'Show Password'}
            style={{ 
              padding: '10px 16px', 
              borderRadius: '8px', 
              background: isVisible ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
              border: isVisible ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(34, 197, 94, 0.5)',
              color: isVisible ? '#ef4444' : '#22c55e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              minWidth: '90px'
            }}
          >
            {isVisible ? Icons.eyeOff : Icons.eye}
            <span>{isVisible ? 'Hide' : 'Show'}</span>
          </FM.motion.button>
          <FM.motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy Password"
            style={{ 
              padding: '10px 16px', 
              borderRadius: '8px',
              background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: copied ? '2px solid rgba(34, 197, 94, 0.5)' : '2px solid rgba(99, 102, 241, 0.5)',
              color: copied ? '#22c55e' : '#6366f1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              minWidth: '90px'
            }}
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : Icons.copy}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </FM.motion.button>
        </div>
      </td>
    </FM.motion.tr>
  );
};

function VaultPage({ username, goldenKey, onLogout, mfaWarning }) {
  const [vaultData, setVaultData] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('view');
  const [refreshing, setRefreshing] = useState(false);
  const [showMfaBanner, setShowMfaBanner] = useState(!!mfaWarning);
  
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const fetchVault = useCallback(async (isRefresh = false) => {
    if (!goldenKey) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/get_passwords`, {
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
      const msg = getErrorMessage(e);
      console.error("Vault Fetch Error", e);
      setError('Network error loading vault: ' + msg);
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
      const res = await fetch(`${API_URL}/api/add_password`, {
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
      const msg = getErrorMessage(e);
      console.error("Storage Error:", e);
      setError("Save failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // (removed unused animation variant objects)

  // Add Entry Form View
  if (page === 'add') {
    return (
      <div className="app-wrapper">
        <ParticlesBackground />
        <AnimatedShapes />
        <FloatingOrbs />
        
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 10, 
          width: '90%', 
          maxWidth: '420px'
        }}>
          <div 
            className="glass-card card-glow" 
            style={{ padding: '30px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="form-icon gradient-icon">
                {Icons.lock}
              </div>
              <h2 className="gradient-text-animated" style={{ margin: '12px 0 0 0', fontSize: '1.5rem' }}>Add New Secret</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>
                Encrypt and store securely in your vault
              </p>
            </div>
            
            {error && (
              <div className="error-message" style={{ marginBottom: '15px' }}>
                {error}
              </div>
            )}
            
            <div>
              <div className="input-group">
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
              </div>
              <div className="input-group">
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
              </div>
              <div className="input-group">
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
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={handleAddPassword} 
                  disabled={loading}
                  className="btn-gradient-primary"
                  style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      {Icons.refresh}
                      Encrypting...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      {Icons.lock}
                      Store in Vault
                    </span>
                  )}
                </button>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => { setError(''); setPage('view'); }} 
                  className="btn-ghost"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {Icons.back}
                  Back to Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Vault View
  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <FloatingShapes zIndex={0} />
      
      <div style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}>
        <div className="glass-card" style={{ 
          padding: '30px 40px', 
          width: '95vw', 
          maxWidth: '1400px', 
          margin: '0 auto',
          minWidth: '900px'
        }}>
          {showMfaBanner && (
            <div style={{ marginBottom: '12px' }}>
              <div className="info-message" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4"/>
                    <circle cx="12" cy="16" r="1"/>
                  </svg>
                  <div>
                    <strong>Warning:</strong> Your Google account does not appear to have 2-step verification (MFA) enabled. For better security, enable MFA in your Google account settings.
                  </div>
                </div>
                <button onClick={() => setShowMfaBanner(false)} className="btn-ghost" style={{ padding: '6px 10px' }}>Dismiss</button>
              </div>
            </div>
          )}

          <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="header-icon" style={{ width: 48, height: 48 }}>
                {Icons.vault}
              </div>
              <div>
                <h2 className="gradient-text-animated" style={{ margin: 0, fontSize: '1.5rem' }}>{username}'s Vault</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  {vaultData.length} secret{vaultData.length !== 1 ? 's' : ''} stored
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setPage('add')} className="btn-gradient-rainbow" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                {Icons.plus}
                <span style={{ marginLeft: '8px' }}>Add</span>
              </button>
              <button onClick={() => fetchVault(true)} className="btn-gradient-cyan" disabled={refreshing} style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                {Icons.refresh}
              </button>
              <button onClick={onLogout} className="btn-gradient-pink" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
                {Icons.logout}
              </button>
            </div>
          </header>

          {error && (
            <div className="error-message" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}
          
          {loading ? (
            <LoadingSpinner key="loading" text="Decrypting your vault..." />
          ) : vaultData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div className="empty-state-icon">
                {Icons.key}
              </div>
              <h3 style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '10px', marginTop: '20px', fontSize: '1.1rem' }}>
                Your vault is empty
              </h3>
              <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>
                Start by adding your first secret
              </p>
              <button onClick={() => setPage('add')} className="btn-gradient-success" style={{ padding: '12px 24px' }}>
                {Icons.plus}
                <span style={{ marginLeft: '8px' }}>Add Your First Secret</span>
              </button>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '18px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '25%' }}>Service</th>
                    <th style={{ padding: '18px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '25%' }}>Username</th>
                    <th style={{ padding: '18px 20px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '25%' }}>Password</th>
                    <th style={{ padding: '18px 20px', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '25%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VaultPage;
