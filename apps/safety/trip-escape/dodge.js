/* 공원 생존 피하기: 산책길 카메라·연속 입력·안전한 우회로. */
(function(root){
'use strict';
const storageKey='safetyMasterDodgeScores';
function readScores(){try{const a=JSON.parse(root.localStorage.getItem(storageKey));return Array.isArray(a)?a.filter(x=>x&&Number.isFinite(x.score)&&x.score>=0&&Number.isFinite(x.ms)&&x.ms>=0&&['slow','normal'].includes(x.pace)).slice(0,20).map(x=>({score:x.score,ms:x.ms,pace:x.pace,difficulty:['easy','normal','hard','expert'].includes(x.difficulty)?x.difficulty:null,ruleVersion:x.ruleVersion||1,mode:x.mode==='challenge'?'challenge':'normal',avoided:Number.isSafeInteger(x.avoided)&&x.avoided>=0?x.avoided:0})):[];}catch{return [];}}
function create({getGame,isActive,onChange,onResult=()=>{},sound=()=>{},motion=()=>true}){
 let frame=null,tracked=null,records=readScores(),ignoreClickUntil=0;
 const keys=new Set(),pointers=new Map();
 const now=()=>root.performance.now(),G=()=>root.SafetyMiniGames;
 function stop(){if(frame!==null)root.cancelAnimationFrame(frame);frame=null;}
 function direction(){const g=getGame();if(!g)return;const values=[...keys].map(k=>k==='ArrowLeft'?-1:1).concat([...pointers.values()]);g.direction=Math.sign(values.reduce((s,n)=>s+n,0));}
 function clearInput(){keys.clear();pointers.clear();if(getGame())getGame().direction=0;}
 function save(g){if(g.recorded)return;g.recorded=true;records.push({score:g.score,ms:Math.floor(g.elapsedMs),avoided:g.avoided,pace:g.pace,difficulty:g.difficulty,ruleVersion:4,mode:g.mode||'normal'});records=records.sort((a,b)=>b.score-a.score||b.ms-a.ms).slice(0,20);try{root.localStorage.setItem(storageKey,JSON.stringify(records));}catch{}onResult(g);}
 function ranking(difficulty,mode='normal'){return records.filter(r=>r.ruleVersion===4&&r.difficulty===difficulty&&(r.mode||'normal')===mode).sort((a,b)=>b.score-a.score||b.ms-a.ms).slice(0,5);}
 function paint(g){
  const board=root.document.getElementById('survival-field');if(!board)return;
  board.dataset.invincible=String(G().dodgeFever(g));board.classList.toggle('runner-guard',g.shieldAt!==null&&g.lastAt-g.shieldAt<550);board.dataset.shields=g.shieldHits||0;board.dataset.difficulty=g.difficulty;board.dataset.phase=g.phase;board.dataset.round=g.round;board.dataset.lane=g.lane;board.dataset.x=g.x;board.dataset.waveMs=Math.floor(g.waveMs);board.dataset.duration=G().dodgeDuration(g);board.classList.toggle('survival-hit',g.phase==='hit');board.classList.toggle('survival-still',!motion());board.classList.toggle('world-moving',g.phase==='running');
  const jump=g.jumpUntil>g.lastAt,progress=jump?Math.min(1,(g.lastAt-g.jumpAt)/(g.jumpUntil-g.jumpAt)):0;board.classList.toggle('runner-jumping',jump);board.classList.toggle('runner-has-cape',!!g.cape);board.classList.toggle('runner-cape-worn',!!g.capeWorn);board.classList.toggle('runner-fever',G().dodgeFever(g));board.dataset.fever=G().dodgeFever(g)?'on':'off';board.dataset.combo=g.combo||0;const aura=board.querySelector('.runner-aura');if(aura){aura.style.left=(16.67+(g.x??.5)*66.66)+'%';aura.style.setProperty('--jump-y',(-Math.sin(progress*Math.PI)*65)+'px');}const jumpButton=root.document.querySelector('[data-action="dodge-jump"]');if(jumpButton){jumpButton.disabled=!G().dodgeJumpReady(g);jumpButton.classList.toggle('is-ready',!jumpButton.disabled);jumpButton.textContent=g.cape?'점프':jump?'점프!':'망토를 모아요';}const hero=board.querySelector('.survival-hero');if(hero){hero.dataset.costume=jump?'jump':g.capeWorn?'cape':'normal';hero.setAttribute('aria-label',jump?'망토를 입고 점프하는 형아맨':g.capeWorn?'망토를 입고 달리는 형아맨':'산책길을 달리는 형아맨');hero.style.left=(16.67+(g.x??.5)*66.66)+'%';hero.style.setProperty('--jump-y',(-Math.sin(progress*Math.PI)*65)+'px');hero.style.setProperty('--lean',(g.direction||0)*-7+'deg');}
  const meter=root.document.querySelector('#runner-fever-meter');if(meter){meter.value=G().dodgeFever(g)?g.feverWaves*20:g.feverCharge||0;meter.setAttribute('aria-label',G().dodgeFever(g)?'피버 남은 구간':'피버 게이지');}const feverLabel=root.document.querySelector('#runner-fever-label');if(feverLabel)feverLabel.textContent=G().dodgeFever(g)?'피버 ×2 · 무적':'콤보 피버 XP';const banner=board.querySelector('.runner-fever-banner');if(banner)banner.hidden=!G().dodgeFever(g);
  const pos=Math.min(1,g.waveMs/G().dodgeDuration(g));
  const hazards=G().dodgeObstacles(g);
  const height=board.clientHeight||590,ground=board.querySelector('.survival-ground');if(ground){const offset=((g.round+pos)*height/3.4)%((board.clientWidth||height*9/16)*.75);ground.style.backgroundPositionY=offset+'px';board.style.setProperty('--ground-offset',offset+'px');}
  board.querySelectorAll('[data-survival-hazard]').forEach((el,i)=>{const offset=Math.floor(i/2)-1,index=i%2,h=G().dodgeObstacles(g,offset)[index],y=85-(offset+1-pos)/3.4*100;el.hidden=!h||g.round+offset<0||y < -12||y>112;if(el.hidden)return;el.classList.toggle('wide-branch',!!h.wide);el.classList.toggle('wildlife',h.key==='bee'||h.key==='snake');el.style.left=[16.67,50,83.33][h.lane]+'%';el.style.top=y+'%';el.dataset.lane=h.lane;el.dataset.worldWave=g.round+offset;el.querySelector('img').src='media/game/'+h.key+'.webp';el.querySelector('img').alt=G().hazardNames[h.key];const label=el.querySelector('b');if(label)label.textContent=G().hazardNames[h.key];});
  board.querySelectorAll('[data-survival-star]').forEach((el,i)=>{const offset=i-1,y=85-(offset+1-pos)/3.4*100,pickup=G().dodgePickup(g,offset);el.hidden=!pickup||offset<0||y < -12||y>112;if(!pickup)return;el.style.left=[16.67,50,83.33][pickup.lane]+'%';el.style.top=y+'%';el.classList.toggle('cape-pickup',pickup.kind==='cape');el.classList.toggle('fever-star',G().dodgeFever(g)&&pickup.kind==='star');el.setAttribute('aria-label',pickup.kind==='cape'?'점프 망토':'안전별');});
  for(const[id,value]of Object.entries({'survival-combo':g.combo||0,'survival-score':g.score,'survival-stars':g.collected||0,'survival-time':(g.elapsedMs/1000).toFixed(1)+'초','survival-lives':g.hearts+' / 3','survival-avoided':g.avoided,'survival-notice':g.notice,'survival-level':Math.floor(g.round/5)+1})){const el=root.document.getElementById(id);if(el&&el.textContent!==String(value))el.textContent=value;}
 }
 function sync(){const g=getGame();if(!g||g.kind!=='dodge'){if(tracked)tracked.suspended=true;clearInput();stop();tracked=null;return;}if(tracked!==g)clearInput();tracked=g;
  if(!isActive()||root.document.hidden){if(['running','hit'].includes(g.phase))g.suspended=true;clearInput();stop();return;}
  if(g.suspended){const paused=now()-g.lastAt;if(g.phase==='hit')g.hitAt+=paused;if(g.jumpUntil){g.jumpAt+=paused;g.jumpUntil+=paused;}g.lastAt=now();delete g.suspended;}
  paint(g);if(g.ended)save(g);if(['running','hit'].includes(g.phase)&&frame===null)frame=root.requestAnimationFrame(run);else if(!['running','hit'].includes(g.phase))stop();
 }
 function run(time){frame=null;const g=getGame();if(g!==tracked||!isActive()||root.document.hidden){sync();return;}const phase=g.phase,round=g.round,wasFever=G().dodgeFever(g),shields=g.shieldHits||0;G().dodgeTick(g,time);paint(g);
  if(!wasFever&&G().dodgeFever(g))sound('clear');else if(g.shieldHits>shields)sound('tap');else if(g.phase==='hit'&&phase!=='hit')sound('bad');else if(g.round!==round&&phase!=='hit')sound('ok');
  if(g.ended){save(g);sound('clear');onChange();return;}
  if(g.phase!==phase&&!['running','hit'].includes(g.phase)){onChange();return;}
  frame=root.requestAnimationFrame(run);
 }
 function act(action){const g=getGame();if(!g||g.kind!=='dodge'||!isActive())return;if(['left','right'].includes(action)&&now()<ignoreClickUntil)return;if(['start','pause','resume'].includes(action))clearInput();const lane=g.lane,phase=g.phase;G().dodgeAct(g,action,now());if(g.lane!==lane)sound('tap');if(g.phase!==phase||action==='pace'){onChange();return;}paint(g);sync();}
 function clearRecords(){records=[];try{root.localStorage.removeItem(storageKey);}catch{}onChange();}
 root.document.addEventListener('keydown',e=>{if(e.key===' '&&isActive()&&getGame()?.kind==='dodge'&&!e.target.closest?.('button,input,textarea,select')){e.preventDefault();if(!e.repeat)act('jump');return;}if(!isActive()||getGame()?.kind!=='dodge'||!['ArrowLeft','ArrowRight'].includes(e.key)||e.target.closest?.('input,textarea,select'))return;e.preventDefault();keys.add(e.key);direction();});
 root.document.addEventListener('keyup',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;keys.delete(e.key);direction();});
 root.document.addEventListener('pointerdown',e=>{const button=e.target.closest?.('[data-action="dodge-left"],[data-action="dodge-right"]');if(!button||button.disabled||!isActive()||getGame()?.kind!=='dodge'||e.button!==0)return;e.preventDefault();pointers.set(e.pointerId,button.dataset.action==='dodge-left'?-1:1);direction();try{button.setPointerCapture(e.pointerId);}catch{}});
 const release=e=>{if(pointers.has(e.pointerId)){pointers.delete(e.pointerId);ignoreClickUntil=now()+350;direction();}};
 for(const name of ['pointerup','pointercancel','lostpointercapture'])root.document.addEventListener(name,release);
 root.addEventListener('blur',clearInput);root.addEventListener('pagehide',()=>{clearInput();stop();});root.document.addEventListener('visibilitychange',sync);
 return {sync,act,ranking,clearRecords,clearInput,paint:()=>getGame()&&paint(getGame())};
}
const api={create,readScores,storageKey};root.SafetyDodge=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
