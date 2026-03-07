import React from 'react';
import { motion } from 'framer-motion';

// Cybersecurity 3D animated elements for login page
  if (zIndex === undefined || zIndex === null) zIndex = 1;
  return (
    <>
      {/* Removed animated 3D Padlock (lock) as requested */}
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
      {/* Animated 3D Rotating Network Node */}
      <motion.div
        style={{
          position: 'absolute', top: '12%', left: '12%', zIndex,
          filter: 'drop-shadow(0 0 18px #00fff799)',
        }}
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="24" stroke="#00fff7" strokeWidth="3" fill="#0a192f" />
          <circle cx="30" cy="30" r="8" fill="#00fff7" opacity="0.7" />
          <circle cx="12" cy="30" r="4" fill="#FFD700" />
          <circle cx="48" cy="30" r="4" fill="#FFD700" />
          <circle cx="30" cy="12" r="4" fill="#FFD700" />
          <circle cx="30" cy="48" r="4" fill="#FFD700" />
          <line x1="30" y1="12" x2="30" y2="48" stroke="#00fff7" strokeWidth="2" />
          <line x1="12" y1="30" x2="48" y2="30" stroke="#00fff7" strokeWidth="2" />
        </svg>
      </motion.div>
      {/* Animated 3D Floating Bug (Virus) Icon */}
      <motion.div
        style={{
          position: 'absolute', top: '22%', right: '18%', zIndex,
          filter: 'drop-shadow(0 0 12px #ef4444cc)',
        }}
        animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <ellipse cx="19" cy="22" rx="10" ry="8" fill="#ef4444" stroke="#FFD700" strokeWidth="2" />
          <ellipse cx="19" cy="22" rx="5" ry="4" fill="#FFD700" opacity="0.5" />
          <rect x="17" y="10" width="4" height="10" rx="2" fill="#FFD700" />
          <line x1="9" y1="30" x2="5" y2="36" stroke="#FFD700" strokeWidth="2" />
          <line x1="29" y1="30" x2="33" y2="36" stroke="#FFD700" strokeWidth="2" />
          <line x1="9" y1="14" x2="3" y2="10" stroke="#FFD700" strokeWidth="2" />
          <line x1="29" y1="14" x2="35" y2="10" stroke="#FFD700" strokeWidth="2" />
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
