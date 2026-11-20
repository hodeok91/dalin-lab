/* 장소에 맞는 직접 조작 놀이. 순수 상태와 브라우저 입력은 arcade-view.js에서 분리합니다. */
(function(root){'use strict';
const P=root.SafetyPlaceGames||(typeof require==='function'?require('./place-games'):null);
const kinds=new Set(['path','sort','whack','wash','dress','call-order','evac-order','ride-order']);
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const flow={
 'evac-order':{title:'함께 대피하는 순서를 만들어요',labels:['주변과 선생님께 알리고 안내를 확인해요','물건을 두고 확인된 경로로 함께 이동해요','집결지에서 인원을 확인하고 다시 들어가지 않아요'],keys:['alarm','clear','assembly']},
 'ride-order':{title:'놀이기구를 타고 내리는 순서를 만들어요',labels:['이용 조건을 확인해요','소지품을 보관해요','차례를 기다려요','앉아서 안전장치를 확인받아요','움직일 때 앉아 있어요','완전히 멈춘 뒤 안내받고 내려요'],keys:['height','bag','queue','belt','moving','exit']}
};
const callPrompts=[
 {question:'119입니다. 어디에서 도움이 필요한가요?',answer:'안전수련원 2층 203호예요.',label:'어디인가요?',key:'here'},
 {question:'무슨 일이 일어났나요?',answer:'복도에 연기가 나고, 방에서 나가기 어려워요.',label:'무슨 일인가요?',key:'fire'},
 {question:'함께 있는 사람과 필요한 도움을 알려 주세요.',answer:'선생님과 학생, 모두 네 명이 있어요. 대피 도움이 필요해요.',label:'어떤 도움이 필요한가요?',key:'help'}
];
function addStairs(g){while(g.steps.length<g.floor+24){if(!g.runLeft){g.runDir=-(g.runDir||-1);g.runLeft=3+Math.floor(Math.random()*5);}g.steps.push(g.steps.at(-1)+g.runDir);g.runLeft--;}}
function stairItem(n){if(!n)return null;if(n%40===0)return 'shield';if(n%17===0)return 'energy';if(n%25===0)return 'big-coin';if(n%5===0)return 'coin';return null;}
function create(place,kind){const base={kind,place,phase:'ready',complete:false,score:0,combo:0,maxCombo:0,notice:'시작을 눌러요.',serial:0};
 if(kind==='path'){const g={...base,floor:0,steps:[0],energy:5500,hearts:1,difficulty:'normal',facing:'right',lastDir:'right',wrong:0,runDir:-1,runLeft:0,coins:0,items:[],shield:0,fastCombo:0,auraUntil:0,freezeUntil:0,elapsed:0,lastStepAt:null};addStairs(g);return g;}
 if(kind==='sort')return {...base,order:Array.from({length:6},()=>shuffle(P.tools.map(t=>t.id))).flat(),index:0,elapsed:0,itemMs:0,correct:0,wrong:0,missed:0,sorted:[],speed:'normal',feedback:null};
 if(kind==='whack')return {...base,elapsed:0,waveMs:0,wave:0,targets:[],found:[],correct:0,wrong:0,missed:0,waitMode:false};
 if(kind==='wash')return {...base,notice:'손 그림을 눌러 흐르는 물로 적셔요.',phase:'wet',step:0,rubMs:0,totalRubMs:0,waterMs:0,pressed:false,motionUntil:0,stroke:0,soap:false,bubbles:0};
 if(kind==='dress')return {...base,notice:'수영복은 옷에, 수영모는 머리에, 구명조끼는 몸에 놓아요.',phase:'play',selected:null,worn:[],invalid:0};
 if(kind==='call-order')return {...base,notice:'1 · 1 · 9를 누르고 초록색 통화 버튼을 눌러요.',phase:'dial',digits:'',step:0,responses:[],talkMs:0,voiceLevel:0,micState:'off',connectedMs:0};
 if(flow[kind])return {...base,notice:'그림을 골라 순서 칸에 놓고 순서 확인을 눌러요.',phase:'play',pool:shuffle(flow[kind].labels.map((_,i)=>i)),slots:Array(flow[kind].labels.length).fill(null),selected:null,attempts:0,wrongSlots:[]};
 return null;
}
function finish(g,notice){g.complete=true;g.phase='done';g.pressed=false;g.notice=notice;g.serial++;return g;}
function award(g,base){g.combo++;g.maxCombo=Math.max(g.combo,g.maxCombo);g.score+=base+Math.min(g.combo-1,10)*5;}
function sortCurrent(g){return P.tools.find(t=>t.id===g.order[g.index]);}
function sortAdvance(g){g.index++;g.itemMs=0;g.serial++;if(g.index>=g.order.length){g.phase='result';g.notice='분류를 마쳤어요. 기록을 확인해요.';}}
function whackWave(g){g.wave++;g.waveMs=0;const hole=shuffle([0,1,2,3,4,5,6,7,8]),danger=P.hazards.filter(h=>h.danger),safe=P.hazards.filter(h=>!h.danger);g.targets=[{...danger[(g.wave-1)%danger.length],hole:hole[0],hit:false},{...safe[(g.wave-1)%safe.length],hole:hole[1],hit:false}];g.serial++;}
function act(g,a,v,now=0){if(!g||g.complete)return g;
 if(a==='pause'&&['play','running','rub','wet','rinse','soap','dry','connected'].includes(g.phase)){g.resumePhase=g.phase;g.phase='paused';g.pressed=false;g.micState='off';g.serial++;return g;}
 if(a==='resume'&&g.phase==='paused'){g.phase=g.resumePhase;g.lastAt=now;g.serial++;return g;}
 if(a==='finish'&&(g.phase==='result'||g.kind==='path'&&g.floor>=20)){return finish(g,g.kind==='path'?g.floor+'층을 올라갔어요. 실제 계단에서는 천천히, 필요한 도움을 받아요.':g.kind==='sort'?'오늘 사용할 도구와 선생님 담당 도구를 빠르게 구분했어요.':'위험을 발견하면 직접 만지지 않고 어른에게 알려요.');}
 if(g.kind==='path'){
  if(a==='difficulty'&&g.phase==='ready'){g.difficulty=v==='easy'?'easy':'normal';g.energy=g.difficulty==='easy'?8000:5500;g.serial++;}
  if(a==='start'&&g.phase==='ready'){g.phase='play';g.energy=g.difficulty==='easy'?8000:5500;g.lastAt=now;g.notice='오르기는 현재 방향으로 한 칸, 방향 전환은 돌아서 한 칸!';g.serial++;}
  if(a==='step'&&g.phase==='play'&&['turn','climb'].includes(v)){
   if(v==='turn')g.facing=g.facing==='right'?'left':'right';
   const wanted=g.steps[g.floor+1]>g.steps[g.floor]?'right':'left';g.lastDir=g.facing;
   if(g.facing===wanted){
    g.floor++;g.fastCombo=g.lastStepAt!==null&&now-g.lastStepAt<480?g.fastCombo+1:1;g.lastStepAt=now;
    if(g.fastCombo>=6&&now>=g.auraUntil){g.auraUntil=now+5000;g.fastCombo=0;}
    const fever=now<g.auraUntil;award(g,fever?100:50);g.energy=Math.min(g.difficulty==='easy'?8000:5500,g.energy+680);addStairs(g);g.feedback='ok';g.notice=fever?'빠른 연속 오르기! 점수 ×2':g.floor+'층!';
    const item=stairItem(g.floor);if(item){g.items.push({floor:g.floor,type:item});if(item==='coin'||item==='big-coin'){const n=item==='coin'?1:5;g.coins+=n;g.score+=n*20*(fever?2:1);g.notice='안전 코인 +'+n;}if(item==='energy'){g.energy=g.difficulty==='easy'?8000:5500;g.freezeUntil=now+2500;g.notice='충전! 잠깐 체력을 쉬어요.';}if(item==='shield'){g.shield=1;g.notice='보호 별! 한 번의 방향 실수를 도와줘요.';}}
   }else{g.wrong++;g.combo=0;g.fastCombo=0;g.feedback='wrong';if(g.shield){g.shield=0;g.facing=g.facing==='right'?'left':'right';g.notice='보호 별이 도왔어요. 다음 계단을 다시 봐요.';}else{g.phase='result';g.notice='다음 계단 방향을 놓쳤어요. 다시 도전할 수 있어요.';}}g.serial++;
  }
 }
 if(g.kind==='sort'){
  if(a==='speed'&&g.phase==='ready')g.speed=v==='easy'?'easy':'normal';
  if(a==='start'&&g.phase==='ready'){g.phase='play';g.lastAt=now;g.notice='왼쪽은 함께 사용, 오른쪽은 선생님 담당!';g.serial++;}
  if(a==='classify'&&g.phase==='play'&&['student','staff'].includes(v)){const t=sortCurrent(g);if(t.bin===v){g.correct++;g.sorted.push(t.id);award(g,100);g.feedback={kind:'ok',label:t.label};g.notice=t.why;}else{g.wrong++;g.combo=0;g.score=Math.max(0,g.score-30);g.feedback={kind:'wrong',label:t.label};g.notice=t.why;}sortAdvance(g);}
 }
 if(g.kind==='whack'){
  if(a==='wait-mode'){g.waitMode=!g.waitMode;g.serial++;}
  if(a==='start'&&g.phase==='ready'){g.phase='play';g.lastAt=now;whackWave(g);g.notice='위험 그림만 눌러서 알려요!';}
  if(a==='next'&&g.waitMode&&g.phase==='play')whackWave(g);
  if(a==='tap'&&g.phase==='play'){const t=g.targets.find(t=>t.hole===Number(v)&&!t.hit);if(!t)return g;t.hit=true;if(t.danger){g.correct++;g.found.push(t.id);award(g,100);g.notice=t.why;g.feedback={hole:t.hole,kind:'ok',label:'알려요!'};}else{g.wrong++;g.combo=0;g.score=Math.max(0,g.score-30);g.notice='안전한 행동은 그대로 두어요.';g.feedback={hole:t.hole,kind:'wrong',label:'다시 봐요'};}g.serial++;if(g.waitMode&&g.correct>=10){g.phase='result';g.serial++;}else if(g.waitMode&&g.targets.filter(t=>t.danger).every(t=>t.hit))whackWave(g);}
 }
 if(g.kind==='wash'){
  if(a==='water-on'&&['wet','rinse'].includes(g.phase)){g.pressed=true;g.waterOn=true;}
  if(a==='water-off')g.pressed=false;
  if(a==='soap'&&g.phase==='soap'){g.phase='rub';g.soap=true;g.notice=P.washSteps[0][1];g.serial++;}
  if(a==='stroke'&&g.phase==='rub'){g.motionUntil=now+160;g.stroke+=Math.min(80,Math.max(0,Number(v)||0));g.bubbles=Math.min(20,g.bubbles+1);}
  if(a==='hold'&&g.phase==='rub'){g.pressed=!!v;g.assisted=true;}
  if(a==='dry'&&g.phase==='dry')finish(g,'여섯 부위를 비누로 30초 이상 문질렀어요. 헹구고 물기를 말렸어요.');
 }
 if(g.kind==='dress'){
  if(a==='select'&&P.gear.some(t=>t.id===v)&&!g.worn.includes(v)){g.selected=v;g.notice='캐릭터의 '+(v==='cap'?'머리':v==='suit'?'옷':'몸')+'에 끌어 놓아요.';g.serial++;}
  if(a==='drop'&&g.selected){const t=P.gear.find(t=>t.id===g.selected);if(t.zone===v){g.worn.push(t.id);g.selected=null;g.notice=t.label+' 착용!';award(g,100);g.serial++;if(g.worn.length===3)finish(g,'수영모·수영복·구명조끼를 착용했어요. 선생님이 맞게 입었는지 확인해요.');}else{g.invalid++;g.notice=t.id==='scarf'?'긴 목도리는 물놀이에 사용하지 않아요.':'캐릭터의 알맞은 위치에 놓아요.';g.serial++;}}
 }
 if(g.kind==='call-order'){
  if(a==='digit'&&g.phase==='dial'&&/^\d$/.test(String(v))){g.digits=(g.digits+v).slice(0,8);g.serial++;}
  if(a==='erase'&&g.phase==='dial'){g.digits=g.digits.slice(0,-1);g.serial++;}
  if(a==='call'&&g.phase==='dial'){if(g.digits==='119'){g.phase='ringing';g.connectedMs=0;g.notice='연결 중…';}else g.notice='연습할 번호는 119예요. 지우고 다시 눌러요.';g.serial++;}
  if(a==='answer'&&g.phase==='connected'&&g.step<3){g.responses.push({step:g.step,mode:v==='mic'?'mic':'aac',text:callPrompts[g.step].answer});g.step++;g.talkMs=0;g.micState='off';g.notice=g.step<3?callPrompts[g.step].question:'안내를 들으며 기다려요. 선생님과 함께 있어요.';g.serial++;if(g.step===3){g.phase='listen';g.connectedMs=0;}}
 }
 if(flow[g.kind]){
  if(a==='select'&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<g.slots.length){g.selected=Number(v);g.wrongSlots=[];g.serial++;}
  if(a==='place'&&g.selected!==null&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<g.slots.length){const index=Number(v),card=g.selected,old=g.slots.indexOf(card),other=g.slots[index];if(old>=0)g.slots[old]=other;g.slots[index]=card;g.selected=null;g.wrongSlots=[];g.serial++;}
  if(a==='remove'&&g.slots[Number(v)]!==undefined){g.slots[Number(v)]=null;g.selected=null;g.serial++;}
  if(a==='check'){g.attempts++;g.wrongSlots=g.slots.flatMap((card,i)=>card===i?[]:[i]);g.notice=g.wrongSlots.length?'순서를 다시 살펴봐요. 그림을 옮겨 바꿀 수 있어요.':'순서를 완성했어요.';g.serial++;if(!g.wrongSlots.length)finish(g,'알맞은 순서를 완성했어요. 실제 상황에서는 선생님·직원의 안내를 따라요.');}
 }
 return g;
}
function tick(g,now,rms=0){if(!g||g.complete)return g;const dt=Math.max(0,Math.min(100,now-(g.lastAt??now)));g.lastAt=now;
 if(g.kind==='path'&&g.phase==='play'){g.elapsed+=dt;const wasAura=g.auraActive;g.auraActive=now<g.auraUntil;if(wasAura!==g.auraActive)g.serial++;if(now>=g.freezeUntil)g.energy-=dt*(1+Math.min(2.2,g.floor/120))*(g.auraActive?.65:1);if(g.energy<=0){g.energy=0;g.phase='result';g.notice='체력을 다 썼어요. 기록을 보고 다시 도전해요.';g.serial++;}}
 if(g.kind==='sort'&&g.phase==='play'){g.elapsed+=dt;g.itemMs+=dt;const limit=g.speed==='easy'?6000:Math.max(1800,3600-g.correct*50);if(g.itemMs>=limit){g.missed++;g.combo=0;g.notice='지나간 도구는 괜찮아요. 다음 도구를 골라요.';sortAdvance(g);}if(g.elapsed>=45000&&g.phase==='play'){g.phase='result';g.serial++;}}
 if(g.kind==='whack'&&g.phase==='play'){g.elapsed+=dt;g.waveMs+=dt;const limit=Math.max(1100,2200-g.wave*35);if(!g.waitMode&&g.waveMs>=limit){g.missed+=g.targets.filter(t=>t.danger&&!t.hit).length;g.combo=0;whackWave(g);}if(g.elapsed>=30000&&!g.waitMode){g.phase='result';g.serial++;}if(g.waitMode&&g.correct>=10){g.phase='result';g.serial++;}}
 if(g.kind==='wash'){
  if(['wet','rinse'].includes(g.phase)&&g.pressed){g.waterMs+=dt;if(g.waterMs>=1500){g.phase=g.phase==='wet'?'soap':'dry';g.waterMs=0;g.pressed=false;g.waterOn=false;g.notice=g.phase==='soap'?'비누를 손 위로 가져와요.':'수건을 손 위로 가져와 물기를 닦아요.';g.serial++;}}
  if(g.phase==='rub'&&(now<=g.motionUntil||g.pressed)){const add=Math.min(dt,5000-g.rubMs);g.rubMs+=add;g.totalRubMs+=add;if(g.rubMs>=5000){g.step++;g.rubMs=0;g.stroke=0;g.pressed=false;g.motionUntil=0;g.phase=g.step===6?'rinse':'rub';g.notice=g.step===6?'손을 흐르는 물 아래에 대어 헹궈요.':P.washSteps[g.step][1];g.serial++;}}
 }
 if(g.kind==='call-order'){
  if(g.phase==='ringing'){g.connectedMs+=dt;if(g.connectedMs>=1200){g.phase='connected';g.notice=callPrompts[0].question;g.serial++;}}
  if(g.phase==='connected'&&g.micState==='listening'){g.voiceLevel=Math.min(1,rms/.08);if(rms>.012)g.talkMs+=dt;if(g.talkMs>=2000){g.micState='heard';g.notice='목소리를 들었어요. 말한 내용은 선생님과 함께 확인해요.';g.serial++;}}
  if(g.phase==='listen'){g.connectedMs+=dt;if(g.connectedMs>=2200)finish(g,'119 신고 연습을 마쳤어요. 위치·상황·필요한 도움을 알리고 안내를 기다려요.');}
 }
 return g;
}
const api={has:k=>kinds.has(k),kinds:[...kinds],create,act,tick,flow,callPrompts,sortCurrent,addStairs,stairItem};root.SafetyArcade=api;
// 기존 진입·다시하기·스토리 진행이 같은 상태 객체를 사용합니다.
const prior={has:P.has,create:P.create,act:P.act,tick:P.tick};P.has=k=>api.has(k)||prior.has(k);P.create=(p,k)=>api.has(k)?create(p,k):prior.create(p,k);P.act=(g,a,v)=>api.has(g?.kind)?act(g,a,v,g.lastAt||0):prior.act(g,a,v);P.tick=(g,n,r)=>api.has(g?.kind)?tick(g,n,r):prior.tick(g,n,r);
if(typeof module!=='undefined')module.exports=api;
})(globalThis);
