import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   SERVICE LOGO — MULTI-SOURCE WITH WATERFALL FALLBACK
   Sources tried in order:
     1. Google Favicon HD  (t3.gstatic.com) — most reliable, free
     2. DuckDuckGo icons   (icons.duckduckgo.com) — good coverage
     3. Brandfetch          (cdn.brandfetch.io) — high quality
     4. Clearbit            (logo.clearbit.com) — legacy fallback
     5. Letter avatar       — always works
   ═══════════════════════════════════════════════════════════════════ */

const SERVICE_DOMAIN_MAP = {
  // Auth / Identity
  google: 'google.com', gmail: 'google.com', youtube: 'youtube.com',
  microsoft: 'microsoft.com', outlook: 'microsoft.com', office: 'microsoft.com',
  apple: 'apple.com', icloud: 'apple.com',
  facebook: 'facebook.com', instagram: 'instagram.com',
  twitter: 'twitter.com', x: 'x.com',
  linkedin: 'linkedin.com',
  // Dev / Code
  github: 'github.com', gitlab: 'gitlab.com', bitbucket: 'bitbucket.org',
  stackoverflow: 'stackoverflow.com', codepen: 'codepen.io',
  replit: 'replit.com', huggingface: 'huggingface.co',
  openai: 'openai.com', anthropic: 'anthropic.com',
  // Streaming
  netflix: 'netflix.com', spotify: 'spotify.com',
  disney: 'disneyplus.com', hulu: 'hulu.com',
  amazon: 'amazon.com', prime: 'amazon.com',
  twitch: 'twitch.tv', vimeo: 'vimeo.com',
  // Finance
  paypal: 'paypal.com', stripe: 'stripe.com',
  coinbase: 'coinbase.com', binance: 'binance.com',
  robinhood: 'robinhood.com', chase: 'chase.com',
  wellsfargo: 'wellsfargo.com', revolut: 'revolut.com',
  // Productivity
  notion: 'notion.so', slack: 'slack.com', discord: 'discord.com',
  zoom: 'zoom.us', dropbox: 'dropbox.com', figma: 'figma.com',
  jira: 'atlassian.com', confluence: 'atlassian.com', trello: 'trello.com',
  asana: 'asana.com', airtable: 'airtable.com', monday: 'monday.com',
  clickup: 'clickup.com', linear: 'linear.app',
  // Cloud / Infra
  aws: 'aws.amazon.com', azure: 'azure.microsoft.com',
  gcp: 'cloud.google.com', googlecloud: 'cloud.google.com',
  digitalocean: 'digitalocean.com', heroku: 'heroku.com',
  vercel: 'vercel.com', netlify: 'netlify.com',
  cloudflare: 'cloudflare.com', npm: 'npmjs.com',
  docker: 'docker.com', kubernetes: 'kubernetes.io',
  // Shopping
  ebay: 'ebay.com', etsy: 'etsy.com', shopify: 'shopify.com',
  // Social / Comms
  reddit: 'reddit.com', pinterest: 'pinterest.com',
  tiktok: 'tiktok.com', snapchat: 'snapchat.com',
  whatsapp: 'whatsapp.com', telegram: 'telegram.org',
  signal: 'signal.org',
  // Security
  protonmail: 'proton.me', proton: 'proton.me',
  lastpass: 'lastpass.com', bitwarden: 'bitwarden.com',
  dashlane: 'dashlane.com', nordpass: 'nordpass.com',
  // Travel / Transport
  airbnb: 'airbnb.com', uber: 'uber.com', lyft: 'lyft.com',
  booking: 'booking.com', expedia: 'expedia.com',
};

function resolveDomain(name) {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SERVICE_DOMAIN_MAP[key]) return SERVICE_DOMAIN_MAP[key];
  for (const [k, d] of Object.entries(SERVICE_DOMAIN_MAP)) {
    if (key.startsWith(k) || k.startsWith(key)) return d;
  }
  if (/\.[a-z]{2,}$/.test(name.toLowerCase())) return name.toLowerCase();
  return null;
}

/* Build the ordered list of URLs to try for a given domain */
function buildLogoUrls(domain) {
  if (!domain) return [];
  const enc = encodeURIComponent(domain);
  return [
    // 1. Google favicon HD — extremely reliable
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    // 2. DuckDuckGo favicon service
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    // 3. Clearbit
    `https://logo.clearbit.com/${domain}?size=64`,
    // 4. Favicon.io
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];
}

const AVATAR_COLORS = ['#ffd750','#3ecf8e','#5b8dee','#e879a4','#a78bfa','#fb923c'];

