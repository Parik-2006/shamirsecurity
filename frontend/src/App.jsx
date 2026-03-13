import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import UnlockWithShare from './UnlockWithShare';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "https://shamirsecurity-098.onrender.com";

if (typeof window !== 'undefined') {
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}

/* ── Icons ─────────────────────────────────────────────────── */
function LockIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

/* ── Cyber Canvas Background ───────────────────────────────── */
function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Grid nodes ── */
    const NODE_COUNT = 42;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.8 + 0.6,
    }));

    /* ── Scan-line state ── */
    let scanY = 0;
    const SCAN_SPEED = 0.5;

    /* ── Hex particles ── */
    const HEX = '0123456789ABCDEF';
    const hexParticles = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: Math.random() * 0.4 + 0.15,
      char: HEX[Math.floor(Math.random() * 16)],
      opacity: Math.random() * 0.18 + 0.05,
      size: Math.floor(Math.random() * 5) + 9,
      timer: 0,
      interval: Math.floor(Math.random() * 90) + 40,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      /* ── Dot grid background ── */
      ctx.fillStyle = 'rgba(255,215,80,0.06)';
      const step = 38;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ── Node connections ── */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.09;
            ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      /* ── Nodes ── */
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,215,80,0.22)';
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      /* ── Horizontal scan line ── */
      scanY = (scanY + SCAN_SPEED) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scanGrad.addColorStop(0,   'rgba(255,215,80,0)');
      scanGrad.addColorStop(0.5, 'rgba(255,215,80,0.04)');
      scanGrad.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 60, w, 120);

      // Thin bright line at scan tip
      ctx.strokeStyle = 'rgba(255,215,80,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      /* ── Floating hex chars ── */
      hexParticles.forEach(p => {
        p.timer++;
        if (p.timer >= p.interval) {
          p.char = HEX[Math.floor(Math.random() * 16)];
          p.timer = 0;
        }
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(255,215,80,${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
        p.y += p.vy;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ── Top-Right Nav ─────────────────────────────────────────── */
function TopNav() {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      style={{
        position: 'fixed',
        top: 20,
        right: 24,
        display: 'flex',
        gap: 8,
        zIndex: 20,
      }}
    >
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => navigate('/documentation')}
        style={{
          background: 'rgba(13,15,18,0.7)',
          border: '1px solid rgba(255,215,80,0.14)',
          color: 'rgba(255,215,80,0.65)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          padding: '7px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.35)';
          e.currentTarget.style.color = 'rgba(255,215,80,1)';
          e.currentTarget.style.background = 'rgba(255,215,80,0.07)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.14)';
          e.currentTarget.style.color = 'rgba(255,215,80,0.65)';
          e.currentTarget.style.background = 'rgba(13,15,18,0.7)';
        }}
      >Documentation</motion.button>
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        onClick={() => navigate('/verification')}
        style={{
          background: 'rgba(13,15,18,0.7)',
          border: '1px solid rgba(255,215,80,0.14)',
          color: 'rgba(255,215,80,0.65)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          padding: '7px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.35)';
          e.currentTarget.style.color = 'rgba(255,215,80,1)';
          e.currentTarget.style.background = 'rgba(255,215,80,0.07)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.14)';
          e.currentTarget.style.color = 'rgba(255,215,80,0.65)';
          e.currentTarget.style.background = 'rgba(13,15,18,0.7)';
        }}
      >Verification</motion.button>
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.29 }}
        onClick={() => navigate('/about')}
        style={{
          background: 'rgba(13,15,18,0.7)',
          border: '1px solid rgba(255,215,80,0.14)',
          color: 'rgba(255,215,80,0.65)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          padding: '7px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.35)';
          e.currentTarget.style.color = 'rgba(255,215,80,1)';
          e.currentTarget.style.background = 'rgba(255,215,80,0.07)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,215,80,0.14)';
          e.currentTarget.style.color = 'rgba(255,215,80,0.65)';
          e.currentTarget.style.background = 'rgba(13,15,18,0.7)';
        }}
      >About</motion.button>
    </motion.nav>
  );
}

/* ── Glass Grid Panel (decorative focal point) ─────────────── */
function GlassGridPanel() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(520px, 90vw)',
      height: 'min(520px, 90vw)',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(255,215,80,0.07)',
        }}
      />
      {/* Middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: '12%',
          borderRadius: '50%',
          border: '1px dashed rgba(255,215,80,0.05)',
        }}
      />
      {/* Inner glow */}
      <div style={{
        position: 'absolute',
        inset: '32%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,80,0.04) 0%, transparent 70%)',
      }} />
      {/* Corner tick marks */}
      {[0, 90, 180, 270].map(deg => (
        <div key={deg} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 12, height: 2,
          background: 'rgba(255,215,80,0.18)',
          borderRadius: 1,
          transform: `rotate(${deg}deg) translateX(${Math.min(520, window.innerWidth * 0.9) * 0.46}px) translateY(-50%)`,
          transformOrigin: '0 50%',
        }} />
      ))}
    </div>
  );
}

