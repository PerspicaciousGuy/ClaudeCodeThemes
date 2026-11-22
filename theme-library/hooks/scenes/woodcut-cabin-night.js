// Woodcut Cabin Night: an original woodcut-style scene.
// Pure SVG + CSS animation: no script, nothing loaded.

const W=1600,H=900,BG='#12151c',LINE='#2d3547',CREAM='#ece3cc',DARK='#07090d',RED='#ee7a3e'
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function hills(base,amp,seed,fill,extra=''){const r=rng(seed),p1=r()*6.28,p2=r()*6.28;let d=`M-10 ${H}`;for(let x=-10;x<=W+10;x+=16){d+=` L${x} ${(base-amp*(0.6*Math.sin(x/190+p1)+0.4*Math.sin(x/83+p2))).toFixed(0)}`}return `<path d="${d} L${W+10} ${H} Z" fill="${fill}" ${extra}/>`}

function pine(x,y,h){const w=h*.4;let o='';for(let i=0;i<4;i++){const ty=y-h+h*i/4.4,tw=w*(.42+i*.22),top=ty-h*.24,bot=ty+h*.2;o+=`<polygon points="${x},${top.toFixed(0)} ${(x-tw).toFixed(0)},${bot.toFixed(0)} ${(x+tw).toFixed(0)},${bot.toFixed(0)}" fill="${DARK}" stroke="${CREAM}" stroke-width="2.5" stroke-linejoin="round"/>`}return o+`<rect x="${x-4}" y="${y-h*.1}" width="8" height="${h*.12}" fill="${DARK}"/>`}
const CSS=`.sun{animation:sun 9s ease-in-out infinite alternate}.fl{animation:flick 3.4s ease-in-out infinite alternate}.sm{animation:smoke 9s ease-out infinite}.s1{animation:fall 24s linear infinite}.s2{animation:fall 15s linear infinite}.s3{animation:fall 9s linear infinite}.tw{animation:tw 4s ease-in-out infinite alternate}
@keyframes sun{from{opacity:.8}to{opacity:1}}@keyframes flick{0%{opacity:.78}40%{opacity:1}70%{opacity:.88}100%{opacity:.96}}@keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:.8}100%{opacity:0;transform:translate(70px,-190px) scale(2.6)}}@keyframes fall{from{transform:translate(0,-30px)}to{transform:translate(-70px,960px)}}@keyframes tw{from{opacity:.3}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.sun,.fl,.sm,.s1,.s2,.s3,.tw{animation:none}}`
export function buildScene(){
 const rand=rng(41),cx=1170,cy=690
 const defs='<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>'+
 `<pattern id="hz" width="14" height="11" patternUnits="userSpaceOnUse"><rect width="14" height="2.4" fill="${LINE}"/></pattern><pattern id="dg" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="12" height="3" fill="${CREAM}" opacity=".55"/></pattern><pattern id="hz2" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="2.5" fill="${DARK}"/></pattern>`
 let art=`<rect width="${W}" height="640" fill="url(#hz)"/>`
 art+=hills(610,70,3,DARK,`stroke="${CREAM}" stroke-width="5"`)+hills(610,70,3,'url(#dg)')
 art+=hills(680,55,8,DARK,`stroke="${CREAM}" stroke-width="3"`)+hills(760,38,13,'#e6dcc4',`stroke="${CREAM}" stroke-width="5"`)
 art+=`<rect x="${cx-100}" y="${cy-92}" width="200" height="98" fill="#d9ceb4" stroke="${DARK}" stroke-width="5"/><rect x="${cx-100}" y="${cy-92}" width="200" height="98" fill="url(#hz2)" opacity=".55"/>`
 art+=`<polygon points="${cx-126},${cy-88} ${cx},${cy-168} ${cx+126},${cy-88}" fill="${DARK}" stroke="${CREAM}" stroke-width="3"/><polygon points="${cx-126},${cy-88} ${cx},${cy-168} ${cx+126},${cy-88} ${cx+108},${cy-88} ${cx},${cy-150} ${cx-108},${cy-88}" fill="#e6dcc4"/>`
 art+=`<rect x="${cx+52}" y="${cy-186}" width="26" height="64" fill="#d9ceb4" stroke="${DARK}" stroke-width="5"/><rect x="${cx+12}" y="${cy-62}" width="46" height="68" fill="${DARK}"/>`
 art+=`<path d="M0 840 Q300 790 640 830 T1300 822 T1600 800 V900 H0Z" fill="#e6dcc4" stroke="${CREAM}" stroke-width="5"/>`
 for(let i=0;i<16;i++){const x=Math.round(rand()*W);if(x>520&&x<1330)continue;art+=pine(x,666+Math.round(rand()*12),50+Math.round(rand()*30))}
 art+=pine(90,905,400)+pine(230,890,270)+pine(-20,870,320)+pine(1500,905,430)+pine(1640,870,330)
 let out=`<rect width="${W}" height="${H}" fill="${BG}"/><g filter="url(#rough)">${art}</g>`
 out+=`<g class="sun"><circle cx="330" cy="200" r="70" fill="${CREAM}"/><circle cx="352" cy="186" r="62" fill="${BG}"/><circle cx="330" cy="200" r="96" fill="none" stroke="${CREAM}" stroke-width="3" stroke-dasharray="5 11"/></g>`
 for(let i=0;i<28;i++){const x=Math.round(rand()*W),y=Math.round(rand()*520);out+=`<path class="tw" d="M${x-5} ${y}h10M${x} ${y-5}v10" stroke="${CREAM}" stroke-width="2" style="animation-delay:${(-rand()*4).toFixed(1)}s"/>`}
 out+=`<g class="fl"><rect x="${cx-78}" y="${cy-66}" width="52" height="42" fill="${RED}" stroke="${DARK}" stroke-width="4"/><path d="M${cx-52} ${cy-66}v42M${cx-78} ${cy-45}h52" stroke="${DARK}" stroke-width="3"/></g>`
 for(let i=0;i<6;i++)out+=`<circle class="sm" cx="${cx+65}" cy="${cy-196}" r="10" fill="${DARK}" stroke="${CREAM}" stroke-width="3" style="animation-delay:${(-i*1.5).toFixed(1)}s"/>`
 const flakes=(n,a,b,c,d,op)=>{for(let i=0;i<n;i++)out+=`<circle class="${c}" cx="${Math.round(rand()*(W+120))}" cy="0" r="${(a+rand()*(b-a)).toFixed(1)}" fill="${CREAM}" opacity="${op}" style="animation-delay:${(-rand()*d).toFixed(1)}s"/>`}
 flakes(50,1.6,2.4,'s1',24,.8);flakes(28,2.4,3.4,'s2',15,.88);flakes(12,3.8,5,'s3',9,.95)
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`}
