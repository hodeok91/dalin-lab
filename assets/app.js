/* 달인 연구소 — 화면 동작 (빌드 없이 그대로 동작하는 순수 자바스크립트) */
(() => {
'use strict';
const CFG = window.DALIN_CONFIG || {};
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = $('#view');

/* ---------- 브라우저 저장소 (막혀 있어도 동작) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('dalin:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('dalin:' + k, JSON.stringify(v)); } catch {} },
};

/* ---------- 데이터 불러오기 ---------- */
const cache = {};
const getJSON = (p) => cache[p] ||= fetch(p, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(p); return r.json(); }).catch(() => []);
const data = { apps: () => getJSON('data/apps.json').then(l => (l.forEach((a, i) => { a.no ||= 'EXP-' + String(i + 1).padStart(3, '0'); }), l)), posts: () => getJSON('data/posts.json'), downloads: () => getJSON('data/downloads.json'), links: () => getJSON('data/links.json'), changelog: () => getJSON('data/changelog.json') };
const isExternal = (u) => /^https?:\/\//.test(u || '');

/* ---------- Supabase ---------- */
const sb = (CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase) ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
$('#sbDb').textContent = sb ? '● 연결됨' : '● 로컬 모드';
const db = {
  async visit() {
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
    const first = store.get('visitDay') !== today;
    if (sb) {
      if (first) { await sb.rpc('log_visit').then(() => store.set('visitDay', today), () => {}); }
      const { data: s } = await sb.rpc('visit_stats');
      if (s) return { today: s.today ?? s[0]?.today, total: s.total ?? s[0]?.total };
    }
    // 로컬 모드: 이 브라우저 기준
    const loc = store.get('localVisits', { total: 0, day: '', today: 0 });
    if (first) { loc.total++; loc.today = loc.day === today ? loc.today + 1 : 1; loc.day = today; store.set('localVisits', loc); store.set('visitDay', today); }
    return { today: loc.day === today ? loc.today : 0, total: loc.total, local: true };
  },
  async click(id) {
    if (sb) { sb.rpc('count_click', { p_app: id }).then(() => {}, () => {}); return; }
    const c = store.get('localClicks', {}); c[id] = (c[id] || 0) + 1; store.set('localClicks', c);
  },
  async clicks() {
    if (sb) { const { data: rows } = await sb.from('app_clicks').select('app_id,count').order('count', { ascending: false }).limit(100); return Object.fromEntries((rows || []).map(r => [r.app_id, r.count])); }
    return store.get('localClicks', {});
  },
  async feedback(post = null, limit = 50) {
    if (!sb) return null;
    let q = sb.from('feedback').select('id,name,category,content,reply,created_at,post_slug').order('created_at', { ascending: false }).limit(limit);
    q = post ? q.eq('post_slug', post) : q.is('post_slug', null);
    const { data: rows, error } = await q; if (error) throw error; return rows;
  },
  async write(row) {
    if (!sb) throw new Error('게시판이 아직 연결되지 않았어요.');
    const { error } = await sb.from('feedback').insert(row); if (error) throw error;
  },
};

/* ---------- 테마 ---------- */
const setTheme = (t) => {
  document.documentElement.dataset.theme = t; $('meta[name=theme-color]').content = t === 'light' ? '#ffffff' : '#1f1f1f'; store.set('theme', t);
  const b = $('#themeBtn'); b.setAttribute('aria-pressed', String(t === 'dark')); b.querySelector('[aria-hidden]').textContent = t === 'dark' ? '☀️' : '🌙';
  const pd = $('#a11yDark'); if (pd) pd.checked = t === 'dark';
};
setTheme(store.get('theme', 'light'));  // 기본은 밝은 화면 (PC·모바일 동일), 다크 모드는 버튼으로
$('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

/* ---------- 공지 ---------- */
if (CFG.notice) { $('#notice').hidden = false; $('#notice').textContent = CFG.notice; }

/* ---------- 모달 ---------- */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,[tabindex]:not([tabindex="-1"])';
let lastFocus = null;
const modal = {
  open(html) {
    lastFocus = document.activeElement;
    $('#modalBody').innerHTML = html; $('#modal').hidden = false;
    const h = $('#modalBody h2, #modalBody h3'); if (h) h.id = 'modalTitle';
    const first = $$(FOCUSABLE, $('#modalBody'))[0] || $('#modalClose'); first.focus();
  },
  close() { if ($('#modal').hidden) return; $('#modal').hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); },
};
function trapFocus(e, box) {
  if (e.key !== 'Tab') return;
  const f = $$(FOCUSABLE, box).filter(el => el.offsetParent !== null); if (!f.length) return;
  const a = f[0], z = f[f.length - 1];
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
  else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
}
$('#modal').addEventListener('keydown', (e) => trapFocus(e, $('#modal .modal-box')));
const announce = (msg) => { const l = $('#live'); l.textContent = ''; setTimeout(() => { l.textContent = msg; }, 60); };
$('#modalClose').onclick = modal.close;
$('#modal').onclick = (e) => { if (e.target.id === 'modal') modal.close(); };

/* ---------- 즐겨찾기 ---------- */
const favs = { list: () => store.get('favs', []), has: (id) => favs.list().includes(id),
  toggle(id) { const l = favs.list(); const i = l.indexOf(id); i < 0 ? l.push(id) : l.splice(i, 1); store.set('favs', l); renderFavs(); } };
async function renderFavs() {
  const apps = await data.apps(); const l = favs.list().map(id => apps.find(a => a.id === id)).filter(Boolean);
  $('#favList').innerHTML = l.length ? l.map(a => `<a href="${esc(a.url)}" data-app="${esc(a.id)}" ${isExternal(a.url) ? 'target="_blank" rel="noopener"' : ''}>${a.icon} ${esc(a.name)}</a>`).join('') : '<p class="muted small">앱 카드의 ☆을 누르면 여기에 모여요</p>';
}

/* ---------- 시계 ---------- */
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
function tick() {
  const d = new Date();
  const still = document.documentElement.classList.contains('a11y-motion');
  const hm = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', ...(still ? {} : { second: '2-digit' }), hour12: false, timeZone: 'Asia/Seoul' });
  $('#sbClock').textContent = hm.slice(0, 5);
  const c = $('#wClock'); if (c) c.textContent = hm;
}
setInterval(tick, 1000); tick();

/* ---------- 날씨 (Open-Meteo, 키 필요 없음) ---------- */
const WMO = { 0: ['☀️', '맑음'], 1: ['🌤️', '대체로 맑음'], 2: ['⛅', '구름 조금'], 3: ['☁️', '흐림'], 45: ['🌫️', '안개'], 48: ['🌫️', '안개'], 51: ['🌦️', '이슬비'], 53: ['🌦️', '이슬비'], 55: ['🌦️', '이슬비'], 61: ['🌧️', '비'], 63: ['🌧️', '비'], 65: ['🌧️', '강한 비'], 66: ['🌧️', '어는 비'], 67: ['🌧️', '어는 비'], 71: ['🌨️', '눈'], 73: ['🌨️', '눈'], 75: ['❄️', '많은 눈'], 77: ['🌨️', '싸락눈'], 80: ['🌦️', '소나기'], 81: ['🌦️', '소나기'], 82: ['⛈️', '강한 소나기'], 85: ['🌨️', '눈 소나기'], 86: ['🌨️', '눈 소나기'], 95: ['⛈️', '뇌우'], 96: ['⛈️', '뇌우'], 99: ['⛈️', '뇌우'] };
const pmGrade = (v) => v == null ? ['–', ''] : v <= 30 ? ['좋음', '#3fb950'] : v <= 80 ? ['보통', '#3794ff'] : v <= 150 ? ['나쁨', '#d29922'] : ['매우 나쁨', '#f85149'];
async function loadWeather() {
  const loc = store.get('loc', CFG.defaultLocation || { name: '서울', lat: 37.5665, lon: 126.978 });
  const box = $('#wWeather') || document.createElement('div');
  try {
    const q = `latitude=${loc.lat}&longitude=${loc.lon}&timezone=Asia%2FSeoul`;
    const [w, a] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=2`).then(r => r.json()),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=pm10,pm2_5`).then(r => r.json()).catch(() => ({})),
    ]);
    const [ico, txt] = WMO[w.current.weather_code] || ['🌡️', ''];
    const [g10, c10] = pmGrade(a.current?.pm10);
    box.innerHTML = `<div class="w-big">${ico} ${Math.round(w.current.temperature_2m)}°</div>
      <div class="w-sub">${txt} · 최고 ${Math.round(w.daily.temperature_2m_max[0])}° / 최저 ${Math.round(w.daily.temperature_2m_min[0])}° · 비 ${w.daily.precipitation_probability_max[0] ?? 0}%</div>
      <div class="w-sub">미세먼지 <b style="color:${c10}">${g10}</b> · 내일 ${Math.round(w.daily.temperature_2m_max[1])}° 비 ${w.daily.precipitation_probability_max[1] ?? 0}%</div>`;
    $('#sbWeather').textContent = `${ico} ${Math.round(w.current.temperature_2m)}° ${loc.name}`;
  } catch { box.innerHTML = '<div class="w-sub">날씨를 불러오지 못했어요.</div>'; }
}
function pickLocation() {
  if (!navigator.geolocation) return alertBox('이 브라우저는 위치 찾기를 지원하지 않아요.');
  navigator.geolocation.getCurrentPosition(p => { store.set('loc', { name: '내 위치', lat: +p.coords.latitude.toFixed(3), lon: +p.coords.longitude.toFixed(3) }); loadWeather(); $('#wLocName').textContent = '내 위치'; },
    () => alertBox('위치 권한이 허용되지 않아 기본 지역으로 보여 드려요.'));
}

