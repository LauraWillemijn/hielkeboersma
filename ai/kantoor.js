/* Live kantoor: het AI-team aan het werk. Tekent de ruimte als SVG en volgt de statusfeed. */
(()=>{
const root=document.querySelector('.kantoor');if(!root||!window.avatar)return;
const T=window.TEAM;
T.hielke={name:'Hielke',role:'founder',bg:'#dce8fa',skin:'#f1c8a8',hair:'#3b2a20',hs:'short',shirt:'#3563a8',acc:[]};
const KEYS=['sam','ada','otto','max','coco','zoe','wes','gijs','vera','abel','rosa','pim'];
const ROLE={sam:'sales',ada:'assistent',otto:'offertes',max:'marketing',coco:'copy',wes:'websites',zoe:'SEO',gijs:'design',vera:'video',abel:'audio',rosa:'radio',pim:'presentaties',hielke:'founder'};
const LABEL={
 sam:{leads:'Leads zoeken',followup:'Follow-ups klaarzetten',dag:'Dagafsluiting maken',week:'Weekreview maken',mail:'Mails klaarzetten',onderzoek:'Onderzoek doen'},
 ada:{inbox:'Inbox bijwerken',agenda:'Agenda bijwerken',meeting:'Gesprek voorbereiden',mailklaar:'Mail klaarzetten',taak:'Opdracht uitvoeren'},
 otto:{offerte:'Offerte uitrekenen'},max:{social:'Social post maken',idee:'Idee uitwerken'},coco:{mail:'Mail schrijven',copy:'Tekst schrijven'},
 wes:{web:'Website aanpassen'},zoe:{seo:'Vindbaarheid verbeteren'},gijs:{design:'Beeld ontwerpen'},vera:{video:'Video maken'},
 abel:{audio:'Stem en geluid maken'},rosa:{radio:'Draaiboek maken'},pim:{deck:'Presentatie bouwen'}};
Object.values(LABEL).forEach(o=>o.vraag='Vraag voor Hielke');
const ICON={sales:'M4 17l5-5 4 3 7-8M15 7h5v5',assistent:'M4 6h16v13H4zM4 10h16M8 4v4M16 4v4',offertes:'M15 6a6 6 0 100 12M5 10h8M5 14h8',marketing:'M4 10v4l3 1 9 4V5L7 9zM19 9a4 4 0 010 6',copy:'M5 6h14M5 10h14M5 14h9M5 18h6',websites:'M9 8l-4 4 4 4M15 8l4 4-4 4',SEO:'M11 5a6 6 0 100 12 6 6 0 000-12M16 16l4 4',design:'M12 4l8 14H4zM12 13a2 2 0 100 .1',video:'M5 5h14v14H5zM10 9l5 3-5 3z',audio:'M5 10v4M9 7v10M13 4v16M17 8v8M21 11v2',radio:'M12 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3M6 11a6 6 0 0012 0M12 17v3',presentaties:'M4 5h16v10H4zM12 15v4M8 20h8'};

/* ---------- projectie ---------- */
const A=56,B=28,OX=752,OY=214,W=1560,H=1000,WALL=190;
const P=(x,y,z=0)=>[OX+(x-y)*A,OY+(x+y)*B-z];
const pt=p=>{const q=P(...p);return q[0].toFixed(1)+','+q[1].toFixed(1)};
const poly=(pts,fill,extra='')=>`<polygon points="${pts.map(pt).join(' ')}" fill="${fill}" ${extra}/>`;
function box(x,y,w,d,h,c,z=0){
 return poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],c.l)
  +poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],c.r)
  +poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],c.t);
}
const WOOD={t:'#f1e9dc',l:'#cfc4b1',r:'#b5a994'},DARK={t:'#33466a',l:'#22314d',r:'#1a2740'};
const disc=(x,y,z,r,top,side,th=7)=>{const[cx,cy]=P(x,y,z),rx=r*A*1.414,ry=r*B*1.414;
 return `<path d="M${cx-rx} ${cy}v${th}a${rx} ${ry} 0 00${2*rx} 0v${-th}z" fill="${side}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${top}"/>`};

/* ---------- indeling ---------- */
const HALL=5.0,COLS=[5.2,7.9,10.6],ROWS=[6.0,7.9,9.8,11.7];
const DESK={};KEYS.forEach((k,i)=>{const x0=COLS[i%3],y0=ROWS[Math.floor(i/3)];
 DESK[k]={x0,y0,seat:[x0+1,y0-.55],gap:i%3===0?x0-.4:x0-.35}});
DESK.hielke={x0:1.2,y0:8.55,seat:[2.2,8.0]};
const RADIO={x0:1.2,y0:11.6,seat:[2.2,11.05]};
const MEET=[[1.25,2.4],[3.15,2.4],[2.2,3.3],[2.2,1.5]];
const IDLE={ /* [x,y,houding] */
 rosa:[10.55,2.3,'sit'],vera:[12.65,2.3,'sit'],max:[11.0,1.15,'stand'],abel:[12.9,1.15,'stand'],
 otto:[10.25,4.0,'pp'],wes:[13.55,4.0,'pp'],sam:[5.6,2.0,'stand'],ada:[6.9,2.3,'stand'],
 coco:[1.55,4.95,'sit'],zoe:[1.55,6.05,'sit'],gijs:[7.85,3.5,'stand'],pim:[9.2,3.5,'stand']};

