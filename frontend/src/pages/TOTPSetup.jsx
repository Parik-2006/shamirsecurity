import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

// ─── Icons ────────────────────────────────────────────────────────────────────
const QRIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h3M20 14v3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// ─── QR Code via qrcode.react (Reliable Client-side Gen) ───────────────────────
function QRCodeDisplay({ uri }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: 220, height: 220, margin: '0 auto 24px',
        padding: 12,
        borderRadius: 16, overflow: 'hidden',
        border: '1.5px solid rgba(90,210,190,0.3)',
        boxShadow: '0 0 32px rgba(90,210,190,0.15)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {uri ? (
        <QRCodeSVG 
          value={uri} 
          size={196}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "/favicon.ico",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      ) : (
        <div style={{ color: '#666', fontSize: 12 }}>Generating QR...</div>
      )}
    </motion.div>
  );
}

// ─── TOTP Digit Input (Robust Implementation) ────────────────────────────────
function TOTPInput({ value, onChange, onSubmit, loading }) {
  const refs = React.useRef([]);
  
  // Ensure value is always exactly 6 chars (padded with spaces if needed)
  const code = (value || '').padEnd(6, ' ');
  const digits = code.split('').slice(0, 6);

  // Focus the first empty input on mount or when code changes
  React.useEffect(() => {
    const firstEmpty = digits.findIndex(d => d === ' ');
    const activeIdx = firstEmpty === -1 ? 5 : firstEmpty;
    // We don't auto-focus every time code changes to avoid jarring user experience,
    // but on mount of the verify step it helps.
    if (value === '') refs.current[0]?.focus();
  }, []);

  const handleChange = (idx, e) => {
    const char = e.target.value.slice(-1); // Take only the last character entered
    if (!/^[0-9]$/.test(char) && char !== '') return;
    
    const newCodeArr = code.split('');
    newCodeArr[idx] = char || ' ';
    const newVal = newCodeArr.join('');
    onChange(newVal.trimEnd());

    // Auto focus next
    if (char && idx < 5) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (!digits[idx] || digits[idx] === ' ') {
        if (idx > 0) {
          refs.current[idx - 1]?.focus();
          const newCodeArr = code.split('');
          newCodeArr[idx - 1] = ' ';
          onChange(newCodeArr.join('').trimEnd());
        }
      } else {
        const newCodeArr = code.split('');
        newCodeArr[idx] = ' ';
        onChange(newCodeArr.join('').trimEnd());
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      refs.current[idx + 1]?.focus();
    } else if (e.key === 'Enter' && value.length === 6) {
      onSubmit?.();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (data) {
      onChange(data);
      refs.current[Math.min(data.length, 5)]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }} onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit === ' ' ? '' : digit}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => e.target.select()}
          disabled={loading}
          style={{
            width: 48, height: 56, textAlign: 'center',
            fontSize: 24, fontWeight: 700, fontFamily: 'monospace',
            background: 'rgba(13,16,20,0.9)',
            border: `1.5px solid ${digit !== ' ' ? 'rgba(90,210,190,0.7)' : 'rgba(90,210,190,0.18)'}`,
            borderRadius: 12, color: '#5ad2be',
            outline: 'none', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: digit !== ' ' ? '0 0 12px rgba(90,210,190,0.1)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main TOTP Setup Component ──────────────────────────────────────────────
export default function TOTPSetup({ onBack, onComplete, sessionToken, initialStep, loggedUserName }) {
  const [step,           setStep]           = useState(initialStep || 'enter-username'); // enter-username | setup | verify | done
  const [username,       setUsername]       = useState('');
  const [totpSecret,     setTotpSecret]     = useState('');
  const [provisioningUri, setProvisioningUri] = useState('');
  const [totpCode,       setTotpCode]       = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [copied,         setCopied]         = useState(false);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('vaultUser');
    if (savedUser) setUsername(savedUser);
  }, []);

  const handleSetup = async () => {
    if (!username.trim()) { setError('Please enter your username.'); return; }
    
    // Validation: Ensure the username matches the session
    if (loggedUserName && username.trim().toLowerCase() !== loggedUserName.trim().toLowerCase()) {
      setError(`Username must match the one you logged in with: "${loggedUserName}"`);
      return;
    }

    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/totp/setup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTotpSecret(data.secret);
        setProvisioningUri(data.provisioning_uri);
        setStep('setup');
      } else {
        setError(data.message || 'TOTP setup failed.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (totpCode.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    setError('');    setLoading(true);
    try {
      const endpoint = sessionToken ? `/api/unlock/complete` : `/api/totp/verify`;
      const body = sessionToken 
        ? { session_token: sessionToken, totp_code: totpCode }
        : { username: username.trim(), code: totpCode };

      const res  = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === 'success' || data.valid) {
        if (onComplete) onComplete(data);
        else setStep('done');
      } else {
        setError(data.message || 'Invalid code. Please try again.');
        setTotpCode('');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'anticipate' }}
      style={{
        minHeight: '100vh', minWidth: '100vw', width: '100%',
        background: 'var(--bg-base)', position: 'absolute',
        top: 0, left: 0, zIndex: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '40%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(90,210,190,0.04) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <button
        onClick={onBack}
        style={{
          position: 'fixed', top: 24, left: 24, zIndex: 20,
          background: 'rgba(13,16,20,0.9)', color: 'var(--gold)',
          border: '1px solid rgba(255,215,80,0.25)', borderRadius: 10,
          fontWeight: 600, fontSize: 14, padding: '10px 20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.4)', cursor: 'pointer',
          backdropFilter: 'blur(12px)',
        }}
      >
        ← Back to Vault
      </button>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 480, padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            animate={{ boxShadow: ['0 0 16px rgba(90,210,190,0.1)', '0 0 36px rgba(90,210,190,0.25)', '0 0 16px rgba(90,210,190,0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(90,210,190,0.08)',
              border: '1px solid rgba(90,210,190,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px', color: '#5ad2be',
            }}
          >
            <ShieldIcon />
          </motion.div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.8rem', color: '#5ad2be', letterSpacing: '0.03em', margin: 0,
          }}>
            MFA Protection
          </h1>
          <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Google Authenticator · ShamirVault
          </p>
        </div>

        <div className="sv-card" style={{ padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
          {/* Accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(90,210,190,0.5), transparent)',
          }} />

          <AnimatePresence mode="wait">
            {/* Step 1: Enter Username */}
            {step === 'enter-username' && (
              <motion.div key="username" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.6, opacity: 0.9 }}>
                  Add an extra layer of security to your vault. Scan the code with <strong style={{color:'var(--gold)'}}>Google Authenticator</strong> to enable Multi-Factor Authentication.
                </p>
                
                <div style={{ 
                  marginBottom: 20, padding: 12, borderRadius: 8, 
                  background: 'rgba(255,215,80,0.05)', border: '1px solid rgba(255,215,80,0.15)' 
                }}>
                  <p style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>
                    ⚠️ IMPORTANT: Enter the EXACT same username you used for your vault.
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="sv-label">Username</label>
                  <input
                    className="sv-input"
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSetup()}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleSetup}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #5ad2be, #26a89a)', borderColor: '#5ad2be' }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: '#0d0f12' }} /> : <QRIcon />}
                  {loading ? 'Generating Secret…' : 'Setup Authenticator'}
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Show QR + secret */}
            {step === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20, textAlign: 'center', lineHeight: 1.6 }}>
                  Scan this QR code with <strong style={{ color: 'var(--gold)' }}>Google Authenticator</strong>.
                </p>

                {provisioningUri && <QRCodeDisplay uri={provisioningUri} />}

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Or enter this code manually:</p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    justifyContent: 'center', flexWrap: 'wrap',
                  }}>
                    <code style={{
                      background: 'rgba(13,16,20,0.9)', padding: '6px 12px',
                      borderRadius: 6, border: '1px solid rgba(255,215,80,0.2)',
                      fontSize: 12, color: 'var(--gold)', letterSpacing: '0.15em',
                      fontFamily: 'monospace',
                    }}>{totpSecret}</code>
                    <button
                      onClick={copySecret}
                      style={{
                        background: 'transparent', border: '1px solid rgba(255,215,80,0.2)',
                        borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                        color: copied ? 'var(--success)' : 'var(--text-muted)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={() => { setStep('verify'); setTotpCode(''); }}
                  style={{ background: 'linear-gradient(135deg, #5ad2be, #26a89a)', borderColor: '#5ad2be' }}
                >
                  <PhoneIcon />
                  Confirm Setup
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Verify TOTP */}
            {step === 'verify' && (
              <motion.div key="verify" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ color: '#5ad2be', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <PhoneIcon />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>
                    Enter the 6-digit code from your app.
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>Code refreshes every 30 seconds</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <TOTPInput
                    value={totpCode}
                    onChange={setTotpCode}
                    onSubmit={handleVerify}
                    loading={loading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={handleVerify}
                  disabled={loading || totpCode.length < 6}
                  style={{ background: 'linear-gradient(135deg, #5ad2be, #26a89a)', borderColor: '#5ad2be' }}
                >
                  {loading ? <span className="sv-spinner" style={{ borderTopColor: '#0d0f12' }} /> : null}
                  {loading ? 'Verifying…' : 'Verify & Enable'}
                </motion.button>

                <button
                  onClick={() => setStep('setup')}
                  style={{ width: '100%', marginTop: 12, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ← Back to QR code
                </button>
              </motion.div>
            )}

            {/* Step 4: Done */}
            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(62,207,142,0)', '0 0 32px rgba(62,207,142,0.3)', '0 0 0 rgba(62,207,142,0)'] }}
                  transition={{ duration: 1.2, repeat: 2 }}
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(62,207,142,0.12)', border: '2.5px solid var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: 'var(--success)',
                  }}
                >
                  <div style={{ transform: 'scale(1.4)' }}><CheckIcon /></div>
                </motion.div>
                <h3 style={{ color: 'var(--success)', fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
                  MFA Active!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                  Multi-Factor Authentication is now linked to your vault.
                  You'll need your authenticator app every time you unlock.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="sv-btn sv-btn-primary sv-btn-full"
                  onClick={onBack}
                >
                  Return to Home
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="sv-alert sv-alert-error"
                style={{ marginTop: 16 }}
              >
                <span>⚠</span><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          TOTP Protection · RFC 6238 Standard
        </p>
      </div>
    </motion.div>
  );
}
