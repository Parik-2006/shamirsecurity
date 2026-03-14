import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceLogo, VaultCyberBg } from './VaultShared';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

/* ── Icons ──────────────────────────────────────────────────────── */
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── Password cell ──────────────────────────────────────────────── */
function PasswordCell({ password }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: visible ? 'var(--text-primary)' : 'var(--text-muted)',
        letterSpacing: visible ? '0.02em' : '0.18em',
        background: 'var(--bg-elevated)', padding: '4px 10px',
        borderRadius: 6, border: '1px solid var(--border-subtle)',
        minWidth: 90, display: 'inline-block', transition: 'color 0.2s',
      }}>
        {visible ? password : '••••••••••'}
      </code>
      <button onClick={() => setVisible(v => !v)}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 6, padding: '5px 7px', cursor: 'pointer',
          color: visible ? 'var(--gold)' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', transition: 'all 0.15s',
        }}>
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

/* ── Inline logo preview inside the service input ──────────────── */
function ServiceInputPreview({ value }) {
  if (!value) return null;
  return (
    <div style={{
      position: 'absolute', right: 10, top: '50%',
      transform: 'translateY(-50%)', pointerEvents: 'none',
    }}>
      <ServiceLogo name={value} />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function RegistrationVaultPage() {
  const navigate = useNavigate();

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  const username  = localStorage.getItem('vaultUser') || 'User';
  const goldenKey = localStorage.getItem('goldenKey') || '';

  const [vaultData,      setVaultData]      = useState([]);
  const [error,          setError]          = useState('');
  const [loading,        setLoading]        = useState(true);
  const [newService,     setNewService]     = useState('');
  const [newServiceUser, setNewServiceUser] = useState('');
  const [newPass,        setNewPass]        = useState('');
  const [addSuccess,     setAddSuccess]     = useState(false);
  const [search,         setSearch]         = useState('');

  const fetchVault = () => {
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
        body: JSON.stringify({
          username, golden_key: goldenKey,
          service_name: newService,
          service_username: newServiceUser,
          password_to_save: newPass,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewService(''); setNewServiceUser(''); setNewPass('');
        setAddSuccess(true); setTimeout(() => setAddSuccess(false), 1800);
        fetchVault();
      } else { setError('Save Error: ' + (data.message || 'Unknown error')); }
    } catch { setError('Save failed.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const filtered = vaultData.filter(item =>
    !search ||
    item.service?.toLowerCase().includes(search.toLowerCase()) ||
    item.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}
        @keyframes successPop{0%{transform:scale(0.8)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
        .reg-row:hover td { background: rgba(255,215,80,0.025) !important; }
        .reg-row td { transition: background 0.15s; }
        @media(max-width:860px){
          .reg-form-grid{grid-template-columns:1fr !important}
          .vault-main-reg{padding:16px !important}
        }
      `}</style>

      <VaultCyberBg />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ── Navbar ── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 58,
          background: 'rgba(10,12,16,0.92)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          borderBottom: '1px solid rgba(255,215,80,0.1)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px', zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,215,80,0.1)',
              border: '1px solid rgba(255,215,80,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)',
            }}>
              <LockIcon />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.05em',
            }}>
              Shamir Vault
            </span>

            {/* Registration badge */}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(255,215,80,0.5)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginLeft: 4,
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(255,215,80,0.07)',
              border: '1px solid rgba(255,215,80,0.18)',
            }}>
              Registration
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              fontSize: '0.8rem', color: 'var(--text-muted)',
              padding: '5px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{username}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 8,
                background: 'transparent',
                border: '1px solid rgba(255,215,80,0.2)',
                color: 'rgba(255,215,80,0.7)',
                fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,80,0.08)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,215,80,0.7)'; }}
            >
              <LogOutIcon /> Logout
            </button>
          </div>
        </nav>

        {/* ── Main ── */}
        <main
          className="vault-main-reg"
          style={{ paddingTop: 82, paddingBottom: 48, maxWidth: 1100, margin: '0 auto', padding: '82px 32px 48px' }}
        >

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 28 }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'var(--text-muted)', letterSpacing: '0.15em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>
              // vault · add credentials
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem',
              fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.1,
            }}>
              Add <span style={{ color: 'var(--gold)' }}>Credentials</span>
            </h1>
          </motion.div>

          {/* ── Add credential form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            style={{
              background: 'rgba(19,22,27,0.85)',
              border: '1px solid rgba(255,215,80,0.13)',
              borderRadius: 18,
              padding: '28px 28px',
              backdropFilter: 'blur(18px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
              marginBottom: 24,
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(255,215,80,0.5), transparent)',
            }} />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,215,80,0.1)',
                border: '1px solid rgba(255,215,80,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)',
              }}>
                <PlusIcon />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.92rem',
                  fontWeight: 700, color: 'var(--text-primary)',
                }}>
                  New Credential
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1 }}>
                  Encrypted and stored with Shamir secret sharing
                </div>
              </div>
            </div>

            <form onSubmit={handleAddPassword}>
              <div
                className="reg-form-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 14, alignItems: 'flex-end' }}
              >
                {/* Service field with live logo */}
                <div>
                  <label style={{
                    display: 'block', fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', marginBottom: 7,
                  }}>
                    Service
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="sv-input"
                      placeholder="e.g. github, netflix…"
                      value={newService}
                      onChange={e => setNewService(e.target.value)}
                      style={{ paddingRight: newService ? 50 : undefined }}
                      required
                    />
                    <ServiceInputPreview value={newService} />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label style={{
                    display: 'block', fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', marginBottom: 7,
                  }}>
                    Username <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="sv-input"
                    placeholder="user@email.com"
                    value={newServiceUser}
                    onChange={e => setNewServiceUser(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{
                    display: 'block', fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', marginBottom: 7,
                  }}>
                    Password
                  </label>
                  <input
                    className="sv-input"
                    type="password"
                    placeholder="••••••••••"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    alignSelf: 'flex-end',
                    height: 46, minWidth: 46,
                    padding: '0 20px',
                    borderRadius: 10,
                    border: addSuccess ? '1px solid rgba(62,207,142,0.4)' : 'none',
                    background: addSuccess
                      ? 'rgba(62,207,142,0.1)'
                      : 'var(--gold)',
                    color: addSuccess ? '#3ecf8e' : '#0d0f12',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    opacity: loading ? 0.65 : 1,
                    transition: 'all 0.2s',
                    boxShadow: addSuccess ? 'none' : '0 2px 16px rgba(255,215,80,0.25)',
                    animation: addSuccess ? 'successPop 0.4s ease' : 'none',
                  }}
                >
                  {loading
                    ? <span className="sv-spinner" style={{ borderTopColor: addSuccess ? '#3ecf8e' : '#0d0f12', width: 16, height: 16 }} />
                    : addSuccess
                      ? <><CheckIcon /> Saved!</>
                      : <><PlusIcon /> Save</>
                  }
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="sv-alert sv-alert-error"
                    style={{ marginTop: 14 }}
                  >
                    <span>⚠</span><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* ── Vault table card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            style={{
              background: 'rgba(19,22,27,0.82)',
              border: '1px solid rgba(255,215,80,0.1)',
              borderRadius: 18,
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
            }}
          >
            {/* Table toolbar */}
            <div style={{
              padding: '14px 24px',
              borderBottom: '1px solid rgba(255,215,80,0.07)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 16,
              background: 'rgba(255,215,80,0.015)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 6px rgba(255,215,80,0.5)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Saved Credentials
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255,215,80,0.08)',
                  border: '1px solid rgba(255,215,80,0.15)',
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  {vaultData.length}
                </span>
              </div>

              {/* Search bar */}
              {vaultData.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 10, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}>
                    <SearchIcon />
                  </div>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search services…"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: 8, padding: '6px 12px 6px 30px',
                      fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                      color: 'var(--text-primary)', outline: 'none',
                      width: 200, transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,215,80,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-dim)'}
                  />
                </div>
              )}
            </div>

            {loading ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 14, padding: '56px 20px',
              }}>
                <span className="sv-spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  Loading vault…
                </span>
              </div>

            ) : vaultData.length === 0 ? (
              <div style={{ padding: '56px 20px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 8 }}>
                  No credentials saved yet
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.7 }}>
                  Use the form above to add your first credential
                </p>
              </div>

            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,215,80,0.06)' }}>
                      {['Service', 'Username', 'Password'].map(h => (
                        <th key={h} style={{
                          padding: '11px 24px', textAlign: 'left',
                          fontFamily: 'var(--font-mono)', fontSize: '0.63rem',
                          fontWeight: 600, letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: 'var(--text-muted)',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, idx) => (
                      <motion.tr
                        key={item.id || idx}
                        className="reg-row"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.28 }}
                        style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none' }}
                      >
                        <td style={{ padding: '13px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ServiceLogo name={item.service || '?'} />
                            <div>
                              <div style={{
                                fontWeight: 600, fontSize: '0.86rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-display)',
                              }}>
                                {item.service}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>
                                Encrypted
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '13px 24px' }}>
                          {item.username ? (
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                              color: 'var(--text-secondary)',
                              background: 'rgba(255,255,255,0.03)',
                              padding: '3px 8px', borderRadius: 5,
                              border: '1px solid var(--border-subtle)',
                            }}>
                              {item.username}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                          )}
                        </td>

                        <td style={{ padding: '13px 24px' }}>
                          <PasswordCell password={item.password || ''} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* No search results */}
                {filtered.length === 0 && search && (
                  <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No results for "<span style={{ color: 'var(--gold)' }}>{search}</span>"
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
