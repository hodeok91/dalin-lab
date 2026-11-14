/* 공원 생존 피하기: 그림만 움직이며 기록을 겨루는 별도 게임 시계. */
(function(root){
'use strict';
const storageKey='safetyMasterDodgeScores';
function readScores(){try{const a=JSON.parse(root.localStorage.getItem(storageKey));return Array.isArray(a)?a.filter(x=>x&&Number.isFinite(x.score)&&x.score>=0&&Number.isFinite(x.ms)&&x.ms>=0&&['slow','normal'].includes(x.pace)).slice(0,20).map(x=>({score:x.score,ms:x.ms,pace:x.pace,avoided:Number.isSafeInteger(x.avoided)&&x.avoided>=0?x.avoided:0})):[];}catch{return [];}}
function create({getGame,isActive,onChange,onResult=()=>{},sound=()=>{},motion=()=>true}){
 let frame=null,tracked=null,records=readScores();
 const now=()=>root.performance.now(),G=()=>root.SafetyMiniGames;
 function stop(){if(frame!==null)root.cancelAnimationFrame(frame);frame=null;}
 function save(g){if(g.recorded)return;g.recorded=true;records.push({score:g.score,ms:Math.floor(g.elapsedMs),avoided:g.avoided,pace:g.pace});records=records.sort((a,b)=>b.score-a.score||b.ms-a.ms).slice(0,20);try{root.localStorage.setItem(storageKey,JSON.stringify(records));}catch{}onResult(g);}
 function ranking(pace){return records.filter(r=>r.pace===pace).sort((a,b)=>b.score-a.score||b.ms-a.ms).slice(0,5);}
 function paint(g){
  const board=root.document.getElementById('survival-field');if(!board)return;
  board.dataset.phase=g.phase;board.dataset.round=g.round;board.dataset.lane=g.lane;board.dataset.waveMs=Math.floor(g.waveMs);board.dataset.duration=G().dodgeDuration(g);board.classList.toggle('survival-hit',g.phase==='hit');board.classList.toggle('survival-still',!motion());
  const hero=board.querySelector('.survival-hero');if(hero){hero.style.left=[16.67,50,83.33][g.lane]+'%';hero.src=g.phase==='hit'?'media/brand/hero-concerned.png':'media/illustrations/sprite-hero.png';}
  const pos=Math.min(1,g.waveMs/G().dodgeDuration(g));
  const hazards=G().dodgeObstacles(g);
  board.querySelectorAll('[data-survival-hazard]').forEach((el,i)=>{const h=hazards[i];el.hidden=!h;if(!h)return;el.style.left=[16.67,50,83.33][h.lane]+'%';el.style.top=(8+pos*66)+'%';el.dataset.lane=h.lane;el.querySelector('img').src='media/game/'+h.key+'.webp';el.querySelector('img').alt=G().hazardNames[h.key];el.querySelector('b').textContent=G().hazardNames[h.key];});
  for(const[id,value]of Object.entries({'survival-score':g.score,'survival-time':(g.elapsedMs/1000).toFixed(1)+'초','survival-lives':g.hearts+' / 3','survival-avoided':g.avoided,'survival-notice':g.notice,'survival-level':Math.floor(g.round/5)+1})){const el=root.document.getElementById(id);if(el&&el.textContent!==String(value))el.textContent=value;}
 }
 function sync(){const g=getGame();if(!g||g.kind!=='dodge'){if(tracked)tracked.suspended=true;stop();tracked=null;return;}tracked=g;
  if(!isActive()||root.document.hidden){if(['running','hit'].includes(g.phase))g.suspended=true;stop();return;}
  if(g.suspended){if(g.phase==='hit')g.hitAt+=now()-g.lastAt;g.lastAt=now();delete g.suspended;}
  paint(g);if(g.ended)save(g);if(['running','hit'].includes(g.phase)&&frame===null)frame=root.requestAnimationFrame(run);else if(!['running','hit'].includes(g.phase))stop();
 }
 function run(time){frame=null;const g=getGame();if(g!==tracked||!isActive()||root.document.hidden){sync();return;}const phase=g.phase,round=g.round;G().dodgeTick(g,time);paint(g);
  if(g.phase==='hit'&&phase!=='hit')sound('bad');else if(g.round!==round&&phase!=='hit')sound('ok');
  if(g.ended){save(g);sound('clear');onChange();return;}
  if(g.phase!==phase){onChange();return;}
  frame=root.requestAnimationFrame(run);
 }
 function act(action){const g=getGame();if(!g||g.kind!=='dodge'||!isActive())return;const lane=g.lane,phase=g.phase;G().dodgeAct(g,action,now());if(g.lane!==lane)sound('tap');if(g.phase!==phase||action==='pace'){onChange();return;}paint(g);sync();}
 function clearRecords(){records=[];try{root.localStorage.removeItem(storageKey);}catch{}onChange();}
 root.document.addEventListener('visibilitychange',sync);
 return {sync,act,ranking,clearRecords,paint:()=>getGame()&&paint(getGame())};
}
const api={create,readScores,storageKey};root.SafetyDodge=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