/* ---------- ruimte ---------- */
let room='',objs=[];
const add=(d,html,cls='')=>objs.push({d,html:`<g class="${cls}">${html}</g>`});
room+=poly([[0,0],[14,0],[14,13],[0,13]],'#1c2a42');
for(let i=1;i<14;i++)room+=`<path d="M${pt([i,0])}L${pt([i,13])}" stroke="rgba(255,255,255,.035)"/>`;
for(let j=1;j<13;j++)room+=`<path d="M${pt([0,j])}L${pt([14,j])}" stroke="rgba(255,255,255,.035)"/>`;
{const[cx,cy]=P(8.6,8.6);room+=`<ellipse cx="${cx}" cy="${cy}" rx="520" ry="250" fill="url(#k-pool)"/>`}
room+=poly([[0,0,0],[14,0,0],[14,0,WALL],[0,0,WALL]],'url(#k-wr)')+poly([[0,0,0],[0,13,0],[0,13,WALL],[0,0,WALL]],'url(#k-wl)');
room+=`<path d="M${pt([0,13,WALL])}L${pt([0,0,WALL])}L${pt([14,0,WALL])}" fill="none" stroke="#3a5282" stroke-width="2"/>`;
room+=`<path class="k-neon" d="M${pt([0,13,3])}L${pt([0,0,3])}L${pt([14,0,3])}" fill="none" stroke="#2563ff" stroke-width="3"/>`;
/* vloerzones */
room+=poly([[9.7,.8],[13.9,.8],[13.9,4.75],[9.7,4.75]],'rgba(92,200,255,.05)');
room+=poly([[.35,7],[4,7],[4,9.7],[.35,9.7]],'rgba(92,200,255,.07)')+poly([[.35,10],[4,10],[4,12.8],[.35,12.8]],'rgba(92,200,255,.07)','class="k-studiofloor"');
{const[cx,cy]=P(2.2,2.4);room+=`<ellipse cx="${cx}" cy="${cy}" rx="150" ry="75" fill="rgba(37,99,255,.10)"/>`}
/* rechtermuur: scherm en kantine */
room+=`<g transform="matrix(1 .5 0 1 ${OX} ${OY})">
 <rect x="236" y="-176" width="292" height="118" rx="8" fill="#0b1220" stroke="#2f4a7a" stroke-width="2"/>
 <text x="254" y="-150" class="k-w1">MIJN AI-TEAM</text><text x="510" y="-150" class="k-w1" text-anchor="end" id="k-clock"></text>
 <text x="254" y="-116" class="k-w2" id="k-count">12 collega's</text>
 <text x="254" y="-92" class="k-w3" id="k-f0"></text><text x="254" y="-74" class="k-w3" id="k-f1"></text>
 <g class="k-sign"><text x="590" y="-128" class="k-neont">Kantine</text>
 <path d="M700 -150h30v14a12 12 0 01-12 12h-6a12 12 0 01-12-12zM730 -146h6a6 6 0 010 12h-6M708 -158v-8M716 -158v-8M724 -158v-8" fill="none" stroke="#ffb86b" stroke-width="3" stroke-linecap="round"/></g>
 <g class="k-sign"><circle cx="124" cy="-118" r="34" fill="none" stroke="#5cc8ff" stroke-width="2.5"/><circle cx="124" cy="-118" r="13" fill="#5cc8ff"/>
 <circle cx="124" cy="-152" r="5" fill="#5cc8ff"/><circle cx="158" cy="-118" r="4" fill="#fff"/><circle cx="100" cy="-94" r="6" fill="#2563ff"/><circle cx="92" cy="-130" r="3.5" fill="#fff"/></g>
</g>`;
/* linkermuur: ramen en on air */
room+=`<g transform="matrix(1 -.5 0 1 ${OX} ${OY})">
 ${[[-240,170],[-530,130]].map(([x,w])=>`<rect class="k-win" x="${x}" y="-168" width="${w}" height="112" rx="6"/><path d="M${x+w/2} -168v112M${x} -112h${w}" stroke="#1a2740" stroke-width="3"/>`).join('')}
 <g id="k-onair"><rect x="-700" y="-172" width="130" height="38" rx="8" fill="#12090c" stroke="#5a2630" stroke-width="2"/><text x="-635" y="-146" text-anchor="middle" class="k-onairt">ON AIR</text></g>
</g>`;
/* planten */
const plant=(x,y,s=1)=>{const[cx,cy]=P(x,y,26);return box(x-.16,y-.16,.32,.32,26,{t:'#e9e2d6',l:'#cfc6b6',r:'#b3a996'})+
 `<g class="k-plant"><ellipse cx="${cx-12*s}" cy="${cy-30*s}" rx="${13*s}" ry="${24*s}" fill="#2f7d5b" transform="rotate(-24 ${cx} ${cy})"/><ellipse cx="${cx+13*s}" cy="${cy-28*s}" rx="${12*s}" ry="${22*s}" fill="#3a9770" transform="rotate(22 ${cx} ${cy})"/><ellipse cx="${cx}" cy="${cy-40*s}" rx="${11*s}" ry="${28*s}" fill="#3fa877"/></g>`};
[[.5,.5,1.3],[13.5,5.4,1],[3.5,6.2,1.1],[13.4,12.4,1.2]].forEach(([x,y,s])=>add(x+y,plant(x,y,s)));
/* overlegtafel */
add(4.6,disc(2.2,2.4,34,.72,'#f1e9dc','#b5a994')+`<rect x="${P(2.2,2.4)[0]-6}" y="${P(2.2,2.4,30)[1]}" width="12" height="30" fill="#1a2740"/>`);
/* kantine */
[0,1,2].forEach(i=>add(10.8+i+.38,box(10.3+i,.06,1,.64,44,DARK)+(i===0?box(10.5,.15,.5,.4,30,{t:'#0f1826',l:'#131d2e',r:'#0c1422'},44)+`<circle cx="${P(10.75,.55,62)[0]}" cy="${P(10.75,.55,62)[1]}" r="3" fill="#5cc8ff" class="k-led"/>`:'')
 +(i===2?`<circle cx="${P(12.7,.4,47)[0]}" cy="${P(12.7,.4,47)[1]}" r="6" fill="#f1e9dc"/><circle cx="${P(13,.35,47)[0]}" cy="${P(13,.35,47)[1]}" r="6" fill="#ffb86b"/>`:'')));
add(12.0,disc(8.52,3.5,46,.36,'#f1e9dc','#b5a994',5)+`<rect x="${P(8.52,3.5)[0]-4}" y="${P(8.52,3.5,42)[1]}" width="8" height="42" fill="#1a2740"/><circle cx="${P(8.42,3.45,49)[0]}" cy="${P(8.42,3.45,49)[1]}" r="4.5" fill="#fff"/><circle cx="${P(8.66,3.56,49)[0]}" cy="${P(8.66,3.56,49)[1]}" r="4.5" fill="#ffb86b"/>`);
add(13.92,disc(11.6,2.3,30,.58,'#f1e9dc','#b5a994')+`<circle cx="${P(11.45,2.25,33)[0]}" cy="${P(11.45,2.25,33)[1]}" r="5" fill="#fff"/><circle cx="${P(11.8,2.4,33)[0]}" cy="${P(11.8,2.4,33)[1]}" r="5" fill="#ffb86b"/>`);
{const a=P(10.9,4,58),b=P(12.9,4,58);
 add(15.9,box(10.8,3.45,2.2,1.1,5,{t:'#2b54a8',l:'#1f3f80',r:'#1a356c'},30)+box(11.0,3.6,.1,.1,30,DARK)+box(12.7,4.3,.1,.1,30,DARK)
 +`<path d="M${pt([10.8,4,35.5])}L${pt([13,4,35.5])}" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/>`
 +poly([[11.9,3.45,35],[11.9,4.55,35],[11.9,4.55,47],[11.9,3.45,47]],'rgba(255,255,255,.35)','stroke="rgba(255,255,255,.7)"')
 +`<g class="k-ball" style="--bx:${(b[0]-a[0]).toFixed(1)}px;--by:${(b[1]-a[1]).toFixed(1)}px"><circle cx="${a[0]}" cy="${a[1]}" r="5" fill="#ffb86b"/></g>`,'k-pp');}
