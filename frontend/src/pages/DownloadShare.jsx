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

/* ── Ultra-Dark Cyber Canvas Background ─────────────────────────── */
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

    /* ── Floating nodes ── */
    const nodes = Array.from({ length: 55 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.8 + 0.4,
      cyan: Math.random() < 0.25,
    }));

    /* ── Two alternating scan lines ── */
    let scanY1 = 0;
    let scanY2 = 0;

    /* ── Drifting hex matrix rain ── */
    const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
    const matrixCols = Math.floor(window.innerWidth / 22);
    const matrixDrops = Array.from({ length: matrixCols }, () => ({
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 0.9 + 0.3,
      opacity: Math.random() * 0.09 + 0.02,
      char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      timer: 0,
      interval: Math.floor(Math.random() * 25) + 10,
      cyan: Math.random() < 0.2,
      size: Math.floor(Math.random() * 4) + 9,
    }));

    /* ── Circuit traces with traveling dots ── */
    const buildTraces = () =>
      Array.from({ length: Math.max(8, Math.floor(w / 160)), }, () => {
        const x1 = Math.random() * w;
        const y1 = Math.random() * h;
        const x2 = x1 + (Math.random() - 0.5) * 380;
        const y2 = y1 + (Math.random() - 0.5) * 260;
        const cx = Math.random() < 0.5 ? x2 : x1;
        const cy = Math.random() < 0.5 ? y1 : y2;
        return {
          pts: [[x1,y1],[cx,cy],[x2,y2]],
          alpha: Math.random() * 0.055 + 0.015,
          cyan: Math.random() < 0.4,
          dot: { t: Math.random(), speed: Math.random() * 0.0025 + 0.0008 },
        };
      });
    let traces = buildTraces();

    /* ── Expanding pulse rings ── */
    const pulses = [];
    let pulseTimer = 0;

    /* ── Corner vignette hexagons ── */
    const hexRing = Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      dist: 0.42,
      pulse: Math.random() * Math.PI * 2,
    }));

    /* ── Data stream lines (vertical) ── */
    const dataStreams = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: Math.random() * 120 + 40,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.06 + 0.02,
      cyan: Math.random() < 0.35,
    }));

    let frame = 0;
    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      /* Deep dark base — no clearRect, use fill with very low alpha for trails */
      ctx.fillStyle = 'rgba(5,5,8,0.88)';
      ctx.fillRect(0, 0, w, h);
      frame++;

      /* ── Dot grid background ── */
      ctx.fillStyle = 'rgba(255,215,80,0.028)';
      const step = 34;
      for (let x = 0; x < w; x += step)
        for (let y = 0; y < h; y += step) {
          ctx.beginPath(); ctx.arc(x, y, 0.6, 0, Math.PI * 2); ctx.fill();
        }

      /* ── Deep corner radial vignettes ── */
      const corners = [[0,0],[w,0],[0,h],[w,h]];
      corners.forEach(([cx, cy]) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.45);
        grad.addColorStop(0, 'rgba(0,0,0,0.55)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      /* ── Circuit traces ── */
      traces.forEach(tr => {
        const [[x1,y1],[cx2,cy],[x2,y2]] = tr.pts;
        const col = tr.cyan
          ? `rgba(60,200,180,${tr.alpha})`
          : `rgba(255,215,80,${tr.alpha})`;
        ctx.strokeStyle = col; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(cx2,cy); ctx.lineTo(x2,y2); ctx.stroke();

        [[x1,y1],[cx2,cy],[x2,y2]].forEach(([px,py]) => {
          ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI*2);
          ctx.fillStyle = col; ctx.fill();
        });

        tr.dot.t = (tr.dot.t + tr.dot.speed) % 1;
        const t = tr.dot.t;
        const px = t < 0.5 ? lerp(x1,cx2,t*2) : lerp(cx2,x2,(t-0.5)*2);
        const py = t < 0.5 ? lerp(y1,cy,t*2) : lerp(cy,y2,(t-0.5)*2);
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2);
        ctx.fillStyle = tr.cyan ? 'rgba(60,200,180,0.75)' : 'rgba(255,215,80,0.75)';
        ctx.fill();
        /* glow around dot */
        const glow = ctx.createRadialGradient(px,py,0,px,py,8);
        glow.addColorStop(0, tr.cyan ? 'rgba(60,200,180,0.18)' : 'rgba(255,215,80,0.18)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(px,py,8,0,Math.PI*2); ctx.fill();
      });

      /* ── Node connections ── */
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 140) {
            const a = (1 - d/140) * (nodes[i].cyan || nodes[j].cyan ? 0.11 : 0.07);
            ctx.strokeStyle = nodes[i].cyan ? `rgba(60,200,180,${a})` : `rgba(255,215,80,${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
          }
        }

      /* ── Nodes ── */
      nodes.forEach(n => {
        const col = n.cyan ? 'rgba(60,200,180,0.22)' : 'rgba(255,215,80,0.18)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = col; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      /* ── Dual scan lines (gold + cyan) ── */
      scanY1 = (scanY1 + 0.38) % h;
      scanY2 = (scanY2 + 0.22) % h;
      [[scanY1,'rgba(255,215,80,'],[scanY2,'rgba(60,200,180,']].forEach(([sy, base]) => {
        const sg = ctx.createLinearGradient(0, sy-70, 0, sy+70);
        sg.addColorStop(0,   base + '0)');
        sg.addColorStop(0.5, base + '0.028)');
        sg.addColorStop(1,   base + '0)');
        ctx.fillStyle = sg; ctx.fillRect(0, sy-70, w, 140);
        ctx.strokeStyle = base + '0.05)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(w,sy); ctx.stroke();
      });

      /* ── Vertical data stream lines ── */
      dataStreams.forEach(ds => {
        const col = ds.cyan ? 'rgba(60,200,180,' : 'rgba(255,215,80,';
        const g = ctx.createLinearGradient(ds.x, ds.y, ds.x, ds.y + ds.len);
        g.addColorStop(0, col+'0)');
        g.addColorStop(0.5, col+(ds.opacity)+')');
        g.addColorStop(1, col+'0)');
        ctx.strokeStyle = col + ds.opacity + ')'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(ds.x, ds.y); ctx.lineTo(ds.x, ds.y + ds.len); ctx.stroke();
        ds.y += ds.speed;
        if (ds.y > h + 160) { ds.y = -160; ds.x = Math.random() * w; }
      });

      /* ── Pulse rings from random nodes ── */
      pulseTimer++;
      if (pulseTimer % 90 === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        pulses.push({ x:n.x, y:n.y, r:0, maxR:110, alpha:0.32, cyan: n.cyan });
      }
      for (let i = pulses.length-1; i >= 0; i--) {
        const p = pulses[i];
        p.r += 1.3; p.alpha = 0.32 * (1 - p.r/p.maxR);
        const col = p.cyan ? `rgba(60,200,180,${p.alpha})` : `rgba(255,215,80,${p.alpha})`;
        ctx.strokeStyle = col; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
        if (p.r >= p.maxR) pulses.splice(i, 1);
      }

      /* ── Matrix rain ── */
      matrixDrops.forEach((d, i) => {
        d.timer++;
        if (d.timer >= d.interval) {
          d.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          d.timer = 0;
        }
        ctx.font = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = d.cyan
          ? `rgba(60,200,180,${d.opacity})`
          : `rgba(255,215,80,${d.opacity})`;
        ctx.fillText(d.char, i * 22, d.y);
        d.y += d.speed;
        if (d.y > h + 20) { d.y = -20; }
      });

      /* ── Center glow behind cards ── */
      const cx = w / 2, cy = h / 2;
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w,h) * 0.45);
      centerGlow.addColorStop(0, 'rgba(255,215,80,0.025)');
      centerGlow.addColorStop(0.5, 'rgba(20,10,50,0.0)');
      centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      if (frame % 1400 === 0) traces = buildTraces();
      animId = requestAnimationFrame(draw);
    };

    /* Initialize scan lines at different heights */
    scanY1 = h * 0.3;
    scanY2 = h * 0.7;
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

/* ── Decorative Rings centered behind two cards ──────────────────── */
function CenterRings() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(1000px, 96vw)',
      height: 'min(640px, 82vh)',
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      {/* Outer slow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '38%',
          border: '1px solid rgba(255,215,80,0.04)',
        }}
      />
      {/* Inner counter ring - cyan */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: '6%',
          borderRadius: '36%',
          border: '1px dashed rgba(60,200,180,0.05)',
        }}
      />
      {/* Innermost glow */}
      <div style={{
        position: 'absolute', inset: '25%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,80,0.025) 0%, transparent 70%)',
      }} />
      {/* Four corner tick marks */}
      {[0,90,180,270].map(deg => (
        <div key={deg} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 14, height: 1.5,
          background: 'rgba(255,215,80,0.14)',
          borderRadius: 1,
          transformOrigin: '0 50%',
          transform: `rotate(${deg}deg) translateX(340px) translateY(-50%)`,
        }} />
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function DownloadShare() {
  const [downloading, setDownloading] = useState(false);
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
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* Layer 0 — animated canvas */}
      <CyberBackground />

      {/* Layer 1 — decorative rings */}
      <CenterRings />

      {/* Layer 2 — centered two-column card grid */}
      <div
        className="download-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          width: 'min(960px, calc(100vw - 48px))',
          alignItems: 'stretch',
          margin: '0 auto',
        }}
      >

        {/* ── LEFT CARD: Download Recovery Share ── */}
        <motion.div
          initial={{ opacity: 0, x: -28, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(13,15,18,0.92)',
            border: '1px solid rgba(255,215,80,0.16)',
            borderRadius: 22,
            padding: '40px 36px',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,215,80,0.04) inset, 0 0 40px rgba(255,215,80,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.14, type: 'spring', stiffness: 200, damping: 16 }}
              style={{
                width: 68, height: 68,
                borderRadius: '50%',
                background: 'rgba(255,215,80,0.07)',
                border: '1px solid rgba(255,215,80,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--gold)',
                boxShadow: '0 0 36px rgba(255,215,80,0.14), 0 0 80px rgba(255,215,80,0.05)',
              }}
            >
              <ShieldIcon size={30} />
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
            background: 'rgba(255,215,80,0.045)',
            border: '1px solid rgba(255,215,80,0.18)',
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.09 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--gold)', flexShrink: 0,
                  opacity: 0.6, boxShadow: '0 0 5px rgba(255,215,80,0.45)',
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
            {!error && localShareData && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46 }}
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
                background: 'var(--green)', boxShadow: '0 0 6px rgba(74,222,128,0.6)',
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
          initial={{ opacity: 0, x: 28, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(8,18,20,0.93)',
            border: '1px solid rgba(60,200,180,0.18)',
            borderRadius: 22,
            padding: '40px 36px',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(60,200,180,0.04) inset, 0 0 40px rgba(60,200,180,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.22, type: 'spring', stiffness: 200, damping: 16 }}
              style={{
                width: 68, height: 68,
                borderRadius: '50%',
                background: 'rgba(60,200,180,0.07)',
                border: '1px solid rgba(60,200,180,0.26)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 36px rgba(60,200,180,0.13), 0 0 80px rgba(60,200,180,0.05)',
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
              background: 'rgba(60,200,180,0.09)',
              border: '1px solid rgba(60,200,180,0.22)',
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(60,200,180,0.9)',
            }}>
              Share 1 of 3
            </span>
          </div>

          {/* Info box */}
          <div style={{
            background: 'rgba(60,200,180,0.045)',
            border: '1px solid rgba(60,200,180,0.16)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(60,200,180,0.9)', marginBottom: 7 }}>
              Automatically saved to your Drive
            </p>
            <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              During Google OAuth registration, <strong style={{ color: 'rgba(60,200,180,0.8)' }}>Share 1</strong> was
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
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.36 + i * 0.08 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem' }}
              >
                <span style={{
                  color: item.done ? 'rgba(60,200,180,0.8)' : 'rgba(255,215,80,0.55)',
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, height: 52, width: '100%',
                background: 'rgba(60,200,180,0.08)',
                border: '1px solid rgba(60,200,180,0.28)',
                borderRadius: 'var(--radius-md)',
                color: 'rgba(60,200,180,0.9)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem', fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 16px rgba(60,200,180,0.05)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(60,200,180,0.16)';
                e.currentTarget.style.boxShadow  = '0 0 28px rgba(60,200,180,0.15)';
                e.currentTarget.style.borderColor = 'rgba(60,200,180,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(60,200,180,0.08)';
                e.currentTarget.style.boxShadow  = '0 0 16px rgba(60,200,180,0.05)';
                e.currentTarget.style.borderColor = 'rgba(60,200,180,0.28)';
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
                background: 'rgba(60,200,180,0.8)',
                boxShadow: '0 0 6px rgba(60,200,180,0.55)',
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
        .download-grid {
          box-sizing: border-box;
        }
        @media (max-width: 720px) {
          .download-grid {
            grid-template-columns: 1fr !important;
            max-height: calc(100vh - 32px);
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
