import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const palette = {
  cyan: '#00fff7',
  green: '#00ff85',
  bg: '#0a192f',
  card: 'rgba(10,25,47,0.92)',
  shadow: '0 4px 32px #00fff755',
};

function Button3D({ label, to, icon, color = palette.cyan }) {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: `${palette.shadow}` }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(to)}
      style={{
        background: palette.card,
        border: `2.5px solid ${color}`,
        color,
        borderRadius: 16,
        fontWeight: 700,
        fontSize: 18,
        padding: '18px 32px',
        margin: '12px 0',
        boxShadow: '0 2px 16px #0a192f99',
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
      }}
    >
      {icon && <span style={{ fontSize: 26, display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {label}
    </motion.button>
  );
}

export default function Nav3D() {
  return (
    <nav style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 120, background: 'rgba(10,25,47,0.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', zIndex: 100 }}>
      <Button3D label="Documentation" to="/documentation" icon={<span>📘</span>} color={palette.cyan} />
      <Button3D label="Verification" to="/verification" icon={<span>⚙️</span>} color={palette.green} />
    </nav>
  );
}
