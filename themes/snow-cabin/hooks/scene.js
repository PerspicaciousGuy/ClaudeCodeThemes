// Snow Cabin: an original winter night. A log cabin with a lit window, smoke
// from the chimney, snowy pines and snow falling in three layers.
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

function hills(base, amp, seed, fill) {
  const r = rng(seed)
  const p1 = r() * 6.28
  const p2 = r() * 6.28
  let d = `M-10 ${H}`

  for (let x = -10; x <= W + 10; x += 16) {
    d += ` L${x} ${(base - amp * (0.6 * Math.sin(x / 190 + p1) + 0.4 * Math.sin(x / 83 + p2))).toFixed(0)}`
  }

  return `<path d="${d} L${W + 10} ${H} Z" fill="${fill}"/>`
}

// A pine with snow resting on every tier.
function pine(x, y, h, dark) {
  const w = h * 0.4
  let out = ''

  for (let i = 0; i < 4; i++) {
    const ty = y - h + (h * i) / 4.4
    const tw = w * (0.42 + i * 0.22)
    const top = ty - h * 0.24
    const bot = ty + h * 0.2

    out += `<polygon points="${x},${top.toFixed(0)} ${(x - tw).toFixed(0)},${bot.toFixed(0)} ${(x + tw).toFixed(0)},${bot.toFixed(0)}" fill="${dark}"/>`
    out += `<polygon points="${x},${top.toFixed(0)} ${(x - tw * 0.7).toFixed(0)},${(top + (bot - top) * 0.62).toFixed(0)} ${(x - tw * 0.2).toFixed(0)},${(top + (bot - top) * 0.5).toFixed(0)} ${(x + tw * 0.25).toFixed(0)},${(top + (bot - top) * 0.66).toFixed(0)} ${(x + tw * 0.7).toFixed(0)},${(top + (bot - top) * 0.6).toFixed(0)}" fill="#dce8f7" opacity=".92"/>`
  }

  return out + `<rect x="${x - 4}" y="${y - h * 0.1}" width="8" height="${h * 0.12}" fill="#1a1410"/>`
}

const CSS = `
.tw{opacity:var(--o,1);animation:tw 5s ease-in-out infinite}
.fl{animation:flick 3.6s ease-in-out infinite alternate}
.sm{animation:smoke 9s ease-out infinite}
.s1{animation:fall 24s linear infinite}
.s2{animation:fall 15s linear infinite}
.s3{animation:fall 9s linear infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes flick{0%{opacity:.78}40%{opacity:1}70%{opacity:.86}100%{opacity:.96}}
@keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.55}100%{opacity:0;transform:translate(70px,-190px) scale(2.6)}}
@keyframes fall{from{transform:translate(0,-30px)}to{transform:translate(-70px,960px)}}
@media (prefers-reduced-motion:reduce){.tw,.fl,.sm,.s1,.s2,.s3{animation:none}}
`

