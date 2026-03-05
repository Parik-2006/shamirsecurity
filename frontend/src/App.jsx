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
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FloatingShapes zIndex={0} />
      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <TopRightNav onNavigate={handleNavigate} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ maxWidth: 420, width: '95vw', padding: '40px 24px', background: '#151A21', borderRadius: 28, boxShadow: '0 8px 48px #000b, 0 1.5px 16px #00F5D422', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className="floating" style={{ color: '#00F5D4', fontWeight: 800, fontSize: 40, textAlign: 'center', marginBottom: 8, letterSpacing: 1.2, textShadow: '0 2px 10px #00F5D433' }}>Shamir Vault</h1>
          <p style={{ color: '#40E0FF', fontSize: '1.1rem', textAlign: 'center', marginBottom: 28, letterSpacing: 0.7, textShadow: '0 1px 8px #10131a' }}>
            Secure Multi-Key Secret Management
          </p>
          {page === 'login' && (
            <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 17,
                  borderRadius: 10,
                  border: '1.5px solid #00F5D4',
                  marginBottom: 14,
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
                  padding: '14px',
                  fontSize: 17,
                  borderRadius: 10,
                  border: '1.5px solid #40E0FF',
                  background: '#181c20',
                  color: '#eaf6fb',
                  outline: 'none',
                  marginBottom: 22,
                }}
              />
              <button
                className="floating"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 20,
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #151A21 60%, #00F5D4 100%)',
                  color: '#00F5D4',
                  border: '2px solid #00F5D4',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 18,
                  boxShadow: '0 2px 8px #00F5D422',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
              >
                Create New Vault
              </button>
              <button
                className="floating"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: 20,
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #151A21 60%, #40E0FF 100%)',
                  color: '#40E0FF',
                  border: '2px solid #40E0FF',
                  borderRadius: 14,
                  cursor: 'pointer',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #40E0FF22',
                  letterSpacing: 1.1,
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                }}
              >
                Unlock Vault
              </button>
            </div>
          )}
        </div>
      </div>
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
  );
}