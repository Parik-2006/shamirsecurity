import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceLogo, VaultPageCyberBg } from './VaultShared';

const API_URL = "https://shamirsecurity-098.onrender.com";

/* ── Icons ──────────────────────────────────────────────────────── */
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2L13 10M18 5l-1.5 1.5M15.5 7.5L17 6"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

/* ── Password cell ──────────────────────────────────────────────── */
function PasswordCell({ password }) {
  const [visible, setVisible] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: visible ? 'var(--text-primary)' : 'var(--text-muted)',
        letterSpacing: visible ? '0.02em' : '0.18em',
        background: 'var(--bg-elevated)',
        padding: '4px 10px', borderRadius: 6,
        border: '1px solid var(--border-subtle)',
        minWidth: 90, display: 'inline-block',
        transition: 'color 0.2s',
      }}>
        {visible ? password : '••••••••••'}
      </code>

      <button onClick={() => setVisible(v => !v)}
        title={visible ? 'Hide' : 'Show'}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 6, padding: '5px 7px', cursor: 'pointer',
          color: visible ? 'var(--gold)' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.15s',
        }}>
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>

      <button onClick={copy} title="Copy"
        style={{
          background: copied ? 'rgba(62,207,142,0.1)' : 'var(--bg-elevated)',
          border: `1px solid ${copied ? 'rgba(62,207,142,0.3)' : 'var(--border-subtle)'}`,
          borderRadius: 6, padding: '5px 7px', cursor: 'pointer',
          color: copied ? '#3ecf8e' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.15s',
        }}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ icon, value, label, color = 'var(--gold)', delay = 0, pulse = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: 'rgba(19,22,27,0.82)',
        border: `1px solid ${color}22`,
        borderRadius: 16,
        padding: '20px 24px',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}08 inset`,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}55, transparent)`,
      }} />

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${color}12`, border: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
        boxShadow: pulse ? `0 0 14px ${color}30` : 'none',
      }}>
        {icon}
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '1.6rem',
          fontWeight: 800, color, lineHeight: 1,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {value}
          {pulse && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: color, display: 'inline-block',
              boxShadow: `0 0 8px ${color}`,
              animation: 'pulseDot 2s ease-in-out infinite',
            }} />
          )}
        </div>
        <div style={{
          fontSize: '0.68rem', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4,
        }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main VaultPage ─────────────────────────────────────────────── */
export default function VaultPage({ username, goldenKey, onLogout }) {
  const navigate = useNavigate();

  if (!username || !goldenKey) {
    return (
      <div className="sv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="sv-alert sv-alert-error" style={{ maxWidth: 400 }}>
          <span>⚠</span><span>Missing credentials. Please log in again.</span>
        </div>
      </div>
    );
  }

  // ── ALL ORIGINAL LOGIC PRESERVED EXACTLY ──
  const [vaultData, setVaultData] = useState([]);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(true);

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
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        @keyframes rowIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        .vault-row:hover td { background: rgba(255,215,80,0.03) !important; }
        .vault-row td { transition: background 0.15s; }
        @media(max-width:768px){ .vault-stats{grid-template-columns:1fr !important} .vault-main-pad{padding:16px !important} }
      `}</style>

      <VaultPageCyberBg />

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
          {/* Brand */}
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
            <span style={{
              fontSize: '0.62rem', color: 'rgba(255,215,80,0.4)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginLeft: 4, paddingTop: 2,
            }}>
              / Vault
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Live status indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(62,207,142,0.08)',
              border: '1px solid rgba(62,207,142,0.2)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#3ecf8e',
                boxShadow: '0 0 6px rgba(62,207,142,0.7)',
                animation: 'pulseDot 2s ease-in-out infinite',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: '0.68rem', color: '#3ecf8e', fontWeight: 600, letterSpacing: '0.08em' }}>
                SECURED
              </span>
            </div>

            <div style={{
              fontSize: '0.8rem', color: 'var(--text-muted)',
              padding: '5px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Signed in as </span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{username}</span>
            </div>

            <button
              onClick={onLogout}
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
              <LogOutIcon /> Sign out
            </button>
          </div>
        </nav>

        {/* ── Main content ── */}
        <main style={{ paddingTop: 82, paddingBottom: 48, maxWidth: 1100, margin: '0 auto', padding: '82px 32px 48px' }} className="vault-main-pad">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 28, flexWrap: 'wrap', gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                  color: 'var(--text-muted)', letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}>
                  // encrypted credential store
                </span>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                fontWeight: 800, color: 'var(--text-primary)', margin: 0,
                lineHeight: 1.1,
              }}>
                My <span style={{ color: 'var(--gold)' }}>Vault</span>
              </h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="sv-btn sv-btn-primary"
              onClick={() => navigate('/registration-vault')}
              style={{ fontSize: '0.85rem', gap: 8, padding: '10px 20px' }}
            >
              <PlusIcon />
              Add Credential
            </motion.button>
          </motion.div>

          {/* ── Stats row ── */}
          <div className="vault-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16, marginBottom: 28,
          }}>
            <StatCard
              icon={<DatabaseIcon />}
              value={loading ? '—' : vaultData.length}
              label="Stored Secrets"
              color="var(--gold)"
              delay={0.05}
            />
            <StatCard
              icon={<ShieldCheckIcon />}
              value="Active"
              label="Vault Status"
              color="#3ecf8e"
              delay={0.1}
              pulse
            />
            <StatCard
              icon={<LayersIcon />}
              value="2-of-3"
              label="Shamir Threshold"
              color="#5b8dee"
              delay={0.15}
            />
          </div>

          {/* ── Error ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sv-alert sv-alert-error"
                style={{ marginBottom: 20 }}
              >
                <span>⚠</span><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Credentials table ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              background: 'rgba(19,22,27,0.82)',
              border: '1px solid rgba(255,215,80,0.1)',
              borderRadius: 18,
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
            }}
          >
            {/* Table header bar */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,215,80,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,215,80,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 6px rgba(255,215,80,0.5)' }} />
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.88rem',
                  fontWeight: 700, color: 'var(--text-primary)',
                }}>
                  Credential Store
                </span>
              </div>
              {!loading && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: 'var(--text-muted)', letterSpacing: '0.08em',
                }}>
                  {vaultData.length} {vaultData.length === 1 ? 'entry' : 'entries'} · AES-256-GCM
                </span>
              )}
            </div>

            {loading ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 14, padding: '60px 20px',
              }}>
                <span className="sv-spinner" style={{ width: 26, height: 26, borderWidth: 3 }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  color: 'var(--text-muted)', letterSpacing: '0.1em',
                }}>
                  Decrypting vault…
                </span>
              </div>

            ) : vaultData.length === 0 ? (
              <div style={{
                padding: '64px 20px', textAlign: 'center',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(255,215,80,0.06)',
                  border: '1px solid rgba(255,215,80,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: 'var(--gold)',
                }}>
                  <KeyIcon />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
                  Your vault is empty
                </p>
                <button
                  onClick={() => navigate('/registration-vault')}
                  style={{
                    background: 'rgba(255,215,80,0.08)',
                    border: '1px solid rgba(255,215,80,0.25)',
                    borderRadius: 8, padding: '8px 18px',
                    color: 'var(--gold)', fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                >
                  Add your first credential →
                </button>
              </div>

            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,215,80,0.06)' }}>
                    {['Service', 'Username', 'Password'].map(h => (
                      <th key={h} style={{
                        padding: '12px 24px', textAlign: 'left',
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                        fontWeight: 600, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--text-muted)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vaultData.map((item, idx) => (
                    <motion.tr
                      key={item.id || idx}
                      className="vault-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      style={{ borderBottom: idx < vaultData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      {/* Service */}
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <ServiceLogo name={item.service || '?'} />
                          <div>
                            <div style={{
                              fontWeight: 600, fontSize: '0.88rem',
                              color: 'var(--text-primary)', fontFamily: 'var(--font-display)',
                            }}>
                              {item.service}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              Encrypted
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td style={{ padding: '14px 24px' }}>
                        {item.username ? (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '3px 8px', borderRadius: 5,
                            border: '1px solid var(--border-subtle)',
                          }}>
                            {item.username}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Password */}
                      <td style={{ padding: '14px 24px' }}>
                        <PasswordCell password={item.password || ''} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* Footer encryption info */}
          {!loading && vaultData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 20, marginTop: 20,
              }}
            >
              {['AES-256-GCM Encrypted', 'Shamir Secret Sharing', 'Zero-Knowledge'].map((tag, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.65rem', color: 'var(--text-muted)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--gold)', opacity: 0.4,
                  }} />
                  {tag}
                </div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
