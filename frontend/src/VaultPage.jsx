// frontend/src/VaultPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://shamirsecurity-098.onrender.com';

export default function VaultPage({ username, goldenKey, onLogout }) {
  const navigate = useNavigate();
  if (!username || !goldenKey) {
    return (
      <div style={{ color: 'red', padding: 40, textAlign: 'center' }}>
        Error: Missing required credentials. Please log in again.
      </div>
    );
  }

  const [vaultData, setVaultData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Remove add form and editing

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/get_passwords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, golden_key: goldenKey }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setVaultData(data.passwords);
        } else {
          setError(
            'Failed to load vault: ' +
              (data.message || 'Unknown error')
          );
        }
      })
      .catch(() =>
        setError('Network error loading vault.')
      )
      .finally(() => setLoading(false));
  }, [username, goldenKey]);

  // Remove add password and visibility logic

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 24,
        background: '#181a20',
        borderRadius: 16,
        color: '#fff',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>{username}'s Vault</h2>
          <p style={{ margin: 0, color: '#888' }}>
            {vaultData.length} secret{vaultData.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/registration-vault')}
            style={{
              padding: '10px 18px',
              background: '#FFD66B',
              color: '#181a20',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Add New Password
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 18px',
              background: '#FFD66B',
              color: '#181a20',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ERROR */}
      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}



      {/* VAULT TABLE AREA: loading, empty, or table */}
      <div style={{ minHeight: 200 }}>
        {loading ? (
          <div>Loading...</div>
        ) : vaultData.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#888',
            }}
          >
            Your vault is empty.
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#23272f',
            }}
          >
            <thead>
              <tr>
                <th style={{ color: '#FFD66B' }}>Service</th>
                <th style={{ color: '#FFD66B' }}>Username</th>
                <th style={{ color: '#FFD66B' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {vaultData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.service}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}