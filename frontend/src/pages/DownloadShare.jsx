import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

console.log('[DownloadShare] Component loaded');

/* ── Icons ─────────────────────────────────────────────────── */
function DownloadIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ShieldIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function AlertTriangleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
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

    /* ── Nodes ── */
    const nodes = Array.from({ length: 38 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  Math.random() * 1.6 + 0.5,
    }));

    /* ── Scan line ── */
    let scanY = 0;

    /* ── Hex/binary drift chars — mix gold + faint cyan ── */
    const CHARS = '0123456789ABCDEF01';
    const drifters = Array.from({ length: 22 }, () => ({
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      vy:       Math.random() * 0.35 + 0.12,
      char:     CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity:  Math.random() * 0.14 + 0.04,
      size:     Math.floor(Math.random() * 4) + 9,
      timer:    0,
      interval: Math.floor(Math.random() * 80) + 35,
      cyan:     Math.random() < 0.25, // 25% get muted cyan tint
    }));

    /* ── Data-pulse rings that expand from random nodes ── */
    const pulses = [];
    let pulseTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      /* dot grid */
      ctx.fillStyle = 'rgba(255,215,80,0.055)';
      const step = 36;
      for (let x = 0; x < w; x += step)
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

      /* connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            const a = (1 - d / 150) * 0.085;
            ctx.strokeStyle = `rgba(255,215,80,${a})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      /* nodes */
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,215,80,0.20)';
        ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      /* scan line */
      scanY = (scanY + 0.45) % h;
      const sg = ctx.createLinearGradient(0, scanY - 55, 0, scanY + 55);
      sg.addColorStop(0,   'rgba(255,215,80,0)');
      sg.addColorStop(0.5, 'rgba(255,215,80,0.038)');
      sg.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 55, w, 110);
      ctx.strokeStyle = 'rgba(255,215,80,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(w, scanY); ctx.stroke();

      /* data-pulse rings */
      pulseTimer++;
      if (pulseTimer % 120 === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        pulses.push({ x: n.x, y: n.y, r: 0, maxR: 80, alpha: 0.3 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.r    += 1.1;
        p.alpha = 0.3 * (1 - p.r / p.maxR);
        ctx.strokeStyle = `rgba(255,215,80,${p.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        if (p.r >= p.maxR) pulses.splice(i, 1);
      }

      /* drifting hex chars */
      drifters.forEach(d => {
        d.timer++;
        if (d.timer >= d.interval) {
          d.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          d.timer = 0;
        }
        ctx.font = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = d.cyan
          ? `rgba(100,220,200,${d.opacity})`
          : `rgba(255,215,80,${d.opacity})`;
        ctx.fillText(d.char, d.x, d.y);
        d.y += d.vy;
        if (d.y > h + 20) { d.y = -20; d.x = Math.random() * w; }
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

/* ── Decorative Rings (behind card) ───────────────────────── */
function CenterRings() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(560px, 92vw)',
      height: 'min(560px, 92vw)',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      {/* Outer slow-spin ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(255,215,80,0.07)',
        }}
      />
      {/* Mid counter-spin dashed ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '10%',
          borderRadius: '50%',
          border: '1px dashed rgba(255,215,80,0.05)',
        }}
      />
      {/* Inner subtle glow */}
      <div style={{
        position: 'absolute', inset: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,80,0.05) 0%, transparent 70%)',
      }} />
      {/* Four tick marks */}
      {[0, 90, 180, 270].map(deg => (
        <div key={deg} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 10, height: 2,
          background: 'rgba(255,215,80,0.16)',
          borderRadius: 1,
          transform: `rotate(${deg}deg) translateX(calc(min(560px, 92vw) * 0.46)) translateY(-50%)`,
          transformOrigin: '0 50%',
        }} />
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export default function DownloadShare() {
  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  console.log('[DownloadShare] location.pathname:', location.pathname, 'location.search:', location.search);

  const localShareData = params.get('local_share');
  const goldenKey      = params.get('golden_key');
  const username       = params.get('username');

  let error = '';
  if (!localShareData || !goldenKey || !username) {
    error = 'Missing registration data. Please retry registration.';
    console.warn('[DownloadShare] Missing registration data:', { localShareData, goldenKey, username });
  }

  if (username && goldenKey) {
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    localStorage.setItem('justRegistered', 'true');
    console.log('[DownloadShare] Setting vaultUser:', username, 'goldenKey:', goldenKey);
  }

  const handleDownload = () => {
    console.log('[DownloadShare] Download button clicked');
    if (!localShareData) return;
    setDownloading(true);
    const blob = new Blob([localShareData], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'local_share.enc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloading(false);
    console.log('[DownloadShare] Navigating to /registration-vault');
    navigate('/registration-vault', { replace: true });
  };

  /* ── UI ── */
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Animated canvas layer */}
      <CyberBackground />

      {/* Decorative rings centered behind the card */}
      <CenterRings />

      {/* Download card — centered, z above everything */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 500,
          padding: '0 20px',
        }}
      >
        <div style={{
          background: 'rgba(19,22,27,0.84)',
          border: '1px solid rgba(255,215,80,0.14)',
          borderRadius: 20,
          padding: '40px 36px',
          backdropFilter: 'blur(22px)',
          boxShadow: '0 8px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,80,0.04) inset',
        }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 220, damping: 18 }}
              style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'rgba(255,215,80,0.09)',
                border: '1px solid rgba(255,215,80,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--gold)',
                boxShadow: '0 0 28px rgba(255,215,80,0.1)',
              }}
            >
              <ShieldIcon size={28} />
            </motion.div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10,
            }}>
              Save Your Recovery Share
            </h2>

            {username && (
              <span className="sv-badge sv-badge-gold" style={{ fontSize: '0.7rem' }}>
                {username}
              </span>
            )}
          </div>

          {/* ── Warning box ── */}
          <div style={{
            background: 'rgba(255,215,80,0.055)',
            border: '1px solid rgba(255,215,80,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>
                <AlertTriangleIcon size={16} />
              </span>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold)', marginBottom: 7 }}>
                  Critical: Keep this file safe
                </p>
                <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  <code style={{
                    background: 'var(--bg-elevated)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    color: 'var(--gold)',
                    fontSize: '0.77rem',
                  }}>local_share.enc</code>
                  {' '}is your personal cryptographic share — required every time you unlock your vault.
                  Without it, vault access is permanently lost. Store it in a secure location.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bullet points ── */}
          <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              'Required for vault unlock on any device',
              'Combined with Google Drive & Supabase shares',
              'Never stored on our servers',
            ].map((txt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.08 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                  opacity: 0.55,
                  boxShadow: '0 0 4px rgba(255,215,80,0.4)',
                }} />
                {txt}
              </motion.div>
            ))}
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="sv-alert sv-alert-error" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* ── Download CTA ── */}
          {!error && !downloaded && localShareData && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="sv-btn sv-btn-primary sv-btn-full"
              onClick={handleDownload}
              disabled={downloading}
              style={{ height: 52, fontSize: '0.93rem', gap: 10 }}
            >
              {downloading ? <span className="sv-spinner" /> : <DownloadIcon size={18} />}
              {downloading ? 'Preparing…' : 'Download local_share.enc'}
            </motion.button>
          )}

          {/* Status bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 20,
          }}>
            <div style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 5px rgba(74,222,128,0.55)',
            }} />
            <span style={{
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Shamir (2-of-3) · End-to-end encrypted
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