/** Letter avatar fallback */
function LetterAvatar({ name }) {
  const colorIdx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const color    = AVATAR_COLORS[colorIdx];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${color}18`, border: `1px solid ${color}40`,
    }}>
      <span style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
        {(name[0] || '?').toUpperCase()}
      </span>
    </div>
  );
}

/**
 * ServiceLogo — waterfall through 4 logo APIs, then letter avatar.
 * Renders a shimmer placeholder while loading.
 */
export function ServiceLogo({ name = '?' }) {
  const domain = resolveDomain(name);
  const urls   = buildLogoUrls(domain);

  // urlIndex: -1 = loading, 0..n = trying urls[urlIndex], urls.length = all failed
  const [idx,    setIdx]    = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Reset when name changes
  useEffect(() => { setIdx(0); setLoaded(false); }, [name]);

  const allFailed = idx >= urls.length;

  if (!domain || allFailed) return <LetterAvatar name={name} />;

  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: loaded ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,80,0.06)',
      border: `1px solid ${loaded ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,80,0.15)'}`,
      transition: 'background 0.3s, border 0.3s',
    }}>
      {/* Shimmer while not yet loaded */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,80,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmerSlide 1.4s infinite',
        }} />
      )}

      <img
        key={`${name}-${idx}`}
        src={urls[idx]}
        alt={name}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(false); setIdx(i => i + 1); }}
        style={{
          width: 22, height: 22,
          objectFit: 'contain',
          borderRadius: 3,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.25s ease',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REGISTRATION VAULT BACKGROUND
   Visual concept: Deep-space encryption grid
   • Dense hexagonal tessellation that slowly pulses
   • Radial "encryption rings" expanding from cursor-tracked center
   • Floating binary streams (vertical columns)
   • Corner bracket decorations
   ═══════════════════════════════════════════════════════════════════ */
export function VaultCyberBg() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h, frame = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMove);

    /* ── Hex grid ── */
    const HEX_R = 28; // outer radius
    const HEX_W = HEX_R * Math.sqrt(3);
    const HEX_H = HEX_R * 2;

    function hexPath(cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    /* ── Binary column streams ── */
    const COL_W = 18;
    const colCount = Math.ceil(window.innerWidth / COL_W);
    const cols = Array.from({ length: colCount }, () => ({
      y:       Math.random() * -window.innerHeight,
      speed:   Math.random() * 0.8 + 0.3,
      len:     Math.floor(Math.random() * 8) + 3,
      active:  Math.random() < 0.18,
      dormant: Math.floor(Math.random() * 400),
      chars:   Array.from({ length: 12 }, () => Math.random() < 0.5 ? '1' : '0'),
      mutT:    0, mutRate: Math.floor(Math.random() * 12) + 6,
    }));

    /* ── Encryption rings from mouse ── */
    const rings = [];
    let ringTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* ── Hex grid ── */
      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      let row = 0;
      for (let y = -HEX_H; y < h + HEX_H; y += HEX_H * 0.75) {
        const offset = (row % 2) * (HEX_W / 2);
        for (let x = -HEX_W; x < w + HEX_W; x += HEX_W) {
          const cx = x + offset;
          const cy = y;
          const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
          const proximity = Math.max(0, 1 - dist / 300);
          const pulse = Math.sin(frame * 0.018 + dist * 0.012) * 0.5 + 0.5;
          const alpha  = 0.028 + proximity * 0.055 + pulse * 0.012;

          hexPath(cx, cy, HEX_R - 1);
          ctx.strokeStyle = `rgba(255,215,80,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();

          // Occasional filled hex near mouse
          if (proximity > 0.6 && pulse > 0.85) {
            hexPath(cx, cy, HEX_R - 1);
            ctx.fillStyle = `rgba(255,215,80,${proximity * 0.04})`;
            ctx.fill();
          }
        }
        row++;
      }

      /* ── Mouse-tracked encryption rings ── */
      ringTimer++;
      if (ringTimer % 90 === 0) {
        rings.push({ x: mx, y: my, r: 0, maxR: 180, alpha: 0.35 });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r    += 1.4;
        rg.alpha = 0.35 * (1 - rg.r / rg.maxR);
        // Draw double ring for encryption feel
        for (const dr of [0, 6]) {
          ctx.beginPath();
          ctx.arc(rg.x, rg.y, rg.r + dr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,215,80,${rg.alpha * (dr === 0 ? 1 : 0.4)})`;
          ctx.lineWidth   = dr === 0 ? 0.9 : 0.4;
          ctx.stroke();
        }
        if (rg.r >= rg.maxR) rings.splice(i, 1);
      }

      /* ── Binary streams ── */
      cols.forEach((c, ci) => {
        if (!c.active) {
          c.dormant--;
          if (c.dormant <= 0) { c.active = true; c.y = -c.len * COL_W; }
          return;
        }
        c.mutT++;
        if (c.mutT >= c.mutRate) {
          c.chars[Math.floor(Math.random() * c.chars.length)] = Math.random() < 0.5 ? '1' : '0';
          c.mutT = 0;
        }
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let i = 0; i < c.len; i++) {
          const cy2  = c.y - i * COL_W;
          if (cy2 < -20 || cy2 > h + 20) continue;
          const frac = i / c.len;
          const a    = i === 0 ? 0.38 : (1 - frac) * 0.1 + 0.015;
          ctx.fillStyle = i === 0 ? `rgba(255,230,100,${a})` : `rgba(255,215,80,${a})`;
          ctx.fillText(c.chars[i % c.chars.length], ci * COL_W + 4, cy2);
        }
        c.y += c.speed;
        if (c.y > h + c.len * COL_W) {
          c.y = -c.len * COL_W;
          c.active  = Math.random() < 0.45;
          c.dormant = Math.floor(Math.random() * 350) + 80;
          c.speed   = Math.random() * 0.8 + 0.3;
        }
      });

      /* ── Corner bracket decorations ── */
      const bSize = 22, bGap = 16;
      const corners = [
        [bGap, bGap, 1, 1], [w-bGap, bGap, -1, 1],
        [bGap, h-bGap, 1, -1], [w-bGap, h-bGap, -1, -1],
      ];
      corners.forEach(([cx, cy, sx, sy]) => {
        ctx.strokeStyle = `rgba(255,215,80,${0.18 + Math.sin(frame*0.04)*0.06})`;
        ctx.lineWidth   = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx + sx*bSize, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy*bSize);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <style>{`@keyframes shimmerSlide{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VAULT PAGE BACKGROUND
   Visual concept: Live threat-map / SOC dashboard
   • Dot-matrix world-map silhouette (sparse)
   • Animated "threat arcs" connecting random geo points
   • Pulsing alert nodes in gold/red/cyan
   • Scrolling encrypted log lines at bottom
   • Diagonal scan sweep
   ═══════════════════════════════════════════════════════════════════ */
export function VaultPageCyberBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h, frame = 0;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Alert nodes (geo-positioned feel) ── */
    const NODE_COUNT = 22;
    const alertNodes = Array.from({ length: NODE_COUNT }, () => ({
      x:     0.05 + Math.random() * 0.9,   // normalized
      y:     0.1  + Math.random() * 0.8,
      r:     Math.random() * 2.5 + 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.015,
      color: ['#ffd750','#ffd750','#3ecf8e','#5b8dee','rgba(248,113,113,1)'][Math.floor(Math.random()*5)],
      label: ['US','EU','APAC','RU','CN','IN','BR','AU'][Math.floor(Math.random()*8)],
    }));

    /* ── Threat arcs between nodes ── */
    const arcs = [];
    let arcTimer = 0;

    const spawnArc = () => {
      const a = Math.floor(Math.random() * NODE_COUNT);
      let b = Math.floor(Math.random() * NODE_COUNT);
      while (b === a) b = Math.floor(Math.random() * NODE_COUNT);
      arcs.push({
        a, b,
        t: 0,
        speed: Math.random() * 0.008 + 0.004,
        threat: Math.random() < 0.3,   // 30% = red threat arc
        trail: [],
      });
    };
    // seed initial arcs
    for (let i = 0; i < 4; i++) spawnArc();

    /* ── Scrolling log lines ── */
    const LOG_POOL = [
      'DECRYPT_ATTEMPT >> SHA-256 verified',
      'VAULT_ACCESS >> key_fragment[2] matched',
      'AUTH_TOKEN >> HMAC-SHA512 valid',
      'SHAMIR_SHARE >> threshold 2/3 achieved',
      'INTEGRITY_CHECK >> merkle root OK',
      'SESSION_KEYS >> AES-256-GCM active',
      'ANOMALY_SCAN >> no threats detected',
      'AUDIT_LOG >> entry signed & sealed',
    ];
    const logs = Array.from({ length: 6 }, (_, i) => ({
      text:  LOG_POOL[i % LOG_POOL.length],
      x:     Math.random() * 0.6,
      alpha: Math.random() * 0.07 + 0.03,
      speed: Math.random() * 0.12 + 0.06,
    }));
    let logOffset = 0;

    /* ── Diagonal scan sweep ── */
    let sweepX = -200;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      /* ── Dot matrix background grid ── */
      ctx.fillStyle = 'rgba(255,215,80,0.04)';
      const gs = 32;
      for (let x = gs; x < w; x += gs)
        for (let y = gs; y < h; y += gs) {
          ctx.beginPath(); ctx.arc(x, y, 0.65, 0, Math.PI*2); ctx.fill();
        }

      /* ── Diagonal sweep line ── */
      sweepX += 1.2;
      if (sweepX > w + 200) sweepX = -200;
      const swGrad = ctx.createLinearGradient(sweepX-80, 0, sweepX+80, 0);
      swGrad.addColorStop(0,   'rgba(255,215,80,0)');
      swGrad.addColorStop(0.5, 'rgba(255,215,80,0.04)');
      swGrad.addColorStop(1,   'rgba(255,215,80,0)');
      ctx.fillStyle = swGrad;
      ctx.fillRect(sweepX-80, 0, 160, h);
      ctx.strokeStyle = 'rgba(255,215,80,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sweepX, 0); ctx.lineTo(sweepX, h); ctx.stroke();

      /* ── Threat arcs ── */
      arcTimer++;
      if (arcTimer % 140 === 0 && arcs.length < 10) spawnArc();

      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        const na  = alertNodes[arc.a], nb = alertNodes[arc.b];
        const ax  = na.x * w, ay = na.y * h;
        const bx  = nb.x * w, by = nb.y * h;

        // Bezier control point (arc upward)
        const cpx = (ax + bx) / 2;
        const cpy = Math.min(ay, by) - Math.abs(bx - ax) * 0.35;

        arc.t += arc.speed;
        const t = Math.min(arc.t, 1);

        // Record trail
        const px = (1-t)**2*ax + 2*(1-t)*t*cpx + t**2*bx;
        const py = (1-t)**2*ay + 2*(1-t)*t*cpy + t**2*by;
        arc.trail.push({ x: px, y: py });
        if (arc.trail.length > 32) arc.trail.shift();

        // Draw trail
        if (arc.trail.length > 1) {
          for (let j = 1; j < arc.trail.length; j++) {
            const frac  = j / arc.trail.length;
            const color = arc.threat ? `rgba(248,113,113,${frac*0.55})` : `rgba(255,215,80,${frac*0.35})`;
            ctx.strokeStyle = color;
            ctx.lineWidth   = arc.threat ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(arc.trail[j-1].x, arc.trail[j-1].y);
            ctx.lineTo(arc.trail[j].x, arc.trail[j].y);
            ctx.stroke();
          }
        }

        // Head dot
        ctx.beginPath(); ctx.arc(px, py, arc.threat ? 2.5 : 1.8, 0, Math.PI*2);
        ctx.fillStyle = arc.threat ? 'rgba(248,113,113,0.9)' : 'rgba(255,215,80,0.8)';
        ctx.fill();

        if (arc.t >= 1) arcs.splice(i, 1);
      }

      /* ── Alert nodes ── */
      alertNodes.forEach(n => {
        const nx = n.x * w, ny = n.y * h;
        n.phase += n.speed;
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;

        // Outer pulse ring
        ctx.beginPath(); ctx.arc(nx, ny, n.r + 4 + pulse * 6, 0, Math.PI*2);
        ctx.strokeStyle = n.color.replace('1)', `${0.08 + pulse * 0.12})`).replace('#', 'rgba(').replace('rgba(ffd750)', 'rgba(255,215,80,').replace('rgba(3ecf8e)', 'rgba(62,207,142,').replace('rgba(5b8dee)', 'rgba(91,141,238,');
        // simplified — just use string directly
        const ringAlpha = 0.08 + pulse * 0.12;
        ctx.strokeStyle = n.color === '#ffd750'
          ? `rgba(255,215,80,${ringAlpha})`
          : n.color === '#3ecf8e'
            ? `rgba(62,207,142,${ringAlpha})`
            : n.color === '#5b8dee'
              ? `rgba(91,141,238,${ringAlpha})`
              : `rgba(248,113,113,${ringAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Core dot
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI*2);
        ctx.fillStyle = n.color === '#ffd750' ? 'rgba(255,215,80,0.7)'
          : n.color === '#3ecf8e' ? 'rgba(62,207,142,0.7)'
          : n.color === '#5b8dee' ? 'rgba(91,141,238,0.7)'
          : 'rgba(248,113,113,0.7)';
        ctx.fill();

        // Region label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,215,80,0.25)';
        ctx.fillText(n.label, nx + n.r + 3, ny + 3);
      });

      /* ── Scrolling log lines at bottom ── */
      logOffset += 0.07;
      ctx.font = '9px "JetBrains Mono", monospace';
      logs.forEach((log, i) => {
        const y = h - 14 - i * 16 + (logOffset % 16);
        if (y < h - 120 || y > h) return;
        const a = Math.min(log.alpha, ((h - y) / 80) * log.alpha);
        ctx.fillStyle = `rgba(90,210,190,${a})`;
        ctx.fillText('> ' + log.text, log.x * w * 0.6, y);
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
