import React from 'react';
import { motion } from 'framer-motion';

// Cybersecurity 3D animated elements for login page
export default function CyberLogin3D({ zIndex = 1 }) {
  return (
    <>
      {/* Animated 3D Padlock */}
      <motion.div
        style={{
          position: 'absolute', top: '10%', left: '8%', zIndex,
          filter: 'drop-shadow(0 0 24px #FFD70099)',
        }}
        animate={{ rotateY: [0, 30, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="70" height="80" viewBox="0 0 70 80" fill="none">
          <defs>
            <linearGradient id="cyberLockGold" x1="0" y1="0" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFF8DC" />
            </linearGradient>
          </defs>
          <rect x="15" y="35" width="40" height="30" rx="10" fill="url(#cyberLockGold)" stroke="#FFD700" strokeWidth="3" />
          <ellipse cx="35" cy="50" rx="10" ry="12" fill="#fff2" />
          <path d="M25 35v-10a10 10 0 0 1 20 0v10" stroke="#FFD700" strokeWidth="3" fill="none" />
          {/* Circuit lines */}
          <path d="M35 65 Q40 70 45 65" stroke="#00F5D4" strokeWidth="2" fill="none" />
          <circle cx="45" cy="65" r="2.5" fill="#00F5D4" />
        </svg>
      </motion.div>
      {/* Animated 3D Shield with binary */}
      <motion.div
        style={{
          position: 'absolute', bottom: '12%', right: '10%', zIndex,
          filter: 'drop-shadow(0 0 18px #FFD70099)',
        }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="64" height="74" viewBox="0 0 64 74" fill="none">
          <defs>
            <linearGradient id="cyberShieldGold" x1="0" y1="0" x2="64" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFF8DC" />
            </linearGradient>
          </defs>
          <path d="M32 6 Q60 16 55 40 Q50 68 32 72 Q14 68 9 40 Q4 16 32 6Z" fill="url(#cyberShieldGold)" stroke="#FFD700" strokeWidth="3" />
          {/* Binary code */}
          <text x="16" y="38" fontSize="10" fill="#00F5D4" fontFamily="monospace">101010</text>
          <text x="16" y="50" fontSize="10" fill="#00F5D4" fontFamily="monospace">011011</text>
        </svg>
      </motion.div>
      {/* Animated 3D Key with pulse */}
      <motion.div
        style={{
          position: 'absolute', bottom: '20%', left: '16%', zIndex,
          filter: 'drop-shadow(0 0 16px #FFD70099)',
        }}
        animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <ellipse cx="15" cy="15" rx="13" ry="13" fill="#FFD700" stroke="#FFF8DC" strokeWidth="3" />
          <rect x="28" y="12" width="22" height="6" rx="2" fill="#FFD700" stroke="#FFF8DC" strokeWidth="2" />
          <rect x="50" y="10" width="6" height="10" rx="2" fill="#FFD700" stroke="#FFF8DC" strokeWidth="2" />
          <circle cx="15" cy="15" r="6" fill="#00F5D4" opacity="0.5">
            <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>
    </>
  );
}
