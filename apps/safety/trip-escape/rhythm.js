/* 리듬 게임의 시계·화면·박자음. 스토리 전환 타이머와 별개로 동작합니다. */
(function(root){
'use strict';
const names={jump:'점프',wait:'기다려요',stop:'멈춰요'};
function create({getGame,isActive,onPhaseChange,motion}){
 let frameId=null,tracked=null,context=null,lastTone='',soundFailed=false;
 const now=()=>performance.now();
 function unlock(){const g=getGame();if(!g?.sound)return;try{const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio){soundFailed=true;return;}context??=new Audio();const p=context.resume();p?.catch(()=>{soundFailed=true;});}catch{soundFailed=true;}}
 function tone(type){const g=getGame();if(!g?.sound||!context||context.state!=='running')return;try{const t=context.currentTime,o=context.createOscillator(),gain=context.createGain();o.type='sine';o.frequency.setValueAtTime(type==='jump'?660:type==='wait'?440:330,t);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.07,t+.015);gain.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(gain);gain.connect(context.destination);o.start(t);o.stop(t+.18);o.onended=()=>{o.disconnect();gain.disconnect();};}catch{soundFailed=true;}}
 function text(id,value){const el=document.getElementById(id);if(el&&el.textContent!==String(value))el.textContent=value;}
 function paint(g,time){const stage=document.getElementById('rhythm-stage');if(!stage)return;const cue=root.SafetyMiniGames.rhythmCue(g),live=g.phase==='ready',inWindow=live&&(g.assist?time>=g.dueAt-g.windowMs:Math.abs(time-g.dueAt)<=g.windowMs),countdown=Math.max(1,Math.ceil((g.dueAt-time)/g.beatMs));let state=g.phase,label='친구 차례',caption='먼저 이용하는 친구를 기다려요.';
  if(g.phase==='countdown'){label=String(countdown);caption='친구가 마치면 내 차례예요. 준비!';}
  if(live){state=cue;label=cue==='jump'?(g.accepted?'잘 맞췄어요!':inWindow?'지금 점프!':'박자가 와요'):names[cue];caption=cue==='jump'?'초록 신호가 기준선에 올 때 눌러요.':cue==='wait'?'노랑 박자에는 손을 떼고 기다려요.':'빨강 박자에는 점프하지 않고 멈춰요.';}
  if(g.phase==='paused'){label='잠시 쉬어요';caption='진행한 박자는 그대로예요.';}if(g.phase==='rest'){label='안전 리듬 완성!';caption='이제 쉬고 싶다고 알려요.';}
  stage.dataset.state=state;stage.dataset.dueAt=Number.isFinite(g.dueAt)?g.dueAt:'';stage.dataset.cueIndex=g.cueIndex;stage.dataset.inWindow=String(!!inWindow);stage.classList.toggle('beat-ready',!!inWindow);stage.classList.toggle('beat-hit',!!g.accepted);stage.classList.toggle('rhythm-still',!motion());
  text('rhythm-signal',label);text('rhythm-caption',caption);text('rhythm-count',`${g.cueIndex} / ${root.SafetyMiniGames.rhythmPattern.length}박자`);text('rhythm-jumps',`안전 점프 ${g.count}회`);text('rhythm-notice',g.notice);
  const progress=document.getElementById('rhythm-meter');if(progress){progress.style.width=g.cueIndex/root.SafetyMiniGames.rhythmPattern.length*100+'%';progress.parentElement.setAttribute('aria-valuenow',g.cueIndex);}
  const hero=document.getElementById('rhythm-hero');if(hero){const p=g.inAir?Math.min(1,(time-g.jumpAt)/550):0;hero.style.translate=motion()?`0 ${-Math.sin(Math.PI*p)*85}px`:'0 0';hero.dataset.jumping=String(!!g.inAir);}
  for(const [slot,el]of [...stage.querySelectorAll('[data-rhythm-note]')].entries()){const index=g.cueIndex+slot,type=root.SafetyMiniGames.rhythmPattern[index];el.hidden=!type;if(!type)continue;el.dataset.cue=type;el.textContent=names[type];const offset=live?Math.max(-25,Math.min(110,20+(g.dueAt-time)/g.beatMs*27+slot*27)):20+slot*27;el.style.left=(motion()?offset:20+slot*25)+'%';el.classList.toggle('current-cue',slot===0);}
  const audio=document.getElementById('rhythm-audio-state');if(audio)audio.textContent=soundFailed?'이 기기에서는 그림 신호로 함께 해요.':g.sound?'소리와 그림으로 박자를 확인해요.':'그림 신호만으로도 할 수 있어요.';
 }
 function stop(){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;}
 function sync(){const g=getGame(),time=now();if(!g||g.kind!=='jump'||!g.rhythm){if(tracked&&['ready','countdown'].includes(tracked.phase)&&tracked.suspendedAt===undefined)tracked.suspendedAt=time;stop();tracked=null;return;}if(!g.soundInitialized){g.soundInitialized=true;}
  if(!isActive()||document.hidden){if(['ready','countdown'].includes(g.phase)&&g.suspendedAt===undefined)g.suspendedAt=time;stop();return;}
  if(g.suspendedAt!==undefined){const shift=time-g.suspendedAt;g.dueAt+=shift;g.startedAt+=shift;if(g.jumpAt!==undefined)g.jumpAt+=shift;if(g.assistEnd)g.assistEnd+=shift;delete g.suspendedAt;}
  tracked=g;paint(g,time);if(!['ready','countdown'].includes(g.phase)){stop();return;}if(frameId===null)frameId=requestAnimationFrame(run);
 }
 function run(time){frameId=null;const g=getGame();if(g!==tracked||!isActive()||document.hidden){sync();return;}const before=g.phase;root.SafetyMiniGames.rhythmTick(g,time);paint(g,time);if(g.phase==='ready'&&time>=g.dueAt){const key=g.cueIndex+':'+g.dueAt;if(key!==lastTone){lastTone=key;tone(root.SafetyMiniGames.rhythmCue(g));}}
  if(before!==g.phase){onPhaseChange();return;}if(['ready','countdown'].includes(g.phase))frameId=requestAnimationFrame(run);
 }
 function input(){const g=getGame();if(!g||!isActive())return;unlock();const time=now(),before=g.phase;root.SafetyMiniGames.rhythmTick(g,time);root.SafetyMiniGames.rhythmInput(g,time);paint(g,time);if(before!==g.phase)onPhaseChange();}
 document.addEventListener('visibilitychange',sync);
 return {sync,input,unlock,paint:()=>{const g=getGame();if(g)paint(g,now());}};
}
const api={create,names};root.SafetyRhythm=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
