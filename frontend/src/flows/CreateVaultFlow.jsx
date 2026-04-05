import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LockIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function CreateVaultFlow({
  username,
  setUsername,
  password,
  setPassword,
  loading,
  error,
  success,
  onCreateVault,
  onUnlockLogin
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.32, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        background: 'rgba(13,16,20,0.88)',
        border: '1px solid rgba(255,215,80,0.14)',
        borderRadius: 20,
        padding: '32px 28px 28px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,215,80,0.05) inset',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Card top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,215,80,0.4), transparent)',
      }} />

      <div style={{ marginBottom: 16 }}>
        <label className="sv-label">Username</label>
        <input
          className="sv-input" type="text" id="login-username"
          name="username" placeholder="your_username" autoComplete="username"
          value={username} onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && document.getElementById('login-password')?.focus()}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label className="sv-label">Master Password</label>
        <input
          className="sv-input" type="password" id="login-password"
          name="password" placeholder="••••••••••••" autoComplete="current-password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onCreateVault()}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}>
            <div className="sv-alert sv-alert-error">{error}</div>
          </motion.div>
        )}
        {success && (
          <motion.div key="ok" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}>
            <div className="sv-alert sv-alert-success">{success}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 4px 24px rgba(255,215,80,0.3)' }}
        whileTap={{ scale: 0.98 }}
        className="sv-btn sv-btn-primary sv-btn-full"
        onClick={onCreateVault} disabled={loading}
        style={{ height: 48, marginBottom: 10 }}
      >
        {loading && <span className="sv-spinner" />}
        Create New Vault
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="sv-btn sv-btn-secondary sv-btn-full"
        onClick={onUnlockLogin} disabled={loading}
        style={{ height: 48 }}
      >
        {loading && <span className="sv-spinner" style={{ borderTopColor: 'var(--text-secondary)' }} />}
        Unlock Vault
      </motion.button>

      <p style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: '0.68rem', textAlign: 'center', lineHeight: 1.65 }}>
        Vault creation requires Google OAuth for multi-share key distribution.
      </p>
    </motion.div>
  );
}
