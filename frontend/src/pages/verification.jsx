import React from 'react';
import { motion } from 'framer-motion';
import FloatingShapes from '../FloatingShapes';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function GlowingCog() {
  return (
    <Canvas style={{ height: 180, width: 180, margin: '0 auto', display: 'block' }} camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00fff7" />
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.9, 0.22, 16, 64]} />
        <meshStandardMaterial color="#00fff7" emissive="#00fff7" emissiveIntensity={0.7} metalness={0.7} roughness={0.2} />
      </mesh>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  );
}

export default function Verification({ onBack }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.7, ease: 'anticipate' }} style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', background: '#0a192f', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
      <FloatingShapes zIndex={1} />
      <button onClick={onBack} style={{ position: 'fixed', top: 32, left: 32, zIndex: 20, background: '#151A21', color: '#00fff7', border: '2px solid #00fff7', borderRadius: 12, fontWeight: 700, fontSize: 18, padding: '10px 24px', boxShadow: '0 2px 16px #00fff755', cursor: 'pointer', outline: 'none', transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}>⟵ Back</button>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} style={{ filter: 'drop-shadow(0 0 32px #00fff7cc)' }}>
          <GlowingCog />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ color: '#00fff7', fontWeight: 700, fontSize: 22, marginTop: 32, textShadow: '0 2px 24px #00fff755', letterSpacing: 1.2 }}>
          Working on it...
        </motion.div>
      </div>
    </motion.div>
  );
}