/* bank */
add(6.6,box(.35,4.4,.3,2.2,46,{t:'#a5644b',l:'#7d4937',r:'#6c3f30'})+box(.65,4.4,.75,2.2,22,{t:'#b7735a',l:'#8a513d',r:'#774535'}));
/* glazen kantoor van de founder */
const GL='stroke="rgba(126,196,255,.42)" stroke-width="1.5"',glass=(pts,d,f='rgba(126,196,255,.07)')=>add(d,poly(pts,f,GL));
glass([[.35,7,0],[4,7,0],[4,7,150],[.35,7,150]],8.0);
glass([[.35,10,0],[4,10,0],[4,10,150],[.35,10,150]],12.9);
add(13.0,poly([[4,7,0],[4,7.55,0],[4,7.55,150],[4,7,150]],'rgba(126,196,255,.07)',GL)+poly([[4,8.6,0],[4,10,0],[4,10,150],[4,8.6,150]],'rgba(126,196,255,.07)',GL));
add(15.6,poly([[4,10,0],[4,10.6,0],[4,10.6,150],[4,10,150]],'rgba(126,196,255,.07)',GL)+poly([[4,11.6,0],[4,12.8,0],[4,12.8,150],[4,11.6,150]],'rgba(126,196,255,.07)',GL));
/* radiostudio: tafel met mengpaneel en microfoon */
{const{x0,y0}=RADIO,z=38,sk='#f2cdae',m1=P(x0+.35,y0+.2,z),m2=P(x0+.5,y0-.05,z+50),m3=P(x0+.74,y0-.22,z+34),h1=P(x0+.86,y0+.14,z+9),h2=P(x0+1.2,y0+.14,z+9);
 add(x0+.5+y0+.47,box(x0+.06,y0+.1,.1,.75,32,DARK)+box(x0,y0,1,.95,6,WOOD,32),'kd kd-radio');
 add(x0+1.5+y0+.47,box(x0+1.42,y0+.06,.5,.83,32,DARK)+box(x0+1,y0,1,.95,6,WOOD,32)
  +box(x0+.55,y0+.3,1.0,.5,6,{t:'#1b2638',l:'#111a29',r:'#0c1422'},z)
  +[0,1,2,3,4].map(i=>{const q=P(x0+.68+i*.18,y0+.42+(i%2)*.16,z+7);return`<circle class="k-fader" style="--i:${i}" cx="${q[0]}" cy="${q[1]}" r="3.2"/>`}).join('')
  +`<circle class="k-hand" cx="${h1[0]}" cy="${h1[1]}" r="6" fill="${sk}"/><circle class="k-hand h2" cx="${h2[0]}" cy="${h2[1]}" r="6" fill="${sk}"/>`
  +`<path d="M${m1[0]} ${m1[1]}L${m2[0]} ${m2[1]}L${m3[0]} ${m3[1]}" fill="none" stroke="#0f1826" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="${m3[0]-6}" y="${m3[1]-8}" width="12" height="20" rx="6" fill="#0f1826" stroke="#5a6b88" stroke-width="1.5"/>`,'kd kd-radio');}
/* bureaus */
function desk(k){const{x0,y0}=DESK[k],t=T[k],z=38,big=k==='hielke';
 const lid=[[x0+.68,y0+.58,z],[x0+1.32,y0+.58,z],[x0+1.32,y0+.67,z+31],[x0+.68,y0+.67,z+31]],lc=P(x0+1,y0+.625,z+16),hp=P(x0+1.66,y0+.42,z+40);
 const h1=P(x0+.84,y0+.17,z+3),h2=P(x0+1.16,y0+.17,z+3);
 const half=(xa,extra)=>box(xa,y0,1,.95,6,WOOD,32)+extra;
 const left=poly([[x0-.05,y0+.25],[x0+2.05,y0+.25],[x0+2.05,y0+1.2],[x0-.05,y0+1.2]],'rgba(5,10,20,.3)')+box(x0+.06,y0+.1,.1,.75,32,DARK)+half(x0,'');
 const right=box(x0+1.42,y0+.06,.5,.83,32,DARK)+half(x0+1,'')
  +poly([[x0+.68,y0+.2,z],[x0+1.32,y0+.2,z],[x0+1.32,y0+.58,z],[x0+.68,y0+.58,z]],'#c9d2e0')
  +`<circle class="k-hand" cx="${h1[0]}" cy="${h1[1]}" r="6" fill="${t.skin}"/><circle class="k-hand h2" cx="${h2[0]}" cy="${h2[1]}" r="6" fill="${t.skin}"/>`
  +poly(lid,'#2a3a56','stroke="#3d5380" stroke-width="1.2" class="k-lid"')+`<circle class="k-dot" cx="${lc[0]}" cy="${lc[1]}" r="4"/>`
  +(big?'':`<g class="k-holo" transform="translate(${hp[0]} ${hp[1]})"><g><rect x="-21" y="-17" width="42" height="34" rx="8"/><path d="${ICON[ROLE[k]]}" transform="translate(-12 -12)"/></g></g>`);
 add(x0+.5+y0+.47,left,'kd kd-'+k);add(x0+1.5+y0+.47,right,'kd kd-'+k);
}
[...KEYS,'hielke'].forEach(desk);

