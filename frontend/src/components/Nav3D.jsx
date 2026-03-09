// Nav3D.jsx
// Restored: 3D-styled navigation bar/buttons
import React from 'react';

export default function Nav3D({ onNavigate }) {
  return (
    <nav style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <button onClick={() => onNavigate('documentation')} style={{ fontWeight: 'bold', borderRadius: 8, boxShadow: '0 2px 8px #00fff7', background: '#151A21', color: '#00fff7', border: '2px solid #00fff7', padding: '10px 24px', cursor: 'pointer' }}>Documentation</button>
      <button onClick={() => onNavigate('verification')} style={{ fontWeight: 'bold', borderRadius: 8, boxShadow: '0 2px 8px #00fff7', background: '#151A21', color: '#00fff7', border: '2px solid #00fff7', padding: '10px 24px', cursor: 'pointer' }}>Verification</button>
      <button onClick={() => onNavigate('about')} style={{ fontWeight: 'bold', borderRadius: 8, boxShadow: '0 2px 8px #00fff7', background: '#151A21', color: '#00fff7', border: '2px solid #00fff7', padding: '10px 24px', cursor: 'pointer' }}>About</button>
    </nav>
  );
}
