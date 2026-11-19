// Ukiyo-e Wave: an original scene in the manner of a Japanese woodblock print.
// A great wave curls over a pattern of scale-like swells under a pale sky, a red
// sun and a small snow-capped mountain, with little boats riding the swells and
// foam flicking off the crest.
// Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

const W = 1600
const H = 900

function rng(seed) {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

function svg(defs, css, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${css}</style>${body}</svg>`
}

// A vertical gradient from a list of [offset, color] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const CSS = `
.swell{animation:swell var(--d,9s) linear infinite}
.crest{animation:crest 7s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.foam{animation:foam var(--d,5s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.boat{animation:boat 8s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.cloud{animation:cloud var(--d,120s) ease-in-out infinite alternate}
.bird{animation:bird var(--d,70s) linear infinite;animation-delay:var(--l,0s)}
@keyframes swell{from{transform:translateX(0)}to{transform:translateX(80px)}}
@keyframes crest{from{transform:rotate(-1.2deg)}to{transform:rotate(1.4deg)}}
@keyframes foam{from{transform:translateY(0)}to{transform:translateY(-12px)}}
@keyframes boat{from{transform:rotate(-3deg) translateY(0)}to{transform:rotate(3deg) translateY(-6px)}}
@keyframes cloud{from{transform:translateX(-100px)}to{transform:translateX(120px)}}
@keyframes bird{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@media (prefers-reduced-motion:reduce){.swell,.crest,.foam,.boat,.cloud,.bird{animation:none}}
`

export function buildScene() {
  const rand = rng(5)
  const defs =
    vgrad('sky', [[0, '#e9dcc0'], [0.55, '#efe4c8'], [1, '#d9cfae']]) +
    vgrad('sea', [[0, '#2c5f93'], [1, '#14315a']]) +
    // Scale swells: three rings of arcs, repeating.
    `<pattern id="sg" width="80" height="40" patternUnits="userSpaceOnUse"><g fill="none" stroke="#e8f0f8" stroke-width="3"><circle cx="0" cy="40" r="38"/><circle cx="0" cy="40" r="26"/><circle cx="0" cy="40" r="14"/><circle cx="80" cy="40" r="38"/><circle cx="80" cy="40" r="26"/><circle cx="80" cy="40" r="14"/><circle cx="40" cy="20" r="38"/><circle cx="40" cy="20" r="26"/><circle cx="40" cy="20" r="14"/></g></pattern>`

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // Bands of paper-colored cloud and a red sun.
  out += `<g class="cloud"><g fill="#dcc79a"><rect x="900" y="110" width="520" height="14" rx="7"/><rect x="1020" y="150" width="440" height="12" rx="6"/><rect x="200" y="230" width="360" height="12" rx="6"/></g></g>`
  out += `<circle cx="1280" cy="230" r="74" fill="#c8362a"/>`

  // A small mountain on the horizon, white capped.
  out += `<polygon points="1000,520 1180,330 1360,520" fill="#3a5a86"/><polygon points="1124,384 1180,330 1236,384 1210,400 1180,382 1150,402" fill="#f4efe2"/>`

  // The far sea: bands of swell.
  out += `<rect x="0" y="500" width="${W}" height="400" fill="url(#sea)"/>`
  out += `<g class="swell" style="--d:12s"><rect x="-80" y="520" width="${W + 160}" height="380" fill="url(#sg)" opacity=".5"/></g>`

  // Boats on the swells.
  for (const [x, y, s] of [[760, 610, 1], [1060, 660, 0.8], [520, 700, 0.7]]) {
    out += `<g class="boat" style="animation-delay:${(-rand() * 6).toFixed(1)}s"><g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 Q 0 34 80 -4 L74 -12 L-62 -10 Z" fill="#2a2018"/><path d="M-4 -12 L-4 -70 L50 -16 Z" fill="#efe4c8"/><line x1="-4" y1="-12" x2="-4" y2="-76" stroke="#2a2018" stroke-width="3"/></g></g>`
  }

  // The great wave: a body, a curling crest and claw-like foam fingers.
  let wave = `<path d="M-60 900 L-60 520 C 30 420 170 330 330 316 C 470 304 560 360 590 450 C 540 410 470 400 410 430 C 350 460 330 520 360 580 C 300 560 250 590 240 650 C 300 640 330 690 300 740 C 220 700 120 720 60 780 C 30 810 -10 830 -60 840 Z" fill="#1f4a7e"/>`

  wave += `<path d="M-60 900 L-60 700 C 80 640 220 700 300 760 C 360 800 440 790 520 760 L700 900 Z" fill="#173a66"/>`
  wave += `<path d="M590 450 C 640 470 690 520 700 590 C 660 560 620 560 590 580 C 604 540 604 496 590 450 Z" fill="#f4efe2"/>`

  // Foam fingers along the crest.
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    const x = 250 + t * 360
    const y = 330 + Math.sin(t * Math.PI) * -18 + t * 120

    wave += `<g class="foam" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 4).toFixed(1)}s"><path d="M${x.toFixed(0)} ${y.toFixed(0)} q ${(10 + rand() * 14).toFixed(0)} ${(-14 - rand() * 16).toFixed(0)} ${(24 + rand() * 12).toFixed(0)} ${(8 + rand() * 18).toFixed(0)} q -8 ${(12 + rand() * 8).toFixed(0)} -18 ${(6 + rand() * 6).toFixed(0)} q -4 -10 -6 -14 Z" fill="#f4efe2"/></g>`
  }
  for (let i = 0; i < 40; i++) {
    wave += `<circle class="foam" cx="${(280 + rand() * 420).toFixed(0)}" cy="${(300 + rand() * 280).toFixed(0)}" r="${(2 + rand() * 4).toFixed(1)}" fill="#f4efe2" style="--d:${(2 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"/>`
  }
  out += `<g class="crest">${wave}</g>`

  // Dark lines in the water of the wave: contour strokes.
  for (let i = 0; i < 10; i++) {
    const y = 560 + i * 34

    out += `<path d="M${(-20 + rand() * 40).toFixed(0)} ${y} q 90 -22 190 0" fill="none" stroke="#e8f0f8" stroke-width="2" opacity=".35"/>`
  }

  // The near sea at the right and a few birds.
  out += `<path d="M700 900 L700 780 C 900 740 1100 800 1300 760 C 1450 730 1540 770 1600 750 L1600 900 Z" fill="#102b50"/><g class="swell" style="--d:9s"><rect x="680" y="790" width="1000" height="110" fill="url(#sg)" opacity=".35"/></g>`
  for (let i = 0; i < 3; i++) {
    out += `<g class="bird" style="--d:${(60 + rand() * 30).toFixed(0)}s;--l:${(-rand() * 60).toFixed(0)}s"><path d="M0 ${150 + i * 38} q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke="#2a2018" stroke-width="3" stroke-linecap="round"/></g>`
  }

  return svg(defs, CSS, out)
}