/* ── Auth Success Page ─────────────────────────────────────── */
export function AuthSuccessPage() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const regComplete = params.get('reg_complete');
  const message = error
    ? decodeURIComponent(error.replace(/\+/g, ' '))
    : regComplete ? 'Registration complete! You may now download your share.' : '';

  return (
    <div className="sv-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="sv-card"
        style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}
      >
        <div style={{ marginBottom: 24 }}>
          <LockIcon size={40} color={error ? 'var(--red)' : 'var(--gold)'} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>
          Registration Status
        </h2>
        <p style={{ color: error ? 'var(--red)' : 'var(--gold)', marginBottom: 28, fontSize: '0.9rem' }}>
          {message}
        </p>
        <button className="sv-btn sv-btn-primary" onClick={() => window.location.href = '/'}>
          Go to Home
        </button>
      </motion.div>
    </div>
  );
}

/* ── Main App ──────────────────────────────────────────────── */
function App() {
  const location = useLocation();

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  let vaultUser = localStorage.getItem('vaultUser');
  let goldenKey  = localStorage.getItem('goldenKey');
  let justRegistered = localStorage.getItem('justRegistered') === 'true';
  const [credentialsReady, setCredentialsReady] = useState(false);

  const navigate = useNavigate();
  const [page, setPage] = useState('login');
  const [unlockStep, setUnlockStep] = useState('login');
  const [pendingUnlock, setPendingUnlock] = useState({ username: '', password: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vaultPage, setVaultPage] = useState(false);
  const [localShare, setLocalShare] = useState(null);
  const [showAbout, setShowAbout] = useState(() => {
    try { return !sessionStorage.getItem('about_seen'); } catch { return true; }
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    if (location.pathname === '/vault' || location.pathname === '/download-share') {
      const u = localStorage.getItem('vaultUser');
      const k = localStorage.getItem('goldenKey');
      if (u && k) { setCredentialsReady(true); setVaultPage(true); }
      else { setCredentialsReady(false); }
    }
  }, [location]);

  useEffect(() => {
    function handleRegistrationComplete(event) {
      if (event.data && (event.data.type === 'registration-complete' || event.data.type === 'registration-finish')) {
        setRegistrationComplete(false);
        navigate(`/download-share?reg_complete=${encodeURIComponent(event.data.reg_complete)}`);
        try { window.sessionStorage.removeItem('registration_attempted'); } catch {}
      }
    }
    window.addEventListener('message', handleRegistrationComplete);
    return () => window.removeEventListener('message', handleRegistrationComplete);
  }, [navigate]);

  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try { window.sessionStorage.setItem('registration_attempted', '1'); } catch {}
    try {
      if (!username || !password) { setError('Please enter username and password.'); setLoading(false); return; }
      if (!API_URL) { setError('API URL is not configured.'); setLoading(false); return; }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      let res;
      try {
        res = await fetch(`${API_URL}/api/register/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name === 'AbortError') { setError('Vault creation timed out. Please try again.'); }
        else { setError('Network error: ' + err.message); }
        setLoading(false); return;
      } finally { clearTimeout(timeoutId); }
      if (!res) { setError('No response received from backend.'); setLoading(false); return; }
      const contentType = res.headers.get('Content-Type');
      let raw = ''; let data = null;
      try {
        raw = await res.text();
        if (raw && contentType && contentType.includes('application/json')) data = JSON.parse(raw);
      } catch (jsonErr) { setError('Error parsing backend response: ' + jsonErr.message); setLoading(false); return; }
      if (data && data.auth_url) { setSuccess('Redirecting to Google sign-in…'); window.location.href = data.auth_url; return; }
      if (data && data.message) setError('Vault creation failed: ' + data.message);
      else if (raw) setError('Vault creation failed. Backend says: ' + raw);
      else setError('Vault creation failed. No response from backend.');
    } catch (err) {
      setError('Could not connect to the server. Error: ' + err.message);
    } finally { setLoading(false); }
  };

  const handleUnlockLogin = async () => {
    setError(''); setSuccess(''); setLoading(true);
    if (!username || !password) { setError('Please enter username and password.'); setLoading(false); return; }
    setPendingUnlock({ username, password });
    setUnlockStep('uploadShare');
    setLoading(false);
  };

  const handleUnlockWithShare = (goldenKey, username) => {
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    setVaultPage(true);
    setCredentialsReady(true);
    setUnlockStep('login');
    setPendingUnlock({ username: '', password: '' });
  };

  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password || !localShare) {
        setError('Please enter username, password, and upload your local_share.enc file.'); setLoading(false); return;
      }
      if (!API_URL) { setError('API URL is not configured.'); setLoading(false); return; }
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare })
      });
      const contentType = res.headers.get('Content-Type');
      let raw = ''; let data = null;
      try {
        raw = await res.text();
        if (raw && contentType && contentType.includes('application/json')) data = JSON.parse(raw);
      } catch { data = null; }
      if (data && data.status === 'success') {
        localStorage.setItem('goldenKey', data.golden_key);
        localStorage.setItem('vaultUser', username);
        setVaultPage(true);
        setSuccess('Vault unlocked!');
      } else {
        setError((data && data.message) || 'Unlock failed.');
      }
    } catch { setError('Network error unlocking vault.'); }
    finally { setLoading(false); }
  };

  const handleNavigate = (target) => {
    if (target === 'about') {
      setShowAbout(true);
      try { sessionStorage.setItem('about_seen', '1'); } catch {}
    } else { setPage(target); }
  };

  // ── Route guards ──
  if (vaultPage && localStorage.getItem('justRegistered') === 'true') {
    setTimeout(() => localStorage.setItem('justRegistered', 'false'), 0);
    return <RegistrationVaultPage />;
  }
  if (vaultPage && credentialsReady && localStorage.getItem('justRegistered') !== 'true') {
    vaultUser = localStorage.getItem('vaultUser');
    goldenKey  = localStorage.getItem('goldenKey');
    return (
      <VaultPage
        username={vaultUser}
        goldenKey={goldenKey}
        onLogout={() => {
          setVaultPage(false);
          setPage('login');
          localStorage.removeItem('vaultUser');
          localStorage.removeItem('goldenKey');
        }}
      />
    );
  }

  /* ── Login Page UI ─────────────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">

      {/* ── Step 1: Login form ── */}
      {page === 'login' && unlockStep === 'login' && (
        <motion.div
          key="login-centered"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            background: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Animated canvas background */}
          <CyberBackground />

          {/* Decorative rings behind the card */}
          <GlassGridPanel />

          {/* Top-right navigation */}
          <TopNav onNavigate={handleNavigate} />

          {/* Centered login stack */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: 400,
              padding: '0 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            {/* Logo + Title + Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ textAlign: 'center', marginBottom: 32 }}
            >
              {/* Logo mark */}
              <div style={{
                width: 56, height: 56,
                borderRadius: '16px',
                background: 'rgba(255,215,80,0.08)',
                border: '1px solid rgba(255,215,80,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 32px rgba(255,215,80,0.1)',
              }}>
                <LockIcon size={26} color="var(--gold)" />
              </div>

              {/* Heading */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '2rem',
                color: 'var(--gold)',
                letterSpacing: '0.03em',
                margin: 0,
                lineHeight: 1.1,
              }}>
                Shamir Vault
              </h1>

              {/* Subtitle */}
              <p style={{
                marginTop: 8,
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
              }}>
                Secure Multi-Key Secret Management
              </p>
            </motion.div>

            {/* Glass card with inputs + buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.32, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                background: 'rgba(19,22,27,0.82)',
                border: '1px solid rgba(255,215,80,0.13)',
                borderRadius: 20,
                padding: '32px 28px 28px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,215,80,0.04) inset',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Username */}
              <div style={{ marginBottom: 16 }}>
                <label className="sv-label">Username</label>
                <input
                  className="sv-input"
                  type="text"
                  id="login-username"
                  name="username"
                  placeholder="your_username"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('login-password')?.focus()}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label className="sv-label">Master Password</label>
                <input
                  className="sv-input"
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateVault()}
                />
              </div>

              {/* Error / Success messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginBottom: 14 }}
                  >
                    <div className="sv-alert sv-alert-error">{error}</div>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginBottom: 14 }}
                  >
                    <div className="sv-alert sv-alert-success">{success}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Create Vault button */}
              <button
                className="sv-btn sv-btn-primary sv-btn-full"
                onClick={handleCreateVault}
                disabled={loading}
                style={{ height: 48, marginBottom: 10 }}
              >
                {loading && <span className="sv-spinner" />}
                Create New Vault
              </button>

              {/* Unlock Vault button */}
              <button
                className="sv-btn sv-btn-secondary sv-btn-full"
                onClick={handleUnlockLogin}
                disabled={loading}
                style={{ height: 48 }}
              >
                {loading && (
                  <span className="sv-spinner" style={{ borderTopColor: 'var(--text-secondary)' }} />
                )}
                Unlock Vault
              </button>

              {/* Footer hint */}
              <p style={{
                marginTop: 20,
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                textAlign: 'center',
                lineHeight: 1.65,
              }}>
                Vault creation requires Google OAuth for multi-share key distribution.
              </p>
            </motion.div>

            {/* Status indicator row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 18,
              }}
            >
              <div style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'var(--green)',
                boxShadow: '0 0 6px rgba(74,222,128,0.6)',
              }} />
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                End-to-end encrypted · Shamir (2-of-3)
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Step 2: Upload share ── */}
      {page === 'login' && unlockStep === 'uploadShare' && (
        <motion.div
          key="unlock-share"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UnlockWithShare
            username={pendingUnlock.username}
            password={pendingUnlock.password}
            onUnlock={handleUnlockWithShare}
            onBack={() => { setUnlockStep('login'); setPendingUnlock({ username: '', password: '' }); }}
          />
        </motion.div>
      )}

    </AnimatePresence>
  );
}

export default App;
