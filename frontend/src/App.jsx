import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import UnlockWithShare from './UnlockWithShare';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "https://shamirsecurity-098.onrender.com";

if (typeof window !== 'undefined') {
  window.addEventListener('error', function (e) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   INTERACTIVE 3D OBJECTS
   Pure CSS 3D transforms — zero WebGL, zero extra deps.
   Each object:
   • Floats with a slow bobbing animation
   • Reacts to mouse hover / touch with velocity-based launch
   • Settles back to original position via spring physics
   ════════════════════════════════════════════════════════════ */

function use3DObject(initialPos) {
  const [pos, setPos] = useState(initialPos);
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [rotExtra, setRotExtra] = useState({ x: 0, y: 0, z: 0 });
  const [flying, setFlying] = useState(false);
  const animRef = useRef(null);

  const launch = useCallback((pushX, pushY) => {
    setFlying(true);
    setVel({ x: pushX, y: pushY });
    setRotExtra({ x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60, z: (Math.random() - 0.5) * 90 });
  }, []);

  useEffect(() => {
    if (!flying) return;

    let vx = vel.x, vy = vel.y;
    let cx = pos.x, cy = pos.y;
    const tx = initialPos.x, ty = initialPos.y;

    const step = () => {
      // Spring back
      const ax = (tx - cx) * 0.06;
      const ay = (ty - cy) * 0.06;
      vx = (vx + ax) * 0.88;
      vy = (vy + ay) * 0.88;
      cx += vx;
      cy += vy;

      const dist = Math.sqrt((cx - tx) ** 2 + (cy - ty) ** 2);
      const speed = Math.sqrt(vx ** 2 + vy ** 2);

      setPos({ x: cx, y: cy });
      setRotExtra(r => ({
        x: r.x * 0.92,
        y: r.y * 0.92,
        z: r.z * 0.92,
      }));

      if (dist < 0.5 && speed < 0.1) {
        setPos(initialPos);
        setRotExtra({ x: 0, y: 0, z: 0 });
        setFlying(false);
        return;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [flying]);

  return { pos, rotExtra, launch };
}

/* ── 3D Shield ──────────────────────────────────────────────── */
function Shield3D({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - cx) / rect.width;
    const dy = (clientY - cy) / rect.height;
    launch(dx * 18, dy * 18);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotateY: hovered ? [0, 20, -20, 0] : 0 }}
        transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, rotateY: { duration: 0.6 } }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotExtra.x}deg) rotateY(${rotExtra.y}deg) rotateZ(${rotExtra.z}deg)`,
          transition: 'transform 0.05s linear',
          filter: hovered ? 'drop-shadow(0 0 16px rgba(255,215,80,0.7))' : 'drop-shadow(0 0 8px rgba(255,215,80,0.3))',
        }}
      >
        {/* Shield body */}
        <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,215,80,0.9)" />
              <stop offset="100%" stopColor="rgba(255,180,0,0.6)" />
            </linearGradient>
            <linearGradient id="shieldFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,215,80,0.15)" />
              <stop offset="100%" stopColor="rgba(255,215,80,0.04)" />
            </linearGradient>
          </defs>
          {/* 3D left face */}
          <path d="M4 10 L28 4 L28 58 Q4 46 4 32Z" fill="rgba(255,180,0,0.2)" stroke="rgba(255,215,80,0.5)" strokeWidth="0.5" />
          {/* 3D right face */}
          <path d="M52 10 L28 4 L28 58 Q52 46 52 32Z" fill="rgba(255,215,80,0.12)" stroke="rgba(255,215,80,0.4)" strokeWidth="0.5" />
          {/* Front face */}
          <path d="M28 4 L50 12 L50 30 Q50 50 28 58 Q6 50 6 30 L6 12Z" fill="url(#shieldFace)" stroke="url(#shieldGrad)" strokeWidth="1.2" />
          {/* Inner glow check */}
          <path d="M19 30 L25 36 L37 23" stroke="rgba(255,215,80,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Shine */}
          <path d="M15 14 Q28 10 41 14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 3D Key ─────────────────────────────────────────────────── */
function Key3D({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (clientY - (rect.top + rect.height / 2)) / rect.height;
    launch(dx * 22, dy * 22);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div
        animate={{ rotate: hovered ? [0, -15, 15, 0] : [0, 5, -5, 0], y: [0, -8, 0] }}
        transition={{ rotate: { duration: 0.5 }, y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 } }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotExtra.x}deg) rotateY(${rotExtra.y}deg) rotateZ(${rotExtra.z}deg)`,
          filter: hovered ? 'drop-shadow(0 0 14px rgba(90,210,190,0.8))' : 'drop-shadow(0 0 6px rgba(90,210,190,0.3))',
        }}
      >
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
          <defs>
            <linearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(90,210,190,0.95)" />
              <stop offset="100%" stopColor="rgba(40,160,140,0.7)" />
            </linearGradient>
          </defs>
          {/* Key ring 3D */}
          <ellipse cx="16" cy="20" rx="13" ry="13" stroke="url(#keyGrad)" strokeWidth="4" fill="rgba(90,210,190,0.08)" />
          <ellipse cx="16" cy="20" rx="7" ry="7" stroke="rgba(90,210,190,0.4)" strokeWidth="1.5" fill="rgba(90,210,190,0.06)" />
          {/* Key shaft */}
          <rect x="28" y="17" width="32" height="6" rx="3" fill="url(#keyGrad)" opacity="0.85" />
          {/* Teeth */}
          <rect x="42" y="23" width="4" height="5" rx="1" fill="rgba(90,210,190,0.9)" />
          <rect x="50" y="23" width="4" height="8" rx="1" fill="rgba(90,210,190,0.9)" />
          <rect x="57" y="23" width="4" height="4" rx="1" fill="rgba(90,210,190,0.9)" />
          {/* Shine */}
          <line x1="30" y1="19" x2="55" y2="19" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 3D Lock ─────────────────────────────────────────────────── */
