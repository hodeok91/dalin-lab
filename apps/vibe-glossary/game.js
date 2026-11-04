/* 형아맨 게임 엔진 — RPG 대화창 · QUEST START/COMPLETE 연출 · 레벨/경험치 · 효과음
   접근성: 움직임 줄이기 설정을 따르고, 효과음은 기본 꺼짐, 대화는 화면 낭독기에도 읽혀요. */
(() => {
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem('hgm:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem('hgm:' + k, JSON.stringify(v)); } catch {} } };
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 효과음 (기본 꺼짐) ---------- */
const SFX = { button: 'assets/sfx/button.mp3', complete: 'assets/sfx/quest_complete.mp3', pause: 'assets/sfx/quest_abandon.mp3' };
const sfxOn = () => store.get('sfx', false);
function sfx(name) {
  if (!sfxOn() || !SFX[name]) return;
  try { const a = new Audio(SFX[name]); a.volume = name === 'button' ? 0.45 : 0.7; a.play().catch(() => {}); } catch {}
}

/* ---------- 형아맨 표정(애니메이션) ---------- */
const POSES = ['talk_open', 'point_right', 'thinking', 'clap', 'encourage'];
const poseSrc = (p) => still() ? 'assets/npc/still.webp' : `assets/npc/${POSES.includes(p) ? p : 'talk_open'}.webp`;

/* ---------- 레벨·경험치 ---------- */
const TITLES = ['견습 모험가', '초급 모험가', '용감한 탐험가', '중급 탐험가', '노련한 기술자', '고급 마법사', '바이브 마스터'];
function xpInfo(doneCount, levelClears) {
  const xp = doneCount * 100 + levelClears * 200;
  const lv = Math.floor(xp / 400) + 1;
  const into = xp % 400;
  return { xp, lv, into, need: 400, pct: Math.round(into / 4), title: TITLES[Math.min(TITLES.length - 1, Math.floor((lv - 1) / 2))] };
}

/* ---------- RPG 대화창 ----------
   lines: [{ t: '말', pose: 'talk_open' }] / onEnd: 마지막 줄을 다 읽었을 때 */
function talk(root, lines, opt = {}) {
  if (!root) return;
  const id = 'd' + Math.random().toString(36).slice(2, 7);
  root.innerHTML = `<div class="scene${opt.compact ? ' compact' : ''}">
    <div class="npc" aria-hidden="true"><img class="npc-img" src="${poseSrc(lines[0]?.pose)}" alt=""></div>
    <div class="dlg-box" role="group" aria-roledescription="대화창" aria-label="형아맨의 말">
      <span class="nametag">형아맨 <small>Lv.∞ 바이브 코치</small></span>
      <p class="dlg-text" aria-hidden="true"></p>
      <p class="sr-only" id="${id}" aria-live="polite"></p>
      <div class="dlg-ctrl"><span class="dlg-count" aria-hidden="true"></span>
        <button type="button" class="dlg-all linkbtn">대화 모두 보기</button>
        <button type="button" class="btn dlg-next">다음 ▶</button></div>
    </div></div>`;
  const img = $('.npc-img', root), txt = $('.dlg-text', root), sr = $('#' + id, root), next = $('.dlg-next', root), cnt = $('.dlg-count', root), box = $('.dlg-box', root);
  let i = 0, timer = 0, typing = false, ended = false;
  const finish = () => { clearInterval(timer); typing = false; txt.textContent = lines[i].t; txt.classList.add('done'); };
  const show = () => {
    const L = lines[i]; img.src = poseSrc(L.pose);
    cnt.textContent = `${i + 1} / ${lines.length}`;
    next.textContent = i === lines.length - 1 ? (opt.endLabel || '알겠어요 ✔') : '다음 ▶';
    sr.textContent = ''; setTimeout(() => { sr.textContent = `형아맨: ${L.t}`; }, 30);
    txt.classList.remove('done');
    if (still() || opt.instant) { txt.textContent = L.t; txt.classList.add('done'); return; }
    let n = 0; typing = true; txt.textContent = '';
    clearInterval(timer);
    timer = setInterval(() => { n += 2; txt.textContent = L.t.slice(0, n); if (n >= L.t.length) finish(); }, 28);
  };
  const go = () => {
    if (typing) return finish();
    sfx('button');
    if (i < lines.length - 1) { i++; show(); return; }
    if (!ended) { ended = true; root.classList.add('talk-ended'); opt.onEnd && opt.onEnd(); }
    else if (opt.onEnd) opt.onEnd();
  };
  next.onclick = go;
  box.addEventListener('click', (e) => { if (e.target.closest('button, a')) return; go(); });
  $('.dlg-all', root).onclick = () => {
    clearInterval(timer); typing = false;
    box.querySelector('.dlg-text').outerHTML = `<ol class="dlg-list">${lines.map(l => `<li>${esc(l.t)}</li>`).join('')}</ol>`;
    $('.dlg-all', root).remove(); cnt.textContent = '';
    i = lines.length - 1; next.textContent = opt.endLabel || '알겠어요 ✔';
    if (!ended) { ended = true; root.classList.add('talk-ended'); opt.onEnd && opt.onEnd(); }
  };
  show();
  return { pose: (p) => { img.src = poseSrc(p); }, say: (t, p) => { lines = [{ t, pose: p }]; i = 0; ended = true; show(); } };
}

/* ---------- QUEST START / COMPLETE 연출 ---------- */
let bannerTimer = 0;
function banner(kicker, title, desc = '', kind = 'start', ms = 2200) {
  let el = $('#qBanner');
  if (!el) { el = document.createElement('div'); el.id = 'qBanner'; el.className = 'qbanner'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); el.addEventListener('click', () => el.classList.remove('show')); }
  el.className = 'qbanner ' + kind;
  el.innerHTML = `<div class="qb-in"><div class="qb-k">${esc(kicker)}</div><div class="qb-t">${esc(title)}</div>${desc ? `<div class="qb-d">${esc(desc)}</div>` : ''}</div>`;
  void el.offsetWidth; el.classList.add('show');
  clearTimeout(bannerTimer); bannerTimer = setTimeout(() => el.classList.remove('show'), still() ? Math.min(ms, 1600) : ms);
}

/* ---------- 브라우저·기기 알아보기 (확장 설치 안내용) ---------- */
function device() {
  const ua = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const browser = /Whale/i.test(ua) ? 'whale' : /Edg\//.test(ua) ? 'edge' : /Chrome\//.test(ua) ? 'chrome' : /Firefox/i.test(ua) ? 'firefox' : 'other';
  return { mobile, browser, pc: !mobile, canExt: !mobile && ['chrome', 'edge', 'whale'].includes(browser) };
}

window.HGM = { sfx, sfxOn, setSfx: (v) => store.set('sfx', !!v), talk, banner, xpInfo, poseSrc, device, store, esc };
})();
