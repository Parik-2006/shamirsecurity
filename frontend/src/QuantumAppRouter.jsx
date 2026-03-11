<<<<<<< HEAD
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationVaultPage from './RegistrationVaultPage';
import UnlockWithShare from './UnlockWithShare';
import VaultPage from './VaultPage';
=======
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
// Duplicate import removed
>>>>>>> copy_parik2

export default function QuantumAppRouter() {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [goldenKey, setGoldenKey] = useState(() => localStorage.getItem('goldenKey'));

  const handleLogin = (user, key) => {
    setUsername(user);
    setGoldenKey(key);
    localStorage.setItem('username', user);
    localStorage.setItem('goldenKey', key);
  };

  const handleLogout = () => {
    setUsername(null);
    setGoldenKey(null);
    localStorage.removeItem('username');
    localStorage.removeItem('goldenKey');
  };

  return (
<<<<<<< HEAD
    <Routes>
      <Route
        path="/"
        element={
          username && goldenKey ? (
            <VaultPage username={username} goldenKey={goldenKey} onLogout={handleLogout} />
          ) : (
            <RegistrationVaultPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/unlock"
        element={<UnlockWithShare onLogin={handleLogin} />}
      />
      <Route
        path="/registration-vault"
        element={<RegistrationVaultPage onLogin={handleLogin} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
=======
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
>>>>>>> copy_parik2
  );
}