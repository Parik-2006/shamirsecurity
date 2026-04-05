import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

// ─── Icons ─────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ShieldKeyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.7 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.6 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.6 7.1 29 5 24 5 16.3 5 9.6 9.1 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 45c5 0 9.5-1.9 12.9-5l-6-5.2C29.3 36.3 26.8 37 24 37c-5.2 0-9.6-3.2-11.3-7.8l-6.5 5C9.6 41 16.3 45 24 45z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l.1-.1 6 5.2C37 39.5 44 34 44 25c0-1.3-.1-2.7-.4-4z"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.5 9a9 9 0 0 1 14.8-3.3L23 10M1 14l4.7 4.3A9 9 0 0 0 20.5 15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepBar({ step, mode }) {
  const steps = mode === 'recovery'
    ? ['Google OAuth', 'TOTP Check', 'Done']
    : ['Upload Share', 'TOTP Check', 'Vault Open'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const active   = step === i;
        const done     = step > i;
        const color    = done ? 'var(--success)' : active ? 'var(--gold)' : 'var(--text-muted)';
        const bgColor  = done ? 'rgba(62,207,142,0.12)' : active ? 'rgba(255,215,80,0.12)' : 'transparent';
        return (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '4px 8px', borderRadius: 8, background: bgColor,
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, fontSize: 12, fontWeight: 700, transition: 'all 0.3s ease',
              }}>
                {done ? <CheckIcon /> : i + 1}
              </div>
              <span style={{ fontSize: 10, color, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                height: 1, width: 32, flexShrink: 0,
                background: step > i ? 'var(--success)' : 'var(--border-subtle)',
                transition: 'all 0.4s ease',
                marginBottom: 20,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}


// ─── Main Component ──────────────────────────────────────────────────────────
export default function UnlockWithShare({ 
  username, password, onUnlock, onBack, onGoToSetupMFA,
  initialStep = 0, initialLocalShare = null, initialFileName = '', initialSessionToken = '', 
  onProgressUpdate 
}) {
  // Mode: 'normal' or 'recovery'
  const [mode,      setMode]      = useState('normal');
  // Unlock steps: 0=upload, 1=totp, 2=success
  // Recovery steps: 0=oauth_pending, 1=totp, 2=rotate
  const [step,      setStep]      = useState(initialStep);

  // Normal unlock state
  const [localShare,    setLocalShare]    = useState(initialLocalShare);
  const [fileName,      setFileName]      = useState(initialFileName);
  const [dragOver,      setDragOver]      = useState(false);
  const [sessionToken,  setSessionToken]  = useState(initialSessionToken);

  // Recovery state
  const [recoveryId,    setRecoveryId]    = useState('');
  const [recoveryUser,  setRecoveryUser]  = useState(username || '');
  const [newPassword,   setNewPassword]   = useState('');
  const [newLocalShare, setNewLocalShare] = useState('');
  const [newShare1,     setNewShare1]     = useState('');
  const [goldenKey,     setGoldenKey]     = useState('');

  // TOTP state
  const [totpCode, setTotpCode] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [info,    setInfo]    = useState('');

  const fileInputRef = useRef(null);

  // Sync state upward to App.jsx for persistence
  useEffect(() => {
    if (mode === 'normal') {
      onProgressUpdate?.(step, localShare, fileName, sessionToken);
    }
  }, [step, localShare, fileName, sessionToken, mode, onProgressUpdate]);

  // Check for recovery OAuth redirect params in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recoveryTotp  = params.get('recovery_totp');
    const rcId          = params.get('recovery_id');
    const rcUser        = params.get('username');
    const recoveryError = params.get('recovery_error');

    if (recoveryError) {
      setMode('recovery');
      setStep(0);
      setError(decodeURIComponent(recoveryError.replace(/\+/g, ' ')));
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    if (recoveryTotp === '1' && rcId) {
      setMode('recovery');
      setRecoveryId(rcId);
      if (rcUser) setRecoveryUser(decodeURIComponent(rcUser));
      setStep(1); // Go to TOTP step
      setInfo('Google identity verified ✓ — Now enter your TOTP code.');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ── File handling ──────────────────────────────────────────────────────────
  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => { setLocalShare(evt.target.result.trim()); setFileName(file.name); };
    reader.readAsText(file);
  };
  const handleFileChange = (e) => readFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  // ── NORMAL UNLOCK: Step 0 → Upload share + validate ───────────────────────
  const handleVerifyShare = async () => {
    setError(''); setLoading(true);
    try {
      if (!localShare) { setError('Please upload your local_share.enc file.'); return; }
      const res  = await fetch(`${API_URL}/api/unlock/verify-share`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSessionToken(data.session_token);
        setStep(1);
        setInfo('Share verified ✓ — Enter your Google Authenticator code.');
      } else {
        setError(data.message || 'Share verification failed.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── NORMAL UNLOCK: Step 1 → Verify TOTP + get golden_key ─────────────────
  const handleUnlockComplete = async () => {
    if (totpCode.length !== 6) { setError('Please enter all 6 digits.'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/unlock/complete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken, totp_code: totpCode }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStep(2);
        setTimeout(() => onUnlock(data.golden_key, data.username || username), 500);
      } else {
        setError(data.message || 'TOTP verification failed.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── RECOVERY: Step 0 → Initiate Google OAuth ─────────────────────────────
  const handleRecoveryInit = async () => {
    const userToRecover = recoveryUser.trim() || username.trim();
    if (!userToRecover) { setError('Please enter your username.'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/recovery/init`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userToRecover }),
      });
      const data = await res.json();
      if (data.status === 'redirect' && data.auth_url) {
        localStorage.setItem('recovery_id',   data.recovery_id);
        localStorage.setItem('recovery_user', userToRecover);
        window.location.href = data.auth_url;
      } else {
        setError(data.message || 'Could not start recovery.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── RECOVERY: Step 1 → Verify TOTP + reconstruct + rotate ────────────────
  const handleRecoveryComplete = async () => {
    if (totpCode.length !== 6) { setError('Please enter all 6 TOTP digits.'); return; }
    if (!newPassword) { setError('Please enter a new password for your rotated share.'); return; }
    setError(''); setLoading(true);
    try {
      const rId  = recoveryId || localStorage.getItem('recovery_id') || '';
      const rUser = recoveryUser || localStorage.getItem('recovery_user') || username;
      const res  = await fetch(`${API_URL}/api/recovery/complete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recovery_id: rId, totp_code: totpCode, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGoldenKey(data.golden_key);
        setNewLocalShare(data.new_local_share);
        setNewShare1(data.new_share1 || '');
        setStep(2); // Rotate / download step
        localStorage.removeItem('recovery_id');
        localStorage.removeItem('recovery_user');
      } else {
        setError(data.message || 'Recovery failed.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // ── RECOVERY: Step 2 → Download new share and enter vault ────────────────
  const handleDownloadNewShare = () => {
    if (!newLocalShare) return;
    const blob = new Blob([newLocalShare], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${recoveryUser || username}_local_share.enc`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleEnterVault = () => {
    if (!goldenKey) return;
    onUnlock(goldenKey, recoveryUser || username);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const enterRecoveryMode = () => {
    setMode('recovery');
    setStep(0);
    setError('');
    setInfo('');
    setTotpCode('');
    // Pre-populate recoveryUser from the username prop if available
    setRecoveryUser(username || '');
  };

  const exitRecoveryMode = () => {
    setMode('normal');
    setStep(0);
    setError('');
    setInfo('');
    setTotpCode('');
    setLocalShare(null);
    setFileName('');
    setSessionToken('');
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="sv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', position: 'relative' }}>
      {/* Subtle background */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-base)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        style={{ width: '100%', maxWidth: 540, padding: '0 24px', position: 'relative', zIndex: 1 }}
      >
        {/* Back button */}
        {!(mode === 'recovery' && step === 2) && (
          <button
            className="sv-btn sv-btn-ghost"
            onClick={() => {
              if (mode === 'recovery' && step > 0) exitRecoveryMode();
              else if (step > 0) setStep(step - 1);
              else onBack();
            }}
            style={{ marginBottom: 28, padding: '8px 14px', fontSize: 13 }}
          >
            <ArrowLeftIcon />
            {mode === 'recovery' && step > 0 ? 'Cancel Recovery' : 'Back'}
          </button>
        )}

        <div className="sv-card" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: mode === 'recovery'
              ? 'linear-gradient(90deg, transparent, rgba(90,210,190,0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,215,80,0.5), transparent)',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ color: mode === 'recovery' ? '#5ad2be' : 'var(--gold)', display: 'flex', alignItems: 'center' }}>
              {mode === 'recovery' ? <RotateIcon /> : <ShieldKeyIcon />}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
              {mode === 'recovery' ? 'Recover Vault' : 'Unlock Vault'}
            </h2>
          </div>

          {/* Mode badge */}
          {mode === 'recovery' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 20,
              background: 'rgba(90,210,190,0.1)', border: '1px solid rgba(90,210,190,0.25)',
              color: '#5ad2be', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              marginBottom: 16,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5ad2be' }} />
              RECOVERY MODE
            </div>
          )}

          {/* Step Bar */}
          <StepBar step={step} mode={mode} />

          {/* User info */}
          {(username || recoveryUser) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24,
              padding: '8px 12px', background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User</span>
              <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                {mode === 'recovery' ? (recoveryUser || username) : username}
              </span>
            </div>
          )}

          {/* Info banner */}
          <AnimatePresence>
            {info && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginBottom: 18, padding: '10px 14px',
                  background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.2)',
                  borderRadius: 8, color: 'var(--success)', fontSize: 13,
                }}
              >
                {info}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ═══════════ NORMAL UNLOCK — Step 0: Upload Share ═══════════ */}
            {mode === 'normal' && step === 0 && (
              <motion.div key="upload" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <label className="sv-label" style={{ marginBottom: 10 }}>Upload local_share.enc</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--gold)' : localShare ? 'var(--success)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', padding: '36px 24px',
                    textAlign: 'center', cursor: 'pointer',
                    background: dragOver ? 'rgba(255,215,80,0.05)' : localShare ? 'rgba(62,207,142,0.05)' : 'var(--bg-elevated)',
                    transition: 'all 0.2s', marginBottom: 20,
                  }}
                >
                  <input ref={fileInputRef} type="file" accept=".enc,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
                  <div style={{ color: localShare ? 'var(--success)' : 'var(--text-muted)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                    <UploadIcon />
                  </div>
                  {localShare ? (
                    <div>
                      <div style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>File loaded ✓</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fileName}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>
                        Drop your file here, or <span style={{ color: 'var(--gold)' }}>browse</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>.enc or .txt · local_share.enc</div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleVerifyShare}
                  disabled={loading || !localShare}
                  style={{ fontSize: 14, padding: '14px 24px', marginBottom: 16 }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: '#0d0f12' }} /> : null}
                  {loading ? 'Verifying Share…' : 'Verify Share'}
                </motion.button>

                {/* Recovery link */}
                <button
                  onClick={enterRecoveryMode}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: '#5ad2be', fontSize: 13, cursor: 'pointer',
                    textDecoration: 'underline', textDecorationColor: 'rgba(90,210,190,0.4)',
                    padding: '6px 0',
                  }}
                >
                  🔑 No local share? Recover via Google OAuth
                </button>
              </motion.div>
            )}

            {/* ═══════════ NORMAL UNLOCK — Step 1: TOTP ═══════════════════ */}
            {mode === 'normal' && step === 1 && (
              <motion.div key="totp-normal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ textAlign: 'center' }}>
                {/* Direct Instruction Phase (No Input) */}
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                    To verify your Identity, please open
                    <br />
                    <span 
                      onClick={() => onGoToSetupMFA(sessionToken)}
                      style={{ 
                        color: 'var(--gold)', 
                        fontWeight: 700, 
                        cursor: 'pointer', 
                        textDecoration: 'underline',
                        fontSize: 18,
                        display: 'inline-block',
                        marginTop: 10,
                        padding: '4px 12px',
                        background: 'rgba(255,215,80,0.08)',
                        borderRadius: 8
                      }}
                      title="Open MFA Verification"
                    >Google Authenticator</span>
                  </p>
                  
                  <div style={{ 
                    padding: '24px', 
                    background: 'rgba(255,215,80,0.03)', 
                    border: '1px solid rgba(255,215,80,0.12)', 
                    borderRadius: 16,
                    marginBottom: 20 
                  }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                      Once you click the <strong style={{color:'var(--gold)'}}>yellow link</strong> above, 
                      you will be taken to the verification step.
                      <br /><br />
                      Scan your QR or enter your 6-digit code on the <strong>next page</strong> to immediately unlock your vault.
                    </p>
                  </div>

                  {/* Skip Shortcut */}
                  <button
                    onClick={() => onGoToSetupMFA(sessionToken, true)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--gold)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      textDecoration: 'underline', textDecorationColor: 'rgba(255,215,80,0.3)',
                      opacity: 0.8, transition: 'opacity 0.2s', marginBottom: 24,
                    }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.8}
                  >
                    Already scanned? Skip to verification →
                  </button>

                  {/* Visual Indicator of "Next Step" */}
                  <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.4 }}>
                    <div className="sv-spinner" style={{ width: 24, height: 24, borderTopColor: 'var(--gold)' }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ NORMAL UNLOCK — Step 2: Success ════════════════ */}
            {mode === 'normal' && step === 2 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(62,207,142,0)', '0 0 32px rgba(62,207,142,0.3)', '0 0 0 rgba(62,207,142,0)'] }}
                  transition={{ duration: 1, repeat: 2 }}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(62,207,142,0.15)', border: '2px solid var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: 'var(--success)',
                  }}
                >
                  <CheckIcon />
                </motion.div>
                <h3 style={{ color: 'var(--success)', fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>Vault Unlocked!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Redirecting to your vault…</p>
              </motion.div>
            )}

            {/* ═══════════ RECOVERY — Step 0: OAuth ═══════════════════════ */}
            {mode === 'recovery' && step === 0 && (
              <motion.div key="recovery-oauth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                  Lost your local share? Verify your identity with Google OAuth, then TOTP, 
                  and we'll reconstruct your vault from <strong>Share1 (Drive) + Share2 (Supabase)</strong> 
                  and generate a fresh local share.
                </p>

                {/* Username for recovery (if not already set) */}
                {!username && (
                  <div style={{ marginBottom: 20 }}>
                    <label className="sv-label">Username</label>
                    <input
                      className="sv-input"
                      type="text"
                      placeholder="your_username"
                      value={recoveryUser}
                      onChange={e => setRecoveryUser(e.target.value)}
                    />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleRecoveryInit}
                  disabled={loading}
                  style={{ fontSize: 14, padding: '14px 24px', marginBottom: 16, gap: 10, justifyContent: 'center' }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: '#0d0f12' }} /> : <GoogleIcon />}
                  {loading ? 'Redirecting…' : 'Verify with Google Account'}
                </motion.button>

                <div style={{
                  padding: '12px 16px', borderRadius: 8,
                  background: 'rgba(255,215,80,0.05)', border: '1px solid rgba(255,215,80,0.15)',
                  fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6,
                }}>
                  ⚠ You must sign in with the <strong style={{ color: 'var(--gold)' }}>same Google account</strong> used to create the vault. 
                  Share1 will be fetched from your Drive to reconstruct the secret.
                </div>
              </motion.div>
            )}

            {/* ═══════════ RECOVERY — Step 1: TOTP + new password ═════════ */}
            {mode === 'recovery' && step === 1 && (
              <motion.div key="recovery-totp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ color: '#5ad2be', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <PhoneIcon />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>
                    Enter your <strong style={{ color: '#5ad2be' }}>Google Authenticator</strong> code for <strong>ShamirVault</strong>.
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>Refreshes every 30 seconds</p>
                </div>

                <TOTPInput
                  value={totpCode}
                  onChange={setTotpCode}
                  onSubmit={() => {}}
                  loading={loading}
                />

                {/* New password for re-encrypting share3 */}
                <div style={{ marginBottom: 20 }}>
                  <label className="sv-label">New Vault Password</label>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Your new local share will be encrypted with this password.
                  </p>
                  <input
                    className="sv-input"
                    type="password"
                    placeholder="Choose a strong password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleRecoveryComplete}
                  disabled={loading || totpCode.length < 6 || !newPassword}
                  style={{ fontSize: 14, padding: '14px 24px', background: 'linear-gradient(135deg, #5ad2be, #26a89a)', borderColor: '#5ad2be' }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: '#0d0f12' }} /> : null}
                  {loading ? 'Recovering Vault…' : 'Verify TOTP & Recover Vault'}
                </motion.button>
              </motion.div>
            )}

            {/* ═══════════ RECOVERY — Step 2: Rotate + Download ═══════════ */}
            {mode === 'recovery' && step === 2 && (
              <motion.div key="recovery-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: 2 }}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(90,210,190,0.15)', border: '2px solid #5ad2be',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: '#5ad2be',
                  }}
                >
                  <RotateIcon />
                </motion.div>
                <h3 style={{ color: '#5ad2be', fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>Shares Rotated!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
                  All 3 shares have been regenerated. Your vault is secure again.
                  <br />
                  <strong style={{ color: 'var(--gold)' }}>Download your new local share</strong> before entering the vault.
                </p>

                {/* Download new share */}
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadNewShare}
                  disabled={!newLocalShare}
                  style={{
                    width: '100%', padding: '13px 24px', borderRadius: 10,
                    background: 'rgba(90,210,190,0.12)', border: '1.5px solid rgba(90,210,190,0.4)',
                    color: '#5ad2be', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <DownloadIcon />
                  Download New local_share.enc
                </motion.button>

                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,215,80,0.07)', border: '1px solid rgba(255,215,80,0.18)',
                  fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6,
                }}>
                  ℹ Share1 (New): The backend has updated Share2. Log in to Drive to upload the new Share1, 
                  or contact support. For now, your vault is accessible.
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleEnterVault}
                  style={{ fontSize: 14, padding: '14px 24px' }}
                >
                  Enter Vault →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="sv-alert sv-alert-error"
                style={{ marginTop: 16 }}
              >
                <span>⚠</span><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security info footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16, alignItems: 'center' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px rgba(62,207,142,0.8)' }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            2-of-3 Shamir · TOTP Protected · E2E Encrypted
          </span>
        </div>
      </motion.div>
    </div>
  );
}