/* ---------- poppetjes ---------- */
/* Hielke zelf: donkere kuif, stoppelbaard, blauwe ogen, brede lach, donker overhemd */
const HIELKE=`<path d="M16 104 C16 76 32 66 50 66 C68 66 84 76 84 104 Z" fill="#1b2536"/>
<path d="M43 60 H57 V69 C57 74 43 74 43 69 Z" fill="#eec3a2"/><path d="M40 67 L50 77 L60 67" fill="none" stroke="#2b3954" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="29.5" cy="47" rx="3.5" ry="5" fill="#eec3a2"/><ellipse cx="70.5" cy="47" rx="3.5" ry="5" fill="#eec3a2"/>
<circle cx="50" cy="45" r="21" fill="#f2cdae"/>
<path d="M29.5 46 C30 70 70 70 70.5 46 C67 56 60 60 50 60 C40 60 33 56 29.5 46 Z" fill="#3a2a1f" opacity=".34"/>
<path d="M40 52.5 Q50 47.5 60 52.5 Q50 51 40 52.5 Z" fill="#3a2a1f" opacity=".3"/>
<circle cx="38" cy="51" r="3.2" fill="#e8768a" opacity=".2"/><circle cx="62" cy="51" r="3.2" fill="#e8768a" opacity=".2"/>
<path d="M38 40.6 Q42.5 38 47 40.4" fill="none" stroke="#33241a" stroke-width="2.4" stroke-linecap="round"/><path d="M53 40.4 Q57.5 38 62 40.6" fill="none" stroke="#33241a" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="43" cy="46" r="2.7" fill="#3f74b8"/><circle cx="57" cy="46" r="2.7" fill="#3f74b8"/><circle cx="43" cy="46" r="1.3" fill="#172232"/><circle cx="57" cy="46" r="1.3" fill="#172232"/><circle cx="43.9" cy="45.1" r=".7" fill="#fff"/><circle cx="57.9" cy="45.1" r=".7" fill="#fff"/>
<g class="lid" fill="#f2cdae"><circle cx="43" cy="46" r="3.5"/><circle cx="57" cy="46" r="3.5"/></g>
<path d="M42.5 53.2 Q50 61.5 57.5 53.2 Z" fill="#fff" stroke="#172232" stroke-width="1.7" stroke-linejoin="round"/>
<path d="M28 45 C24 25 36 12 52 12.5 C68 13 77 26 72 45 C70.5 37 66 31.5 59 29.5 C50 27 41 28.5 35 33 C31.5 36 29.5 40 28 45 Z" fill="#3a2a1f"/>
<path d="M33 25 C37 9 59 5 68 17 C60 12.5 46 14 33 25 Z" fill="#4a3628"/>`;
function figure(k){const t=T[k];
 return `<g transform="scale(.76)"><ellipse class="kc-sh" cx="0" cy="0" rx="30" ry="11"/>
 <rect class="kc-chair" x="-35" y="-100" width="70" height="88" rx="18"/>
 <g class="kc-legs"><rect x="-19" y="-30" width="15" height="28" rx="6"/><rect x="4" y="-30" width="15" height="28" rx="6"/></g>
 <g class="kc-up"><rect x="-31" y="-64" width="62" height="38" rx="13" fill="${t.shirt}"/>
 <g class="kc-head"><svg x="-55" y="-166" width="110" height="110" viewBox="0 0 100 100" overflow="visible">${k==='hielke'?HIELKE:avatar(k,1)}</svg></g>
 ${k==='otto'||k==='wes'?`<g class="kc-bat"><rect x="${k==='otto'?30:-36}" y="-66" width="6" height="16" rx="3" fill="#cfc4b1"/><circle cx="${k==='otto'?33:-33}" cy="-76" r="12" fill="#e0453a"/></g>`:''}
 ${k==='hielke'?'':`<g class="kc-food"><rect x="17" y="-60" width="24" height="14" rx="6" fill="#e2b56f"/><rect x="17" y="-55" width="24" height="3.5" fill="#5aa35a"/><circle cx="30" cy="-45" r="6" fill="${t.skin}"/></g><g class="kc-beer"><rect x="21" y="-68" width="15" height="24" rx="3" fill="#f2a93b"/><rect x="20" y="-72" width="17" height="8" rx="4" fill="#fff"/><circle cx="29" cy="-43" r="6" fill="${t.skin}"/></g>`}
 ${k==='hielke'?`<g class="kc-hp"><path d="M-25 -112a25 25 0 0150 0" fill="none" stroke="#101926" stroke-width="5"/><rect x="-31" y="-118" width="10" height="17" rx="5" fill="#2563ff"/><rect x="21" y="-118" width="10" height="17" rx="5" fill="#2563ff"/></g>`:''}
 </g></g>`}
const C={};
[...KEYS,'hielke'].forEach(k=>{C[k]={k,pos:[0,0],q:[],mode:null,task:'',pose:'stand',grp:null}});

/* ---------- opbouw DOM ---------- */
const stage=root.querySelector('.k-stage');
stage.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Het kantoor van het AI-team, met elke collega aan een eigen bureau">
<defs><radialGradient id="k-pool"><stop offset="0" stop-color="#3d5f9e" stop-opacity=".34"/><stop offset="1" stop-color="#3d5f9e" stop-opacity="0"/></radialGradient><linearGradient id="k-wr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141f33"/><stop offset="1" stop-color="#1e2d49"/></linearGradient><linearGradient id="k-wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2740"/><stop offset="1" stop-color="#263857"/></linearGradient><filter id="k-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g>${room}</g><g id="k-links"></g><g id="k-objs"></g><g id="k-fx"></g></svg><div class="k-labels" aria-hidden="true"></div>`;
const svg=stage.querySelector('svg'),gObjs=svg.querySelector('#k-objs'),gLinks=svg.querySelector('#k-links'),gFx=svg.querySelector('#k-fx'),labels=stage.querySelector('.k-labels');
const NS='http://www.w3.org/2000/svg';
objs.forEach(o=>{const g=document.createElementNS(NS,'g');g.innerHTML=o.html;g.dataset.d=o.d;gObjs.appendChild(g)});
Object.values(C).forEach((c,i)=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','kc kc-'+c.k);g.style.setProperty('--r',(i*.37%1).toFixed(2));g.innerHTML=figure(c.k);gObjs.appendChild(g);c.el=g;
 const l=document.createElement('div');l.className='kl';l.innerHTML=`<span class="n"><b>${T[c.k].name}</b> · ${ROLE[c.k]}</span><span class="s"><u></u><i></i></span>`;labels.appendChild(l);c.lab=l});
const deskEls=k=>gObjs.querySelectorAll('.kd-'+k);
function sort(){const ch=[...gObjs.children];const s=ch.slice().sort((a,b)=>a.dataset.d-b.dataset.d);for(let i=0;i<s.length;i++)if(s[i]!==ch[i]){s.forEach(n=>gObjs.appendChild(n));break}}
function place(c){const[sx,sy]=P(c.pos[0],c.pos[1]);c.el.setAttribute('transform',`translate(${sx.toFixed(1)} ${(sy-(c.hop||0)).toFixed(1)})`);c.el.dataset.d=c.pos[0]+c.pos[1]+.01;
 const side=c.lab.dataset.kind&&c.lab.dataset.kind!=='idle'&&c.lab.dataset.kind!=='break',flip=side&&sx>1250;
 const top=side?(c.pose==='stand'?88:c.pose==='desk'?60:68):(c.pose==='stand'?120:c.pose==='desk'?97:104);
 c.lab.style.left=(sx+(side?(flip?-24:24):0))/W*100+'%';c.lab.style.top=(sy-top)/H*100+'%';
 c.lab.classList.toggle('side',side);c.lab.classList.toggle('flip',flip)}
