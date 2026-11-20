/* 미니게임 상태. 빠른 반응·정확한 좌표를 학습 점수로 평가하지 않습니다. */
(function(root){
'use strict';
const song=root.SafetySong||(typeof require==='function'?require('./rhythm-song.js'):null);
const PG=root.SafetyPlaceGames||(typeof require==='function'?require('./place-games.js'):null);
const Arcade=root.SafetyArcade||(typeof require==='function'?require('./arcade'):null);
const difficultyInfo={easy:{label:'쉬움',window:320,approach:3400},normal:{label:'보통',window:250,approach:2600},hard:{label:'어려움',window:180,approach:2200},expert:{label:'매우 어려움',window:120,approach:1800}};
const rhythmCharts={normal:song.notes};
let jumpSerial=0;rhythmCharts.easy=song.notes.filter(n=>n.kind==='stop'||jumpSerial++%2===0);
for(const mode of ['hard','expert']){const list=song.notes.map(n=>({...n}));for(let i=0;i<song.notes.length-1;i++){const a=song.notes[i],b=song.notes[i+1],gap=b.t-a.t;if(a.kind==='jump'&&b.kind==='jump'&&gap>=600){const fractions=mode==='expert'&&i%2===0?[.25,.5,.75]:[.5];for(const f of fractions)list.push({t:Math.round(a.t+gap*f),kind:'jump'});}}rhythmCharts[mode]=list.sort((a,b)=>a.t-b.t);}
function rhythmNotes(g){return rhythmCharts[g?.difficulty||'normal']||rhythmCharts.normal;}
function rhythmApproach(g){return difficultyInfo[g?.difficulty||'normal'].approach;}
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
/* 각 구간에 이어지는 우회로를 보장합니다. 벌·뱀은 점프 대상이 아닙니다. */
const dodgeDifficulties={easy:{label:'쉬움',start:5200,min:2400,step:85},normal:{label:'보통',start:2400,min:1500,step:40},hard:{label:'어려움',start:1800,min:1200,step:25},expert:{label:'매우 어려움',start:1400,min:1000,step:20}};
const dodgeRounds=[
 [{lane:1,key:'branch'}],
 [{lane:1,key:'stone'},{lane:2,key:'branch'}],
 [{lane:0,key:'bee'},{lane:2,key:'stone'}],
 [{lane:0,key:'snake'},{lane:1,key:'stone'}],
 [{lane:0,key:'branch'},{lane:1,key:'puddle'}],
 [{lane:0,key:'puddle'},{lane:2,key:'bee'}],
 [{lane:1,key:'snake'},{lane:2,key:'branch'}],
 [{lane:1,key:'stone'},{lane:2,key:'puddle'}],
 [{lane:0,key:'branch'},{lane:2,key:'snake'}],
 [{lane:0,key:'bee'},{lane:1,key:'branch'}],
 [{lane:0,key:'stone'},{lane:2,key:'puddle'}],
 [{lane:1,key:'branch'},{lane:2,key:'bee'}]
];
const hazardNames={branch:'쓰러진 가지',stone:'길 위의 돌','water-edge':'물가',grass:'풀숲',bee:'벌',snake:'뱀',puddle:'젖은 바닥'};
const gameInfo={jump:{title:'안전 리듬 점프',goal:'노래 끝까지 점프·멈춤 노트를 연습하고 쉬기',icon:'play'},torch:{title:'손전등 탐색',goal:'안전장치 세 곳 찾기',icon:'search'},path:{title:'관찰 계단 기록 도전',goal:'다음 계단 방향을 골라 계속 올라가기',icon:'start'},prep:{title:'안전 행동 장면 찾기',goal:'한 장면에서 안전한 행동 세 곳 찾기',icon:'goal'},matching:{title:'안전 짝맞추기',goal:'상황과 안전한 행동 연결하기',icon:'select'},memory:{title:'같은 그림 찾기',goal:'안전 그림 세 쌍 찾기',icon:'picture'},dodge:{title:'공원 안전 피하기',goal:'산책길의 위험을 피하고 안전별을 모으며 기록 겨루기',icon:'play'}};
function catalog(place){const kinds=({sports:['jump','memory'],cinema:['memory'],museum:['matching','memory'],experience:['matching','prep'],'theme-park':['matching','memory'],park:['dodge','path','memory'],garden:['path','memory'],heritage:['path','memory'],lodging:['matching'],escape:['torch']})[place]||[];return kinds.map(id=>({id,...gameInfo[id]}));}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const sequences={
 'evac-order':{title:'안전한 경로가 확인됐어요',description:'선생님이 이동 가능한 안전 경로를 확인한 장면이에요. 실제 상황은 담당자의 피난계획과 안내를 따라요.',cards:[['fire','주변과 선생님께 알리고 안내 확인'],['exit','물건을 두고 확인된 경로로 함께 이동'],['together','집결지에서 인원 확인 · 다시 들어가지 않기']]},
 'call-order':{title:'119 구조 요청을 연습해요',description:'실제 전화 연결은 없어요. 위치·상황·필요한 도움은 상담원의 질문에 맞춰 알려요.',cards:[['help','119에 연결하거나 가능한 연락 수단으로 도움 요청'],['here','어디인지 · 무슨 일인지 · 필요한 도움 알리기'],['wait','상담원의 질문과 안내를 확인하며 기다리기']]}
};
function create(place,kind){
 if(!kind&&['garden','heritage','park'].includes(place))kind='path';
 if(PG.has(kind))return PG.create(place,kind);
 if(sequences[kind])return {kind:'sequence',sequence:kind,order:shuffle(sequences[kind].cards.map((_,i)=>i)),step:0,complete:false,notice:'처음 할 일부터 하나씩 골라요. 틀려도 처음부터 다시 하지 않아요.'};
 if(kind==='memory'){const keys=memoryKeys[place]||memoryKeys.museum;return {kind:'memory',cards:shuffle(keys.flatMap((key,i)=>[{id:i+'a',key},{id:i+'b',key}])),open:[],matched:[],awaiting:false,complete:false,notice:'카드를 눌러 같은 안전 그림 세 쌍을 찾아요.'};}
 if(kind==='matching'){const pairs=(pairSets[place]||pairSets.museum).map((p,i)=>({id:i,leftKey:p[0],left:p[1],rightKey:p[2],right:p[3]}));return {kind:'matching',pairs,rightOrder:shuffle([0,1,2]),selected:null,matched:[],complete:false,notice:'왼쪽 상황을 고르고, 짝이 되는 오른쪽 행동을 골라요.'};}
 if(kind==='dodge')return {kind:'dodge',phase:'ready',pace:'normal',difficulty:'normal',mode:'normal',cape:0,capeWorn:false,combo:0,maxCombo:0,feverCharge:0,feverWaves:0,feverCount:0,feverBonus:0,feverTimeMs:0,shieldHits:0,shieldAt:null,barrierRound:null,jumpUntil:0,jumpAt:0,round:0,lane:1,x:.5,direction:0,hearts:3,avoided:0,collected:0,elapsedMs:0,waveMs:0,score:0,complete:false,ended:false,notice:'방향키나 화면 버튼을 누르는 동안 산책길에서 좌우로 움직여요.'};
 if(kind==='prep')return null;
 if(place==='sports')return {kind:'jump',rhythm:true,phase:'wait',difficulty:'normal',pace:'normal',assist:false,volume:.8,count:0,cueIndex:0,results:[],positionMs:0,score:0,combo:0,maxCombo:0,feverMode:'auto',feverReady:false,held:false,activeHold:null,feverCharge:0,feverUntilMs:0,feverCount:0,feverBonus:0,perfect:0,great:0,good:0,miss:0,stopCorrect:0,stopErrors:0,stray:0,inAir:false,complete:false,songEnded:false,notice:'점프 노트는 누르고, 멈춰요 노트는 누른 채 유지해요.'};
 if(place==='escape')return {kind:'torch',found:[],bright:false,complete:false,notice:'손전등을 움직여 안전장치 3곳을 찾아 눌러요.'};
 if(pathPlaces.has(place)&&(place!=='cinema'||kind==='path'))return {kind:'path',place,step:0,complete:false,notice:'출발! 다음 안전 지점을 차례대로 골라요.'};
 return null;
}
/* 노래 재생 위치를 기준으로 판정합니다. 틀려도 노래와 노트는 계속됩니다. */
const rhythmPattern=song.notes.map(n=>n.kind);
function rhythmCue(g){return rhythmNotes(g)[g.cueIndex]?.kind;}
function rhythmHoldDuration(g,index=g.cueIndex){const notes=rhythmNotes(g),n=notes[index];return Math.max(180,Math.min(650,(notes[index+1]?.t||song.durationMs)-n.t-180));}
function rhythmWindow(g){return difficultyInfo[g.difficulty||'normal'].window+(g.assist?70:0);}
function rhythmFever(g,now=g.positionMs||0){return (g.feverUntilMs||0)>now;}
function rhythmMultiplier(g,now=g.positionMs||0){return rhythmFever(g,now)?2:1;}
function rhythmBreak(g){g.combo=0;g.feverCharge=0;}
function rhythmAward(g,base,now){const multiplier=rhythmMultiplier(g,now),points=base*multiplier;g.score+=points;g.feverBonus=(g.feverBonus||0)+points-base;g.combo++;g.maxCombo=Math.max(g.maxCombo,g.combo);g.lastAward={base,multiplier,points};if(!rhythmFever(g,now)){g.feverCharge=Math.min(100,(g.feverCharge||0)+8+Math.min(g.combo,10));if(g.feverCharge===100){if(g.feverMode==='manual')g.feverReady=true;else{g.feverCharge=0;g.feverUntilMs=now+8000;g.feverCount=(g.feverCount||0)+1;}} }return points;}
function rhythmFeedback(g,kind,label,now){g.feedback={kind,label,at:now,serial:(g.feedback?.serial||0)+1};}
function rhythmAct(g,action,value){
 if(g.complete)return g;
 if(action==='difficulty'&&['wait','error'].includes(g.phase)&&difficultyInfo[value]){g.difficulty=value;return g;}
 if(action==='pace'&&['wait','paused','error'].includes(g.phase)){g.pace=value==='slow'?'slow':'normal';return g;}
 if(action==='fever-mode'&&['wait','error'].includes(g.phase)){g.feverMode=value==='manual'?'manual':'auto';return g;}
 if(action==='fever'&&g.phase==='ready'&&g.feverReady){g.feverReady=false;g.feverCharge=0;g.feverUntilMs=(value??g.positionMs)+8000;g.feverCount=(g.feverCount||0)+1;return g;}
 if(action==='assist'){g.assist=!g.assist;return g;}
 if(action==='wait'&&['wait','loading','error'].includes(g.phase)){g.phase='ready';g.positionMs=0;g.notice='노래의 박자에 맞춰 점프 노트를 눌러요.';return g;}
 if(action==='pause'&&g.phase==='ready'){g.held=false;if(g.activeHold)g.holdResume=true;g.phase='paused';g.notice='노래와 노트가 함께 멈췄어요.';return g;}
 if(action==='resume'&&g.phase==='paused'){g.phase='ready';g.notice='멈춘 노래부터 이어서 해요.';return g;}
 if(action==='jump')return rhythmInput(g,value);
 if(action==='rest'&&g.phase==='rest'&&g.songEnded){g.complete=true;g.notice='노래 끝까지 안전 점프를 연습하고 쉬고 싶다고 표현했어요.';}
 return g;
}
function rhythmDown(g,now){
 if(g.phase!=='ready'||g.complete||!Number.isFinite(now)||g.held)return g;
 rhythmTick(g,now);if(g.activeHold&&g.holdResume){g.held=true;delete g.holdResume;return g;}
 const n=rhythmNotes(g)[g.cueIndex];g.held=true;if(!n||g.results[g.cueIndex])return g;
 const delta=now-n.t,window=rhythmWindow(g);if(Math.abs(delta)>window){g.stray++;rhythmBreak(g);rhythmFeedback(g,'oops','기준선에서 눌러요.',now);return g;}
 const error=Math.abs(delta),base=difficultyInfo[g.difficulty||'normal'].window,grade=error<=Math.min(90,base*.45)?'perfect':error<=Math.min(170,base*.8)?'great':'good';
 if(n.kind==='stop'){g.activeHold={index:g.cueIndex,start:now,end:n.t+rhythmHoldDuration(g),grade};g.notice='꼬리가 기준선을 지날 때까지 누른 채 유지해요.';return g;}
 g.results[g.cueIndex]=grade;g[grade]++;rhythmAward(g,grade==='perfect'?100:grade==='great'?80:50,now);g.count++;g.jumpAt=now;g.jumpDuration=Math.max(140,Math.min(500,((rhythmNotes(g)[g.cueIndex+1]?.t||now+700)-now)*.8));g.inAir=true;rhythmFeedback(g,grade,grade==='perfect'?'정확해요!':grade==='great'?'최고예요!':'좋아요!',now);return g;
}
function rhythmUp(g,now){if(g.phase==='ready')rhythmTick(g,now);g.held=false;if(g.activeHold&&!g.holdResume){const own=g.activeHold;g.results[own.index]='oops';g.stopErrors++;rhythmBreak(g);rhythmFeedback(g,'oops','멈춤 꼬리 끝까지 유지해요.',now);g.activeHold=null;}return g;}
function rhythmInput(g,now){rhythmDown(g,now);rhythmUp(g,now);return g;}
function rhythmTick(g,now){
 if(g.phase!=='ready'||g.complete||!Number.isFinite(now))return g;
 g.positionMs=Math.max(0,Math.min(song.durationMs,now));if(g.inAir&&now-g.jumpAt>=(g.jumpDuration||500))g.inAir=false;
 if(g.activeHold&&g.held&&now>=g.activeHold.end){const own=g.activeHold;g.results[own.index]='hold';g.stopCorrect++;rhythmAward(g,50,own.end);rhythmFeedback(g,'good','멈춤 유지 성공!',now);g.activeHold=null;g.cueIndex=own.index+1;}
 const notes=rhythmNotes(g);while(g.cueIndex<notes.length){const n=notes[g.cueIndex],hold=g.activeHold?.index===g.cueIndex;
  const deadline=n.t+(hold?rhythmHoldDuration(g):0)+rhythmWindow(g);if(now<=deadline)break;
  if(!g.results[g.cueIndex]){g.results[g.cueIndex]='retry';if(n.kind==='stop'){g.stopErrors++;g.activeHold=null;}else g.miss++;rhythmBreak(g);rhythmFeedback(g,'retry','다음 노트에서 다시 해봐요.',now);}g.cueIndex++;
 }
 g.dueAt=notes[g.cueIndex]?.t??song.durationMs;return g;
}
function rhythmEnd(g){if(g.phase!=='ready')return g;rhythmTick(g,song.durationMs+rhythmWindow(g)+1);g.songEnded=true;g.positionMs=song.durationMs;g.phase='rest';g.feverUntilMs=0;g.held=false;g.activeHold=null;g.inAir=false;g.notice='노래 끝까지 함께했어요. 기록을 보고 잠깐 쉬어요.';return g;}
const targets=[{id:'ext',label:'소화기',x:13,y:56,area:'왼쪽 벽 살펴보기'},{id:'alarm',label:'화재경보기',x:42,y:52,area:'가운데 벽 살펴보기'},{id:'exit',label:'비상구 유도등',x:81,y:36,area:'오른쪽 위 살펴보기'}];
targets[0].box=[5,29,15.5,42];targets[1].box=[40,42.5,8,16];targets[2].box=[74.5,30,9.5,11];
function scoreFinding(g,id,validIds){g.rewarded??=[];if(validIds.includes(id)&&(g.rewarded.includes(id)||g.found?.includes(id)))return {kind:'repeat',delta:0};g.attempts=(g.attempts||0)+1;const hit=validIds.includes(id);const delta=hit?100:-10;if(hit)g.rewarded.push(id);else g.misses=(g.misses||0)+1;g.score=(g.score||0)+delta;return {kind:hit?'found':'miss',delta};}
function act(g,action,value){
 if(!g||g.complete)return g;
 if(PG.has(g.kind))return PG.act(g,action,value);
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
  if(value===g.step){g.step++;g.notice='순서를 확인했어요. 다음 할 일을 골라요.';if(g.step===sequences[g.sequence].cards.length){g.complete=true;g.notice='행동 순서를 모두 확인했어요. 실제 현장에서는 담당자의 안내를 따라요.';}}
  else g.notice='이 행동도 필요해요. 지금 먼저 할 일을 다시 찾아봐요.';
 }
 return g;
}

function dodgeFever(g){return (g.feverWaves||0)>0;}
function dodgeMoveSpeed(g){return .00065*(dodgeFever(g)?1.45:1);}
function dodgeDuration(g){const d=dodgeDifficulties[g.difficulty]||dodgeDifficulties.normal;return Math.round(Math.max(d.min,d.start-g.round*d.step)/(dodgeFever(g)?1.3:1));}
function dodgeObstacles(g,offset=0){const wave=g.round+offset;if(g.mode==='challenge'&&wave===g.barrierRound)return [{lane:1,key:'branch',wide:true}];return dodgeRounds[((wave%dodgeRounds.length)+dodgeRounds.length)%dodgeRounds.length];}
function dodgeSafeLane(g,offset=0){const hazards=dodgeObstacles(g,offset);return hazards.some(h=>h.wide)?null:[0,1,2].find(l=>!hazards.some(h=>h.lane===l));}
function dodgePickup(g,offset=0){const wave=g.round+offset,lane=dodgeSafeLane(g,offset);if(wave<0||lane===null)return null;return {lane,kind:g.mode==='challenge'&&!g.cape&&g.barrierRound===null&&wave%6===1?'cape':'star'};}
function dodgeJumpReady(g){return g.mode==='challenge'&&g.cape>0&&g.round===g.barrierRound&&g.waveMs/dodgeDuration(g)>=.7&&g.phase==='running';}
function dodgeScore(g){return Math.floor(g.elapsedMs/1000)*10+g.avoided*50+(g.collected||0)*30+(g.feverBonus||0)+Math.floor((g.feverTimeMs||0)/1000)*10;}
function dodgeTick(g,now){
 if(g.kind!=='dodge'||g.ended||!['running','hit'].includes(g.phase))return g;
 const dt=Math.max(0,now-g.lastAt),fever=dodgeFever(g);g.lastAt=now;g.x=Math.max(0,Math.min(1,(g.x??g.lane/2)+(g.direction||0)*Math.min(dt,100)*dodgeMoveSpeed(g)));g.lane=Math.round(g.x*2);
 if(g.phase==='hit'){if(now-g.hitAt>=750){if(g.hearts===0){g.phase='result';g.ended=true;g.notice='이번 도전을 마쳤어요. 기록을 확인해요.';}else{if(g.round===g.barrierRound){g.barrierRound=null;g.cape=0;}g.round++;g.waveMs=0;g.phase='running';g.notice='앞에 보이는 빈 산책길로 이동해요.';}}return g;}
 g.elapsedMs+=dt;g.waveMs+=dt;if(fever)g.feverTimeMs=(g.feverTimeMs||0)+dt;
 if(g.waveMs>=dodgeDuration(g)){
  const hazards=dodgeObstacles(g),jumping=now<g.jumpUntil,hit=hazards.find(h=>(h.wide||Math.abs(h.lane/2-g.x)<.18)&&!(jumping&&h.wide&&h.key==='branch'));
  if(hit&&!fever){g.combo=0;g.feverCharge=0;g.feverWaves=0;g.hearts--;g.phase='hit';g.hitAt=now;g.notice=hazardNames[hit.key]+'에 닿았어요. 다음에는 거리를 두고 지나가요.';}
  else{
   if(hit){g.shieldHits=(g.shieldHits||0)+1;g.shieldAt=now;g.notice='피버 무적! 방어했어요.';}
   else{g.combo=(g.combo||0)+1;g.maxCombo=Math.max(g.maxCombo||0,g.combo);g.avoided+=hazards.length;if(fever)g.feverBonus=(g.feverBonus||0)+hazards.length*50;const pickup=dodgePickup(g);if(pickup&&Math.abs(g.x-pickup.lane/2)<.18){if(pickup.kind==='cape'){g.cape=1;g.capeWorn=true;g.barrierRound=g.round+3;g.notice='망토를 입었어요! 낮은 가지가 오면 점프해요.';}else{g.collected=(g.collected||0)+1;if(fever)g.feverBonus=(g.feverBonus||0)+30;}}}
   if(fever){g.feverWaves--;if(!g.feverWaves)g.notice='피버 완료! 콤보로 다음 피버를 모아요.';}
   else if(!hit){g.feverCharge=Math.min(100,(g.feverCharge||0)+15+Math.min(g.combo,5)*3);if(g.feverCharge===100){g.feverCharge=0;g.feverWaves=5;g.feverCount=(g.feverCount||0)+1;g.notice='피버 타임! 무적 · 점수 2배!';}}
   if(g.round===g.barrierRound){g.barrierRound=null;g.cape=0;}g.round++;g.waveMs=0;
  }
 }
 g.score=dodgeScore(g);return g;
}
function dodgeAct(g,action,value){
 if(action==='mode'&&['ready','result'].includes(g.phase)&&['normal','challenge'].includes(value)){g.mode=value;return g;}
 if(action==='start'&&['ready','result'].includes(g.phase)){const {pace,mode,difficulty}=g;Object.assign(g,create('park','dodge'),{pace,mode,difficulty,phase:'running',lastAt:value,recorded:false});return g;}
 if(action==='difficulty'&&['ready','result'].includes(g.phase)&&dodgeDifficulties[value]){g.difficulty=value;return g;}
 if(action==='pause'&&['running','hit'].includes(g.phase)){g.resumePhase=g.phase;g.phase='paused';g.pausedAt=value;g.direction=0;return g;}
 if(action==='resume'&&g.phase==='paused'){const pause=value-g.pausedAt;if(g.resumePhase==='hit')g.hitAt+=pause;if(g.jumpUntil){g.jumpAt+=pause;g.jumpUntil+=pause;}g.phase=g.resumePhase;g.lastAt=value;return g;}
 if(action==='jump'&&dodgeJumpReady(g)){g.cape=0;g.jumpAt=value;g.jumpUntil=value+Math.max(700,dodgeDuration(g)*.36);g.notice='낮은 가지를 넘어요.';return g;}
 if(action==='finish'&&g.ended){g.complete=true;return g;}
 if(!['ready','running','hit'].includes(g.phase))return g;
 if(action==='left'){g.lane=Math.max(0,g.lane-1);g.x=g.lane/2;}
 if(action==='right'){g.lane=Math.min(2,g.lane+1);g.x=g.lane/2;}
 return g;
}

sequences['ride-order']={title:'놀이기구 탑승 순서를 완성해요',description:'이용 안내 확인부터 완전히 멈춘 뒤 하차까지, 먼저 할 일을 차례로 골라요.',cards:[['teacher','선생님·직원과 이용 조건 확인'],['bag','소지품을 정해진 곳에 보관'],['wait','줄에서 밀지 않고 차례 기다리기'],['sit','자리에 앉고 직원의 안전장치 확인 받기'],['wait','움직이는 동안 장치를 유지하고 앉아 있기'],['slow','완전히 멈춘 뒤 직원 안내에 따라 하차']]};
pairSets.heritage=[['sign-stop','출입 제한 표지가 있어요','stop','줄을 넘지 않고 허용된 곳에서 봐요'],['sign-slow','계단 주의 표지가 있어요','help','천천히 이동하고 필요한 도움을 요청해요'],['sign-exit','비상구 표지가 있어요','together','선생님과 출구 위치를 확인해요']];
Object.assign(gameInfo,...Object.entries({maze:['통로 미로','빈 통로를 따라 선생님이 있는 출구에 도착해요.'],whack:['위험 발견 알리기','위험한 장소 그림만 눌러 어른에게 알려요.'],signal:['안내자 걷기·멈춤','걷기 신호에 움직이고 멈춤 신호에 기다려요.'],sort:['오늘의 도구 분류','안내받고 쓸 도구와 선생님 담당 도구를 나눠요.'],compare:['다른 행동 찾기','안전하게 바뀐 관람 행동 세 곳을 비교해요.'],wash:['체험 뒤 손 씻기','물·비누·여섯 부위·헹굼·말리기를 연습해요.'],dress:['물놀이 준비','오늘 안내받은 복장과 장비를 준비해요.'],voice:['목소리 크기 연습','마이크 또는 그림으로 작은 목소리를 연습해요.']}).map(([id,[title,goal]])=>({[id]:{title,goal,icon:'play'}})));
const oldCatalog=catalog;
catalog=function(place){const extra={cinema:['maze','voice'],museum:['compare','voice'],experience:['sort','voice'],heritage:['matching','voice'],'theme-park':['ride-order'],playground:['whack'],'eco-park':['signal'],farm:['wash'],water:['dress'],library:['voice']}[place]||[];return [...extra.map(id=>({id,...(gameInfo[id]||{title:sequences[id].title,goal:sequences[id].description,icon:'select'})})),...oldCatalog(place)];};
const api={create,act,rhythmNotes,rhythmApproach,rhythmCharts,difficultyInfo,dodgeDifficulties,dodgeSafeLane,dodgePickup,dodgeJumpReady,dodgeFever,dodgeMoveSpeed,dodgeDuration,dodgeObstacles,dodgeTick,dodgeAct,dodgeScore,rhythmPattern,rhythmFever,rhythmMultiplier,rhythmAct,rhythmCue,rhythmTick,rhythmInput,rhythmDown,rhythmUp,rhythmHoldDuration,rhythmWindow,rhythmEnd,targets,scoreFinding,pathLabels:{...pathLabels,cinema:['통로에서 천천히','계단·발밑 확인','선생님과 출구 앞 도착']},catalog,gameInfo,dodgeRounds,hazardNames,sequences};root.SafetyMiniGames=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
