// Campfire: a night camp whose fire follows how much of your 5-hour window is
// left, and whose woodpile follows how much of the context window is left.
// Fire level 5 is a roaring fire; level 0 is a bed of embers. While Claude is
// working the sparks rise faster. Pure SVG + CSS: no script, nothing loaded.

const W = 1600
const H = 900
const FX = 1180
const FY = 790

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const CSS = `
.fl{transform-box:fill-box;transform-origin:50% 100%;animation:fl var(--d,1s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.halo{animation:halo 2.4s ease-in-out infinite alternate}
.ember{animation:ember var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.spark{animation:spark var(--d,4s) ease-out infinite;animation-delay:var(--l,0s)}
.tw{animation:ember var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.smoke{animation:smoke var(--d,9s) ease-out infinite;animation-delay:var(--l,0s)}
.steam{animation:smoke var(--d,4s) ease-out infinite;animation-delay:var(--l,0s)}
.blink{animation:blink 7s steps(1) infinite;animation-delay:var(--l,0s)}
.ff{animation:ff var(--d,12s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.glow{animation:ember var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes fl{0%{transform:scale(1,1) skewX(0deg)}50%{transform:scale(.94,1.08) skewX(2deg)}100%{transform:scale(1.04,.95) skewX(-2deg)}}
@keyframes halo{from{opacity:.78}to{opacity:1}}
@keyframes ember{from{opacity:.4}to{opacity:1}}
@keyframes spark{0%{transform:translate(0,0);opacity:0}8%{opacity:1}100%{transform:translate(var(--dx,20px),var(--rise,-300px));opacity:0}}
@keyframes smoke{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:.5}100%{transform:translate(var(--dx,40px),var(--rise,-380px)) scale(1.6);opacity:0}}
@keyframes blink{0%,92%{opacity:1}94%,97%{opacity:0}100%{opacity:1}}
@keyframes ff{0%{transform:translate(0,0)}50%{transform:translate(var(--x1,30px),var(--y1,-20px))}100%{transform:translate(var(--x2,-20px),var(--y2,-40px))}}
@media (prefers-reduced-motion:reduce){.fl,.halo,.ember,.spark,.tw,.smoke,.steam,.blink,.ff,.glow{animation:none}}
`

const FLAME = 'M0 0 C -70 0 -84 -90 -30 -150 C -34 -104 -6 -92 0 -210 C 26 -136 74 -104 62 -52 C 56 -14 30 0 0 0 Z'

// Flame size, spark count and glow for each fire level, 0 (embers) to 5 (roaring).
const SIZE = [0, 0.32, 0.55, 0.78, 0.98, 1.22]
const SPARKS = [5, 7, 11, 16, 22, 30]

// How much of the camp the fire lights: 0 to 1.
const LIT = [0.1, 0.3, 0.5, 0.7, 0.85, 1]

// A conifer: a trunk and stacked boughs.
function tree(x, base, h, c) {
  let t = `<rect x="${x - 8}" y="${base - 30}" width="16" height="40" fill="${c}"/>`

  for (let i = 0; i < 5; i++) {
    const w = h * (0.34 - i * 0.05)
    const y = base - 24 - i * h * 0.19

    t += `<polygon points="${x - w},${y} ${x},${(y - h * 0.3).toFixed(0)} ${x + w},${y}" fill="${c}"/>`
  }

  return t
}

// A log seen from the side, with its pale end.
function log(x, y, w, r, c) {
  return `<g transform="translate(${x} ${y})"><rect x="0" y="${-r}" width="${w}" height="${r * 2}" rx="${r * 0.5}" fill="${c}"/><ellipse cx="${w}" cy="0" rx="${r * 0.55}" ry="${r}" fill="#8a6a44"/><ellipse cx="${w}" cy="0" rx="${r * 0.28}" ry="${r * 0.5}" fill="#6a4a2a"/></g>`
}

/**
 * @param {number} level the fire, 0 to 5
 * @param {boolean} busy sparks rise faster while Claude is working
 * @param {number} wood the woodpile, 0 to 6 logs: the context window that is left
 */
