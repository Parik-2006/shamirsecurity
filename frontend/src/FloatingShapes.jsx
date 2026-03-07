// FloatingShapes.jsx
import React from 'react';
import { motion } from 'framer-motion';


// Quantum Cyber Security color palette (strict, no purple/pink)
const COLORS = {
  blue: '#0a192f', // deep space blue
  cyan: '#00fff7',
  green: '#00ff85',
  yellow: '#ffe600',
  charcoal: '#181c20',
};

export default function FloatingShapes({ style = {}, zIndex = 0 }) {
  if (zIndex === undefined || zIndex === null) zIndex = 0;
  if (!style) style = {};
  return (
    <>
      {/* Cyan ring */}
      <motion.div
        style={{
          position: 'fixed', top: '8%', left: '6%', width: 110, height: 110,
          border: `2.5px solid ${COLORS.cyan}`,
          borderRadius: '50%', pointerEvents: 'none', zIndex,
          filter: 'drop-shadow(0 0 16px #00fff7cc)',
          background: 'transparent',
          ...style,
        }}
        animate={{ rotate: 360, scale: [1, 1.12, 1] }}
        transition={{ rotate: { duration: 32, repeat: Infinity, ease: 'linear' }, scale: { duration: 7, repeat: Infinity } }}
      />
      {/* Green square */}
      <motion.div
        style={{
          position: 'fixed', top: '60%', left: '10%', width: 38, height: 38,
          border: `2.5px solid ${COLORS.green}`,
          borderRadius: 8, pointerEvents: 'none', zIndex,
          filter: 'drop-shadow(0 0 10px #00ff85cc)',
          background: 'transparent',
          ...style,
        }}
        animate={{ rotate: [0, 180, 360], y: [0, -18, 0] }}
        transition={{ rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, y: { duration: 8, repeat: Infinity } }}
      />
      {/* Yellow dot */}
      <motion.div
        style={{
          position: 'fixed', top: '30%', right: '8%', width: 22, height: 22,
          background: COLORS.yellow, borderRadius: '50%', pointerEvents: 'none', zIndex,
          filter: 'drop-shadow(0 0 12px #ffe600cc)',
          ...style,
        }}
        animate={{ y: [0, 24, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blue orb */}
      <motion.div
        style={{
          position: 'fixed', bottom: '12%', right: '12%', width: 60, height: 60,
          background: COLORS.blue, borderRadius: '50%', pointerEvents: 'none', zIndex,
          filter: 'drop-shadow(0 0 18px #0a192fcc)',
          ...style,
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Cyan triangle */}
      <motion.div
        style={{
          position: 'fixed', bottom: '18%', left: '18%', width: 0, height: 0,
          borderLeft: '22px solid transparent', borderRight: '22px solid transparent',
          borderBottom: `38px solid ${COLORS.cyan}`, pointerEvents: 'none', zIndex,
          filter: 'drop-shadow(0 0 10px #00fff7cc)',
          ...style,
        }}
        animate={{ y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
