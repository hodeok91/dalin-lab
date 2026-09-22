/* Follow-up 2: presentation, learning support and explicit question contracts.
 * The original game engine, sounds, scoring and route objects remain in index.html.
 */
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plainText = html => { const d=document.createElement('div'); d.innerHTML=html||''; return d.textContent.replace(/\s+/g,' ').trim(); };
S.support = loadJSON('tripEscapeSupport','none');
if (!['basic','extended','none'].includes(S.support)) S.support='none';
let speechToken=0, speechVolume=null, speechWatch=null;
function restoreSpeechVolume(){ if(BGM.el && speechVolume!==null) BGM.el.volume=speechVolume; speechVolume=null; clearTimeout(speechWatch); }
function stopSpeech(){ speechToken++; window.speechSynthesis?.cancel(); restoreSpeechVolume(); }
speakKo = function(text){
  if(S.muted){toast('소리가 꺼져 있어요. 상단 소리 버튼으로 켤 수 있어요.');return;}
  if(!window.speechSynthesis){toast('이 브라우저는 음성 읽기를 지원하지 않아요. 화면의 글을 함께 확인해 주세요.');return;}
  const clean=plainText(text); if(!clean) return;
  stopSpeech(); const token=++speechToken;
  const el=BGM.ensure(); speechVolume=el.volume; el.volume=speechVolume*.3;
  const u=new SpeechSynthesisUtterance(clean); u.lang='ko-KR'; u.rate=.88;
  const finish=()=>{if(token===speechToken) restoreSpeechVolume();};
  u.onend=finish; u.onerror=finish;
  window.speechSynthesis.speak(u);
  speechWatch=setTimeout(finish,Math.max(15000,clean.length*600));
};
$('#snd').addEventListener('click',()=>{ if(S.muted) stopSpeech(); });
const visible = el => !!el && !el.closest('[hidden]') && getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility!=='hidden' && el.getClientRects().length>0;
function topSurface(){
  return ['#aac-veil.on','#veil.on','#eventcard.on','#start-veil.on','#gameover.on','#stagecard.on','.screen.on'].map(x=>$(x)).find(Boolean);
}
currentScreenText = function(){
  const root=topSurface(); if(!root) return '시작하기를 눌러 안전 여행을 시작해요.';
  const copy=root.cloneNode(true);
  // Remove hidden descendants before collecting text, including hidden START step.
  const original=[root,...root.querySelectorAll('*')], cloned=[copy,...copy.querySelectorAll('*')];
  original.forEach((el,i)=>{if(!visible(el)) cloned[i]?.remove();});
  copy.querySelectorAll('script,style,.hot,.mark,.missx,canvas,.aac-tabs,[aria-hidden="true"]').forEach(e=>e.remove());
  const text=copy.textContent.replace(/\s+/g,' ').trim();
  const controls=[...root.querySelectorAll('button,select')].filter(visible).filter(e=>!e.disabled).map(e=>e.tagName==='SELECT' ? `${e.getAttribute('aria-label')||'설정'}: ${e.selectedOptions[0]?.textContent}` : `${e.textContent.trim()}${e.getAttribute('aria-pressed')==='true'||e.getAttribute('aria-checked')==='true'?' 선택됨':''}`).filter(Boolean);
  const state=root.classList.contains('screen')&&S.playing?`현재 점수 ${S.score}점, 하트 ${S.lives}개, 배지 ${S.badges}개. `:'';
  const hero=root.querySelector('.hero img');
  return `${hero?.alt||''} ${state}${text}. 사용할 수 있는 버튼: ${controls.join(', ')}.`;
};

