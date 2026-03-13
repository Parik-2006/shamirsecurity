import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0B0D10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#151A21', borderRadius: 28, padding: '48px 32px', maxWidth: 520, width: '90vw', boxShadow: '0 8px 48px #000b, 0 1.5px 16px #23272f99', color: '#FFD66B', textAlign: 'center', position: 'relative' }}>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'anticipate' }} style={{ color: '#FFD66B', fontSize: 38, fontWeight: 800, letterSpacing: 1.5, marginBottom: 32, textAlign: 'center', textShadow: '0 2px 24px #FFD66B55' }}>
          About Shamir Vault
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ color: '#FFD66B', fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>
          Shamir Vault is a secure, multi-key secret management system using Shamir Secret Sharing. Your master password is split into multiple shares, ensuring no single server or device ever holds the full secret. This makes your data quantum-resilient and future-proof.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: '#FFD66B', fontSize: 16, lineHeight: 1.7 }}>
          <b>Contact:</b> support@shamirvault.com
        </motion.p>
      </div>
    </div>
  );
}
