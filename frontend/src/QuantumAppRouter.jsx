import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import VaultPage from './VaultPage';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import DownloadShare from './pages/DownloadShare';
import App from './App';

function Layout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === '/';

  const containerStyle = isLogin
    ? { minHeight: '100vh', position: 'relative', zIndex: 1 }
    : { marginLeft: 120, minHeight: '100vh', position: 'relative', zIndex: 1 };

  return (
    <>
      {/* cleaned up */}

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

        <Route path="/" element={<App />} />

        <Route path="/documentation" element={<Documentation />} />

        <Route path="/verification" element={<Verification />} />

        <Route
          path="/vault"
          element={
            <VaultPage
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