// No keyword shortening: an O/X statement must retain its original truth value.
aacShort = text => String(text||'');
function renderAacQuestion(q){
  return `<div class="aac-question"><span class="aac-visual"><img src="${escapeHTML(q.image)}" alt="${escapeHTML(q.imageAlt||'안전 상황 그림')}"></span><b>${escapeHTML(q.textOn)}</b><button class="aac-speak" data-say="${escapeHTML(q.textOn)}">설명 듣기</button></div>`;
}
renderQuestion=function(textId,picId,q){
  if(!q) return; $(picId).textContent='';
  $(textId).innerHTML=S.access?renderAacQuestion(q):escapeHTML(q.textOff);
};
let activeModal=null,activeEvent=null,eventNext=null,eventOrder=null;
modal=function(options){
  activeModal=options; modalReturnFocus=document.activeElement; modalCb=options.cb||null;
  modalSpeakText=`${options.title}. ${plainText(options.body)}`;
  renderInfoModal(); $('#veil').classList.add('on'); $('#m-ok').focus();
};
function renderInfoModal(){
  if(!activeModal)return; const o=activeModal;
  $('#m-tag').textContent=o.tag||''; $('#m-tag').className='tag '+(o.tagCls||'danger'); $('#m-title').textContent=o.title;
  const visual=o.image?{image:o.image,label:o.imageAlt||'안전 상황'}:AAC_CONFIG[o.aacKey];
  // Generic feedback/badge dialogs do not invent an unrelated picture.
  $('#m-body').innerHTML=S.access&&visual?`<div class="aac-message"><span class="aac-pic"><img src="${escapeHTML(visual.image)}" alt="${escapeHTML(visual.label)}"></span><small>${escapeHTML(plainText(o.body))}</small></div>`:(o.body||'');
  $('#m-ok').textContent=o.btn||'확인';
  const select=$('#support-live');if(select){select.value=S.support;select.onchange=()=>{S.support=select.value;saveJSON('tripEscapeSupport',S.support);$('#learning-support').value=S.support;};}
}
$('#m-ok').addEventListener('click',()=>{if(!$('#veil').classList.contains('on')) activeModal=null;});
$('#m-ok').addEventListener('click',stopSpeech);
eventCard=function(ev,next){
  if(!ev.image && STAGE_CONFIG[ev.cat]) ev={...ev,image:STAGE_CONFIG[ev.cat].image,imageAlt:STAGE_CONFIG[ev.cat].title+' 안전 상황'};
  activeEvent=ev;eventNext=next;eventOrder=ev.shuffle===false?[...ev.choices]:[...ev.choices].sort(()=>Math.random()-.5);
  renderEvent();$('#eventcard').classList.add('on');$('#ev-choices button')?.focus();
};
function renderEvent(){
  const ev=activeEvent;if(!ev)return;
  $('#ev-tag').textContent=ev.tag||'돌발 상황';
  $('#ev-pic').innerHTML=ev.image?`<img src="${escapeHTML(ev.image)}" alt="${escapeHTML(ev.imageAlt||'돌발 상황')}">`:'';
  $('#ev-story').textContent=ev.story;
  let listen=$('#event-listen');if(!listen){listen=document.createElement('button');listen.id='event-listen';listen.className='event-listen';$('#ev-story').after(listen);}
  listen.textContent='상황 듣기';listen.onclick=()=>speakKo(ev.story);
  $('#ev-choices').replaceChildren();
  eventOrder.forEach(c=>{
    const box=document.createElement('div'),b=document.createElement('button');b.className='evbtn';
    const visual=c.image?{image:c.image,label:c.t}:AAC_CONFIG[c.visual];
    b.innerHTML=(S.access&&visual?`<img class="ev-choice-img" src="${escapeHTML(visual.image)}" alt="">`:'')+`<span>${escapeHTML(c.t)}</span>`;
    b.onclick=()=>{
      $('#eventcard').classList.remove('on');activeEvent=null;
      if(c.ok){sfx.ok();addScore(150);if(ev.rule)addRule(ev.rule,ev.cat);}
      else{sfx.bad();comboBreak();addScore(-50);addWeak(ev.cat);}
      modal({tag:c.ok?'잘했어요':'다시 확인해요',tagCls:c.ok?'safe':'danger',title:c.ok?'올바른 선택이에요':'안전한 행동을 확인해요',body:ruleCard(ev.rule||ev.why),image:ev.image,imageAlt:ev.imageAlt,btn:c.ok?'계속':'다시 선택',cb:c.ok?eventNext:()=>eventCard(ev,eventNext)});
    };
    box.appendChild(b);
    if(S.access){const t=document.createElement('button');t.className='aac-speak';t.textContent='선택지 듣기';t.onclick=()=>speakKo(c.t);box.appendChild(t);}
    $('#ev-choices').appendChild(box);
  });
}
const originalRenderAAC=renderAACCurrent;
renderAACCurrent=function(){originalRenderAAC();if($('#veil').classList.contains('on'))renderInfoModal();if($('#eventcard').classList.contains('on'))renderEvent();};

