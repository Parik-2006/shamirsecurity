// RegistrationVaultPage.jsx
// Restored: Page shown after registration for share download/instructions
import React from 'react';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';
export default function RegistrationVaultPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('vaultUser') || 'User';
  const goldenKey = localStorage.getItem('goldenKey') || '';
  const [vaultData, setVaultData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  // Helper to fetch vault
  const fetchVault = () => {
    setLoading(true);
    fetch(`${API_URL}/api/get_passwords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, golden_key: goldenKey })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setVaultData(data.passwords);
        else setError('Failed to load vault: ' + (data.message || 'Unknown error'));
      })
      .catch(() => setError('Network error loading vault.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!goldenKey) { setLoading(false); return; }
    fetchVault();
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
          password_to_save: newPass
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewService('');
        setNewServiceUser('');
        setNewPass('');
        fetchVault(); // Fetch latest vault after add
      } else {
        setError('Save Error: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      setError('Save failed.');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#181a20', borderRadius: 16, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {username}!</h2>
        <button onClick={handleLogout} style={{ background: '#FFD66B', color: '#181a20', fontWeight: 700, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>Logout</button>
      </div>
      <h3>Your Vault</h3>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleAddPassword} style={{ marginBottom: 24 }}>
        <input placeholder="Service" value={newService} onChange={e => setNewService(e.target.value)} style={{ marginRight: 8 }} />
        <input placeholder="Username (optional)" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} style={{ marginRight: 8 }} />
        <input placeholder="Password" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ marginRight: 8 }} />
        <button type="submit" style={{ padding: '6px 18px' }}>Add</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', background: '#23272f', borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ color: '#FFD66B' }}>Service</th>
              <th style={{ color: '#FFD66B' }}>Username</th>
              <th style={{ color: '#FFD66B' }}>Password</th>
            </tr>
          </thead>
          <tbody>
            {vaultData.length === 0 ? (
              <tr><td colSpan={3} style={{ color: '#888', textAlign: 'center', padding: 24 }}>No secrets saved yet.</td></tr>
            ) : (
              vaultData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>{item.service}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
