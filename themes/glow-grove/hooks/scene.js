// Glow Grove: an original forest at night. Giant mushrooms glow teal, violet and
// pink at the edges, small ones light the floor, spores and fireflies drift up
// through slow fog between dark trunks.
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

// A mushroom: stem, domed cap with spots and a glow that breathes.
function shroom(x, y, w, h, color, id, delay) {
  const cw = w
  const ch = h * 0.5
  const sw = w * 0.22
  const top = y - h

  return (
    `<ellipse class="gw" cx="${x}" cy="${top + ch * 0.9}" rx="${(cw * 1.1).toFixed(0)}" ry="${(ch * 1.2).toFixed(0)}" fill="url(#${id})" style="animation-delay:${delay}s"/>` +
    `<path d="M${x - sw / 2} ${y} C${x - sw / 2} ${y - h * 0.3} ${x - sw * 0.35} ${top + ch} ${x - sw * 0.4} ${top + ch} L${x + sw * 0.4} ${top + ch} C${x + sw * 0.35} ${top + ch} ${x + sw / 2} ${y - h * 0.3} ${x + sw / 2} ${y}Z" fill="#cfe4de" fill-opacity=".85"/>` +
    `<path d="M${x - cw / 2} ${top + ch} C${x - cw / 2} ${top - ch * 0.2} ${x + cw / 2} ${top - ch * 0.2} ${x + cw / 2} ${top + ch} Q${x} ${top + ch * 1.25} ${x - cw / 2} ${top + ch}Z" fill="${color}"/>` +
    `<ellipse cx="${x - cw * 0.18}" cy="${top + ch * 0.45}" rx="${(cw * 0.07).toFixed(1)}" ry="${(cw * 0.045).toFixed(1)}" fill="#ffffff" fill-opacity=".75"/>` +
    `<ellipse cx="${x + cw * 0.14}" cy="${top + ch * 0.62}" rx="${(cw * 0.05).toFixed(1)}" ry="${(cw * 0.035).toFixed(1)}" fill="#ffffff" fill-opacity=".7"/>` +
    `<ellipse cx="${x + cw * 0.28}" cy="${top + ch * 0.9}" rx="${(cw * 0.04).toFixed(1)}" ry="${(cw * 0.03).toFixed(1)}" fill="#ffffff" fill-opacity=".6"/>`
  )
}

const CSS = `
.gw{animation:gw 5s ease-in-out infinite alternate}
.fg1{animation:fog 70s linear infinite alternate}
.fg2{animation:fog 95s linear infinite alternate-reverse}
.sp{animation:rise 16s linear infinite}
.ff{animation:blink 3.6s ease-in-out infinite alternate}
@keyframes gw{from{opacity:.55}to{opacity:1}}
@keyframes fog{from{transform:translateX(-120px)}to{transform:translateX(120px)}}
@keyframes rise{from{transform:translate(0,0)}to{transform:translate(40px,-520px)}}
@keyframes blink{from{opacity:.1}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.gw,.fg1,.fg2,.sp,.ff{animation:none}}
`

export function buildScene() {
  const rand = rng(52)
  const glow = (id, c) => `<radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c}" stop-opacity=".6"/><stop offset=".5" stop-color="${c}" stop-opacity=".22"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`
  const defs =
    '<filter id="fb" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>' +
    '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#091014"/><stop offset=".7" stop-color="#0f1c22"/><stop offset="1" stop-color="#16262c"/></linearGradient>' +
    glow('gt', '#4fe0c0') + glow('gv', '#b48cff') + glow('gp', '#ff8fc8')

  let out = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`

  // Trunks, dark, at the edges and faint behind.
  for (const [x, w, c] of [[40, 90, '#060a0c'], [250, 54, '#0a1317'], [1330, 60, '#0a1317'], [1510, 100, '#060a0c'], [620, 30, '#0c171c'], [980, 36, '#0c171c']]) {
    out += `<rect x="${x}" y="-10" width="${w}" height="920" fill="${c}"/>`
  }

  // Fog.
  out += '<g class="fg1" filter="url(#fb)"><ellipse cx="500" cy="650" rx="620" ry="70" fill="#3f7f80" fill-opacity=".16"/><ellipse cx="1250" cy="610" rx="520" ry="60" fill="#3f7f80" fill-opacity=".13"/></g>'
  out += '<g class="fg2" filter="url(#fb)"><ellipse cx="800" cy="760" rx="760" ry="80" fill="#5a8f9a" fill-opacity=".14"/></g>'

  // The forest floor.
  out += '<path d="M0 830 Q300 780 640 820 T1300 808 T1600 790 V900 H0Z" fill="#08110f"/>'
  out += '<path d="M0 870 Q400 840 800 866 T1600 850 V900 H0Z" fill="#050a09"/>'

  // Giant mushrooms at the edges, small ones along the floor.
  out += shroom(170, 860, 300, 420, '#2fbfa3', 'gt', 0)
  out += shroom(330, 872, 130, 190, '#b48cff', 'gv', 1.4)
  out += shroom(1440, 866, 320, 460, '#9a72f0', 'gv', 0.8)
  out += shroom(1260, 876, 120, 170, '#ff8fc8', 'gp', 2.2)
  out += shroom(560, 862, 70, 90, '#2fbfa3', 'gt', 0.5)
  out += shroom(760, 872, 56, 72, '#ff8fc8', 'gp', 1.9)
  out += shroom(960, 864, 78, 100, '#b48cff', 'gv', 1.1)

  // Spores rising and fireflies blinking.
  for (let i = 0; i < 40; i++) {
    out += `<circle class="sp" cx="${Math.round(rand() * W)}" cy="${860 + Math.round(rand() * 60)}" r="${(1.4 + rand() * 2.2).toFixed(1)}" fill="${rand() < 0.5 ? '#7ff0d6' : '#d2b8ff'}" fill-opacity=".7" style="animation-delay:${(-rand() * 16).toFixed(1)}s;animation-duration:${(12 + rand() * 10).toFixed(1)}s"/>`
  }
  for (let i = 0; i < 16; i++) {
    out += `<circle class="ff" cx="${Math.round(rand() * W)}" cy="${300 + Math.round(rand() * 450)}" r="3" fill="#f6e27a" style="animation-delay:${(-rand() * 4).toFixed(1)}s;animation-duration:${(2.6 + rand() * 3).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
