import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import Documentation from './pages/documentation';
import About from './pages/about';
import Verification from './pages/verification';
import TOTPSetup from './pages/TOTPSetup';

// New Modular Flows
import CreateVaultFlow from './flows/CreateVaultFlow';
import NormalUnlockFlow from './flows/NormalUnlockFlow';
import RecoveryUnlockFlow from './flows/RecoveryUnlockFlow';

import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "https://shamirsecurity-709.onrender.com";

if (typeof window !== 'undefined') {
  window.addEventListener('error', function (e) {
    if (e.message && e.message.includes('WebGLRenderer: Context Lost')) {
      alert('Graphics context lost. Please refresh the page.');
    }
  });
}

/* ── Lock Icon ─────────────────────────────────────────────── */
function LockIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   LOGIN PAGE BACKGROUND — MULTI-LAYER CANVAS
   6 simultaneous visual systems:
   1. Particle field  — drifting gold/cyan nodes with connection lines
   2. Matrix rain     — falling columns of crypto characters
   3. Radar sweep     — rotating scan from off-center
   4. Orbital rings   — 4 concentric rings rotating at different speeds
   5. Circuit traces  — L-shaped PCB paths with traveling signal dots
   6. Pulse bursts    — expanding rings that bloom and fade
   All mouse-reactive: nodes are repelled by cursor position
   ════════════════════════════════════════════════════════════════ */
function LoginBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

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

    const onMove = e => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', e => {
      if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    /* ── 1. PARTICLE FIELD ── */
    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.8,
      cyan: Math.random() < 0.3,
    }));

    /* ── 2. MATRIX RAIN ── */
    const RAIN_CHARS = 'ABCDEF0123456789アイウエオカキクケコ░▒▓SHA';
    const COL_W = 18;
    const colCount = Math.ceil(window.innerWidth / COL_W);
    const rainCols = Array.from({ length: colCount }, () => ({
      y: Math.random() * -window.innerHeight,
      speed: Math.random() * 0.9 + 0.3,
      len: Math.floor(Math.random() * 14) + 4,
      active: Math.random() < 0.22,
      dormant: Math.floor(Math.random() * 500) + 80,
      chars: Array.from({ length: 18 }, () => RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]),
      mutT: 0,
      mutRate: Math.floor(Math.random() * 8) + 4,
      cyan: Math.random() < 0.25,
      size: Math.random() < 0.12 ? 11 : 9,
    }));

    /* ── 3. RADAR SWEEP ── */
    let radarAngle = 0;
    // Radar origin — offset from center so it doesn't sit behind the form
    const radarOX = () => w * 0.72;
    const radarOY = () => h * 0.5;
    const RADAR_R = () => Math.min(w, h) * 0.38;

    /* ── 4. CIRCUIT TRACES ── */
    const buildTraces = () => Array.from({ length: Math.max(6, Math.floor(w / 180)) }, () => {
      const x1 = Math.random() * w;
      const y1 = Math.random() * h;
      const x2 = x1 + (Math.random() - 0.5) * 360;
      const y2 = y1 + (Math.random() - 0.5) * 260;
      const cx = Math.random() < 0.5 ? x2 : x1;
      const cy = Math.random() < 0.5 ? y1 : y2;
      return {
        pts: [[x1, y1], [cx, cy], [x2, y2]],
        alpha: Math.random() * 0.07 + 0.025,
        cyan: Math.random() < 0.4,
        dot: { t: Math.random(), speed: Math.random() * 0.004 + 0.0015 },
      };
    });
    let traces = buildTraces();
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ── 5. PULSE BURSTS ── */
    const pulses = [];
    let pulseTimer = 0;

    /* ── 6. ORBITING RINGS (drawn on canvas) ── */
    // Four rings at different radii, rotating at different speeds
    const orbits = [
      { r: () => Math.min(w, h) * 0.44, speed: 0.0008, dash: [18, 8], alpha: 0.055, cyan: false },
      { r: () => Math.min(w, h) * 0.34, speed: -0.0013, dash: [8, 14], alpha: 0.06, cyan: true },
      { r: () => Math.min(w, h) * 0.24, speed: 0.002, dash: [4, 20], alpha: 0.07, cyan: false },
      { r: () => Math.min(w, h) * 0.15, speed: -0.003, dash: [12, 6], alpha: 0.08, cyan: true },
    ];
    const orbitAngles = orbits.map(() => Math.random() * Math.PI * 2);

    /* ── DRAW LOOP ── */
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      /* ── Background radial gradient ── */
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, 'rgba(255,215,80,0.025)');
      bgGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      /* ── 1a. Dot grid ── */
      ctx.fillStyle = 'rgba(255,215,80,0.04)';
      for (let x = 0; x < w; x += 38)
        for (let y = 0; y < h; y += 38) {
          ctx.beginPath(); ctx.arc(x, y, 0.65, 0, Math.PI * 2); ctx.fill();
        }

      /* ── 6. Orbiting rings (behind everything) ── */
      const oCX = w * 0.5, oCY = h * 0.5;
      orbits.forEach((orb, i) => {
        orbitAngles[i] += orb.speed;
        const r = orb.r();
        const color = orb.cyan ? `rgba(90,210,190,${orb.alpha})` : `rgba(255,215,80,${orb.alpha})`;
        ctx.save();
        ctx.translate(oCX, oCY);
        ctx.rotate(orbitAngles[i]);
        ctx.setLineDash(orb.dash);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = orb.cyan ? 0.7 : 0.9;
        ctx.stroke();
        ctx.setLineDash([]);
        // Tick marks at 12 positions on each ring
        for (let t = 0; t < 12; t++) {
          const ang = (t / 12) * Math.PI * 2;
          const t0 = (t % 3 === 0) ? 5 : 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (r - t0), Math.sin(ang) * (r - t0));
          ctx.lineTo(Math.cos(ang) * (r + t0), Math.sin(ang) * (r + t0));
          ctx.strokeStyle = color;
          ctx.lineWidth = (t % 3 === 0) ? 1 : 0.5;
          ctx.stroke();
        }
        ctx.restore();
      });

      /* ── 5. Circuit traces ── */
      traces.forEach(tr => {
        const [[x1, y1], [cx, cy], [x2, y2]] = tr.pts;
        const col = tr.cyan ? `rgba(90,210,190,${tr.alpha})` : `rgba(255,215,80,${tr.alpha})`;
        ctx.strokeStyle = col; ctx.lineWidth = 0.65;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();
        [[x1, y1], [cx, cy], [x2, y2]].forEach(([px, py]) => {
          ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
        });
        tr.dot.t = (tr.dot.t + tr.dot.speed) % 1;
        const t = tr.dot.t;
        const px = t < 0.5 ? lerp(x1, cx, t * 2) : lerp(cx, x2, (t - 0.5) * 2);
        const py = t < 0.5 ? lerp(y1, cy, t * 2) : lerp(cy, y2, (t - 0.5) * 2);
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = tr.cyan ? 'rgba(90,210,190,0.75)' : 'rgba(255,215,80,0.7)'; ctx.fill();
      });

      /* ── 2. Matrix rain ── */
      rainCols.forEach((col, ci) => {
        if (!col.active) { col.dormant--; if (col.dormant <= 0) { col.active = true; col.y = -col.len * COL_W; } return; }
        col.mutT++;
        if (col.mutT >= col.mutRate) {
          col.chars[Math.floor(Math.random() * col.chars.length)] = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          col.mutT = 0;
        }
        ctx.font = `${col.size}px "JetBrains Mono", monospace`;
        for (let i = 0; i < col.len; i++) {
          const py = col.y - i * COL_W;
          if (py < -20 || py > h + 20) continue;
          const frac = i / col.len;
          const a = i === 0 ? 0.55 : (1 - frac) * 0.12 + 0.015;
          ctx.fillStyle = col.cyan
            ? (i === 0 ? `rgba(130,240,220,${a})` : `rgba(90,210,190,${a})`)
            : (i === 0 ? `rgba(255,235,120,${a})` : `rgba(255,215,80,${a})`);
          ctx.fillText(col.chars[i % col.chars.length], ci * COL_W + 3, py);
        }
        col.y += col.speed;
        if (col.y > h + col.len * COL_W) {
          col.y = 0; col.active = Math.random() < 0.38;
          col.dormant = Math.floor(Math.random() * 420) + 60;
          col.speed = Math.random() * 0.9 + 0.3;
          col.len = Math.floor(Math.random() * 14) + 4;
        }
      });

      /* ── 1b. Particle connections ── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(255,215,80,${(1 - d / 140) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      }

      /* ── 1c. Particles ── */
      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          const force = (100 - d) / 100 * 0.4;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
        // Speed cap + friction
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.8) { p.vx *= 1.8 / spd; p.vy *= 1.8 / spd; }
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        // Draw node
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, p.cyan ? 'rgba(90,210,190,0.35)' : 'rgba(255,215,80,0.35)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan ? 'rgba(90,210,190,0.8)' : 'rgba(255,215,80,0.75)'; ctx.fill();
      });

      /* ── 4. Pulse bursts ── */
      pulseTimer++;
      if (pulseTimer % 100 === 0) {
        // Spawn from a random particle
        const p = particles[Math.floor(Math.random() * particles.length)];
        pulses.push({ x: p.x, y: p.y, r: 0, maxR: 100, alpha: 0.4, cyan: p.cyan });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.r += 1.3; p.alpha = 0.4 * (1 - p.r / p.maxR);
        // Double ring per burst
        [0, 8].forEach(offset => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + offset, 0, Math.PI * 2);
          ctx.strokeStyle = p.cyan ? `rgba(90,210,190,${p.alpha * (offset ? 0.35 : 1)})` : `rgba(255,215,80,${p.alpha * (offset ? 0.35 : 1)})`;
          ctx.lineWidth = offset ? 0.4 : 0.9;
          ctx.stroke();
        });
        if (p.r >= p.maxR) pulses.splice(i, 1);
      }

      /* ── 3. Radar sweep ── */
      radarAngle = (radarAngle + 0.012) % (Math.PI * 2);
      const rox = radarOX(), roy = radarOY(), rr = RADAR_R();
      const sweepLen = rr * 1.4;

      // Sweep fan
      for (let da = 0; da < Math.PI / 6; da += 0.018) {
        const ang = radarAngle - da;
        const alpha = (1 - da / (Math.PI / 6)) * 0.055;
        ctx.beginPath();
        ctx.moveTo(rox, roy);
        ctx.lineTo(rox + Math.cos(ang) * sweepLen, roy + Math.sin(ang) * sweepLen);
        ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
        ctx.lineWidth = 2.5; ctx.stroke();
      }
      // Leading edge line
      ctx.beginPath();
      ctx.moveTo(rox, roy);
      ctx.lineTo(rox + Math.cos(radarAngle) * sweepLen, roy + Math.sin(radarAngle) * sweepLen);
      ctx.strokeStyle = 'rgba(255,215,80,0.2)'; ctx.lineWidth = 1.2; ctx.stroke();

      // Radar rings
      [1.0, 0.66, 0.33].forEach((frac, i) => {
        ctx.beginPath();
        ctx.arc(rox, roy, rr * frac, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,215,80,${0.04 + i * 0.01})`;
        ctx.lineWidth = 0.6; ctx.stroke();
      });

      // Cross-hairs
      ctx.strokeStyle = 'rgba(255,215,80,0.06)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(rox - rr, roy); ctx.lineTo(rox + rr, roy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rox, roy - rr); ctx.lineTo(rox, roy + rr); ctx.stroke();

      // Radar blips — small lit dots that decay
      if (frame % 90 === 0) {
        const ba = Math.random() * Math.PI * 2;
        const br = Math.random() * rr;
        pulses.push({
          x: rox + Math.cos(ba) * br, y: roy + Math.sin(ba) * br,
          r: 0, maxR: 22, alpha: 0.6, cyan: false
        });
      }

      // Radar origin dot
      ctx.beginPath(); ctx.arc(rox, roy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,215,80,0.55)'; ctx.fill();
      ctx.beginPath(); ctx.arc(rox, roy, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,215,80,0.07)'; ctx.fill();

      /* Rebuild traces occasionally */
      if (frame % 2400 === 0) traces = buildTraces();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ── Ambient CSS glow layers (pure DOM — no canvas) ────────────── */
function AmbientGlow() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top-left gold bloom */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-10%', left: '-8%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,80,0.055) 0%, transparent 65%)',
        }}
      />
      {/* Bottom-right cyan bloom */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', bottom: '-12%', right: '-10%',
          width: '55vw', height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,210,190,0.04) 0%, transparent 65%)',
        }}
      />
      {/* Center subtle pulse behind the form */}
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(640px,80vw)', height: 'min(640px,80vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,80,0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

/* ── Floating crypto tags ──────────────────────────────────────── */
function CryptoTags() {
  const tags = [
    { text: 'AES-256-GCM', x: '5%', y: '14%', delay: 0, cyan: false },
    { text: 'SHA-512', x: '76%', y: '10%', delay: 0.5, cyan: true },
    { text: 'HMAC ✓', x: '3%', y: '58%', delay: 1.0, cyan: true },
    { text: 'RSA-4096', x: '80%', y: '62%', delay: 1.5, cyan: false },
    { text: 'TLS 1.3', x: '82%', y: '32%', delay: 2.0, cyan: true },
    { text: 'PBKDF2', x: '4%', y: '34%', delay: 2.5, cyan: false },
    { text: 'Shamir SSS', x: '72%', y: '84%', delay: 0.8, cyan: false },
    { text: 'E2E Encrypted', x: '3%', y: '80%', delay: 1.8, cyan: true },
    { text: 'secp256k1', x: '40%', y: '6%', delay: 1.2, cyan: false },
    { text: 'ChaCha20', x: '42%', y: '92%', delay: 0.3, cyan: true },
  ];

  return (
    <>
      {tags.map((tag, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0.55, 0.35, 0.55], y: [0, -5, 0], scale: 1 }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, delay: tag.delay, ease: 'easeInOut' },
            y: { duration: 4 + i * 0.3, repeat: Infinity, delay: tag.delay, ease: 'easeInOut' },
            scale: { duration: 0.5, delay: tag.delay },
          }}
          style={{
            position: 'fixed', left: tag.x, top: tag.y, zIndex: 2,
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 9px',
            background: 'rgba(8,11,14,0.75)',
            border: `1px solid ${tag.cyan ? 'rgba(90,210,190,0.22)' : 'rgba(255,215,80,0.18)'}`,
            borderRadius: 6,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{
            width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
            background: tag.cyan ? 'rgba(90,210,190,0.85)' : 'rgba(255,215,80,0.85)',
            boxShadow: tag.cyan ? '0 0 5px rgba(90,210,190,0.7)' : '0 0 5px rgba(255,215,80,0.7)',
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6rem', letterSpacing: '0.07em',
            color: tag.cyan ? 'rgba(90,210,190,0.85)' : 'rgba(255,215,80,0.8)',
          }}>
            {tag.text}
          </span>
        </motion.div>
      ))}
    </>
  );
}

/* ── Vertical scanning lines ───────────────────────────────────── */
function ScanLines() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Horizontal scan sweep */}
      <motion.div
        animate={{ y: ['-5%', '105%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        style={{
          position: 'absolute', left: 0, right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,80,0.08) 20%, rgba(255,215,80,0.18) 50%, rgba(255,215,80,0.08) 80%, transparent 100%)',
          boxShadow: '0 0 12px rgba(255,215,80,0.15)',
        }}
      />
      {/* Vertical scan — right side */}
      <motion.div
        animate={{ x: ['105%', '-5%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 3, repeatDelay: 4 }}
        style={{
          position: 'absolute', top: 0, bottom: 0,
          width: 1,
          background: 'linear-gradient(180deg, transparent 0%, rgba(90,210,190,0.12) 30%, rgba(90,210,190,0.25) 50%, rgba(90,210,190,0.12) 70%, transparent 100%)',
          boxShadow: '0 0 10px rgba(90,210,190,0.12)',
        }}
      />
    </div>
  );
}

/* ── Top-Right Nav ─────────────────────────────────────────────── */
function TopNav({ onNavigate }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      style={{ position: 'fixed', top: 18, right: 22, display: 'flex', gap: 8, zIndex: 20 }}
    >
      {['Documentation', 'Verification', 'Setup MFA', 'About'].map((label, i) => (
        <motion.button
          key={label}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.07 }}
          onClick={() => {
            const target = label.toLowerCase().replace(' ', '-');
            onNavigate && onNavigate(target);
          }}
          style={{
            background: 'rgba(13,15,18,0.82)',
            border: '1px solid rgba(255,215,80,0.18)',
            color: 'rgba(255,215,80,0.7)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,215,80,0.45)';
            e.currentTarget.style.color = 'rgba(255,215,80,1)';
            e.currentTarget.style.background = 'rgba(255,215,80,0.09)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,215,80,0.18)';
            e.currentTarget.style.color = 'rgba(255,215,80,0.7)';
            e.currentTarget.style.background = 'rgba(13,15,18,0.82)';
          }}
        >
          {label}
        </motion.button>
      ))}
    </motion.nav>
  );
}

/* ── Auth Success Page ─────────────────────────────────────────── */
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
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
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

/* ── Main App ──────────────────────────────────────────────────── */
function App() {
  const location = useLocation();

  // ── RECOVERY URL LISTENER ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isRecoveryReturn = params.get('recovery_totp') === '1';
    const isRecoveryError = !!params.get('recovery_error');

    if (isRecoveryReturn || isRecoveryError) {
      // Clear any stale vault state so we don't accidentally show VaultPage
      setVaultPage(false);
      setCredentialsReady(false);
      setPage('recovery-unlock');
    }
  }, [location]);

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  let vaultUser = localStorage.getItem('vaultUser');
  let goldenKey = localStorage.getItem('goldenKey');
  let justRegistered = localStorage.getItem('justRegistered') === 'true';
  const [credentialsReady, setCredentialsReady] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState('login'); // login | register | setup-mfa | normal-unlock | recovery-unlock
  const [pendingSessionToken, setPendingSessionToken] = useState(null);
  const [mfaStartAtVerify, setMfaStartAtVerify] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState({ username: '', password: '' });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vaultPage, setVaultPage] = useState(false);
  const [localShare, setLocalShare] = useState(null);
  const [showAbout, setShowAbout] = useState(() => { try { return !sessionStorage.getItem('about_seen'); } catch { return true; } });
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // ── Persistent Unlock State ──
  const [persistentLocalShare, setPersistentLocalShare] = useState(null);
  const [persistentFileName, setPersistentFileName] = useState('');
  const [persistentSessionToken, setPersistentSessionToken] = useState('');
  const [persistentUnlockSubStep, setPersistentUnlockSubStep] = useState(0);

  useEffect(() => {
    if (location.pathname === '/vault' || location.pathname === '/download-share') {
      const u = localStorage.getItem('vaultUser'); const k = localStorage.getItem('goldenKey');
      if (u && k) { setCredentialsReady(true); setVaultPage(true); } else { setCredentialsReady(false); }
    }
  }, [location]);

  useEffect(() => {
    function handleRegistrationComplete(event) {
      if (event.data && (event.data.type === 'registration-complete' || event.data.type === 'registration-finish')) {
        setRegistrationComplete(false);
        navigate(`/download-share?reg_complete=${encodeURIComponent(event.data.reg_complete)}`);
        try { window.sessionStorage.removeItem('registration_attempted'); } catch { }
      }
    }
    window.addEventListener('message', handleRegistrationComplete);
    return () => window.removeEventListener('message', handleRegistrationComplete);
  }, [navigate]);

  const handleCreateVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try { window.sessionStorage.setItem('registration_attempted', '1'); } catch { }
    try {
      if (!username || !password) { setError('Please enter username and password.'); setLoading(false); return; }
      if (!API_URL) { setError('API URL is not configured.'); setLoading(false); return; }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      let res;
      try {
        res = await fetch(`${API_URL}/api/register/init`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }), signal: controller.signal,
        });
      } catch (err) {
        if (err.name === 'AbortError') { setError('Vault creation timed out. Please try again.'); }
        else { setError('Network error: ' + err.message); }
        setLoading(false); return;
      } finally { clearTimeout(timeoutId); }
      if (!res) { setError('No response received from backend.'); setLoading(false); return; }
      const contentType = res.headers.get('Content-Type');
      let raw = ''; let data = null;
      try { raw = await res.text(); if (raw && contentType && contentType.includes('application/json')) data = JSON.parse(raw); }
      catch (jsonErr) { setError('Error parsing backend response: ' + jsonErr.message); setLoading(false); return; }
      if (data && data.auth_url) { setSuccess('Redirecting to Google sign-in…'); window.location.href = data.auth_url; return; }
      if (data && data.message) setError('Vault creation failed: ' + data.message);
      else if (raw) setError('Vault creation failed. Backend says: ' + raw);
      else setError('Vault creation failed. No response from backend.');
    } catch (err) { setError('Could not connect to the server. Error: ' + err.message); }
    finally { setLoading(false); }
  };

  const handleUnlockLogin = async () => {
    setError(''); setSuccess(''); setLoading(true);
    if (!username || !password) { setError('Please enter username and password.'); setLoading(false); return; }
    setPendingUnlock({ username, password }); setUnlockStep('uploadShare'); setLoading(false);
  };

  const handleUnlockWithShare = (goldenKey, username) => {
    localStorage.setItem('vaultUser', username); localStorage.setItem('goldenKey', goldenKey);
    setVaultPage(true); setCredentialsReady(true);
    setUnlockStep('login'); setPendingUnlock({ username: '', password: '' });
    // Clear persistent state on success
    setPersistentLocalShare(null); setPersistentFileName('');
    setPersistentSessionToken(''); setPersistentUnlockSubStep(0);
  };

  const handleUnlockVault = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!username || !password || !localShare) { setError('Please enter username, password, and upload your local_share.enc file.'); setLoading(false); return; }
      if (!API_URL) { setError('API URL is not configured.'); setLoading(false); return; }
      const res = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, local_share: localShare }) });
      const contentType = res.headers.get('Content-Type'); let raw = ''; let data = null;
      try { raw = await res.text(); if (raw && contentType && contentType.includes('application/json')) data = JSON.parse(raw); } catch { data = null; }
      if (data && data.status === 'success') { localStorage.setItem('goldenKey', data.golden_key); localStorage.setItem('vaultUser', username); setVaultPage(true); setSuccess('Vault unlocked!'); }
      else { setError((data && data.message) || 'Unlock failed.'); }
    } catch { setError('Network error unlocking vault.'); }
    finally { setLoading(false); }
  };

  const handleNavigate = (target) => {
    // target arrives as lowercase: 'documentation', 'verification', 'about'
    setPage(target);
    if (target === 'about') {
      try { sessionStorage.setItem('about_seen', '1'); } catch { }
    }
  };

  // Route guards
  if (vaultPage && localStorage.getItem('justRegistered') === 'true') {
    setTimeout(() => localStorage.setItem('justRegistered', 'false'), 0);
    return <RegistrationVaultPage />;
  }
  if (vaultPage && credentialsReady && localStorage.getItem('justRegistered') !== 'true') {
    vaultUser = localStorage.getItem('vaultUser'); goldenKey = localStorage.getItem('goldenKey');
    return (
      <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => {
        setVaultPage(false); setPage('login');
        localStorage.removeItem('vaultUser'); localStorage.removeItem('goldenKey');
      }} />
    );
  }

  /* ── Login Page UI ─────────────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">

      {page === 'login' && (
        <motion.div
          key="login-centered"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'relative', minHeight: '100vh', width: '100%',
            background: 'var(--bg-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <LoginBackground />
          <AmbientGlow />
          <CryptoTags />
          <ScanLines />
          <TopNav onNavigate={handleNavigate} />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', zIndex: 10,
              width: '100%', maxWidth: 400, padding: '0 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ textAlign: 'center', marginBottom: 32 }}
            >
              <motion.div
                animate={{ boxShadow: ['0 0 16px rgba(255,215,80,0.1)', '0 0 36px rgba(255,215,80,0.22)', '0 0 16px rgba(255,215,80,0.1)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(255,215,80,0.08)',
                  border: '1px solid rgba(255,215,80,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <LockIcon size={26} color="var(--gold)" />
              </motion.div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '2rem', color: 'var(--gold)',
                letterSpacing: '0.03em', margin: 0, lineHeight: 1.1,
              }}>
                Shamir Vault
              </h1>
              <p style={{
                marginTop: 8, color: 'var(--text-muted)',
                fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase',
              }}>
                Secure Multi-Key Secret Management
              </p>
            </motion.div>

            <CreateVaultFlow
              username={username} setUsername={setUsername}
              password={password} setPassword={setPassword}
              loading={loading} error={error} success={success}
              onCreateVault={handleCreateVault}
              onUnlockLogin={() => setPage('normal-unlock')}
            />

            <motion.button
              whileHover={{ scale: 1.05, color: '#5ad2be' }}
              onClick={() => setPage('recovery-unlock')}
              style={{
                marginTop: 24, background: 'none', border: 'none',
                color: 'rgba(90,210,190,0.6)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'underline',
              }}
            >
              Lost your local share? Try Recovery →
            </motion.button>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 6px rgba(74,222,128,0.6)', '0 0 12px rgba(74,222,128,0.9)', '0 0 6px rgba(74,222,128,0.6)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                End-to-end encrypted · Shamir (2-of-3)
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {page === 'normal-unlock' && (
        <motion.div key="normal-unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <NormalUnlockFlow
            username={username} password={password}
            onUnlock={handleUnlockWithShare}
            onBack={() => setPage('login')}
            onGoToSetupMFA={(token) => {
              setPendingSessionToken(token);
              setMfaStartAtVerify(false);
              setPage('setup-mfa');
            }}
          />
        </motion.div>
      )}

      {page === 'recovery-unlock' && (
        <motion.div key="recovery-unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <RecoveryUnlockFlow
            username={username}
            onUnlock={(goldenKey, user) => {
              handleUnlockWithShare(goldenKey, user);
            }}
            onBack={() => setPage('login')}
          />
        </motion.div>
      )}


      {/* ── Documentation page ── */}
      {page === 'documentation' && (
        <motion.div
          key="documentation"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
        >
          <Documentation onBack={() => setPage('login')} />
        </motion.div>
      )}

      {/* ── Verification page ── */}
      {page === 'verification' && (
        <motion.div
          key="verification"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        >
          <Verification onBack={() => setPage('login')} />
        </motion.div>
      )}

      {/* ── About page ── */}
      {page === 'about' && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        >
          <About onClose={() => setPage('login')} />
        </motion.div>
      )}

      {/* ── TOTP Setup page ── */}
      {page === 'setup-mfa' && (
        <motion.div
          key="mfa-setup"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}
        >
          <TOTPSetup
            onBack={() => {
              setPendingSessionToken(null);
              setMfaStartAtVerify(false);
              setPage('login');
            }}
            sessionToken={pendingSessionToken}
            initialStep={mfaStartAtVerify ? 'verify' : null}
            onComplete={(data) => {
              const key = data?.golden_key || localStorage.getItem('goldenKey');
              const user = data?.username || localStorage.getItem('vaultUser') || username;

              if (key && user) {
                localStorage.setItem('goldenKey', key);
                localStorage.setItem('vaultUser', user);
                setVaultPage(true);
                setCredentialsReady(true);
                setPendingSessionToken(null);
                // Also reset persist unlock substep so we don't return to "Yellow" on next login
                setPersistentUnlockSubStep(0);
              } else {
                // If it was just a setup (no key), we go back to login/home
                setPage('login');
                setPendingSessionToken(null);
              }
            }}
          />
        </motion.div>
      )}

    </AnimatePresence>
  );
}

export default App;
