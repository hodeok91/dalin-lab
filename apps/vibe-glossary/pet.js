/* 형아맨 펫 — 화면 구석에서 움직이고, 누르면 메뉴가 열려요. 끌어서 옮길 수 있어요. */
(() => {
  const $ = (s) => document.querySelector(s);
  const pet = $('#pet'), btn = $('#petBtn'), img = $('#petImg'), menu = $('#petMenu'), call = $('#petCall');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = (n) => still ? 'assets/hyungaman.png' : `assets/pet/${n}.webp`;
  let mood = 'idle', back = 0;
  const set = (n, ms) => { if (mood === n && !ms) return; mood = n; img.src = IMG(n); clearTimeout(back); if (ms) back = setTimeout(() => set('idle'), ms); };
  window.hgmPet = { cheer: () => set('cheer', 4000), think: () => set('thinking', 3000), hello: () => set('hello', 2500) };
  try { if (JSON.parse(localStorage.getItem('hgm:petHidden') || 'false')) { pet.hidden = true; call.hidden = false; } const pos = JSON.parse(localStorage.getItem('hgm:petPos') || 'null'); if (pos) Object.assign(pet.style, pos); } catch {}
  const open = (o) => { menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); btn.setAttribute('aria-label', o ? '형아맨 메뉴 닫기' : '형아맨 메뉴 열기'); if (o) { set('hello', 2500); menu.querySelector('.pm').focus(); } };
  // 끌어서 옮기기 (짧게 누르면 메뉴)
  let drag = null;
  btn.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, r: pet.getBoundingClientRect(), moved: false }; btn.setPointerCapture(e.pointerId); });
  btn.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true; if (!drag.moved) return;
    const right = Math.min(innerWidth - 60, Math.max(0, innerWidth - drag.r.right - dx)), bottom = Math.min(innerHeight - 60, Math.max(0, innerHeight - drag.r.bottom - dy));
    Object.assign(pet.style, { right: right + 'px', bottom: bottom + 'px' }); });
  btn.addEventListener('pointerup', () => { if (drag?.moved) { try { localStorage.setItem('hgm:petPos', JSON.stringify({ right: pet.style.right, bottom: pet.style.bottom })); } catch {} } else open(menu.hidden); setTimeout(() => drag = null, 0); });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(menu.hidden); } });
  btn.addEventListener('click', (e) => { if (e.detail === 0) return; e.preventDefault(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); } });
  document.addEventListener('click', (e) => { if (!menu.hidden && !pet.contains(e.target)) open(false); });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) open(false); });
  btn.addEventListener('mouseenter', () => mood === 'idle' && set('hello', 2000));
  $('#petHide').onclick = () => { open(false); pet.hidden = true; call.hidden = false; call.focus(); try { localStorage.setItem('hgm:petHidden', 'true'); } catch {} };
  call.onclick = () => { pet.hidden = false; call.hidden = true; set('hello', 2500); btn.focus(); try { localStorage.setItem('hgm:petHidden', 'false'); } catch {} };
  // 화면에 따라 표정 바꾸기
  const onRoute = () => { const h = location.hash; if (/^#\/(prompt|play)/.test(h)) set('thinking', 3000); };
  addEventListener('hashchange', onRoute);
})();