export function buildLive(level, busy, wood = 6) {
  const rand = rng(11)
  const lv = Math.max(0, Math.min(5, Math.round(level)))
  const logs = Math.max(0, Math.min(6, Math.round(wood)))
  const s = SIZE[lv]
  const lit = LIT[lv]
  let out = ''

  out += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04070f"/><stop offset=".7" stop-color="#0c1428"/><stop offset="1" stop-color="#1a1a2a"/></linearGradient>`
  out += `<radialGradient id="halo"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".75"/><stop offset=".5" stop-color="#ff6a1a" stop-opacity=".25"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="eg"><stop offset="0" stop-color="#ff7a2a" stop-opacity=".9"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="moon"><stop offset="0" stop-color="#e8eeff" stop-opacity=".5"/><stop offset="1" stop-color="#e8eeff" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="ffg"><stop offset="0" stop-color="#f4ff9a" stop-opacity=".9"/><stop offset="1" stop-color="#f4ff9a" stop-opacity="0"/></radialGradient>`
  out += `<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a18"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient></defs>`
  out += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Stars.
  for (let g = 0; g < 5; g++) {
    let st = ''

    for (let i = 0; i < 16; i++) {
      st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 520)}" r="${(0.7 + rand() * 1.3).toFixed(1)}" fill="#eef0ff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
    }
    out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s">${st}</g>`
  }

  // A crescent moon, high on the left, and far mountains.
  out += `<circle cx="470" cy="190" r="120" fill="url(#moon)"/><path d="M470 156 A 34 34 0 1 0 470 224 A 22 34 0 1 1 470 156 Z" fill="#eef2ff"/>`
  out += `<path d="M0 700 L120 640 L240 690 L380 610 L520 680 L640 630 L780 690 L930 620 L1080 680 L1240 636 L1400 690 L1520 644 L1600 676 L1600 780 L0 780 Z" fill="#0b1224"/>`

  // Trees: far ones at the sides, and one behind the fire.
  for (const [x, b, h] of [[90, 760, 420], [260, 780, 300], [440, 770, 220], [1420, 770, 440], [1560, 790, 320], [1000, 770, 200]]) {
    out += tree(x, b, h, '#08110f')
  }

  // Ground.
  out += `<path d="M0 900 L0 760 C 300 735 600 775 900 756 C 1200 740 1450 770 1600 750 L1600 900 Z" fill="url(#gr)"/>`

  // A tent, its doorway lit from the fire.
  out += `<g transform="translate(560 786)"><polygon points="-190,0 0,-190 190,0" fill="#141f30"/><polygon points="0,-190 190,0 70,0" fill="#0f1826"/><polygon points="-60,0 0,-110 60,0" fill="#05080e"/><g class="glow" style="--d:2.8s"><polygon points="-60,0 0,-110 60,0" fill="#ff9a3a" fill-opacity="${(0.12 + lit * 0.4).toFixed(2)}"/></g><line x1="0" y1="-190" x2="0" y2="-110" stroke="#0a111c" stroke-width="3"/><line x1="-190" y1="0" x2="-230" y2="22" stroke="#2a2a2a" stroke-width="2"/><line x1="190" y1="0" x2="230" y2="22" stroke="#2a2a2a" stroke-width="2"/></g>`

  // Grass tufts on the ground.
  for (let i = 0; i < 26; i++) {
    const x = Math.round(rand() * W)
    const y = 800 + Math.round(rand() * 90)

    out += `<path d="M${x} ${y} l -4 -16 M${x} ${y} l 1 -20 M${x} ${y} l 5 -14" stroke="#0c1c14" stroke-width="2" stroke-linecap="round" fill="none"/>`
  }

  // The woodpile: a log for each sixth of the context window left, stacked from the bottom.
  const rows = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1], [1, 2]]

  for (let i = 0; i < logs; i++) {
    const [cx, ry] = rows[i]

    out += log(850 + cx * 58, 838 - ry * 24, 46, 12, i % 2 ? '#3a2616' : '#2e1c10')
  }

  // The glow thrown on the ground, bigger as the fire grows.
  const glow = lv === 0 ? 150 : 220 + s * 380

  out += `<g class="halo"><circle cx="${FX}" cy="${FY - 60}" r="${glow.toFixed(0)}" fill="url(#halo)"/></g>`

  // Logs and the stone ring.
  out += `<g transform="translate(${FX} ${FY})"><rect x="-120" y="-12" width="240" height="26" rx="12" fill="#2a1a10" transform="rotate(-12)"/><rect x="-120" y="-12" width="240" height="26" rx="12" fill="#321e12" transform="rotate(12)"/>`
  out += `<g class="ember" style="--d:2.6s"><ellipse cx="0" cy="6" rx="${(60 + s * 40).toFixed(0)}" ry="${(14 + s * 6).toFixed(0)}" fill="url(#eg)"/></g>`
  for (let i = 0; i < 11; i++) {
    const a = Math.PI + (i / 10) * Math.PI

    out += `<ellipse cx="${(Math.cos(a) * 150).toFixed(0)}" cy="${(24 - Math.sin(a) * 26).toFixed(0)}" rx="26" ry="16" fill="${i % 2 ? '#3a3834' : '#4a4640'}"/>`
  }
  out += `</g>`

  // A cooking pot on a tripod to the right, with a thread of steam.
  out += `<g transform="translate(${FX + 215} ${FY + 28})"><line x1="-34" y1="0" x2="0" y2="-130" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><line x1="34" y1="0" x2="0" y2="-130" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="2" x2="0" y2="-130" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="-130" x2="0" y2="-82" stroke="#2a2a2a" stroke-width="2"/><path d="M-30 -82 H30 L24 -44 Q 0 -36 -24 -44 Z" fill="#1c1c20"/><rect x="-32" y="-86" width="64" height="8" rx="3" fill="#2c2c32"/><ellipse cx="-30" cy="-60" rx="4" ry="9" fill="#ffb060" fill-opacity="${(0.1 + lit * 0.5).toFixed(2)}"/>`
  if (lv > 0) {
    out += `<path class="steam" style="--d:3.4s;--dx:18px;--rise:-90px" d="M0 -90 q -6 -14 0 -28 q 6 -14 0 -28" stroke="#c8d0e0" stroke-width="3" fill="none" stroke-linecap="round"/><path class="steam" style="--d:4.2s;--l:-1.6s;--dx:-14px;--rise:-90px" d="M8 -90 q -6 -14 0 -28 q 6 -14 0 -28" stroke="#c8d0e0" stroke-width="3" fill="none" stroke-linecap="round"/>`
  }
  out += `</g>`

  // The flames: four nested layers, none at level 0.
  if (lv > 0) {
    for (const [k, c] of [[1, '#e8401a'], [0.76, '#ff8a1e'], [0.52, '#ffcf4a'], [0.3, '#fff2c0']]) {
      out += `<g transform="translate(${FX} ${FY}) scale(${(s * k).toFixed(3)})"><path class="fl" style="--d:${(0.7 + k * 0.5).toFixed(2)}s;--l:${(-k).toFixed(2)}s" d="${FLAME}" fill="${c}"/></g>`
    }
  }

  // Sparks: more and faster when Claude is working.
  const n = SPARKS[lv]
  const speed = busy ? 0.55 : 1

  for (let i = 0; i < n; i++) {
    const x = FX + Math.round((rand() - 0.5) * 120 * Math.max(s, 0.4))
    const rise = -(180 + rand() * 320) * (lv === 0 ? 0.4 : 0.6 + s * 0.5)

    out += `<circle class="spark" cx="${x}" cy="${FY - 40}" r="${(1.6 + rand() * 2.4).toFixed(1)}" fill="${i % 3 ? '#ffb040' : '#ffe080'}" style="--d:${((3 + rand() * 3.5) * speed).toFixed(1)}s;--l:${(-rand() * 6).toFixed(1)}s;--dx:${Math.round((rand() - 0.5) * 140)}px;--rise:${rise.toFixed(0)}px"/>`
  }

  // Smoke drifting up and away from a living fire.
  if (lv > 0) {
    for (let i = 0; i < 4; i++) {
      out += `<ellipse class="smoke" cx="${FX + Math.round((rand() - 0.5) * 40)}" cy="${(FY - 120 - s * 80).toFixed(0)}" rx="${(24 + rand() * 24).toFixed(0)}" ry="${(16 + rand() * 12).toFixed(0)}" fill="#8a90a0" fill-opacity=".22" style="--d:${(9 + rand() * 5).toFixed(1)}s;--l:${(-i * 3).toFixed(1)}s;--dx:${Math.round(40 + rand() * 90)}px;--rise:${-Math.round(320 + rand() * 160)}px"/>`
    }
  }

  // Fireflies drifting low over the grass, more when the fire is bright.
  const flies = lv >= 3 ? 7 : 3

  for (let i = 0; i < flies; i++) {
    const x = 120 + Math.round(rand() * 800)
    const y = 700 + Math.round(rand() * 160)

    out += `<g class="ff" style="--d:${(9 + rand() * 6).toFixed(1)}s;--l:${(-rand() * 8).toFixed(1)}s;--x1:${Math.round((rand() - 0.5) * 80)}px;--y1:${Math.round((rand() - 0.5) * 50)}px;--x2:${Math.round((rand() - 0.5) * 80)}px;--y2:${Math.round((rand() - 0.5) * 50)}px"><g class="glow" style="--d:${(1.6 + rand() * 2).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="14" fill="url(#ffg)"/><circle cx="${x}" cy="${y}" r="2.2" fill="#fcffd0"/></g></g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}

// The still picture the gallery and the previews use: a full fire and a full woodpile.
export function buildScene() {
  return buildLive(5, false, 6)
}
