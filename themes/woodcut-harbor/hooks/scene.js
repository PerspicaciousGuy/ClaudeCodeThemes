// Woodcut Harbor: an original woodcut-style scene.
// Pure SVG + CSS animation: no script, nothing loaded.

const W=1600,H=900,INK='#1b1712',PAPER='#efe5cf',RED='#d8572f'
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function hills(base,amp,seed,fill,extra=''){const r=rng(seed),p1=r()*6.28,p2=r()*6.28;let d=`M-10 ${H}`;for(let x=-10;x<=W+10;x+=16){d+=` L${x} ${(base-amp*(0.6*Math.sin(x/190+p1)+0.4*Math.sin(x/83+p2))).toFixed(0)}`}return `<path d="${d} L${W+10} ${H} Z" fill="${fill}" ${extra}/>`}

const CSS=`.w1{animation:wv 11s ease-in-out infinite alternate}.w2{animation:wv 8s ease-in-out infinite alternate-reverse}.w3{animation:wv 6s ease-in-out infinite alternate}.lamp{animation:lamp 3s ease-in-out infinite alternate}.bt{animation:bob 5s ease-in-out infinite alternate}.g1{animation:glide 38s linear infinite}.g2{animation:glide 54s linear infinite}.sun{animation:sun 9s ease-in-out infinite alternate}
@keyframes wv{from{transform:translateX(-34px)}to{transform:translateX(34px)}}@keyframes lamp{from{opacity:.7}to{opacity:1}}@keyframes bob{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(8px) rotate(1deg)}}@keyframes glide{from{transform:translateX(-200px)}to{transform:translateX(1800px)}}@keyframes sun{from{opacity:.85}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.w1,.w2,.w3,.lamp,.bt,.g1,.g2,.sun{animation:none}}`
const gull=(x,y,s)=>`<path d="M${x} ${y}q${12*s} ${-14*s} ${24*s} 0q${12*s} ${-14*s} ${24*s} 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
function waves(y0,rows,gap,amp,cls,sw){let o='';for(let i=0;i<rows;i++){const y=y0+i*gap;let d=`M-120 ${y}`;for(let x=-120;x<=W+120;x+=60)d+=` q15 ${-amp} 30 0 t30 0`;o+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw+i*.35}"/>`}return `<g class="${cls}">${o}</g>`}
export function buildScene(){
 const hx=1130
 const defs='<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>'+
 `<pattern id="hz" width="14" height="13" patternUnits="userSpaceOnUse"><rect width="14" height="2.4" fill="${INK}"/></pattern><pattern id="dg" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="12" height="3.2" fill="${INK}"/></pattern>`
 let art=`<rect width="${W}" height="560" fill="url(#hz)"/>`
 art+=`<rect y="560" width="${W}" height="340" fill="${PAPER}"/><path d="M0 560H${W}" stroke="${INK}" stroke-width="5"/>`
 // far shore hatched
 art+=hills(570,26,5,'url(#dg)')+`<rect y="580" width="${W}" height="320" fill="${PAPER}"/>`
 // headland and lighthouse
 art+=`<path d="M${hx-330} 900 Q${hx-260} 720 ${hx-120} 700 Q${hx} 640 ${hx+120} 690 Q${hx+300} 700 ${hx+380} 900Z" fill="${INK}"/>`
 art+=`<polygon points="${hx-34},700 ${hx+34},700 ${hx+22},470 ${hx-22},470" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>`
 for(const y of [510,570,630])art+=`<polygon points="${hx-22-(y-470)*.07},${y} ${hx+22+(y-470)*.07},${y} ${hx+22+(y+30-470)*.07},${y+30} ${hx-22-(y+30-470)*.07},${y+30}" fill="${INK}"/>`
 art+=`<rect x="${hx-30}" y="446" width="60" height="26" fill="${INK}"/><polygon points="${hx-36},446 ${hx},404 ${hx+36},446" fill="${INK}"/>`
 let out=`<rect width="${W}" height="${H}" fill="${PAPER}"/><g filter="url(#rough)">${art}</g>`
 out+=`<g class="sun"><circle cx="360" cy="210" r="84" fill="${PAPER}" stroke="${INK}" stroke-width="6"/><circle cx="360" cy="210" r="58" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="6 10"/></g>`
 out+=`<g class="lamp"><rect x="${hx-22}" y="452" width="44" height="18" fill="${RED}"/></g>`
 out+=`<g filter="url(#rough)">${waves(610,3,34,12,'w1',3)}${waves(730,3,40,14,'w2',3.5)}${waves(840,2,40,16,'w3',4.5)}</g>`
 out+=`<g class="bt"><g transform="translate(430 668)"><path d="M0 0h150l-26 34h-98z" fill="${INK}"/><path d="M74 -6V-120L16 -14z" fill="${PAPER}" stroke="${INK}" stroke-width="5"/><path d="M82 -6V-96l46 84z" fill="${INK}"/><path d="M74 -122v-18" stroke="${INK}" stroke-width="4"/></g></g>`
 out+=`<g class="g1" style="transform-origin:0 0">${gull(0,260,1.2)}${gull(60,290,.9)}</g><g class="g2">${gull(-100,180,1)}${gull(-30,215,.8)}${gull(30,170,.7)}</g>`
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`}
