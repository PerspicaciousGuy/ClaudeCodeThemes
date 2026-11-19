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

// A vertical gradient from a list of [offset, color, opacity?] stops.
function vgrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')}</linearGradient>`
}

function rgrad(id, color, inner = 0.7) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${inner}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`
}

const r1 = n => Math.round(n * 10) / 10


// A bat: body and two wings, nose to the right, about 60 wide at scale 1.
function bat(s) {
  return `<g transform="scale(${s})"><g class="bw"><path d="M-6 0 Q-22 -16 -38 -6 Q-30 -2 -26 6 Q-18 -2 -10 4 Z" fill="#0a0613"/><path d="M6 0 Q22 -16 38 -6 Q30 -2 26 6 Q18 -2 10 4 Z" fill="#0a0613"/></g><ellipse cx="0" cy="2" rx="8" ry="6" fill="#0a0613"/><path d="M-4 -3 L-5 -9 L-1 -4 Z M4 -3 L5 -9 L1 -4 Z" fill="#0a0613"/></g>`
}

// A ghost with a wavy hem, about 90 tall at scale 1. Origin at its middle.
function ghost(x, y, s, d, l) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="gh" style="--d:${d}s;--l:${l}s"><path d="M-34 40 L-34 -14 Q-34 -50 0 -50 Q34 -50 34 -14 L34 40 Q26 30 17 40 Q8 30 0 40 Q-9 30 -17 40 Q-26 30 -34 40 Z" fill="#cfe9dc" fill-opacity=".34"/><path d="M-34 40 L-34 -14 Q-34 -50 0 -50 Q34 -50 34 -14 L34 40 Q26 30 17 40 Q8 30 0 40 Q-9 30 -17 40 Q-26 30 -34 40 Z" fill="none" stroke="#e6fff0" stroke-opacity=".5" stroke-width="2"/><ellipse cx="-12" cy="-14" rx="5" ry="8" fill="#10261c" fill-opacity=".75"/><ellipse cx="12" cy="-14" rx="5" ry="8" fill="#10261c" fill-opacity=".75"/><ellipse cx="0" cy="6" rx="6" ry="9" fill="#10261c" fill-opacity=".6"/></g></g>`
}

// A tombstone: kind 0 rounded, 1 cross, 2 slab with a chipped corner.
function stone(x, y, s, kind, tilt) {
  const body =
    kind === 1
      ? '<path d="M-6 0 L-6 -58 L-24 -58 L-24 -72 L-6 -72 L-6 -92 L8 -92 L8 -72 L26 -72 L26 -58 L8 -58 L8 0 Z"/>'
      : kind === 2
        ? '<path d="M-28 0 L-28 -62 L12 -62 L28 -46 L28 0 Z"/><path d="M-16 -44 H12 M-16 -32 H16" stroke="#05030a" stroke-opacity=".4" stroke-width="3" fill="none"/>'
        : '<path d="M-28 0 L-28 -50 Q-28 -82 0 -82 Q28 -82 28 -50 L28 0 Z"/><path d="M-12 -52 H12 M-12 -40 H12" stroke="#05030a" stroke-opacity=".4" stroke-width="3" fill="none"/>'

  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})" fill="#262042">${body}<path d="M-28 0 H28" stroke="#3a3260" stroke-width="3"/></g>`
}

