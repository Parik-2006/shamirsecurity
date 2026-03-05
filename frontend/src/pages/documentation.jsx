import React from 'react';
import { motion } from 'framer-motion';
import FloatingShapes from '../FloatingShapes';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';


const palette = {
  bg: '#0a192f',
  grid: 'rgba(0,255,247,0.07)',
  cyan: '#00fff7',
  green: '#00ff85',
  yellow: '#ffe600',
  text: '#eaf6fb',
  card: 'rgba(10,25,47,0.92)',
};

const gridBg = {
  background: `repeating-linear-gradient(0deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 40px)`,
  backgroundColor: palette.bg,
  minHeight: '100vh',
  minWidth: '100vw',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
  width: '100%',
  height: '100%',
};

function AnimatedGrid({ position, color, size = 2, speed = 0.5 }) {
  // Simple animated 3D grid using react-three-fiber
  return (
    <Canvas style={{ position: 'absolute', ...position, width: 180, height: 180, pointerEvents: 'none', zIndex: 2 }} camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={color} />
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusKnotGeometry args={[0.7 * size, 0.18 * size, 80, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.6} roughness={0.3} wireframe />
      </mesh>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  );
}

export default function Documentation({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', position: 'relative', overflow: 'hidden', background: palette.bg }}>
      {/* Background grid, always at the back */}
      <div style={{ ...gridBg, zIndex: 0 }} />
      {/* Floating shapes, above background */}
      <FloatingShapes zIndex={1} />
      {/* 3D Animated Grids */}
      <AnimatedGrid position={{ top: 40, left: 40 }} color={palette.cyan} />
      <AnimatedGrid position={{ top: 40, right: 40 }} color={palette.yellow} />
      <AnimatedGrid position={{ bottom: 40, left: 40 }} color={palette.green} />
      <AnimatedGrid position={{ bottom: 40, right: 40 }} color={palette.cyan} />
      {/* Back Button */}
      <button onClick={onBack} style={{ position: 'fixed', top: 32, left: 32, zIndex: 20, background: palette.card, color: palette.cyan, border: `2px solid ${palette.cyan}`, borderRadius: 12, fontWeight: 700, fontSize: 18, padding: '10px 24px', boxShadow: '0 2px 16px #00fff755', cursor: 'pointer', outline: 'none', transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}>⟵ Back</button>
      {/* Main content, always on top */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '64px 24px 32px 24px' }}>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'anticipate' }} style={{ color: palette.cyan, fontSize: 38, fontWeight: 800, letterSpacing: 1.5, marginBottom: 32, textAlign: 'center', textShadow: '0 2px 24px #00fff755' }}>
          Documentation
        </motion.h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginBottom: 48 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: palette.card, borderRadius: 18, padding: 32, boxShadow: '0 4px 32px #0a192f55', border: `1.5px solid ${palette.cyan}33` }}>
            <h2 style={{ color: palette.green, fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Project Vision</h2>
            <p style={{ color: palette.text, fontSize: 17, lineHeight: 1.7 }}>
              <b>Shamir Secret Sharing</b> is a cryptographic approach that splits your master password into multiple pieces (shares). Only when enough shares are combined can the vault be unlocked. This means no single server or device ever holds the full secret, making your data quantum-resilient and future-proof.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: palette.card, borderRadius: 18, padding: 32, boxShadow: '0 4px 32px #0a192f55', border: `1.5px solid ${palette.green}33` }}>
            <h2 style={{ color: palette.cyan, fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Architecture</h2>
            <ul style={{ color: palette.text, fontSize: 17, lineHeight: 1.7, paddingLeft: 18 }}>
              <li><b>Share 1:</b> Google Drive (user-controlled cloud)</li>
              <li><b>Share 2:</b> Supabase (secure managed backend)</li>
              <li><b>Share 3:</b> Local Encrypted Storage (browser/device)</li>
            </ul>
            <p style={{ color: palette.yellow, fontWeight: 600, marginTop: 18 }}>No single point of compromise.</p>
          </motion.div>
        </div>
        <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ flex: 1, minWidth: 320, background: palette.card, borderRadius: 18, padding: 32, boxShadow: '0 4px 32px #0a192f55', border: `1.5px solid ${palette.cyan}33` }}>
            <h2 style={{ color: palette.yellow, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Centralized</h2>
            <ul style={{ color: palette.text, fontSize: 16, lineHeight: 1.7, paddingLeft: 18 }}>
              <li><b>Single Point of Failure:</b> One hack exposes everything.</li>
              <li>All secrets stored in one place.</li>
              <li>Trust is concentrated.</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ flex: 1, minWidth: 320, background: palette.card, borderRadius: 18, padding: 32, boxShadow: '0 4px 32px #0a192f55', border: `1.5px solid ${palette.green}33` }}>
            <h2 style={{ color: palette.cyan, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Decentralized (Our Project)</h2>
            <ul style={{ color: palette.text, fontSize: 16, lineHeight: 1.7, paddingLeft: 18 }}>
              <li><b>Distributed Trust:</b> Even if one part is hacked, the master password remains safe.</li>
              <li>Secrets split across independent locations.</li>
              <li>Quantum-resilient by design.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
