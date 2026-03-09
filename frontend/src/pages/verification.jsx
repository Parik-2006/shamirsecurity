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

export default function Verification() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.7, ease: 'anticipate' }} style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', background: '#0a192f', position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}>
      <FloatingShapes zIndex={1} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Verification</h1>
        <div style={{ maxWidth: 600, textAlign: 'left', margin: '0 auto', color: '#fff', background: '#181a20', padding: 32, borderRadius: 12 }}>
          <h2>How to Verify Your Share</h2>
          <ol>
            <li>Go to the Unlock page.</li>
            <li>Upload your share file and enter your username.</li>
            <li>If your share is valid, you will be able to access your vault.</li>
          </ol>
          <p>
            If you have any issues, please contact support.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
