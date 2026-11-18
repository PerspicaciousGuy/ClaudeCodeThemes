// Snow Cabin Day: an original winter noon. The day twin of Snow Cabin: a pale
// blue sky and low sun, white hills, a log cabin with smoke from the chimney,
// snow-laden pines and snow falling in three layers.
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
    out += `<polygon points="${x},${top.toFixed(0)} ${(x - tw * 0.7).toFixed(0)},${(top + (bot - top) * 0.62).toFixed(0)} ${(x - tw * 0.2).toFixed(0)},${(top + (bot - top) * 0.5).toFixed(0)} ${(x + tw * 0.25).toFixed(0)},${(top + (bot - top) * 0.66).toFixed(0)} ${(x + tw * 0.7).toFixed(0)},${(top + (bot - top) * 0.6).toFixed(0)}" fill="#ffffff" opacity=".95"/>`
  }

  return out + `<rect x="${x - 4}" y="${y - h * 0.1}" width="8" height="${h * 0.12}" fill="#3a2a22"/>`
}

const CSS = `
.sun{animation:sun 9s ease-in-out infinite alternate}
.fl{animation:flick 3.6s ease-in-out infinite alternate}
.sm{animation:smoke 9s ease-out infinite}
.s1{animation:fall 24s linear infinite}
.s2{animation:fall 15s linear infinite}
.s3{animation:fall 9s linear infinite}
.gl{animation:glint 4s steps(1,end) infinite}
@keyframes sun{from{opacity:.75}to{opacity:1}}
@keyframes flick{0%{opacity:.8}40%{opacity:1}70%{opacity:.88}100%{opacity:.96}}
@keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.7}100%{opacity:0;transform:translate(70px,-190px) scale(2.6)}}
@keyframes fall{from{transform:translate(0,-30px)}to{transform:translate(-70px,960px)}}
@keyframes glint{0%,100%{opacity:0}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.sun,.fl,.sm,.s1,.s2,.s3,.gl{animation:none}}
`

export function buildScene() {
  const rand = rng(23)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa8d4"/><stop offset=".6" stop-color="#b4d0e8"/><stop offset="1" stop-color="#e4eef8"/></linearGradient>' +
    '<radialGradient id="sunh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8e0" stop-opacity=".9"/><stop offset=".3" stop-color="#fff0c4" stop-opacity=".45"/><stop offset="1" stop-color="#fff0c4" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffbf66" stop-opacity=".5"/><stop offset="1" stop-color="#ffbf66" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="drift" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfe0f2"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  // A low winter sun behind a veil of thin cloud.
  out += '<g class="sun"><circle cx="330" cy="200" r="300" fill="url(#sunh)"/></g><circle cx="330" cy="200" r="46" fill="#fffdf2"/>'
  out += '<ellipse cx="520" cy="150" rx="230" ry="12" fill="#fff" opacity=".55"/><ellipse cx="1100" cy="250" rx="280" ry="11" fill="#fff" opacity=".45"/><ellipse cx="760" cy="330" rx="180" ry="8" fill="#fff" opacity=".4"/>'

  out += hills(610, 70, 3, '#c4d6ea')
  out += hills(680, 55, 8, '#dbe7f4')

  // Small pines along the far hill.
  for (let i = 0; i < 20; i++) {
    const x = Math.round(rand() * W)

    if (x > 540 && x < 1060) {
      continue
    }
    out += pine(x, 668 + Math.round(rand() * 12), 54 + Math.round(rand() * 34), '#2a4a50')
  }

  out += hills(760, 38, 13, '#f2f7fc')

  // The cabin, lit from inside even by day.
  const cx = 1170
  const cy = 690

  out += `<rect x="${cx - 100}" y="${cy - 92}" width="200" height="98" fill="#7a4e30"/>`
  for (let i = 0; i < 6; i++) {
    out += `<rect x="${cx - 100}" y="${cy - 92 + i * 16.4}" width="200" height="2.6" fill="#5a361e"/>`
  }
  out += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88}" fill="#4a3022"/>`
  out += `<polygon points="${cx - 126},${cy - 88} ${cx},${cy - 168} ${cx + 126},${cy - 88} ${cx + 108},${cy - 88} ${cx},${cy - 150} ${cx - 108},${cy - 88}" fill="#ffffff"/>`
  out += `<rect x="${cx + 52}" y="${cy - 186}" width="26" height="64" fill="#8a5a3c"/><rect x="${cx + 46}" y="${cy - 192}" width="38" height="12" fill="#ffffff"/>`
  out += `<g class="fl"><rect x="${cx - 78}" y="${cy - 66}" width="52" height="42" fill="#ffd88a"/><rect x="${cx - 78}" y="${cy - 66}" width="52" height="42" fill="none" stroke="#4a2c18" stroke-width="4"/><path d="M${cx - 52} ${cy - 66} V${cy - 24} M${cx - 78} ${cy - 45} H${cx - 26}" stroke="#4a2c18" stroke-width="3"/></g>`
  out += `<rect x="${cx + 12}" y="${cy - 62}" width="46" height="68" fill="#4a2c18"/><circle cx="${cx + 48}" cy="${cy - 26}" r="3" fill="#e0b070"/>`
  out += `<ellipse cx="${cx}" cy="${cy + 10}" rx="140" ry="14" fill="url(#drift)"/>`
  out += '<g class="fl"><ellipse cx="1110" cy="772" rx="200" ry="34" fill="url(#glow)"/></g>'

  // Smoke from the chimney, grey against the pale sky.
  for (let i = 0; i < 6; i++) {
    out += `<circle class="sm" cx="${cx + 65}" cy="${cy - 196}" r="10" fill="#9aa8bc" style="animation-delay:${(-i * 1.5).toFixed(1)}s"/>`
  }

  // A drift in front, then big pines at the edges.
  out += '<path d="M0 840 Q300 790 640 830 T1300 822 T1600 800 V900 H0Z" fill="url(#drift)"/>'
  out += pine(90, 905, 400, '#2a4a50') + pine(230, 890, 270, '#32575c') + pine(-20, 870, 320, '#2a4a50')
  out += pine(1500, 905, 430, '#2a4a50') + pine(1640, 870, 330, '#2a4a50')

  // Glints on the snow.
  for (let i = 0; i < 24; i++) {
    out += `<rect class="gl" x="${Math.round(rand() * W)}" y="${690 + Math.round(rand() * 200)}" width="3" height="3" fill="#fff" style="animation-delay:${(-rand() * 4).toFixed(1)}s;animation-duration:${(3 + rand() * 3).toFixed(1)}s"/>`
  }

  // Snow: far, middle and near flakes, with a faint blue edge so they show on the sky.
  const flakes = (n, rMin, rMax, cls, dur, op) => {
    for (let i = 0; i < n; i++) {
      out += `<circle class="${cls}" cx="${Math.round(rand() * (W + 120))}" cy="0" r="${(rMin + rand() * (rMax - rMin)).toFixed(1)}" fill="#ffffff" stroke="#9ab8d8" stroke-width=".6" opacity="${op}" style="animation-duration:${(dur * (0.85 + rand() * 0.3)).toFixed(1)}s;animation-delay:${(-rand() * dur).toFixed(1)}s"/>`
    }
  }

  flakes(70, 1.2, 2, 's1', 24, 0.75)
  flakes(40, 2, 3, 's2', 15, 0.85)
  flakes(16, 3.2, 4.6, 's3', 9, 0.95)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
