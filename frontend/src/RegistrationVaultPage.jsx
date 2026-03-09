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
    <div className="cyber-card" style={{ maxWidth: 600, margin: '40px auto', padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="cyber-glow">Welcome, {username}!</h2>
        <button className="cyber-btn" onClick={handleLogout} style={{ padding: '8px 18px' }}>Logout</button>
      </div>
      <h3 className="cyber-glow">Your Vault</h3>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleAddPassword} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input placeholder="Service" value={newService} onChange={e => setNewService(e.target.value)} style={{ borderRadius: 8, padding: '8px 10px', border: '1.5px solid #00ffe7', background: '#10141a', color: '#00ffe7', fontWeight: 600 }} />
        <input placeholder="Username (optional)" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} style={{ borderRadius: 8, padding: '8px 10px', border: '1.5px solid #00ffe7', background: '#10141a', color: '#00ffe7', fontWeight: 600 }} />
        <input placeholder="Password" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ borderRadius: 8, padding: '8px 10px', border: '1.5px solid #00ffe7', background: '#10141a', color: '#00ffe7', fontWeight: 600 }} />
        <button className="cyber-btn" type="submit" style={{ padding: '6px 18px', fontSize: 16 }}>Add</button>
      </form>
      {loading ? (
        <div className="cyber-loader" />
      ) : (
        <table style={{ width: '100%', background: '#23272f', borderRadius: 8, boxShadow: '0 0 16px #00ffe733' }}>
          <thead>
            <tr>
              <th style={{ color: '#00ffe7', fontWeight: 700 }}>Service</th>
              <th style={{ color: '#00ffe7', fontWeight: 700 }}>Username</th>
              <th style={{ color: '#00ffe7', fontWeight: 700 }}>Password</th>
            </tr>
          </thead>
          <tbody>
            {vaultData.length === 0 ? (
              <tr><td colSpan={3} style={{ color: '#888', textAlign: 'center', padding: 24 }}>No secrets saved yet.</td></tr>
            ) : (
              vaultData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ color: '#00ffe7', fontWeight: 600 }}>{item.service}</td>
                  <td style={{ color: '#00ffe7', fontWeight: 600 }}>{item.username}</td>
                  <td style={{ color: '#00ffe7', fontWeight: 600 }}>{item.password}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