function pose(c,p){c.pose=p;c.el.classList.remove('p-stand','p-desk','p-sit','p-pp');c.el.classList.add('p-'+(p==='pp'?'stand':p));c.el.classList.toggle('p-pp',p==='pp');place(c);ppCheck()}
function ppCheck(){const on=!brk&&C.otto.pose==='pp'&&C.wes.pose==='pp'&&!C.otto.q.length&&!C.wes.q.length;svg.classList.toggle('pp-on',on)}
let brk='';
function setLabel(c,text,kind){c.lab.querySelector('i').textContent=text;c.lab.dataset.kind=kind;if(c.placed)place(c)}

/* ---------- lopen ---------- */
const spotVia=(c,spot)=>{ /* tussenpunten van een plek naar de gang */
 const[x,y]=spot;const d=DESK[c.k];
 if(c.k!=='hielke'&&d.seat[0]===x&&d.seat[1]===y)return[[d.gap,y],[d.gap,HALL]];
 if(x<4.1&&y>=7)return[[4.5,y],[4.5,HALL]];
 if(x>9.5){if(y>3.4)return[[x,HALL]];return[[9.75,y],[9.75,HALL]]}
 if(y>4.4)return[[2.4,y],[2.4,HALL]];
 if(y<2)return[[3.4,y],[3.4,HALL]];
 return[[x,HALL]]};
function route(c,to){const a=spotVia(c,c.pos),b=spotVia(c,to).reverse();const pts=[...a,...b,to];
 return pts.filter((p,i)=>i===0||Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1])>.05).map(p=>({go:p}))}
let reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,running=false,visible=false,last=0,frame=0;
function tick(now){const dt=Math.min(.3,(now-last)/1000||0);last=now;let busy=false;
 Object.values(C).forEach(c=>{const s=c.q[0];if(!s)return;busy=true;
  if(s.fn){s.fn();c.q.shift();return}
  if(s.wait!=null){s.wait-=dt*1000;if(s.wait<=0)c.q.shift();return}
  const dx=s.go[0]-c.pos[0],dy=s.go[1]-c.pos[1],dist=Math.hypot(dx,dy),step=3.1*dt;
  if(dist<=step){c.pos=s.go.slice();c.q.shift();c.hop=0}else{c.pos[0]+=dx/dist*step;c.pos[1]+=dy/dist*step;c.hop=Math.abs(Math.sin(now/95+c.pos[0]))*5}
  c.el.classList.toggle('walk',!!(c.q[0]&&c.q[0].go));place(c)});
 if(busy&&++frame%5===0)sort();
 if(busy&&visible)requestAnimationFrame(tick);else{running=false;sort();ppCheck()}}
function kick(){if(!running&&visible){running=true;last=performance.now();requestAnimationFrame(tick)}}
function walk(c,to,then,keep){
 if(!keep)c.q=c.q.filter((s,i)=>i===0&&s.go); /* nieuwe opdracht: oude plannen vervallen */
 if(reduce||!visible||!c.placed){c.pos=to.slice();c.q=[];c.placed=true;c.el.classList.remove('walk');then&&then();place(c);sort();return}
 /* route pas uitrekenen als de stap aan de beurt is: het poppetje kan dan al ergens anders staan */
 c.q.push({fn:()=>{pose(c,'stand');c.q.splice(1,0,...route(c,to),{fn:()=>{then&&then()}})}});kick()}

/* ---------- toestanden ---------- */
function goWork(c,task,meetAt){const d=DESK[c.k];c.mode='work';c.task=task;c.el.classList.remove('idle');
 setLabel(c,meetAt?'Even overleggen':'Onderweg naar bureau','go');
 const sit=()=>{if(c.mode!=='work')return;pose(c,'desk');c.el.classList.add('work');deskEls(c.k).forEach(e=>e.classList.add('on'));setLabel(c,task,'work');links()};
 if(meetAt){walk(c,meetAt);if(c.q.length)c.q.push({wait:3200});walk(c,d.seat,sit,true)}else walk(c,d.seat,sit)}
function idleLabel(c){const b=c.k!=='hielke'?brk:'';c.lab.querySelector('.n').dataset.t=b==='lunch'?'lunch':b?'borrel':'';setLabel(c,'Stand-by',b?'break':'idle')}
function leave(c){c.el.classList.remove('work','idle');deskEls(c.k).forEach(e=>e.classList.remove('on'))}
function goIdle(c){const[x,y,p]=IDLE[c.k];c.mode='idle';c.task='';leave(c);
 idleLabel(c);links();walk(c,[x,y],()=>{if(c.mode==='idle'){pose(c,p);c.el.classList.add('idle')}})}
/* met een vraag naar Hielke lopen: naar zijn kantoor, of naar de studio als hij uitzendt */
const ASKSPOT={office:[[3.35,8.1],[3.25,7.4],[1.1,7.9]],studio:[[3.35,11.1],[3.25,10.45],[1.1,10.9]]};
function goAsk(c){c.mode='ask';c.task='Vraag voor Hielke';leave(c);links();
 const n=KEYS.filter(k=>C[k].mode==='ask').indexOf(c.k),spot=ASKSPOT[founder==='onair'?'studio':'office'][n%3];
 setLabel(c,'Loopt naar Hielke','go');walk(c,spot,()=>{if(c.mode==='ask'){pose(c,'stand');setLabel(c,'Vraagt iets aan Hielke','ask')}})}
/* antwoord gekregen en verder niets te doen: eerst terug naar de werkplek, dan pas pauze */
function backThenIdle(c){const d=DESK[c.k];c.mode='idle';c.task='';
 walk(c,d.seat,()=>{pose(c,'desk');c.el.classList.add('work');deskEls(c.k).forEach(e=>e.classList.add('on'));setLabel(c,'Verwerkt het antwoord','work')});
 c.q.push({wait:7000},{fn:()=>{if(c.mode==='idle')goIdle(c)}});kick()}
