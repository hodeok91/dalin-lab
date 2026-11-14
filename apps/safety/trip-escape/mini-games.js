/* 미니게임 상태. 빠른 반응·정확한 좌표를 학습 점수로 평가하지 않습니다. */
(function(root){
'use strict';
const pathPlaces=new Set(['park','garden','heritage','cinema']);
const pathLabels={park:['정해진 산책로','그늘에서 쉬기','선생님과 만나는 곳'],garden:['관찰로로 이동','식물은 눈으로 관찰','일행과 만나는 곳'],heritage:['이용 가능한 길 확인','관람 구역 안에서 보기','선생님과 함께 이동'],museum:['관람선 밖에서 보기','안내를 확인하기','일행과 함께 이동'],'theme-park':['이용 조건 확인','차례를 기다리기','안내에 따라 이용']};
pathLabels.cinema=['통로에서 천천히','계단·발밑 확인','선생님과 출구 앞 도착'];
const memoryKeys={sports:['wait','stop','rest'],cinema:['exit','help','slow'],museum:['slow','teacher','together'],experience:['teacher','again','help'],'theme-park':['sit','wait','help'],park:['water','stop','together'],garden:['stop','slow','hurt'],heritage:['help','stop','rest'],lodging:['help','bag','teacher'],night:['help','toilet','wait'],bus:['seatbelt','sit','wait'],rest:['together','toilet','slow']};
const pairSets={
 museum:[['teacher','궁금한 전시물이 있어요','teacher','안내를 확인하고 물어봐요'],['together','다른 전시실로 이동해요','together','선생님과 함께 가요'],['scared','소리나 환경이 힘들어요','rest','알리고 잠시 쉬어요']],
 experience:[['unknown','사용 방법을 잘 모르겠어요','again','다시 보여 달라고 알려요'],['hurt','몸이 아프거나 불편해요','help','멈추고 도움을 요청해요'],['bag','체험을 시작할 준비를 해요','bag','긴 끈과 소지품을 정리해요']],
 'theme-park':[['bag','물건이 울타리 안으로 떨어졌어요','help','직원에게 알려요'],['sit','놀이기구가 움직이고 있어요','sit','앉아서 멈출 때까지 기다려요'],['scared','이용해도 되는지 잘 모르겠어요','teacher','선생님과 이용 조건을 확인해요']],
 lodging:[['toilet','밤에 화장실에 가고 싶어요','teacher','선생님께 알리고 약속대로 가요'],['hurt','몸이 아파요','help','담당 선생님께 알려요'],['bag','가방이 통로에 놓였어요','bag','이동 길을 막지 않게 정리해요']],
 bus:[['seatbelt','출발하기 전이에요','seatbelt','안전벨트를 확인해요'],['sit','버스가 달리고 있어요','sit','자리에 앉아 있어요'],['wait','버스에서 내릴 준비를 해요','teacher','멈춘 뒤 안내에 따라 내려요']]
};
const dodgeRounds=[[{lane:1,key:'grass'}],[{lane:0,key:'water-edge'},{lane:2,key:'grass'}],[{lane:0,key:'bee'},{lane:1,key:'snake'}],[{lane:2,key:'puddle'}],[{lane:1,key:'grass'},{lane:2,key:'water-edge'}],[{lane:0,key:'snake'},{lane:2,key:'bee'}],[{lane:0,key:'grass'},{lane:1,key:'puddle'}],[{lane:1,key:'bee'},{lane:2,key:'snake'}]];
const hazardNames={'water-edge':'물가',grass:'풀숲',bee:'벌',snake:'뱀',puddle:'젖은 바닥'};
const gameInfo={jump:{title:'안전 리듬 점프',goal:'점프·기다림·멈춤 박자를 지키고 휴식하기',icon:'play'},torch:{title:'손전등 탐색',goal:'안전장치 세 곳 찾기',icon:'search'},path:{title:'안전한 길 찾기',goal:'안전 지점을 따라 목적지에 도착하기',icon:'start'},prep:{title:'안전 준비 카드',goal:'준비할 안전 행동 세 가지 모으기',icon:'goal'},matching:{title:'안전 짝맞추기',goal:'상황과 안전한 행동 연결하기',icon:'select'},memory:{title:'같은 그림 찾기',goal:'안전 그림 세 쌍 찾기',icon:'picture'},dodge:{title:'공원 안전 피하기',goal:'내려오는 위험 그림을 피하며 생존 점수 겨루기',icon:'play'}};
function catalog(place){const kinds=({sports:['jump','memory'],cinema:['memory'],museum:['matching','memory'],experience:['matching','prep'],'theme-park':['matching','memory'],park:['dodge','path','memory'],garden:['path','memory'],heritage:['path','memory'],lodging:['matching'],escape:['torch']})[place]||[];return kinds.map(id=>({id,...gameInfo[id]}));}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const sequences={
 'evac-order':{title:'안전한 경로가 확인됐어요',description:'선생님이 이동 가능한 안전 경로를 확인한 장면이에요. 실제 상황은 담당자의 피난계획과 안내를 따라요.',cards:[['fire','주변과 선생님께 알리고 안내 확인'],['exit','물건을 두고 확인된 경로로 함께 이동'],['together','집결지에서 인원 확인 · 다시 들어가지 않기']]},
 'call-order':{title:'119 구조 요청을 연습해요',description:'실제 전화 연결은 없어요. 위치·상황·필요한 도움은 상담원의 질문에 맞춰 알려요.',cards:[['help','119에 연결하거나 가능한 연락 수단으로 도움 요청'],['here','어디인지 · 무슨 일인지 · 필요한 도움 알리기'],['wait','상담원의 질문과 안내를 확인하며 기다리기']]}
};
function create(place,kind){
 if(sequences[kind])return {kind:'sequence',sequence:kind,order:shuffle([0,1,2]),step:0,complete:false,notice:'처음 할 일부터 하나씩 골라요. 틀려도 처음부터 다시 하지 않아요.'};
 if(kind==='memory'){const keys=memoryKeys[place]||memoryKeys.museum;return {kind:'memory',cards:shuffle(keys.flatMap((key,i)=>[{id:i+'a',key},{id:i+'b',key}])),open:[],matched:[],awaiting:false,complete:false,notice:'카드를 눌러 같은 안전 그림 세 쌍을 찾아요.'};}
 if(kind==='matching'){const pairs=(pairSets[place]||pairSets.museum).map((p,i)=>({id:i,leftKey:p[0],left:p[1],rightKey:p[2],right:p[3]}));return {kind:'matching',pairs,rightOrder:shuffle([0,1,2]),selected:null,matched:[],complete:false,notice:'왼쪽 상황을 고르고, 짝이 되는 오른쪽 행동을 골라요.'};}
 if(kind==='dodge')return {kind:'dodge',phase:'ready',pace:'slow',round:0,lane:1,hearts:3,avoided:0,elapsedMs:0,waveMs:0,score:0,complete:false,ended:false,notice:'내려오는 위험 그림을 보고 왼쪽·오른쪽으로 피해요.'};
 if(kind==='prep')return null;
 if(place==='sports')return {kind:'jump',rhythm:true,phase:'wait',pace:'slow',beatMs:1200,windowMs:420,assist:false,sound:true,count:0,cueIndex:0,accepted:false,blocked:false,inAir:false,retries:0,complete:false,notice:'친구가 먼저 이용하고 있어요. 내 차례를 기다려요.'};
 if(place==='escape')return {kind:'torch',found:[],bright:false,complete:false,notice:'손전등을 움직여 안전장치 3곳을 찾아 눌러요.'};
 if(pathPlaces.has(place)&&(place!=='cinema'||kind==='path'))return {kind:'path',place,step:0,complete:false,notice:'출발! 다음 안전 지점을 차례대로 골라요.'};
 return null;
}
/* 실제 박자 시계. 타이밍 결과는 학습 점수·실패 판정에 사용하지 않습니다. */
const rhythmPattern=['jump','jump','wait','jump','stop','jump','jump','wait','jump','jump','stop','jump'];
function rhythmCue(g){return rhythmPattern[g.cueIndex];}
function rhythmAct(g,action,value){const now=Number.isFinite(value)?value:0;
 if(g.complete)return g;
 if(action==='pace'){if(g.phase!=='wait')return g;g.pace=value==='regular'?'regular':'slow';g.beatMs=g.pace==='slow'?1200:800;g.windowMs=g.pace==='slow'?420:280;return g;}
 if(action==='assist'){g.assist=!g.assist;g.notice=g.assist?'점프 신호에서 누를 때까지 기다려 줄게요.':'박자가 기준선에 올 때 눌러요.';return g;}
 if(action==='sound'){g.sound=!g.sound;return g;}
 if(action==='wait'&&g.phase==='wait'){g.phase='countdown';g.startedAt=now;g.dueAt=now+3*g.beatMs;g.notice='친구가 마칠 때까지 기다려요. 준비, 셋, 둘, 하나!';return g;}
 if(action==='pause'&&['countdown','ready'].includes(g.phase)){g.beforePause=g.phase;g.phase='paused';g.pausedAt=now;g.notice='잠시 쉬어요. 준비되면 이어서 해요.';return g;}
 if(action==='resume'&&g.phase==='paused'){const shift=now-g.pausedAt;g.dueAt+=shift;g.startedAt+=shift;if(g.jumpAt!==undefined)g.jumpAt+=shift;if(g.assistEnd)g.assistEnd+=shift;g.phase=g.beforePause;g.notice='쉬던 박자부터 이어서 해요.';return g;}
 if(action==='jump')return rhythmInput(g,now);
 if(action==='rest'&&g.phase==='rest'){g.complete=true;g.notice='점프·기다림·멈춤 박자를 지키고 쉬고 싶다고 표현했어요!';}
 return g;
}
function rhythmInput(g,now){
 if(g.phase!=='ready'||g.complete){g.notice=g.phase==='countdown'||g.phase==='wait'?'아직 친구 차례예요. 기다려요.':g.notice;return g;}
 const cue=rhythmCue(g);if(g.accepted)return g;
 if(cue!=='jump'){if(!g.blocked){g.blocked=true;g.retries++;}g.notice=cue==='stop'?'빨강은 멈춰요. 손을 떼고 다음 박자를 기다려요.':'노랑은 기다려요. 손을 떼어요.';return g;}
 if(g.assist&&now>=g.dueAt-g.windowMs||Math.abs(now-g.dueAt)<=g.windowMs){g.accepted=true;g.count++;g.jumpAt=now;g.inAir=true;g.notice=g.assist?'내 차례에 안전하게 점프했어요!':'박자에 맞춰 점프했어요!';if(g.assist)g.assistEnd=now+Math.min(400,g.beatMs/2);}
 else{g.notice=now<g.dueAt?'조금 기다려요. 초록 신호가 기준선에 오면 눌러요.':'괜찮아요. 같은 박자를 다시 해봐요.';}
 return g;
}
function rhythmTick(g,now){
 if(g.inAir&&now-g.jumpAt>=550)g.inAir=false;
 if(g.phase==='countdown'){if(now>=g.dueAt-g.windowMs){g.phase='ready';g.notice='이제 내 차례예요. 초록 신호에 맞춰 점프해요.';}else return g;}
 if(g.phase!=='ready'||g.complete)return g;
 const end=g.assist&&rhythmCue(g)==='jump'?(g.accepted?g.assistEnd:Infinity):g.dueAt+g.windowMs;
 if(now<=end)return g;
 const success=rhythmCue(g)==='jump'?g.accepted:!g.blocked;
 if(success){g.cueIndex++;if(g.cueIndex===rhythmPattern.length){g.phase='rest';g.notice='모든 박자를 지켰어요. 이제 쉬고 싶다고 알려요.';return g;}}
 else{g.retries++;g.notice='괜찮아요. 이 박자를 한 번 더 해봐요.';}
 g.accepted=false;g.blocked=false;g.assistEnd=null;g.dueAt=Math.max(g.dueAt+g.beatMs,now+g.windowMs+120);
 return g;
}
const targets=[{id:'ext',label:'소화기',x:13,y:56,area:'왼쪽 벽 살펴보기'},{id:'alarm',label:'화재경보기',x:42,y:52,area:'가운데 벽 살펴보기'},{id:'exit',label:'비상구 유도등',x:81,y:36,area:'오른쪽 위 살펴보기'}];
targets[0].box=[5,29,15.5,42];targets[1].box=[40,42.5,8,16];targets[2].box=[74.5,30,9.5,11];
function scoreFinding(g,id,validIds){g.rewarded??=[];if(validIds.includes(id)&&(g.rewarded.includes(id)||g.found?.includes(id)))return {kind:'repeat',delta:0};g.attempts=(g.attempts||0)+1;const hit=validIds.includes(id);const delta=hit?100:-10;if(hit)g.rewarded.push(id);else g.misses=(g.misses||0)+1;g.score=(g.score||0)+delta;return {kind:hit?'found':'miss',delta};}
function act(g,action,value){
 if(!g||g.complete)return g;
 if(g.kind==='jump'){rhythmAct(g,action,value);return g;}

 if(g.kind==='torch'){
  if(action==='bright')g.bright=!g.bright;
  if(action==='find'&&targets.some(t=>t.id===value)&&!g.found.includes(value)){g.found.push(value);g.notice=targets.find(t=>t.id===value).label+' 위치를 찾았어요!';if(g.found.length===targets.length){g.complete=true;g.notice='안전장치 3곳 발견! 미리 위치를 알아뒀어요.';}}
 }
 if(g.kind==='path'){
  if(action==='hazard'){g.notice='그쪽은 안전한 길이 아니에요. 정해진 다음 지점으로 가요.';}
  if(action==='move'){if(value===g.step){g.step++;g.notice=pathLabels[g.place][g.step-1]+'에 도착했어요.';if(g.step===3){g.complete=true;g.notice='안전한 길을 따라 목적지에 도착했어요!';}}else g.notice='하나씩 이동해요. 다음 지점을 먼저 골라요.';}
 }
 if(g.kind==='memory'){
  if(action==='flip'&&!g.awaiting&&g.cards[value]&&!g.matched.includes(g.cards[value].key)&&!g.open.includes(value)){g.open.push(value);g.notice='같은 그림을 하나 더 찾아요.';if(g.open.length===2){const[a,b]=g.open.map(i=>g.cards[i]);if(a.key===b.key){g.matched.push(a.key);g.open=[];g.notice='같은 그림 한 쌍을 찾았어요!';if(g.matched.length===3){g.complete=true;g.notice='안전 그림 세 쌍을 모두 찾았어요!';}}else{g.awaiting=true;g.notice='그림을 충분히 살펴보고 다시 뒤집어요.';}}}
  if(action==='reset'){g.open=[];g.awaiting=false;g.notice='다시 천천히 찾아요.';}
 }
 if(g.kind==='matching'){
  if(action==='left'&&!g.matched.includes(value)){g.selected=value;g.notice=g.pairs[value].left+' · 짝이 되는 행동을 골라요.';}
  if(action==='right'&&!g.matched.includes(value)){if(g.selected===null)g.notice='왼쪽 상황을 먼저 골라요.';else if(g.selected===value){g.matched.push(value);g.selected=null;g.notice='상황에 맞는 안전 행동을 연결했어요!';if(g.matched.length===3){g.complete=true;g.notice='안전 행동 세 쌍을 모두 연결했어요!';}}else g.notice='다시 함께 생각해 봐요. 상황에 맞는 행동을 골라요.';}
 }
 if(g.kind==='dodge')return dodgeAct(g,action,value);
 if(g.kind==='sequence'&&action==='pick'){
  if(value===g.step){g.step++;g.notice='순서를 확인했어요. 다음 할 일을 골라요.';if(g.step===3){g.complete=true;g.notice='행동 순서를 모두 확인했어요. 실제 현장에서는 담당자의 안내를 따라요.';}}
  else g.notice='이 행동도 필요해요. 지금 먼저 할 일을 다시 찾아봐요.';
 }
 return g;
}

function dodgeDuration(g){return Math.max(g.pace==='slow'?1600:1200,(g.pace==='slow'?4600:3400)-g.round*110);}
function dodgeObstacles(g){return dodgeRounds[g.round%dodgeRounds.length];}
function dodgeScore(g){return Math.floor(g.elapsedMs/1000)*10+g.avoided*50;}
function dodgeTick(g,now){
 if(g.kind!=='dodge'||g.ended||!['running','hit'].includes(g.phase))return g;
 const dt=Math.max(0,now-g.lastAt);g.lastAt=now;
 if(g.phase==='hit'){if(now-g.hitAt>=750){if(g.hearts===0){g.phase='result';g.ended=true;g.notice='이번 도전을 마쳤어요. 기록을 확인해요.';}else{g.round++;g.waveMs=0;g.phase='running';g.notice='다시 앞을 보고 위험 그림을 피해요.';}}return g;}
 g.elapsedMs+=dt;g.waveMs+=dt;
 if(g.waveMs>=dodgeDuration(g)){
  const hazards=dodgeObstacles(g),hit=hazards.find(h=>h.lane===g.lane);
  if(hit){g.hearts--;g.phase='hit';g.hitAt=now;g.notice=hazardNames[hit.key]+' 그림에 닿았어요. 남은 기회 '+g.hearts+'번이에요.';}
  else{g.avoided+=hazards.length;g.round++;g.waveMs=0;g.notice='안전하게 피했어요! 다음 그림도 살펴봐요.';}
 }
 g.score=dodgeScore(g);return g;
}
function dodgeAct(g,action,value){
 if(action==='start'&&['ready','result'].includes(g.phase)){const pace=g.pace;Object.assign(g,create('park','dodge'),{pace,phase:'running',lastAt:value,recorded:false});return g;}
 if(action==='pace'&&['ready','result'].includes(g.phase)){g.pace=g.pace==='slow'?'normal':'slow';return g;}
 if(action==='pause'&&['running','hit'].includes(g.phase)){g.resumePhase=g.phase;g.phase='paused';g.pausedAt=value;return g;}
 if(action==='resume'&&g.phase==='paused'){if(g.resumePhase==='hit')g.hitAt+=value-g.pausedAt;g.phase=g.resumePhase;g.lastAt=value;return g;}
 if(action==='finish'&&g.ended){g.complete=true;return g;}
 if(!['ready','running','hit'].includes(g.phase))return g;
 if(action==='left')g.lane=Math.max(0,g.lane-1);
 if(action==='right')g.lane=Math.min(2,g.lane+1);
 return g;
}

const api={create,act,dodgeDuration,dodgeObstacles,dodgeTick,dodgeAct,dodgeScore,rhythmPattern,rhythmCue,rhythmTick,rhythmInput,targets,scoreFinding,pathLabels:{...pathLabels,cinema:['통로에서 천천히','계단·발밑 확인','선생님과 출구 앞 도착']},catalog,gameInfo,dodgeRounds,hazardNames,sequences};root.SafetyMiniGames=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
