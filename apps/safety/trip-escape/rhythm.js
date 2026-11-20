/* 제공된 WAV만 재생합니다. 노트의 유일한 시계는 오디오 currentTime입니다. */
(function(root){
'use strict';
const names={jump:'점프',stop:'멈춰요'};
const judges={perfect:'정확해요!',great:'최고예요!',good:'좋아요!',oops:'아차!',retry:'다시'};
function create({getGame,isActive,onPhaseChange,motion}){
 const Song=root.SafetySong,G=root.SafetyMiniGames;
 let frame=null,tracked=null,media=null,token=0,pending=false,wantsPlay=false,visibleEffect='';
 const events=[];const heldInputs=new Set();
 const position=()=>Math.max(0,(media?.currentTime||0)*1000);
 const text=(id,value)=>{const el=root.document.getElementById(id);if(el&&el.textContent!==String(value))el.textContent=value;};
 function stop(){if(frame!==null)root.cancelAnimationFrame(frame);frame=null;}
 function pauseMedia(){try{media?.pause();}catch{}}
 function release(){heldInputs.clear();if(tracked){tracked.held=false;tracked.activeHold=null;}token++;pending=false;wantsPlay=false;stop();pauseMedia();for(const[name,fn]of events)media?.removeEventListener(name,fn);events.length=0;media=null;tracked=null;}
 function ensure(g){
  if(tracked===g&&media)return true;if(tracked===g&&g.phase==='error'&&!media)return false;release();tracked=g;
  try{if(!root.Audio)throw Error('unavailable');for(const file of ['hero-jump','note-jump','note-stop','note-wait','judge-perfect','judge-great','judge-good','judge-oops','judge-retry']){if(root.Image){const img=new root.Image();img.src='media/rhythm/'+file+'.webp';}}media=new root.Audio();media.preload='auto';media.src=Song.src;media.loop=false;media.volume=g.volume;media.playbackRate=g.pace==='slow'?.75:1;media.preservesPitch=true;
   const listen=(name,fn)=>{media.addEventListener(name,fn);events.push([name,fn]);};
   listen('ended',()=>{if(tracked!==g||g.phase!=='ready')return;wantsPlay=false;stop();G.rhythmEnd(g);paint(g);onPhaseChange();});
   listen('playing',()=>activate(g));listen('error',()=>fail(g));return true;
  }catch{fail(g);return false;}
 }
 function fail(g){if(tracked!==g)return;token++;pending=false;wantsPlay=false;stop();pauseMedia();g.phase='error';g.notice='노래를 재생하지 못했어요. 다시 불러오기를 눌러요.';paint(g);onPhaseChange();}
 function activate(g){if(tracked!==g||!pending)return;pending=false;if(!isActive()||root.document.hidden){pauseMedia();g.suspended=true;return;}if(g.startFresh)G.rhythmAct(g,'wait');else g.phase='ready';g.startFresh=false;g.notice='점프는 톡, 멈춰요는 꼬리 끝까지 꾹 눌러요.';paint(g);onPhaseChange();sync();}
 function play(g,fresh=false){if(pending||!media||tracked!==g)return;const version=++token;pending=true;wantsPlay=true;g.startFresh=fresh;try{const result=media.play();Promise.resolve(result).then(()=>{if(version===token&&tracked===g)activate(g);}).catch(()=>{if(version===token&&tracked===g)fail(g);});}catch{if(version===token)fail(g);}}
 function start(){const g=getGame();if(!g||!isActive()||!['wait','error'].includes(g.phase))return;
  const pace=g.pace,assist=g.assist,volume=g.volume,difficulty=g.difficulty,feverMode=g.feverMode;Object.assign(g,G.create('sports','jump'),{pace,assist,volume,difficulty,feverMode,phase:'loading'});
  if(!ensure(g))return;try{media.currentTime=0;media.volume=g.volume;media.playbackRate=g.pace==='slow'?.75:1;}catch{}
  onPhaseChange();play(g,true);
 }
 function pause(){heldInputs.clear();const g=getGame();if(!g||!['ready','loading'].includes(g.phase))return;G.rhythmTick(g,position());token++;pending=false;wantsPlay=false;pauseMedia();stop();g.held=false;if(g.activeHold)g.holdResume=true;g.phase='paused';g.notice='노래와 노트가 함께 멈췄어요.';paint(g);onPhaseChange();}
 function resume(){const g=getGame();if(!g||g.phase!=='paused'||!isActive())return;if(!ensure(g))return;g.phase='loading';onPhaseChange();play(g,false);}
 function configure(action,value){const g=getGame();if(!g)return;G.rhythmAct(g,action,value);if(action==='volume')g.volume=Math.max(0,Math.min(1,Number(value)));if(media&&tracked===g){media.volume=g.volume;media.playbackRate=g.pace==='slow'?.75:1;}paint(g);onPhaseChange();}
 function paint(g){
  const stage=root.document.getElementById('rhythm-stage');if(!stage)return;
  const fever=G.rhythmFever(g),energy=root.document.getElementById('rhythm-fever-meter');stage.dataset.fever=String(fever);stage.classList.toggle('rhythm-fever-active',fever);stage.querySelector('.rhythm-fever-badge')?.toggleAttribute('hidden',!fever);if(energy)energy.value=fever?Math.max(0,(g.feverUntilMs-(g.positionMs||0))/80):g.feverCharge||0;text('rhythm-fever-label',fever?'피버! 점수 2배':g.feverReady?'피버 준비 완료':'콤보 피버 XP');text('rhythm-multiplier',fever?'×2':'×1');const notes=G.rhythmNotes(g),pos=g.positionMs||0,n=notes[g.cueIndex],live=g.phase==='ready',inside=live&&n&&Math.abs(pos-n.t)<=G.rhythmWindow(g);
  stage.dataset.difficulty=g.difficulty;stage.dataset.holding=String(!!g.held);stage.dataset.holdActive=String(!!g.activeHold);stage.style.setProperty('--hold-progress',g.activeHold?Math.min(1,Math.max(0,(pos-g.activeHold.start)/(g.activeHold.end-g.activeHold.start))):0);const fire=root.document.querySelector('[data-action="rhythm-fever"]');if(fire){fire.hidden=g.feverMode!=='manual';fire.disabled=!g.feverReady;fire.textContent=g.feverReady?'피버 발동!':'피버 충전 중';}
  stage.dataset.state=live?(n?.kind||'outro'):g.phase;stage.dataset.dueAt=n?.t||Song.durationMs;stage.dataset.cueIndex=g.cueIndex;stage.dataset.songTime=Math.round(pos);stage.dataset.inWindow=String(!!inside);stage.classList.toggle('beat-ready',!!inside);stage.classList.toggle('rhythm-still',!motion());
  const label=g.phase==='loading'?'노래를 불러와요':g.phase==='paused'?'잠깐 쉬어요':g.phase==='rest'?'끝까지 함께했어요!':live?(inside?(n?.kind==='stop'?'누른 채 유지해요':'지금 점프!'):n?.kind==='stop'?'멈춰요 노트가 와요':'점프 노트가 와요'):'노래에 맞춰 안전 점프';
  text('rhythm-signal',label);text('rhythm-caption',live?'점프는 한 번 누르고, 멈춤은 꼬리 끝까지 누른 채 유지해요.':'시작을 누르면 노래 처음부터 함께해요.');text('rhythm-count',`${g.cueIndex} / ${notes.length}노트`);text('rhythm-jumps',`점프 ${g.count}회 · 멈춤 ${g.stopCorrect}회`);text('rhythm-score',g.score);text('rhythm-combo',g.combo);text('rhythm-notice',g.notice);text('rhythm-time',`${format(pos)} / ${format(Song.durationMs)}`);
  const meter=root.document.getElementById('rhythm-meter');if(meter){meter.style.width=pos/Song.durationMs*100+'%';meter.parentElement.setAttribute('aria-valuenow',Math.round(pos/1000));}
  const hero=root.document.getElementById('rhythm-hero');if(hero){const p=g.inAir?Math.min(1,(pos-g.jumpAt)/(g.jumpDuration||500)):0;const src=g.inAir?'media/rhythm/hero-jump.webp':'media/illustrations/sprite-hero.png';if(hero.getAttribute('src')!==src)hero.src=src;hero.classList.toggle('is-jumping',!!g.inAir);hero.style.translate=motion()?`0 ${-Math.sin(Math.PI*p)*72}px`:'0 0';const aura=stage.querySelector('.rhythm-fever-aura');if(aura)aura.style.translate=hero.style.translate;const energy=stage.querySelector('.fever-energy');if(energy)energy.style.translate=hero.style.translate;}
  const first=Math.max(0,g.cueIndex-1);stage.querySelectorAll('[data-rhythm-note]').forEach((el,i)=>{
   const index=first+i,note=notes[index];if(!note){el.hidden=true;return;}const x=20+(note.t-pos)/G.rhythmApproach(g)*78;el.hidden=x < -15||x>115;el.style.left=x+'%';el.dataset.cue=note.kind;el.style.setProperty('--tail-px',(note.kind==='stop'?G.rhythmHoldDuration(g,index)/G.rhythmApproach(g)*.78*(stage.querySelector('.rhythm-track')?.clientWidth||800):0)+'px');el.style.setProperty('--hold-width',(note.kind==='stop'?G.rhythmHoldDuration(g,index)/G.rhythmApproach(g)*78:0)+'%');el.style.setProperty('--tail-size',(note.kind==='stop'?G.rhythmHoldDuration(g,index)/G.rhythmApproach(g)*78/9.5*100:0)+'%');el.dataset.noteIndex=index;el.classList.toggle('judged',!!g.results[index]);el.setAttribute('aria-label',names[note.kind]+' 노트');const img=el.querySelector('img');if(img){const src='media/rhythm/note-'+note.kind+'.webp';if(img.getAttribute('src')!==src)img.src=src;img.alt=names[note.kind];}
  });
  const effect=root.document.getElementById('rhythm-judgment');if(effect){const f=g.feedback,show=!!f&&live&&pos-f.at<650;effect.hidden=!show;if(show){const img=effect.querySelector('img'),key=f.serial+':'+f.kind;img.src='media/rhythm/judge-'+f.kind+'.webp';img.alt=judges[f.kind];if(key!==visibleEffect){visibleEffect=key;effect.classList.remove('show');void effect.offsetWidth;effect.classList.add('show');}stage.dataset.judgment=f.kind;text('rhythm-feedback',f.label);}}
 }
 function sync(){
  const g=getGame();if(!g||g.kind!=='jump'){release();return;}
  if(!ensure(g))return;
  if(!isActive()||root.document.hidden){if(wantsPlay&&['ready','loading'].includes(g.phase))g.suspended=true;g.held=false;if(g.activeHold)g.holdResume=true;heldInputs.clear();pauseMedia();stop();return;}
  if(g.suspended){delete g.suspended;if(wantsPlay&&!pending)play(g,g.phase==='loading'&&g.positionMs===0);}
  paint(g);if(g.phase==='ready'&&!media.paused&&frame===null)frame=root.requestAnimationFrame(run);else if(g.phase!=='ready')stop();
 }
 function run(){frame=null;const g=getGame();if(g!==tracked||!isActive()||root.document.hidden){sync();return;}if(g.phase!=='ready'||media.paused)return;G.rhythmTick(g,position());paint(g);if(g.phase==='ready'&&!media.paused)frame=root.requestAnimationFrame(run);}
 function input(){const g=getGame();if(!g||!isActive()||g.phase!=='ready'||!media||media.paused||media.seeking)return;G.rhythmInput(g,position());paint(g);}
 function down(key){const g=getGame();if(!g||!isActive()||g.phase!=='ready'||!media||media.paused||heldInputs.has(key))return;const first=heldInputs.size===0;heldInputs.add(key);if(first)G.rhythmDown(g,position());paint(g);}
 function up(key){if(!heldInputs.delete(key)||heldInputs.size)return;const g=getGame();if(g)G.rhythmUp(g,position());paint(g);}
 const doc=root.document;
 doc.addEventListener('pointerdown',e=>{const target=e.target.closest?.('[data-action="mini-jump"]');if(!target||e.button!==0||!isActive())return;e.preventDefault();try{doc.body.setPointerCapture(e.pointerId);}catch{}down('pointer:'+e.pointerId);});
 doc.addEventListener('pointerup',e=>up('pointer:'+e.pointerId));doc.addEventListener('pointercancel',e=>up('pointer:'+e.pointerId));
 doc.addEventListener('keydown',e=>{if(!isActive()||e.target.closest?.('input,textarea,select'))return;if(e.code==='KeyF'){e.preventDefault();if(!e.repeat){const g=getGame();G.rhythmAct(g,'fever',position());paint(g);}return;}if(!['Space','Enter','ArrowUp'].includes(e.code)||e.target.closest?.('[data-action]')&&!e.target.closest?.('[data-action="mini-jump"]')&&e.code==='Enter')return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)down('key:'+e.code);},true);
 doc.addEventListener('keyup',e=>up('key:'+e.code));root.addEventListener('blur',()=>{if(heldInputs.size){const g=getGame();heldInputs.clear();if(g)G.rhythmUp(g,position());}});
 function format(ms){const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
 root.document.addEventListener('visibilitychange',sync);root.addEventListener('pagehide',release);
 return {sync,input,start,pause,resume,configure,paint:()=>{const g=getGame();if(g)paint(g);}};
}
const api={create,names,judges};root.SafetyRhythm=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