function links(){const groups={};Object.values(C).forEach(c=>{if(c.mode==='work'&&c.grp&&c.pose==='desk')(groups[c.grp]=groups[c.grp]||[]).push(c)});
 let h='';Object.values(groups).forEach(g=>{for(let i=1;i<g.length;i++){const a=DESK[g[i-1].k],b=DESK[g[i].k],p=P(a.x0+1,a.y0+1.15),q=P(b.x0+1,b.y0+1.15);
  h+=`<path class="k-link" d="M${p[0]} ${p[1]}Q${(p[0]+q[0])/2} ${(p[1]+q[1])/2+46} ${q[0]} ${q[1]}"/>`}});gLinks.innerHTML=h}
let base={},baseSrc='rooster',demo=null,founder=null;
function apply(target,opts={}){ /* target: {key:{k,grp,src}} */
 const starters=KEYS.filter(k=>target[k]&&target[k].k!=='vraag'&&C[k].mode==='idle');
 const meet=opts.meet&&starters.length>1;
 KEYS.forEach(k=>{const c=C[k],t=target[k];
  if(t&&t.k==='vraag'){if(c.mode!=='ask')goAsk(c);return}
  if(t){const task=(LABEL[k]||{})[t.k];if(!task)return;c.grp=t.grp||null;
   if(c.mode!=='work'){const go=()=>goWork(c,task,meet&&starters.includes(k)?MEET[starters.indexOf(k)%4]:null);
    if(opts.fly&&c.placed&&!reduce&&visible)fly(c,go,starters.indexOf(k)*350);else go()}
   else if(c.task!==task){c.task=task;setLabel(c,task,'work')}}
  else if(c.mode==='ask')backThenIdle(c);
  else if(c.mode!=='idle')goIdle(c)});
 links();summary()}
function fly(c,done,delay){const from=P(...C.hielke.pos),g=document.createElementNS(NS,'g');g.setAttribute('class','k-msg');
 g.innerHTML='<circle r="15"/><path d="M-7 1l15-7-5 14-3-5z"/>';gFx.appendChild(g);const t0=performance.now()+delay;
 (function f(now){const p=Math.min(1,Math.max(0,(now-t0)/1100)),to=P(c.pos[0],c.pos[1]),e=p*p*(3-2*p);
  g.setAttribute('transform',`translate(${from[0]+(to[0]-from[0])*e} ${from[1]-80+(to[1]-from[1])*e-Math.sin(p*Math.PI)*150})`);g.style.opacity=p<=0?0:1;
  if(p<1)requestAnimationFrame(f);else{g.remove();done()}})(performance.now())}
function setFounder(s){const c=C.hielke,was=founder;founder=s;svg.classList.remove('f-online','f-onair','f-away');svg.classList.add('f-'+s);
 const seat=s==='onair'?RADIO.seat:DESK.hielke.seat,off=()=>{c.el.classList.remove('work');deskEls('hielke').forEach(e=>e.classList.remove('on'));deskEls('radio').forEach(e=>e.classList.remove('on'))};
 const sit=()=>{pose(c,'desk');c.el.classList.toggle('work',founder!=='away');deskEls('hielke').forEach(e=>e.classList.toggle('on',founder==='online'));deskEls('radio').forEach(e=>e.classList.toggle('on',founder==='onair'))};
 c.el.classList.toggle('gone',s==='away');
 setLabel(c,s==='online'?'Geeft opdrachten':s==='onair'?'Live op SLAM!':'Even niet online',s==='online'?'work':s==='onair'?'air':'off');
 if(Math.hypot(c.pos[0]-seat[0],c.pos[1]-seat[1])<.05){off();sit();return}
 off();
 if(reduce||!visible||was===null){c.pos=seat.slice();c.q=[];sit();place(c);sort();return}
 /* via de deur van het ene glazen hok naar het andere */
 c.q=[{fn:()=>pose(c,'stand')},{go:[4.5,c.pos[1]]},{go:[4.5,seat[1]]},{go:seat.slice()},{fn:sit}];kick()}

/* ---------- tijd en rooster ---------- */
function nl(){const p=new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
 const g=t=>p.find(x=>x.type===t).value;return{d:['zo','ma','di','wo','do','vr','za'].indexOf(g('weekday').slice(0,2)),m:+g('hour')*60+ +g('minute')}}
const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function rooster(){const{d,m}=nl(),t={};if(d>=1&&d<=5){
 [[465,478,'leads'],[720,733,'leads'],[900,913,'leads'],[840,846,'followup']].forEach(([a,b,k])=>{if(m>=a&&m<b)t.sam={k}});
 if(d<=4&&m>=990&&m<996)t.sam={k:'dag'};if(d===5&&m>=960&&m<966)t.sam={k:'week'}}return t}
const FQ=new URLSearchParams(location.search).get('founder');
function founderNow(f){if(['online','onair','away'].includes(FQ))return FQ;const{d,m}=nl();if(f===1)return'online';if(d>=1&&d<=4&&m>=720&&m<960)return'onair';if(f===0)return'away';return d>=1&&d<=5&&m>=510&&m<1050?'online':'away'}

/* lunch op werkdagen van 12 tot 16 uur, vrijdagmiddagborrel vanaf 16:30 */
const BQ=new URLSearchParams(location.search).get('pauze');
function breakNow(){if(BQ==='lunch'||BQ==='borrel')return BQ;const{d,m}=nl();if(d===5&&m>=990&&m<1140)return'borrel';if(d>=1&&d<=5&&m>=720&&m<960)return'lunch';return''}
function setBreak(){const b=breakNow();if(b===brk)return;brk=b;svg.classList.toggle('t-lunch',b==='lunch');svg.classList.toggle('t-borrel',b==='borrel');
 KEYS.forEach(k=>{if(C[k].mode==='idle')idleLabel(C[k])});ppCheck()}

