import React, { useState, useEffect, useRef } from 'react';
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaLinkedin, FaApple, FaMicrosoft, FaYoutube, FaInstagram, FaSlack, FaDiscord, FaDropbox, FaFigma, FaPaypal, FaAmazon, FaSpotify, FaTwitch, FaReddit, FaPinterest, FaAws, FaGitlab, FaBitbucket, FaTrello, FaJira } from 'react-icons/fa';
import { SiZoom } from 'react-icons/si';

/* ─────────────────────────────────────────────────────────────
   SERVICE LOGO RECOGNITION
   Priority: manual icon map → Clearbit logo API → letter avatar
   ───────────────────────────────────────────────────────────── */

// Well-known services: map keyword → Clearbit domain
const SERVICE_DOMAIN_MAP = {
  // Auth / Identity
  google:       'google.com',
  gmail:        'google.com',
  youtube:      'youtube.com',
  microsoft:    'microsoft.com',
  outlook:      'microsoft.com',
  apple:        'apple.com',
  icloud:       'apple.com',
  facebook:     'facebook.com',
  instagram:    'instagram.com',
  twitter:      'twitter.com',
  x:            'x.com',
  linkedin:     'linkedin.com',
  github:       'github.com',
  gitlab:       'gitlab.com',
  bitbucket:    'bitbucket.org',
  // Streaming
  netflix:      'netflix.com',
  spotify:      'spotify.com',
  disney:       'disneyplus.com',
  hulu:         'hulu.com',
  amazon:       'amazon.com',
  prime:        'amazon.com',
  twitch:       'twitch.tv',
  // Finance
  paypal:       'paypal.com',
  stripe:       'stripe.com',
  coinbase:     'coinbase.com',
  binance:      'binance.com',
  robinhood:    'robinhood.com',
  chase:        'chase.com',
  wellsfargo:   'wellsfargo.com',
  // Productivity
  notion:       'notion.so',
  slack:        'slack.com',
  discord:      'discord.com',
  zoom:         'zoom.us',
  dropbox:      'dropbox.com',
  figma:        'figma.com',
  jira:         'atlassian.com',
  confluence:   'atlassian.com',
  trello:       'trello.com',
  asana:        'asana.com',
  airtable:     'airtable.com',
  // Cloud / Dev
  aws:          'aws.amazon.com',
  azure:        'azure.microsoft.com',
  digitalocean: 'digitalocean.com',
  heroku:       'heroku.com',
  vercel:       'vercel.com',
  netlify:      'netlify.com',
  cloudflare:   'cloudflare.com',
  npm:          'npmjs.com',
  // Shopping
  ebay:         'ebay.com',
  etsy:         'etsy.com',
  shopify:      'shopify.com',
  // Travel
  airbnb:       'airbnb.com',
  uber:         'uber.com',
  lyft:         'lyft.com',
  // Other
  reddit:       'reddit.com',
  pinterest:    'pinterest.com',
  tiktok:       'tiktok.com',
  snapchat:     'snapchat.com',
  whatsapp:     'whatsapp.com',
  telegram:     'telegram.org',
  protonmail:   'proton.me',
  lastpass:     'lastpass.com',
  bitwarden:    'bitwarden.com',
  dashlane:     'dashlane.com',
};

// Well-known services: map keyword → emoji icon
const SERVICE_ICON_MAP = {
  google: '🟢',
  gmail: '🟢',
  youtube: '🔴',
  microsoft: '🟦',
  outlook: '🟦',
  apple: '⚪',
  icloud: '⚪',
  facebook: '🔵',
  instagram: '🟣',
  twitter: '🔷',
  x: '❌',
  linkedin: '🔷',
  github: '⚫',
  gitlab: '🟧',
  bitbucket: '🟦',
  netflix: '🔴',
  spotify: '🟢',
  disney: '🔵',
  hulu: '🟢',
  amazon: '🟠',
  prime: '🟠',
  twitch: '🟣',
  paypal: '🔵',
  stripe: '🔵',
  coinbase: '🔵',
  binance: '🟡',
  robinhood: '🟢',
  chase: '🔵',
  wellsfargo: '🟠',
  notion: '⚫',
  slack: '🟣',
  discord: '🔵',
  zoom: '🔵',
  dropbox: '🔵',
  figma: '⚫',
  jira: '🔵',
  confluence: '🔵',
  trello: '🔵',
  asana: '🟣',
  airtable: '🔵',
  aws: '🟠',
  azure: '🔵',
  digitalocean: '🔵',
  heroku: '🟣',
  vercel: '⚫',
  netlify: '🟢',
  cloudflare: '🟠',
  npm: '🔴',
  ebay: '🟡',
  etsy: '🟠',
  shopify: '🟢',
  airbnb: '🟠',
  uber: '⚫',
  lyft: '🟣',
  reddit: '🟠',
  pinterest: '🔴',
  tiktok: '⚫',
  snapchat: '🟡',
  whatsapp: '🟢',
  telegram: '🔵',
  protonmail: '🟢',
  lastpass: '🔴',
  bitwarden: '🔵',
  dashlane: '🟢',
};

// Well-known services: map keyword → SVG icon component
const SERVICE_ICON_COMPONENTS = {
  google: FaGoogle,
  gmail: FaGoogle,
  github: FaGithub,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  apple: FaApple,
  microsoft: FaMicrosoft,
  youtube: FaYoutube,
  instagram: FaInstagram,
  slack: FaSlack,
  discord: FaDiscord,
  dropbox: FaDropbox,
  figma: FaFigma,
  paypal: FaPaypal,
  amazon: FaAmazon,
  spotify: FaSpotify,
  twitch: FaTwitch,
  reddit: FaReddit,
  pinterest: FaPinterest,
  aws: FaAws,
  gitlab: FaGitlab,
  bitbucket: FaBitbucket,
  trello: FaTrello,
  jira: FaJira,
  zoom: SiZoom,
};

