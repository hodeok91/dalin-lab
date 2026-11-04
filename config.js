/* =========================================================
   달인 연구소 설정 파일 — 여기만 고치면 됩니다
   ========================================================= */
window.DALIN_CONFIG = {
  siteName: '달인 연구소',

  // 1) Supabase (방문자 수 · 인기 앱 순위 · 게시판 · 댓글)
  //    비워 두면 '로컬 모드'로 동작합니다(내 브라우저에서만 숫자가 보임).
  //    값 넣는 법: 02_재구현/배포가이드.md 의 '2단계 Supabase'
  supabaseUrl: 'https://ysrvnmaulcbgdiahcnsr.supabase.co',
  supabaseAnonKey: 'sb_publishable_RCoEZ3UIjDaHx6kb2Lr_XQ_ou4el4M8', // 공개용 키(publishable). secret·service_role 키는 절대 넣지 마세요

  // 2) 오늘 정보 기본값 (방문자는 화면에서 자기 학교·위치로 바꿀 수 있어요)
  defaultSchool: { name: '명현학교', office: 'J10', code: '7530509' }, // 예: { name:'서울맹학교', office:'B10', code:'1342098' }
  defaultLocation: { name: '고양 삼송', lat: 37.653, lon: 126.896 },
  defaultDday: { label: '겨울방학', date: '2026-12-31' },

  // 3) 공지 띠 (빈 문자열이면 숨김)
  notice: '🎉 달인 연구소가 새 단장했어요! 교실의 불편함은 📮 연구 제안함에 남겨 주세요.',

  // 4) 연락처
  email: '',            // 예: 'hodeok91@gmail.com' — 비워 두면 이메일 버튼이 숨겨져요
  github: 'https://github.com/hodeok91/dalin-lab',
};
