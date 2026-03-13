import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

console.log('[DownloadShare] Component loaded');

/* ── Icons ──────────────────────────────────────────────────────── */
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

function AlertTriangleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function DriveIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 87.3 78" fill="none">
      <path d="M6.6 66.85L23.1 45.5H87.3L70.7 66.85Z" fill="rgba(100,210,195,0.55)"/>
      <path d="M29.15 0L0 50.2H43.65L72.8 0Z" fill="rgba(100,210,195,0.35)"/>
      <path d="M43.65 0L87.3 0L58.15 50.2H14.5Z" fill="rgba(100,210,195,0.45)"/>
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

/* ── Cyber Canvas Background ─────────────────────────────────────── */
function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* floating nodes */
    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.5,
    }));

    let scanY = 0;

    /* drifting hex chars */
    const CHARS = '0123456789ABCDEF01';
    const drifters = Array.from({ length: 24 }, () => ({
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      vy:       Math.random() * 0.35 + 0.12,
      char:     CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity:  Math.random() * 0.13 + 0.04,
      size:     Math.floor(Math.random() * 4) + 9,
      timer:    0,
      interval: Math.floor(Math.random() * 80) + 35,
      cyan:     Math.random() < 0.3,
    }));

    /* data pulse rings */
    const pulses = [];
    let pulseTimer = 0;

    /* circuit traces — L-shaped paths with traveling dots */
    const buildTraces = () =>
      Array.from({ length: Math.floor(window.innerWidth / 200) }, () => {
        const x1 = Math.random() * window.innerWidth;
        const y1 = Math.random() * window.innerHeight;
        const x2 = x1 + (Math.random() - 0.5) * 320;
        const y2 = y1 + (Math.random() - 0.5) * 220;
        const cx = Math.random() < 0.5 ? x2 : x1;
        const cy = Math.random() < 0.5 ? y1 : y2;
        return {
          pts: [[x1,y1],[cx,cy],[x2,y2]],
          alpha: Math.random() * 0.06 + 0.02,
          cyan: Math.random() < 0.45,
          dot: { t: Math.random(), speed: Math.random() * 0.003 + 0.001 },
        };
      });
    let traces = buildTraces();
    let frame = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* dot grid */
      ctx.fillStyle = 'rgba(255,215,80,0.05)';
      const step = 36;
      for (let x = 0; x < w; x += step)
        for (let y = 0; y < h; y += step) {
          ctx.beginPath(); ctx.arc(x, y, 0.7, 0, Math.PI * 2); ctx.fill();
        }

      /* circuit traces */
      traces.forEach(tr => {
        const [[x1,y1],[cx,cy],[x2,y2]] = tr.pts;
        const col = tr.cyan
          ? `rgba(90,210,190,${tr.alpha})`
          : `rgba(255,215,80,${tr.alpha})`;
        ctx.strokeStyle = col; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(cx,cy); ctx.lineTo(x2,y2); ctx.stroke();
        [[x1,y1],[cx,cy],[x2,y2]].forEach(([px,py]) => {
          ctx.beginPath(); ctx.arc(px,py,1.5,0,Math.PI*2);
          ctx.fillStyle = col; ctx.fill();
        });
        tr.dot.t = (tr.dot.t + tr.dot.speed) % 1;
        const t = tr.dot.t;
        const px = t < 0.5 ? lerp(x1,cx,t*2) : lerp(cx,x2,(t-0.5)*2);
        const py = t < 0.5 ? lerp(y1,cy,t*2) : lerp(cy,y2,(t-0.5)*2);
        ctx.beginPath(); ctx.arc(px,py,2,0,Math.PI*2);
        ctx.fillStyle = tr.cyan ? 'rgba(90,210,190,0.6)' : 'rgba(255,215,80,0.6)';
        ctx.fill();
      });

      /* node connections */
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 150) {
            ctx.strokeStyle = `rgba(255,215,80,${(1-d/150)*0.08})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
          }
        }

      /* nodes */
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,215,80,0.18)'; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      /* scan line */
      scanY = (scanY + 0.45) % h;
      const sg = ctx.createLinearGradient(0, scanY-55, 0, scanY+55);
      sg.addColorStop(0,   'rgba(255,215,80,0)');
      sg.addColorStop(0.5, 'rgba(255,215,80,0.035)');
      sg.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, scanY-55, w, 110);
      ctx.strokeStyle = 'rgba(255,215,80,0.055)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0,scanY); ctx.lineTo(w,scanY); ctx.stroke();

      /* pulse rings */
      pulseTimer++;
      if (pulseTimer % 120 === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        pulses.push({ x:n.x, y:n.y, r:0, maxR:85, alpha:0.28 });
      }
      for (let i = pulses.length-1; i >= 0; i--) {
        const p = pulses[i];
        p.r += 1.1; p.alpha = 0.28*(1-p.r/p.maxR);
        ctx.strokeStyle = `rgba(255,215,80,${p.alpha})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.stroke();
        if (p.r >= p.maxR) pulses.splice(i,1);
      }

      /* drifting hex chars */
      drifters.forEach(d => {
        d.timer++;
        if (d.timer >= d.interval) { d.char = CHARS[Math.floor(Math.random()*CHARS.length)]; d.timer = 0; }
        ctx.font = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = d.cyan ? `rgba(100,220,200,${d.opacity})` : `rgba(255,215,80,${d.opacity})`;
        ctx.fillText(d.char, d.x, d.y);
        d.y += d.vy;
        if (d.y > h+20) { d.y = -20; d.x = Math.random()*w; }
      });

      if (frame % 1800 === 0) traces = buildTraces();
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ── Decorative rings centered behind the two cards ─────────────── */
function CenterRings() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(900px, 95vw)',
      height: 'min(600px, 80vh)',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '40%',
          border: '1px solid rgba(255,215,80,0.05)',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '8%',
          borderRadius: '38%',
          border: '1px dashed rgba(100,210,195,0.04)',
        }}
      />
      <div style={{
        position: 'absolute', inset: '28%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,80,0.03) 0%, transparent 70%)',
      }} />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function DownloadShare() {
  /* ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ── */
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);

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

  /* ── UI ────────────────────────────────────────────────────────── */
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
      padding: '32px 20px',
    }}>

      {/* Layer 0 — animated canvas */}
      <CyberBackground />

      {/* Layer 1 — decorative rings */}
      <CenterRings />

      {/* Layer 2 — two-column card grid */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        width: '100%',
        maxWidth: 960,
        alignItems: 'stretch',
      }}
        className="download-grid"
      >

        {/* ── LEFT CARD: Download Recovery Share ── */}
        <motion.div
          initial={{ opacity: 0, x: -24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(19,22,27,0.86)',
            border: '1px solid rgba(255,215,80,0.15)',
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,80,0.04) inset',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
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
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--gold)',
                boxShadow: '0 0 28px rgba(255,215,80,0.12)',
              }}
            >
              <ShieldIcon size={28} />
            </motion.div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
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

          {/* Warning box */}
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
                    background: 'var(--bg-elevated)', padding: '1px 6px',
                    borderRadius: 4, color: 'var(--gold)', fontSize: '0.77rem',
                  }}>local_share.enc</code>
                  {' '}is your personal cryptographic share — required every time you unlock your vault.
                  Without it, vault access is permanently lost. Store it in a secure location.
                </p>
              </div>
            </div>
          </div>

          {/* Bullet points */}
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 9 }}>
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
                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--gold)', flexShrink: 0,
                  opacity: 0.55, boxShadow: '0 0 4px rgba(255,215,80,0.4)',
                }} />
                {txt}
              </motion.div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="sv-alert sv-alert-error" style={{ marginBottom: 20 }}>{error}</div>
          )}

          {/* Download CTA */}
          <div style={{ marginTop: 'auto' }}>
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
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginTop: 18,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--green)', boxShadow: '0 0 5px rgba(74,222,128,0.55)',
              }} />
              <span style={{
                fontSize: '0.62rem', color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Shamir (2-of-3) · End-to-end encrypted
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT CARD: Google Drive Share Info ── */}
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(16,26,28,0.88)',
            border: '1px solid rgba(90,210,190,0.18)',
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(90,210,190,0.04) inset',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 18 }}
              style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'rgba(90,210,190,0.08)',
                border: '1px solid rgba(90,210,190,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 28px rgba(90,210,190,0.1)',
              }}
            >
              <DriveIcon size={30} />
            </motion.div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10,
            }}>
              Google Drive Share
            </h2>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(90,210,190,0.1)',
              border: '1px solid rgba(90,210,190,0.22)',
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(90,210,190,0.9)',
            }}>
              Share 1 of 3
            </span>
          </div>

          {/* Info box */}
          <div style={{
            background: 'rgba(90,210,190,0.055)',
            border: '1px solid rgba(90,210,190,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(90,210,190,0.9)', marginBottom: 7 }}>
              Automatically saved to your Drive
            </p>
            <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              During Google OAuth registration, <strong style={{ color: 'rgba(90,210,190,0.8)' }}>Share 1</strong> was
              automatically stored in your Google Drive. This is your cloud cryptographic fragment —
              it is combined with your local share and the server share to reconstruct the vault key.
            </p>
          </div>

          {/* Checklist */}
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { text: 'Stored automatically via Google OAuth', done: true },
              { text: 'Encrypted — unreadable without other shares', done: true },
              { text: 'Verify it exists in your Google Drive', done: false },
              { text: 'Do not delete or move this file', done: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem' }}
              >
                <span style={{
                  color: item.done ? 'rgba(90,210,190,0.8)' : 'rgba(255,215,80,0.55)',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {item.done
                    ? <CheckCircleIcon size={14} />
                    : <AlertTriangleIcon size={14} />}
                </span>
                <span style={{ color: item.done ? 'var(--text-secondary)' : 'rgba(255,215,80,0.75)' }}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Open Drive button */}
          <div style={{ marginTop: 'auto' }}>
            <motion.a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, height: 52, width: '100%',
                background: 'rgba(90,210,190,0.1)',
                border: '1px solid rgba(90,210,190,0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'rgba(90,210,190,0.9)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem', fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 16px rgba(90,210,190,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(90,210,190,0.18)';
                e.currentTarget.style.boxShadow  = '0 0 24px rgba(90,210,190,0.14)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(90,210,190,0.1)';
                e.currentTarget.style.boxShadow  = '0 0 16px rgba(90,210,190,0.06)';
              }}
            >
              <DriveIcon size={20} />
              Open Google Drive
            </motion.a>

            {/* Status bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginTop: 18,
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(90,210,190,0.8)',
                boxShadow: '0 0 5px rgba(90,210,190,0.5)',
              }} />
              <span style={{
                fontSize: '0.62rem', color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Cloud share · Auto-synced
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Responsive: collapse to single column on mobile */}
      <style>{`
        @media (max-width: 720px) {
          .download-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
