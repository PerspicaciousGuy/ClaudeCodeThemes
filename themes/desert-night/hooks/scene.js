// Desert Night: an original desert after dark. The night twin of Desert Noon:
// a starry sky and a cold moon over blue-violet mesas, saguaros in silhouette,
// a campfire with rising sparks, an owl and the odd shooting star.
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

// A flat-topped mesa with a sloping skirt, plus a few strata lines.
function mesa(cx, w, h, base, fill, strata) {
  const l = cx - w / 2
  const r = cx + w / 2
  const pts = [
    [l - w * 0.28, base],
    [l - w * 0.04, base - h * 0.42],
    [l + w * 0.02, base - h * 0.5],
    [l + w * 0.03, base - h],
    [r - w * 0.06, base - h],
    [r - w * 0.04, base - h * 0.52],
    [r + w * 0.05, base - h * 0.44],
    [r + w * 0.3, base],
  ]
  let out = `<polygon points="${pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' ')}" fill="${fill}"/>`

  for (let i = 1; i <= 4; i++) {
    const y = base - h * (0.12 + i * 0.17)

    out += `<rect x="${(l + w * 0.03).toFixed(0)}" y="${y.toFixed(0)}" width="${(w * 0.93).toFixed(0)}" height="${i % 2 ? 4 : 2}" fill="${strata}" opacity=".18"/>`
  }

  return out
}

function saguaro(x, base, h, color) {
  const w = h * 0.1
  const arm = (side, y, reach, up) =>
    `<path d="M${x} ${base - h * y} H${x + side * reach} V${base - h * (y + up)}" fill="none" stroke="${color}" stroke-width="${(w * 0.78).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`

  return `<path d="M${x} ${base} V${base - h}" stroke="${color}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" fill="none"/>` + arm(-1, 0.4, w * 1.9, 0.3) + arm(1, 0.55, w * 2.2, 0.26)
}

const CSS = `
.tw{opacity:var(--o,1);animation:tw 5s ease-in-out infinite}
.fire{animation:fire 1.4s ease-in-out infinite alternate}
.fl{animation:flick .9s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.sp{animation:spark 3.4s ease-out infinite}
.shoot{animation:shoot 17s linear infinite}
.owl{animation:blink 6s steps(1,end) infinite;transform-box:fill-box;transform-origin:center}
.dust{animation:dust 18s linear infinite}
@keyframes tw{0%,100%{opacity:var(--o,1)}50%{opacity:calc(var(--o,1)*.25)}}
@keyframes fire{from{opacity:.75}to{opacity:1}}
@keyframes flick{0%{transform:scale(1,1) skewX(0)}50%{transform:scale(.92,1.1) skewX(-5deg)}100%{transform:scale(1.05,.95) skewX(4deg)}}
@keyframes spark{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(26px,-150px)}}
@keyframes shoot{0%,90%{opacity:0;transform:translate(0,0)}91%{opacity:1}100%{opacity:0;transform:translate(-360px,170px)}}
@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes dust{0%{opacity:0;transform:translate(0,0)}15%{opacity:.35}100%{opacity:0;transform:translate(300px,-20px)}}
@media (prefers-reduced-motion:reduce){.tw,.fire,.fl,.sp,.shoot,.owl,.dust{animation:none}}
`

