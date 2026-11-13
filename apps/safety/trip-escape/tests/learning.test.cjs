const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require(process.env.SAFETY_TEST_MODULES||'E:/안전교육/개발도구/node_modules/jsdom');
const C=require('../content.js'),M=require('../model.js'),R=require('../resources.js');
const root=path.resolve(__dirname,'..');
function app(url='https://school.example/apps/safety/trip-escape/',storage={}){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const segment=new URL(url).pathname.split('/').filter(Boolean).at(-1);
 const entry=C.places[segment]?path.join(root,segment,'index.html'):path.join(root,'index.html');
 const dom=new JSDOM(fs.readFileSync(entry,'utf8'),{url,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};w.speechSynthesis={speak(){},cancel(){}};w.SpeechSynthesisUtterance=function(t){this.text=t;};
 for(const[k,v]of Object.entries(storage))w.localStorage.setItem(k,v);
 const css=w.document.createElement('style');css.textContent=fs.readFileSync(path.join(root,'app.css'),'utf8');w.document.head.append(css);
 for(const f of ['content.js','model.js','resources.js','mini-games.js','activities.js','story.js','app.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
 return {w,errors,doc:w.document,close:()=>w.close(),click(s){const el=w.document.querySelector(s);assert.ok(el,'대상 요소 없음: '+s);assert.ok(!el.disabled,'비활성 버튼: '+s);el.click();return el;}};
}
function practice(a){click(a,'teacher');click(a,'open-practice');}
function click(a,action,attrs=''){return a.click(`[data-action="${action}"]${attrs}`);}
test('25개 유형·장소 조합을 게임과 오답 재시도까지 진행해 완주한다',()=>{
 for(const type of C.types.map(t=>t.id))for(const place of C.destinations.filter(p=>p!=='lodging'||type==='overnight')){
 const a=app(`https://school.example/apps/safety/trip-escape/?type=${type}&place=${place}&scope=lesson&move=bus`);try{practice(a);click(a,'prepare');
 const config={type,place,scope:'lesson',move:'bus',rest:false};const route=M.routeFor(config,C);
 click(a,'begin-goal');click(a,'goal-answer','[data-index="0"]');click(a,'start-learning');
 for(const id of route){for(const s of C.places[id].spots){click(a,'spot',`[data-id="${s.id}"]`);assert.ok(a.doc.querySelector('dialog[open]'));click(a,'spot-done',`[data-id="${s.id}"]`);}click(a,'to-game');if(id==='experience'){click(a,'choose-mini','[data-kind="prep"]');click(a,'game-card','[data-id="unsafe"]');for(const spot of C.places[id].spots)click(a,'game-card',`[data-id="${spot.id}"]`);click(a,'game-finish');}if(a.doc.querySelector('[data-action="find-finish"]')){for(const t of a.w.SafetyActivities.finds[id].targets){click(a,'find-target',`[data-id="${t.id}"]`);click(a,'close');}click(a,'find-finish');}if(a.doc.querySelector('[data-action="mini-next"]'))click(a,'mini-next');
 const qs=id==='escape'?C.evacuation:C.places[id].choices;
 for(let i=0;i<qs.length;i++){const q=qs[i];if(q.kind==='report'){for(const el of a.doc.querySelectorAll('[data-report]')){el.checked=true;el.dispatchEvent(new a.w.Event('change',{bubbles:true}));}click(a,'report-check');}
 else if(q.kind==='support'){click(a,'answer','[data-index="1"]');}
 else{if(i===0){click(a,'answer',`[data-index="${q.correct?0:1}"]`);assert.match(a.doc.querySelector('.feedback').textContent,/함께 다시/);click(a,'try-again');}click(a,'answer',`[data-index="${q.correct}"]`);}click(a,'next-question');}
 for(const q of C.places[id].quizzes){click(a,'answer',`[data-index="${q.answer}"]`);click(a,'next-question');}click(a,'next-module');}
 assert.match(a.doc.querySelector('h1').textContent,/함께 연습/);assert.equal(a.doc.querySelectorAll('.rule-summary .panel').length,route.length);assert.match(a.doc.querySelector('.metric-grid').textContent,/함께 다시/);assert.equal(a.errors.length,0,a.errors.join('\n'));
 }finally{a.close();}}
});
test('장소별 주소와 수업 설정을 손실 없이 다시 연다',()=>{
 const base='https://dalinlab.kr/apps/safety/trip-escape/';for(const id of Object.keys(C.places)){const c={place:id,type:'overnight',scope:'lesson',move:'bus',rest:true};const u=M.shareURL(base,c,C);assert.match(u,new RegExp('/trip-escape/'+id+'/'));assert.deepEqual(M.parseLocation(u,C),c);assert.equal(M.parseLocation(base+id+'/index.html',C).place,id);assert.deepEqual(M.routeFor({place:id,scope:'place'},C),[id]);}
 assert.equal(M.parseLocation(base+'?type=script&place=unknown',C).place,null);
 assert.equal(M.safeURL('javascript:alert(1)'),null);assert.equal(M.safeURL('data:text/html,hi'),null);
});
test('숙박형 중복 장소·대피 경로 없이 정확한 순서로 구성한다',()=>{
 assert.deepEqual(M.routeFor({type:'overnight',place:'museum',scope:'lesson',move:'bus',rest:true},C),['bus','rest','museum','lodging','escape','homecoming']);
 assert.deepEqual(M.routeFor({type:'overnight',place:'lodging',scope:'lesson',move:'bus'},C),['bus','lodging','escape','homecoming']);
 for(const place of ['night','escape'])assert.deepEqual(M.routeFor({type:'overnight',place,scope:'lesson'},C),['bus','lodging','escape','homecoming']);
 assert.deepEqual(M.routeFor({type:'overnight',place:'bus',scope:'lesson',rest:true},C),['bus','rest','lodging','escape','homecoming']);
});
test('영상 자료는 원문 분류·썸네일을 보존하고 학생 추천에서 민감 항목을 제외한다',()=>{
 assert.equal(R.videos.length,778);assert.equal(R.meta.domains.length,7);assert.equal(new Set(R.videos.map(v=>v.id)).size,R.videos.length);
 for(const v of R.videos){assert.ok(M.safeURL(v.url));assert.ok(v.title);if(v.thumbnail&&!v.thumbnail.startsWith('http'))assert.ok(fs.existsSync(path.join(root,v.thumbnail)),v.thumbnail);if(v.teacherOnly)assert.ok(!v.studentRecommended);}
 assert.ok(R.videos.some(v=>v.venues.includes('heritage')));assert.ok(R.videos.find(v=>v.id==='compass-0031').venues.includes('cinema'));
});
test('영상 목록 공유와 검색이 학습 도중의 진행을 잃지 않는다',()=>{
 const a=app('https://school.example/apps/safety/trip-escape/?place=cinema');try{practice(a);click(a,'prepare');click(a,'begin-goal');click(a,'goal-answer','[data-index="0"]');click(a,'start-learning');click(a,'spot','[data-id="exit"]');click(a,'spot-done','[data-id="exit"]');click(a,'related','[data-id="cinema"]');assert.match(a.doc.querySelector('h1').textContent,/영화관/);assert.ok(a.doc.querySelector('.video-card'));click(a,'back-from-resources');assert.equal(a.doc.querySelectorAll('.spot-button.done').length,1);click(a,'settings');const box=a.doc.querySelector('[data-setting="large"]');box.checked=true;box.dispatchEvent(new a.w.Event('change',{bubbles:true}));assert.ok(a.doc.body.classList.contains('large-text'));click(a,'close');assert.equal(a.doc.querySelectorAll('.spot-button.done').length,1);}finally{a.close();}
});
test('설명 사용 후 정답을 독립 수행으로 계산하지 않는다',()=>{
 const s=M.createSession({place:'cinema'},C);M.recordAttempt(s,'cinema','q',false);M.recordAttempt(s,'cinema','q',true);M.recordAttempt(s,'cinema','q2',true,{assisted:true});M.recordAttempt(s,'cinema','q3',true);const r=M.summary(s);assert.equal(r.independent,1);assert.equal(r.guided,2);assert.equal(r.total,3);
});
test('설정 데이터가 손상되어도 홈이 열린다',()=>{const a=app(undefined,{safetyMasterSettings:'{broken'});assert.match(a.doc.querySelector('h1').textContent,/안전의 달인/);a.close();});
test('반일형과 1일형에는 휴게소를 넣지 않고 숙박형에서만 선택한다',()=>{
 for(const type of ['halfday','day']){assert.ok(!M.routeFor({type,place:'park',scope:'lesson',rest:true},C).includes('rest'));const a=app(`https://school.example/apps/safety/trip-escape/?place=park&type=${type}`);practice(a);click(a,'prepare');assert.equal(a.doc.querySelector('#include-rest'),null);a.close();}
 assert.equal(M.parseLocation('https://school.example/?type=monthly&place=park',C).type,'halfday');
});
test('장소별 진입 파일이 이야기 시작과 그림의 base 경로를 유지한다',()=>{for(const id of Object.keys(C.places)){const a=app(`https://school.example/apps/safety/trip-escape/${id}/`);assert.ok(a.doc.querySelector('.automatic-stage'));const img=a.doc.querySelector('#main img');assert.ok(img.src.startsWith('https://school.example/apps/safety/trip-escape/media/'));a.close();}});
test('미니게임의 실제 화면에서 점프·안전길·손전등 목표를 달성한다',async()=>{
 for(const place of ['sports','park','escape']){const a=app(`https://school.example/apps/safety/trip-escape/${place}/`,{safetyMasterSettings:'{"motion":false}'});try{practice(a);click(a,'start-activity',`[data-kind="${{sports:'jump',park:'path',escape:'torch'}[place]}"]`);
 if(place==='sports'){click(a,'mini-wait');for(let i=0;i<5;i++){click(a,'mini-jump');await new Promise(r=>a.w.requestAnimationFrame(r));}click(a,'mini-rest');}
 if(place==='park'){click(a,'mini-hazard');for(let i=0;i<3;i++)click(a,'mini-move',`[data-index="${i}"]`);}
 if(place==='escape'){click(a,'mini-bright');for(const id of ['ext','alarm','exit'])click(a,'mini-find',`[data-id="${id}"]`);}
 assert.ok(a.doc.querySelector('[data-action="mini-finish"]'));click(a,'mini-finish');assert.ok(a.doc.querySelector('.activity-done'));assert.equal(a.doc.querySelector('[data-action="answer"]'),null);assert.equal(a.errors.length,0,a.errors.join('\n'));
 }finally{a.close();}}
});
