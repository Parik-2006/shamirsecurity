import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FloatingShapes from './FloatingShapes';
import VaultPage from './VaultPage';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import DownloadShare from './pages/DownloadShare';
import Nav3D from './components/Nav3D';

export default function QuantumAppRouter({ username, goldenKey, onLogout }) {
  return (
    <Router>
      <Nav3D />
      <FloatingShapes zIndex={0} />
      <div style={{ marginLeft: 120, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/vault" element={<VaultPage username={username} goldenKey={goldenKey} onLogout={onLogout} />} />
          <Route path="/download-share" element={<DownloadShare />} />
          <Route path="*" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  );
}
