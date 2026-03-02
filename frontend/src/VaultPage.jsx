// frontend/src/VaultPage.jsx
import React, { useState, useEffect, useCallback } from 'react';

function VaultPage({ username, goldenKey, onLogout }) {
  const [vaultData, setVaultData] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('view'); // 'view' or 'add'
  
  // Form states for adding new entry
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass] = useState('');

  // Fetch vault data from Supabase
  const fetchVault = useCallback(async () => {
    if (!goldenKey) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/get_passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, golden_key: goldenKey }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setVaultData(data.passwords);
      } else {
        setError('Failed to load vault: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      console.error("Vault Fetch Error", e);
      setError('Network error loading vault');
    } finally {
      setLoading(false);
    }
  }, [username, goldenKey]);

  // Load vault on mount
  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  // Add new password
  const handleAddPassword = async () => {
    if (!newService || !newPass) {
      setError("Please fill Service name and Password");
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/add_password', {
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
        await fetchVault();
        setPage('view'); 
      } else {
        setError("Save Error: " + (data.message || "Unknown error"));
      }
    } catch (e) {
      console.error("Storage Error:", e);
      setError("Save failed: " + (e.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  // Add Entry Form View
  if (page === 'add') {
    return (
      <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh' }}>
        <div className="glass-card" style={{ padding: '50px', width: '450px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>🔓 Encrypt New Secret</h2>
          {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>}
          <input placeholder="Service (e.g. GitHub)" value={newService} onChange={e => setNewService(e.target.value)} />
          <input placeholder="Service Username" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} />
          <input type="password" placeholder="Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <button 
            onClick={handleAddPassword} 
            disabled={loading}
            style={{ backgroundColor: loading ? '#4b5563' : '#6366f1', color: 'white', marginTop: '20px', padding: '15px', width: '100%', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Saving...' : 'Store in Vault'}
          </button>
          <button onClick={() => { setError(''); setPage('view'); }} style={{ background: 'none', color: '#94a3b8', marginTop: '10px', width: '100%', border: 'none', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    );
  }

  // Main Vault View
  return (
    <div className="app-wrapper">
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: 0 }}>🗄️ {username}'s Vault</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setPage('add')} style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add New</button>
          <button onClick={() => fetchVault()} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔄 Refresh</button>
          <button onClick={onLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '50px 60px' }}>
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
            <p style={{ color: '#94a3b8' }}>Loading vault...</p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                <tr>
                  <th style={{ padding: '20px', textAlign: 'left', color: '#94a3b8' }}>Service</th>
                  <th style={{ padding: '20px', textAlign: 'left', color: '#94a3b8' }}>Username</th>
                  <th style={{ padding: '20px', textAlign: 'left', color: '#94a3b8' }}>Password</th>
                </tr>
              </thead>
              <tbody>
                {vaultData.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '20px' }}>{item.service}</td>
                    <td style={{ padding: '20px', color: '#cbd5e1' }}>{item.username}</td>
                    <td style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace' }}>{visiblePasswords[i] ? item.password : '••••••••'}</span>
                      <button 
                        onClick={() => setVisiblePasswords({...visiblePasswords, [i]: !visiblePasswords[i]})} 
                        style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}
                      >
                        {visiblePasswords[i] ? 'HIDE' : 'SHOW'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vaultData.length === 0 && <p style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Your vault is currently empty. Click "+ Add New" to store your first secret.</p>}
          </div>
        )}
      </main>
    </div>
  );
}

export default VaultPage;
