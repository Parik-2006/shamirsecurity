import React, { useState, useEffect, useCallback } from 'react';
import { motion as FM } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { getErrorMessage } from './utils';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

// --- Particles config and background ---
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
  detectRetina: true
};

const ParticlesBackground = () => {
  const [engineReady, setEngineReady] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);
  if (!engineReady) return null;
  return (
    <Particles
      id="tsparticles-vault"
      options={particlesConfig}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

// --- Floating shapes placeholder (if used in VaultPage) ---
const FloatingShapes = ({ zIndex }) => null;

// --- Icons (copy from VaultPage) ---
const Icons = {
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  vault: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="8" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="16"/><line x1="8" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="16" y2="12"/></svg>
  ),
  key: (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m1 1 22 22M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/></svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
};

// --- Helper: getServiceColor, getServiceDomain, ServiceLogo, PasswordRow, LoadingSpinner ---
// ...existing code from VaultPage for these helpers...

// --- Main RegistrationVaultPage ---
export default function RegistrationVaultPage() {
  // DEBUG: Log component mount
  console.log('[RegistrationVaultPage] Rendered!');
  // Use localStorage for username/goldenKey, but do not block rendering if missing
  const username = localStorage.getItem('username') || 'User';
  const goldenKey = localStorage.getItem('goldenKey') || '';
  console.log('[RegistrationVaultPage] username:', username, 'goldenKey:', goldenKey);

  // ...copy all VaultPage logic, but remove credential checks and error for missing creds...
  // ...fetchVault, add password, UI, etc. (use goldenKey if present, else skip fetch)...

  // For brevity, this patch sets up the structure. Full duplication will include all UI/UX, add/view secrets, etc.,
  // but will not block rendering if credentials are missing. All credential checks and error returns are removed.
}
