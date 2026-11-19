// Weather Mood: a lighthouse on a rocky headland whose weather follows Claude.
// While it is idle the night is clear and calm, with stars and a moon. While it
// works, clouds roll in and rain falls, harder the fuller the context window is.
// A failed tool call brings a flash of lightning. Vector art on a 1600x900 canvas.
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
.tw{animation:tw var(--d,4s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.cloud{animation:cloud var(--d,60s) ease-in-out infinite alternate}
.rain{animation:rain var(--d,.9s) linear infinite;animation-delay:var(--l,0s)}
.wave{animation:wave var(--d,8s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
.beam{animation:beam var(--d,8s) ease-in-out infinite alternate;transform-origin:1280px 430px}
.bolt{animation:bolt 1.6s linear 1 forwards;opacity:0}
.flash{animation:flash 1.6s linear 1 forwards;opacity:0}
.spray{animation:spray var(--d,3s) ease-in-out infinite alternate;animation-delay:var(--l,0s)}
@keyframes tw{from{opacity:.3}to{opacity:1}}
@keyframes cloud{from{transform:translateX(-120px)}to{transform:translateX(160px)}}
@keyframes rain{from{transform:translate(0,-80px)}to{transform:translate(-70px,980px)}}
@keyframes wave{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
@keyframes beam{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes bolt{0%{opacity:0}4%{opacity:1}10%{opacity:0}16%{opacity:1}30%{opacity:.6}100%{opacity:0}}
@keyframes flash{0%{opacity:0}4%{opacity:.7}10%{opacity:.1}16%{opacity:.6}40%{opacity:0}100%{opacity:0}}
@keyframes spray{from{transform:translateY(0)}to{transform:translateY(-10px)}}
@media (prefers-reduced-motion:reduce){.tw,.cloud,.rain,.wave,.beam,.spray{animation:none}.bolt,.flash{animation:none;opacity:0}}
`

const RAIN = [60, 110, 170]

/**
 * @param {boolean} working Claude is working: clouds and rain
 * @param {number} intensity 0 to 2: how hard it rains, from the context window
 * @param {boolean} flash a flash of lightning, for a failed tool call
 */
export function buildLive(working, intensity = 1, flash = false) {
  const rand = rng(61)
  const k = Math.max(0, Math.min(2, Math.round(intensity)))
  let out = ''

  out += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${working ? '#0c1018' : '#0a1030'}"/><stop offset="1" stop-color="${working ? '#2a3442' : '#2a3a6a'}"/></linearGradient>`
  out += `<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${working ? '#20303e' : '#1c2c58'}"/><stop offset="1" stop-color="${working ? '#0a121a' : '#080e24'}"/></linearGradient>`
  out += `<linearGradient id="beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff2c0" stop-opacity=".8"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient>`
  out += `<radialGradient id="lh"><stop offset="0" stop-color="#fff2c0" stop-opacity=".6"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>`
  out += `<radialGradient id="moon"><stop offset="0" stop-color="#e8eeff" stop-opacity=".55"/><stop offset="1" stop-color="#e8eeff" stop-opacity="0"/></radialGradient></defs>`
  out += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  if (!working) {
    // A clear night: stars and a moon.
    for (let g = 0; g < 6; g++) {
      let st = ''

      for (let i = 0; i < 16; i++) {
        st += `<circle cx="${Math.round(rand() * W)}" cy="${Math.round(rand() * rand() * 480)}" r="${(0.7 + rand() * 1.3).toFixed(1)}" fill="#eef0ff" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`
      }
      out += `<g class="tw" style="--d:${(3 + rand() * 3).toFixed(1)}s;--l:${(-rand() * 5).toFixed(1)}s">${st}</g>`
    }
    out += `<circle cx="420" cy="210" r="200" fill="url(#moon)"/><circle cx="420" cy="210" r="48" fill="#eef2ff"/>`
    out += `<g class="cloud"><g fill="#2a3a6a" opacity=".45"><ellipse cx="900" cy="250" rx="240" ry="20"/><ellipse cx="300" cy="360" rx="200" ry="16"/></g></g>`
  } else {
    // Storm clouds, layers of them rolling across.
    out += `<g class="cloud" style="--d:70s"><g fill="#161e28">`
    for (let i = 0; i < 12; i++) {
      out += `<ellipse cx="${(80 + i * 140 + rand() * 60).toFixed(0)}" cy="${(70 + rand() * 120).toFixed(0)}" rx="${(150 + rand() * 90).toFixed(0)}" ry="${(46 + rand() * 30).toFixed(0)}"/>`
    }
    out += `</g></g><g class="cloud" style="--d:90s"><g fill="#232e3a" opacity=".85">`
    for (let i = 0; i < 9; i++) {
      out += `<ellipse cx="${(140 + i * 180 + rand() * 80).toFixed(0)}" cy="${(190 + rand() * 90).toFixed(0)}" rx="${(140 + rand() * 80).toFixed(0)}" ry="${(36 + rand() * 24).toFixed(0)}"/>`
    }
    out += `</g></g>`
  }

  // The sea, with long swells; bigger when it is stormy.
  out += `<rect x="0" y="560" width="${W}" height="${H - 560}" fill="url(#sea)"/>`
  for (let i = 0; i < 7; i++) {
    const y = 590 + i * 44
    const a = working ? 14 + k * 5 : 6

    out += `<g class="wave" style="--d:${(working ? 4 + i * 0.6 : 8 + i).toFixed(1)}s;--l:${(-i * 1.5).toFixed(1)}s"><path d="M-80 ${y} q 100 -${a} 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0" fill="none" stroke="${working ? '#7a8ea4' : '#8aa0d8'}" stroke-width="${working ? 3 : 2}" stroke-opacity="${working ? 0.5 : 0.35}"/></g>`
  }

  // The lighthouse on a rocky headland at the right: a beam that sweeps.
  out += `<g class="beam"><polygon points="1280,430 300,360 300,500" fill="url(#beam)" opacity="${working ? 0.9 : 0.55}"/></g>`
  out += `<path d="M1040 900 L1100 700 Q 1200 640 1280 660 Q 1420 640 1500 720 L1600 900 Z" fill="#0a0e16"/>`
  out += `<g transform="translate(1280 660)"><polygon points="-40,0 40,0 28,-210 -28,-210" fill="#e8e4dc"/><rect x="-36" y="-110" width="72" height="26" fill="#c0392b"/><rect x="-32" y="-170" width="64" height="22" fill="#c0392b"/><rect x="-34" y="-232" width="68" height="22" fill="#2a2a32"/><rect x="-22" y="-224" width="44" height="14" fill="#fff2c0"/><polygon points="-40,-232 0,-270 40,-232" fill="#2a2a32"/></g>`
  out += `<circle cx="1280" cy="430" r="${working ? 170 : 110}" fill="url(#lh)"/>`

  // Spray on the rocks when it is stormy.
  if (working) {
    for (let i = 0; i < 8; i++) {
      out += `<g class="spray" style="--d:${(1.5 + rand() * 2).toFixed(1)}s;--l:${(-rand() * 3).toFixed(1)}s"><ellipse cx="${(1060 + rand() * 120).toFixed(0)}" cy="${(780 + rand() * 60).toFixed(0)}" rx="${(10 + rand() * 18).toFixed(0)}" ry="6" fill="#d8e4f0" fill-opacity=".6"/></g>`
    }
  }

  // Rain, slanting with the wind.
  if (working) {
    for (let i = 0; i < RAIN[k]; i++) {
      const x = Math.round(rand() * (W + 300))
      const len = 28 + Math.round(rand() * 34)

      out += `<g class="rain" style="--d:${(0.55 + rand() * 0.5).toFixed(2)}s;--l:${(-rand()).toFixed(2)}s"><line x1="${x}" y1="0" x2="${x - 10}" y2="${len}" stroke="#bcd0e8" stroke-width="${(1.2 + rand() * 1.4).toFixed(1)}" stroke-opacity="${(0.3 + rand() * 0.35).toFixed(2)}" stroke-linecap="round"/></g>`
    }
  }

  // Lightning for a failed tool call: a bolt and a flash over the whole sky.
  if (flash) {
    out += `<g class="bolt"><polygon points="900,0 860,150 910,160 840,330 920,340 800,560 880,350 830,340 880,170 840,160" fill="#f4f8ff"/></g><rect class="flash" width="${W}" height="${H}" fill="#dce8ff"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><style>${CSS}</style>${out}</svg>`
}

// The still picture the gallery and the previews use: a storm with rain and a flash.
export function buildScene() {
  return buildLive(true, 1, false)
}