export function buildScene() {
  const rand = rng(9)
  const defs =
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset=".5" stop-color="#121a42"/><stop offset="1" stop-color="#3a3470"/></linearGradient>' +
    '<radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8f0ff" stop-opacity=".5"/><stop offset="1" stop-color="#e8f0ff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="fireglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2a54"/><stop offset="1" stop-color="#171636"/></linearGradient>' +
    '<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3470" stop-opacity="0"/><stop offset="1" stop-color="#3a3470" stop-opacity=".8"/></linearGradient>' +
    '<linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>'

  let out = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`

  for (let i = 0; i < 150; i++) {
    const cx = Math.round(rand() * W)
    const cy = Math.round(rand() * 520)
    const r = (0.5 + rand() * 1.3).toFixed(1)
    const o = (0.35 + rand() * 0.55).toFixed(2)

    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8ecff"${rand() < 0.3 ? ` class="tw" style="--o:${o};animation-delay:${(-rand() * 5).toFixed(1)}s"` : ` opacity="${o}"`}/>`
  }
  out += '<g class="shoot"><g transform="translate(1180 80) rotate(25)"><rect width="120" height="2" fill="url(#sg)"/></g></g>'

  // A cold moon.
  out += '<circle cx="1290" cy="170" r="190" fill="url(#moon)"/><circle cx="1290" cy="170" r="52" fill="#eef3ff"/><circle cx="1272" cy="156" r="10" fill="#d2dcf0"/><circle cx="1306" cy="186" r="13" fill="#d2dcf0"/><circle cx="1312" cy="148" r="6" fill="#d2dcf0"/>'

  // Mesas, hazy to near. The middle stays low and pale.
  out += mesa(760, 360, 70, 612, '#2e2c5e', '#16143a')
  out += mesa(1130, 300, 110, 622, '#27255a', '#14123a')
  out += mesa(360, 420, 150, 640, '#201e4c', '#100e30')
  out += mesa(150, 360, 330, 700, '#181640', '#0a0a22')
  out += mesa(1500, 420, 380, 710, '#16143c', '#0a0a22')
  out += mesa(1310, 200, 160, 670, '#1c1a46', '#0c0c28')
  out += '<rect x="0" y="560" width="1600" height="140" fill="url(#haze)"/>'

  // Sand: two dunes.
  out += '<path d="M0 700 Q300 660 640 700 T1300 690 T1600 680 V900 H0Z" fill="url(#sand)"/>'
  out += '<path d="M0 800 Q420 740 900 790 T1600 770 V900 H0Z" fill="#141330"/>'

  // Saguaros in silhouette at the sides.
  out += saguaro(250, 800, 150, '#0a0a1e') + saguaro(120, 830, 310, '#070716')
  out += saguaro(1340, 810, 140, '#0a0a1e') + saguaro(1480, 840, 330, '#070716')

  // The campfire at the lower left of the middle: glow, logs, flames and sparks.
  out += '<g class="fire"><ellipse cx="520" cy="828" rx="230" ry="60" fill="url(#fireglow)"/></g>'
  out += '<path d="M488 832 L552 812 M492 812 L548 834" stroke="#2a1a14" stroke-width="9" stroke-linecap="round"/>'
  out += '<g class="fl"><path d="M520 770 Q498 800 508 822 Q520 830 532 822 Q542 800 520 770Z" fill="#ff8a2a"/></g><g class="fl" style="animation-delay:-.4s"><path d="M520 790 Q508 806 513 822 Q520 826 527 822 Q532 806 520 790Z" fill="#ffd23d"/></g>'
  for (let i = 0; i < 7; i++) {
    out += `<circle class="sp" cx="${510 + i * 4}" cy="780" r="2" fill="#ffc25a" style="animation-delay:${(-i * 0.5).toFixed(1)}s;animation-duration:${(2.6 + (i % 3) * 0.6).toFixed(1)}s"/>`
  }
  out += '<ellipse cx="450" cy="836" rx="20" ry="9" fill="#0c0c24"/><ellipse cx="590" cy="838" rx="16" ry="7" fill="#0c0c24"/>'

  // An owl on the left saguaro.
  out += '<g transform="translate(176 640)"><ellipse cx="0" cy="0" rx="16" ry="22" fill="#14122e"/><polygon points="-14,-14 -10,-30 -4,-18" fill="#14122e"/><polygon points="14,-14 10,-30 4,-18" fill="#14122e"/><g class="owl"><circle cx="-6" cy="-8" r="5" fill="#ffd86a"/><circle cx="6" cy="-8" r="5" fill="#ffd86a"/></g><circle cx="-6" cy="-8" r="1.8" fill="#0a0a1e"/><circle cx="6" cy="-8" r="1.8" fill="#0a0a1e"/><polygon points="-2,-3 2,-3 0,2" fill="#c0803a"/></g>'

  // Dust catching the moon.
  for (let i = 0; i < 22; i++) {
    out += `<circle class="dust" cx="${Math.round(rand() * 1300)}" cy="${700 + Math.round(rand() * 170)}" r="${(1 + rand() * 1.6).toFixed(1)}" fill="#8a96d8" style="animation-delay:${(-rand() * 18).toFixed(1)}s;animation-duration:${(12 + rand() * 9).toFixed(1)}s"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`
}
