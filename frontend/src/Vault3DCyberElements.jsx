import React from 'react';
import { motion } from 'framer-motion';

// Cybersecurity-themed 3D animated elements for VaultPage
export default function Vault3DCyberElements({ zIndex = 1 }) {
  return (
    <>
      {/* Animated 3D Safe */}
      <motion.div
        style={{
          position: 'absolute', top: '14%', left: '7%', zIndex,
          filter: 'drop-shadow(0 0 24px #FFD70099)',
        }}
        animate={{ rotateY: [0, 25, -25, 0], scale: [1, 1.10, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <defs>
            <linearGradient id="vaultSafeGold" x1="0" y1="0" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFF8DC" />
            </linearGradient>
          </defs>
          <rect x="8" y="8" width="54" height="54" rx="10" fill="url(#vaultSafeGold)" stroke="#FFD700" strokeWidth="3" />
          <circle cx="35" cy="35" r="10" fill="#FFF8DC" stroke="#FFD700" strokeWidth="2" />
          <line x1="35" y1="25" x2="35" y2="45" stroke="#FFD700" strokeWidth="2" />
          <line x1="25" y1="35" x2="45" y2="35" stroke="#FFD700" strokeWidth="2" />
        </svg>
      </motion.div>
      {/* Animated 3D Circuit Board */}
      <motion.div
        style={{
          position: 'absolute', bottom: '12%', right: '8%', zIndex,
          filter: 'drop-shadow(0 0 18px #00F5D499)',
        }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="#151A21" stroke="#00F5D4" strokeWidth="3" />
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#00F5D4" opacity="0.12" />
          <circle cx="32" cy="32" r="8" fill="#00F5D4" opacity="0.18" />
          <line x1="32" y1="8" x2="32" y2="20" stroke="#00F5D4" strokeWidth="2" />
          <line x1="32" y1="44" x2="32" y2="56" stroke="#00F5D4" strokeWidth="2" />
          <line x1="8" y1="32" x2="20" y2="32" stroke="#00F5D4" strokeWidth="2" />
          <line x1="44" y1="32" x2="56" y2="32" stroke="#00F5D4" strokeWidth="2" />
        </svg>
      </motion.div>
      {/* Animated 3D Binary Rain */}
      <motion.div
        style={{
          position: 'absolute', top: '18%', right: '14%', zIndex,
          pointerEvents: 'none',
        }}
        animate={{ y: [0, 30, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <text x="10" y="20" fontSize="16" fill="#00F5D4" fontFamily="monospace">101101</text>
          <text x="10" y="40" fontSize="16" fill="#FFD700" fontFamily="monospace">011010</text>
          <text x="10" y="55" fontSize="12" fill="#00F5D4" fontFamily="monospace">110011</text>
        </svg>
      </motion.div>
    </>
  );
}
