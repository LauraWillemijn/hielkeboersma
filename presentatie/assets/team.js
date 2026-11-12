/* Het AI-team: cartoonpoppetjes als inline SVG. avatar(key) geeft een <svg>-string. */
(function(){
const INK='#172232';
const T={
  sam:  {name:'Sam',  role:'Sales agent',          bg:'#dce8fa',skin:'#f1c8a8',hair:'#3b2a20',hs:'short', shirt:'#172232',acc:['tie']},
  ada:  {name:'Ada',  role:'Persoonlijk assistent',bg:'#e3f1ea',skin:'#c68863',hair:'#1f1a17',hs:'bun',   shirt:'#3563a8',acc:['headset']},
  otto: {name:'Otto', role:'Accountmanager',       bg:'#efe7dc',skin:'#f3d3bb',hair:'#8a8f99',hs:'bald',  shirt:'#4a5a73',acc:['glasses','beard']},
  max:  {name:'Max',  role:'Marketing manager',    bg:'#e6ecf8',skin:'#e0ac85',hair:'#2a1d16',hs:'curly', shirt:'#2e9e60',acc:[]},
  coco: {name:'Coco', role:'Copywriter',           bg:'#f6e6e0',skin:'#f5d9c4',hair:'#b5562e',hs:'long',  shirt:'#1d2c42',acc:['glasses']},
  wes:  {name:'Wes',  role:'Websitebouwer',        bg:'#dff0f2',skin:'#8d5a3b',hair:'#141414',hs:'cap',   shirt:'#1d93a3',acc:[]},
  zoe:  {name:'Zoë',  role:'SEO-specialist',       bg:'#eae6f6',skin:'#f1c8a8',hair:'#e0b25c',hs:'ponytail',shirt:'#4b5fd6',acc:[]},
  gijs: {name:'Gijs', role:'Graphic designer',     bg:'#fbeedd',skin:'#e8b892',hair:'#6b4a2e',hs:'short', shirt:'#e07a3f',acc:['beret']},
  vera: {name:'Vera', role:'Video-editor',         bg:'#e3eaf5',skin:'#c68863',hair:'#2b1b12',hs:'bob',   shirt:'#172232',acc:[]},
  abel: {name:'Abel', role:'Audio-engineer',       bg:'#e5f2ec',skin:'#f3d3bb',hair:'#c99a5b',hs:'short', shirt:'#3563a8',acc:['headphones']},
  rosa: {name:'Rosa', role:'Radioproducer',        bg:'#fbe3ec',skin:'#e0ac85',hair:'#3a2318',hs:'curlylong',shirt:'#d9407b',acc:['mic']},
  pim:  {name:'Pim',  role:'Presentatie-designer', bg:'#e9eef6',skin:'#f5d9c4',hair:'#4b3a2c',hs:'side',  shirt:'#2b4f86',acc:['glasses']},
};
function hairBack(t){
  if(t.hs==='long')return `<path d="M27 42 C27 18 73 18 73 42 L75 78 L25 78 Z" fill="${t.hair}"/>`;
  if(t.hs==='curlylong')return `<g fill="${t.hair}"><circle cx="30" cy="54" r="9"/><circle cx="70" cy="54" r="9"/><circle cx="29" cy="68" r="8"/><circle cx="71" cy="68" r="8"/></g>`;
  if(t.hs==='bob')return `<path d="M27 44 C27 19 73 19 73 44 L73 62 L27 62 Z" fill="${t.hair}"/>`;
  if(t.hs==='ponytail')return `<path d="M68 34 C84 38 84 60 74 70 C76 56 72 46 66 42 Z" fill="${t.hair}"/>`;
  return '';
}
function hairFront(t){
  const h=t.hair;
  switch(t.hs){
    case 'short':return `<path d="M29 43 C27 22 44 16 52 18 C64 18 74 26 71 43 C68 34 60 29 50 30 C41 30 33 34 29 43 Z" fill="${h}"/>`;
    case 'side': return `<path d="M29 44 C28 22 46 15 56 19 C68 22 73 30 71 42 C64 30 52 27 40 33 C35 36 31 39 29 44 Z" fill="${h}"/>`;
    case 'bun':  return `<circle cx="50" cy="17" r="8" fill="${h}"/><path d="M29 43 C28 22 72 22 71 43 C66 33 58 29 50 29 C42 29 34 33 29 43 Z" fill="${h}"/>`;
    case 'curly':return `<g fill="${h}"><circle cx="34" cy="31" r="8"/><circle cx="43" cy="24" r="8"/><circle cx="54" cy="23" r="8"/><circle cx="64" cy="28" r="8"/><circle cx="69" cy="37" r="6"/><circle cx="30" cy="39" r="6"/></g>`;
    case 'curlylong':return `<g fill="${h}"><circle cx="33" cy="32" r="9"/><circle cx="44" cy="24" r="9"/><circle cx="56" cy="24" r="9"/><circle cx="67" cy="32" r="9"/><circle cx="29" cy="43" r="7"/><circle cx="71" cy="43" r="7"/></g>`;
    case 'long': return `<path d="M29 44 C29 23 71 23 71 44 C64 33 57 30 50 31 C45 34 37 37 29 44 Z" fill="${h}"/>`;
    case 'bob':  return `<path d="M29 42 C30 23 70 23 71 42 C60 36 40 36 29 42 Z" fill="${h}"/>`;
    case 'ponytail':return `<path d="M29 43 C28 22 72 22 71 43 C65 34 57 30 50 30 C43 30 35 34 29 43 Z" fill="${h}"/>`;
    case 'cap':  return `<path d="M29 40 C29 22 71 22 71 40 Z" fill="#172232"/><rect x="27" y="37" width="46" height="6" rx="3" fill="#172232"/><path d="M27 40 L17 42 L18 46 L28 44 Z" fill="#172232"/><circle cx="50" cy="24" r="2" fill="#fff" opacity=".5"/>`;
    default: return '';
  }
}
function acc(t){
  let s='';
  if(t.acc.includes('glasses'))s+=`<g fill="none" stroke="${INK}" stroke-width="1.8"><circle cx="43" cy="46" r="5.2"/><circle cx="57" cy="46" r="5.2"/><path d="M48.2 46 L51.8 46"/></g>`;
  if(t.acc.includes('beard'))s+=`<path d="M33 48 C35 66 65 66 67 48 C63 56 57 58 50 58 C43 58 37 56 33 48 Z" fill="${t.hair}"/><path d="M45 54 Q50 57 55 54" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>`;
  if(t.acc.includes('headset'))s+=`<path d="M29 46 C27 22 73 22 71 46" fill="none" stroke="${INK}" stroke-width="3"/><rect x="25" y="42" width="7" height="11" rx="3" fill="${INK}"/><path d="M29 52 C30 60 38 61 43 59" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="44" cy="59" r="2.4" fill="${INK}"/>`;
  if(t.acc.includes('headphones'))s+=`<path d="M28 46 C26 18 74 18 72 46" fill="none" stroke="${INK}" stroke-width="4"/><rect x="23" y="40" width="9" height="14" rx="4" fill="#3563a8"/><rect x="68" y="40" width="9" height="14" rx="4" fill="#3563a8"/>`;
  if(t.acc.includes('beret'))s+=`<ellipse cx="47" cy="24" rx="19" ry="7" fill="#d9407b" transform="rotate(-10 47 24)"/><circle cx="45" cy="16" r="2.2" fill="#d9407b"/>`;
  if(t.acc.includes('tie'))s+=`<path d="M50 68 L46 72 L50 90 L54 72 Z" fill="#3563a8"/><path d="M46 66 L50 70 L54 66 Z" fill="#fff"/>`;
  if(t.acc.includes('mic'))s+=`<path d="M76 100 L76 78" stroke="${INK}" stroke-width="3"/><rect x="71" y="64" width="10" height="16" rx="5" fill="${INK}"/><path d="M73 69 H79 M73 73 H79" stroke="#fff" stroke-width="1" opacity=".5"/>`;
  return s;
}
let UID=0;
function avatar(key){
  const t=T[key];if(!t)return '';const id='c-'+key+'-'+(++UID);
  const eyes=t.acc.includes('glasses')?`<circle cx="43" cy="46" r="1.9" fill="${INK}"/><circle cx="57" cy="46" r="1.9" fill="${INK}"/>`:`<circle cx="43" cy="46" r="2.3" fill="${INK}"/><circle cx="57" cy="46" r="2.3" fill="${INK}"/><circle cx="43.8" cy="45.2" r=".7" fill="#fff"/><circle cx="57.8" cy="45.2" r=".7" fill="#fff"/>`;
  const smile=t.acc.includes('beard')?'':`<path d="M44.5 53.5 Q50 58.5 55.5 53.5" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  return `<svg class="toon" viewBox="0 0 100 100" role="img" aria-label="${t.name}, ${t.role}">
<defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs>
<g clip-path="url(#${id})">
<rect width="100" height="100" fill="${t.bg}"/>
${hairBack(t)}
<path d="M16 104 C16 76 32 66 50 66 C68 66 84 76 84 104 Z" fill="${t.shirt}"/>
<path d="M43 60 H57 V68 C57 72 43 72 43 68 Z" fill="${t.skin}"/>
<path d="M42 66 L50 72 L58 66" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>
<ellipse cx="29.5" cy="47" rx="3.5" ry="5" fill="${t.skin}"/><ellipse cx="70.5" cy="47" rx="3.5" ry="5" fill="${t.skin}"/>
<circle cx="50" cy="45" r="21" fill="${t.skin}"/>
<circle cx="38" cy="52" r="3.4" fill="#e8768a" opacity=".28"/><circle cx="62" cy="52" r="3.4" fill="#e8768a" opacity=".28"/>
${eyes}${smile}${hairFront(t)}${acc(t)}
</g></svg>`;
}
window.TEAM=T;window.avatar=avatar;
document.querySelectorAll('[data-toon]').forEach(el=>{el.innerHTML=avatar(el.dataset.toon)});
})();
