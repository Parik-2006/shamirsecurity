// frontend/src/VaultPage.jsx

import React, { useState, useEffect } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://shamirsecurity-098.onrender.com';

export default function VaultPage({ username, goldenKey, onLogout }) {
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

  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [page, setPage] = useState('view');

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

  const handleAddPassword = async (e) => {
    e.preventDefault();

    if (!newService || !newPass) {
      setError('Please fill Service name and Password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/add_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          golden_key: goldenKey,
          service_name: newService,
          service_username: newServiceUser,
          password_to_save: newPass,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setNewService('');
        setNewServiceUser('');
        setNewPass('');
        setVaultData(data.passwords || []);
      } else {
        setError(
          'Save Error: ' + (data.message || 'Unknown error')
        );
      }
    } catch (e) {
      setError('Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (idx) => {
    setVisiblePasswords({
      ...visiblePasswords,
      [idx]: !visiblePasswords[idx],
    });
  };

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
            {vaultData.length} secret
            {vaultData.length !== 1 ? 's' : ''} stored
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setPage('add')}
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
            Add
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

      {/* ADD PASSWORD FORM */}

      {page === 'add' && (
        <form
          onSubmit={handleAddPassword}
          style={{ marginBottom: 30 }}
        >
          <input
            placeholder="Service"
            value={newService}
            onChange={(e) =>
              setNewService(e.target.value)
            }
            style={{ marginRight: 8 }}
          />

          <input
            placeholder="Username (optional)"
            value={newServiceUser}
            onChange={(e) =>
              setNewServiceUser(e.target.value)
            }
            style={{ marginRight: 8 }}
          />

          <input
            placeholder="Password"
            value={newPass}
            onChange={(e) =>
              setNewPass(e.target.value)
            }
            style={{ marginRight: 8 }}
          />

          <button type="submit">Save</button>
        </form>
      )}

      {/* LOADING */}

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
              <th style={{ color: '#FFD66B' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vaultData.map((item, idx) => (
              <tr key={item.id || idx}>
                <td>{item.service}</td>

                <td>{item.username}</td>

                <td>
                  {visiblePasswords[idx]
                    ? item.password
                    : '••••••••'}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleToggleVisibility(idx)
                    }
                  >
                    {visiblePasswords[idx]
                      ? 'Hide'
                      : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}