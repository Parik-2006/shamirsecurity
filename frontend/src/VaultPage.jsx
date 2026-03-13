import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceLogo, VaultPageCyberBg } from './VaultShared';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

// ── Icons ──────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ── Password cell with toggle + copy ──────────────────────────────
function PasswordCell({ password }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied]   = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(password).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-primary)', letterSpacing: visible ? 0 : '0.12em' }}>
        {visible ? password : '••••••••••'}
      </span>
      <button
        onClick={() => setVisible(v => !v)}
        style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)', borderRadius:6, padding:'4px 7px', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', transition:'all var(--t-fast)' }}
        title={visible ? 'Hide' : 'Show'}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
      <button
        onClick={copy}
        style={{ background: copied ? 'rgba(62,207,142,0.12)' : 'var(--bg-elevated)', border:`1px solid ${copied ? 'rgba(62,207,142,0.25)' : 'var(--border-subtle)'}`, borderRadius:6, padding:'4px 7px', cursor:'pointer', color: copied ? 'var(--success)' : 'var(--text-muted)', display:'flex', alignItems:'center', transition:'all var(--t-fast)' }}
        title="Copy password"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

// ── Main VaultPage ──────────────────────────────────────────────────
export default function VaultPage({ username, goldenKey, onLogout }) {
  const navigate = useNavigate();

  if (!username || !goldenKey) {
    return (
      <div className="sv-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="sv-alert sv-alert-error" style={{ maxWidth:400 }}>
          <span>⚠</span><span>Missing credentials. Please log in again.</span>
        </div>
      </div>
    );
  }

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  const [vaultData, setVaultData] = useState([]);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/get_passwords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, golden_key: goldenKey }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') setVaultData(data.passwords);
        else setError('Failed to load vault: ' + (data.message || 'Unknown error'));
      })
      .catch(() => setError('Network error loading vault.'))
      .finally(() => setLoading(false));
  }, [username, goldenKey]);

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'var(--bg-base)' }}>

      {/* ── Cyber background canvas ── */}
      <VaultPageCyberBg />

      {/* ── All content sits above canvas ── */}
      <div style={{ position:'relative', zIndex:1 }} className="vault-layout">

        {/* Navbar */}
        <nav className="sv-navbar">
          <div className="sv-navbar-brand">
            <div style={{ color:'var(--gold)' }}><LockIcon /></div>
            Shamir Vault
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>
              <span style={{ color:'var(--text-secondary)', marginRight:6 }}>Signed in as</span>
              <span style={{ color:'var(--gold)', fontWeight:600 }}>{username}</span>
            </div>
            <button className="sv-btn sv-btn-ghost" onClick={onLogout} style={{ padding:'8px 14px', fontSize:13 }}>
              <LogOutIcon />
              Sign out
            </button>
          </div>
        </nav>

        <main className="vault-main">
          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:-10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4 }}
            style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}
          >
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>
                Vault
              </h1>
              <p style={{ color:'var(--text-muted)', fontSize:13 }}>
                Your encrypted credentials
              </p>
            </div>
            <button
              className="sv-btn sv-btn-primary"
              onClick={() => navigate('/registration-vault')}
              style={{ fontSize:13 }}
            >
              <PlusIcon />
              Add Password
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.4 }}
            className="sv-grid-3"
            style={{ marginBottom:28 }}
          >
            <div className="sv-stat">
              <div className="sv-stat-value">{vaultData.length}</div>
              <div className="sv-stat-label">Total Secrets</div>
            </div>
            <div className="sv-stat">
              <div className="sv-stat-value" style={{ color:'var(--success)', fontSize:18, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--success)', display:'inline-block' }}/>
                Secure
              </div>
              <div className="sv-stat-label">Vault Status</div>
            </div>
            <div className="sv-stat">
              <div className="sv-stat-value">3-of-3</div>
              <div className="sv-stat-label">Share Threshold</div>
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                className="sv-alert sv-alert-error"
                style={{ marginBottom:20 }}
              >
                <span>⚠</span><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.4 }}
            className="sv-card"
          >
            {loading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:48, color:'var(--text-muted)', fontSize:14 }}>
                <span className="sv-spinner" />
                Loading vault...
              </div>
            ) : vaultData.length === 0 ? (
              <div className="sv-empty">
                <div className="sv-empty-icon" style={{ display:'flex', justifyContent:'center', color:'var(--gold)' }}>
                  <ShieldIcon />
                </div>
                <div className="sv-empty-text">
                  Your vault is empty.<br />
                  <span style={{ color:'var(--gold)', cursor:'pointer' }} onClick={() => navigate('/registration-vault')}>Add your first credential →</span>
                </div>
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
    </div>
  );
}
