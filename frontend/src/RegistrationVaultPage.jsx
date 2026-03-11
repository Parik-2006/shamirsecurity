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
    <div className="cyber-bg cyber-login-wrapper">
      <div className="cyber-login-card animate-fade-in" style={{ maxWidth: 600 }}>
        <div className="cyber-login-header" style={{ justifyContent: 'space-between' }}>
          <h2 className="cyber-title" style={{ fontSize: 28 }}>Welcome, {username}!</h2>
          <button className="cyber-btn cyber-btn-outline" onClick={handleLogout}>Logout</button>
        </div>
        <h3 className="cyber-subtitle" style={{ marginBottom: 18 }}>Your Vault</h3>
        {error && <div className="cyber-error-msg">{error}</div>}
        <form onSubmit={handleAddPassword} className="cyber-login-form" style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          <input className="cyber-input" placeholder="Service" value={newService} onChange={e => setNewService(e.target.value)} />
          <input className="cyber-input" placeholder="Username (optional)" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} />
          <input className="cyber-input" placeholder="Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <button type="submit" className="cyber-btn cyber-btn-neon">Add</button>
        </form>
        {loading ? ( 
            <div className="cyber-loading">Loading...</div>
          ) : (
            <table className="cyber-vault-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {vaultData.length === 0 ? (
                  <tr><td colSpan={3} className="cyber-empty">No secrets saved yet.</td></tr>
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
      </div>
    );
>>>>>>> copy_parik2
}
