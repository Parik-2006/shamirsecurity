import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceLogo, VaultCyberBg } from './VaultShared';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-709.onrender.com';

// ── Icons ──────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function PasswordCell({ password }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-primary)', letterSpacing: visible ? 0 : '0.12em' }}>
        {visible ? password : '••••••••••'}
      </span>
      <button
        onClick={() => setVisible(v => !v)}
        style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderRadius:6, padding:'4px 7px', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', transition:'all var(--t-fast)' }}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

// ── Live logo preview next to the service input ───────────────────
function ServiceInputPreview({ value }) {
  if (!value) return null;
  return (
    <div style={{
      position: 'absolute',
      right: 10, top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    }}>
      <ServiceLogo name={value} />
    </div>
  );
}

export default function RegistrationVaultPage() {
  const navigate = useNavigate();
  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  const username  = localStorage.getItem('vaultUser') || 'User';
  const goldenKey = localStorage.getItem('goldenKey') || '';

  const [vaultData, setVaultData]           = useState([]);
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(true);
  const [newService, setNewService]         = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass, setNewPass]               = useState('');
  const [addSuccess, setAddSuccess]         = useState(false);

  const fetchVault = () => {
    setLoading(true);
    fetch(`${API_URL}/api/get_passwords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, golden_key: goldenKey })
    })
      .then(r => r.json())
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
    if (!newService || !newPass) { setError('Please fill Service name and Password'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/add_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, golden_key: goldenKey, service_name: newService, service_username: newServiceUser, password_to_save: newPass }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewService(''); setNewServiceUser(''); setNewPass('');
        setAddSuccess(true); setTimeout(() => setAddSuccess(false), 1500);
        fetchVault();
      } else { setError('Save Error: ' + (data.message || 'Unknown error')); }
    } catch { setError('Save failed.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'var(--bg-base)' }}>

      {/* ── Cyber background canvas ── */}
      <VaultCyberBg />

      {/* ── All content above canvas ── */}
      <div style={{ position:'relative', zIndex:1 }} className="vault-layout">

        {/* Navbar */}
        <nav className="sv-navbar">
          <div className="sv-navbar-brand">
            <div style={{ color:'var(--gold)', display:'flex' }}><LockIcon /></div>
            Shamir Vault
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span className="sv-badge sv-badge-gold">Registration</span>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>
              <span style={{ color:'var(--gold)', fontWeight:600 }}>{username}</span>
            </div>
            <button className="sv-btn sv-btn-ghost" onClick={handleLogout} style={{ padding:'8px 14px', fontSize:13 }}>
              <LogOutIcon />
              Logout
            </button>
          </div>
        </nav>

        <main className="vault-main">
          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:-10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4 }}
            style={{ marginBottom:28 }}
          >
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>
              Add Credentials
            </h1>
            <p style={{ color:'var(--text-muted)', fontSize:13 }}>
              Save your passwords to the encrypted vault
            </p>
          </motion.div>

          {/* Add form */}
          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.4 }}
            className="sv-card"
            style={{ padding:'24px 28px', marginBottom:24 }}
          >
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:18 }}>
              New Credential
            </h3>
            <form onSubmit={handleAddPassword}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:12, alignItems:'flex-end' }}>

                {/* Service field with live logo preview */}
                <div>
                  <label className="sv-label">Service</label>
                  <div style={{ position:'relative' }}>
                    <input
                      className="sv-input"
                      placeholder="github.com"
                      value={newService}
                      onChange={e => setNewService(e.target.value)}
                      style={{ paddingRight: newService ? 48 : undefined }}
                      required
                    />
                    <ServiceInputPreview value={newService} />
                  </div>
                </div>

                <div>
                  <label className="sv-label">Username</label>
                  <input className="sv-input" placeholder="optional" value={newServiceUser} onChange={e => setNewServiceUser(e.target.value)} />
                </div>
                <div>
                  <label className="sv-label">Password</label>
                  <input className="sv-input" type="password" placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                </div>
                <button
                  type="submit"
                  className={`sv-btn ${addSuccess ? 'sv-btn-ghost' : 'sv-btn-primary'}`}
                  disabled={loading}
                  style={{ alignSelf:'flex-end', minWidth:44, height:46, padding:'0 16px', transition:'all var(--t-base)', borderColor: addSuccess ? 'rgba(62,207,142,0.4)' : undefined, color: addSuccess ? 'var(--success)' : undefined, background: addSuccess ? 'rgba(62,207,142,0.08)' : undefined }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: addSuccess ? 'var(--success)' : '#0d0f12' }} /> : addSuccess ? <CheckIcon /> : <PlusIcon />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity:0, height:0 }}
                    animate={{ opacity:1, height:'auto' }}
                    exit={{ opacity:0, height:0 }}
                    transition={{ duration:0.2 }}
                    className="sv-alert sv-alert-error"
                    style={{ marginTop:14 }}
                  >
                    <span>⚠</span><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Vault table */}
          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.4 }}
            className="sv-card"
          >
            <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Vault</span>
              <span className="sv-badge sv-badge-muted">{vaultData.length} entries</span>
            </div>

            {loading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:48, color:'var(--text-muted)', fontSize:14 }}>
                <span className="sv-spinner" />
                Loading...
              </div>
            ) : vaultData.length === 0 ? (
              <div className="sv-empty">
                <div className="sv-empty-text">No secrets saved yet.<br/>Add your first credential above.</div>
              </div>
            ) : (
              <table className="sv-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {vaultData.map((item, idx) => (
                    <motion.tr
                      key={item.id || idx}
                      initial={{ opacity:0, x:-8 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: idx * 0.04, duration:0.28 }}
                    >
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <ServiceLogo name={item.service || '?'} />
                          <span style={{ fontWeight:500 }}>{item.service}</span>
                        </div>
                      </td>
                      <td style={{ color:'var(--text-secondary)' }}>{item.username || '—'}</td>
                      <td><PasswordCell password={item.password || ''} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </main>
      </div>

      {/* Responsive form */}
      <style>{`
        @media (max-width: 768px) {
          .reg-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