// A small drawer: at most two rows, with tabs and paging when required.
const DRAWER_GROUPS=[
  {title:'기본',tone:'core',keys:['yes','no','again','unknown','okay']},
  {title:'도움/상태',tone:'need',keys:['help','hurt','scared','rest','wait']},
  {title:'사람/이동',tone:'move',keys:['teacher','friend','together','slow','here','lost']},
  {title:'필요한 것',tone:'need',keys:['toilet','water','wash','bag']},
  {title:'안전',tone:'safety',keys:['stop','exit','fire','seatbelt','sit']}
];
let drawerTab=0,drawerPage=0;
renderAacBoard=function(){
  const group=DRAWER_GROUPS[drawerTab],limit=innerWidth>=900?12:6;
  const tabs=DRAWER_GROUPS.map((g,i)=>`<button role="tab" aria-selected="${i===drawerTab}" data-tab="${i}">${g.title}</button>`).join('');
  $('#aac-board').innerHTML=`<div class="aac-tabs" role="tablist" aria-label="말하기 종류">${tabs}</div><div class="aac-grid">${group.keys.slice(drawerPage*limit,(drawerPage+1)*limit).map(key=>{const c=AAC_CONFIG[key];return `<button class="aac-card ${group.tone}" data-say="${escapeHTML(c.speech)}"><img src="${escapeHTML(c.image)}" alt=""><b>${escapeHTML(c.label)}</b></button>`;}).join('')}</div>`;
  $('#aac-board').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{drawerTab=+b.dataset.tab;drawerPage=0;renderAacBoard();$(`#aac-board [data-tab="${drawerTab}"]`).focus();});
};
const expand=document.createElement('button');expand.className='drawer-expand';expand.textContent='접기';
expand.onclick=()=>{const collapsed=$('.aac-sheet').classList.toggle('collapsed');expand.textContent=collapsed?'펼치기':'접기';expand.setAttribute('aria-expanded',String(!collapsed));};
$('#aac-close').before(expand);$('.aac-sheet').setAttribute('role','dialog');$('.aac-sheet').setAttribute('aria-label','AAC 말하기판');
$('#aac-fab').addEventListener('click',()=>{$('.aac-sheet').classList.remove('collapsed');expand.textContent='접기';renderAacBoard();$('#aac-board button')?.focus();});
$('#aac-close').addEventListener('click',()=>$('#aac-fab').focus());
window.addEventListener('resize',()=>{if($('#aac-veil').classList.contains('on'))renderAacBoard();});

// Two-step START flow. New controls deliberately replace the old single-step handlers.
let startStep=1;
const nextButton=document.createElement('button');nextButton.className='btn';nextButton.id='start-next';nextButton.textContent='다음';
$('#start-confirm').before(nextButton);
const backButton=document.createElement('button');backButton.className='btn sub';backButton.id='start-back';backButton.textContent='이전';$('#start-cancel').after(backButton);
const support=document.createElement('label');support.className='support-setting';support.innerHTML='학습지원 <select id="learning-support" aria-label="학습지원"><option value="basic">기본</option><option value="extended">시간 넉넉히 (3배)</option><option value="none">시간제한 없음</option></select>';
$('.start-actions').before(support);$('#learning-support').value=S.support;
$('#learning-support').onchange=e=>{S.support=e.target.value;saveJSON('tripEscapeSupport',S.support);};
const accessStart=document.createElement('button');accessStart.className='aac-global';accessStart.textContent='AAC 표현 바꾸기';accessStart.onclick=()=>$('#aac-toggle').click();support.before(accessStart);
function renderStartStep(){
  $('#start-title').textContent=startStep===1?'오늘의 현장학습 유형을 고르세요':'현장체험학습 준비를 확인해요';
  $('.start-sheet .sub').textContent=startStep===1?'1 / 2 · 유형을 선택하고 다음을 눌러요.':'2 / 2 · 준비 카드 3개를 눌러 확인해요.';
  $('.start-checks').hidden=startStep!==2;$('.trip-choices').hidden=startStep!==1;$('.start-sheet .aac-group-title').hidden=true;
  $('#start-next').hidden=startStep!==1;$('#start-next').disabled=!S.tripType;$('#start-confirm').hidden=startStep!==2;$('#start-back').hidden=startStep!==2;support.hidden=startStep!==2;
  $('#start-confirm').disabled=START_SEEN.size!==3||!S.tripType;
}
const originalShowStart=showStartCheck;
showStartCheck=function(){originalShowStart();startStep=1;renderStartStep();$('.trip-choice').focus();};
// The existing event listener holds the original function reference.
$('#start-btn').addEventListener('click',()=>{startStep=1;renderStartStep();$('.trip-choice').focus();});
nextButton.onclick=()=>{if(!S.tripType)return;startStep=2;renderStartStep();$('.start-card').focus();};
backButton.onclick=()=>{startStep=1;renderStartStep();$('.trip-choice.on')?.focus();};
const originalSyncStart=syncStartReady;
syncStartReady=function(){originalSyncStart();renderStartStep();};
$$('.start-card').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed','true')));

