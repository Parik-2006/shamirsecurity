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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.5 9a9 9 0 0 1 14.8-3.3L23 10M1 14l4.7 4.3A9 9 0 0 0 20.5 15"/>
  </svg>
);

export default function RecoveryUnlockFlow({ username, onUnlock, onBack }) {
  // steps: 0: auth, 1: totp, 2: download_page, 3: verify_upload
  const [step, setStep] = useState(0);
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryUser, setRecoveryUser] = useState(username || '');
  const [totpCode, setTotpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tempShare, setTempShare] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [uploadedShare, setUploadedShare] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rTotp = params.get('recovery_totp');
    const rId = params.get('recovery_id');
    const rUser = params.get('username');

    if (rTotp === '1' && rId) {
      setStep(1);
      setRecoveryId(rId);
      if (rUser) setRecoveryUser(decodeURIComponent(rUser));
      setInfo('Identity verified ✓ — Enter your TOTP code for recovery.');
    }
  }, []);

  const handleRecoveryInit = async () => {
    if (!recoveryUser) { setError('Username required.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recovery/init`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: recoveryUser }),
      });
      const data = await res.json();
      if (data.status === 'redirect' && data.auth_url) {
        localStorage.setItem('recovery_id', data.recovery_id);
        localStorage.setItem('recovery_user', recoveryUser);
        window.location.href = data.auth_url;
      } else { setError(data.message || 'Recovery initiation failed.'); }
    } catch { setError('Network error initiation recovery.'); }
    finally { setLoading(false); }
  };

  const handleVerifyTOTP = async () => {
    if (totpCode.length !== 6) { setError('6 digits required.'); return; }
    if (!newPassword) { setError('New password required to secure your new share.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recovery/complete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recovery_id: recoveryId, totp_code: totpCode, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTempShare(data.new_local_share);
        setStep(2); // Go to separate download page
        setInfo('Vault restored! Download your temporary local share.');
      } else { setError(data.message || 'Recovery verification failed.'); }
    } catch { setError('Network error verify.'); }
    finally { setLoading(false); }
  };

  const downloadShare = () => {
    if (!tempShare) return;
    const blob = new Blob([tempShare], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${recoveryUser}_local_share.enc`; a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleVerifyUploadedShare = async () => {
    if (!uploadedShare) { setError('Please upload the share you downloaded.'); return; }
    // User must verify the temporary share they just downloaded.
    setLoading(true);
    // Mimic verification or use logic if needed. For recovery, if it matches tempShare, it's valid.
    if (uploadedShare.trim() === tempShare.trim()) {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: recoveryUser, password: newPassword, local_share: uploadedShare })
        });
        const data = await res.json();
        if(data.status === 'success') {
            onUnlock(data.golden_key, recoveryUser);
        } else {
            setError(data.message || 'Final verification failed.');
            setLoading(false);
        }
    } else {
        setError('The uploaded share does not match the temporary share provided.');
        setLoading(false);
    }
  };

  return (
    <div className="sv-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} style={{ width: '100%', maxWidth: 580, padding: '0 24px' }}>
        <button className="sv-btn sv-btn-ghost" onClick={step === 0 ? onBack : () => setStep(step - 1)} style={{ marginBottom: 28, padding: '8px 14px', fontSize: 13 }}>
          <ArrowLeftIcon /> Back
        </button>

        <div className="sv-card" style={{ padding: '36px 32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #5ad2be, transparent)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ color: '#5ad2be' }}><RotateIcon /></div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Vault Recovery</h2>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="auth" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Verify your identity via Google to reconstruct your vault.</p>
                <div style={{ marginBottom: 20 }}>
                  <label className="sv-label">Username</label>
                  <input className="sv-input" value={recoveryUser} onChange={e => setRecoveryUser(e.target.value)} placeholder="your_username" />
                </div>
                <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleRecoveryInit} disabled={loading} style={{ background: '#5ad2be', borderColor: '#5ad2be', gap: 12 }}>
                  {loading ? <span className="sv-spinner" /> : <GoogleIcon />}
                  {loading ? 'Initiating…' : 'Authenticate with Google'}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="totp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {info && <div className="sv-alert sv-alert-success" style={{ marginBottom: 20 }}>{info}</div>}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>Enter your TOTP code and choose a <strong>new master password</strong>:</p>
                  <TOTPInput value={totpCode} onChange={setTotpCode} loading={loading} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="sv-label">New Master Password</label>
                  <input className="sv-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••••••" />
                </div>
                <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleVerifyTOTP} disabled={loading || totpCode.length < 6 || !newPassword} style={{ background: '#5ad2be' }}>
                  {loading ? <span className="sv-spinner" /> : 'Reconstruct & Rotate'}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="download" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#5ad2be', marginBottom: 12 }}>Temporary Share Generated</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
                  Your vault has been reconstructed. Download the <strong>temporary share</strong> below. 
                  You will need to upload it in the next step to finish unlocking.
                </p>
                <button className="sv-btn sv-btn-secondary sv-btn-full" onClick={downloadShare} style={{ borderColor: '#5ad2be', color: '#5ad2be', marginBottom: 20, height: 54 }}>
                  <DownloadIcon /> Download local_share.enc
                </button>
                {downloaded && (
                    <button className="sv-btn sv-btn-primary sv-btn-full" onClick={() => setStep(3)} style={{ background: '#5ad2be' }}>
                        Next: Verify & Unlock Vault →
                    </button>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="verify-upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                 <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Final Step: Upload the share you just downloaded.</p>
                 <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${uploadedShare ? 'var(--success)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
                    background: uploadedShare ? 'rgba(62,207,142,0.05)' : 'var(--bg-elevated)',
                    transition: 'all 0.2s', marginBottom: 20,
                  }}
                >
                  <input ref={fileInputRef} type="file" accept=".enc,.txt" onChange={e => {
                      const file = e.target.files[0];
                      if(file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => { setUploadedShare(evt.target.result.trim()); setUploadedFileName(file.name); };
                          reader.readAsText(file);
                      }
                  }} style={{ display: 'none' }} />
                  <div style={{ color: uploadedShare ? 'var(--success)' : 'var(--text-muted)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}><UploadIcon /></div>
                  {uploadedShare ? (
                    <div>
                      <div style={{ color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>File uploaded ✓</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{uploadedFileName}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Select your new local_share.enc</div>
                    </div>
                  )}
                </div>
                <button className="sv-btn sv-btn-primary sv-btn-full" onClick={handleVerifyUploadedShare} disabled={loading || !uploadedShare} style={{ background: '#5ad2be' }}>
                  {loading ? <span className="sv-spinner" /> : 'Unlock Vault'}
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
