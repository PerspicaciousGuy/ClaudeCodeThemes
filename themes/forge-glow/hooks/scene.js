// Forge Glow: an original blacksmith's forge at night. A stone wall, a furnace
// breathing orange light, an anvil with a glowing bar, hanging tools, sparks
// bursting off the anvil and embers rising into the dark.
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
.fg{animation:fg 2.8s ease-in-out infinite alternate}
.fl{animation:fl 1.7s ease-in-out infinite alternate}
.em{animation:em 9s linear infinite}
.sk{animation:sk 4.2s ease-out infinite}
.bar{animation:bar 5s ease-in-out infinite alternate}
@keyframes fg{from{opacity:.62}to{opacity:1}}
@keyframes fl{from{opacity:.8}to{opacity:1}}
@keyframes em{from{transform:translate(0,0)}to{transform:translate(50px,-640px)}}
@keyframes sk{0%{opacity:0;transform:translate(0,0)}6%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes bar{from{opacity:.75}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.fg,.fl,.em,.sk,.bar{animation:none}.sk{opacity:0}}
`

export function buildScene() {
  const rand = rng(29)
  const defs =
    '<radialGradient id="fire" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset=".35" stop-color="#ff8a3d" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0908"/><stop offset="1" stop-color="#1b1210"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#wall)"/>`

  // Stone courses, offset row by row.
  for (let row = 0; row < 14; row++) {
    const y = row * 66
    const off = row % 2 ? 0 : 60

    for (let x = -off; x < W; x += 120) {
      const t = 0.5 + rand() * 0.5

      out += `<rect x="${x + 3}" y="${y + 3}" width="114" height="60" rx="5" fill="rgb(${Math.round(36 * t)},${Math.round(26 * t)},${Math.round(22 * t)})"/>`
    }
  }

  // Tools hanging at the top edges: hammer, tongs, a saw blade.
  out += '<g fill="#050303"><rect x="150" y="40" width="10" height="150"/><rect x="118" y="30" width="74" height="30" rx="4"/><path d="M300 30l14 0 8 190 -8 14 -14 -14z"/><path d="M308 220l-28 90m28 -90l28 90" stroke="#050303" stroke-width="8" fill="none"/><rect x="1380" y="30" width="12" height="190"/><path d="M1340 40h92v30h-92z"/><path d="M1500 30h18v200h-18z"/></g>'

  // The furnace on the left: a stone arch with a glowing mouth.
  out += '<path d="M60 900V560Q60 430 200 430T340 560V900Z" fill="#0a0605"/>'
  out += '<g class="fg"><path d="M110 900V590Q110 500 200 500T290 590V900Z" fill="url(#fire)"/><ellipse cx="200" cy="780" rx="320" ry="260" fill="url(#fire)" fill-opacity=".5"/></g>'
  out += '<path d="M110 900V590Q110 500 200 500T290 590V900Z" fill="none" stroke="#2a1812" stroke-width="12"/>'

  // A light on the floor from the furnace.
  out += '<g class="fl"><ellipse cx="620" cy="868" rx="420" ry="26" fill="#ff8a3d" fill-opacity=".22"/></g>'

  // The anvil on its block, with a glowing bar.
  out += '<rect x="1090" y="770" width="170" height="130" fill="#150d0a"/><rect x="1096" y="776" width="158" height="8" fill="#2a1812"/>'
  out += '<path d="M980 700h360q-30 8 -50 40h-60l-12 36h-130l-12 -36h-60q-20 -32 -36 -40z" fill="#0b0707"/>'
  out += '<path d="M980 700h360" stroke="#3a2a24" stroke-width="6"/>'
  out += '<g class="bar"><rect x="1070" y="682" width="190" height="14" rx="5" fill="#ff7a2a"/><rect x="1086" y="685" width="140" height="6" rx="3" fill="#ffd27a"/><ellipse cx="1165" cy="684" rx="150" ry="40" fill="url(#fire)" fill-opacity=".55"/></g>'

  // Sparks off the anvil.
  for (let i = 0; i < 14; i++) {
    const dx = Math.round((rand() - 0.2) * 360)
    const dy = Math.round(-60 - rand() * 220)

    out += `<circle class="sk" cx="1165" cy="684" r="${(1.6 + rand() * 1.8).toFixed(1)}" fill="${rand() < 0.5 ? '#ffd27a' : '#ff8a3d'}" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${(-rand() * 4.2).toFixed(1)}s;animation-duration:${(2.4 + rand() * 2.4).toFixed(1)}s"/>`
  }

  // Embers rising from the furnace.
  for (let i = 0; i < 36; i++) {
    out += `<circle class="em" cx="${140 + Math.round(rand() * 120)}" cy="${860 + Math.round(rand() * 40)}" r="${(1.4 + rand() * 2.2).toFixed(1)}" fill="${rand() < 0.5 ? '#ffb060' : '#ff6a2a'}" fill-opacity=".8" style="animation-delay:${(-rand() * 9).toFixed(1)}s;animation-duration:${(7 + rand() * 6).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