// Capture keyboard handling prevents Escape from closing two stacked surfaces.
document.addEventListener('keydown',e=>{
  const root=topSurface();if(!root || root.classList.contains('screen'))return;
  if(e.key==='Tab'){
    const fs=[...root.querySelectorAll('button:not(:disabled),a[href],select')].filter(visible);if(!fs.length)return;
    const index=fs.indexOf(document.activeElement);
    if(e.shiftKey&&(index<=0)){e.preventDefault();fs.at(-1).focus();}else if(!e.shiftKey&&(index<0||index===fs.length-1)){e.preventDefault();fs[0].focus();}
  }
  if(e.key==='Escape'){
    e.preventDefault();e.stopImmediatePropagation();
    if(root.id==='aac-veil')$('#aac-close').click();
    else if(root.id==='start-veil')closeStartCheck();
    else if(root.id==='veil')$('#m-ok').click();
    // A decision event requires an actual choice.
  }
  if(e.key==='Enter' && root.id==='start-veil'){
    if(document.activeElement?.matches('.trip-choice,.start-card,select,#start-back,#start-cancel,.aac-global')){e.stopImmediatePropagation();return;}
    e.preventDefault();e.stopImmediatePropagation();const b=startStep===1?nextButton:$('#start-confirm');if(!b.disabled)b.click();
  }
  if(e.key==='Enter' && root.id==='veil' && document.activeElement?.id==='m-speak'){e.stopImmediatePropagation();}
},true);
$('#eventcard .ev-panel').setAttribute('role','dialog');$('#eventcard .ev-panel').setAttribute('aria-modal','true');$('#eventcard .ev-panel').setAttribute('aria-label','돌발 상황');

// Stable source-pixel crop metadata and hitboxes are loaded from an authored manifest.
function applySourceTargets(manifest){
  for(const target of manifest){
    const hot=document.querySelector(`${target.scene} .hot[data-k="${target.key}"]`);if(!hot)continue;
    const [x,y,w,h]=target.bounds;Object.assign(hot.dataset,{sourceX:x,sourceY:y,sourceW:w,sourceH:h,rect:[x/1536*100,y/1024*100,w/1536*100,h/1024*100].join(',')});
    hot.dataset.sourceRect=[x,y,w,h].join(',')+' px';
    hot.style.left=`${x/1536*100}%`;hot.style.top=`${y/1024*100}%`;hot.style.width=`${w/1536*100}%`;hot.style.height=`${h/1024*100}%`;
    hot.dataset.origLeft=hot.style.left;hot.dataset.origTop=hot.style.top;
  }
}

