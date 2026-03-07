import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import FloatingShapes from './FloatingShapes';
import VaultPage from './VaultPage';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import DownloadShare from './pages/DownloadShare';
import Nav3D from './components/Nav3D';
import App from './App';


const Layout = ({ children }) => {
  const location = useLocation();
  const isLogin = useMemo(() => location.pathname === '/', [location.pathname]);
  const containerStyle = useMemo(
    () =>
      isLogin
        ? { minHeight: '100vh', position: 'relative', zIndex: 1 }
        : { marginLeft: 120, minHeight: '100vh', position: 'relative', zIndex: 1 },
    [isLogin]
  );
  return (
    <>
      {!isLogin && <Nav3D />}
      <FloatingShapes zIndex={0} />
      <div style={containerStyle}>{children}</div>
    </>
  );
};

export default function QuantumAppRouter({ username, goldenKey, onLogout }) {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/verification" element={<Verification />} />
          <Route
            path="/vault"
            element={<VaultPage username={username} goldenKey={goldenKey} onLogout={onLogout} />}
          />
          <Route path="/download-share" element={<DownloadShare />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
