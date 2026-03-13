import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'anticipate' }}
        style={{ background: '#151A21', borderRadius: 28, padding: '48px 32px', maxWidth: 540, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'left', position: 'relative' }}
      >
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'anticipate' }} style={{ color: '#FFD66B', fontSize: 38, fontWeight: 800, letterSpacing: 1.5, marginBottom: 32, textAlign: 'center', textShadow: '0 2px 24px #FFD66B55' }}>
          About Shamir Vault
        </motion.h1>
        <ol style={{ color: '#FFD66B', fontSize: 17, lineHeight: 1.7, marginBottom: 32, paddingLeft: 24 }}>
          <li style={{ marginBottom: 16 }}><b>Step 1:</b> Enter your username and master password to create a new vault.</li>
          <li style={{ marginBottom: 16 }}><b>Step 2:</b> Complete Google OAuth to store your first share securely in your Google Drive.</li>
          <li style={{ marginBottom: 16 }}><b>Step 3:</b> Download your local encrypted share file and keep it safe. This is required to unlock your vault.</li>
          <li style={{ marginBottom: 16 }}><b>Step 4:</b> Use your username, master password, and local share file to unlock your vault and access your credentials.</li>
          <li style={{ marginBottom: 16 }}><b>Step 5:</b> Add, view, and manage your passwords securely. All secrets are split and encrypted using Shamir Secret Sharing.</li>
        </ol>
        <div style={{ marginBottom: 24, fontSize: 16 }}>
          <b>Contact:</b> <a href="mailto:parikshithbb.cs25@rvce.edu.in" style={{ color: '#FFD66B', textDecoration: 'underline' }}>parikshithbb.cs25@rvce.edu.in</a>
        </div>
        <div style={{ marginBottom: 24, fontSize: 16 }}>
          <b>Discord:</b> <a href="https://discord.gg/9RxnKJPV" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD66B', textDecoration: 'underline' }}>https://discord.gg/9RxnKJPV</a>
        </div>
        <div style={{ fontSize: 15, color: '#FFD66B99', marginTop: 12 }}>
          For help, feedback, or bug reports, reach out via email or join the Discord community.
        </div>
      </motion.div>
    </div>
  );
}