// Every question owns wording, image, answer and both feedback messages.
function question(id,stage,textOff,textOn,image,correctAnswer,explanation){
  const tripTypes=stage==='precheck'||stage==='bus'||stage==='rest'?['day','schoolTrip','retreat']:stage==='room'||stage==='escape'?['schoolTrip','retreat']:['day'];
  const q={id,tripTypes,stage,textOff,textOn,image,correctAnswer,explanationCorrect:explanation,explanationWrong:explanation};
  // Read-only legacy aliases keep the original museum scoring engine intact.
  Object.defineProperties(q,{q:{get:()=>q.textOff},a:{get:()=>q.correctAnswer},why:{get:()=>q.explanationCorrect},cat:{get:()=>q.stage}});return q;
}
const sceneImage=stage=>STAGE_CONFIG[stage]?.image||AAC_CONFIG.prePack.image;
S4.pool=S4.pool.map((q,i)=>question(`museum-${i+1}`,'museum',q.q,q.q,sceneImage('museum'),q.a,q.why));
const FINAL_QUESTIONS=[
  question('prepare-tell','precheck','몸이 아프면 무리하지 않고 선생님께 말해요.','아프면 선생님께 말해요.',AAC_CONFIG.preHurt.image,true,'아프면 멈추고 선생님께 도움을 요청해요.'),
  question('prepare-water','precheck','더운 날에도 물을 마시지 않고 참아요.','목이 말라도 물을 안 마셔요.',AAC_CONFIG.water.image,false,'물을 자주 마시고 쉬어요.'),
  question('bus-belt','bus','버스에서는 안전벨트를 매고 자리에 앉아요.','안전벨트를 매고 앉아요.',sceneImage('bus'),true,'차 안에서는 안전벨트를 매고 자리에 앉아요.'),
  question('bus-move','bus','달리는 버스 안에서 일어나 장난쳐요.','달리는 버스에서 일어나요.',sceneImage('bus'),false,'버스가 완전히 멈출 때까지 앉아 있어요.'),
  question('rest-food','rest','뜨거운 음식을 들고 뛰어도 괜찮아요.','뜨거운 음식을 들고 뛰어요.',sceneImage('rest'),false,'뜨거운 음식은 정해진 자리에서 앉아서 먹어요.'),
  question('rest-help','rest','길을 잃으면 멈추고 선생님이나 직원에게 도움을 요청해요.','길을 잃으면 멈추고 도움을 요청해요.',sceneImage('rest'),true,'혼자 돌아다니지 말고 안전한 곳에서 도움을 요청해요.'),
  question('park-bar','park','놀이기구에서는 안전바를 잡고 끝까지 앉아 있어요.','안전바를 잡고 앉아요.',sceneImage('park'),true,'안전바를 잡고 놀이기구가 멈출 때까지 앉아요.'),
  question('park-fence','park','떨어진 물건을 주우려고 울타리를 넘어가요.','물건을 주우러 울타리를 넘어요.',sceneImage('park'),false,'울타리를 넘지 않고 직원에게 도움을 요청해요.'),
  question('museum-touch','museum','전시물을 손으로 만져도 괜찮아요.','전시물을 손으로 만져요.',sceneImage('museum'),false,'전시물은 손으로 만지지 않고 눈으로 봐요.'),
  question('museum-guide','museum','선생님의 말·그림·손짓·신호를 확인해요.','선생님의 안내를 확인해요.',sceneImage('museum'),true,'정해진 시간과 장소를 지키고 선생님의 안내를 확인해요.'),
  question('trampoline-one','indoorPlayground','트램펄린 한 칸에는 한 명씩 이용해요.','한 칸에 한 명씩 놀아요.',sceneImage('indoorPlayground'),true,'친구와 부딪히지 않도록 한 칸에 한 명씩 이용해요.'),
  question('trampoline-flip','indoorPlayground','트램펄린에서 위험한 공중제비를 해도 괜찮아요.','트램펄린에서 공중제비를 해요.',sceneImage('indoorPlayground'),false,'위험한 묘기와 과한 점프는 하지 않아요.'),
  question('trampoline-clothes','indoorPlayground','긴 끈을 늘어뜨리고 가방을 멘 채 트램펄린을 타요.','긴 끈과 가방을 그대로 두고 뛰어요.',sceneImage('indoorPlayground'),false,'긴 끈과 헐렁한 옷을 정리하고 소지품은 보관해요.'),
  question('trampoline-injury','indoorPlayground','친구가 넘어져 아프면 움직이게 하지 않고 선생님께 알려요.','다친 친구를 움직이지 않게 하고 선생님께 알려요.','img/events/trampoline-injury.png',true,'놀이를 멈추고 선생님이나 직원에게 바로 알려요. 다른 친구들이 부딪히지 않게 거리를 둬요.'),
  question('room-outlet','room','콘센트 한 곳에 플러그를 많이 꽂아도 괜찮아요.','콘센트에 플러그를 잔뜩 꽂아요.',sceneImage('room'),false,'콘센트에 플러그를 너무 많이 꽂지 않아요.'),
  question('room-jump','room','침대 위에서는 뛰거나 장난치지 않아요.','침대에서 뛰지 않아요.',sceneImage('room'),true,'침대는 쉬는 곳이에요. 뛰면 떨어져 다칠 수 있어요.'),
  question('escape-lift','escape','불이 나면 엘리베이터를 타고 내려가요.','불이 나면 엘리베이터를 타요.',sceneImage('escape'),false,'불이 나면 엘리베이터를 이용하지 않고 안내에 따라 계단으로 대피해요.'),
  question('escape-low','escape','연기가 있으면 몸을 낮추고 안내에 따라 대피해요.','몸을 낮추고 대피해요.',sceneImage('escape'),true,'연기를 피해서 몸을 낮추고 안전한 곳으로 대피해요.')
];
FINAL.pool=FINAL_QUESTIONS;
FINAL.start=function(){
  const available=this.pool.filter(q=>q.tripTypes.includes(S.tripType)&&(q.stage==='precheck'||S.route.includes(q.stage)));
  const categories=['precheck',...S.route];this.qs=[];
  for(const category of categories){const qs=available.filter(q=>q.stage===category);if(qs.length)this.qs.push(qs[Math.floor(Math.random()*qs.length)]);}
  while(this.qs.length<6){const rest=available.filter(q=>!this.qs.includes(q));this.qs.push(rest[Math.floor(Math.random()*rest.length)]);}
  this.qs=this.qs.slice(0,6);this.queue=this.qs.map((_,i)=>i);this.show();
};
const locks=document.createElement('div');locks.id='final-locks';locks.className='door-progress';locks.setAttribute('aria-live','polite');$('#scr-final .doorline').after(locks);
$('#scr-final .stage-desc').textContent='배운 안전 약속을 떠올려 여섯 자물쇠를 풀고 마지막 문을 열어요.';
FINAL.show=function(){
  this.answered=false;this.idx=this.queue[0];const done=this.qs.length-this.queue.length;
  $('#f-qnum').textContent=`안전 약속 ${done+1} / ${this.qs.length}`;$('#f-left').textContent=`남은 자물쇠 ${this.queue.length}`;
  locks.innerHTML=this.qs.map((_,i)=>`<span class="lock ${i<done?'open':''}" aria-label="${i+1}번 ${i<done?'열림':'잠김'}">${i+1}</span>`).join('');
  renderQuestion('#f-qtext','#f-qpic',this.qs[this.idx]);
};
FINAL.answer=function(value){
  if(this.answered)return;this.answered=true;
  const q=this.qs[this.idx],right=value===q.correctAnswer,symbol=q.correctAnswer?'O':'X';
  if(right){sfx.ok();addScore(100);this.queue.shift();}else{sfx.bad();S.finalPerfect=false;addWeak(q.stage);this.queue.push(this.queue.shift());}
  const finished=this.queue.length===0;
  if(finished){locks.querySelectorAll('.lock').forEach(e=>e.classList.add('open'));sfx.clear();confetti();}
  modal({tag:right?'정답':'다시 확인',tagCls:right?'safe':'danger',title:finished?'철컥! 마지막 문이 열렸어요':right?'자물쇠가 하나 풀렸어요':'안전 약속을 다시 떠올려요',
    body:`<p>${escapeHTML(q.textOff)}</p><div class="ansbadge ${right?'ao':'ax'}">정답은 ${symbol}예요.</div>${ruleCard(right?q.explanationCorrect:q.explanationWrong)}`,
    image:q.image,btn:finished?'결과 보기':right?'다음 자물쇠':'다시 도전',cb:finished?()=>{BGM.stop();finishGame();}:()=>this.show()});
};
renderAacBoard();renderStartStep();

