import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function GlowingCog() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#00fff7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" stroke="#00fff7" strokeWidth="2.5" fill="none" />
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M13.5 13.5l4.2 4.2M30.3 30.3l4.2 4.2M13.5 34.5l4.2-4.2M30.3 17.7l4.2-4.2" />
    </svg>
  );
}

export default function Verification() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.7, ease: 'anticipate' }} style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', background: '#0a192f', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
      <button onClick={() => navigate('/login')} style={{ position: 'fixed', top: 24, left: 24, zIndex: 20, background: '#151A21', color: '#00fff7', border: '2px solid #00fff7', borderRadius: 12, fontWeight: 700, fontSize: 18, padding: '10px 24px', boxShadow: '0 2px 16px #00fff755', cursor: 'pointer', outline: 'none', transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}>← Back</button>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} style={{ filter: 'drop-shadow(0 0 32px #00fff7cc)' }}>
          <GlowingCog />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ color: '#00fff7', fontWeight: 700, fontSize: 22, marginTop: 32, textShadow: '0 2px 24px #00fff755', letterSpacing: 1.2 }}>
          Verification is under development.<br />Please check back soon!
        </motion.div>
      </div>
    </motion.div>
  );
}
