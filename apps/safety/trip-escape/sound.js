/* 원본의 사건별 효과음과 장소별 배경음. 재생 실패는 학습 진행과 분리합니다. */
(function(root){
'use strict';
const patterns={
 tap:[[660,0,.055]],
 ok:[[659,0,.09],[880,.09,.14]],
 bad:[[220,0,.10],[196,.10,.12]],
 found:[[523,0,.09],[659,.09,.09],[784,.18,.16]],
 clear:[[523,0,.13],[659,.11,.13],[784,.22,.13],[1047,.33,.18]],
 egg:[[1047,0,.07],[1319,.07,.07],[1568,.14,.14]],
 stage:[[523,0,.10],[784,.12,.15]],
 alert:[[660,0,.12],[784,.15,.12],[660,.30,.12]]
};
const tracks={bus:'bus',rest:'rest',sports:'park',cinema:'museum',museum:'museum',experience:'museum','theme-park':'park',park:'park',garden:'park',heritage:'museum',lodging:'room',night:'room',escape:'escape',homecoming:'bus'};
function create(){
 let context=null,music=null,effects=true,background=true,unlocked=false,epoch=0,lastTap=-Infinity,track='',scene={},playing=false,failed=false;
 const voices=new Set();
 const report=(type,extra={})=>{try{root.document?.dispatchEvent(new root.CustomEvent('safety-audio',{detail:{type,...extra}}));}catch{}};
 function stopEffects(){epoch++;for(const v of voices){try{v.o.stop();v.o.disconnect();v.g.disconnect();}catch{}}voices.clear();}
 function ready(){try{const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return Promise.resolve(false);context??=new AC();if(context.state==='running')return Promise.resolve(true);return Promise.resolve(context.resume()).then(()=>context.state==='running',()=>false);}catch{failed=true;return Promise.resolve(false);}}
 function unlock(){unlocked=true;if(effects)ready();syncMusic();}
 function play(type){
  if(scene.suppress||!effects||!unlocked||root.document?.hidden||!patterns[type])return;
  const now=root.performance?.now?.()||0;if(type==='tap'&&now-lastTap<65)return;if(type==='tap')lastTap=now;
  const generation=epoch;
  ready().then(ok=>{
   if(!ok||generation!==epoch||scene.suppress||!effects||root.document?.hidden)return;
   try{const start=context.currentTime;
    for(const [freq,offset,duration]of patterns[type]){const o=context.createOscillator(),g=context.createGain(),v={o,g},t=start+offset;o.type=type==='bad'||type==='alert'?'triangle':'sine';o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(type==='tap'?.035:.065,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(context.destination);voices.add(v);o.onended=()=>{voices.delete(v);o.disconnect();g.disconnect();};o.start(t);o.stop(t+duration+.01);}
    report('effect',{effect:type,notes:patterns[type].length});
   }catch{failed=true;}
  }).catch(()=>{failed=true;});
 }
 function pauseMusic(){if(music&&playing){try{music.pause();}catch{}}playing=false;}
 function syncMusic(){
  const name=tracks[scene.place],wanted=!!(unlocked&&background&&scene.active&&!scene.rhythm&&!scene.suppress&&!root.document?.hidden&&name);
  if(!wanted){pauseMusic();return;}
  try{
   if(!music){if(!root.Audio)return;music=new root.Audio();music.loop=true;music.preload='none';music.addEventListener('error',()=>{playing=false;failed=true;});}
   music.volume=scene.duck?.025:.12;
   if(track!==name){pauseMusic();track=name;music.src='audio/'+name+'.mp3';}
   if(!playing){playing=true;const expected=track;const p=music.play();p?.then(()=>{if(track===expected&&playing)report('music',{track});},()=>{if(track===expected)playing=false;}).catch(()=>{});}
  }catch{playing=false;failed=true;}
 }
 function configure(p){effects=p.effects!==false;background=p.music!==false;if(!effects)stopEffects();syncMusic();}
 function setScene(next){if(next.suppress&&!scene.suppress)stopEffects();scene=next;syncMusic();}
 function visibility(){if(root.document.hidden){stopEffects();pauseMusic();}else syncMusic();}
 function destroy(){stopEffects();pauseMusic();root.document?.removeEventListener('visibilitychange',visibility);try{context?.close()?.catch(()=>{});}catch{}}
 root.document?.addEventListener('visibilitychange',visibility);
 return {unlock,play,configure,setScene,destroy,state:()=>({effects,music:background,unlocked,track,playing,failed,suppressed:!!scene.suppress,voices:voices.size})};
}
const api={create,patterns,tracks};root.SafetyAudio=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
