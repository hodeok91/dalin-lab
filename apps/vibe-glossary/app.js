/* 형아맨의 바이브코딩 교실 — 로그인·설치·확장 프로그램 없이 동작 */
(() => {
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem('hgm:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem('hgm:' + k, JSON.stringify(v)); } catch {} } };
const main = $('#main');
const announce = (m) => { const l = $('#live'); l.textContent = ''; setTimeout(() => l.textContent = m, 50); };
const ALL_TERMS = [...window.TERMS, ...window.TERMS_MORE];
const TERM = Object.fromEntries(ALL_TERMS.map(t => [t.id, t]));
const QUESTS = []; window.TRACKS.forEach(tr => tr.levels.forEach(L => L.quests.forEach(q => QUESTS.push(Object.assign(q, { track: tr, lv: L.lv })))));
const QMAP = Object.fromEntries(QUESTS.map(q => [q.id, q]));
const LV = window.LEVELS;
const lvBadge = (n) => `<span class="lv lv${n}"><span aria-hidden="true">${LV[n][0]}</span>${LV[n][1]}</span>`;

/* ---------- 형아맨 코치 확장 연결 (설치돼 있으면 확장의 기록도 함께 보여요) ---------- */
const COACH = window.COACH_LINKS || {};
let ext = { on: false, version: '', done: {} };
window.addEventListener('message', (e) => {
  if (e.source !== window || e.data?.source !== 'hgm-coach') return;
  const was = ext.on; ext = { on: true, version: e.data.version, done: e.data.done || {} };
  if (!was || /^#\/(quests|track\/[\w-]+|me)?(\?.*)?$/.test(location.hash || '#/')) route(true);
});
window.postMessage({ source: 'hgm-page', type: 'hello' }, location.origin);
const coachCard = () => ext.on
  ? `<div class="card coach on" role="status"><b>🧩 형아맨 코치 연결됨 (v${esc(ext.version)})</b><p class="small" style="margin:4px 0 0">제미나이·AI 스튜디오 화면에서 브라우저 오른쪽 위 <b>형아맨 아이콘</b>을 누르면, 형아맨이 버튼을 짚어 주고 클릭·프롬프트를 자동으로 확인해요.</p></div>`
  : `<div class="card coach"><b>🧩 실제 화면에서 자동 확인을 받으려면 «형아맨 코치»를 설치해요</b><p class="small" style="margin:4px 0 8px">크롬·엣지 확장 프로그램이에요. 제미나이 화면 위에 설명 말풍선이 뜨고, 캔버스 켜기·프롬프트 보내기·링크 복사를 알아서 확인해요. 설치하지 않아도 아래 방법으로 직접 확인할 수 있어요.</p>
     <div class="row">${COACH.chrome ? `<a class="btn" href="${esc(COACH.chrome)}" target="_blank" rel="noopener">크롬에 설치<span class="sr-only"> (새 창)</span></a>` : ''}${COACH.edge ? `<a class="btn" href="${esc(COACH.edge)}" target="_blank" rel="noopener">엣지에 설치<span class="sr-only"> (새 창)</span></a>` : ''}${COACH.zip ? `<a class="btn ghost" href="${esc(COACH.zip)}" target="_blank" rel="noopener">파일로 받기<span class="sr-only"> (새 창)</span></a>` : ''}<a class="btn ghost" href="#/coach">설치 방법</a></div></div>`;

/* ---------- 진행 기록 (이 기기에만 저장) ---------- */
const done = () => Object.assign({}, store.get('done', {}), ext.done);
const isDone = (id) => !!done()[id];
const setDone = (id) => { const d = done(); d[id] = Date.now(); store.set('done', d); };
const levelDone = (tr, lv) => tr.levels.find(L => L.lv === lv).quests.every(q => isDone(q.id));
const trackPct = (tr) => { const qs = tr.levels.flatMap(L => L.quests); return Math.round(qs.filter(q => isDone(q.id)).length / qs.length * 100); };

/* ---------- 테마·글자·읽어 주기 ---------- */
function setTheme(t) { document.documentElement.dataset.theme = t; store.set('theme', t); $('#darkBtn').setAttribute('aria-pressed', String(t === 'dark')); }
setTheme(store.get('theme', 'light'));
$('#darkBtn').onclick = () => { const d = document.documentElement.dataset.theme !== 'dark'; setTheme(d ? 'dark' : 'light'); announce(d ? '다크 모드 켰어요' : '밝은 화면으로 바꿨어요'); };
$('#fontBtn').onclick = () => { const f = (store.get('font', 0) + 1) % 3; store.set('font', f); const c = document.documentElement.classList; c.remove('f1', 'f2'); if (f) c.add('f' + f); announce(['글자 보통', '글자 크게', '글자 아주 크게'][f]); };
let reading = false;
const stopSpeak = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); $$('.reading').forEach(x => x.classList.remove('reading')); };
function speak(text, el) {
  if (!('speechSynthesis' in window) || !text) return; stopSpeak();
  const v = speechSynthesis.getVoices().find(x => /ko/i.test(x.lang));
  const parts = text.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ' ').replace(/\s+/g, ' ').match(/[^.!?\n]{1,160}[.!?]?/g) || [];
  if (el) el.classList.add('reading');
  parts.forEach((t, i) => { const u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; if (v) u.voice = v; if (i === parts.length - 1) u.onend = () => el && el.classList.remove('reading'); speechSynthesis.speak(u); });
}
if (!('speechSynthesis' in window)) $('#readBtn').hidden = true;
$('#readBtn').onclick = () => { reading = !reading; $('#readBtn').setAttribute('aria-pressed', String(reading)); if (!reading) stopSpeak(); announce(reading ? '읽어 주기 켰어요. 글을 누르면 읽어 줘요' : '읽어 주기 껐어요'); };
document.addEventListener('click', (e) => { if (!reading || e.target.closest('.top, .bnav')) return; const el = e.target.closest('h1,h2,h3,p,li,.box,.copybox,.card,label'); if (el) speak(el.innerText, el); });

/* ---------- 복사 ---------- */
async function copy(text, btn) {
  try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  if (btn) { const o = btn.textContent; btn.textContent = '✅ 복사했어요'; setTimeout(() => btn.textContent = o, 1600); }
  announce('복사했어요');
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-copy]'); if (b) copy(b.dataset.copy, b); });

/* =========================================================
   화면: 홈
   ========================================================= */
function pageHome() {
  const tr = window.TRACKS;
  main.innerHTML = `
  <section class="hero">
    <div>
      <p class="bubble">안녕하세요! 저는 형아맨이에요 ⚡</p>
      <h1>코딩 몰라도 괜찮아요.<br><b>말로</b> 앱을 만들어요.</h1>
      <p class="lead">설치도, 회원가입도 없이 구글 계정 하나로 시작해요. 퀘스트를 하나씩 깨다 보면 "어? 나도 되네!" 하게 될 거예요.</p>
      <div class="row"><a class="btn big" href="#/diag">🧭 1분 진단으로 시작하기</a><a class="btn ghost big" href="#/quests">⚔️ 퀘스트 보기</a></div>
    </div>
    <div class="hero-img"><img src="assets/hyungaman.png" alt="형아맨: 갈색 머리에 하얀 옷, 파란 장갑과 장화를 신은 웃는 소년 영웅"></div>
  </section>
  <div style="margin-top:16px">${coachCard()}</div>
  <div class="how" aria-label="배우는 방법">
    <div><b>⚔️ 퀘스트로 실습</b>형아맨이 알려 주는 순서대로 따라 하며 실제 앱을 하나씩 완성해요.</div>
    <div><b>📖 용어사전으로 이론</b>모르는 말은 버튼으로 체험하고, <b>진짜 코드를 직접 고쳐 보며</b> 화면이 어떻게 바뀌는지 눈으로 확인해요.</div>
    <div><b>🪄 프롬프트 공식</b>칸만 채우면 AI에게 보낼 문장이 완성돼요. 복사해서 붙여 넣기만!</div>
  </div>
  <h2 class="sec">도구 3개 × 3단계, 도구마다 앱 하나 완성</h2>
  <div class="grid g3">${tr.map(t => `
    <article class="card track">
      <div class="row"><span class="ic" aria-hidden="true">${t.icon}</span><div><h3>${esc(t.tool)}</h3><span class="muted small">${esc(t.device)}</span></div></div>
      <p class="app">만드는 앱: ${esc(t.app)}</p>
      <p class="muted small" style="margin:0">${esc(t.why)}</p>
      <div class="lvrow">${t.levels.map(L => `<a class="lvbox lv${L.lv}" href="#/track/${t.id}?lv=${L.lv}">${LV[L.lv][1]}<small>${levelDone(t, L.lv) ? '✅ 완료' : L.quests.length + '개 퀘스트'}</small></a>`).join('')}</div>
      <div class="bar" role="img" aria-label="진행 ${trackPct(t)}%"><i style="width:${trackPct(t)}%"></i></div>
      <a class="btn" href="#/track/${t.id}">${trackPct(t) ? '이어서 하기' : '시작하기'}</a>
    </article>`).join('')}</div>
  <h2 class="sec">왜 제미나이로 시작해요?</h2>
  <div class="grid g3">
    <div class="card"><b>💸 무료예요</b><p class="muted small" style="margin:4px 0 0">제미나이·AI 스튜디오·안티그래비티 모두 구글 계정으로 무료로 쓸 수 있어요. (사용량 한도는 있어요)</p></div>
    <div class="card"><b>📱 이미 계정이 있어요</b><p class="muted small" style="margin:4px 0 0">안드로이드폰을 쓰면 구글 계정이 이미 있어요. 새로 가입할 필요가 없어요.</p></div>
    <div class="card"><b>🇰🇷 한국어로 말해요</b><p class="muted small" style="margin:4px 0 0">"우리 반 발표 순서 뽑기 앱 만들어줘"처럼 평소 말투로 부탁하면 돼요.</p></div>
  </div>`;
}

/* ---------- 1분 진단 ---------- */
function pageDiag() {
  const D = window.DIAG;
  main.innerHTML = `<div class="crumb"><a href="#/">홈</a> › 1분 진단</div>
  <h1>🧭 1분 진단</h1><p class="muted">정답은 없어요. 편하게 골라 주세요. 어디서 시작하면 좋을지 형아맨이 추천해 드려요.</p>
  <form id="diag" class="grid" style="margin-top:16px">${D.map((d, i) => `
    <fieldset class="card" style="margin:0"><legend><b>${i + 1}. ${esc(d.q)}</b></legend>
    ${d.o.map(([t, v], j) => `<label class="ck"><input type="radio" name="d${i}" value="${v}" ${j === 0 ? 'required' : ''}> ${esc(t)}</label>`).join('')}</fieldset>`).join('')}
    <button class="btn big">결과 보기</button></form><div id="diagOut" aria-live="polite"></div>`;
  $('#diag').onsubmit = (e) => {
    e.preventDefault();
    const s = D.reduce((a, _, i) => a + +(new FormData(e.target).get('d' + i) || 0), 0);
    const [tid, lv, msg] = s <= 3 ? ['canvas', 1, '휴대폰으로 바로 되는 제미나이 캔버스 초급부터 시작해요. 10분이면 첫 페이지가 나와요!']
      : s <= 6 ? ['canvas', 2, '제미나이 캔버스 중급이 딱 맞아요. 초급은 훑어보고 넘어가도 좋아요.']
      : s <= 8 ? ['aistudio', 1, '저장되는 업무 앱에 도전할 때예요. 구글 AI 스튜디오 초급부터 가 볼까요?']
      : ['antigravity', 1, 'AI 일꾼(에이전트)을 부릴 준비가 됐어요. 안티그래비티 초급 + 화면 번역표와 함께!'];
    const t = window.TRACKS.find(x => x.id === tid);
    $('#diagOut').innerHTML = `<div class="card" style="margin-top:16px;display:flex;gap:16px;align-items:center;flex-wrap:wrap"><img src="assets/hyungaman-face.png" alt="" style="width:90px"><div style="flex:1;min-width:220px"><h2>추천: ${t.icon} ${esc(t.tool)} ${lvBadge(lv)}</h2><p>${esc(msg)}</p><a class="btn" href="#/track/${tid}?lv=${lv}">여기서 시작하기</a></div></div>`;
    $('#diagOut h2').tabIndex = -1; $('#diagOut h2').focus();
  };
}

/* ---------- 퀘스트 목록 ---------- */
function pageQuests() {
  main.innerHTML = `<h1>⚔️ 퀘스트</h1><p class="muted">도구를 고르고 초급부터 차례로 깨 보세요. 기록은 이 기기에만 저장돼요 (로그인 없음).</p>
  ${window.TRACKS.map(t => `<h2 class="sec">${t.icon} ${esc(t.tool)} <span class="muted small">· ${esc(t.app)}</span></h2>${levelList(t)}`).join('')}`;
}
function levelList(t, only) {
  return t.levels.filter(L => !only || L.lv === only).map(L => `
    <section class="card" style="margin-bottom:12px" aria-labelledby="lv-${t.id}-${L.lv}">
      <h2 class="lvh" id="lv-${t.id}-${L.lv}">${lvBadge(L.lv)} ${esc(L.goal)}</h2>
      <ol class="qlist">${L.quests.map((q, i) => `<li class="${isDone(q.id) ? 'done' : ''}"><a href="#/q/${q.id}"><span class="qno" aria-hidden="true">${isDone(q.id) ? '✓' : i + 1}</span><span>${esc(q.title)}${isDone(q.id) ? '<span class="sr-only"> (완료)</span>' : ''}</span></a></li>`).join('')}</ol>
    </section>`).join('');
}
function pageTrack(id, params) {
  const t = window.TRACKS.find(x => x.id === id); if (!t) return notFound();
  const lv = +params.get('lv') || 0;
  main.innerHTML = `<div class="crumb"><a href="#/quests">퀘스트</a> › ${esc(t.tool)}</div>
  <h1>${t.icon} ${esc(t.tool)}</h1><p><b>만드는 앱: ${esc(t.app)}</b> · <span class="muted">${esc(t.device)}</span></p><p class="muted">${esc(t.why)}</p>
  ${t.id !== 'antigravity' ? coachCard() : ''}<div class="row" style="margin:10px 0 16px"><a class="btn ghost" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.tool)} 열기 ↗<span class="sr-only"> (새 창)</span></a>${id === 'antigravity' ? '<a class="btn ghost" href="#/anti">🔤 화면 번역표</a>' : ''}</div>
  ${levelList(t)}`;
  if (lv) { const el = $(`#lv-${id}-${lv}`); if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 50); }
}

