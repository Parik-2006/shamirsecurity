// frontend/src/App.jsx
import React, { useState } from 'react';
import Documentation from './pages/documentation';
import Verification from './pages/verification';
import FloatingShapes from './FloatingShapes';


function TopRightNav({ onNavigate }) {
  return (
    <div style={{
      position: 'absolute',
      top: 32,
      right: 32,
      display: 'flex',
      gap: 18,
      zIndex: 10
    }}>
      <button
        onClick={() => onNavigate('documentation')}
        style={{
          background: 'rgba(10,25,47,0.92)',
          color: '#00fff7',
          border: '2px solid #00fff7',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 18,
          padding: '12px 28px',
          boxShadow: '0 2px 16px #0a192f99',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
        }}
      >
        📘 Documentation
      </button>
      <button
        onClick={() => onNavigate('verification')}
        style={{
          background: 'rgba(10,25,47,0.92)',
          color: '#00ff85',
          border: '2px solid #00ff85',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 18,
          padding: '12px 28px',
          boxShadow: '0 2px 16px #0a192f99',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
        }}
      >
        ⚙️ Verification
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleNavigate = (target) => {
    setPage(target);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0a192f', position: 'relative', overflow: 'hidden' }}>
      <FloatingShapes zIndex={0} />
      <TopRightNav onNavigate={handleNavigate} />
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 12px', position: 'relative', zIndex: 2 }}>
        <h1 style={{ color: '#00fff7', fontWeight: 800, fontSize: 32, textAlign: 'center', marginBottom: 8 }}>Shamir Vault</h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', textAlign: 'center', marginBottom: 18 }}>
          Secure Multi-Key Secret Management
        </p>
        {page === 'login' && (
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  borderRadius: 8,
                  border: '1.5px solid #00fff7',
                  marginBottom: 12,
                  background: '#181c20',
                  color: '#eaf6fb',
                  outline: 'none',
                }}
              />
              <input
                type="password"
                placeholder="Master Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  borderRadius: 8,
                  border: '1.5px solid #00ff85',
                  background: '#181c20',
                  color: '#eaf6fb',
                  outline: 'none',
                }}
              />
            </div>
            <button
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 18,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #00fff7, #00ff85)',
                color: '#181c20',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 12,
                boxShadow: '0 2px 16px #00fff799',
              }}
            >
              Unlock Vault
            </button>
            <button
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 18,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #00ff85, #00fff7)',
                color: '#181c20',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 8,
                boxShadow: '0 2px 16px #00fff799',
              }}
            >
              Create New Vault
            </button>
          </div>
        )}
        {page === 'documentation' && (
          <div style={{ marginTop: 32 }}>
            <Documentation />
          </div>
        )}
        {page === 'verification' && (
          <div style={{ marginTop: 32 }}>
            <Verification />
          </div>
        )}
      </div>
    </div>
  );
}