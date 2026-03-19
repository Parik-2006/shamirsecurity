// ...existing code...
import { default as App, AuthSuccessPage } from './App';
  <Route path="/auth-success" element={<AuthSuccessPage />} />
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import VaultPage from './VaultPage';
import RegistrationVaultPage from './RegistrationVaultPage';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import DownloadShare from './pages/DownloadShare';
import About from './pages/about';
// Duplicate import removed

function Layout({ children }) {
  const location = useLocation();
  const noSidebar = location.pathname === '/' || location.pathname === '/download-share';

  const containerStyle = noSidebar
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