/* ---------- 급식 (NEIS 교육정보 개방 포털, 키 없이 가능) ---------- */
const ymd = (d = new Date()) => d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replaceAll('-', '');
const cleanDish = (s) => s.split(/<br\s*\/?>/i).map(x => x.replace(/\([\d.\s]+\)/g, '').replace(/[\d.]+$/, '').replace(/\*/g, '').trim()).filter(Boolean);
async function loadMeal() {
  const box = $('#wMeal'); if (!box) return;
  const sc = store.get('school', CFG.defaultSchool || {});
  $('#wSchool').textContent = sc.name || '학교 미설정';
  if (!sc.code) { box.innerHTML = '<div class="w-sub"><b>학교 설정</b> 버튼을 누르면 우리 학교 오늘 급식이 보여요.</div>'; return; }
  try {
    const r = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=5&ATPT_OFCDC_SC_CODE=${sc.office}&SD_SCHUL_CODE=${sc.code}&MLSV_YMD=${ymd()}`).then(r => r.json());
    const rows = r.mealServiceDietInfo?.[1]?.row || [];
    const lunch = rows.find(x => x.MMEAL_SC_NM === '중식') || rows[0];
    box.innerHTML = lunch ? `<ul class="meal-list">${cleanDish(lunch.DDISH_NM).map(d => `<li>${esc(d)}</li>`).join('')}</ul><div class="w-sub">${esc(lunch.MMEAL_SC_NM)} · ${esc(lunch.CAL_INFO || '')}</div>` : '<div class="w-sub">오늘은 급식 정보가 없어요 🍙</div>';
  } catch { box.innerHTML = '<div class="w-sub">급식을 불러오지 못했어요.</div>'; }
}
function schoolDialog() {
  modal.open(`<h2 class="h-modal">🏫 우리 학교 설정</h2><p class="muted small">학교 이름 일부를 입력하고 찾기 버튼을 누르세요. 이 브라우저에만 저장돼요.</p>
    <form class="searchbox" id="scForm"><label for="scQ" class="sr-only">학교 이름</label><input id="scQ" placeholder="예: 명현학교" autocomplete="off" required><button class="btn">찾기</button></form><div id="scRes" aria-live="polite"></div>`);
  $('#scForm').onsubmit = async (e) => {
    e.preventDefault(); const res = $('#scRes'); res.innerHTML = '<p class="muted">찾는 중…</p>';
    try {
      const r = await fetch(`https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=30&SCHUL_NM=${encodeURIComponent($('#scQ').value.trim())}`).then(r => r.json());
      const rows = r.schoolInfo?.[1]?.row || [];
      res.innerHTML = rows.length ? `<div class="grid" style="margin-top:8px">${rows.map((s, i) => `<button class="btn ghost" data-i="${i}" style="justify-content:space-between"><span>${esc(s.SCHUL_NM)}</span><small class="muted">${esc(s.ATPT_OFCDC_SC_NM)} · ${esc(s.SCHUL_KND_SC_NM)}</small></button>`).join('')}</div>` : '<p class="muted">검색 결과가 없어요.</p>';
      $$('button[data-i]', res).forEach(b => b.onclick = () => { const s = rows[b.dataset.i]; store.set('school', { name: s.SCHUL_NM, office: s.ATPT_OFCDC_SC_CODE, code: s.SD_SCHUL_CODE }); modal.close(); loadMeal(); });
    } catch { res.innerHTML = '<p class="muted">학교 정보를 불러오지 못했어요.</p>'; }
  };
}

/* ---------- D-Day ---------- */
function renderDday() {
  const box = $('#wDday'); if (!box) return;
  const d = store.get('dday', CFG.defaultDday || { label: '방학', date: '' });
  if (!d.date) { box.innerHTML = '<div class="w-sub">설정을 눌러 날짜를 정하세요.</div>'; return; }
  const today = new Date(new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }));
  const diff = Math.round((new Date(d.date) - today) / 864e5);
  box.innerHTML = `<div class="w-big">${diff > 0 ? 'D-' + diff : diff === 0 ? 'D-Day 🎉' : 'D+' + (-diff)}</div><div class="w-sub">${esc(d.label)} · ${esc(d.date)}</div>`;
}
function ddayDialog() {
  const d = store.get('dday', CFG.defaultDday || {});
  modal.open(`<h2 class="h-modal">📅 D-Day 설정</h2><form id="ddForm" class="post-form"><label for="ddL">이름</label><input id="ddL" placeholder="예: 겨울방학" value="${esc(d.label || '')}" required><label for="ddD">날짜</label><input id="ddD" type="date" value="${esc(d.date || '')}" required><button class="btn">저장</button></form>`);
  $('#ddForm').onsubmit = (e) => { e.preventDefault(); store.set('dday', { label: $('#ddL').value, date: $('#ddD').value }); modal.close(); renderDday(); };
}
function alertBox(msg) { modal.open(`<h2 class="h-modal">알림</h2><p role="alert">${esc(msg)}</p><button type="button" class="btn" data-close>확인</button>`); }

/* ---------- 앱 카드 ---------- */
const STATUS = { live: ['실험 완료 · 사용 가능', 'st-live'], soon: ['실험 중', 'st-soon'] };
const thumb = (a, cls = 'app-ico') => a.image ? `<img class="${cls} img" src="${esc(a.image)}" alt="" loading="lazy">` : `<div class="${cls}">${a.icon || '🧪'}</div>`;
const launchBtn = (a, label = '실행하기') => a.status === 'live' && a.url ? `<a class="btn" href="${esc(a.url)}" data-app="${esc(a.id)}" aria-label="${esc(a.name)} ${label}" ${isExternal(a.url) ? 'target="_blank" rel="noopener"' : ''}>${label}</a>` : '<span class="btn" aria-disabled="true">실험 중<span class="sr-only"> (아직 사용할 수 없음)</span></span>';
function appCard(a, clicks = {}) {
  const [st, cls] = STATUS[a.status] || STATUS.live;
  const open = launchBtn(a, a.launchLabel || '실행하기') + `<a class="btn ghost" href="#/app/${esc(a.id)}" aria-label="${esc(a.name)} 자세히 보기">자세히</a>`;
  const extra = (a.links || []).map(l => `<a class="btn ghost" href="${esc(l.url)}" data-app="${esc(a.id)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  return `<article class="card app-card">
    <button type="button" class="fav-btn ${favs.has(a.id) ? 'on' : ''}" data-fav="${esc(a.id)}" aria-pressed="${favs.has(a.id)}" aria-label="${esc(a.name)} 즐겨찾기">${favs.has(a.id) ? '★' : '☆'}</button>
    <div class="top">${thumb(a)}<div><span class="exp-no">${esc(a.no)}</span><h2 class="card-h"><a class="plain" href="#/app/${esc(a.id)}">${esc(a.name)}</a></h2>
    <div class="meta"><span class="tag">${esc(a.type || '웹앱')}</span><span class="tag">${esc(a.category || '')}</span><span class="${cls}">● ${st}</span>${clicks[a.id] ? `<span class="muted">· ${clicks[a.id].toLocaleString()}회 사용</span>` : ''}</div></div></div>
    <p>${esc(a.desc)}</p><div class="actions">${open}${extra}</div></article>`;
}
// 앱 클릭 집계 + 즐겨찾기 (화면 전체에 한 번만 연결)
document.addEventListener('click', (e) => {
  const f = e.target.closest('[data-fav]'); if (f) { e.preventDefault(); favs.toggle(f.dataset.fav); const on = favs.has(f.dataset.fav); f.classList.toggle('on', on); f.setAttribute('aria-pressed', String(on)); announce(on ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 뺐어요'); f.textContent = f.classList.contains('btn') ? (on ? '★ 즐겨찾기됨' : '☆ 즐겨찾기') : (on ? '★' : '☆'); return; }
  const a = e.target.closest('a[data-app]'); if (a) db.click(a.dataset.app);
});

/* ---------- 화면: 홈 ---------- */
async function pageHome() {
  const [apps, posts, links, clicks] = await Promise.all([data.apps(), data.posts(), data.links(), db.clicks().catch(() => ({}))]);
  const live = apps.filter(a => a.status === 'live');
  const top = [...live].sort((x, y) => (clicks[y.id] || 0) - (clicks[x.id] || 0) || (y.featured ? 1 : 0) - (x.featured ? 1 : 0)).slice(0, 5);
  const tags = [...new Set(apps.flatMap(a => a.tags || []))].slice(0, 6);
  view.innerHTML = `<div class="wrap">
  <section class="hero">
    <div>
      <span class="eyebrow">LAB OPEN · 명현학교 특수교사가 직접 만든 교육용 앱 연구소</span>
      <h1>교실의 불편함을 실험하고<br>해결하는 <span class="hl">달인 연구소</span></h1>
      <p class="lead">현장에서 생긴 불편함을 연구 과제로 삼아, 교실에서 바로 쓰는 웹앱과 프로그램으로 만듭니다. 실험 과정과 배운 점은 연구 노트로 나눠요.</p>
      <form class="searchbox" id="homeSearch" role="search"><label for="homeQ" class="sr-only">실험(앱) 찾기</label><input id="homeQ" placeholder="어떤 실험(앱)이 필요하세요? (예: 급식, 평가, 게임)"><button class="btn">찾기</button></form>
      <div class="chips"><span class="muted small" style="margin-right:4px">많이 찾는 말</span>${tags.map(t => `<a class="chip" href="#/apps?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div>
    </div>
    <div class="lab-hero" aria-label="연구소장">
      <div class="bubble">오늘은 어떤 실험을 해 볼까요?<br><small>공개 실험 <b>${live.length}</b>개 · 연구 노트 <b>${posts.length}</b>편</small></div>
      <img src="assets/character/director-full.png" alt="달인 연구소장 캐릭터" class="director">
      <div class="lab-badge"><img src="assets/character/director-face.png" alt=""><div><b>달인 연구소장</b><span>지호덕 · 명현학교 특수교사</span></div></div>
    </div>
  </section>

  <section class="today" aria-label="오늘 정보">
    <div class="card"><div class="w-title"><span>🕘 오늘</span></div><div class="w-big mono" id="wClock">--:--:--</div>
      <div class="w-sub">${new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric' })} (${DAYS[new Date().getDay()]})</div></div>
    <div class="card"><div class="w-title"><span>🌤 날씨 · <span id="wLocName">${esc(store.get('loc', CFG.defaultLocation || {}).name || '서울')}</span></span><button id="locBtn">📍 내 위치</button></div><div id="wWeather"><div class="w-sub">불러오는 중…</div></div></div>
    <div class="card"><div class="w-title"><span>🍱 오늘 급식 · <span id="wSchool"></span></span><button id="schoolBtn">학교 설정</button></div><div id="wMeal"><div class="w-sub">불러오는 중…</div></div></div>
    <div class="card"><div class="w-title"><span>📅 D-Day</span><button id="ddayBtn">설정</button></div><div id="wDday"></div></div>
  </section>

  <section class="stat-row">
    <div class="card stat"><b id="stToday">–</b><span>오늘 방문 연구원</span></div>
    <div class="card stat"><b id="stTotal">–</b><span>누적 방문 연구원</span></div>
    <div class="card stat"><b>${live.length}</b><span>완료된 실험(앱)</span></div>
    <div class="card stat"><b>${posts.length}</b><span>연구 노트</span></div>
  </section>
  <p class="muted small" id="stNote" hidden>* 게시판·방문자 서버를 연결하기 전이라 이 브라우저 기준 숫자예요.</p>

  <div class="h-sec"><h2>인기 실험 TOP 5</h2><a href="#/apps">전체 보기 →</a></div>
  <div class="rank">${top.map(a => `<a href="#/app/${esc(a.id)}">${thumb(a, 'rank-ico')}<span><b>${esc(a.name)}</b><br><span class="muted small">${esc(a.desc)}</span></span><small>${clicks[a.id] ? clicks[a.id].toLocaleString() + '회' : esc(a.type)}</small></a>`).join('')}</div>

  <div class="h-sec"><h2>최신 연구 노트</h2><a href="#/insights">모든 노트 →</a></div>
  <div class="grid g3">${[...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(postCard).join('') || '<div class="empty">곧 첫 글이 올라와요</div>'}</div>

  <div class="h-sec"><h2>연구 제안함</h2><a href="#/board">제안하기 →</a></div>
  <div id="homeBoard" class="feed" style="margin-top:0"></div>

  <div class="h-sec"><h2>연구원 즐겨찾기 사이트</h2></div>
  <div class="chips">${links.map(l => `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener">${l.icon || '🔗'} ${esc(l.name)}</a>`).join('')}</div>
  </div>`;
  $('#homeSearch').onsubmit = (e) => { e.preventDefault(); location.hash = '#/apps?q=' + encodeURIComponent($('#homeQ').value.trim()); };
  $('#locBtn').onclick = pickLocation; $('#schoolBtn').onclick = schoolDialog; $('#ddayBtn').onclick = ddayDialog;
  tick(); loadWeather(); loadMeal(); renderDday();
  visitPromise.then(v => { $('#stToday').textContent = (v.today ?? 0).toLocaleString(); $('#stTotal').textContent = (v.total ?? 0).toLocaleString(); $('#stNote').hidden = !v.local; });
  renderFeed($('#homeBoard'), null, 3);
}

/* ---------- 화면: 앱 ---------- */
async function pageApps(params) {
  const [apps, clicks] = await Promise.all([data.apps(), db.clicks().catch(() => ({}))]);
  const cats = ['전체', ...new Set(apps.map(a => a.category).filter(Boolean))];
  let cat = params.get('c') || '전체', q = params.get('q') || '', sort = store.get('appSort', 'pop');
  view.innerHTML = `<div class="wrap"><h1>🧪 실험실</h1><p class="muted">연구소에서 만든 앱(실험)들이에요. 카드를 누르면 소개가 먼저 열리고, 웹앱은 바로 실행하거나 프로그램은 내려받을 수 있어요. ☆로 즐겨찾기 해 두세요.</p>
    <div class="searchbox" role="search"><label for="aq" class="sr-only">실험 이름, 설명, 태그로 찾기</label><input id="aq" placeholder="앱 이름, 설명, 태그로 찾기" value="${esc(q)}"><label for="as" class="sr-only">정렬</label><select id="as" style="width:auto"><option value="pop">많이 쓴 순</option><option value="new">최신 순</option><option value="name">이름 순</option></select></div>
    <div class="chips" id="ac" role="group" aria-label="분류">${cats.map(c => `<button type="button" class="chip ${c === cat ? 'on' : ''}" aria-pressed="${c === cat}" data-c="${esc(c)}">${esc(c)} <span class="muted">${c === '전체' ? apps.length : apps.filter(a => a.category === c).length}</span></button>`).join('')}</div>
    <p id="alCount" class="sr-only" aria-live="polite"></p><div class="grid g2" id="al" style="margin-top:16px"></div></div>`;
  $('#as').value = sort;
  const draw = () => {
    const k = q.toLowerCase();
    let l = apps.filter(a => (cat === '전체' || a.category === cat) && (!k || [a.name, a.desc, a.type, a.category, ...(a.tags || [])].join(' ').toLowerCase().includes(k)));
    l.sort(sort === 'new' ? (x, y) => (y.added || '').localeCompare(x.added || '') : sort === 'name' ? (x, y) => x.name.localeCompare(y.name, 'ko') : (x, y) => (y.status === 'live') - (x.status === 'live') || (clicks[y.id] || 0) - (clicks[x.id] || 0));
    $('#al').innerHTML = l.map(a => appCard(a, clicks)).join('') || '<div class="empty">찾는 실험이 없나요? <a href="#/board">연구 제안함에 요청</a>해 주세요.</div>';
    $('#alCount').textContent = `실험 ${l.length}개`;
  };
  $('#aq').oninput = (e) => { q = e.target.value; draw(); };
  $('#as').onchange = (e) => { sort = e.target.value; store.set('appSort', sort); draw(); };
  $('#ac').onclick = (e) => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('#ac .chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); }); draw(); };
  draw();
}


/* ---------- 화면: 앱(실험) 상세 — 소개가 먼저 ---------- */
async function pageApp(id) {
  const [apps, clicks] = await Promise.all([data.apps(), db.clicks().catch(() => ({}))]);
  const a = apps.find(x => x.id === id); if (!a) return notFound();
  setTab(a.no + '.lab'); document.title = a.name + ' · 달인 연구소';
  const [st, cls] = STATUS[a.status] || STATUS.live;
  const extra = (a.links || []).map(l => `<a class="btn ghost" href="${esc(l.url)}" data-app="${esc(a.id)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  view.innerHTML = `<div class="wrap" style="max-width:900px"><a href="#/apps">← 실험실</a>
  <section class="detail-head card">${thumb(a, 'detail-ico')}<div style="flex:1;min-width:220px">
    <span class="exp-no">${esc(a.no)} · ${esc(a.category || '')}</span><h1 style="margin:2px 0 6px">${esc(a.name)}</h1>
    <div class="meta"><span class="tag">${esc(a.type || '웹앱')}</span><span class="${cls}">● ${st}</span>${clicks[a.id] ? `<span class="muted small">· ${clicks[a.id].toLocaleString()}회 사용</span>` : ''}${a.added ? `<span class="muted small">· ${esc(a.added)} 공개</span>` : ''}</div>
    <p style="margin:10px 0 14px">${esc(a.desc)}</p>
    <div class="actions" style="display:flex;gap:6px;flex-wrap:wrap">${launchBtn(a, a.launchLabel || (a.type && /Windows|Android|설치/.test(a.type) ? '내려받기' : '실행하기'))}${extra}<button class="btn ghost" data-fav="${esc(a.id)}">${favs.has(a.id) ? '★ 즐겨찾기됨' : '☆ 즐겨찾기'}</button></div></div></section>
  ${(a.screenshots || []).length ? `<div class="h-sec"><h2>실험 화면</h2></div><div class="shots">${a.screenshots.map(u => `<img src="${esc(u)}" alt="${esc(a.name)} 화면" loading="lazy">`).join('')}</div>` : ''}
  ${(a.features || []).length ? `<div class="h-sec"><h2>무엇을 하나요</h2></div><ul class="feat">${a.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
  ${(a.howto || []).length ? `<div class="h-sec"><h2>사용 순서</h2></div><ol class="feat">${a.howto.map(f => `<li>${esc(f)}</li>`).join('')}</ol>` : ''}
  ${(a.tags || []).length ? `<div class="chips" style="margin-top:20px">${a.tags.map(t => `<a class="chip" href="#/apps?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}
  <div class="h-sec"><h2>사용 후기 · 질문</h2></div>${commentForm('app:' + a.id)}<div class="feed" id="cm"></div></div>`;
  bindForm('app:' + a.id, $('#cm')); renderFeed($('#cm'), 'app:' + a.id);
}

/* ---------- 화면: 인사이트 ---------- */
const postCard = (p) => `<a class="card post-card" href="#/post/${esc(p.slug)}"><div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : (p.emoji || '📓')}</div><span class="muted small">${esc(p.date)} · ${(p.tags || []).map(esc).join(' · ')}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></a>`;
async function pageInsights(params) {
  const posts = [...await data.posts()].sort((a, b) => b.date.localeCompare(a.date));
  const tags = ['전체', ...new Set(posts.flatMap(p => p.tags || []))];
  let tag = params.get('t') || '전체';
  view.innerHTML = `<div class="wrap"><h1>📓 연구 노트</h1><p class="muted">실험(앱)을 만들고 수업에 적용하며 배운 것, 바이브코딩 팁을 기록합니다.</p>
    <div class="chips" id="tc" role="group" aria-label="주제">${tags.map(t => `<button type="button" class="chip ${t === tag ? 'on' : ''}" aria-pressed="${t === tag}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="grid g3" id="pl" style="margin-top:16px"></div></div>`;
  const draw = () => { $('#pl').innerHTML = posts.filter(p => tag === '전체' || (p.tags || []).includes(tag)).map(postCard).join('') || '<div class="empty">아직 글이 없어요</div>'; };
  $('#tc').onclick = (e) => { const b = e.target.closest('[data-t]'); if (!b) return; tag = b.dataset.t; $$('#tc .chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); }); draw(); };
  draw();
}
async function pagePost(slug) {
  const p = (await data.posts()).find(x => x.slug === slug);
  if (!p) return notFound();
  setTab(p.slug + '.md');
  view.innerHTML = `<article class="article"><a href="#/insights">← 연구 노트</a><h1>${esc(p.title)}</h1><div class="meta">${esc(p.date)} · ${(p.tags || []).map(esc).join(' · ')}</div><div class="md" id="md">불러오는 중…</div>
    <div class="h-sec"><h2>댓글</h2></div>${commentForm(slug)}<div class="feed" id="cm"></div></article>`;
  try {
    const md = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' }).then(r => { if (!r.ok) throw 0; return r.text(); });
    const html = window.marked ? window.marked.parse(md) : `<pre>${esc(md)}</pre>`;
    $('#md').innerHTML = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+=/gi, ' data-x=');
    $$('#md a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
  } catch { $('#md').innerHTML = '<p class="muted">글을 불러오지 못했어요.</p>'; }
  bindForm(slug, $('#cm')); renderFeed($('#cm'), slug);
}

/* ---------- 게시판·댓글 ---------- */
const CATS = ['앱 요청', '오류 제보', '건의', '응원'];
const commentForm = (slug) => sb ? `<form class="post-form card" id="fbForm" novalidate>
  <div class="row"><div><label for="fbName">이름 <span class="req">(필수)</span></label><input id="fbName" name="name" maxlength="20" autocomplete="nickname" placeholder="별명도 괜찮아요" value="${esc(store.get('myName', ''))}" required aria-describedby="fbErr"></div>${slug ? '' : `<div><label for="fbCat">종류</label><select id="fbCat" name="category">${CATS.map(c => `<option>${c}</option>`).join('')}</select></div>`}</div>
  <label for="fbText">${slug ? '내용' : '제안 내용'} <span class="req">(필수, 2~1000자)</span></label>
  <textarea id="fbText" name="content" rows="4" maxlength="1000" required aria-describedby="fbErr fbNote" placeholder="${slug ? '이 글에 대한 생각을 남겨 주세요' : '불편한 점, 필요한 앱, 오류 상황(기기·누른 버튼·기대한 결과)을 적어 주세요'}" required></textarea>
  <input name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="muted small" id="fbNote">학생 이름 등 개인정보는 적지 마세요. 모두에게 공개돼요.</span><button class="btn">등록</button></div><p id="fbErr" class="form-err" role="alert"></p></form>`
  : `<div class="empty">게시판 서버를 연결하면 여기서 바로 글을 남길 수 있어요.<br>지금은 <a href="https://github.com/hodeok91/dalin-lab/issues/new" target="_blank" rel="noopener">GitHub 건의</a>${CFG.email ? ` 또는 <a href="mailto:${esc(CFG.email)}">이메일</a>` : ''}로 보내 주세요.</div>`;
function bindForm(slug, feedEl) {
  const f = $('#fbForm'); if (!f) return;
  f.onsubmit = async (e) => {
    e.preventDefault(); const fd = new FormData(f);
    if (fd.get('website')) return; // 스팸 봇
    const err = $('#fbErr'); err.textContent = '';
    const nm = String(fd.get('name') || '').trim(), ct = String(fd.get('content') || '').trim();
    if (!nm) { err.textContent = '이름을 입력해 주세요.'; $('#fbName').setAttribute('aria-invalid', 'true'); $('#fbName').focus(); return; }
    if (ct.length < 2) { err.textContent = '내용을 2자 이상 입력해 주세요.'; $('#fbText').setAttribute('aria-invalid', 'true'); $('#fbText').focus(); return; }
    $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid'));
    const last = store.get('lastPost', 0); if (Date.now() - last < 30000) { $('#fbErr').textContent = '30초 뒤에 다시 등록할 수 있어요.'; return; }
    const btn = $('button', f); btn.disabled = true;
    try {
      await db.write({ name: String(fd.get('name')).trim().slice(0, 20), category: slug ? '댓글' : fd.get('category'), content: String(fd.get('content')).trim().slice(0, 1000), post_slug: slug || null });
      store.set('lastPost', Date.now()); store.set('myName', nm); f.reset(); $('#fbName').value = nm; announce('등록했어요'); renderFeed(feedEl, slug);
    } catch (er) { $('#fbErr').textContent = '등록하지 못했어요: ' + (er.message || er); }
    btn.disabled = false;
  };
}
const ago = (t) => { const s = (Date.now() - new Date(t)) / 1000; return s < 60 ? '방금' : s < 3600 ? Math.floor(s / 60) + '분 전' : s < 86400 ? Math.floor(s / 3600) + '시간 전' : new Date(t).toLocaleDateString('ko-KR'); };
async function renderFeed(el, slug, limit = 50) {
  if (!el) return;
  if (!sb) { if (!slug && limit < 50) el.innerHTML = '<div class="empty">게시판이 열리면 최근 글이 여기에 보여요. <a href="#/board">게시판 가기</a></div>'; return; }
  el.innerHTML = '<p class="muted">불러오는 중…</p>';
  try {
    const rows = await db.feedback(slug, limit);
    el.innerHTML = rows.length ? rows.map(m => `<div class="msg"><div class="who"><b>${esc(m.name)}</b>${m.category && m.category !== '댓글' ? `<span class="tag">${esc(m.category)}</span>` : ''}<span>${ago(m.created_at)}</span>${m.reply ? '<span class="st-live">● 답변 완료</span>' : ''}</div><p class="text">${esc(m.content)}</p>${m.reply ? `<div class="reply"><b><img src="assets/character/director-face.png" alt="" class="av"> 연구소장 답변</b>\n${esc(m.reply)}</div>` : ''}</div>`).join('') : '<div class="empty"><img src="assets/character/director-face.png" alt="" class="av-lg"><br>첫 제안을 기다리고 있어요!</div>';
  } catch { el.innerHTML = '<div class="empty">글을 불러오지 못했어요.</div>'; }
}
function pageBoard() {
  view.innerHTML = `<div class="wrap" style="max-width:820px"><h1>📮 연구 제안함</h1><p class="muted">찾는 앱이 없나요? 교실의 불편함을 적어 주시면 다음 연구 과제로 삼을게요. 오류는 화면 캡처·기기·누른 버튼·기대한 결과를 함께 적어 주세요.</p>
    ${commentForm(null)}<div class="feed" id="bf"></div></div>`;
  bindForm(null, $('#bf')); renderFeed($('#bf'), null);
}

/* ---------- 화면: 다운로드 ---------- */
async function pageDownloads() {
  const l = await data.downloads();
  view.innerHTML = `<div class="wrap"><h1>📦 자료 보관함</h1><p class="muted">Windows 설치파일(exe), 안드로이드(apk), 압축 파일을 받는 곳이에요. 파일은 GitHub Releases에 안전하게 보관돼요.</p>
  <div class="grid g2" style="margin-top:16px">${l.map(d => { const [st, cls] = STATUS[d.status] || STATUS.live; return `<article class="card app-card"><div class="top"><div class="app-ico">${d.icon || '📦'}</div><div><h3>${esc(d.name)}</h3><div class="meta"><span class="tag">${esc(d.type)}</span>${d.version ? `<span class="tag">v${esc(d.version)}</span>` : ''}<span class="${cls}">● ${st}</span></div></div></div><p>${esc(d.desc)}</p>
  <div class="actions"><a class="btn" href="${esc(d.url)}" target="_blank" rel="noopener" data-app="dl-${esc(d.name)}">내려받기</a>${d.guide ? `<a class="btn ghost" href="${esc(d.guide)}">사용 방법</a>` : ''}</div></article>`; }).join('')}</div></div>`;
}

/* ---------- 화면: 기록·소개 ---------- */
async function pageChangelog() {
  const l = await data.changelog();
  view.innerHTML = `<div class="wrap" style="max-width:760px"><h1>🗒️ 연구 일지</h1><p class="muted">달인 연구소와 달인시리즈가 어떻게 바뀌어 왔는지 적어 둡니다.</p><div class="timeline" style="margin-top:24px">${l.map(c => `<div class="item"><span class="muted small mono">${esc(c.date)}</span><h3 style="margin:2px 0 6px">${esc(c.title)}</h3><ul style="margin:0;padding-left:18px">${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}
const FAQ = [
  ['처음 무엇을 보면 되나요?', '홈의 "많이 쓰는 앱"부터 눌러 보세요. 바이브코딩이 궁금하면 바이브코딩 용어사전과 인사이트 글을 추천해요.'],
  ['설치파일은 어디서 받나요?', '📦 다운로드 메뉴에서 받아요. 파일은 GitHub Releases에 보관돼 있어요.'],
  ['오류는 어떻게 보내나요?', '💬 게시판에 화면 캡처, 기기, 누른 버튼, 기대한 결과를 함께 적어 주세요.'],
  ['새 기능을 요청하고 싶어요.', '게시판에 "앱 요청"으로 불편한 점을 적어 주세요. 다음 앱의 씨앗이 됩니다.'],
  ['학생 정보를 넣어도 되나요?', '게시판과 댓글은 모두에게 공개돼요. 학생 이름 등 개인정보는 적지 마세요. 앱마다 저장 방식은 각 앱 안내를 확인해 주세요.'],
];
function pageAbout() {
  view.innerHTML = `<div class="wrap" style="max-width:820px"><h1>👨‍🔬 연구소장 소개</h1>
  <div class="card" style="margin-top:16px;display:flex;gap:18px;align-items:center;flex-wrap:wrap"><img src="assets/character/director-face.png" alt="연구소장" style="width:96px;height:96px;border-radius:50%;background:var(--panel2)">
  <div style="flex:1;min-width:220px"><h2 style="font-size:20px">달인 연구소장 · 지호덕</h2><span class="muted small">명현학교 특수교사 · 바이브코딩 연구원</span><p class="muted" style="margin:4px 0 10px">교실의 불편함을 코딩으로 풀어 보는 선생님. 교사와 학생이 바로 쓸 수 있는 교육용 앱을 만들고, 만들며 배운 것을 나눕니다.</p>
  <div class="actions" style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn" href="#/board">💬 게시판</a>${CFG.email ? `<a class="btn ghost" href="mailto:${esc(CFG.email)}">✉ 이메일</a>` : ''}<a class="btn ghost" href="${esc(CFG.github)}" target="_blank" rel="noopener">GitHub</a></div></div></div>
  <div class="h-sec"><h2>바이브코딩이란?</h2></div><p>앱의 목적, 사용자, 화면, 기능, 보안 조건을 <b>말로 설명</b>하고 AI와 함께 코드를 완성하는 방식이에요. 달인 연구소의 앱 대부분이 이렇게 만들어졌어요.</p>
  <div class="h-sec"><h2>자주 묻는 질문</h2></div><div class="grid">${FAQ.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div>`;
}
function notFound() { view.innerHTML = '<div class="empty">페이지를 찾지 못했어요. <a href="#/">홈으로</a></div>'; }

/* ---------- 라우터 ---------- */
const ROUTES = { '': ['연구소.lab', pageHome], apps: ['실험실/', pageApps], insights: ['연구노트/', pageInsights], downloads: ['자료보관함/', pageDownloads], board: ['연구제안함.chat', pageBoard], changelog: ['연구일지.md', pageChangelog], about: ['연구소장.md', pageAbout], a11y: ['접근성.md', pageA11y] };
function setTab(n) { $('#tabName').textContent = n; }
let firstRoute = true;
function afterRender() {
  const h = $('#view h1'); if (h) { h.tabIndex = -1; if (!firstRoute) h.focus({ preventScroll: true }); }
  if (!firstRoute) announce((h ? h.textContent.trim() : document.title) + ' 화면');
  firstRoute = false;
}
async function route() { await routeInner(); afterRender(); }
async function routeInner() {
  const raw = location.hash.replace(/^#\/?/, ''); const [path, qs] = raw.split('?'); const params = new URLSearchParams(qs || '');
  const [seg, arg] = path.split('/');
  const key = seg === 'post' ? 'insights' : seg === 'app' ? 'apps' : (seg || '');
  $$('[data-route]').forEach(a => { const on = (a.dataset.route === 'home' ? '' : a.dataset.route) === key; a.classList.toggle('active', on); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  stopSpeak();
  view.scrollTop = 0; $('.content').scrollTop = 0;
  if (seg === 'post') return pagePost(decodeURIComponent(arg || ''));
  if (seg === 'app') return pageApp(decodeURIComponent(arg || ''));
  const r = ROUTES[seg || ''] || null; if (!r) return notFound();
  setTab(r[0]); document.title = (seg ? r[0].replace(/[/.].*$/, '') + ' · ' : '') + '달인 연구소';
  await r[1](params);
}
window.addEventListener('hashchange', route);
// 새 창 링크 알림 (KWCAG: 사용자 요구에 따른 실행)
function markNewWindow(root = document) {
  $$('a[target="_blank"]:not([data-nw])', root).forEach(a => { a.dataset.nw = '1'; a.insertAdjacentHTML('beforeend', '<span class="nw" aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span>'); if (!a.title) a.title = '새 창으로 열림'; });
}
new MutationObserver(() => markNewWindow()).observe(document.body, { childList: true, subtree: true });
markNewWindow();

/* ---------- 명령 팔레트 (Ctrl+K) ---------- */
let palItems = [], palSel = 0;
async function openPalette() {
  const [apps, posts] = await Promise.all([data.apps(), data.posts()]);
  palItems = [
    ...[['🏠 연구소 홈', '#/'], ['🧪 실험실(전체 앱)', '#/apps'], ['📓 연구 노트', '#/insights'], ['📦 자료 보관함', '#/downloads'], ['📮 연구 제안함', '#/board'], ['🗒️ 연구 일지', '#/changelog'], ['👨‍🔬 연구소장 소개', '#/about']].map(([t, h]) => ({ t, h, k: '메뉴' })),
    ...apps.map(a => ({ t: `${a.icon} ${a.name}`, h: '#/app/' + a.id, k: a.no, s: (a.tags || []).join(' ') + a.desc })),
    ...posts.map(p => ({ t: `${p.emoji || '📝'} ${p.title}`, h: '#/post/' + p.slug, k: '글', s: p.summary })),
    { t: '🌓 테마 바꾸기', fn: () => $('#themeBtn').click(), k: '명령' }, { t: '🏫 우리 학교 설정', fn: () => { location.hash = '#/'; setTimeout(schoolDialog, 200); }, k: '명령' },
  ];
  lastFocus = document.activeElement; $('#palette').hidden = false; const i = $('#paletteInput'); i.value = ''; i.focus(); drawPalette();
}
function drawPalette() {
  const k = $('#paletteInput').value.trim().toLowerCase();
  const l = palItems.filter(x => !k || (x.t + ' ' + (x.s || '')).toLowerCase().includes(k)).slice(0, 30);
  palSel = Math.min(palSel, Math.max(l.length - 1, 0));
  $('#paletteList').innerHTML = l.map((x, i) => `<li role="option" id="pal-${i}" aria-selected="${i === palSel}" class="${i === palSel ? 'sel' : ''}" data-i="${i}">${esc(x.t)}<small>${x.k}</small></li>`).join('') || '<li class="muted" role="option" aria-disabled="true">결과가 없어요</li>';
  $('#paletteInput').setAttribute('aria-activedescendant', l.length ? 'pal-' + palSel : '');
  $('#paletteList')._items = l;
}
function runPalette(i) {
  const x = ($('#paletteList')._items || [])[i]; if (!x) return; $('#palette').hidden = true;
  if (x.fn) return x.fn(); if (x.id) db.click(x.id);
  if (isExternal(x.h)) window.open(x.h, '_blank', 'noopener'); else location.href = x.h;
}
$('#cmdOpen').onclick = openPalette;
$('#paletteInput').oninput = () => { palSel = 0; drawPalette(); };
$('#paletteList').onclick = (e) => { const li = e.target.closest('[data-i]'); if (li) runPalette(+li.dataset.i); };
$('#palette').onclick = (e) => { if (e.target.id === 'palette') $('#palette').hidden = true; };
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
  if (e.key === 'Escape') { if (!$('#palette').hidden) { $('#palette').hidden = true; lastFocus && lastFocus.focus(); } modal.close(); closeA11y(); }
  if (!$('#palette').hidden) {
    const n = ($('#paletteList')._items || []).length;
    if (e.key === 'ArrowDown') { palSel = (palSel + 1) % Math.max(n, 1); drawPalette(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { palSel = (palSel - 1 + n) % Math.max(n, 1); drawPalette(); e.preventDefault(); }
    if (e.key === 'Enter') { runPalette(palSel); e.preventDefault(); }
  }
});


/* =========================================================
   ♿ 편의 기능 (배리어프리) — KWCAG 2.2 보조 기능
   ========================================================= */
const A11Y_DEF = { font: 0, spacing: false, contrast: false, underline: false, motion: false, cursor: false, rate: 1, clickRead: false };
let a11y = Object.assign({}, A11Y_DEF, store.get('a11y', {}));
const FONT_TXT = ['보통 (100%)', '크게 (120%)', '더 크게 (140%)', '아주 크게 (170%)'];
function applyA11y() {
  const c = document.documentElement.classList;
  [1, 2, 3].forEach(n => c.toggle('a11y-font-' + n, a11y.font === n));
  ['spacing', 'contrast', 'underline', 'motion', 'cursor'].forEach(k => c.toggle('a11y-' + k, !!a11y[k]));
  store.set('a11y', a11y); tick();
}
const sw = (id, label, desc, on) => `<div class="opt"><input type="checkbox" role="switch" id="${id}" ${on ? 'checked' : ''} aria-describedby="${id}-d"><label for="${id}"><b>${label}</b><span id="${id}-d">${desc}</span></label></div>`;
function openA11y() {
  lastFocus = document.activeElement;
  let p = $('#a11yPanel');
  if (!p) { p = document.createElement('div'); p.id = 'a11yPanel'; p.className = 'a11y-wrap'; document.body.appendChild(p); p.addEventListener('keydown', e => trapFocus(e, p.firstElementChild)); p.addEventListener('click', e => { if (e.target === p) closeA11y(); }); }
  const tts = 'speechSynthesis' in window;
  p.innerHTML = `<section class="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11yTitle">
    <div class="a11y-head"><h2 id="a11yTitle"><span aria-hidden="true">♿</span> 편의 기능</h2><button type="button" class="modal-x" id="a11yClose" aria-label="편의 기능 닫기">×</button></div>
    <p class="muted small">고른 설정은 이 기기에 저장돼 다음에 와도 그대로예요.</p>
    <fieldset><legend>글자 크기</legend><div class="seg">${FONT_TXT.map((t, i) => `<input type="radio" name="a11yFont" id="af${i}" value="${i}" ${a11y.font === i ? 'checked' : ''}><label for="af${i}">${['가', '가+', '가++', '가+++'][i]}<span class="sr-only"> ${t}</span></label>`).join('')}</div><p class="small muted" id="afNow">지금: ${FONT_TXT[a11y.font]}</p></fieldset>
    <fieldset><legend>보기</legend>
      ${sw('a11yDark', '다크 모드', '어두운 바탕에 밝은 글자', document.documentElement.dataset.theme === 'dark')}
      ${sw('a11yContrast', '고대비', '검은 바탕·노란 글자로 또렷하게 (저시력)', a11y.contrast)}
      ${sw('a11ySpacing', '읽기 쉬운 간격', '줄·글자·낱말 사이를 넓게 (난독·읽기 어려움)', a11y.spacing)}
      ${sw('a11yUnderline', '링크 밑줄 강조', '누를 수 있는 글자에 굵은 밑줄', a11y.underline)}
      ${sw('a11yCursor', '큰 마우스 포인터', '포인터를 크게 보여 줘요', a11y.cursor)}
      ${sw('a11yMotion', '움직임 줄이기', '애니메이션과 초 단위 시계를 멈춰요', a11y.motion)}
    </fieldset>
    <fieldset><legend>소리로 읽어 주기</legend>
      ${tts ? `<div class="btn-row"><button type="button" class="btn" id="ttsPage">▶ 이 화면 읽기</button><button type="button" class="btn ghost" id="ttsStop">■ 멈춤</button></div>
      ${sw('a11yClickRead', '누른 곳 읽어 주기', '글이나 카드를 누르면 그 내용을 읽어 줘요', a11y.clickRead)}
      <label for="ttsRate" class="small">읽는 빠르기</label><select id="ttsRate"><option value="0.8">느리게</option><option value="1">보통</option><option value="1.25">빠르게</option></select>`
      : '<p class="small muted">이 브라우저는 읽어 주기를 지원하지 않아요. 크롬이나 엣지에서 써 보세요.</p>'}
    </fieldset>
    <div class="btn-row"><button type="button" class="btn ghost" id="a11yReset">처음 설정으로</button><a class="btn ghost" href="#/a11y" id="a11yInfo">접근성 안내 보기</a></div>
  </section>`;
  p.hidden = false; document.body.classList.add('noscroll');
  const r = $('#ttsRate'); if (r) r.value = String(a11y.rate);
  $('#a11yClose').onclick = closeA11y; $('#a11yInfo').onclick = closeA11y;
  $$('input[name=a11yFont]', p).forEach(el => el.onchange = () => { a11y.font = +el.value; applyA11y(); $('#afNow').textContent = '지금: ' + FONT_TXT[a11y.font]; announce('글자 크기 ' + FONT_TXT[a11y.font]); });
  const bind = (id, key, msg) => { const el = $('#' + id); if (el) el.onchange = () => { a11y[key] = el.checked; applyA11y(); announce(msg + (el.checked ? ' 켰어요' : ' 껐어요')); }; };
  bind('a11yContrast', 'contrast', '고대비'); bind('a11ySpacing', 'spacing', '읽기 쉬운 간격'); bind('a11yUnderline', 'underline', '링크 밑줄');
  bind('a11yCursor', 'cursor', '큰 포인터'); bind('a11yMotion', 'motion', '움직임 줄이기'); bind('a11yClickRead', 'clickRead', '누른 곳 읽어 주기');
  $('#a11yDark').onchange = (e) => { setTheme(e.target.checked ? 'dark' : 'light'); announce('다크 모드 ' + (e.target.checked ? '켰어요' : '껐어요')); };
  if (tts) { $('#ttsPage').onclick = () => speak($('#view').innerText); $('#ttsStop').onclick = stopSpeak; r.onchange = () => { a11y.rate = +r.value; store.set('a11y', a11y); }; }
  $('#a11yReset').onclick = () => { a11y = Object.assign({}, A11Y_DEF); applyA11y(); setTheme('light'); openA11y(); announce('처음 설정으로 돌렸어요'); };
  $('#a11yClose').focus();
}
function closeA11y() { const p = $('#a11yPanel'); if (!p || p.hidden) return; p.hidden = true; document.body.classList.remove('noscroll'); lastFocus && lastFocus.focus && lastFocus.focus(); }
$('#a11yBtn').onclick = openA11y;

/* 읽어 주기 (Web Speech API, 한국어) */
function stopSpeak() { if ('speechSynthesis' in window) speechSynthesis.cancel(); $$('.reading').forEach(x => x.classList.remove('reading')); }
function speak(text, el) {
  if (!('speechSynthesis' in window) || !text) return; stopSpeak();
  const ko = speechSynthesis.getVoices().find(v => /ko/i.test(v.lang));
  const parts = text.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ' ').replace(/\s+/g, ' ').match(/[^.!?。\n]{1,180}[.!?。]?/g) || [];
  if (el) el.classList.add('reading');
  parts.forEach((t, i) => { const u = new SpeechSynthesisUtterance(t.trim()); u.lang = 'ko-KR'; if (ko) u.voice = ko; u.rate = a11y.rate || 1; if (i === parts.length - 1) u.onend = () => el && el.classList.remove('reading'); speechSynthesis.speak(u); });
}
document.addEventListener('click', (e) => {
  if (!a11y.clickRead || e.target.closest('#a11yPanel, .titlebar')) return;
  const el = e.target.closest('h1,h2,h3,p,li,.card,.msg,td,th,label,a,button'); if (el) speak(el.getAttribute('aria-label') || el.innerText, el);
});
document.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) modal.close(); });

/* 창 버튼 (윈도우식): 탐색기 접기 · 전체 화면 */
$('#winSide').onclick = () => { const on = document.body.classList.toggle('side-off'); $('#winSide').setAttribute('aria-pressed', String(on)); announce(on ? '탐색기를 접었어요' : '탐색기를 펼쳤어요'); };
$('#winFull').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
document.addEventListener('fullscreenchange', () => $('#winFull').setAttribute('aria-pressed', String(!!document.fullscreenElement)));

/* ---------- 화면: 접근성 안내 ---------- */
function pageA11y() {
  const items = [
    ['인식의 용이성', ['그림에 대체 텍스트 제공 (꾸밈 그림은 읽지 않게 처리)', '밝은 화면·다크 모드·고대비 모두 글자 명도 대비 4.5:1 이상', '색만으로 정보를 구분하지 않음 (상태는 글자로도 표시)', '글자 크기 최대 170%까지 확대해도 내용이 잘리지 않음']],
    ['운용의 용이성', ['모든 기능을 키보드만으로 사용 (Tab·Enter·Esc·방향키)', '초점이 굵은 테두리로 잘 보임', '본문·주 메뉴 바로가기 링크', '화면마다 다른 제목, 새 창은 ↗ 표시와 "새 창" 안내', '누를 곳 크기를 넉넉하게 (가로세로 36px 이상)', '한 글자 단축키 없음 (빠른 찾기는 Ctrl+K)', '깜빡이는 콘텐츠 없음, 움직임 줄이기 제공']],
    ['이해의 용이성', ['기본 언어 한국어 표시', '입력 칸마다 이름표(레이블)와 필수 여부 안내', '입력 오류를 글로 알려 주고 그 칸으로 이동', '이름은 한 번 쓰면 다음에 자동으로 채움 (반복 입력 줄이기)', '도움 요청(연구 제안함)을 모든 화면 같은 자리에 둠']],
    ['견고성', ['표준 HTML과 WAI-ARIA로 화면 읽기 프로그램(센스리더·NVDA·톡백) 지원', '대화상자 안에서 초점이 갇히고, 닫으면 원래 자리로 돌아감', '화면이 바뀌면 바뀐 화면 제목을 읽어 줌']],
  ];
  view.innerHTML = `<div class="wrap" style="max-width:860px"><h1><span aria-hidden="true">♿</span> 접근성 안내</h1>
  <p>달인 연구소는 특수교사가 만드는 곳이라, 누구나 불편 없이 쓸 수 있도록 <b>한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2</b>의 4가지 원칙에 맞춰 만들었어요.</p>
  <p class="muted small">이 안내는 스스로 점검한 내용이며, 공식 인증(웹 접근성 품질인증)을 받은 것은 아니에요. 연구소에서 연결하는 다른 앱·사이트는 각각 따로 점검이 필요해요.</p>
  <div class="h-sec"><h2>편의 기능</h2></div>
  <p>화면 위쪽 <b>♿ 편의 기능</b> 버튼에서 글자 크기, 다크 모드, 고대비, 읽기 쉬운 간격, 링크 밑줄, 큰 포인터, 움직임 줄이기, <b>소리로 읽어 주기</b>를 켤 수 있어요.</p>
  <button type="button" class="btn" data-open-a11y>♿ 편의 기능 열기</button>
  ${items.map(([h, l]) => `<div class="h-sec"><h2>${h}</h2></div><ul class="feat">${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}
  <div class="h-sec"><h2>키보드로 쓰기</h2></div>
  <table class="kbd-table"><caption class="sr-only">키보드 사용법</caption><thead><tr><th scope="col">키</th><th scope="col">하는 일</th></tr></thead><tbody>
  <tr><td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td><td>다음 / 이전 항목으로 이동</td></tr>
  <tr><td><kbd>Enter</kbd> · <kbd>Space</kbd></td><td>누르기, 켜고 끄기</td></tr>
  <tr><td><kbd>Ctrl</kbd>+<kbd>K</kbd></td><td>빠른 찾기 열기</td></tr>
  <tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>빠른 찾기 결과 고르기</td></tr>
  <tr><td><kbd>Esc</kbd></td><td>열린 창 닫기</td></tr></tbody></table>
  <div class="h-sec"><h2>불편한 점 알려 주기</h2></div>
  <p>쓰기 어려운 곳을 발견하면 <a href="#/board">연구 제안함</a>에 알려 주세요. 가능한 빨리 고칠게요.</p>
  <p class="muted small">점검 기준일: 2026년 11월 4일</p></div>`;
  $('[data-open-a11y]').onclick = openA11y;
}

/* ---------- 시작 ---------- */
const visitPromise = db.visit().catch(() => ({ today: 0, total: 0, local: true }));
visitPromise.then(v => { $('#visitMini').textContent = `오늘 ${(v.today ?? 0).toLocaleString()} · 누적 ${(v.total ?? 0).toLocaleString()}`; });
if (sb) db.feedback(null, 20).then(r => { const n = (r || []).filter(m => Date.now() - new Date(m.created_at) < 7 * 864e5).length; if (n) { const b = $('#boardBadge'); b.hidden = false; b.textContent = n > 9 ? '9+' : n; } }).catch(() => {});
applyA11y(); renderFavs(); route(); loadWeather();
})();