/* ---------- samenvatting, lijst en muurscherm ---------- */
const badge=root.querySelector('.k-badge'),list=root.querySelector('.k-list'),feedEl=root.querySelector('.k-feed');
let events=[];
list.innerHTML=KEYS.map(k=>`<li data-k="${k}"><span class="tw">${avatar(k)}</span><span><b>${T[k].name}</b> <em>${ROLE[k]}</em><small></small></span></li>`).join('');
function summary(){const n=KEYS.filter(k=>C[k].mode==='work').length,{m}=nl();
 svg.querySelector('#k-clock').textContent=hhmm(m);
 svg.querySelector('#k-count').textContent=n?`${n} van 12 aan het werk`:'Iedereen stand-by';
 const ev=events.slice(-2).reverse();['#k-f0','#k-f1'].forEach((id,i)=>{svg.querySelector(id).textContent=ev[i]||''});
 KEYS.forEach(k=>{const li=list.querySelector(`[data-k="${k}"]`),c=C[k];li.classList.toggle('on',c.mode==='work');li.classList.toggle('ask',c.mode==='ask');li.querySelector('small').textContent=c.mode==='work'?c.task:c.mode==='ask'?'Vraag voor Hielke':brk==='lunch'?'Lunchpauze':brk?'Vrijdagmiddagborrel':'Stand-by'});
 feedEl.innerHTML=events.slice(-4).reverse().map(e=>`<li>${e}</li>`).join('');
 const rows=KEYS.filter(k=>C[k].mode==='work').slice(0,3).map(k=>`<li><span class="tw">${avatar(k)}</span><span><b>${T[k].name}</b> is nu bezig: ${C[k].task.toLowerCase()}.</span></li>`).join('');
 window.KLIVE_ROWS=demo?'':rows;window.dispatchEvent(new Event('klive'))}
function setBadge(){badge.dataset.s=demo?'demo':baseSrc;const{m}=nl();
 badge.querySelector('span').textContent=demo?'Voorbeeld':baseSrc==='live'?'Live · '+hhmm(m):'Volgens rooster · '+hhmm(m)}

/* ---------- live feed ---------- */
const FEEDS=['https://api.github.com/repos/LauraWillemijn/hielkeboersma/contents/status.json?ref=status','https://raw.githubusercontent.com/LauraWillemijn/hielkeboersma/status/status.json'];
async function load(){for(const u of FEEDS){try{const r=await fetch(u,{headers:u.includes('api.')?{Accept:'application/vnd.github.raw+json'}:{},cache:'no-store'});if(!r.ok)continue;const j=await r.json();if(j&&j.t)return j}catch(e){}}return null}
let first=true,pushed=null;
/* seintje van de laptop: er is een nieuwe status. Het seintje bevat alleen het versienummer. */
try{const es=new EventSource('https://ntfy.sh/hb-kantoor-3a5815bd6ed10ab7/sse');
 es.onmessage=async e=>{try{const sha=(JSON.parse(e.data).message||'').trim();if(!/^[0-9a-f]{40}$/.test(sha))return;
  const r=await fetch(`https://raw.githubusercontent.com/LauraWillemijn/hielkeboersma/${sha}/status.json`);if(!r.ok)return;const j=await r.json();
  if(j&&j.t&&(!pushed||j.t>=pushed.t)){pushed=j;refresh(j)}}catch(x){}}}catch(x){}
/* /ai/?toon=vera:video,abel:audio laat een vaste situatie zien (handig om iets voor te doen) */
const TOON=(new URLSearchParams(location.search).get('toon')||'').split(',').map(x=>x.split(':')).filter(x=>LABEL[x[0]]&&LABEL[x[0]][x[1]]);
async function refresh(given){
 if(TOON.length){const t={};TOON.forEach(([k,v])=>t[k]={k:v,grp:'toon'});base={target:t,f:1};demo=demo||'toon';setFounder(founderNow(1));apply(t);setBadge();return}
 let j=given||await load();const now=Date.now()/1000;let target,f;
 if(pushed&&(!j||pushed.t>j.t))j=pushed;
 hist=(j&&j.h)||{};if(cardKey)showCard(cardKey);
 if(j&&now-j.t<17*60){baseSrc='live';target={};Object.keys(j.a||{}).forEach(k=>{if(LABEL[k]&&LABEL[k][j.a[k].k])target[k]={k:j.a[k].k,src:j.a[k].src,grp:j.a[k].src}});f=j.f;
  events=(j.ev||[]).filter(e=>LABEL[e[1]]&&LABEL[e[1]][e[2]]).map(e=>{const d=new Date(e[0]*1000),t=new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit'}).format(d);
   return e[2]==='vraag'?(e[3]?`${t} ${T[e[1]].name} loopt met een vraag naar Hielke`:`${t} ${T[e[1]].name} heeft antwoord en gaat verder`):`${t} ${T[e[1]].name} ${e[3]?'begint':'is klaar'}: ${LABEL[e[1]][e[2]].toLowerCase()}`})}
 else{baseSrc='rooster';target=rooster();events=[]}
 base={target,f};if(demo)return;
 const tele=Object.values(target).some(t=>t.src==='telegram');
 setFounder(founderNow(tele?1:f));apply(target,{fly:!first&&tele,meet:!first});first=false;setBadge()}

/* ---------- voorbeeldopdrachten ---------- */
const DEMOS={mail:{ask:'ada',say:'Stel een mail op',t:{coco:{k:'mail'},ada:{k:'mailklaar'}},end:'Coco schrijft de mail in mijn toon. Ada zet de mail klaar als concept. Versturen gebeurt pas na mijn ja.'},
 video:{ask:'vera',say:'Maak een video',t:{vera:{k:'video'},abel:{k:'audio'},gijs:{k:'design'}},end:'Gijs maakt het beeld, Abel de stem en muziek, Vera monteert. Drie specialisten, één opdracht.'},
 web:{ask:'wes',say:'Pas de website aan',t:{wes:{k:'web'},zoe:{k:'seo'}},end:'Wes past de pagina aan. Zoë controleert of Google en AI-zoekmachines de pagina goed kunnen lezen.'},
 idee:{ask:'max',say:'Werk een idee uit',t:{max:{k:'idee'},coco:{k:'copy'},pim:{k:'deck'}},end:'Max werkt het idee uit, Coco schrijft de tekst en Pim zet het in een presentatie.'}};
const say=root.querySelector('.k-say'),btns=[...root.querySelectorAll('.k-try button')];let timers=[];
function runDemo(id){const d=DEMOS[id];if(!d||demo)return;demo=id;btns.forEach(b=>{b.disabled=true;b.classList.toggle('act',b.dataset.demo===id)});setBadge();
 const names=Object.keys(d.t).map(k=>T[k].name),who=names.slice(0,-1).join(', ')+' en '+names.slice(-1);
 say.textContent=`Ik stuur via Telegram: "${d.say}."`;if(founder==='away')setFounder('online');
 const t={};Object.keys(d.t).forEach(k=>t[k]={...d.t[k],grp:'demo'});
 KEYS.forEach(k=>{if(!t[k]&&C[k].mode==='work')t[k]={k:Object.keys(LABEL[k]).find(x=>LABEL[k][x]===C[k].task),grp:C[k].grp}});
 apply(t,{fly:true,meet:true});
 timers=[setTimeout(()=>say.textContent=`${who} pakken de opdracht op en stemmen kort af.`,1700),
  setTimeout(()=>say.textContent=d.end,reduce?400:9000),
  setTimeout(()=>{say.textContent=`${T[d.ask].name} loopt naar mijn kantoor en vraagt of het zo goed is.`;goAsk(C[d.ask])},reduce?3000:14000),
  setTimeout(()=>{say.textContent=`Ik zeg ja. ${T[d.ask].name} gaat terug naar het bureau en rondt het werk af.`;const c=C[d.ask];goWork(c,LABEL[d.ask][d.t[d.ask].k])},reduce?6000:21000),
  setTimeout(()=>{demo=null;btns.forEach(b=>{b.disabled=false;b.classList.remove('act')});say.textContent='Dit was een voorbeeld. Hierboven zie je weer wat er nu echt gebeurt.';
   setFounder(founderNow(base.f));apply(base.target||{});setBadge()},reduce?9000:30000)]}
