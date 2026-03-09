import React from 'react';
import { motion } from 'framer-motion';
import FloatingShapes from '../FloatingShapes';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

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

// function AnimatedGrid({ position, color, size = 2 }) {
//   return (
//     <Canvas style={{ position: 'absolute', ...position, width: 180, height: 180, pointerEvents: 'none', zIndex: 2 }} camera={{ position: [0, 0, 6], fov: 50 }}>
//       <ambientLight intensity={0.6} />
//       <pointLight position={[5, 5, 5]} intensity={0.8} color={color} />
//       <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
//         <torusKnotGeometry args={[0.7 * size, 0.18 * size, 80, 8]} />
//         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.6} roughness={0.3} wireframe />
//       </mesh>
//       <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
//     </Canvas>
//   );
// }

export default function AboutPage({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', position: 'relative', overflow: 'hidden', background: palette.bg }}>
      {/* Background grid, always at the back */}
      <div style={{ ...gridBg, zIndex: 0 }} />
      <FloatingShapes zIndex={1} />
      {/* <AnimatedGrid position={{ top: 40, left: 40 }} color={palette.cyan} /> */}
      {/* <AnimatedGrid position={{ top: 40, right: 40 }} color={palette.yellow} /> */}
      {/* <AnimatedGrid position={{ bottom: 40, left: 40 }} color={palette.green} /> */}
      {/* <AnimatedGrid position={{ bottom: 40, right: 40 }} color={palette.cyan} /> */}
      <button onClick={onBack} style={{ position: 'fixed', top: 32, left: 32, zIndex: 20, background: 'linear-gradient(145deg, #151A21 60%, #23272f 100%)', color: palette.cyan, border: `2.5px solid #00fff7`, borderRadius: 14, fontWeight: 800, fontSize: 18, padding: '12px 28px', boxShadow: '4px 4px 16px #0a192f99, -4px -4px 16px #23272f55, 0 2px 8px #00fff733', cursor: 'pointer', outline: 'none', transition: 'all 0.18s cubic-bezier(.4,2,.6,1)', textShadow: '0 2px 8px #00fff744', letterSpacing: 0.7, minWidth: 0, minHeight: 0, lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: 0, perspective: 400, transformStyle: 'preserve-3d' }}>⟵ Back</button>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '64px 24px 32px 24px' }}>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'anticipate' }} style={{ color: palette.cyan, fontSize: 38, fontWeight: 800, letterSpacing: 1.5, marginBottom: 32, textAlign: 'center', textShadow: '0 2px 24px #00fff755' }}>
          About
        </motion.h1>
        <div style={{ background: palette.card, borderRadius: 18, padding: 32, boxShadow: '0 4px 32px #0a192f55', border: `1.5px solid ${palette.cyan}33`, color: palette.text, fontSize: 18, lineHeight: 1.7 }}>
          <b>Steps to run:</b>
          <ol style={{ margin: '18px 0 0 18px' }}>
            <li>Register with a strong password</li>
            <li>Complete Google authentication</li>
            <li>Download and keep your <b>local_share.enc</b> safe</li>
            <li>Use it to unlock your vault anytime</li>
          </ol>
          <div style={{ marginTop: 24 }}>
            For feedback or bug reports, email <a href="mailto:parikshithbb.cs25@rvce.edu.in" style={{ color: palette.cyan, textDecoration: 'underline', fontSize: 18 }}>mail</a> or join our <a href="https://discord.gg/YEwrW4M2" style={{ color: palette.cyan, textDecoration: 'underline', fontSize: 18 }}>Discord</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