/* ---------- 퀘스트 한 개 ---------- */
const norm = (s) => String(s || '').toLowerCase();
function grade(text, groups) {
  const t = norm(text), t2 = t.replace(/\s+/g, '');
  return groups.map(g => ({ name: g.name, hit: g.any.some(w => t.includes(norm(w)) || t2.includes(norm(w).replace(/\s+/g, ''))) }));
}
function pageQuest(id) {
  const q = QMAP[id]; if (!q) return notFound();
  const t = q.track, L = t.levels.find(x => x.lv === q.lv), idx = QUESTS.indexOf(q);
  const prev = QUESTS[idx - 1], next = QUESTS[idx + 1];
  const c = q.check;
  let checkHtml = '';
  if (c.type === 'open') checkHtml = `<p>버튼을 눌러 새 창에서 열고, 열린 것을 확인한 뒤 돌아와 주세요.</p><div class="row"><a class="btn" id="openBtn" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.label)} ↗<span class="sr-only"> (새 창)</span></a></div>
      <label class="ck" id="openConfirm" hidden><input type="checkbox" id="openOk"> ${esc(c.after || '열었어요! 로그인된 화면이 보여요')}</label>`;
  if (c.type === 'see') checkHtml = `<label class="ck"><input type="checkbox" id="seeOk"> ${esc(c.q)}</label>`;
  if (c.type === 'check') checkHtml = c.items.map((x, i) => `<label class="ck"><input type="checkbox" class="ckItem" id="ck${i}"> ${esc(x)}</label>`).join('');
  if (c.type === 'prompt') checkHtml = `<label class="lb" for="pIn">내가 보낸 프롬프트를 붙여 넣어 주세요</label><textarea id="pIn" placeholder="제미나이에 보낸 문장을 그대로 붙여 넣어요"></textarea>
      <p class="small muted" style="margin-top:6px">형아맨이 살펴보는 핵심: ${c.groups.map(g => esc(g.name)).join(' · ')} (이 중 ${c.need}개 이상)</p><button class="btn" id="gradeBtn" type="button">형아맨에게 채점받기</button>`;
  if (c.type === 'link') checkHtml = `<label class="lb" for="lIn">복사한 공유 링크를 붙여 넣어 주세요</label><input type="text" id="lIn" inputmode="url" placeholder="${esc(c.example)}"><button class="btn" id="linkBtn" type="button" style="margin-top:8px">링크 확인</button>`;
  if (c.type === 'quiz') checkHtml = c.qs.map((x, i) => `<fieldset class="card" style="margin:0 0 8px"><legend><b>${i + 1}. ${esc(x.q)}</b></legend>${x.o.map((o, j) => `<label class="ck"><input type="radio" name="qz${i}" value="${j}"> ${esc(o)}</label>`).join('')}</fieldset>`).join('') + '<button class="btn" id="quizBtn" type="button">정답 확인</button>';

  main.innerHTML = `<div class="crumb"><a href="#/track/${t.id}">${t.icon} ${esc(t.tool)}</a> › ${lvBadge(q.lv)}</div>
  <div class="quest-head"><img src="assets/hyungaman${idx % 2 ? '-side' : ''}.png" alt=""><div class="say"><span class="small muted">퀘스트 ${q.id.toUpperCase()} · ${esc(t.app)}</span><h1>${esc(q.title)}</h1></div></div>
  <h2 class="sec" style="margin-top:22px">이렇게 해요</h2>
  <ol class="steps">${q.do.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
  ${q.pdf ? '<p style="margin-top:12px"><a class="btn ghost" href="assets/practice-fieldtrip.pdf" download>📄 연습용 계획서 PDF 내려받기</a> <span class="small muted">가상의 학생·연락처만 들어 있어요</span></p>' : ''}
  ${q.hint ? `<p class="hint" style="margin-top:12px">💡 ${esc(q.hint)}</p>` : ''}
  ${q.copy ? `<h2 class="sec">막히면 이 문장을 복사해요</h2><div class="copybox">${esc(q.copy)}</div><div class="row" style="margin-top:8px"><button class="btn ghost" type="button" data-copy="${esc(q.copy)}">📋 복사하기</button><a class="btn ghost" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.tool)} 열기 ↗<span class="sr-only"> (새 창)</span></a></div>` : ''}
  ${t.id !== 'antigravity' ? `<h2 class="sec">확인하기</h2>${ext.on ? '<p class="hint">🧩 형아맨 코치가 연결돼 있어요. 실제 화면에서 하면 자동으로 완료돼요. 아래는 직접 확인하는 방법이에요.</p>' : ''}` : '<h2 class="sec">확인하기</h2>'}
  <div class="check-area">${isDone(q.id) ? '<p class="result ok">✅ 이미 깬 퀘스트예요. 다시 연습해도 좋아요!</p>' : ''}${checkHtml}<div id="res" aria-live="polite"></div></div>
  ${(q.terms || []).length ? `<h2 class="sec">이 퀘스트에 나오는 말</h2><div class="row">${q.terms.filter(x => TERM[x]).map(x => `<a class="chip" href="#/t/${x}">${esc(TERM[x].ko)}</a>`).join('')}</div>` : ''}
  <nav class="qnav" aria-label="퀘스트 이동">${prev ? `<a class="btn ghost" href="#/q/${prev.id}">← 이전</a>` : '<span></span>'}${next ? `<a class="btn ghost" href="#/q/${next.id}">다음 →</a>` : '<a class="btn ghost" href="#/me">내 배지 보기 →</a>'}</nav>`;

  const res = $('#res');
  const success = () => {
    const first = !isDone(q.id); setDone(q.id);
    const lvClear = levelDone(t, q.lv);
    res.innerHTML = `<div class="clear show" role="status"><img src="assets/hyungaman.png" alt=""><h2>🎉 퀘스트 성공!</h2><p>${lvClear ? `<b>${esc(t.tool)} ${LV[q.lv][1]}</b> 단계를 모두 깼어요! 배지를 받았어요 🏅` : '좋아요! 다음 퀘스트로 가 볼까요?'}</p>${next ? `<a class="btn big" href="#/q/${next.id}">다음 퀘스트 →</a>` : '<a class="btn big" href="#/me">내 배지 보기</a>'}</div>`;
    if (first) announce('퀘스트 성공!'); window.hgmPet?.cheer(); $('.clear h2', res).tabIndex = -1; $('.clear h2', res).focus();
  };
  const fail = (m) => { res.innerHTML = `<p class="result no" role="alert">${m}</p>`; };
  if (c.type === 'open') { $('#openBtn').addEventListener('click', () => { $('#openConfirm').hidden = false; }); $('#openOk').onchange = (e) => e.target.checked && success(); }
  if (c.type === 'see') $('#seeOk').onchange = (e) => e.target.checked ? success() : 0;
  if (c.type === 'check') $$('.ckItem').forEach(x => x.onchange = () => { if ($$('.ckItem').every(y => y.checked)) success(); });
  if (c.type === 'prompt') $('#gradeBtn').onclick = () => {
    const v = $('#pIn').value.trim(); if (v.length < 8) { $('#pIn').setAttribute('aria-invalid', 'true'); $('#pIn').focus(); return fail('프롬프트를 붙여 넣어 주세요. (8글자 이상)'); }
    $('#pIn').removeAttribute('aria-invalid');
    const g = grade(v, c.groups), n = g.filter(x => x.hit).length;
    const list = `<ul class="groups">${g.map(x => `<li class="${x.hit ? 'hit' : ''}">${x.hit ? '✅' : '⬜'} ${esc(x.name)}</li>`).join('')}</ul>`;
    if (n >= c.need) { success(); res.insertAdjacentHTML('afterbegin', list); }
    else fail(`조금만 더! 핵심 말 ${c.need}개 중 ${n}개가 들어 있어요. ⬜ 표시된 말을 넣어서 다시 보내 보세요.`), res.insertAdjacentHTML('beforeend', list);
  };
  if (c.type === 'link') $('#linkBtn').onclick = () => { const v = $('#lIn').value.trim(); new RegExp(c.re, 'i').test(v) ? success() : fail('공유 링크 모양이 아니에요. 캔버스의 [공유] → [링크 복사]로 받은 주소(g.co/gemini/share/…)를 붙여 넣어 주세요.'); };
  if (c.type === 'quiz') $('#quizBtn').onclick = () => {
    const wrong = c.qs.map((x, i) => +(($(`input[name=qz${i}]:checked`) || {}).value ?? -1) === x.a ? 0 : i + 1).filter(Boolean);
    wrong.length ? fail(`${wrong.join(', ')}번을 다시 골라 보세요. <a href="#/anti">화면 번역표</a>를 보면 쉬워요.`) : success();
  };
}