function Lock3D({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    setUnlocked(u => !u);
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (clientY - (rect.top + rect.height / 2)) / rect.height;
    launch(dx * 20, dy * 20);
    setTimeout(() => setUnlocked(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotateZ: hovered ? [0, -8, 8, 0] : 0 }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }, rotateZ: { duration: 0.5 } }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotExtra.x}deg) rotateY(${rotExtra.y}deg) rotateZ(${rotExtra.z}deg)`,
          filter: unlocked
            ? 'drop-shadow(0 0 18px rgba(62,207,142,0.9))'
            : hovered
              ? 'drop-shadow(0 0 14px rgba(255,215,80,0.7))'
              : 'drop-shadow(0 0 6px rgba(255,215,80,0.25))',
        }}
      >
        <svg width="44" height="56" viewBox="0 0 44 56" fill="none">
          <defs>
            <linearGradient id="lockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={unlocked ? 'rgba(62,207,142,0.95)' : 'rgba(255,215,80,0.95)'} />
              <stop offset="100%" stopColor={unlocked ? 'rgba(30,160,100,0.7)' : 'rgba(200,160,0,0.7)'} />
            </linearGradient>
            <linearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={unlocked ? 'rgba(62,207,142,0.18)' : 'rgba(255,215,80,0.18)'} />
              <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
            </linearGradient>
          </defs>
          {/* Shackle */}
          <motion.path
            d={unlocked ? "M12 24 L12 14 Q12 4 22 4 Q32 4 32 14 L32 18" : "M12 24 L12 14 Q12 4 22 4 Q32 4 32 14 L32 24"}
            stroke="url(#lockGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"
            animate={{ d: unlocked ? "M12 24 L12 14 Q12 4 22 4 Q32 4 32 14 L32 18" : "M12 24 L12 14 Q12 4 22 4 Q32 4 32 14 L32 24" }}
            transition={{ duration: 0.3 }}
          />
          {/* Body */}
          <rect x="4" y="24" width="36" height="28" rx="5" fill="url(#lockBody)" stroke="url(#lockGrad)" strokeWidth="1.5" />
          {/* 3D side face */}
          <path d="M40 24 L44 27 L44 52 L40 52Z" fill={unlocked ? 'rgba(62,207,142,0.15)' : 'rgba(255,215,80,0.12)'} />
          <path d="M4 52 L0 49 L0 24 L4 24Z" fill={unlocked ? 'rgba(62,207,142,0.1)' : 'rgba(255,215,80,0.08)'} />
          {/* Keyhole */}
          <circle cx="22" cy="36" r="4.5" fill={unlocked ? 'rgba(62,207,142,0.6)' : 'rgba(255,215,80,0.5)'} />
          <rect x="20" y="38" width="4" height="7" rx="2" fill={unlocked ? 'rgba(62,207,142,0.6)' : 'rgba(255,215,80,0.5)'} />
          {/* Shine */}
          <rect x="8" y="27" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 3D CPU Chip ─────────────────────────────────────────────── */
function Chip3D({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    setActive(true);
    setTimeout(() => setActive(false), 1200);
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (clientY - (rect.top + rect.height / 2)) / rect.height;
    launch(dx * 16, dy * 16);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div
        animate={{ rotateY: hovered ? [0, 25, -25, 0] : [0, 8, -8, 0], y: [0, -6, 0] }}
        transition={{ rotateY: { duration: 0.7 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 } }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotExtra.x + (hovered ? 15 : 0)}deg) rotateY(${rotExtra.y}deg) rotateZ(${rotExtra.z}deg)`,
          filter: active
            ? 'drop-shadow(0 0 20px rgba(91,141,238,0.95))'
            : hovered
              ? 'drop-shadow(0 0 12px rgba(91,141,238,0.7))'
              : 'drop-shadow(0 0 5px rgba(91,141,238,0.3))',
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <defs>
            <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(91,141,238,0.9)" />
              <stop offset="100%" stopColor="rgba(50,80,180,0.7)" />
            </linearGradient>
            <linearGradient id="chipFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(91,141,238,0.2)" />
              <stop offset="100%" stopColor="rgba(91,141,238,0.06)" />
            </linearGradient>
          </defs>
          {/* 3D top face offset */}
          <rect x="10" y="6" width="40" height="40" rx="4" fill="rgba(91,141,238,0.12)" stroke="rgba(91,141,238,0.3)" strokeWidth="0.5" />
          {/* Main body */}
          <rect x="14" y="10" width="34" height="34" rx="4" fill="url(#chipFace)" stroke="url(#chipGrad)" strokeWidth="1.5" />
          {/* Inner circuit grid */}
          {active && [18, 22, 26, 30, 34, 38].map(x =>
            [14, 18, 22, 26, 30, 34, 38].map(y => (
              <circle key={x + '-' + y} cx={x} cy={y + 10} r="0.8" fill="rgba(91,141,238,0.7)" />
            ))
          )}
          {/* Center processor */}
          <rect x="22" y="22" width="18" height="16" rx="2" fill="rgba(91,141,238,0.25)" stroke="rgba(91,141,238,0.6)" strokeWidth="1" />
          <rect x="25" y="25" width="12" height="10" rx="1" fill={active ? 'rgba(91,141,238,0.7)' : 'rgba(91,141,238,0.35)'} />
          {/* Pins top */}
          {[19, 24, 29, 34, 39].map(x => <rect key={'t' + x} x={x} y="7" width="2" height="4" rx="1" fill="rgba(91,141,238,0.7)" />)}
          {/* Pins bottom */}
          {[19, 24, 29, 34, 39].map(x => <rect key={'b' + x} x={x} y="49" width="2" height="4" rx="1" fill="rgba(91,141,238,0.7)" />)}
          {/* Pins left */}
          {[18, 23, 28, 33, 38].map(y => <rect key={'l' + y} x="7" y={y} width="4" height="2" rx="1" fill="rgba(91,141,238,0.7)" />)}
          {/* Pins right */}
          {[18, 23, 28, 33, 38].map(y => <rect key={'r' + y} x="49" y={y} width="4" height="2" rx="1" fill="rgba(91,141,238,0.7)" />)}
          {/* Shine */}
          <path d="M16 12 Q30 10 44 12" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 3D DNA / Binary Helix ───────────────────────────────────── */
