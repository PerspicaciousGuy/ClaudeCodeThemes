// Hearth: an original warm dusk. A breathing sun, drifting haze, two hills and
// embers rising. Vector art on a 1600x900 canvas.
// Pure SVG + CSS animation: no script, nothing loaded.

// Deterministic pseudo-random so the embers are the same on every load.
function rand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453

  return x - Math.floor(x)
}

function embers() {
  let out = ''

  for (let i = 0; i < 28; i++) {
    const x = Math.round(rand(i + 1) * 1600)
    const r = (1.2 + rand(i + 50) * 2.6).toFixed(1)
    const dur = (14 + rand(i + 90) * 16).toFixed(1)
    const delay = (-rand(i + 130) * 30).toFixed(1)
    const drift = Math.round((rand(i + 170) - 0.5) * 160)

    out += `<circle class="e" cx="${x}" cy="920" r="${r}" style="--dx:${drift}px;animation-duration:${dur}s;animation-delay:${delay}s"/>`
  }

  return out
}

export function buildScene() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2a1a1d"/>
<stop offset="0.45" stop-color="#6b3326"/>
<stop offset="0.8" stop-color="#b8602f"/>
<stop offset="1" stop-color="#d98a3d"/>
</linearGradient>
<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#ffd9a0" stop-opacity="0.95"/>
<stop offset="0.35" stop-color="#f2a65a" stop-opacity="0.55"/>
<stop offset="1" stop-color="#e0702e" stop-opacity="0"/>
</radialGradient>
<linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#4a2519"/>
<stop offset="1" stop-color="#2a1511"/>
</linearGradient>
<linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#341b14"/>
<stop offset="1" stop-color="#1d0e0b"/>
</linearGradient>
</defs>
<style>
.sun{transform-origin:1180px 640px;animation:breathe 9s ease-in-out infinite}
.haze{animation:drift 40s ease-in-out infinite alternate}
.e{fill:#ffc27a;opacity:0;animation-name:rise;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
@keyframes drift{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
@keyframes rise{0%{transform:translate(0,0);opacity:0}10%{opacity:.8}70%{opacity:.35}100%{transform:translate(var(--dx),-980px);opacity:0}}
@media (prefers-reduced-motion:reduce){.sun,.haze,.e{animation:none}}
</style>
<rect width="1600" height="900" fill="url(#sky)"/>
<g class="sun"><circle cx="1180" cy="640" r="380" fill="url(#sun)"/></g>
<g class="haze" opacity="0.35"><ellipse cx="500" cy="560" rx="520" ry="46" fill="#f0a867"/><ellipse cx="1050" cy="470" rx="420" ry="34" fill="#f0a867"/></g>
<path d="M0 720 C 220 650 420 690 640 700 C 880 712 1080 640 1300 668 C 1440 686 1530 700 1600 690 L1600 900 L0 900 Z" fill="url(#hill1)"/>
<path d="M0 800 C 260 760 520 790 800 800 C 1060 810 1340 770 1600 792 L1600 900 L0 900 Z" fill="url(#hill2)"/>
${embers()}
</svg>`
}
