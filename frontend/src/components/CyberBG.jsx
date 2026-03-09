import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function CyberBG() {
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0}}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{background:'transparent'}}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color={'#00ffe7'} />
        <Stars radius={80} depth={50} count={500} factor={4} saturation={0.7} fade speed={2} />
        <mesh position={[0,0,0]}>
          <torusGeometry args={[2.5, 0.12, 16, 100]} />
          <meshStandardMaterial color={'#00ffe7'} emissive={'#00ffe7'} emissiveIntensity={0.7} metalness={0.8} roughness={0.2} />
        </mesh>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}
