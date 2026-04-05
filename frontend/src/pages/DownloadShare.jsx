import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

console.log('[DownloadShare] Component loaded');

/* ── Icons ─────────────────────────────────────────────────────── */
function DownloadIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShieldIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function AlertTriangleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function DriveIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 87.3 78" fill="none">
      <path d="M6.6 66.85L23.1 45.5H87.3L70.7 66.85Z" fill="rgba(100,210,195,0.55)" />
      <path d="M29.15 0L0 50.2H43.65L72.8 0Z" fill="rgba(100,210,195,0.35)" />
      <path d="M43.65 0L87.3 0L58.15 50.2H14.5Z" fill="rgba(100,210,195,0.45)" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DOWNLOAD PAGE BACKGROUND — "SECURE VAULT TRANSMISSION"
   Multi-layer canvas with 6 distinct effects:
   1. Hexagonal grid that pulses from center outward
   2. Falling ciphertext columns (AES keys, hash fragments)
   3. Concentric vault-door rings that expand and fade
   4. Data-transfer arcs — bezier streams between random points
   5. Floating binary/hex particle field
   6. Diagonal radar sweep with trail
   ════════════════════════════════════════════════════════════════════ */
function DownloadBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h, frame = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ──────────────────────────────────────────
       1. HEX GRID — tessellation that pulses
       ────────────────────────────────────────── */
    const HEX_R = 32;
    const HEX_W = HEX_R * Math.sqrt(3);
    const HEX_H = HEX_R * 2;

    function drawHex(cx, cy, r, alpha) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    /* ──────────────────────────────────────────
       2. CIPHERTEXT COLUMN STREAMS
       ────────────────────────────────────────── */
    const CIPHER_CHARS = 'ABCDEFabcdef0123456789+/=SHA256HMAC';
    const COL_STEP = 20;
    const colCount = Math.ceil(window.innerWidth / COL_STEP);
    const cipherCols = Array.from({ length: colCount }, () => ({
      y: Math.random() * -window.innerHeight,
      speed: Math.random() * 0.7 + 0.25,
      length: Math.floor(Math.random() * 12) + 4,
      active: Math.random() < 0.15,
      dormant: Math.floor(Math.random() * 600) + 100,
      chars: Array.from({ length: 16 }, () => CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]),
      mutT: 0,
      mutRate: Math.floor(Math.random() * 10) + 5,
      gold: Math.random() < 0.6,   // 60% gold, 40% cyan
    }));

    /* ──────────────────────────────────────────
       3. VAULT-DOOR EXPANSION RINGS
       ────────────────────────────────────────── */
    const vaultRings = [];
    let vaultTimer = 0;

    const spawnVaultRing = () => {
      // Rings spawn from near-center
      const cx = w * (0.35 + Math.random() * 0.3);
      const cy = h * (0.35 + Math.random() * 0.3);
      vaultRings.push({
        x: cx, y: cy,
        r: 0, maxR: Math.min(w, h) * 0.55,
        alpha: 0.35,
        segments: Math.floor(Math.random() * 4) + 6,   // dashed ring
        dashOn: Math.random() * 20 + 10,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.4,
        cyan: Math.random() < 0.3,
      });
    };

    /* ──────────────────────────────────────────
       4. DATA-TRANSFER ARCS
       ────────────────────────────────────────── */
    const dataArcs = [];
    let arcTimer = 0;

    const spawnArc = () => {
      const x1 = Math.random() * w;
      const y1 = Math.random() * h;
      const x2 = Math.random() * w;
      const y2 = Math.random() * h;
      const cpx = (x1 + x2) / 2 + (Math.random() - 0.5) * 200;
      const cpy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.3 - 50;
      dataArcs.push({
        x1, y1, x2, y2, cpx, cpy,
        t: 0,
        speed: Math.random() * 0.006 + 0.003,
        trail: [],
        maxTrail: Math.floor(Math.random() * 24) + 12,
        cyan: Math.random() < 0.5,
        thick: Math.random() < 0.2,
      });
    };

    // Seed initial arcs
    for (let i = 0; i < 5; i++) spawnArc();

    /* ──────────────────────────────────────────
       5. FLOATING HEX PARTICLES
       ────────────────────────────────────────── */
    const HEX_POOL = '0123456789ABCDEF';
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      char: HEX_POOL[Math.floor(Math.random() * 16)],
      opacity: Math.random() * 0.12 + 0.03,
      size: Math.floor(Math.random() * 4) + 8,
      timer: 0,
      interval: Math.floor(Math.random() * 70) + 30,
      cyan: Math.random() < 0.35,
    }));

    /* ──────────────────────────────────────────
       6. DIAGONAL RADAR SWEEP
       ────────────────────────────────────────── */
    let sweepAngle = 0;
    const SWEEP_SPEED = 0.008;

    /* ─── DRAW LOOP ─────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      /* Deep dark base — no clearRect, use fill with very low alpha for trails */
      ctx.fillStyle = 'rgba(5,5,8,0.88)';
      ctx.fillRect(0, 0, w, h);
      frame++;
      const cx = w / 2, cy = h / 2;

      /* ── 1. Hex grid ── */
      let row = 0;
      for (let gy = -HEX_H; gy < h + HEX_H; gy += HEX_H * 0.75) {
        const offset = (row % 2) * (HEX_W / 2);
        for (let gx = -HEX_W; gx < w + HEX_W; gx += HEX_W) {
          const hcx = gx + offset;
          const hcy = gy;
          const dist = Math.sqrt((hcx - cx) ** 2 + (hcy - cy) ** 2);
          const pulse = Math.sin(frame * 0.012 - dist * 0.008) * 0.5 + 0.5;
          const alpha = 0.025 + pulse * 0.018;
          drawHex(hcx, hcy, HEX_R - 1, alpha);
        }
        row++;
      }

      /* ── 2. Ciphertext columns ── */
      cipherCols.forEach((col, ci) => {
        if (!col.active) {
          col.dormant--;
          if (col.dormant <= 0) {
            col.active = true;
            col.y = -col.length * COL_STEP;
          }
          return;
        }
        col.mutT++;
        if (col.mutT >= col.mutRate) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          col.mutT = 0;
        }
        ctx.font = `9px "JetBrains Mono", monospace`;
        for (let i = 0; i < col.length; i++) {
          const py = col.y - i * COL_STEP;
          if (py < -20 || py > h + 20) continue;
          const frac = i / col.length;
          const alpha = i === 0 ? 0.5 : (1 - frac) * 0.1 + 0.015;
          ctx.fillStyle = col.gold
            ? (i === 0 ? `rgba(255,230,100,${alpha})` : `rgba(255,215,80,${alpha})`)
            : (i === 0 ? `rgba(120,230,210,${alpha})` : `rgba(90,210,190,${alpha})`);
          ctx.fillText(col.chars[i % col.chars.length], ci * COL_STEP + 3, py);
        }
        col.y += col.speed;
        if (col.y > h + col.length * COL_STEP) {
          col.y = -col.length * COL_STEP;
          col.active = Math.random() < 0.4;
          col.dormant = Math.floor(Math.random() * 500) + 120;
          col.speed = Math.random() * 0.7 + 0.25;
        }
      });

      /* ── 3. Vault-door rings ── */
      vaultTimer++;
      if (vaultTimer % 110 === 0 && vaultRings.length < 8) spawnVaultRing();

      for (let i = vaultRings.length - 1; i >= 0; i--) {
        const vr = vaultRings[i];
        vr.r += vr.speed;
        vr.alpha = 0.35 * (1 - vr.r / vr.maxR);
        if (vr.alpha <= 0) { vaultRings.splice(i, 1); continue; }

        const color = vr.cyan
          ? `rgba(90,210,190,${vr.alpha})`
          : `rgba(255,215,80,${vr.alpha})`;

        // Outer ring — solid
        ctx.beginPath();
        ctx.arc(vr.x, vr.y, vr.r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner ring — dashed, slightly smaller
        ctx.beginPath();
        ctx.setLineDash([vr.dashOn, vr.dashOn * 0.6]);
        ctx.lineDashOffset = -vr.phase - frame * 0.5;
        ctx.arc(vr.x, vr.y, vr.r * 0.82, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Tick marks at cardinal + 45° points
        for (let t = 0; t < 8; t++) {
          const ang = (Math.PI / 4) * t + vr.phase;
          const inner = vr.r - 4;
          const outer = vr.r + 3;
          ctx.beginPath();
          ctx.moveTo(vr.x + Math.cos(ang) * inner, vr.y + Math.sin(ang) * inner);
          ctx.lineTo(vr.x + Math.cos(ang) * outer, vr.y + Math.sin(ang) * outer);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      /* ── 4. Data-transfer arcs ── */
      arcTimer++;
      if (arcTimer % 130 === 0 && dataArcs.length < 12) spawnArc();

      for (let i = dataArcs.length - 1; i >= 0; i--) {
        const arc = dataArcs[i];
        arc.t = Math.min(arc.t + arc.speed, 1);

        // Current head position along bezier
        const mt = 1 - arc.t;
        const hx = mt * mt * arc.x1 + 2 * mt * arc.t * arc.cpx + arc.t * arc.t * arc.x2;
        const hy = mt * mt * arc.y1 + 2 * mt * arc.t * arc.cpy + arc.t * arc.t * arc.y2;
        arc.trail.push({ x: hx, y: hy });
        if (arc.trail.length > arc.maxTrail) arc.trail.shift();

        // Draw trail
        if (arc.trail.length > 1) {
          for (let j = 1; j < arc.trail.length; j++) {
            const frac = j / arc.trail.length;
            ctx.beginPath();
            ctx.moveTo(arc.trail[j - 1].x, arc.trail[j - 1].y);
            ctx.lineTo(arc.trail[j].x, arc.trail[j].y);
            ctx.strokeStyle = arc.cyan
              ? `rgba(90,210,190,${frac * 0.5})`
              : `rgba(255,215,80,${frac * 0.35})`;
            ctx.lineWidth = arc.thick ? 1.5 : 0.8;
            ctx.stroke();
          }
        }

        // Head dot
        ctx.beginPath();
        ctx.arc(hx, hy, arc.thick ? 2.8 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = arc.cyan ? 'rgba(90,210,190,0.9)' : 'rgba(255,215,80,0.85)';
        ctx.fill();

        if (arc.t >= 1) dataArcs.splice(i, 1);
      }

      /* ── 5. Hex particles ── */
      particles.forEach(p => {
        p.timer++;
        if (p.timer >= p.interval) {
          p.char = HEX_POOL[Math.floor(Math.random() * 16)];
          p.timer = 0;
        }
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = p.cyan
          ? `rgba(90,210,190,${p.opacity})`
          : `rgba(255,215,80,${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      });

      /* ── 6. Diagonal radar sweep ── */
      sweepAngle = (sweepAngle + SWEEP_SPEED) % (Math.PI * 2);
      const sweepLen = Math.max(w, h) * 1.5;

      // Sweep gradient fan
      const fanGrad = ctx.createConicalGradient
        ? null   // fallback below if not supported
        : null;

      // Draw sweep as thin wedge manually
      for (let da = 0; da < Math.PI / 8; da += 0.015) {
        const ang = sweepAngle - da;
        const alpha = (1 - da / (Math.PI / 8)) * 0.04;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * sweepLen, cy + Math.sin(ang) * sweepLen);
        ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Bright leading edge
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * sweepLen, cy + Math.sin(sweepAngle) * sweepLen);
      ctx.strokeStyle = 'rgba(255,215,80,0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Sweep source dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,215,80,0.4)';
      ctx.fill();

      // Outer sweep circle
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,215,80,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    /* Initialize scan lines at different heights */
    scanY1 = h * 0.3;
    scanY2 = h * 0.7;
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  );
}

/* ── Animated vault-door rings (CSS layer on top of canvas) ─────── */
function VaultRingsOverlay() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 1,
    }}>
      {/* Large outermost ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 'min(820px, 92vw)', height: 'min(820px, 92vw)',
          borderRadius: '50%',
          border: '1px solid rgba(255,215,80,0.04)',
        }}
      />
      {/* Dashed mid ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 'min(620px, 78vw)', height: 'min(620px, 78vw)',
          borderRadius: '50%',
          border: '1px dashed rgba(255,215,80,0.055)',
        }}
      />
      {/* Solid inner ring — gold */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 'min(440px, 64vw)', height: 'min(440px, 64vw)',
          borderRadius: '50%',
          border: '1px solid rgba(255,215,80,0.07)',
        }}
      />
      {/* Cyan dashed inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 'min(280px, 50vw)', height: 'min(280px, 50vw)',
          borderRadius: '50%',
          border: '1px dashed rgba(90,210,190,0.07)',
        }}
      />
      {/* Center radial glow */}
      <div style={{
        position: 'absolute',
        width: 'min(180px, 36vw)', height: 'min(180px, 36vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,80,0.05) 0%, transparent 70%)',
      }} />
      {/* 8 tick marks on outermost ring */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r = Math.min(window.innerWidth * 0.46, 410);
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: 14, height: 2,
              borderRadius: 1,
              background: 'rgba(255,215,80,0.25)',
              left: '50%', top: '50%',
              transform: `rotate(${angle}rad) translateX(${r}px) translateY(-50%)`,
              transformOrigin: '0 50%',
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Floating encrypted packet indicators ───────────────────────── */
function PacketIndicators() {
  const packets = [
    { label: 'AES-256-GCM', x: '8%', y: '15%', delay: 0 },
    { label: 'SHA-512', x: '78%', y: '12%', delay: 0.3 },
    { label: 'HMAC · OK', x: '5%', y: '72%', delay: 0.6 },
    { label: 'RSA-4096', x: '80%', y: '78%', delay: 0.9 },
    { label: '2-of-3 ✓', x: '82%', y: '44%', delay: 1.2 },
    { label: 'TLS 1.3', x: '4%', y: '44%', delay: 1.5 },
  ];

  return (
    <>
      {packets.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.65, 0.4, 0.65], scale: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' },
            scale: { duration: 0.5, delay: p.delay },
            y: { duration: 3.5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' },
          }}
          style={{
            position: 'fixed',
            left: p.x, top: p.y,
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 9px',
            background: 'rgba(10,13,16,0.72)',
            border: '1px solid rgba(90,210,190,0.2)',
            borderRadius: 6,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'rgba(90,210,190,0.8)',
            boxShadow: '0 0 5px rgba(90,210,190,0.7)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6rem',
            color: 'rgba(90,210,190,0.85)',
            letterSpacing: '0.08em',
          }}>
            {p.label}
          </span>
        </motion.div>
      ))}
    </>
  );
}

/* ── Vertical data-stream lines (CSS, no canvas) ────────────────── */
function DataStreamLines() {
  const lines = Array.from({ length: 6 }, (_, i) => ({
    left: `${8 + i * 15}%`,
    delay: i * 0.4,
    duration: 2.5 + i * 0.3,
    height: `${30 + Math.random() * 40}%`,
    gold: i % 2 === 0,
  }));

  return (
    <>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 0.25, 0] }}
          transition={{ duration: line.duration, repeat: Infinity, delay: line.delay, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            left: line.left,
            top: '10%',
            width: 1,
            height: line.height,
            background: line.gold
              ? 'linear-gradient(180deg, transparent, rgba(255,215,80,0.4), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(90,210,190,0.4), transparent)',
            transformOrigin: 'top',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function DownloadShare() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  console.log('[DownloadShare] location.pathname:', location.pathname, 'location.search:', location.search);

  const localShareData = params.get('local_share');
  const goldenKey = params.get('golden_key');
  const username = params.get('username');

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

  /* ── UI ─────────────────────────────────────────────────────────── */
  return (
    <div style={{
      position: 'relative', minHeight: '100vh', width: '100%',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '32px 20px',
    }}>

      {/* ── Layer 0: Canvas (hex grid, columns, rings, arcs, particles, radar) ── */}
      <DownloadBackground />

      {/* ── Layer 1: CSS vault-door rings ── */}
      <VaultRingsOverlay />

      {/* ── Layer 2: Floating crypto-label indicators ── */}
      <PacketIndicators />

      {/* ── Layer 3: Vertical data stream lines ── */}
      <DataStreamLines />

      {/* ── Layer 4: Two-column card grid ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        width: '100%',
        maxWidth: 960,
        alignItems: 'stretch',
      }}
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
            background: 'rgba(19,22,27,0.88)',
            border: '1px solid rgba(255,215,80,0.15)',
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(26px)',
            boxShadow: '0 8px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,215,80,0.04) inset',
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,215,80,0.6), transparent)',
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(255,215,80,0.09)',
                border: '1px solid rgba(255,215,80,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', color: 'var(--gold)',
                boxShadow: '0 0 28px rgba(255,215,80,0.15)',
              }}
            >
              <ShieldIcon size={30} />
            </motion.div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              Save Your Recovery Share
            </h2>
            {username && (
              <span className="sv-badge sv-badge-gold" style={{ fontSize: '0.7rem' }}>{username}</span>
            )}
          </div>

          {/* Warning box */}
          <div style={{
            background: 'rgba(255,215,80,0.055)', border: '1px solid rgba(255,215,80,0.2)',
            borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 20,
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
                  <code style={{ background: 'var(--bg-elevated)', padding: '1px 6px', borderRadius: 4, color: 'var(--gold)', fontSize: '0.77rem' }}>local_share.enc</code>
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
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, opacity: 0.55, boxShadow: '0 0 4px rgba(255,215,80,0.4)' }} />
                {txt}
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="sv-alert sv-alert-error" style={{ marginBottom: 20 }}>{error}</div>
          )}

          <div style={{ marginTop: 'auto' }}>
            {!error && localShareData && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(255,215,80,0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="sv-btn sv-btn-primary sv-btn-full"
                onClick={handleDownload}
                disabled={downloading}
                style={{ height: 52, fontSize: '0.93rem', gap: 10 }}
              >
                {downloading ? <span className="sv-spinner" /> : <DownloadIcon size={18} />}
                {downloading ? 'Preparing…' : 'Download local_share.enc'}
              </motion.button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 5px rgba(74,222,128,0.55)' }} />
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Shamir (2-of-3) · End-to-end encrypted
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT CARD: Google Drive Share Info ── */}
        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(16,26,28,0.9)',
            border: '1px solid rgba(90,210,190,0.18)',
            borderRadius: 20,
            padding: '40px 36px',
            backdropFilter: 'blur(26px)',
            boxShadow: '0 8px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(90,210,190,0.04) inset',
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top accent line — cyan */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(90,210,190,0.55), transparent)',
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.22, type: 'spring', stiffness: 220, damping: 18 }}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(90,210,190,0.08)',
                border: '1px solid rgba(90,210,190,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 28px rgba(90,210,190,0.12)',
              }}
            >
              <DriveIcon size={30} />
            </motion.div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              Google Drive Share
            </h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(90,210,190,0.1)', border: '1px solid rgba(90,210,190,0.22)',
              fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(90,210,190,0.9)',
            }}>
              Share 1 of 3
            </span>
          </div>

          {/* Info box */}
          <div style={{
            background: 'rgba(90,210,190,0.055)', border: '1px solid rgba(90,210,190,0.18)',
            borderRadius: 'var(--radius-lg)', padding: '16px 18px', marginBottom: 20,
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(60,200,180,0.9)', marginBottom: 7 }}>
              Automatically saved to your Drive
            </p>
            <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              During Google OAuth registration, <strong style={{ color: 'rgba(60,200,180,0.8)' }}>Share 1</strong> was
              automatically stored in your Google Drive. This is your cloud cryptographic fragment —
              combined with your local share and the server share to reconstruct the vault key.
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
                transition={{ delay: 0.38 + i * 0.07 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem' }}
              >
                <span style={{ color: item.done ? 'rgba(90,210,190,0.8)' : 'rgba(255,215,80,0.6)', flexShrink: 0, marginTop: 1 }}>
                  {item.done ? <CheckCircleIcon size={14} /> : <AlertTriangleIcon size={14} />}
                </span>
                <span style={{ color: item.done ? 'var(--text-secondary)' : 'rgba(255,215,80,0.8)' }}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Open Drive */}
          <div style={{ marginTop: 'auto' }}>
            <motion.a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(90,210,190,0.2)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, height: 52, width: '100%',
                background: 'rgba(90,210,190,0.1)', border: '1px solid rgba(90,210,190,0.3)',
                borderRadius: 'var(--radius-md)', color: 'rgba(90,210,190,0.9)',
                fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <DriveIcon size={20} />
              Open Google Drive
            </motion.a>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(90,210,190,0.8)', boxShadow: '0 0 5px rgba(90,210,190,0.55)' }} />
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Cloud share · Auto-synced
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Responsive: single column on mobile */}
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