export function buildScene() {
  const rand = rng(21)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b1c"/><stop offset=".6" stop-color="#14264a"/><stop offset="1" stop-color="#2a4a78"/></linearGradient>' +
    '<radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#eef4ff" stop-opacity=".45"/><stop offset="1" stop-color="#eef4ff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffbf66" stop-opacity=".55"/><stop offset="1" stop-color="#ffbf66" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="drift" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d9ef"/><stop offset="1" stop-color="#8ea9d0"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 130; i++) {
    const cx = Math.round(rand() * W)
    const cy = Math.round(rand() * 470)
    const r = (0.5 + rand() * 1.3).toFixed(1)
    const o = (0.4 + rand() * 0.5).toFixed(2)

    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#eef3ff"${rand() < 0.3 ? ` class="tw" style="--o:${o};animation-delay:${(-rand() * 5).toFixed(1)}s"` : ` opacity="${o}"`}/>`
  }
  out += '<circle cx="300" cy="170" r="150" fill="url(#moon)"/><circle cx="300" cy="170" r="42" fill="#f4f8ff"/><circle cx="286" cy="160" r="8" fill="#dbe4f4"/><circle cx="318" cy="186" r="11" fill="#dbe4f4"/>'

  out += hills(610, 70, 3, '#1d3358')
  out += hills(680, 55, 8, '#2c4878')

  // Small pines along the far hill.
  for (let i = 0; i < 20; i++) {
    const x = Math.round(rand() * W)

    if (x > 540 && x < 1060) {
      continue
    }
    out += pine(x, 668 + Math.round(rand() * 12), 54 + Math.round(rand() * 34), '#0e2230')
  }

  out += hills(760, 38, 13, '#6c8cba')

  // Light spilling from the window onto the snow.
  out += '<g class="fl"><ellipse cx="1110" cy="770" rx="230" ry="46" fill="url(#glow)"/></g>'

  // The cabin.
  const cx = 1170
  const cy = 690

  out += `<rect x="${cx - 100}" y="${cy - 92}" width="200" height="98" fill="#3a2316"/>`
  for (let i = 0; i < 6; i++) {
    out += `<rect x="${cx - 100}" y="${cy - 92 + i * 16.4}" width="200" height="2.6" fill="#241409"/>`
  }
  out += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88}" fill="#26180f"/>`
  out += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88} ${cx + 108},${cy - 88} ${cx},${cy - 150} ${cx - 108},${cy - 88}" fill="#e6effc"/>`
  out += `<rect x="${cx + 52}" y="${cy - 186}" width="26" height="64" fill="#4a3022"/><rect x="${cx + 46}" y="${cy - 192}" width="38" height="12" fill="#e6effc"/>`
  out += `<g class="fl"><rect x="${cx - 78}" y="${cy - 66}" width="52" height="42" fill="#ffc86a"/><rect x="${cx - 78}" y="${cy - 66}" width="52" height="42" fill="none" stroke="#2a180c" stroke-width="4"/><path d="M${cx - 52} ${cy - 66} V${cy - 24} M${cx - 78} ${cy - 45} H${cx - 26}" stroke="#2a180c" stroke-width="3"/></g>`
  out += `<rect x="${cx + 12}" y="${cy - 62}" width="46" height="68" fill="#2a180c"/><circle cx="${cx + 48}" cy="${cy - 26}" r="3" fill="#d9a05a"/>`
  out += `<ellipse cx="${cx}" cy="${cy + 10}" rx="140" ry="14" fill="url(#drift)"/>`

  // Smoke from the chimney.
  for (let i = 0; i < 6; i++) {
    out += `<circle class="sm" cx="${cx + 65}" cy="${cy - 196}" r="10" fill="#aebbd2" style="animation-delay:${(-i * 1.5).toFixed(1)}s"/>`
  }

  // A drift in front, then big pines at the edges.
  out += `<path d="M0 840 Q300 790 640 830 T1300 822 T1600 800 V900 H0Z" fill="url(#drift)"/>`
  out += pine(90, 905, 400, '#0b1f2a') + pine(230, 890, 270, '#0e2430') + pine(-20, 870, 320, '#0b1f2a')
  out += pine(1500, 905, 430, '#0b1f2a') + pine(1640, 870, 330, '#0b1f2a')

  // Snow: far, middle and near flakes.
  const flakes = (n, rMin, rMax, cls, dur, op) => {
    for (let i = 0; i < n; i++) {
      out += `<circle class="${cls}" cx="${Math.round(rand() * (W + 120))}" cy="0" r="${(rMin + rand() * (rMax - rMin)).toFixed(1)}" fill="#f4f8ff" opacity="${op}" style="animation-duration:${(dur * (0.85 + rand() * 0.3)).toFixed(1)}s;animation-delay:${(-rand() * dur).toFixed(1)}s"/>`
    }
  }

  flakes(80, 0.8, 1.4, 's1', 24, 0.55)
  flakes(45, 1.4, 2.2, 's2', 15, 0.7)
  flakes(18, 2.4, 3.6, 's3', 9, 0.85)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
