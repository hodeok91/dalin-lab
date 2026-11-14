/* JSDOM does not decode media. Tests drive a media clock separately from RAF. */
module.exports=function install(w,now=()=>w.performance.now()){
 const state=new WeakMap(),elements=[];
 const get=el=>{if(!state.has(el)){state.set(el,{time:0,at:now(),paused:true,ended:false});elements.push(el);}return state.get(el);};
 const song=el=>String(el.src).includes('safety-jump.wav');
 const value=el=>{const s=get(el);return s.time+(s.paused?0:(now()-s.at)/1000*(el.playbackRate||1));};
 Object.defineProperty(w.HTMLMediaElement.prototype,'currentTime',{configurable:true,get(){return Math.min(song(this)?149.84:Infinity,value(this));},set(n){const s=get(this);s.time=n;s.at=now();s.ended=false;}});
 Object.defineProperty(w.HTMLMediaElement.prototype,'paused',{configurable:true,get(){return get(this).paused;}});
 Object.defineProperty(w.HTMLMediaElement.prototype,'duration',{configurable:true,get(){return song(this)?149.84:180;}});
 Object.defineProperty(w.HTMLMediaElement.prototype,'seeking',{configurable:true,get(){return false;}});
 w.HTMLMediaElement.prototype.play=function(){const s=get(this);s.at=now();s.paused=false;s.ended=false;this.dispatchEvent(new w.Event('playing'));return Promise.resolve();};
 w.HTMLMediaElement.prototype.pause=function(){const s=get(this);s.time=value(this);s.at=now();s.paused=true;};
 return {elements,endSong(){const el=elements.find(song);if(!el)throw Error('song not started');const s=get(el);s.time=149.84;s.at=now();s.paused=true;s.ended=true;el.dispatchEvent(new w.Event('ended'));return el;},song:()=>elements.find(song)};
};
