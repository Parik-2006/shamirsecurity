// frontend/src/App.jsx
import React, { useState, useCallback } from 'react';

function App() {
  const [page, setPage] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goldenKey, setGoldenKey] = useState(null);
  const [vaultData, setVaultData] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [error, setError] = useState('');

  // --- FORM STATES FOR SECRETS ---
  const [newService, setNewService] = useState('');
  const [newServiceUser, setNewServiceUser] = useState(''); 
  const [newPass, setNewPass] = useState('');

  // --- VAULT ACTIONS ---

  // 1. Fetch Vault Data (Memoized for reliability)
  const fetchVault = useCallback(async (key) => {
    if (!key) return; // Prevent calls without a key
    try {
      const res = await fetch('http://localhost:5000/api/get_passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, golden_key: key }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setVaultData(data.passwords);
      }
    } catch (e) {
      console.error("Vault Fetch Error", e);
    }
  }, [username]);

  // 2. Handle Login
  const handleLogin = useCallback(async () => {
    setError('');
    const localShare = window.localStorage.getItem('local_share');
    if (!localShare) return setError('No local secret key found on this browser!');
    
    try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, local_share: localShare }),
        });
        const data = await res.json();
        
        if (data.status === 'success') {
          setGoldenKey(data.golden_key);
          setPage('view_vault');          
          await fetchVault(data.golden_key);   
        } else {
          setError(data.message);
        }
    } catch (e) {
      console.error(e);
      setError("Login failed: Backend busy or offline");
    }
  }, [username, password, fetchVault]);

  // 3. Handle Registration
  const handleRegister = async () => {
    setError('');
    try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        
        if (data.status === 'success') {
          window.localStorage.setItem('local_share', data.local_share);
          alert('Vault Created Successfully!');
          await handleLogin(); 
        } else {
          setError(data.message);
        }
    } catch (e) {
      console.error(e);
      setError("Registration failed: Backend offline");
    }
  };

  // 4. Add New Credential (FIXED: Await refresh before redirecting)
  const handleAddPassword = async () => {
    if (!newService || !newPass) return alert("Please fill all required fields");
    try {
      const res = await fetch('http://localhost:5000/api/add_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          golden_key: goldenKey,
          service_name: newService, 
          service_username: newServiceUser, 
          password_to_save: newPass // Matches backend key
        }),
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        // 1. Clear form inputs
        setNewService(''); 
        setNewServiceUser(''); 
        setNewPass('');
        // 2. FORCE REFRESH the vault data from Supabase
        await fetchVault(goldenKey);
        // 3. Go back to main table view
        setPage('view_vault'); 
      } else {
        alert("Save failed: " + data.message);
      }
    } catch (e) {
      console.error("Storage Error:", e);
    }
  };

  // 5. Global Logout
  const handleLogout = () => { 
    setGoldenKey(null); setPage('login'); setVaultData([]); setVisiblePasswords({}); setUsername(''); setPassword(''); setError('');
  };

  // --- RENDERING VIEWS ---

  if (page === 'view_vault') {
    return (
      <div className="app-wrapper">
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0 }}>🗄️ {username}'s Vault</h2>
            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setPage('add_entry')} style={{ backgroundColor: '#22c55e', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add New</button>
                <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
            </div>
        </header>

        <main style={{ padding: '50px 60px' }}>
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
                                <button onClick={() => setVisiblePasswords({...visiblePasswords, [i]: !visiblePasswords[i]})} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}>{visiblePasswords[i] ? 'HIDE' : 'SHOW'}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {vaultData.length === 0 && <p style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Your vault is currently empty.</p>}
          </div>
        </main>
      </div>
    );
  }

  if (page === 'add_entry') {
    return (
      <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh' }}>
        <div className="glass-card" style={{ padding: '50px', width: '450px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>🔓 Encrypt New Secret</h2>
          <input placeholder="Service (e.g. GitHub)" value={newService} onChange={e => setNewService(e.target.value)} />
          <input placeholder="Service Username" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} />
          <input type="password" placeholder="Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
          <button onClick={handleAddPassword} style={{ backgroundColor: '#6366f1', color: 'white', marginTop: '20px', padding: '15px', width: '100%', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Store in Vault</button>
          <button onClick={() => setPage('view_vault')} style={{ background: 'none', color: '#94a3b8', marginTop: '10px', width: '100%', border: 'none', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-1px' }}>🛡️ Shamir Vault</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Secure Multi-Key Secret Management</p>
      </div>
      
      <div className="glass-card" style={{ padding: '50px', width: '380px' }}>
        <input placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Master Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleRegister} style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Create New Vault</button>
          <button onClick={handleLogin} style={{ backgroundColor: '#6366f1', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Unlock Vault</button>
        </div>
      </div>
    </div>
  );
}

export default App;