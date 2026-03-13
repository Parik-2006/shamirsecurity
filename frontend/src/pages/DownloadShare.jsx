import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

console.log('[DownloadShare] Component loaded');

function DownloadIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ShieldIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function AlertTriangleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

export default function DownloadShare() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  console.log('[DownloadShare] location.pathname:', location.pathname, 'location.search:', location.search);

  // --- ORIGINAL LOGIC PRESERVED ---
  const localShareData = params.get('local_share');
  const goldenKey = params.get('golden_key');
  const username = params.get('username');

  let error = '';
  if (!localShareData || !goldenKey || !username) {
    error = 'Missing registration data. Please retry registration.';
    console.warn('[DownloadShare] Missing registration data:', { localShareData, goldenKey, username });
  }

  if (username && goldenKey) {
    localStorage.setItem('vaultUser', username);
    localStorage.setItem('goldenKey', goldenKey);
    localStorage.setItem('justRegistered', 'true');
    console.log('[DownloadShare] Setting vaultUser:', username, 'goldenKey:', goldenKey);
  }

  const handleDownload = () => {
    console.log('[DownloadShare] Download button clicked');
    if (!localShareData) return;
    setDownloading(true);
    const blob = new Blob([localShareData], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'local_share.enc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloading(false);
    console.log('[DownloadShare] Navigating to /registration-vault');
    navigate('/registration-vault', { replace: true });
  };

  return (
    <div className="sv-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 520 }}
      >
        <div className="sv-card" style={{ padding: '40px 36px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                width: 64, height: 64,
                borderRadius: '50%',
                background: 'var(--gold-muted)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--gold)',
              }}
            >
              <ShieldIcon size={28} />
            </motion.div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Save Your Recovery Share
            </h2>
            {username && (
              <span className="sv-badge sv-badge-gold" style={{ fontSize: '0.7rem' }}>
                {username}
              </span>
            )}
          </div>

          {/* Warning box */}
          <div style={{
            background: 'rgba(255,215,80,0.06)',
            border: '1px solid rgba(255,215,80,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>
                <AlertTriangleIcon size={16} />
              </span>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>
                  Critical: Keep this file safe
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  <code style={{
                    background: 'var(--bg-elevated)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    color: 'var(--gold)',
                    fontSize: '0.78rem',
                  }}>local_share.enc</code>
                  {' '}is your personal cryptographic share — required every time you unlock your vault.
                  Without it, vault access is permanently lost. Store it in a secure location.
                </p>
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Required for vault unlock on any device',
              'Combined with Google Drive & Supabase shares',
              'Never stored on our servers',
            ].map((txt, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}>
                <div style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                  opacity: 0.6,
                }} />
                {txt}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="sv-alert sv-alert-error" style={{ marginBottom: 20 }}>{error}</div>
          )}

          {/* CTA */}
          {!error && !downloaded && localShareData && (
            <button
              className="sv-btn sv-btn-primary sv-btn-full"
              onClick={handleDownload}
              disabled={downloading}
              style={{ height: 52, fontSize: '0.95rem', gap: 10 }}
            >
              {downloading ? (
                <span className="sv-spinner" />
              ) : (
                <DownloadIcon size={18} />
              )}
              {downloading ? 'Preparing…' : 'Download local_share.enc'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
