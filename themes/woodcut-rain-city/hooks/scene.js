// Woodcut Rain City: an original woodcut-style scene.
// Pure SVG + CSS animation: no script, nothing loaded.

const W=1600,H=900,BG='#13151b',LINE='#2a3040',CREAM='#ece3cc',DARK='#07090d',RED='#ee7a3e'
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function hills(base,amp,seed,fill,extra=''){const r=rng(seed),p1=r()*6.28,p2=r()*6.28;let d=`M-10 ${H}`;for(let x=-10;x<=W+10;x+=16){d+=` L${x} ${(base-amp*(0.6*Math.sin(x/190+p1)+0.4*Math.sin(x/83+p2))).toFixed(0)}`}return `<path d="${d} L${W+10} ${H} Z" fill="${fill}" ${extra}/>`}

const CSS=`.rn1{animation:rain 1.1s linear infinite}.rn2{animation:rain 0.8s linear infinite}.wn{animation:wn 6s steps(1,end) infinite}.wo{animation:wo 3.4s ease-in-out infinite alternate}.mo{animation:mo 9s ease-in-out infinite alternate}
@keyframes rain{from{transform:translate(0,-60px)}to{transform:translate(-26px,60px)}}@keyframes wn{0%,100%{opacity:1}40%{opacity:.15}55%{opacity:1}}@keyframes wo{from{opacity:.75}to{opacity:1}}@keyframes mo{from{opacity:.85}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.rn1,.rn2,.wn,.wo,.mo{animation:none}}`
export function buildScene(){
 const rand=rng(17)
 const defs='<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>'+
 `<pattern id="hz" width="14" height="11" patternUnits="userSpaceOnUse"><rect width="14" height="2.4" fill="${LINE}"/></pattern><pattern id="dg" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="12" height="2.6" fill="${CREAM}" opacity=".5"/></pattern>`
 let art=`<rect width="${W}" height="700" fill="url(#hz)"/>`
 // far skyline, hatched
 let sk='M0 700';for(let x=0;x<W;x+=40){sk+=` V${560+Math.round(rand()*70)} h40`}
 art+=`<path d="${sk} V700 H${W} V900 H0Z" fill="url(#dg)"/>`
 art+=`<rect y="700" width="${W}" height="200" fill="${DARK}"/>`
 // towers at the edges, low in the middle
 const tower=(x,w,top,seed)=>{const r=rng(seed);let o=`<rect x="${x}" y="${top}" width="${w}" height="${700-top}" fill="${DARK}" stroke="${CREAM}" stroke-width="3"/>`;let wi='';for(let yy=top+26;yy<680;yy+=34)for(let xx=x+16;xx<x+w-20;xx+=30){if(r()<.55)wi+=`<rect class="${r()<.12?'wn':''}" x="${xx}" y="${yy}" width="14" height="18" fill="${r()<.18?RED:CREAM}"/>`}return o+wi}
 let tw=''
 tw+=tower(20,150,240,1)+tower(180,120,330,2)+tower(300,110,450,3)+tower(1130,110,470,4)+tower(1250,130,340,5)+tower(1390,190,200,6)
 // mid-ground low blocks
 for(let x=430;x<1120;x+=70){const h=40+Math.round(rand()*50);tw+=`<rect x="${x}" y="${700-h}" width="62" height="${h}" fill="${DARK}" stroke="${CREAM}" stroke-width="2"/>`}
 // street reflections
 let st='';for(let i=0;i<14;i++){const x=Math.round(rand()*W);st+=`<path d="M${x} 712v${30+Math.round(rand()*70)}" stroke="${rand()<.3?RED:CREAM}" stroke-width="5" opacity=".7"/>`}
 st+=`<path d="M0 700H${W}" stroke="${CREAM}" stroke-width="4"/>`
 let out=`<rect width="${W}" height="${H}" fill="${BG}"/><g filter="url(#rough)">${art}${tw}${st}</g>`
 out+=`<g class="mo"><circle cx="760" cy="190" r="64" fill="${CREAM}"/><path d="M640 215q60 -30 120 0t120 0" fill="none" stroke="${BG}" stroke-width="16"/><path d="M630 240q70 -34 140 0t140 0" fill="none" stroke="${BG}" stroke-width="14"/></g>`
 const streaks=(n,cls,len,sw,op)=>{let o='';for(let i=0;i<n;i++){const x=Math.round(rand()*(W+60)),y=Math.round(rand()*H);o+=`<path d="M${x} ${y}l-${(len*.4).toFixed(0)} ${len}" stroke="${CREAM}" stroke-width="${sw}" opacity="${op}"/>`}return `<g class="${cls}">${o}</g>`}
 out+=streaks(90,'rn1',26,1.6,.45)+streaks(60,'rn2',38,2.2,.6)
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${CSS}</style>${out}</svg>`}