// Trampoline stage reuses the existing scene-finding engine and its scoring.
const trampolineRules={
  together:{title:'한 칸에 한 명씩 이용해요',rule:'같은 칸에서 함께 뛰면 서로 부딪힐 수 있어요. 한 칸에 한 명씩 이용해요.',hint:'같은 검은 칸에서 뛰는 친구들의 수를 살펴봐요.',aacKey:'trampolineOne'},
  flip:{title:'위험한 묘기를 하지 않아요',rule:'공중제비나 과한 점프를 하지 않아요.',hint:'머리가 아래로 향한 친구가 있어요.',aacKey:'trampolineFlip'},
  clothes:{title:'긴 끈과 소지품을 정리해요',rule:'긴 끈과 헐렁한 옷을 정리하고 가방 등 소지품을 보관해요.',hint:'입구에서 긴 끈과 가방을 그대로 둔 친구를 찾아요.',aacKey:'trampolineClothes'},
  queue:{title:'차례를 기다려요',rule:'친구를 밀거나 앞질러 가지 않고 차례를 기다려요.',hint:'줄 앞에서 친구를 밀고 지나가는 모습을 찾아요.',aacKey:'trampolineQueue'}
};
for(const t of SOURCE_TARGETS){
  const prior=AAC_CONFIG[t.aacKey]||{};
  AAC_CONFIG[t.aacKey]={...prior,image:`img/aac/scenes/${t.crop}`,label:prior.label||trampolineRules[t.key]?.title||'안전 상황',speech:prior.speech||trampolineRules[t.key]?.rule||'안전 약속을 확인해요'};
}
S1.info.nobelt.aacKey='busUnbelted';S1.info.nobelt.title='안전벨트를 매지 않은 친구가 있어요';
AAC_CONFIG.busUnbelted.label='안전벨트를 매지 않은 친구';
AAC_CONFIG.restTogether.image='img/aac/scenes/rest-lost.png';AAC_CONFIG.restTogether.label='일행과 떨어진 친구';
const placeholder=$('#indoor-placeholder');
placeholder.outerHTML=`<div class="timer-row"><button class="hintbtn" id="indoor-hint">힌트</button><span id="indoor-num"></span><div class="tbar"><i id="indoor-bar"></i></div></div><div class="chips" id="indoor-chips">${Object.keys(trampolineRules).map(k=>`<i data-k="${k}" data-label="${trampolineRules[k].title}">?</i>`).join('')}</div><div class="scene" id="indoor-scene"><img src="img/stages/indoor-playground.png" alt="트램펄린장에서 위험한 행동 네 곳을 찾아요">${Object.keys(trampolineRules).map(k=>`<button class="hot" data-k="${k}" aria-label="그림 영역"></button>`).join('')}</div>`;
const indoorGo=$('#indoor-go').cloneNode(true);$('#indoor-go').replaceWith(indoorGo);indoorGo.disabled=true;indoorGo.textContent='위험 행동 4곳을 찾아요';
STAGE_CONFIG.indoorPlayground.placeholder=false;STAGE_CONFIG.indoorPlayground.targets=trampolineRules;
EVENT_CONFIG.indoorPlayground={id:'trampoline-injury',tripTypes:['day'],stage:'indoorPlayground',cat:'indoorPlayground',image:'img/events/trampoline-injury.png',imageAlt:'트램펄린장에서 넘어진 친구를 선생님이 돕는 상황',text:'친구가 넘어져 발목이 아프고 움직이기 어려워해요. 어떻게 할까요?',aac:'친구가 다쳤어요. 어떻게 도울까요?',correctChoice:0,feedback:'놀이를 멈추고 친구를 억지로 움직이게 하지 않아요. 선생님이나 직원에게 바로 알리고 다른 친구들이 부딪히지 않게 거리를 둬요.',choices:[
  {t:'친구를 움직이지 않게 하고 선생님이나 직원에게 알려요.',visual:'help',ok:true},
  {t:'친구를 일으켜 세워 다시 뛰게 해요.',visual:'trampolineOne'},
  {t:'괜찮아질 때까지 옆에서 계속 뛰어요.',visual:'trampolineFlip'}
]};
const indoorEngine=findStage({scene:'#indoor-scene',chips:'#indoor-chips',bar:'#indoor-bar',num:'#indoor-num',hint:'#indoor-hint',total:4,cat:'indoorPlayground',targets:trampolineRules,
  onClear(){indoorGo.disabled=false;indoorGo.textContent='안전 약속 확인 — 다음으로';modal({tag:'찾기 완료',tagCls:'safe',title:'아프면 바로 멈추고 말해요',body:ruleCard('아프거나 넘어지면 놀이를 멈추고 선생님께 바로 말해요.'),image:'img/events/trampoline-injury.png',btn:'확인'});},
  restart(){indoorEngine.start();}
});
indoorGo.onclick=()=>{const e=EVENT_CONFIG.indoorPlayground;indoorGo.disabled=true;eventCard({...e,story:e.text,why:e.feedback,rule:e.feedback},()=>{addRule(e.feedback,'indoorPlayground');gainBadge();routeNext('indoorPlayground');});};
const originalOpenStage=openStage;
openStage=function(id){originalOpenStage(id);if(id==='indoorPlayground')indoorEngine.start();};
applySourceTargets(SOURCE_TARGETS);
const originalHitboxes=applyHitboxes;
applyHitboxes=function(){applySourceTargets(SOURCE_TARGETS);originalHitboxes();};
markFound=function(scene,hot,danger){const m=document.createElement('div');m.className='mark'+(danger?' danger':'');
  const t=SOURCE_TARGETS.find(t=>t.scene===scene&&t.key===hot.dataset.k);
  if(t){const[x,y,w,h]=t.bounds;Object.assign(m.style,{left:x/1536*100+'%',top:y/1024*100+'%',width:w/1536*100+'%',height:h/1024*100+'%'});}else{['left','top','width','height'].forEach(k=>m.style[k]=hot.style[k]);}$(scene).appendChild(m);
};
// Use distinct scene contexts for existing decisions; never show a running crowd as 'lost'.
EV_LOST.image='img/aac/scenes/rest-lost.png';EV_LOST.imageAlt='일행과 떨어져 주변을 살피는 친구';
EV_STRANGER.choices[0].visual='restHotfood';
EV_LOST.choices[0].visual='parkWalk';EV_LOST.choices[2].visual='lost';
// Timer status reflects learning support even while a modal pauses the engine.
const supportStatus=setInterval(()=>{
  if(S.support==='none'){
    $$('.screen.on .qsec,.screen.on [id$="-num"]').forEach(e=>{if(e.id!=='f-left')e.textContent='시간제한 없음';});
    $('#vig').classList.remove('on');
  }
},500);

