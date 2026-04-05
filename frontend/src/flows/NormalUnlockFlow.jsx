import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOTPInput } from '../pages/TOTPSetup';

const API_URL = "https://shamirsecurity-098.onrender.com";

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

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function NormalUnlockFlow({ username, password, onUnlock, onBack, onGoToSetupMFA }) {
  const [step, setStep] = useState(0); // 0: upload, 1: totp
  const [localShare, setLocalShare] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const fileInputRef = useRef(null);

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => { setLocalShare(evt.target.result.trim()); setFileName(file.name); };
    reader.readAsText(file);
  };

  const handleVerifyShare = async () => {
    setError(''); setLoading(true);
    try {
      if (!localShare) { setError('Please upload your local_share.enc file.'); return; }
      const res = await fetch(`${API_URL}/api/unlock/verify-share`, {
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

  const handleUnlockComplete = async () => {
    if (totpCode.length !== 6) { setError('Please enter all 6 digits.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/unlock/complete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken, totp_code: totpCode }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        onUnlock(data.golden_key, data.username || username);
      } else {
        setError(data.message || 'TOTP verification failed.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="sv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} style={{ width: '100%', maxWidth: 540, padding: '0 24px' }}>
        <button className="sv-btn sv-btn-ghost" onClick={step === 0 ? onBack : () => setStep(0)} style={{ marginBottom: 28, padding: '8px 14px', fontSize: 13 }}>
          <ArrowLeftIcon /> Back
        </button>

        <div className="sv-card" style={{ padding: '36px 32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,215,80,0.5), transparent)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ color: 'var(--gold)' }}><ShieldKeyIcon /></div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Unlock Vault</h2>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="upload" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); readFile(e.dataTransfer.files[0]); }}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--gold)' : localShare ? 'var(--success)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
                    background: dragOver ? 'rgba(255,215,80,0.05)' : localShare ? 'rgba(62,207,142,0.05)' : 'var(--bg-elevated)',
                    transition: 'all 0.2s', marginBottom: 20,
                  }}
                >
                  <input ref={fileInputRef} type="file" accept=".enc,.txt" onChange={e => readFile(e.target.files[0])} style={{ display: 'none' }} />
                  <div style={{ color: localShare ? 'var(--success)' : 'var(--text-muted)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}><UploadIcon /></div>
                  {localShare ? (
                    <div>
                      <div style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>File loaded ✓</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fileName}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Drop your file here, or <span style={{ color: 'var(--gold)' }}>browse</span></div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>.enc or .txt · local_share.enc</div>
                    </div>
                  )}
                </div>
                <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleVerifyShare} disabled={loading || !localShare}>
                  {loading ? <span className="sv-spinner" /> : 'Verify Share'}
                </button>
              </motion.div>
            ) : (
              <motion.div key="totp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {info && <div className="sv-alert sv-alert-success" style={{ marginBottom: 20 }}>{info}</div>}
                
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 20 }}>Enter your <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Google Authenticator</span> code</p>
                  <TOTPInput value={totpCode} onChange={setTotpCode} onSubmit={handleUnlockComplete} loading={loading} />
                </div>

                <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleUnlockComplete} disabled={loading || totpCode.length < 6}>
                  {loading ? <span className="sv-spinner" /> : 'Unlock Vault'}
                </button>
                
                <button
                  onClick={() => onGoToSetupMFA(sessionToken)}
                  style={{ width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Need to setup QR code? Click here
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <div className="sv-alert sv-alert-error" style={{ marginTop: 20 }}>{error}</div>}
        </div>
      </motion.div>
    </div>
  );
}
