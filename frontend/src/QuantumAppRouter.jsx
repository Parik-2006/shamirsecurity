// ...existing code...
import { default as App, AuthSuccessPage } from './App';
  <Route path="/auth-success" element={<AuthSuccessPage />} />
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import DownloadShare from './pages/DownloadShare';
import About from './pages/about';
// Duplicate import removed

function AnimatedGridBG() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
          <gridHelper args={[40, 40, '#00ffe7', '#00ffe7']} />
        </mesh>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const noSidebar = location.pathname === '/' || location.pathname === '/download-share';

  const containerStyle = noSidebar
    ? { minHeight: '100vh', position: 'relative', zIndex: 1 }
    : { marginLeft: 120, minHeight: '100vh', position: 'relative', zIndex: 1 };

  return (
    <>
      <AnimatedGridBG />
      <div style={containerStyle}>
        {children}
      </div>
    </>
  );
}

export default function QuantumAppRouter({ username, goldenKey, onLogout }) {
  return (
    <Layout>

      <Routes>
        <Route path="/registration-vault" element={<RegistrationVaultPage />} />

        <Route path="/" element={<App />} />


        <Route path="/documentation" element={<Documentation />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/about" element={<About />} />

        <Route path="/auth-success" element={<AuthSuccessPage />} />


        <Route
          path="/vault"
          element={
            localStorage.getItem('justRegistered') === 'true'
              ? <RegistrationVaultPage />
              : <VaultPage
                  username={username}
                  goldenKey={goldenKey}
                  onLogout={onLogout}
                />
          }
        />

        <Route path="/download-share" element={<DownloadShare />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Layout>
  );
}