btns.forEach(b=>b.addEventListener('click',()=>runDemo(b.dataset.demo)));

/* ---------- kaartje bij een klik ---------- */
const DESC={sam:'Zoekt drie keer per dag nieuwe leads en schrijft de eerste mail.',ada:'Houdt inbox en agenda bij en maakt een briefing voor elk gesprek.',otto:'Rekent prijzen uit binnen de grenzen die ik heb vastgelegd.',
 max:'Maakt social posts. Plaatsen gebeurt pas na mijn akkoord.',coco:'Schrijft in mijn stem, getraind op mijn eigen mails.',wes:'Bouwt en onderhoudt de websites, ook deze pagina.',zoe:'Zorgt dat we gevonden worden, ook in AI-zoekmachines.',
 gijs:'Maakt banners en beelden en bewaakt de huisstijl.',vera:'Monteert video, titels en animatie.',abel:'Maakt voice-over, muziek en geluidseffecten.',rosa:'Maakt het draaiboek voor mijn radioshow.',pim:'Bouwt mijn presentaties.',
 hielke:'Dat ben ik. Ik geef de opdrachten en keur alles goed voordat het de deur uit gaat.'};
let hist={},cardKey=null;const card=document.createElement('div');card.className='k-card';card.hidden=true;card.setAttribute('role','dialog');stage.appendChild(card);
const dayFmt=new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}),
 timeFmt=new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',hour:'2-digit',minute:'2-digit'}),
 dateFmt=new Intl.DateTimeFormat('nl-NL',{timeZone:'Europe/Amsterdam',weekday:'short',day:'numeric',month:'short'});
function when(t){const d=new Date(t*1000),today=dayFmt.format(new Date()),yest=dayFmt.format(new Date(Date.now()-864e5)),x=dayFmt.format(d);
 return(x===today?'vandaag':x===yest?'gisteren':dateFmt.format(d))+' '+timeFmt.format(d)}
function showCard(k,scroll){const c=C[k];if(!c)return;cardKey=k;const me=k==='hielke';
 const h=(hist[k]||[]).filter(e=>LABEL[k]&&LABEL[k][e[1]]).slice(0,3);
 card.innerHTML=`<button type="button" class="k-x" aria-label="Sluiten">×</button>
 <div class="k-ch"><span class="tw">${me?'<svg viewBox="0 6 100 100">'+HIELKE.replace('class="lid"','class="lid" opacity="0"')+'</svg>':avatar(k)}</span><span><b>${T[k].name}</b><em>${ROLE[k]}</em></span></div>
 <p>${DESC[k]}</p>
 <p class="k-now" data-on="${c.mode==='work'||(me&&founder!=='away')?1:0}"><u></u>${me?c.lab.querySelector('i').textContent:c.mode==='work'?'Nu bezig: '+c.task.toLowerCase():c.mode==='ask'?'Wacht op mijn antwoord':brk==='lunch'?'Nu aan de lunch':brk?'Nu op de vrijdagmiddagborrel':'Nu stand-by'}</p>
 ${me?'':`<h3>Laatste taken</h3>${h.length?'<ol>'+h.map(e=>`<li><span>${LABEL[k][e[1]]}</span><time>${when(e[0])}</time></li>`).join('')+'</ol>':'<p class="k-none">Nog niets afgerond sinds dit kantoor live staat.</p>'}`}`;
 const[sx,sy]=P(c.pos[0],c.pos[1]);card.hidden=false;
 card.style.left=Math.min(78,Math.max(1,sx/W*100+2.5))+'%';card.style.top=Math.min(58,Math.max(2,(sy-190)/H*100))+'%';
 Object.values(C).forEach(o=>o.el.classList.toggle('sel',o===c));
 if(scroll)stage.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
 card.querySelector('.k-x').focus({preventScroll:true})}
function hideCard(){card.hidden=true;cardKey=null;Object.values(C).forEach(o=>o.el.classList.remove('sel'))}
Object.values(C).forEach(c=>{c.el.addEventListener('click',e=>{e.stopPropagation();cardKey===c.k?hideCard():showCard(c.k)});
 c.lab.addEventListener('click',e=>{e.stopPropagation();cardKey===c.k?hideCard():showCard(c.k)})});
list.addEventListener('click',e=>{const li=e.target.closest('li');if(li){e.stopPropagation();showCard(li.dataset.k,true)}});
list.addEventListener('keydown',e=>{const li=e.target.closest('li');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showCard(li.dataset.k,true)}});
list.querySelectorAll('li').forEach(li=>{li.tabIndex=0;li.setAttribute('role','button')});
card.addEventListener('click',e=>{e.stopPropagation();if(e.target.closest('.k-x'))hideCard()});
document.addEventListener('click',()=>{if(cardKey)hideCard()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cardKey)hideCard()});

/* ---------- start ---------- */
Object.values(C).forEach(c=>{if(c.k==='hielke'){c.pos=DESK.hielke.seat.slice();c.placed=true;pose(c,'desk')}else{const[x,y,p]=IDLE[c.k];c.pos=[x,y];c.placed=true;c.mode='idle';c.el.classList.add('idle');setLabel(c,'Stand-by','idle');pose(c,p)}});
sort();setFounder(founderNow());setBreak();summary();setBadge();
const{d:dd,m:mm}=nl();svg.classList.toggle('night',mm<450||mm>=1080);
new IntersectionObserver(es=>{visible=es[0].isIntersecting;svg.classList.toggle('paused',!visible);if(visible)kick()},{rootMargin:'100px'}).observe(stage);
refresh();setInterval(()=>{if(!document.hidden)refresh()},120000);setInterval(()=>{setBreak();if(!demo){summary();setBadge()}},30000);
})();