// Ensure react-icons is installed for SVG brand logos
// Run: npm install react-icons --save
// This is required for Vite and production builds

/** Resolve a service name to a Clearbit logo URL, or null */
function resolveLogoDomain(name) {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Direct match
  if (SERVICE_DOMAIN_MAP[key]) return SERVICE_DOMAIN_MAP[key];

  // 2. Partial prefix match (e.g. "GitHub Enterprise" → github)
  for (const [k, domain] of Object.entries(SERVICE_DOMAIN_MAP)) {
    if (key.startsWith(k) || k.startsWith(key)) return domain;
  }

  // 3. If the name already looks like a domain (contains '.'), use it directly
  if (/\.[a-z]{2,}$/.test(name.toLowerCase())) return name.toLowerCase();

  return null;
}

/** Resolve a service name to an emoji icon, or null */
function resolveServiceIcon(name) {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SERVICE_ICON_MAP[key]) return SERVICE_ICON_MAP[key];
  for (const k of Object.keys(SERVICE_ICON_MAP)) {
    if (key.startsWith(k) || k.startsWith(key)) return SERVICE_ICON_MAP[k];
  }
  return null;
}

/** Resolve a service name to an SVG icon component, or null */
function resolveServiceIconComponent(name) {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SERVICE_ICON_COMPONENTS[key]) return SERVICE_ICON_COMPONENTS[key];
  for (const k of Object.keys(SERVICE_ICON_COMPONENTS)) {
    if (key.startsWith(k) || k.startsWith(key)) return SERVICE_ICON_COMPONENTS[k];
  }
  return null;
}

const AVATAR_COLORS = ['#ffd750','#3ecf8e','#5b8dee','#e879a4','#a78bfa','#fb923c'];

/** Smart service logo: tries Clearbit, falls back to letter avatar */
export function ServiceLogo({ name = '?' }) {
  const IconComponent = resolveServiceIconComponent(name);
  const colorIdx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIdx];
  const containerStyle = {
    width: 34,
    height: 34,
    borderRadius: 9,
    flexShrink: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.2s ease',
  };
  if (IconComponent) {
    return (
      <div style={containerStyle}>
        <IconComponent size={22} color={color} />
      </div>
    );
  }
  return (
    <div style={containerStyle}>
      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
        {(name[0] || '?').toUpperCase()}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VAULT CYBER BACKGROUND CANVAS
   Nodes + edges, scan wave, hex drifters, data pulses
   Lighter than login bg so it doesn't compete with table data
   ───────────────────────────────────────────────────────────── */
export function VaultCyberBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Fewer, slower nodes so they don't distract from content
    const nodes = Array.from({ length: 28 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.4 + 0.4,
    }));

    let scanY = Math.random() * window.innerHeight;

    const CHARS = '0123456789ABCDEF';
    const drifters = Array.from({ length: 14 }, () => ({
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      vy:       Math.random() * 0.28 + 0.1,
      char:     CHARS[Math.floor(Math.random() * 16)],
      opacity:  Math.random() * 0.09 + 0.03,   // more subtle than login
      size:     Math.floor(Math.random() * 3) + 8,
      timer:    0,
      interval: Math.floor(Math.random() * 100) + 50,
      cyan:     Math.random() < 0.3,
    }));

    const pulses = [];
    let pulseTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Very faint dot grid
      ctx.fillStyle = 'rgba(255,215,80,0.04)';
      const step = 42;
      for (let x = 0; x < w; x += step)
        for (let y = 0; y < h; y += step) {
          ctx.beginPath(); ctx.arc(x, y, 0.6, 0, Math.PI * 2); ctx.fill();
        }

      // Edges
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(255,215,80,${(1 - d/140) * 0.06})`;
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,215,80,0.15)'; ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // Scan line — very subtle so it doesn't compete with navbar
      scanY = (scanY + 0.35) % h;
      const sg = ctx.createLinearGradient(0, scanY-50, 0, scanY+50);
      sg.addColorStop(0,   'rgba(255,215,80,0)');
      sg.addColorStop(0.5, 'rgba(255,215,80,0.025)');
      sg.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, scanY-50, w, 100);

      // Data pulse rings
      pulseTimer++;
      if (pulseTimer % 150 === 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        pulses.push({ x: n.x, y: n.y, r: 0, maxR: 70, alpha: 0.22 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.r += 0.9; p.alpha = 0.22 * (1 - p.r / p.maxR);
        ctx.strokeStyle = `rgba(255,215,80,${p.alpha})`;
        ctx.lineWidth   = 0.7;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
        if (p.r >= p.maxR) pulses.splice(i, 1);
      }

      // Hex drifters
      drifters.forEach(d => {
        d.timer++;
        if (d.timer >= d.interval) { d.char = CHARS[Math.floor(Math.random()*16)]; d.timer = 0; }
        ctx.font      = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = d.cyan
          ? `rgba(100,210,195,${d.opacity})`
          : `rgba(255,215,80,${d.opacity})`;
        ctx.fillText(d.char, d.x, d.y);
        d.y += d.vy;
        if (d.y > h + 20) { d.y = -20; d.x = Math.random() * w; }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}