export function buildScene() {
  const defs =
    vgrad('sky', [[0, '#06030d'], [0.45, '#170f2e'], [0.8, '#2e2450'], [1, '#42503f']]) +
    rgrad('halo', '#d7e8c2', 0.4) +
    rgrad('lamp', '#9dff8a', 0.55) +
    rgrad('pump', '#ff8a1f', 0.5) +
    rgrad('wisp', '#a6ffc2', 0.6) +
    vgrad('fogg', [[0, '#9cb8a8', 0], [0.5, '#9cb8a8', 0.2], [1, '#9cb8a8', 0]])

  const css = `
.fog{animation:fog var(--d,60s) ease-in-out infinite alternate}
.gh{animation:gh var(--d,7s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.bw{animation:bw .5s ease-in-out infinite alternate;transform-origin:0 0}
.fly{animation:fly var(--d,26s) linear infinite;animation-delay:var(--l,0s)}
.swing{animation:swing 5s ease-in-out infinite alternate;transform-origin:0 0}
.pul{animation:pul 3.2s ease-in-out infinite alternate}
.win{animation:win 4.4s steps(1) infinite}
.blink{animation:blink 6s steps(1) infinite}
.wi{animation:wi var(--d,9s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cl{animation:cl var(--d,120s) ease-in-out infinite alternate}
@keyframes fog{from{transform:translateX(-90px)}to{transform:translateX(110px)}}
@keyframes gh{from{transform:translate(-14px,10px)}to{transform:translate(16px,-14px)}}
@keyframes bw{from{transform:scaleY(1)}to{transform:scaleY(.25)}}
@keyframes fly{from{transform:translateX(-120px)}to{transform:translateX(1760px)}}
@keyframes swing{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@keyframes pul{from{opacity:.55}to{opacity:1}}
@keyframes win{0%,100%{opacity:1}12%{opacity:.35}18%{opacity:1}60%{opacity:.7}66%{opacity:1}}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes wi{from{transform:translate(-20px,8px)}to{transform:translate(24px,-18px)}}
@keyframes cl{from{transform:translateX(-80px)}to{transform:translateX(120px)}}
@media (prefers-reduced-motion:reduce){.fog,.gh,.bw,.fly,.swing,.pul,.win,.blink,.wi,.cl{animation:none}}
`

  const rnd = rng(31)
  let stars = ''

  for (let i = 0; i < 70; i++) {
    stars += `<circle cx="${r1(rnd() * W)}" cy="${r1(rnd() * 420)}" r="${rnd() > 0.85 ? 1.6 : 0.9}" fill="#efeaff" fill-opacity="${r1(0.35 + rnd() * 0.5)}"/>`
  }

  const cloud = (x, y, s, d) => `<g class="cl" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})" fill="#241a40" fill-opacity=".7"><ellipse rx="170" ry="20"/><ellipse cx="-70" cy="-12" rx="90" ry="20"/><ellipse cx="60" cy="-16" rx="100" ry="22"/></g></g>`

  // The dead tree: a trunk with crooked branches, on the left, with a lantern and an owl.
  const tree = `<g fill="none" stroke="#0a0613" stroke-linecap="round" stroke-linejoin="round"><path d="M180 760 C176 640 196 560 168 470 C150 410 160 350 190 290" stroke-width="30"/><path d="M178 520 C230 500 270 470 300 420 C316 392 330 380 352 372" stroke-width="16"/><path d="M168 470 C130 440 96 430 60 380" stroke-width="14"/><path d="M190 300 C222 270 250 262 278 232" stroke-width="12"/><path d="M190 296 C170 260 150 246 148 206" stroke-width="10"/><path d="M300 420 C318 438 334 442 352 436" stroke-width="8"/><path d="M60 380 C40 372 24 372 6 356" stroke-width="8"/><path d="M278 232 C292 214 308 206 330 204" stroke-width="7"/></g>`
  const lantern = `<g transform="translate(336 392)"><g class="swing"><path d="M0 0 V34" stroke="#0a0613" stroke-width="3"/><g class="pul"><circle cx="0" cy="56" r="60" fill="url(#lamp)"/></g><rect x="-11" y="34" width="22" height="30" rx="4" fill="#9dff8a" fill-opacity=".85"/><rect x="-13" y="30" width="26" height="6" fill="#0a0613"/><rect x="-13" y="62" width="26" height="6" fill="#0a0613"/></g></g>`
  const owl = `<g transform="translate(300 424)"><ellipse cx="0" cy="-12" rx="16" ry="22" fill="#0a0613"/><g class="blink" style="transform-origin:0 -18px"><circle cx="-6" cy="-18" r="5" fill="#ffd24a"/><circle cx="6" cy="-18" r="5" fill="#ffd24a"/></g><path d="M-11 -32 L-8 -42 L-3 -33 Z M11 -32 L8 -42 L3 -33 Z" fill="#0a0613"/></g>`

  // A far crooked house with a flickering window.
  const house = `<g transform="translate(1180 640)"><path d="M-80 0 V-90 L-60 -150 L-40 -90 H20 L40 -170 L62 -90 H84 V0 Z" fill="#120b22"/><path d="M-50 -150 L-60 -190 L-48 -150 Z" fill="#120b22"/><g class="win"><rect x="-34" y="-62" width="16" height="22" fill="#ffd27a"/><rect x="30" y="-58" width="14" height="20" fill="#ffd27a" fill-opacity=".8"/></g></g>`

  let stones = ''
  const spots = [[420, 790, 1.1, 0, -4], [520, 810, 0.9, 2, 5], [640, 800, 1.15, 1, -2], [1000, 800, 1, 0, 4], [1120, 822, 1.2, 2, -3], [1250, 800, 1, 1, 3], [1400, 812, 1.1, 0, -5], [880, 830, 0.8, 1, 6]]

  for (const [x, y, s, k, t] of spots) stones += stone(x, y, s, k, t)

  const wisps = [[560, 640, 7, 0], [720, 700, 11, -3], [980, 660, 8, -5], [1300, 720, 10, -2], [300, 780, 9, -6]]
    .map(([x, y, d, l]) => `<g transform="translate(${x} ${y})"><g class="wi" style="--d:${d}s;--l:${l}s"><circle r="22" fill="url(#wisp)"/><circle r="3" fill="#e8fff0"/></g></g>`)
    .join('')

  const pumpkin = `<g transform="translate(1480 842)"><g class="pul"><circle cx="0" cy="-26" r="70" fill="url(#pump)"/></g><ellipse cx="0" cy="-26" rx="40" ry="32" fill="#e8741a"/><ellipse cx="-18" cy="-26" rx="22" ry="30" fill="#f08a2a"/><ellipse cx="18" cy="-26" rx="22" ry="30" fill="#f08a2a"/><path d="M-2 -58 Q0 -72 8 -70" stroke="#3b5a22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-20 -34 L-10 -42 L-8 -30 Z M20 -34 L10 -42 L8 -30 Z M-16 -14 L-8 -20 L0 -14 L8 -20 L16 -14 L8 -6 L0 -12 L-8 -6 Z" fill="#fff0a0"/></g>`

  const fence = `<g stroke="#0a0613" stroke-width="4" fill="none">${Array.from({ length: 22 }, (_, i) => `<path d="M${40 + i * 70} 860 V800 L${44 + i * 70} 790 L${48 + i * 70} 800 V860"/>`).join('')}<path d="M40 822 H1580"/></g>`

  const body =
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
    stars +
    `<circle cx="660" cy="190" r="230" fill="url(#halo)"/><circle cx="660" cy="190" r="82" fill="#e9f0d2"/><ellipse cx="636" cy="170" rx="16" ry="12" fill="#cfd8b4" fill-opacity=".6"/><ellipse cx="684" cy="212" rx="20" ry="14" fill="#cfd8b4" fill-opacity=".55"/>` +
    cloud(420, 150, 1, 130) + cloud(1020, 100, 0.9, 150) + cloud(1400, 250, 1.1, 120) +
    `<g class="fly" style="--d:30s;--l:-8s"><g transform="translate(0 220)">${bat(0.9)}</g></g>` +
    `<g class="fly" style="--d:38s;--l:-22s"><g transform="translate(0 150)">${bat(0.7)}</g></g>` +
    `<g class="fly" style="--d:26s;--l:-3s"><g transform="translate(0 290)">${bat(0.6)}</g></g>` +
    `<path d="M0 690 Q300 640 560 690 Q860 740 1160 660 Q1400 610 1600 660 V900 H0 Z" fill="#0f0a1d"/>` +
    house +
    `<path d="M0 760 Q260 720 520 770 Q840 830 1180 750 Q1420 700 1600 760 V900 H0 Z" fill="#0b0716"/>` +
    tree + owl + lantern +
    `<ellipse cx="800" cy="720" rx="800" ry="46" fill="url(#fogg)" class="fog"/>` +
    stones + fence +
    ghost(760, 560, 1.1, 8, 0) + ghost(1280, 500, 0.85, 10, -4) + ghost(470, 650, 0.7, 7, -2) +
    wisps + pumpkin +
    `<ellipse cx="800" cy="840" rx="900" ry="40" fill="url(#fogg)" class="fog" style="--d:80s"/>`

  return svg(defs, css, body)
}
