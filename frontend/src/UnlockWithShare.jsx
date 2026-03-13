import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://shamirsecurity-098.onrender.com';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ShieldKeyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function UnlockWithShare({ username, password, onUnlock, onBack }) {
  const [localShare, setLocalShare] = useState(null);
  const [fileName, setFileName]   = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const fileInputRef = useRef(null);

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => { setLocalShare(evt.target.result); setFileName(file.name); };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => { readFile(e.target.files[0]); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleUnlock = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, local_share: localShare })
      });
      const data = await res.json();
      if (data.status === 'success') { onUnlock(data.golden_key, username); }
      else { setError(data.message || 'Unlock failed.'); }
    } catch { setError('Network error unlocking vault.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="sv-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <motion.div
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.42 }}
        style={{ width:'100%', maxWidth:520, padding:'0 24px', position:'relative', zIndex:1 }}
      >
        {/* Back */}
        <button
          className="sv-btn sv-btn-ghost"
          onClick={onBack}
          style={{ marginBottom:28, padding:'8px 14px', fontSize:13 }}
        >
          <ArrowLeftIcon />
          Back
        </button>

        <div className="sv-card" style={{ padding:'36px 32px' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <div style={{ color:'var(--gold)', display:'flex', alignItems:'center' }}>
              <ShieldKeyIcon />
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>
              Unlock Vault
            </h2>
          </div>

          {/* User info */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28, padding:'8px 12px', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border-subtle)' }}>
            <span style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>User</span>
            <span style={{ fontSize:13, color:'var(--gold)', fontWeight:600 }}>{username}</span>
          </div>

          <label className="sv-label" style={{ marginBottom:10 }}>Upload local_share.enc</label>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--gold-dim)' : localShare ? 'var(--success)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '36px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--gold-muted)' : localShare ? 'rgba(62,207,142,0.05)' : 'var(--bg-elevated)',
              transition: 'all var(--t-base)',
              marginBottom: 24,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".enc,.txt"
              onChange={handleFileChange}
              style={{ display:'none' }}
            />
            <div style={{ color: localShare ? 'var(--success)' : 'var(--text-muted)', marginBottom:10, display:'flex', justifyContent:'center' }}>
              <UploadIcon />
            </div>
            {localShare ? (
              <div>
                <div style={{ color:'var(--success)', fontSize:13, fontWeight:600, marginBottom:4 }}>File loaded</div>
                <div style={{ color:'var(--text-muted)', fontSize:12 }}>{fileName}</div>
              </div>
            ) : (
              <div>
                <div style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:4 }}>
                  Drop your file here, or <span style={{ color:'var(--gold)' }}>browse</span>
                </div>
                <div style={{ color:'var(--text-muted)', fontSize:12 }}>.enc or .txt · local_share.enc</div>
              </div>
            )}
          </div>

          <button
            className="sv-btn sv-btn-primary sv-btn-full"
            onClick={handleUnlock}
            disabled={loading || !localShare}
            style={{ fontSize:14, padding:'14px 24px' }}
          >
            {loading ? <span className="sv-spinner" style={{ borderTopColor:'#0d0f12' }} /> : null}
            {loading ? 'Verifying...' : 'Unlock Vault'}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                transition={{ duration:0.22 }}
                className="sv-alert sv-alert-error"
                style={{ marginTop:16 }}
              >
                <span>⚠</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
