/* 장소별로 다른 조작과 목표를 갖는 안전 놀이. 상태에는 원본 음성을 넣지 않습니다. */
(function(root){
'use strict';
const kinds=new Set(['maze','whack','signal','sort','compare','wash','dress','voice']);
const maze=["11111111111","100010001E1","10111010101","10000010101","11101110101","10001110001","10111110111","1S000110001","11111111111"];
const mazeStars=[[3,3],[7,3],[9,5]];
const tools=[{id:'blocks',label:'나무 블록',cell:0,bin:'student',why:'오늘 안내받은 나무 블록은 선생님과 함께 사용할 수 있어요.'},{id:'goggles',label:'보호 안경',cell:1,bin:'student',why:'오늘 체험에 필요한 보호 안경을 선생님과 맞게 써요.'},{id:'glue',label:'뜨거운 글루건',cell:2,bin:'staff',why:'오늘 체험의 뜨거운 글루건은 선생님·직원이 다뤄요.'},{id:'knife',label:'커터 칼',cell:3,bin:'staff',why:'오늘 커터 칼 작업은 선생님·직원에게 부탁해요.'}];
const hazards=[
 {id:'wet',label:'물기가 고인 바닥',image:'media/game/puddle.webp',danger:true,why:'젖은 곳을 밟지 않고 선생님께 알려요.'},
 {id:'rest',label:'그늘에서 쉬기',image:'media/illustrations/aac-rest.webp',danger:false},
 {id:'grass',label:'길 밖의 풀숲',image:'media/game/grass.webp',danger:true,why:'풀숲에 들어가지 않고 정해진 길로 가요.'},
 {id:'together',label:'선생님과 함께 이동',image:'media/illustrations/aac-together.webp',danger:false},
 {id:'water',label:'가까이 가지 않을 벌',image:'media/game/bee.webp',danger:true,why:'벌을 건드리지 않고 선생님께 알리며 거리를 둬요.'},
 {id:'wet2',label:'산책로의 미끄러운 물기',image:'media/game/puddle.webp',danger:true,why:'젖은 바닥은 돌아서 가고 어른에게 알려요.'},
 {id:'grass2',label:'탐방로 밖 풀숲',image:'media/game/grass.webp',danger:true,why:'풀이 우거진 곳에 들어가지 않아요.'},
 {id:'wait',label:'안내를 기다리기',image:'media/illustrations/aac-wait.webp',danger:false},
 {id:'water2',label:'산책길 가까이에 나타난 벌',image:'media/game/bee.webp',danger:true,why:'손을 휘젓거나 잡지 않고 선생님께 알려요.'}
];
const washSteps=[['손바닥','두 손바닥을 마주 대고 문질러요.'],['손등','손바닥으로 다른 손의 손등을 문질러요.'],['손가락 사이','손깍지를 끼고 손가락 사이를 문질러요.'],['두 손 모아','손가락을 마주 잡고 문질러요.'],['엄지손가락','다른 손으로 엄지를 감싸 돌리며 닦아요.'],['손톱 밑','손끝을 다른 손바닥에 문질러요.']];
const gear=[{id:'cap',label:'수영모',cell:0,zone:'head'},{id:'vest',label:'구명조끼',cell:1,zone:'body'},{id:'suit',label:'수영복',cell:2,zone:'clothes'},{id:'scarf',label:'긴 목도리',cell:3,zone:null}];
const compareTargets=[{id:'rope',label:'관람 줄을 넘는 다리',box:[70,30,26,45],rule:'전시물 앞 관람 줄을 넘지 않아요.'},{id:'touch',label:'전시물로 뻗은 손',box:[26,35,30,22],rule:'만져도 된다는 안내가 없으면 전시물을 만지지 않아요.'},{id:'spill',label:'바닥에 쏟은 음료',box:[46,83,30,15],rule:'전시실에서 음식을 먹지 않고 물기를 보면 알려요.'}];
function shuffled(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function create(place,kind){const g={kind,place,phase:'ready',complete:false,assisted:false,notice:'그림과 안내를 확인하고 시작해요.'};
 if(kind==='maze')return {...g,phase:'play',x:1,y:7,prevX:1,prevY:7,steps:0,stars:[],visited:['1,7'],bump:false,hint:false,notice:'상영이 끝났어요. 의자 사이 통로를 따라 선생님이 있는 출구로 가요.'};
 if(kind==='whack')return {...g,index:0,elapsed:0,found:[],hole:4,waitMode:false,notice:'튀어나오는 그림에서 위험한 곳만 눌러 선생님께 알려요.'};
 if(kind==='signal')return {...g,round:0,segmentMs:0,heldMs:0,stillMs:0,pressed:false,walked:0,tapMode:false,notice:'안내자의 걷기 신호에만 움직이고, 멈춤 신호에는 손을 떼요.'};
 if(kind==='sort')return {...g,phase:'play',order:shuffled(tools.map(t=>t.id)),index:0,selected:null,sorted:[],notice:'오늘은 나무 블록·보호 안경을 사용해요. 글루건·커터 칼 작업은 선생님 담당이에요.'};
 if(kind==='compare')return {...g,phase:'play',found:[],notice:'관람 줄을 넘는 다리, 전시물로 뻗은 손, 바닥의 음료 — 세 곳의 차이를 찾아요.'};
 if(kind==='wash')return {...g,phase:'wet',step:0,rubMs:0,totalRubMs:0,pressed:false,notice:'동물 체험 뒤에는 흐르는 물과 비누로 손을 씻어요. 먼저 물로 적셔요.'};
 if(kind==='dress')return {...g,phase:'play',selected:null,worn:[],notice:'오늘 안내는 수영모·수영복·구명조끼예요. 그림을 골라 맞는 준비 칸에 놓아요.'};
 if(kind==='voice')return {...g,mode:null,level:0,smoothed:0,calibrationMs:0,baseline:0,baselineSum:0,sensitivity:1,holdMs:0,loudMs:0,notice:'관람하는 시간에 맞는 작은 목소리를 연습해요. 그림 버튼으로도 할 수 있어요.'};
 return null;
}
function currentHazard(g){return hazards[g.index%hazards.length];}
function nextHazard(g){g.index++;g.elapsed=0;g.hole=(g.index*5+4)%9;for(let i=0;i<hazards.length&&g.found.includes(currentHazard(g).id);i++)g.index++;}
function finish(g,message){g.complete=true;g.phase='done';g.pressed=false;g.notice=message;return g;}
function act(g,action,value){if(!g||g.complete)return g;
 if(g.kind==='maze'&&action==='move'){const [dx,dy]=({left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]})[value]||[0,0];const x=g.x+dx,y=g.y+dy;if(!maze[y]||!maze[y][x]||maze[y][x]==='1'){g.bump=true;g.notice='의자와 벽은 지나가지 않아요. 빈 통로를 골라요.';return g;}g.prevX=g.x;g.prevY=g.y;g.x=x;g.y=y;g.steps++;g.bump=false;if(!g.visited.includes(x+','+y))g.visited.push(x+','+y);const star=mazeStars.findIndex(p=>p[0]===x&&p[1]===y);if(star>=0&&!g.stars.includes(star)){g.stars.push(star);g.notice='길별 '+g.stars.length+'개! 다음 통로를 살펴봐요.';}else g.notice='통로를 따라 천천히 이동해요.';if(maze[y][x]==='E')finish(g,'선생님과 출구에 도착했어요. 실제 비상 상황에서는 직원의 안내를 따라요.');}
 if(g.kind==='maze'&&action==='hint'){g.hint=true;g.assisted=true;g.notice='한 칸씩 이어지는 빈 통로를 살펴봐요.';}
 if(g.kind==='whack'){
  if(action==='wait-mode'){g.waitMode=!g.waitMode;g.assisted=true;g.notice=g.waitMode?'그림이 사라지지 않아요. 충분히 본 뒤 골라요.':'그림이 차례로 나타나요.';}
  if(action==='next'&&g.waitMode&&g.phase==='play')nextHazard(g);
  if(action==='start'){g.phase='play';g.elapsed=0;g.lastAt=value;g.notice='위험한 곳은 눌러 알리고, 안전한 행동은 그대로 두어요.';}
  if(action==='tap'&&g.phase==='play'&&Number(value)===g.hole){const h=currentHazard(g);if(h.danger){if(!g.found.includes(h.id))g.found.push(h.id);g.notice='위험 발견! '+h.why;if(g.found.length===6)finish(g,'위험한 곳 여섯 번을 발견해 선생님께 알렸어요. 직접 만지거나 치우지 않아요.');else nextHazard(g);}else g.notice='이 그림은 안전한 행동이에요. 다음 위험 그림을 찾아요.';}
 }
 if(g.kind==='signal'){
  if(action==='start'){Object.assign(g,{phase:'green',round:0,segmentMs:0,heldMs:0,stillMs:0,pressed:false,lastAt:value});}
  if(action==='hold')g.pressed=!!value;
  if(action==='tap-mode'){g.tapMode=!g.tapMode;g.pressed=false;g.assisted=true;}
 }
 if(g.kind==='sort'){
  if(action==='select'&&value===g.order[g.index])g.selected=value;
  if(action==='drop'&&g.selected){const t=tools.find(t=>t.id===g.selected);if(t.bin===value){g.sorted.push(t.id);g.index++;g.selected=null;g.notice=t.why;if(g.index===tools.length)finish(g,'오늘 사용할 도구와 선생님 담당 도구를 나눴어요. 실제 체험은 안내받고 시작해요.');}else{g.assisted=true;g.notice=t.why+' 알맞은 바구니에 다시 놓아요.';}}
 }
 if(g.kind==='compare'&&action==='find'){const t=compareTargets.find(t=>t.id===value);if(t&&!g.found.includes(t.id)){g.found.push(t.id);g.notice=t.rule;if(g.found.length===compareTargets.length)finish(g,'세 가지 차이를 찾았어요. 관람 줄 밖에서 보고, 전시물과 바닥을 안전하게 지켜요.');}}
 if(g.kind==='wash'){
  if(action==='water'&&g.phase==='wet'){g.phase='soap';g.notice='손을 적셨어요. 비누를 사용해요.';}
  if(action==='soap'&&g.phase==='soap'){g.phase='rub';g.notice=washSteps[g.step][1];}
  if(action==='hold'&&g.phase==='rub')g.pressed=!!value;
  if(action==='next'&&g.phase==='step-done'){g.step++;g.rubMs=0;g.pressed=false;g.phase=g.step===6?'rinse':'rub';g.notice=g.step===6?'비누 거품을 흐르는 물로 헹궈요.':washSteps[g.step][1];}
  if(action==='water'&&g.phase==='rinse'){g.phase='dry';g.notice='깨끗한 수건이나 종이타월로 물기를 닦아요.';}
  if(action==='dry'&&g.phase==='dry')finish(g,'비누로 여섯 부위를 30초 이상 문지르고 헹군 뒤 말리는 순서를 연습했어요. 실제 손으로도 함께 해봐요.');
 }
 if(g.kind==='dress'){
  if(action==='select'&&gear.some(t=>t.id===value)&&!g.worn.includes(value)){g.selected=value;g.notice=value==='scarf'?'긴 목도리는 오늘 물놀이 준비물이 아니에요. 안내판을 다시 봐요.':'알맞은 준비 칸에 놓아요.';}
  if(action==='drop'&&g.selected){const item=gear.find(t=>t.id===g.selected);if(item.zone===value){g.worn.push(item.id);g.selected=null;g.notice=item.label+'를 준비했어요.';if(g.worn.length===3)finish(g,'오늘 안내받은 복장·장비를 준비했어요. 선생님이 착용 상태를 확인한 뒤 안내에 따라 이동해요.');}else{g.assisted=true;g.notice='머리·몸·복장 중 알맞은 칸을 확인해요. 긴 목도리는 사용하지 않아요.';}}
 }
 if(g.kind==='voice'){
  if(action==='picture'){Object.assign(g,{mode:'picture',phase:'practice',level:.5,smoothed:.5,holdMs:0,loudMs:0});g.notice='작은 목소리 그림을 골라 관람객의 반응을 확인해요.';}
  if(action==='level'&&g.mode==='picture')g.level=Math.max(0,Math.min(1,Number(value)));
  if(action==='sensitivity')g.sensitivity=Math.max(.5,Math.min(2,Number(value)));
 }
 return g;
}
function tick(g,now,inputRms=0){if(!g||g.complete)return g;const dt=Math.max(0,Math.min(1000,now-(g.lastAt??now)));g.lastAt=now;
 if(g.kind==='whack'&&g.phase==='play'){g.elapsed+=dt;if(!g.waitMode&&g.elapsed>=3200)nextHazard(g);}
 if(g.kind==='signal'&&['green','red'].includes(g.phase)){
  g.segmentMs+=dt;if(g.phase==='green'&&g.pressed){g.heldMs+=dt;g.walked+=dt;}if(g.phase==='red'&&!g.pressed)g.stillMs+=dt;
  if(g.phase==='red'&&g.pressed){g.assisted=true;g.notice='멈춤 신호예요. 손을 떼고 기다려요.';}
  if(g.phase==='green'&&g.segmentMs>=3000){g.greenPassed=g.heldMs>=1800;g.phase='red';g.segmentMs=0;g.stillMs=0;g.notice='멈춰요. 걷기 버튼에서 손을 떼어요.';}
  else if(g.phase==='red'&&g.segmentMs>=2000){if(g.greenPassed&&g.stillMs>=1400)g.round++;if(g.round===3)finish(g,'걷기와 멈춤 안내를 세 번 지켰어요. 실제 탐방도 안내자와 함께해요.');else{g.phase='green';g.segmentMs=0;g.heldMs=0;g.stillMs=0;g.notice='걸어요. 안내 신호가 바뀌면 멈춰요.';}}
 }
 if(g.kind==='wash'&&g.phase==='rub'&&g.pressed){const add=Math.min(dt,5000-g.rubMs);g.rubMs+=add;g.totalRubMs+=add;if(g.rubMs>=5000){g.phase='step-done';g.pressed=false;g.notice=washSteps[g.step][0]+'을 연습했어요. 다음 부위로 가요.';}}
 if(g.kind==='voice'){
  if(g.phase==='calibrate'){g.calibrationMs+=dt;g.baselineSum+=Math.max(0,inputRms)*dt;if(g.calibrationMs>=2000){g.baseline=g.baselineSum/g.calibrationMs;g.phase='practice';g.notice='주변 소리 기준을 확인했어요. 작은 목소리를 연습해요.';}}
  else if(g.phase==='practice'){const level=g.mode==='mic'?Math.max(0,Math.min(1,(inputRms-g.baseline)*g.sensitivity/0.08)):g.level;g.smoothed=.8*g.smoothed+.2*level;if(g.smoothed>.35)g.loudMs+=dt;else g.loudMs=Math.max(0,g.loudMs-dt*2);if(g.smoothed<=.35){g.holdMs+=dt;g.notice='이 장면에 맞는 작은 목소리예요.';}else if(g.loudMs>600)g.notice='소리가 커졌어요. 작은 목소리로 다시 해봐요.';if(g.holdMs>=6000)finish(g,'관람하는 시간에 맞는 목소리 크기를 연습했어요. 도움이 필요할 때는 말·AAC·손짓으로 바로 알려요.');}
 }
 return g;
}
function mazeRoute(g){const queue=[[g.x,g.y,[]]],seen=new Set([g.x+','+g.y]);while(queue.length){const[x,y,route]=queue.shift();if(maze[y][x]==='E')return route;for(const[dir,dx,dy]of [['left',-1,0],['right',1,0],['up',0,-1],['down',0,1]]){const a=x+dx,b=y+dy,k=a+','+b;if(maze[b]?.[a]&&maze[b][a]!=='1'&&!seen.has(k)){seen.add(k);queue.push([a,b,[...route,dir]]);}}}return [];}
const api={has:k=>kinds.has(k),kinds:[...kinds],create,act,tick,maze,mazeStars,mazeRoute,tools,hazards,currentHazard,washSteps,gear,compareTargets};root.SafetyPlaceGames=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