/* =========================================================
   용어사전
   ========================================================= */
function pageDict(params) {
  let lv = +params.get('lv') || 0, cat = params.get('c') || '', q = params.get('q') || '', more = store.get('more', false);
  main.innerHTML = `<h1>📖 바이브코딩 용어사전</h1>
  <p class="muted">용어를 누르면 쉬운 뜻과 비유, <b>버튼으로 체험</b>, <b>진짜 코드를 고쳐 보는 코드 놀이터</b>, AI에게 이렇게 말하면 되는 예시가 나와요. <a href="#/play">🧪 코드 놀이터 바로 가기</a></p>
  <div class="card" style="margin:12px 0" role="search">
    <label class="lb" for="dq" style="margin-top:0">용어 찾기</label><input type="search" id="dq" value="${esc(q)}" placeholder="예: 사이드바, div, 모달, API">
    <div class="row" style="margin-top:10px" role="group" aria-label="단계">${[0, 1, 2, 3].map(n => `<button type="button" class="chip" data-lv="${n}" aria-pressed="${lv === n}">${n ? LV[n][0] + ' ' + LV[n][1] : '전체 단계'}</button>`).join('')}</div>
    <div class="row" style="margin-top:8px" role="group" aria-label="분류"><button type="button" class="chip" data-cat="" aria-pressed="${!cat}">전체 분류</button>${Object.entries(window.CATS).map(([k, [e, n]]) => `<button type="button" class="chip" data-cat="${k}" aria-pressed="${cat === k}"><span aria-hidden="true">${e}</span> ${n}</button>`).join('')}</div>
    <label class="ck" style="font-size:15px"><input type="checkbox" id="more" ${more ? 'checked' : ''}> 기존 달인 사전에서 고른 보충 용어 ${window.TERMS_MORE.length}개도 보기</label>
  </div>
  <p id="dcount" class="muted small" aria-live="polite"></p><div class="grid g3" id="dlist"></div>`;
  const draw = () => {
    const k = norm(q).trim();
    const l = (more ? ALL_TERMS : window.TERMS).filter(t => (!lv || t.level === lv) && (!cat || t.cat === cat) && (!k || norm([t.ko, t.en, t.easy, t.like].join(' ')).includes(k)));
    $('#dcount').textContent = `용어 ${l.length}개`;
    $('#dlist').innerHTML = l.map(t => `<a class="card term-card" href="#/t/${t.id}"><div class="term-top">${lvBadge(t.level)}<span class="small muted">${window.CATS[t.cat][0]} ${window.CATS[t.cat][1]}${t.demo ? ' · 🧪체험' : ''}${window.PLAY[t.demo || t.id] ? ' · 💻코드' : ''}</span></div><h2 class="tk">${esc(t.ko)}</h2>${t.en ? `<span class="en">${esc(t.en)}</span>` : ''}<p>${esc(t.easy.length > 80 ? t.easy.slice(0, 78) + '…' : t.easy)}</p></a>`).join('') || '<p class="card">찾는 용어가 없어요. 다른 말로 찾아보거나 분류를 "전체"로 바꿔 보세요.</p>';
  };
  $('#dq').oninput = (e) => { q = e.target.value; draw(); };
  $$('[data-lv]').forEach(b => b.onclick = () => { lv = +b.dataset.lv; $$('[data-lv]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); draw(); });
  $$('[data-cat]').forEach(b => b.onclick = () => { cat = b.dataset.cat; $$('[data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); draw(); });
  $('#more').onchange = (e) => { more = e.target.checked; store.set('more', more); draw(); };
  draw();
}
function pageTerm(id) {
  const t = TERM[id]; if (!t) return notFound();
  const demo = t.demo && DEMOS[t.demo];
  const usedIn = QUESTS.filter(q => (q.terms || []).includes(id));
  main.innerHTML = `<div class="crumb"><a href="#/dict">용어사전</a> › ${esc(t.ko)}</div>
  <article class="term-detail">
    <div class="row">${lvBadge(t.level)}<span class="muted small">${window.CATS[t.cat][0]} ${window.CATS[t.cat][1]}${t.old ? ' · 기존 달인 사전' : ''}</span></div>
    <h1>${esc(t.ko)}</h1>${t.en ? `<p class="muted">${esc(t.en)}</p>` : ''}
    <div class="box easy"><h2>쉽게 말하면</h2><p style="margin:0">${esc(t.easy)}</p></div>
    ${t.like ? `<div class="box"><h2>🧸 비유하면</h2><p style="margin:0">${esc(t.like)}</p></div>` : ''}
    ${demo ? `<section class="demo" aria-labelledby="demoT"><h2 id="demoT">🧪 버튼으로 체험하기</h2><div id="demoBox"></div></section>` : ''}
    ${window.PLAY[t.demo || t.id] ? `<section class="demo play-wrap" aria-labelledby="playT"><h2 id="playT">💻 진짜 코드로 바꿔 보기</h2><div id="playBox"></div></section>` : ''}
    ${t.say ? `<div class="box good"><h2>✅ AI에게 이렇게 말해요</h2><p>${esc(t.say)}</p><button type="button" class="btn ghost" data-copy="${esc(t.say)}">📋 복사하기</button></div>` : ''}
    ${t.bad ? `<div class="box bad"><h2>❌ 이렇게만 말하면 아쉬워요</h2><p style="margin:0">${esc(t.bad)}</p></div>` : ''}
    ${(t.rel || []).length ? `<h2 class="sec">함께 보면 좋은 말</h2><div class="row">${t.rel.filter(r => TERM[r]).map(r => `<a class="chip" href="#/t/${r}">${esc(TERM[r].ko)}</a>`).join('')}</div>` : ''}
    ${usedIn.length ? `<h2 class="sec">이 말이 나오는 퀘스트</h2><div class="row">${usedIn.map(q => `<a class="chip" href="#/q/${q.id}">${q.track.icon} ${esc(q.title)}</a>`).join('')}</div>` : ''}
  </article>`;
  if (demo) demo($('#demoBox'));
  if (window.PLAY[t.demo || t.id]) playground($('#playBox'), t.demo || t.id);
}

/* ---------- 코드 놀이터: 코드를 고치면 오른쪽 화면이 바로 바뀌어요 ---------- */
function playground(el, key, opts = {}) {
  const P = window.PLAY[key] || { h: '', c: '', j: '', tip: '' };
  const cur = { h: P.h, c: P.c, j: P.j };
  const id = 'pg' + Math.random().toString(36).slice(2, 7);
  el.innerHTML = `${P.tip ? `<p class="hint">✏️ 이렇게 바꿔 보세요: ${esc(P.tip)}</p>` : ''}
  <div class="pg">
    <div class="pg-code">
      <div role="tablist" aria-label="코드 종류" class="pg-tabs">${[['h', 'HTML 뼈대'], ['c', 'CSS 꾸미기'], ['j', 'JS 움직임']].map(([k, n], i) => `<button type="button" role="tab" id="${id}-t${k}" aria-selected="${!i}" aria-controls="${id}-p${k}" tabindex="${i ? -1 : 0}" data-k="${k}">${n}${cur[k] ? '' : ' (비어 있음)'}</button>`).join('')}</div>
      ${['h', 'c', 'j'].map((k, i) => `<div role="tabpanel" id="${id}-p${k}" aria-labelledby="${id}-t${k}" ${i ? 'hidden' : ''}><label class="sr-only" for="${id}-e${k}">${{ h: 'HTML', c: 'CSS', j: '자바스크립트' }[k]} 코드</label><textarea id="${id}-e${k}" data-k="${k}" spellcheck="false" autocapitalize="off" class="code-ed">${esc(cur[k])}</textarea></div>`).join('')}
      <div class="row" style="margin-top:6px"><button type="button" class="btn ghost" data-act="reset">↺ 처음 코드로</button><button type="button" class="btn ghost" data-act="copy">📋 코드 복사</button></div>
    </div>
    <div class="pg-view">
      <div class="row" role="group" aria-label="미리보기 화면 너비" style="margin:0 0 6px">${[['100%', '꽉 차게'], ['375px', '📱 휴대폰'], ['768px', '📟 태블릿']].map(([w, n], i) => `<button type="button" class="chip" data-w="${w}" aria-pressed="${!i}">${n}</button>`).join('')}</div>
      <iframe title="코드 결과 미리보기" sandbox="allow-scripts" class="pg-frame"></iframe>
      <p class="small muted" style="margin:4px 0 0">코드를 고치면 0.5초 뒤 화면이 바뀌어요. 실수해도 [처음 코드로]를 누르면 돼요.</p>
    </div>
  </div>`;
  const fr = $('.pg-frame', el);
  const doc = () => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:"Malgun Gothic",sans-serif;margin:12px;color:#1c2433;background:#fff}${cur.c}</style></head><body>${cur.h}<script>window.onerror=function(m){var p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='color:#b3261e;background:#fde7e5;padding:6px;border-radius:6px';p.textContent='⚠️ 자바스크립트 오류: '+String(m).replace(/^Uncaught /,'');(document.body||document.documentElement).appendChild(p);return true};<\/script><script>${cur.j.replace(/<\/script/gi, '<\\/script')}<\/script></body></html>`;
  const update = () => { fr.srcdoc = doc(); };
  let tm; $$('.code-ed', el).forEach(t => t.addEventListener('input', () => { cur[t.dataset.k] = t.value; clearTimeout(tm); tm = setTimeout(update, 500); }));
  $$('.code-ed', el).forEach(t => t.addEventListener('keydown', (e) => { if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && t.dataset.tabmode === '1') { e.preventDefault(); t.setRangeText('  ', t.selectionStart, t.selectionEnd, 'end'); } if (e.key === 'Escape') t.dataset.tabmode = '0'; }));
  const tabs = $$('[role=tab]', el);
  tabs.forEach((b, i) => { b.onclick = () => { tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); };
    b.onkeydown = (e) => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + 3) % 3]; n.focus(); n.click(); }; });
  $$('[data-w]', el).forEach(b => b.onclick = () => { $$('[data-w]', el).forEach(x => x.setAttribute('aria-pressed', String(x === b))); fr.style.width = b.dataset.w; });
  $('[data-act=reset]', el).onclick = () => { Object.assign(cur, { h: P.h, c: P.c, j: P.j }); $$('.code-ed', el).forEach(t => t.value = cur[t.dataset.k]); update(); announce('처음 코드로 돌렸어요'); };
  $('[data-act=copy]', el).onclick = (e) => copy(`<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<style>\n${cur.c}\n</style>\n</head>\n<body>\n${cur.h}\n<script>\n${cur.j}\n<\/script>\n</body>\n</html>`, e.currentTarget);
  update();
}
function pagePlay(params) {
  const keys = Object.keys(window.PLAY);
  const name = (k) => (window.TERMS.find(t => t.demo === k || t.id === k) || {}).ko || k;
  let k = params.get('k') || 'div';
  main.innerHTML = `<div class="crumb"><a href="#/dict">용어사전</a> › 코드 놀이터</div>
  <h1>🧪 코드 놀이터</h1><p class="muted">AI가 만들어 주는 코드가 실제로 어떤 화면이 되는지, 직접 고쳐 보며 눈으로 확인해요. 망가져도 괜찮아요!</p>
  <label class="lb" for="pk">무엇을 만들어 볼까요?</label><select id="pk">${keys.map(x => `<option value="${x}" ${x === k ? 'selected' : ''}>${esc(name(x))}</option>`).join('')}</select>
  <p style="margin-top:6px"><a id="pkTerm" href="#/t/${esc((window.TERMS.find(t => t.demo === k || t.id === k) || {}).id || '')}">이 용어 뜻 보기 →</a></p>
  <div id="pgBox" class="demo"></div>`;
  playground($('#pgBox'), k);
  $('#pk').onchange = (e) => { k = e.target.value; history.replaceState(null, '', '#/play?k=' + k); $('#pkTerm').href = '#/t/' + ((window.TERMS.find(t => t.demo === k || t.id === k) || {}).id || ''); playground($('#pgBox'), k); };
}

/* ---------- 용어 빠른 보기 (프롬프트 공식의 ? 버튼) ---------- */
function termDialog(id) {
  const t = TERM[id]; if (!t) return;
  const d = $('#dlg'); const demo = t.demo && DEMOS[t.demo];
  $('#dlgBody').innerHTML = `<div class="row">${lvBadge(t.level)}<span class="muted small">${window.CATS[t.cat][1]}</span></div><h2 id="dlgTitle" style="font-size:24px;margin:6px 0">${esc(t.ko)} <span class="muted small">${esc(t.en || '')}</span></h2>
    <div class="box easy" style="margin-top:6px"><p style="margin:0">${esc(t.easy)}</p></div>${t.like ? `<p style="margin-top:10px">🧸 ${esc(t.like)}</p>` : ''}
    ${demo ? '<div class="demo"><h3 style="font-size:16px">🧪 눌러 보세요</h3><div id="dlgDemo"></div></div>' : ''}
    ${t.say ? `<div class="box good"><b>✅ 이렇게 말해요</b><p style="margin:4px 0 0">${esc(t.say)}</p></div>` : ''}
    <div class="row" style="margin-top:12px"><a class="btn" href="#/t/${t.id}" id="dlgMore">💻 코드로 더 해 보기</a><button type="button" class="btn ghost" id="dlgClose">닫기</button></div>`;
  if (demo) demo($('#dlgDemo'));
  $('#dlgClose').onclick = () => d.close(); $('#dlgMore').onclick = () => d.close();
  d.showModal();
}

/* ---------- 체험(데모) — 실제로 눌러 보며 바뀌는 모습 확인 ---------- */
const stage = (html, ctrl = '', code = '') => `<div class="demo-stage">${html}</div>${ctrl ? `<div class="demo-ctrl">${ctrl}</div>` : ''}${code ? `<div class="demo-code" aria-live="polite">${code}</div>` : ''}`;
const range = (id, label, min, max, val, unit = 'px') => `<label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" value="${val}"><output for="${id}" id="${id}o">${val}${unit}</output>`;
const cards = (n, cls = 'd-card') => Array.from({ length: n }, (_, i) => `<div class="${cls}"><b aria-hidden="true">${['🐶', '🐱', '🐰', '🐻', '🦁', '🐼'][i % 6]}</b>${['강아지', '고양이', '토끼', '곰', '사자', '판다'][i % 6]}</div>`).join('');
const DEMOS = {
  hero: (el) => { el.innerHTML = stage(`<div class="d-hero" id="dh"><b>우리 반 동물원</b>귀여운 동물 친구를 만나요<br><button class="d-btn" style="background:#fff;color:#1d4fbf;margin-top:8px">시작하기</button></div><div class="d-mini" style="margin-top:8px">↓ 그 아래 다른 내용…</div>`, '<button class="btn ghost" id="t">히어로 섹션 켜기/끄기</button>'); $('#t', el).onclick = () => $('#dh', el).hidden = !$('#dh', el).hidden; },
  responsive: (el) => { el.innerHTML = stage(`<div id="rw" style="margin:auto;border:3px solid #1c2433;border-radius:14px;padding:8px;background:#fff;transition:width .3s"><div id="rg" style="display:grid;gap:6px">${cards(6)}</div></div>`, range('rr', '화면 너비', 200, 700, 360), ''); const f = () => { const w = +$('#rr', el).value; $('#rw', el).style.width = w + 'px'; const c = w < 360 ? 1 : w < 520 ? 2 : 3; $('#rg', el).style.gridTemplateColumns = `repeat(${c},1fr)`; $('#rro', el).textContent = `${w}px → 한 줄에 ${c}개 (${w < 360 ? '휴대폰' : w < 520 ? '태블릿' : '컴퓨터'})`; }; $('#rr', el).oninput = f; f(); },
  card: (el) => { el.innerHTML = stage(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${cards(6)}</div>`, '', '카드 = 그림 + 이름이 담긴 네모 한 장'); },
  sidebar: (el) => { el.innerHTML = stage(`<div style="display:flex;gap:8px;background:#fff;border-radius:8px;min-height:140px;color:#1c2433"><nav id="sb" style="width:130px;background:#eef2f8;border-radius:8px;padding:8px;transition:width .25s"><div style="font-weight:800">☰ 메뉴</div><div>🏠 <span class="lb2">홈</span></div><div>🧩 <span class="lb2">퀴즈</span></div><div>⭐ <span class="lb2">점수</span></div></nav><div style="flex:1;padding:8px">본문 내용</div></div>`, '<button class="btn ghost" id="t" aria-pressed="false">사이드바 접기</button>'); $('#t', el).onclick = (e) => { const on = e.target.getAttribute('aria-pressed') !== 'true'; e.target.setAttribute('aria-pressed', on); e.target.textContent = on ? '사이드바 펴기' : '사이드바 접기'; $('#sb', el).style.width = on ? '44px' : '130px'; $$('.lb2', el).forEach(x => x.hidden = on); }; },
  sticky: (el) => { el.innerHTML = stage(`<div tabindex="0" aria-label="스크롤 상자" style="height:160px;overflow:auto;background:#fff;border-radius:8px;color:#1c2433"><div style="position:sticky;top:0;background:#1d4fbf;color:#fff;padding:8px;font-weight:700">📌 고정 머리글 (따라와요)</div>${Array.from({ length: 12 }, (_, i) => `<p style="padding:4px 10px;margin:0">${i + 1}번째 줄 내용</p>`).join('')}</div>`, '', '상자 안을 아래로 내려 보세요'); },
  button: (el) => { el.innerHTML = stage(`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="d-btn" id="b">눌러 보세요</button><span id="o" class="d-mini" aria-live="polite">0번 눌렀어요</span></div>`, range('bs', '버튼 크기', 30, 90, 44)); let n = 0; $('#b', el).onclick = () => $('#o', el).textContent = `${++n}번 눌렀어요`; $('#bs', el).oninput = (e) => { $('#b', el).style.minHeight = e.target.value + 'px'; $('#b', el).style.fontSize = e.target.value / 3 + 'px'; $('#bso', el).textContent = e.target.value + 'px'; }; },
  tabs: (el) => { const T = ['오늘', '이번 주', '이번 달'], C = ['🎨 미술 활동', '🚌 현장체험학습', '🎂 생일 파티']; el.innerHTML = stage(`<div class="d-tabs" role="tablist" aria-label="일정">${T.map((t, i) => `<button role="tab" id="tb${i}" aria-selected="${!i}" aria-controls="tp" tabindex="${i ? -1 : 0}">${t}</button>`).join('')}</div><div class="d-panel" role="tabpanel" id="tp" aria-labelledby="tb0">${C[0]}</div>`); $$('[role=tab]', el).forEach((b, i) => b.onclick = () => { $$('[role=tab]', el).forEach((x, j) => { x.setAttribute('aria-selected', i === j); x.tabIndex = i === j ? 0 : -1; }); $('#tp', el).textContent = C[i]; $('#tp', el).setAttribute('aria-labelledby', 'tb' + i); }); },
  accordion: (el) => { const Q = [['준비물은요?', '도시락, 물, 모자'], ['몇 시에 모여요?', '오전 9시 학교 정문']]; el.innerHTML = stage(Q.map(([q, a], i) => `<div class="d-panel" style="margin-bottom:6px"><button class="d-btn" style="width:100%;text-align:left;background:#eef2f8;color:#1c2433" aria-expanded="false" aria-controls="ac${i}">▸ ${q}</button><div id="ac${i}" hidden style="padding:8px">${a}</div></div>`).join('')); $$('[aria-expanded]', el).forEach(b => b.onclick = () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o); b.textContent = (o ? '▾ ' : '▸ ') + b.textContent.slice(2); $('#' + b.getAttribute('aria-controls'), el).hidden = !o; }); },
  modal: (el) => { el.innerHTML = stage(`<p style="margin:0 0 8px">문제: 🍎는 무슨 과일?</p><button class="d-btn" id="b">사과 (정답 누르기)</button><div class="d-modal-back" id="m" hidden><div class="d-modal" role="dialog" aria-modal="true" aria-label="정답"><div style="font-size:40px" aria-hidden="true">⭐</div><b>참 잘했어요!</b><br><button class="d-btn" id="c" style="margin-top:8px">닫기</button></div></div>`); $('#b', el).onclick = () => { $('#m', el).hidden = false; $('#c', el).focus(); }; $('#c', el).onclick = () => { $('#m', el).hidden = true; $('#b', el).focus(); }; },
  dropdown: (el) => { el.innerHTML = stage(`<label for="dd" style="color:inherit">반 고르기</label> <select id="dd" style="width:auto"><option>해님반</option><option>달님반</option><option>별님반</option></select><p id="o" class="d-mini" aria-live="polite" style="margin-top:8px">해님반을 골랐어요</p>`); $('#dd', el).onchange = (e) => $('#o', el).textContent = e.target.value + '을 골랐어요'; },
  tooltip: (el) => { el.innerHTML = stage(`<div style="padding-top:36px;display:flex;gap:18px">${[['🖨️', '인쇄하기'], ['💾', '저장하기'], ['🗑️', '지우기']].map(([i, t]) => `<span class="d-has-tip"><button class="d-btn" aria-label="${t}">${i}</button><span class="d-tip" aria-hidden="true">${t}</span></span>`).join('')}</div>`, '', '버튼에 마우스를 올리거나 Tab 키로 가 보세요'); },
  toast: (el) => { el.innerHTML = stage(`<button class="d-btn" id="b">저장하기</button><div class="d-toast" id="t" role="status" hidden>✅ 저장했어요</div>`); let tm; $('#b', el).onclick = () => { $('#t', el).hidden = false; clearTimeout(tm); tm = setTimeout(() => $('#t', el).hidden = true, 2500); }; },
  carousel: (el) => { const P = ['🌸 봄 소풍', '🏖️ 여름 물놀이', '🍂 가을 운동회', '⛄ 겨울 눈썰매']; let i = 0; el.innerHTML = stage(`<div class="d-panel" style="text-align:center;font-size:28px;padding:24px" id="c" aria-live="polite">${P[0]}</div><div style="display:flex;justify-content:space-between;margin-top:8px"><button class="d-btn" id="p" aria-label="이전 사진">◀</button><span id="n" class="d-mini">1 / 4</span><button class="d-btn" id="x" aria-label="다음 사진">▶</button></div>`); const go = (d) => { i = (i + d + P.length) % P.length; $('#c', el).textContent = P[i]; $('#n', el).textContent = `${i + 1} / ${P.length}`; }; $('#p', el).onclick = () => go(-1); $('#x', el).onclick = () => go(1); },
  hover: (el) => { el.innerHTML = stage(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${cards(3, 'd-card d-hov" tabindex="0')}</div>`, '', '카드에 마우스를 올려 보세요 (또는 Tab)'); },
  micro: (el) => { el.innerHTML = stage(`<button class="d-heart" id="h" aria-pressed="false" aria-label="좋아요">🤍</button> <span class="d-mini" id="n">0</span>`); let n = 0; $('#h', el).onclick = (e) => { const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.textContent = on ? '❤️' : '🤍'; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); $('#n', el).textContent = on ? ++n : --n; }; },
  html: (el) => { el.innerHTML = stage(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><pre style="margin:0;background:#1c2433;color:#e6ebf3;padding:10px;border-radius:8px;font-size:13px;white-space:pre-wrap">&lt;h1&gt;우리 반&lt;/h1&gt;\n&lt;p&gt;반가워요&lt;/p&gt;\n&lt;button&gt;시작&lt;/button&gt;</pre><div class="d-panel"><h3 style="color:#1c2433;margin:0">우리 반</h3><p style="margin:4px 0">반가워요</p><button>시작</button></div></div>`, '', '왼쪽 HTML(뼈대) → 오른쪽 화면'); },
  css: (el) => { el.innerHTML = stage(`<div id="cb" class="d-panel" style="text-align:center;transition:all .3s"><b>우리 반 알림장</b><p style="margin:4px 0">내일은 체육복을 입어요</p></div>`, '<button class="btn ghost" id="t" aria-pressed="false">CSS 옷 입히기</button>', '같은 HTML, 옷(CSS)만 바꿔요'); $('#t', el).onclick = (e) => { const on = e.target.getAttribute('aria-pressed') !== 'true'; e.target.setAttribute('aria-pressed', on); Object.assign($('#cb', el).style, on ? { background: '#fff3d6', borderRadius: '24px', fontSize: '20px', border: '4px dashed #f5b400', color: '#5a3d00' } : { background: '', borderRadius: '', fontSize: '', border: '', color: '' }); }; },
  js: (el) => { el.innerHTML = stage(`<p style="margin:0 0 8px">⭐ 점수: <b id="s">0</b></p><button class="d-btn" id="b">정답!</button>`, '', '버튼을 누르면 → 점수 +1 (이 "움직임"이 자바스크립트)'); let s = 0; $('#b', el).onclick = () => $('#s', el).textContent = ++s; },
  tag: (el) => { el.innerHTML = stage(`<div class="d-panel" id="tg"><span data-t="h1" style="font-size:24px;font-weight:800;display:block">큰 제목</span><span data-t="p" style="display:block">보통 문단 글</span></div>`, '<button class="btn ghost" id="t" aria-pressed="false">이름표(태그) 보기</button>'); $('#t', el).onclick = (e) => { const on = e.target.getAttribute('aria-pressed') !== 'true'; e.target.setAttribute('aria-pressed', on); $$('[data-t]', el).forEach(x => x.style.outline = on ? '2px dashed #c62828' : ''); $$('.tgl', el).forEach(x => x.remove()); if (on) $$('[data-t]', el).forEach(x => x.insertAdjacentHTML('afterbegin', `<small class="tgl" style="color:#c62828;font-size:12px">&lt;${x.dataset.t}&gt; </small>`)); }; },
  div: (el) => { el.innerHTML = stage(`<div id="dv" style="transition:all .3s"><div style="font-size:30px" aria-hidden="true">🍎</div><b>사과</b><p style="margin:0">빨갛고 달콤해요</p></div>`, '<button class="btn ghost" id="a">① div 상자 보이기</button><button class="btn ghost" id="b">② 상자에 색칠</button><button class="btn ghost" id="c">③ 상자 가운데로</button><button class="btn ghost" id="r">처음으로</button>', '그림·이름·설명을 div 상자 하나로 묶었어요'); const d = $('#dv', el); $('#a', el).onclick = () => { d.style.outline = '3px dashed #c62828'; $('.demo-code', el).textContent = '<div> … </div> ← 빨간 점선이 상자예요'; }; $('#b', el).onclick = () => { d.style.background = '#fde7e5'; d.style.padding = '12px'; d.style.borderRadius = '12px'; d.style.color = '#1c2433'; $('.demo-code', el).textContent = '상자를 만들었으니 한 번에 색칠할 수 있어요'; }; $('#c', el).onclick = () => { d.style.width = '160px'; d.style.margin = '0 auto'; d.style.textAlign = 'center'; $('.demo-code', el).textContent = '상자째로 가운데로 옮겼어요'; }; $('#r', el).onclick = () => { d.removeAttribute('style'); $('.demo-code', el).textContent = '그림·이름·설명을 div 상자 하나로 묶었어요'; }; },
  padding: (el) => { el.innerHTML = stage(`<div style="display:inline-block;border:3px solid #1d4fbf;border-radius:8px;background:#e5edff"><div id="pd" style="padding:8px"><div class="d-card">글자</div></div></div>`, range('pr', '안쪽 여백(패딩)', 0, 50, 8), 'padding: 8px'); $('#pr', el).oninput = (e) => { $('#pd', el).style.padding = e.target.value + 'px'; $('#pro', el).textContent = e.target.value + 'px'; $('.demo-code', el).textContent = `padding: ${e.target.value}px`; }; },
  margin: (el) => { el.innerHTML = stage(`<div style="display:flex;flex-wrap:wrap" id="mg">${cards(3)}</div>`, range('mr', '바깥 여백(마진)', 0, 40, 2), 'margin: 2px'); const f = (v) => $$('#mg .d-card', el).forEach(c => c.style.margin = v + 'px'); f(2); $('#mr', el).oninput = (e) => { f(e.target.value); $('#mro', el).textContent = e.target.value + 'px'; $('.demo-code', el).textContent = `margin: ${e.target.value}px`; }; },
  color: (el) => { el.innerHTML = stage(`<div id="cl" class="d-panel" style="font-size:22px;font-weight:800;text-align:center">우리 반 색</div>`, '<label for="cp">색 고르기</label> <input type="color" id="cp" value="#1d4fbf">', 'color: #1D4FBF'); $('#cp', el).oninput = (e) => { $('#cl', el).style.color = e.target.value; $('.demo-code', el).textContent = 'color: ' + e.target.value.toUpperCase(); }; },
  flex: (el) => { el.innerHTML = stage(`<div id="fx" style="display:flex;gap:8px">${cards(3)}</div>`, '<button class="btn ghost" id="t">가로 ↔ 세로 바꾸기</button>', 'flex-direction: row (가로 기차)'); $('#t', el).onclick = () => { const f = $('#fx', el), col = f.style.flexDirection !== 'column'; f.style.flexDirection = col ? 'column' : 'row'; $('.demo-code', el).textContent = col ? 'flex-direction: column (세로 기차)' : 'flex-direction: row (가로 기차)'; }; },
  grid: (el) => { el.innerHTML = stage(`<div id="gd" style="display:grid;gap:8px;grid-template-columns:repeat(3,1fr)">${cards(6)}</div>`, range('gr', '한 줄 칸 수', 1, 6, 3, '칸'), 'grid-template-columns: repeat(3, 1fr)'); $('#gr', el).oninput = (e) => { $('#gd', el).style.gridTemplateColumns = `repeat(${e.target.value},1fr)`; $('#gro', el).textContent = e.target.value + '칸'; $('.demo-code', el).textContent = `grid-template-columns: repeat(${e.target.value}, 1fr)`; }; },
  bento: (el) => { el.innerHTML = stage(`<div style="display:grid;gap:8px;grid-template-columns:2fr 1fr 1fr;grid-template-rows:80px 80px"><div class="d-card" style="grid-row:span 2;display:grid;place-items:center">☀️ 오늘 날씨<br><b>맑음 18°</b></div><div class="d-card">🍱 급식</div><div class="d-card">📅 시간표</div><div class="d-card" style="grid-column:span 2">📢 공지: 내일 현장체험학습</div></div>`, '', '중요한 것은 큰 칸, 나머지는 작은 칸'); },
  split: (el) => { el.innerHTML = stage(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="d-card" style="font-size:48px">🐘</div><div style="display:grid;gap:6px"><button class="d-btn">코끼리</button><button class="d-btn" style="background:#566074">기린</button></div></div>`, '', '왼쪽: 문제 그림 · 오른쪽: 답 버튼'); },
  drawer: (el) => { el.innerHTML = stage(`<button class="d-btn" id="o" aria-expanded="false" aria-controls="dw">☰ 메뉴</button><div id="dw" hidden style="position:absolute;top:0;left:0;bottom:0;width:60%;background:#fff;color:#1c2433;box-shadow:4px 0 16px #0004;padding:12px;border-radius:0 12px 12px 0"><b>서랍 메뉴</b><p>🏠 홈</p><p>🧩 퀴즈</p><button class="d-btn" id="c">닫기</button></div>`); $('#o', el).onclick = () => { $('#dw', el).hidden = false; $('#o', el).setAttribute('aria-expanded', 'true'); $('#c', el).focus(); }; $('#c', el).onclick = () => { $('#dw', el).hidden = true; $('#o', el).setAttribute('aria-expanded', 'false'); $('#o', el).focus(); }; },
  skeleton: (el) => { el.innerHTML = stage(`<div id="sk" class="d-panel"><div class="d-skel" style="width:60%"></div><div class="d-skel"></div><div class="d-skel" style="width:80%"></div></div>`, '<button class="btn ghost" id="t">불러오기 다시 해 보기</button>'); const run = () => { $('#sk', el).innerHTML = '<div class="d-skel" style="width:60%"></div><div class="d-skel"></div><div class="d-skel" style="width:80%"></div>'; setTimeout(() => $('#sk', el).innerHTML = '<b>🍱 오늘 급식</b><br>카레라이스 · 계란국 · 깍두기', 1600); }; $('#t', el).onclick = run; run(); },
  transition: (el) => { el.innerHTML = stage(`<div style="display:flex;gap:20px"><div><div class="d-mini">툭 바뀜</div><div id="a" style="width:60px;height:60px;background:#1d4fbf;border-radius:8px"></div></div><div><div class="d-mini">스르륵 바뀜</div><div id="b" style="width:60px;height:60px;background:#1d4fbf;border-radius:8px;transition:all .8s"></div></div></div>`, '<button class="btn ghost" id="t">바꿔 보기</button>'); let on = false; $('#t', el).onclick = () => { on = !on; ['#a', '#b'].forEach(s => Object.assign($(s, el).style, on ? { background: '#f5b400', width: '120px', borderRadius: '50%' } : { background: '#1d4fbf', width: '60px', borderRadius: '8px' })); }; },
  reveal: (el) => { el.innerHTML = stage(`<div style="display:grid;gap:8px">${cards(3, 'd-card d-reveal')}</div>`, '<button class="btn ghost" id="t">다시 나타나게</button>'); const run = () => { $$('.d-reveal', el).forEach(x => x.classList.remove('on')); setTimeout(() => $$('.d-reveal', el).forEach(x => x.classList.add('on')), 100); }; $('#t', el).onclick = run; run(); },
  stagger: (el) => { el.innerHTML = stage(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${cards(6, 'd-card d-reveal')}</div>`, '<button class="btn ghost" id="t">차례로 나타나게</button>'); const run = () => { const c = $$('.d-reveal', el); c.forEach(x => x.classList.remove('on')); c.forEach((x, i) => setTimeout(() => x.classList.add('on'), 150 + i * 150)); }; $('#t', el).onclick = run; run(); },
  glass: (el) => { el.innerHTML = stage(`<div style="background:linear-gradient(135deg,#ff9a9e,#fad0c4,#a1c4fd);border-radius:10px;padding:24px;position:relative"><div style="font-size:60px;position:absolute;right:20px;top:4px" aria-hidden="true">🌈</div><div class="d-glass" id="g">반투명 유리 메뉴</div></div>`, '<button class="btn ghost" id="t">유리 효과 켜기/끄기</button>'); $('#t', el).onclick = () => $('#g', el).classList.toggle('d-glass'); },
  parallax: (el) => { el.innerHTML = stage(`<div tabindex="0" aria-label="스크롤 상자" id="px" style="height:170px;overflow:auto;border-radius:8px;position:relative;background:#cfe3ff"><div id="bg" style="position:absolute;inset:0;font-size:60px;opacity:.6" aria-hidden="true">⛰️⛰️⛰️</div><div style="position:relative;height:500px;padding:60px 14px;font-weight:700;color:#0b1220">🚗 앞 내용은 빨리 움직이고<br><br><br>⛰️ 뒤 산은 천천히 움직여요<br><br><br>계속 내려 보세요</div></div>`, '', '상자 안을 스크롤해 보세요'); $('#px', el).onscroll = (e) => $('#bg', el).style.transform = `translateY(${e.target.scrollTop * 0.7}px)`; },
  snap: (el) => { el.innerHTML = stage(`<div class="d-snap" tabindex="0" aria-label="옆으로 넘기는 카드">${cards(5)}</div>`, '', '옆으로 밀어 보세요. 한 장씩 딱 멈춰요'); },
};

/* =========================================================
   프롬프트 공식
   ========================================================= */
function pagePrompt() {
  const uiTerms = window.TERMS.filter(t => ['layout', 'ui', 'fx'].includes(t.cat));
  main.innerHTML = `<h1>🪄 프롬프트 공식</h1>
  <p class="muted">빈칸만 채우면 AI에게 보낼 문장이 완성돼요.</p>
  <div class="card" style="margin:14px 0"><h2 style="font-size:18px">형아맨의 5칸 공식</h2>
    <div class="formula"><span>누가 쓰나</span>+<span>무엇을</span>+<span>꼭 필요한 기능</span>+<span>화면 모양 (용어)</span>+<span>지킬 것</span></div>
    <p class="small muted" style="margin-top:8px">고칠 때는 <b>"화면 용어 + 원하는 동작 + 조건"</b>으로 말해요. 예: "카드에 마우스를 올리면 살짝 떠오르게, 휴대폰에서는 효과 없이"</p></div>
  <form id="pf" class="card">
    <label class="lb" for="f1">1. 누가 쓰나요?</label><input type="text" id="f1" placeholder="예: 유치원 7세 반 아이들 / 특수학교 중학생 / 우리 학교 선생님">
    <label class="lb" for="f2">2. 무엇을 만들까요?</label><input type="text" id="f2" placeholder="예: 동물 이름 맞히기 퀴즈 앱">
    <label class="lb" for="f3">3. 꼭 필요한 기능은?</label><input type="text" id="f3" placeholder="예: 그림 보고 정답 고르기, 맞으면 박수 소리, 점수 보이기">
    <fieldset style="border:0;padding:0;margin:12px 0 0"><legend class="lb" style="margin:0 0 6px">4. 화면 모양 (용어사전 용어, 여러 개 골라요)</legend>
      <p class="small muted" style="margin:0 0 6px">모르는 말은 옆의 <b>?</b> 를 누르면 어떻게 생기고 움직이는지 바로 보여 줘요.</p>
      <div class="row">${uiTerms.map(t => `<span class="chip q-chip"><label><input type="checkbox" class="uiT" value="${esc(t.ko.replace(/\(.*\)/, ''))}"> ${esc(t.ko)}</label><button type="button" class="qbtn" data-term="${t.id}" aria-label="${esc(t.ko)} 뜻과 체험 보기">?</button></span>`).join('')}</div></fieldset>
    <fieldset style="border:0;padding:0;margin:12px 0 0"><legend class="lb" style="margin:0 0 6px">5. 지킬 것</legend>
      <div class="row">${['버튼은 크게', '글자는 적게, 그림은 크게', '휴대폰에서 잘 보이게', '한국어로', '학생 실명·연락처 넣지 않기', '움직임은 약하게', '나머지 기능은 그대로'].map(x => `<label class="chip"><input type="checkbox" class="rule" value="${x}"> ${x}</label>`).join('')}</div></fieldset>
  </form>
  <h2 class="sec">완성된 프롬프트</h2><div class="out" id="po" aria-live="polite"></div>
  <div class="row" style="margin-top:10px"><button class="btn" type="button" id="pc">📋 복사하기</button><a class="btn ghost" href="https://gemini.google.com/app" target="_blank" rel="noopener">제미나이 열기 ↗<span class="sr-only"> (새 창)</span></a></div>
  <h2 class="sec">❌ 아쉬운 말 vs ✅ 좋은 말</h2>
  <div class="grid g2">
    <div class="box bad"><b>❌ 게임 만들어줘</b><p class="small muted" style="margin:4px 0 0">누가, 무슨 게임인지 몰라서 AI가 마음대로 만들어요.</p></div>
    <div class="box good"><b>✅ 7세 반이 쓸 색깔 맞히기 게임을 만들어줘. 버튼은 크게, 맞으면 별이 나오게.</b></div>
    <div class="box bad"><b>❌ 이상해, 다시 해줘</b><p class="small muted" style="margin:4px 0 0">무엇이 이상한지 몰라 전부 바뀌어 버려요.</p></div>
    <div class="box good"><b>✅ 제목 글씨만 2배로 키워줘. 다른 부분은 그대로 둬.</b></div>
  </div>`;
  const f = () => {
    const v = (id) => $('#' + id).value.trim();
    const ui = $$('.uiT:checked').map(x => x.value.trim()), rules = $$('.rule:checked').map(x => x.value);
    const s = [v('f1') && `${v('f1')}이(가) 쓸`, v('f2') ? `${v('f2')}을(를) 만들어줘.` : '앱을 만들어줘.', v('f3') && `꼭 필요한 기능: ${v('f3')}.`, ui.length && `화면은 ${ui.join(', ')}을(를) 써서 구성해줘.`, rules.length && `지킬 것: ${rules.join(', ')}.`].filter(Boolean).join(' ');
    $('#po').textContent = s;
  };
  $$('.qbtn').forEach(b => b.onclick = () => termDialog(b.dataset.term));
  $('#pf').addEventListener('input', f); $('#pf').addEventListener('change', f); f();
  $('#pc').onclick = (e) => copy($('#po').textContent, e.currentTarget);
}

/* ---------- 안티그래비티 번역표 ---------- */
function pageAnti() {
  main.innerHTML = `<div class="crumb"><a href="#/track/antigravity">🤖 안티그래비티</a> › 화면 번역표</div>
  <h1>🔤 안티그래비티 화면 번역표</h1>
  <p class="muted">안티그래비티는 화면이 영어예요. 이 표를 옆에 띄워 두고 따라 하세요. 메뉴 이름은 업데이트로 바뀔 수 있어요. (2026년 11월, 구글 공식 시작 안내 기준)</p>
  <label class="lb" for="aq">찾기</label><input type="search" id="aq" placeholder="예: Proceed, 계획">
  <table class="tr" style="margin-top:12px"><caption class="sr-only">영어 화면 이름과 뜻</caption><thead><tr><th scope="col">화면에 보이는 말</th><th scope="col">우리말 뜻</th><th scope="col">어디서·언제</th></tr></thead><tbody id="ab"></tbody></table>
  <p class="hint" style="margin-top:14px">💡 모르는 영어가 나오면 그 부분을 캡처해서 제미나이에게 "이 화면 버튼들을 우리말로 설명해줘"라고 물어보세요.</p>`;
  const draw = (k = '') => { k = norm(k); $('#ab').innerHTML = window.ANTI_UI.filter(r => !k || norm(r.join(' ')).includes(k)).map(([a, b, c]) => `<tr><td lang="en">${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join(''); };
  $('#aq').oninput = (e) => draw(e.target.value); draw();
}

/* ---------- 내 배지·합격증 ---------- */
function pageMe() {
  const d = done(), total = QUESTS.length, n = QUESTS.filter(q => d[q.id]).length;
  main.innerHTML = `<h1>🏅 내 배지</h1><p class="muted">기록은 이 기기의 브라우저에만 저장돼요. 로그인이 필요 없어요. (다른 기기에서는 처음부터 보여요)</p>
  <div class="card" style="margin:12px 0"><b>전체 진행: ${n} / ${total} 퀘스트</b><div class="bar" style="margin-top:8px" role="img" aria-label="전체 진행 ${Math.round(n / total * 100)}%"><i style="width:${n / total * 100}%"></i></div></div>
  <div class="grid g3">${window.TRACKS.flatMap(t => t.levels.map(L => { const ok = levelDone(t, L.lv); return `<div class="card" style="text-align:center;${ok ? '' : 'border-style:dashed'}"><div style="font-size:42px" aria-hidden="true">${ok ? t.icon : '🔒'}</div><b>${esc(t.tool)}</b><br>${lvBadge(L.lv)}<p class="small muted" style="margin:6px 0 0">${ok ? '획득!' : `${L.quests.filter(q => d[q.id]).length} / ${L.quests.length}`}</p></div>`; })).join('')}</div>
  <h2 class="sec">📜 합격증</h2>
  <div class="card noprint"><label class="lb" for="nm" style="margin-top:0">합격증에 들어갈 이름</label><input type="text" id="nm" autocomplete="name" value="${esc(store.get('name', ''))}" placeholder="예: 홍길동 선생님"><p class="small muted" style="margin-top:6px">도구 하나의 초급·중급·고급을 모두 깨면 그 도구의 합격증을 인쇄할 수 있어요.</p>
  <div class="row">${window.TRACKS.map(t => { const ok = t.levels.every(L => levelDone(t, L.lv)); return `<button type="button" class="btn${ok ? '' : ' ghost'}" data-cert="${t.id}" ${ok ? '' : 'disabled'}>${t.icon} ${esc(t.tool)} 합격증${ok ? '' : ' (잠김)'}</button>`; }).join('')}</div></div>
  <div id="cert"></div>
  <p class="small muted noprint" style="margin-top:20px"><button type="button" class="btn ghost" id="reset">기록 처음부터 다시 하기</button></p>`;
  $('#nm').oninput = (e) => store.set('name', e.target.value);
  $$('[data-cert]').forEach(b => b.onclick = () => {
    const t = window.TRACKS.find(x => x.id === b.dataset.cert);
    $('#cert').innerHTML = `<div class="cert" style="margin-top:16px"><img src="assets/hyungaman.png" alt=""><h2>합 격 증</h2><p style="font-size:22px"><b>${esc($('#nm').value || '바이브코더')}</b></p><p>위 사람은 형아맨의 바이브코딩 교실에서<br><b>${t.icon} ${esc(t.tool)}</b> 초급·중급·고급 퀘스트를 모두 완료하고<br>「${esc(t.app)}」을(를) 직접 만들었기에 이 증서를 드립니다.</p><p>${new Date().toLocaleDateString('ko-KR')}</p><p><b>형아맨 ⚡ · 달인 연구소</b></p></div><div class="row noprint" style="margin-top:10px"><button class="btn" type="button" onclick="print()">🖨️ 인쇄·PDF 저장</button></div>`;
  });
  $('#reset').onclick = () => { if (confirm('모든 퀘스트 기록을 지울까요?')) { store.set('done', {}); pageMe(); announce('기록을 지웠어요'); } };
}
function pageCoach() {
  main.innerHTML = `<div class="crumb"><a href="#/">홈</a> › 형아맨 코치</div><h1>🧩 형아맨 코치 설치하기</h1>
  <p>«형아맨 코치»는 크롬·엣지에 붙이는 작은 도우미(확장 프로그램)예요. 제미나이·구글 AI 스튜디오 <b>실제 화면 위에서</b> 형아맨이 버튼을 짚어 주고, 퀘스트를 했는지 알아서 확인해 줘요.</p>
  ${coachCard()}
  <h2 class="sec">설치 순서</h2>
  <ol class="steps"><li>위의 [크롬에 설치] 또는 [엣지에 설치]를 눌러요.</li><li>스토어 화면에서 [Chrome에 추가] / [받기]를 눌러요.</li><li>브라우저 오른쪽 위 퍼즐 조각(🧩)을 눌러 <b>형아맨</b>을 고정(📌)해요.</li><li>제미나이(gemini.google.com)를 열고 형아맨 아이콘을 누르면 오른쪽에 코치 창이 열려요.</li></ol>
  <h2 class="sec">무엇을 확인하나요?</h2>
  <ul class="steps"><li>제미나이·AI 스튜디오 화면을 열었는지</li><li>Canvas를 켰는지, 캔버스 결과 화면이 열렸는지</li><li>보낸 프롬프트에 핵심 말이 들어 있는지</li><li>[Preview]·[링크 복사]를 눌렀는지</li></ul>
  <h2 class="sec">개인정보</h2>
  <p>형아맨 코치는 제미나이·AI 스튜디오 두 사이트에서만 동작해요. 보낸 프롬프트 글은 채점을 위해 <b>내 브라우저 안에서만</b> 잠깐 쓰고, 어디로도 보내지 않아요. 로그인 정보, 대화 내용, 파일은 읽지 않아요. <a href="privacy-coach.html">개인정보처리방침 자세히</a></p>`;
}
function notFound() { main.innerHTML = '<h1>페이지를 찾지 못했어요</h1><p><a href="#/">홈으로</a></p>'; }

/* ---------- 라우터 ---------- */
let first = true;
function route(keep) {
  stopSpeak();
  const [path, qs] = location.hash.replace(/^#\/?/, '').split('?'); const params = new URLSearchParams(qs || '');
  const [seg, arg] = path.split('/');
  const R = { play: () => pagePlay(params), coach: pageCoach, '': pageHome, diag: pageDiag, quests: pageQuests, track: () => pageTrack(arg, params), q: () => pageQuest(arg), dict: () => pageDict(params), t: () => pageTerm(arg), prompt: pagePrompt, anti: pageAnti, me: pageMe };
  (R[seg || ''] || notFound)();
  const navKey = { track: 'quests', q: 'quests', diag: 'home', t: 'dict', play: 'dict', anti: 'quests', coach: 'home' }[seg] || seg || 'home';
  $$('[data-nav]').forEach(a => a.dataset.nav === navKey ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const h = $('h1', main); document.title = (h && seg ? h.textContent.trim() + ' · ' : '') + '형아맨의 바이브코딩 교실';
  if (keep === true) return;
  window.scrollTo(0, 0);
  if (!first && h) { h.tabIndex = -1; h.focus({ preventScroll: true }); announce(h.textContent.trim() + ' 화면'); }
  first = false;
}
window.addEventListener('hashchange', route);
route();
})();
