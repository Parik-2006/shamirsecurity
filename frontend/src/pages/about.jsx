import React from 'react';
import { motion } from 'framer-motion';

export default function About({ onClose }) {
  const handleClose = () => {
    if (onClose) onClose();
  };
  const handleMail = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=parikshithbb.cs25@rvce.edu.in', '_blank');
  };
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(11,13,16,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'anticipate' }}
        style={{ background: '#151A21', borderRadius: 20, padding: '32px 24px', maxWidth: 380, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ color: '#FFD66B', fontSize: 24, fontWeight: 800, marginBottom: 18, textShadow: '0 2px 24px #FFD66B55' }}>
          About Shamir Vault
        </motion.h2>
        <div style={{ fontSize: 15, color: '#FFD66B', marginBottom: 18, lineHeight: 1.6 }}>
          Secure multi-key secret management using Shamir Secret Sharing.<br />
          <div style={{ margin: '18px 0', textAlign: 'left', color: '#FFD66B', fontSize: 14 }}>
            <b>How to use:</b>
            <ol style={{ margin: '12px 0 0 18px', padding: 0, textAlign: 'left', color: '#FFD66B' }}>
              <li>Create a new vault with your username and master password.</li>
              <li>Register and save your credentials (service, username, password).</li>
              <li>Download your share for backup and recovery.</li>
              <li>Unlock your vault using your credentials and share.</li>
            </ol>
          </div>
          For help, feedback, or bug reports:<br />
          <span style={{ display: 'block', marginTop: 12 }}>
            <span onClick={handleMail} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#FFD66B', fontWeight: 600 }} tabIndex={0}>Contact via Gmail</span>
            {' | '}
            <a href="https://discord.gg/9RxnKJPV" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', textDecoration: 'underline', color: '#FFD66B', fontWeight: 600 }} tabIndex={0}>Join Discord</a>
          </span>
        </div>
        <button onClick={handleClose} tabIndex={0} style={{ marginTop: 18, background: '#FFD66B', color: '#151A21', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 16px #FFD66B55' }}>Close</button>
      </motion.div>
    </div>
  );
}
