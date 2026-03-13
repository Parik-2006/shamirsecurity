import React from 'react';
import { motion } from 'framer-motion';

const palette = {
  bg: '#0d0f12',
  gold: '#ffd750',
  green: '#4ade80',
  text: '#e8eaf0',
  muted: '#8a909e',
};

function Section({ children, delay = 0, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function Documentation() {
  const navigate = useNavigate();
  const cards = [
    {
      title: 'Project Vision',
      accent: palette.gold,
      body: 'Shamir Secret Sharing is a cryptographic scheme that splits your master password into multiple pieces. Only when a threshold of shares are combined can the vault be reconstructed — ensuring no single server, device, or compromise exposes your secrets.',
    },
    {
      title: 'Share Architecture',
      accent: palette.green,
      items: [
        { label: 'Share 1', desc: 'Google Drive — user-controlled cloud storage' },
        { label: 'Share 2', desc: 'Supabase — secure managed backend' },
        { label: 'Share 3', desc: 'Local Encrypted File — device storage' },
      ],
    },
    {
      title: 'Centralized (Legacy)',
      accent: '#f87171',
      items: [
        { label: 'Single point of failure:', desc: 'one breach exposes everything' },
        { label: 'All secrets stored:', desc: 'in one centralised location' },
        { label: 'Trust concentrated:', desc: 'in a single provider' },
      ],
    },
    {
      title: 'Decentralized (Our Approach)',
      accent: palette.gold,
      items: [
        { label: 'Distributed trust:', desc: 'one compromised share reveals nothing' },
        { label: 'Independent layers:', desc: 'cloud, server, and local' },
        { label: 'Quantum-resilient:', desc: 'by design' },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, padding: '64px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'fixed',
              top: 32,
              left: 32,
              zIndex: 20,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: palette.muted,
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: '0.83rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: 24,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 16px #FFD66B55',
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: palette.gold,
            marginBottom: 12,
          }}>
            Documentation
          </h1>
          <p style={{ color: palette.muted, fontSize: '0.9rem', maxWidth: 480, margin: '0 auto' }}>
            How Shamir Vault distributes trust across cryptographic shares
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 20,
        }}>
          {cards.map((card, i) => (
            <Section key={card.title} delay={0.1 + i * 0.08}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-dim)',
                borderTop: `2px solid ${card.accent}`,
                borderRadius: 'var(--radius-xl)',
                padding: '28px 28px',
                height: '100%',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: card.accent,
                  marginBottom: 16,
                }}>
                  {card.title}
                </h2>
                {card.body && (
                  <p style={{ color: palette.muted, fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {card.body}
                  </p>
                )}
                {card.items && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {card.items.map((item, j) => (
                      <div key={j} style={{
                        display: 'flex',
                        gap: 10,
                        padding: '10px 14px',
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <span style={{ color: card.accent, fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </span>
                        <span style={{ color: palette.muted, fontSize: '0.8rem' }}>
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