// Group existing nodes without replacing their listeners or game state.
for(const id of ['scr-s1','scr-s2','scr-s3','scr-s4','scr-s5','scr-s6','scr-indoor']){
  const screen=$('#'+id),scene=screen.querySelector('.scene');if(!scene)continue;
  const layout=document.createElement('div');layout.className='stage-layout';
  const side=document.createElement('div');side.className='stage-controls';
  [...screen.children].filter(e=>e!==scene&&!e.classList.contains('stage-head')).forEach(e=>side.appendChild(e));
  layout.append(scene,side);screen.appendChild(layout);
}
// All dialogs offer the same read-current-surface action inside the focus trap.
for(const selector of ['.start-sheet','#eventcard .ev-panel','#stagecard','#gameover']){
  const b=document.createElement('button');b.className='surface-read';b.textContent='화면 읽기';b.onclick=()=>speakKo(currentScreenText());$(selector).appendChild(b);
}
$('#scr-s4 .stage-desc').textContent='관람 예절 5문제를 확인해요. 틀린 문제는 다시 생각해 봐요.';
popQuizEvent=function(next){const q=S4.rest?.[0];if(!q)return next();eventCard({tag:'깜짝 복습!',quiz:true,cat:'museum',shuffle:false,image:q.image,story:q.textOff,choices:[{t:'O — 맞아요',visual:'yes',ok:q.correctAnswer},{t:'X — 아니에요',visual:'no',ok:!q.correctAnswer}],why:q.explanationCorrect},next);};
for(const selector of ['.sheet','.start-sheet','#eventcard .ev-panel']){
  const b=document.createElement('button');b.className='dialog-aac';b.textContent='AAC 표현 전환';b.onclick=()=>$('#aac-toggle').click();$(selector).prepend(b);
}
const supportButton=document.createElement('button');supportButton.className='aac-global';supportButton.textContent='학습지원';supportButton.setAttribute('aria-label','학습지원 시간 설정');$('#aac-toggle').before(supportButton);
supportButton.onclick=()=>{
  modal({tag:'학습지원',tagCls:'info',title:'시간을 어떻게 사용할까요?',body:'<label for="support-live">시간제한</label><select id="support-live"><option value="basic">기본</option><option value="extended">시간 넉넉히 (3배)</option><option value="none">시간제한 없음</option></select><p>점수와 찾은 내용은 그대로 유지돼요.</p>',btn:'확인'});
  const select=$('#support-live');select.value=S.support;select.onchange=()=>{S.support=select.value;saveJSON('tripEscapeSupport',S.support);$('#learning-support').value=S.support;};
};
EV_STRANGER.choices.forEach((c,i)=>c.image=`img/events/${['rest-run','rest-ask','rest-wait-alone'][i]}.png`);
EV_LOST.choices.forEach((c,i)=>c.image=`img/events/${['lost-run','lost-meeting','lost-exit'][i]}.png`);
EVENT_CONFIG.indoorPlayground.choices.forEach((c,i)=>c.image=`img/events/${['injury-alert','injury-pull','injury-continue'][i]}.png`);
delete AAC_CONFIG.injured; // '아파요' is the single pain request; no duplicate picture/meaning.
