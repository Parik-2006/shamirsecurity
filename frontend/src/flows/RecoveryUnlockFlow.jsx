import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOTPInput } from '../pages/TOTPSetup';

const API_URL = "https://shamirsecurity-098.onrender.com";

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
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

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

function StepBar({ step }) {
  const labels = ['Authenticate', 'TOTP Code', 'Download Share', 'Upload & Unlock'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, gap: 0 }}>
      {labels.map((label, i) => {
        const done   = step > i;
        const active = step === i;
        const color  = done ? '#3ecf8e' : active ? '#5ad2be' : 'rgba(255,255,255,0.2)';
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${color}`,
                background: done ? 'rgba(62,207,142,0.15)' : active ? 'rgba(90,210,190,0.12)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 9, color, letterSpacing: '0.04em',
                whiteSpace: 'nowrap', textAlign: 'center', maxWidth: 60, lineHeight: 1.3,
              }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div style={{
                width: 24, height: 1.5, flexShrink: 0, marginBottom: 18,
                background: step > i ? '#3ecf8e' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.4s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function RecoveryUnlockFlow({ username: propUsername, onUnlock, onBack }) {
  const [step,         setStep]         = useState(0);
  const [inputUser,    setInputUser]    = useState(propUsername || '');
  const [recoveryId,   setRecoveryId]   = useState('');
  const [recoveryUser, setRecoveryUser] = useState('');
  const [totpCode,     setTotpCode]     = useState('');
  const [tempShare,    setTempShare]    = useState('');
  const [internalPw,   setInternalPw]   = useState('');
  const [downloaded,   setDownloaded]   = useState(false);
  const [uploaded,     setUploaded]     = useState('');
  const [uploadedName, setUploadedName] = useState('');
  const [dragOver,     setDragOver]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const fileRef = useRef(null);

  // Detect OAuth redirect back with recovery params
  useEffect(() => {
    const p      = new URLSearchParams(window.location.search);
    const rTotp  = p.get('recovery_totp');
    const rId    = p.get('recovery_id');
    const rUser  = p.get('username');
    const rError = p.get('recovery_error');

    if (rError) {
      setError(decodeURIComponent(rError.replace(/\+/g, ' ')));
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (rTotp === '1' && rId) {
      const storedUser = rUser
        ? decodeURIComponent(rUser.replace(/\+/g, ' '))
        : localStorage.getItem('recovery_user') || '';
      const storedPw = localStorage.getItem('recovery_internal_pw') || '';
      setRecoveryId(rId);
      setRecoveryUser(storedUser);
      setInternalPw(storedPw);
      setStep(1);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // STEP 0: Kick off Google OAuth
  const handleInit = async () => {
    const user = inputUser.trim();
    if (!user) { setError('Please enter your username.'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/recovery/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user }),
      });
      const data = await res.json();
      if (data.status === 'redirect' && data.auth_url) {
        // Generate a random internal password the user never sees
        const pw = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        localStorage.setItem('recovery_id',         data.recovery_id);
        localStorage.setItem('recovery_user',        user);
        localStorage.setItem('recovery_internal_pw', pw);
        window.location.href = data.auth_url;
      } else {
        setError(data.message || 'Could not start recovery. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: Verify TOTP → backend reconstructs vault, rotates shares, returns new_local_share
  const handleTOTP = async () => {
    const code = totpCode.replace(/\s/g, '');
    if (code.length !== 6) { setError('Enter all 6 digits.'); return; }
    setError(''); setLoading(true);
    const pw = internalPw || localStorage.getItem('recovery_internal_pw') || '';
    try {
      const res  = await fetch(`${API_URL}/api/recovery/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recovery_id:  recoveryId,
          totp_code:    code,
          new_password: pw,         // user never sees this
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTempShare(data.new_local_share);
        setInternalPw(pw);
        localStorage.removeItem('recovery_id');
        localStorage.removeItem('recovery_user');
        localStorage.removeItem('recovery_internal_pw');
        setStep(2);
      } else {
        setError(data.message || 'Invalid code. Please try again.');
        setTotpCode('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Download the temp share file
  const handleDownload = () => {
    const blob = new Blob([tempShare], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${recoveryUser || 'vault'}_local_share.enc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  // STEP 3: Upload and unlock
  const readFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => { setUploaded(e.target.result.trim()); setUploadedName(file.name); };
    r.readAsText(file);
  };

  const handleUnlock = async () => {
    if (!uploaded) { setError('Please upload the share file.'); return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username:    recoveryUser,
          password:    internalPw,
          local_share: uploaded,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        onUnlock(data.golden_key, recoveryUser);
      } else {
        setError(data.message || 'Verification failed. Make sure you uploaded the correct file.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        {/* Back — only on steps 0 and 1 */}
        {step <= 1 && (
          <button
            onClick={step === 0 ? onBack : () => { setStep(0); setTotpCode(''); setError(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 13,
              marginBottom: 24, padding: '6px 0',
            }}
          >
            <ArrowLeftIcon />
            {step === 0 ? 'Back to login' : 'Cancel recovery'}
          </button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(90,210,190,0.1)',
            border: '1px solid rgba(90,210,190,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#5ad2be', flexShrink: 0,
          }}>
            <ShieldIcon />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0,
            }}>
              Recover Your Vault
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              Lost your local share · Google OAuth + TOTP verification
            </p>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(19,22,27,0.92)',
          border: '1px solid rgba(90,210,190,0.15)',
          borderRadius: 20,
          padding: '32px 28px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(90,210,190,0.55), transparent)',
          }} />

          <StepBar step={step} />

          <AnimatePresence mode="wait">

            {/* ── STEP 0: Username + Google OAuth ─────────────────── */}
            {step === 0 && (
              <motion.div key="s0"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{
                  padding: '14px 16px', marginBottom: 22,
                  background: 'rgba(90,210,190,0.05)', border: '1px solid rgba(90,210,190,0.18)',
                  borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                }}>
                  Sign in with the <strong style={{ color: '#5ad2be' }}>same Google account</strong> used to create this vault.
                  Your Share 1 will be fetched from Google Drive automatically.
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="sv-label">Username</label>
                  <input
                    className="sv-input"
                    type="text"
                    placeholder="your_username"
                    value={inputUser}
                    onChange={e => setInputUser(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleInit()}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleInit}
                  disabled={loading || !inputUser.trim()}
                  style={{
                    width: '100%', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    background: 'rgba(90,210,190,0.1)', border: '1.5px solid rgba(90,210,190,0.4)',
                    borderRadius: 12, cursor: (loading || !inputUser.trim()) ? 'not-allowed' : 'pointer',
                    color: '#5ad2be', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                    opacity: (loading || !inputUser.trim()) ? 0.55 : 1, transition: 'all 0.2s',
                  }}
                >
                  {loading
                    ? <span className="sv-spinner" style={{ borderTopColor: '#5ad2be', width: 18, height: 18 }} />
                    : <GoogleIcon />
                  }
                  {loading ? 'Redirecting to Google…' : 'Continue with Google'}
                </button>
              </motion.div>
            )}

            {/* ── STEP 1: TOTP only (no password field) ───────────── */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Google verified badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26,
                  padding: '10px 14px',
                  background: 'rgba(62,207,142,0.07)', border: '1px solid rgba(62,207,142,0.2)',
                  borderRadius: 10,
                }}>
                  <span style={{ color: '#3ecf8e', fontSize: 18, lineHeight: 1 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#3ecf8e' }}>Google identity verified</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Recovering vault for&nbsp;
                      <strong style={{ color: 'var(--text-secondary)' }}>{recoveryUser}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 0 6px' }}>
                    Enter your <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Google Authenticator</span> code
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: 0 }}>
                    6-digit code · refreshes every 30 seconds
                  </p>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <TOTPInput
                    value={totpCode}
                    onChange={setTotpCode}
                    onSubmit={handleTOTP}
                    loading={loading}
                  />
                </div>

                <button
                  onClick={handleTOTP}
                  disabled={loading || totpCode.replace(/\s/g, '').length < 6}
                  style={{
                    width: '100%', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: totpCode.replace(/\s/g, '').length === 6
                      ? 'linear-gradient(135deg, #5ad2be, #26a89a)'
                      : 'rgba(90,210,190,0.08)',
                    border: 'none', borderRadius: 12,
                    cursor: (loading || totpCode.replace(/\s/g, '').length < 6) ? 'not-allowed' : 'pointer',
                    color: totpCode.replace(/\s/g, '').length === 6 ? '#0d0f12' : 'rgba(90,210,190,0.3)',
                    fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                    opacity: loading ? 0.7 : 1, transition: 'all 0.25s',
                    boxShadow: totpCode.replace(/\s/g, '').length === 6
                      ? '0 4px 20px rgba(90,210,190,0.25)' : 'none',
                  }}
                >
                  {loading && <span className="sv-spinner" style={{ borderTopColor: '#0d0f12', width: 18, height: 18 }} />}
                  {loading ? 'Verifying…' : 'Verify & Reconstruct Vault'}
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Download temp share ──────────────────────── */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(90,210,190,0.12)', border: '2px solid rgba(90,210,190,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px', color: '#5ad2be',
                  }}
                >
                  <DownloadIcon />
                </motion.div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#5ad2be', margin: '0 0 10px' }}>
                  Vault Reconstructed!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
                  Download your <strong style={{ color: 'var(--gold)' }}>temporary local_share.enc</strong> file.
                  <br />You'll upload it in the next step to unlock your vault.
                </p>

                <button
                  onClick={handleDownload}
                  style={{
                    width: '100%', padding: '18px 24px', marginBottom: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    background: downloaded ? 'rgba(62,207,142,0.1)' : 'rgba(90,210,190,0.1)',
                    border: `1.5px solid ${downloaded ? 'rgba(62,207,142,0.5)' : 'rgba(90,210,190,0.45)'}`,
                    borderRadius: 14, cursor: 'pointer',
                    color: downloaded ? '#3ecf8e' : '#5ad2be',
                    fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                >
                  {downloaded ? '✓' : <DownloadIcon />}
                  {downloaded
                    ? 'Downloaded ✓ — click to download again'
                    : `Download ${recoveryUser || 'vault'}_local_share.enc`
                  }
                </button>

                <AnimatePresence>
                  {downloaded && (
                    <motion.button
                      key="next"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      onClick={() => setStep(3)}
                      style={{
                        width: '100%', height: 52,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        background: 'var(--gold)', border: 'none', borderRadius: 12,
                        cursor: 'pointer', color: '#0d0f12',
                        fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                        boxShadow: '0 4px 20px rgba(255,215,80,0.3)',
                      }}
                    >
                      Next: Upload & Unlock →
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── STEP 3: Upload & Unlock ──────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>
                    Upload the <strong style={{ color: 'var(--gold)' }}>local_share.enc</strong> you just downloaded to unlock your vault.
                  </p>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); readFile(e.dataTransfer.files[0]); }}
                  style={{
                    border: `2px dashed ${dragOver ? '#5ad2be' : uploaded ? 'rgba(62,207,142,0.6)' : 'rgba(90,210,190,0.3)'}`,
                    borderRadius: 14, padding: '40px 24px', textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(90,210,190,0.06)' : uploaded ? 'rgba(62,207,142,0.04)' : 'rgba(255,255,255,0.015)',
                    transition: 'all 0.2s', marginBottom: 20,
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".enc,.txt"
                    onChange={e => readFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <div style={{ color: uploaded ? '#3ecf8e' : 'rgba(90,210,190,0.5)', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                    {uploaded ? <span style={{ fontSize: 36 }}>✓</span> : <UploadCloudIcon />}
                  </div>
                  {uploaded ? (
                    <div>
                      <div style={{ color: '#3ecf8e', fontSize: 14, fontWeight: 600 }}>File ready</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{uploadedName}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        Drop your file here or <span style={{ color: '#5ad2be' }}>browse</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                        The local_share.enc you just downloaded
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUnlock}
                  disabled={loading || !uploaded}
                  style={{
                    width: '100%', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: uploaded ? 'var(--gold)' : 'rgba(255,215,80,0.08)',
                    border: `1px solid ${uploaded ? 'transparent' : 'rgba(255,215,80,0.15)'}`,
                    borderRadius: 12, cursor: (loading || !uploaded) ? 'not-allowed' : 'pointer',
                    color: uploaded ? '#0d0f12' : 'rgba(255,215,80,0.3)',
                    fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                    boxShadow: uploaded ? '0 4px 20px rgba(255,215,80,0.3)' : 'none',
                    opacity: loading ? 0.7 : 1, transition: 'all 0.25s',
                  }}
                >
                  {loading && <span className="sv-spinner" style={{ borderTopColor: '#0d0f12', width: 18, height: 18 }} />}
                  {loading ? 'Unlocking Vault…' : 'Unlock My Vault'}
                </button>

                <button
                  onClick={() => { setStep(2); setUploaded(''); setUploadedName(''); setError(''); }}
                  style={{
                    width: '100%', marginTop: 14, background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
                    fontFamily: 'var(--font-mono)', textDecoration: 'underline',
                    textDecorationColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  ← Back to download
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="sv-alert sv-alert-error"
                style={{ marginTop: 18 }}
              >
                <span>⚠</span><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5ad2be', opacity: 0.6 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Shamir 2-of-3 · Share rotation · E2E encrypted
          </span>
        </div>
      </motion.div>
    </div>
  );
}
