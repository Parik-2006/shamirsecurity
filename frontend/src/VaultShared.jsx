import React, { useState, useEffect, useRef } from 'react';

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

const AVATAR_COLORS = ['#ffd750','#3ecf8e','#5b8dee','#e879a4','#a78bfa','#fb923c'];

/** Smart service logo: tries Clearbit, falls back to letter avatar */
export function ServiceLogo({ name = '?' }) {
  const domain  = resolveLogoDomain(name);
  const logoUrl = domain
    ? `https://logo.clearbit.com/${domain}?size=64`
    : null;

  const [imgOk, setImgOk] = useState(!!logoUrl); // optimistic
  const colorIdx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const color    = AVATAR_COLORS[colorIdx];

  // Reset when name changes
  useEffect(() => { setImgOk(!!logoUrl); }, [logoUrl]);

  const containerStyle = {
    width: 34,
    height: 34,
    borderRadius: 9,
    flexShrink: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: imgOk ? 'rgba(255,255,255,0.04)' : `${color}18`,
    border: `1px solid ${imgOk ? 'rgba(255,255,255,0.08)' : color + '33'}`,
    transition: 'all 0.2s ease',
  };

  if (logoUrl && imgOk) {
    return (
      <div style={containerStyle}>
        <img
          src={logoUrl}
          alt={name}
          onError={() => setImgOk(false)}
          style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 3 }}
        />
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

/* ─────────────────────────────────────────────────────────────
   VAULT PAGE CYBER BACKGROUND
   Visually distinct from RegistrationVault + Login:
   • Cascading encrypted data streams (vertical char columns)
   • Circuit-board traces (L-shaped routed paths)
   • Binary burst clusters that bloom from random points
   • Horizontal encrypted packet lines racing across screen
   ───────────────────────────────────────────────────────────── */
export function VaultPageCyberBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const CELL  = 22;              // grid cell size for streams
    const CHARS = '01アイウエオカキクケコ░▒▓█▄▀ABCDEF0123456789';

    /* ── Cascading stream columns ── */
    const colCount = Math.ceil(window.innerWidth / CELL);
    const streams  = Array.from({ length: colCount }, (_, i) => ({
      x:      i * CELL + CELL / 2,
      y:      Math.random() * -window.innerHeight,   // start above viewport
      speed:  Math.random() * 1.1 + 0.4,
      length: Math.floor(Math.random() * 10) + 5,    // trail length in chars
      chars:  Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      timer:  0,
      mutRate:Math.floor(Math.random() * 8) + 4,     // frames between char changes
      active: Math.random() < 0.28,                  // only ~28% active at once
      dormant:Math.floor(Math.random() * 300),        // frames to wait before activating
      fontSize: Math.random() < 0.15 ? 9 : 11,
    }));

    /* ── Circuit traces ── */
    // Fixed L-shaped paths rendered as faint gold/cyan lines
    const buildTraces = () => {
      const traces = [];
      const count  = Math.floor(window.innerWidth / 160);
      for (let i = 0; i < count; i++) {
        const x1 = Math.random() * w;
        const y1 = Math.random() * h;
        const x2 = x1 + (Math.random() - 0.5) * 300;
        const y2 = y1 + (Math.random() - 0.5) * 200;
        const cx  = Math.random() < 0.5 ? x2 : x1;   // L-bend point
        const cy  = Math.random() < 0.5 ? y1 : y2;
        traces.push({
          pts: [[x1,y1],[cx,cy],[x2,y2]],
          alpha: Math.random() * 0.07 + 0.025,
          cyan: Math.random() < 0.4,
          // animated dot traveling along the trace
          dot: { t: Math.random(), speed: Math.random() * 0.003 + 0.001 },
        });
      }
      return traces;
    };
    let traces = buildTraces();

    /* ── Binary burst clusters ── */
    const bursts = [];
    let burstTimer = 0;

    /* ── Horizontal encrypted packet lines ── */
    const packets = Array.from({ length: 6 }, () => ({
      y:      Math.random() * window.innerHeight,
      x:      Math.random() * window.innerWidth,
      speed:  (Math.random() * 1.2 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
      len:    Math.floor(Math.random() * 14) + 6,
      chars:  Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      alpha:  Math.random() * 0.08 + 0.03,
      timer:  0,
      mutRate:Math.floor(Math.random() * 6) + 3,
      fontSize: 9,
    }));

    let frame = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* ── Circuit traces + traveling dots ── */
      traces.forEach(tr => {
        const [[x1,y1],[cx,cy],[x2,y2]] = tr.pts;
        const col = tr.cyan ? `rgba(90,210,190,${tr.alpha})` : `rgba(255,215,80,${tr.alpha})`;
        ctx.strokeStyle = col;
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Dot nodes at corners
        [[x1,y1],[cx,cy],[x2,y2]].forEach(([px,py]) => {
          ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI*2);
          ctx.fillStyle = col; ctx.fill();
        });

        // Traveling pulse dot
        tr.dot.t = (tr.dot.t + tr.dot.speed) % 1;
        const t  = tr.dot.t;
        let px, py;
        if (t < 0.5) {
          px = lerp(x1, cx, t * 2);
          py = lerp(y1, cy, t * 2);
        } else {
          px = lerp(cx, x2, (t - 0.5) * 2);
          py = lerp(cy, y2, (t - 0.5) * 2);
        }
        const dotCol = tr.cyan ? `rgba(90,210,190,0.55)` : `rgba(255,215,80,0.55)`;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI*2);
        ctx.fillStyle = dotCol; ctx.fill();
      });

      /* ── Cascading streams ── */
      streams.forEach(s => {
        if (!s.active) {
          s.dormant--;
          if (s.dormant <= 0) { s.active = true; s.y = -CELL * s.length; }
          return;
        }

        s.timer++;
        if (s.timer >= s.mutRate) {
          // randomly mutate one char in the trail
          const idx = Math.floor(Math.random() * s.chars.length);
          s.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
          s.timer = 0;
        }

        ctx.font = `${s.fontSize}px "JetBrains Mono", monospace`;
        for (let i = 0; i < s.length; i++) {
          const cy2 = s.y - i * CELL;
          if (cy2 < -CELL || cy2 > h + CELL) continue;
          // Head = brighter, tail = fades
          const frac  = i / s.length;
          const alpha = i === 0
            ? 0.45                          // bright head
            : (1 - frac) * 0.09 + 0.01;   // fading tail
          const isHead = i === 0;
          ctx.fillStyle = isHead
            ? `rgba(255,230,120,${alpha})`
            : `rgba(255,215,80,${alpha})`;
          ctx.fillText(s.chars[i % s.chars.length], s.x - s.fontSize / 2, cy2);
        }

        s.y += s.speed;
        if (s.y - s.length * CELL > h) {
          // Reset stream
          s.y       = -CELL * s.length;
          s.active  = Math.random() < 0.55;
          s.dormant = Math.floor(Math.random() * 240) + 60;
          s.speed   = Math.random() * 1.1 + 0.4;
          s.length  = Math.floor(Math.random() * 10) + 5;
        }
      });

      /* ── Horizontal packet lines ── */
      packets.forEach(p => {
        p.timer++;
        if (p.timer >= p.mutRate) {
          const idx = Math.floor(Math.random() * p.chars.length);
          p.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
          p.timer = 0;
        }
        ctx.font = `${p.fontSize}px "JetBrains Mono", monospace`;
        for (let i = 0; i < p.len; i++) {
          const px2   = p.x + i * (p.fontSize + 2) * Math.sign(p.speed);
          const frac  = i / p.len;
          const alpha = (1 - frac) * p.alpha;
          ctx.fillStyle = `rgba(90,210,190,${alpha})`;   // cyan for packets
          ctx.fillText(p.chars[i % p.chars.length], px2, p.y);
        }
        p.x += p.speed;
        // Wrap around
        if (p.speed > 0 && p.x > w + 200) { p.x = -200; p.y = Math.random() * h; }
        if (p.speed < 0 && p.x < -200)    { p.x = w + 200; p.y = Math.random() * h; }
      });

      /* ── Binary burst clusters ── */
      burstTimer++;
      if (burstTimer % 200 === 0) {
        bursts.push({
          x:      Math.random() * w,
          y:      Math.random() * h,
          chars:  Array.from({ length: 12 }, () => ({
            ch:  Math.random() < 0.5 ? '0' : '1',
            ox:  (Math.random() - 0.5) * 80,
            oy:  (Math.random() - 0.5) * 80,
            t:   0,
            speed: Math.random() * 0.015 + 0.008,
          })),
          life: 1.0,
        });
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life -= 0.008;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.font = '9px "JetBrains Mono", monospace';
        b.chars.forEach(c => {
          c.t = Math.min(1, c.t + c.speed);
          const px2 = b.x + c.ox * c.t;
          const py2 = b.y + c.oy * c.t;
          ctx.fillStyle = `rgba(255,215,80,${b.life * 0.3})`;
          ctx.fillText(c.ch, px2, py2);
        });
      }

      /* ── Rebuild traces occasionally ── */
      if (frame % 1800 === 0) traces = buildTraces();

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