function Helix3D({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (clientY - (rect.top + rect.height / 2)) / rect.height;
    launch(dx * 20, dy * 20);
  };

  // Build helix rungs
  const rungs = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    const phase = t * Math.PI * 2;
    const x1 = 10 + Math.cos(phase) * 12;
    const x2 = 10 + Math.cos(phase + Math.PI) * 12;
    const y = 6 + i * 10;
    const gold = i % 2 === 0;
    return { x1, x2, y, gold };
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div
        animate={{ rotateY: [0, 360], y: [0, -9, 0] }}
        transition={{ rotateY: { duration: 6, repeat: Infinity, ease: 'linear' }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotExtra.x}deg) rotateZ(${rotExtra.z}deg)`,
          filter: hovered ? 'drop-shadow(0 0 14px rgba(232,121,164,0.7))' : 'drop-shadow(0 0 6px rgba(232,121,164,0.25))',
        }}
      >
        <svg width="44" height="90" viewBox="0 0 22 90" fill="none">
          {/* Strands */}
          <path
            d={`M ${Array.from({ length: 20 }, (_, i) => { const t = i / 19; const ph = t * Math.PI * 2; return `${10 + Math.cos(ph) * 10} ${4 + t * 82}` }).join(' L ')}`}
            stroke="rgba(232,121,164,0.6)" strokeWidth="1.5" fill="none"
          />
          <path
            d={`M ${Array.from({ length: 20 }, (_, i) => { const t = i / 19; const ph = t * Math.PI * 2 + Math.PI; return `${10 + Math.cos(ph) * 10} ${4 + t * 82}` }).join(' L ')}`}
            stroke="rgba(255,215,80,0.6)" strokeWidth="1.5" fill="none"
          />
          {/* Rungs */}
          {rungs.map((r, i) => (
            <g key={i}>
              <line x1={r.x1} y1={r.y} x2={r.x2} y2={r.y}
                stroke={r.gold ? 'rgba(255,215,80,0.7)' : 'rgba(232,121,164,0.7)'}
                strokeWidth="1.2" />
              <circle cx={r.x1} cy={r.y} r="2.2" fill={r.gold ? 'rgba(255,215,80,0.9)' : 'rgba(232,121,164,0.9)'} />
              <circle cx={r.x2} cy={r.y} r="2.2" fill={r.gold ? 'rgba(255,215,80,0.6)' : 'rgba(232,121,164,0.6)'} />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

/* ── 3D Floating Binary Cube ─────────────────────────────────── */
function BinaryCube({ style }) {
  const init = { x: 0, y: 0 };
  const { pos, rotExtra, launch } = use3DObject(init);
  const [hovered, setHovered] = useState(false);

  const handleInteract = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (clientY - (rect.top + rect.height / 2)) / rect.height;
    launch(dx * 24, dy * 24);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteract}
      onTouchStart={handleInteract}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div
        animate={{ rotateX: [15, 25, 15], rotateY: [0, 360], y: [0, -8, 0] }}
        transition={{
          rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
          rotateX: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
        }}
        style={{
          transformStyle: 'preserve-3d',
          width: 46, height: 46,
          transform: `rotateX(${15 + rotExtra.x}deg) rotateY(${rotExtra.y}deg) rotateZ(${rotExtra.z}deg)`,
          filter: hovered ? 'drop-shadow(0 0 16px rgba(167,139,250,0.8))' : 'drop-shadow(0 0 7px rgba(167,139,250,0.3))',
        }}
      >
        {/* Cube faces using CSS 3D */}
        {[
          { transform: 'rotateY(0deg)   translateZ(23px)', face: 'front' },
          { transform: 'rotateY(180deg) translateZ(23px)', face: 'back' },
          { transform: 'rotateY(90deg)  translateZ(23px)', face: 'right' },
          { transform: 'rotateY(-90deg) translateZ(23px)', face: 'left' },
          { transform: 'rotateX(90deg)  translateZ(23px)', face: 'top' },
          { transform: 'rotateX(-90deg) translateZ(23px)', face: 'bot' },
        ].map(({ transform, face }) => (
          <div key={face} style={{
            position: 'absolute',
            width: 46, height: 46,
            transform,
            background: face === 'front'
              ? 'rgba(167,139,250,0.18)'
              : 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 7,
            fontFamily: '"JetBrains Mono", monospace',
            color: 'rgba(167,139,250,0.9)',
            letterSpacing: '0.05em',
            overflow: 'hidden',
          }}>
            {face === 'front' ? '10110\n01001\n11010' : face === 'top' ? 'ENC' : face === 'right' ? '256' : ''}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Cyber Canvas Background ────────────────────────────────── */
function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h;

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 42;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.8 + 0.6,
    }));
    let scanY = 0;
    const CHARS = '0123456789ABCDEF01';
    const drifters = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vy: Math.random() * 0.35 + 0.12, char: CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: Math.random() * 0.14 + 0.04, size: Math.floor(Math.random() * 4) + 9,
      timer: 0, interval: Math.floor(Math.random() * 80) + 35, cyan: Math.random() < 0.25,
    }));
    const pulses = []; let pulseTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,215,80,0.045)';
      for (let x = 0; x < w; x += 36) for (let y = 0; y < h; y += 36) {
        ctx.beginPath(); ctx.arc(x, y, 0.7, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) { ctx.strokeStyle = `rgba(255,215,80,${(1 - d / 150) * 0.08})`; ctx.lineWidth = 0.55; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
      }
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,215,80,0.18)'; ctx.fill();
        n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      scanY = (scanY + 0.45) % h;
      const sg = ctx.createLinearGradient(0, scanY - 55, 0, scanY + 55);
      sg.addColorStop(0, 'rgba(255,215,80,0)'); sg.addColorStop(0.5, 'rgba(255,215,80,0.035)'); sg.addColorStop(1, 'rgba(255,215,80,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, scanY - 55, w, 110);
      pulseTimer++; if (pulseTimer % 120 === 0) { const n = nodes[Math.floor(Math.random() * nodes.length)]; pulses.push({ x: n.x, y: n.y, r: 0, maxR: 80, alpha: 0.28 }); }
      for (let i = pulses.length - 1; i >= 0; i--) { const p = pulses[i]; p.r += 1.1; p.alpha = 0.28 * (1 - p.r / p.maxR); ctx.strokeStyle = `rgba(255,215,80,${p.alpha})`; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke(); if (p.r >= p.maxR) pulses.splice(i, 1); }
      drifters.forEach(d => { d.timer++; if (d.timer >= d.interval) { d.char = CHARS[Math.floor(Math.random() * CHARS.length)]; d.timer = 0; } ctx.font = `${d.size}px "JetBrains Mono",monospace`; ctx.fillStyle = d.cyan ? `rgba(100,220,200,${d.opacity})` : `rgba(255,215,80,${d.opacity})`; ctx.fillText(d.char, d.x, d.y); d.y += d.vy; if (d.y > h + 20) { d.y = -20; d.x = Math.random() * w; } });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

/* ── Top-Right Nav ──────────────────────────────────────────── */
function TopNav({ onNavigate }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      style={{ position: 'fixed', top: 20, right: 24, display: 'flex', gap: 8, zIndex: 20 }}
    >
      {['Documentation', 'Verification', 'About'].map((label, i) => (
        <motion.button
          key={label}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.07 }}
          onClick={() => onNavigate && onNavigate(label.toLowerCase())}
          style={{ background: 'rgba(13,15,18,0.7)', border: '1px solid rgba(255,215,80,0.14)', color: 'rgba(255,215,80,0.65)', fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'all 0.18s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,80,0.35)'; e.currentTarget.style.color = 'rgba(255,215,80,1)'; e.currentTarget.style.background = 'rgba(255,215,80,0.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,80,0.14)'; e.currentTarget.style.color = 'rgba(255,215,80,0.65)'; e.currentTarget.style.background = 'rgba(13,15,18,0.7)'; }}
        >
          {label}
        </motion.button>
      ))}
    </motion.nav>
  );
}

/* ── Decorative rotating rings ──────────────────────────────── */
function GlassGridPanel() {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(520px,90vw)', height: 'min(520px,90vw)', zIndex: 1, pointerEvents: 'none' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,215,80,0.07)' }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: '12%', borderRadius: '50%', border: '1px dashed rgba(255,215,80,0.05)' }} />
      <div style={{ position: 'absolute', inset: '32%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,80,0.04) 0%, transparent 70%)' }} />
    </div>
  );
}

/* ── Auth Success Page ──────────────────────────────────────── */
export function AuthSuccessPage() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const regComplete = params.get('reg_complete');
  const message = error ? decodeURIComponent(error.replace(/\+/g, ' ')) : regComplete ? 'Registration complete! You may now download your share.' : '';
  return (
    <div className="sv-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="sv-card" style={{ maxWidth: 480, width: '100%', padding: '48px 40px', textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}><LockIcon size={40} color={error ? 'var(--red)' : 'var(--gold)'} /></div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>Registration Status</h2>
        <p style={{ color: error ? 'var(--red)' : 'var(--gold)', marginBottom: 28, fontSize: '0.9rem' }}>{message}</p>
        <button className="sv-btn sv-btn-primary" onClick={() => window.location.href = '/'}>Go to Home</button>
      </motion.div>
    </div>
  );
}

/* ── Main App ───────────────────────────────────────────────── */
function App() {
  const location = useLocation();

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  let vaultUser = localStorage.getItem('vaultUser');
  let goldenKey = localStorage.getItem('goldenKey');
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
  const [showAbout, setShowAbout] = useState(() => { try { return !sessionStorage.getItem('about_seen'); } catch { return true; } });
  const [registrationComplete, setRegistrationComplete] = useState(false);

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
      try { res = await fetch(`${API_URL}/api/register/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), signal: controller.signal }); }
      catch (err) { if (err.name === 'AbortError') { setError('Vault creation timed out. Please try again.'); } else { setError('Network error: ' + err.message); } setLoading(false); return; }
      finally { clearTimeout(timeoutId); }
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
    setVaultPage(true); setCredentialsReady(true); setUnlockStep('login'); setPendingUnlock({ username: '', password: '' });
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
    if (target === 'about') { setShowAbout(true); try { sessionStorage.setItem('about_seen', '1'); } catch { } }
    else { setPage(target); }
  };

  // Route guards
  if (vaultPage && localStorage.getItem('justRegistered') === 'true') {
    setTimeout(() => localStorage.setItem('justRegistered', 'false'), 0);
    return <RegistrationVaultPage />;
  }
  if (vaultPage && credentialsReady && localStorage.getItem('justRegistered') !== 'true') {
    vaultUser = localStorage.getItem('vaultUser'); goldenKey = localStorage.getItem('goldenKey');
    return <VaultPage username={vaultUser} goldenKey={goldenKey} onLogout={() => { setVaultPage(false); setPage('login'); localStorage.removeItem('vaultUser'); localStorage.removeItem('goldenKey'); }} />;
  }

  /* ── Login Page ─────────────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">

      {page === 'login' && unlockStep === 'login' && (
        <motion.div
          key="login-centered"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'relative', minHeight: '100vh', width: '100%', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          {/* Layer 0: canvas bg */}
          <CyberBackground />

          {/* Layer 1: decorative rings */}
          <GlassGridPanel />

          {/* Layer 2: 3D floating objects — scattered around the login card */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>

            {/* Shield — top-left area */}
            <div style={{ position: 'absolute', top: '12%', left: '8%', pointerEvents: 'all' }}>
              <Shield3D style={{ display: 'inline-block' }} />
            </div>

            {/* Key — top-right area */}
            <div style={{ position: 'absolute', top: '18%', right: '10%', pointerEvents: 'all' }}>
              <Key3D style={{ display: 'inline-block' }} />
            </div>

            {/* Lock — bottom-left area */}
            <div style={{ position: 'absolute', bottom: '22%', left: '6%', pointerEvents: 'all' }}>
              <Lock3D style={{ display: 'inline-block' }} />
            </div>

            {/* CPU Chip — bottom-right area */}
            <div style={{ position: 'absolute', bottom: '15%', right: '7%', pointerEvents: 'all' }}>
              <Chip3D style={{ display: 'inline-block' }} />
            </div>

            {/* DNA/Binary Helix — far left center */}
            <div style={{ position: 'absolute', top: '42%', left: '3%', transform: 'translateY(-50%)', pointerEvents: 'all' }}>
              <Helix3D style={{ display: 'inline-block' }} />
            </div>

            {/* Binary Cube — far right center */}
            <div style={{ position: 'absolute', top: '38%', right: '4%', transform: 'translateY(-50%)', pointerEvents: 'all' }}>
              <BinaryCube style={{ display: 'inline-block' }} />
            </div>

          </div>

          {/* Layer 3: nav */}
          <TopNav onNavigate={handleNavigate} />

          {/* Layer 4: login form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 400, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,215,80,0.08)', border: '1px solid rgba(255,215,80,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 32px rgba(255,215,80,0.1)' }}>
                <LockIcon size={26} color="var(--gold)" />
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--gold)', letterSpacing: '0.03em', margin: 0, lineHeight: 1.1 }}>Shamir Vault</h1>
              <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase' }}>Secure Multi-Key Secret Management</p>
            </motion.div>

            {/* Glass card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.32, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', background: 'rgba(19,22,27,0.85)', border: '1px solid rgba(255,215,80,0.13)', borderRadius: 20, padding: '32px 28px 28px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,215,80,0.04) inset' }}
            >
              <div style={{ marginBottom: 16 }}>
                <label className="sv-label">Username</label>
                <input className="sv-input" type="text" id="login-username" name="username" placeholder="your_username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && document.getElementById('login-password')?.focus()} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="sv-label">Master Password</label>
                <input className="sv-input" type="password" id="login-password" name="password" placeholder="••••••••••••" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateVault()} />
              </div>

              <AnimatePresence>
                {error && (<motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}><div className="sv-alert sv-alert-error">{error}</div></motion.div>)}
                {success && (<motion.div key="ok" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}><div className="sv-alert sv-alert-success">{success}</div></motion.div>)}
              </AnimatePresence>

              <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleCreateVault} disabled={loading} style={{ height: 48, marginBottom: 10 }}>
                {loading && <span className="sv-spinner" />}
                Create New Vault
              </button>

              <button className="sv-btn sv-btn-secondary sv-btn-full" onClick={handleUnlockLogin} disabled={loading} style={{ height: 48 }}>
                {loading && <span className="sv-spinner" style={{ borderTopColor: 'var(--text-secondary)' }} />}
                Unlock Vault
              </button>

              <p style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: '0.68rem', textAlign: 'center', lineHeight: 1.65 }}>
                Vault creation requires Google OAuth for multi-share key distribution.
              </p>
            </motion.div>

            {/* Status row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>End-to-end encrypted · Shamir (2-of-3)</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {page === 'login' && unlockStep === 'uploadShare' && (
        <motion.div key="unlock-share" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <UnlockWithShare username={pendingUnlock.username} password={pendingUnlock.password} onUnlock={handleUnlockWithShare} onBack={() => { setUnlockStep('login'); setPendingUnlock({ username: '', password: '', }); }} />
        </motion.div>
      )}

    </AnimatePresence>
  );
}

export default App;
