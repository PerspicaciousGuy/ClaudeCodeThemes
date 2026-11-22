// Station Window: an original view from a space station. A thick window frame
// with bolts, the curve of a sunlit Earth with drifting cloud bands, a sunrise
// glow on the limb, a passing satellite, twinkling stars and a console strip of
// blinking indicator lights.
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

const CSS = `
.tw{animation:tw 5s ease-in-out infinite alternate}
.cl1{animation:band 90s linear infinite}
.cl2{animation:band 140s linear infinite reverse}
.rs{animation:rise 10s ease-in-out infinite alternate}
.sat{animation:pass 60s linear infinite}
.bk{animation:bk 2.4s steps(1,end) infinite}
.bk2{animation:bk 3.7s steps(1,end) infinite}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes band{from{transform:translateX(-200px)}to{transform:translateX(200px)}}
@keyframes rise{from{opacity:.65}to{opacity:1}}
@keyframes pass{from{transform:translate(-120px,300px)}to{transform:translate(1740px,120px)}}
@keyframes bk{0%{opacity:1}50%{opacity:.2}}
@media (prefers-reduced-motion:reduce){.tw,.cl1,.cl2,.rs,.sat,.bk,.bk2{animation:none}}
`

export function buildScene() {
  const rand = rng(63)
  const defs =
    '<radialGradient id="atm" cx=".5" cy=".5" r=".5"><stop offset=".92" stop-color="#6fb4ff" stop-opacity="0"/><stop offset=".965" stop-color="#7cc4ff" stop-opacity=".75"/><stop offset="1" stop-color="#7cc4ff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="earth" cx=".5" cy=".12" r=".9"><stop offset="0" stop-color="#2a6fb8"/><stop offset=".5" stop-color="#173e75"/><stop offset="1" stop-color="#0a1a3a"/></radialGradient>' +
    '<radialGradient id="dawn" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".95"/><stop offset=".3" stop-color="#ffb066" stop-opacity=".5"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset=".35" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
    '<clipPath id="win"><rect x="80" y="90" width="1440" height="610" rx="70"/></clipPath>'

  let out = `<rect width="${W}" height="${H}" fill="#04060c"/>`

  // Everything outside is clipped to the window.
  out += '<g clip-path="url(#win)">'
  out += '<rect x="80" y="90" width="1440" height="610" fill="#05080f"/>'
  for (let i = 0; i < 90; i++) {
    const x = 80 + Math.round(rand() * 1440)
    const y = 90 + Math.round(rand() * 420)
    const r = rand() < 0.15 ? 2.2 : 1.3

    out += `<circle class="${i % 3 === 0 ? 'tw' : ''}" cx="${x}" cy="${y}" r="${r}" fill="#dfe9ff" fill-opacity="${(0.5 + rand() * 0.5).toFixed(2)}" style="animation-delay:${(-rand() * 5).toFixed(1)}s"/>`
  }

  // The Earth: a huge disc rising from below, with an atmosphere rim.
  out += '<circle cx="800" cy="1720" r="1180" fill="url(#earth)"/>'
  out += '<g clip-path="url(#win)"><g class="cl1"><ellipse cx="500" cy="580" rx="360" ry="16" fill="#ffffff" fill-opacity=".22"/><ellipse cx="1150" cy="620" rx="300" ry="14" fill="#ffffff" fill-opacity=".2"/></g><g class="cl2"><ellipse cx="800" cy="664" rx="480" ry="18" fill="#ffffff" fill-opacity=".18"/><ellipse cx="300" cy="690" rx="260" ry="14" fill="#cfe6ff" fill-opacity=".2"/></g></g>'
  out += '<circle cx="800" cy="1720" r="1240" fill="url(#atm)"/>'

  // Sunrise on the limb.
  out += '<g class="rs"><ellipse cx="1180" cy="548" rx="260" ry="90" fill="url(#dawn)"/></g>'

  // A satellite crossing slowly.
  out += '<g class="sat"><rect x="0" y="0" width="14" height="8" fill="#c8d2e6"/><rect x="-26" y="1" width="22" height="6" fill="#4a78c8"/><rect x="18" y="1" width="22" height="6" fill="#4a78c8"/></g>'
  out += '</g>'

  // The frame: dark metal around the window, with bolts and a glass sheen.
  out += `<path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z M150 90H1450Q1520 90 1520 160V630Q1520 700 1450 700H150Q80 700 80 630V160Q80 90 150 90Z" fill="#171d2a"/>`
  out += '<rect x="80" y="90" width="1440" height="610" rx="70" fill="none" stroke="#2c3750" stroke-width="10"/>'
  out += '<rect x="80" y="90" width="1440" height="610" rx="70" fill="url(#glass)"/>'
  for (let i = 0; i < 14; i++) {
    const x = 160 + i * 94

    out += `<circle cx="${x}" cy="46" r="9" fill="#2c3750"/><circle cx="${x}" cy="46" r="3.2" fill="#0d121c"/>`
  }

  // A console strip with blinking indicators.
  out += '<rect x="0" y="760" width="1600" height="140" fill="#10151f"/><rect x="0" y="754" width="1600" height="8" fill="#2c3750"/>'
  for (let i = 0; i < 20; i++) {
    const x = 90 + i * 74
    const c = i % 5 === 0 ? '#ffb347' : i % 3 === 0 ? '#55e0a0' : '#4aa8ff'

    out += `<rect x="${x - 18}" y="800" width="36" height="14" rx="3" fill="#1b2433"/><circle class="${i % 2 ? 'bk' : 'bk2'}" cx="${x}" cy="807" r="4" fill="${c}" style="animation-delay:${(-rand() * 3).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
