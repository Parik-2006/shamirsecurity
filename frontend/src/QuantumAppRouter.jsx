import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationVaultPage from './RegistrationVaultPage';
import UnlockWithShare from './UnlockWithShare';
import VaultPage from './VaultPage';

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
    <Router>
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
    </Router>
  );
}