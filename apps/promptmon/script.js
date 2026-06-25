"use strict";

const STORAGE_KEY = "promptmon_responsive_camera_final_v1";
const COLS = 30;
const ROWS = 20;
const ENCOUNTER_RATE = 0.25;

const MOVE_SPEED = 5.3;
const PLAYER_RADIUS_X = 0.18;
const PLAYER_RADIUS_Y = 0.16;

const PLAYER_SPRITES = {
  down: "./assets/trainer-down.png",
  up: "./assets/trainer-up.png",
  left: "./assets/trainer-left.png",
  right: "./assets/trainer-right.png"
};

// map.png 기준 30 x 20 좌표입니다.
// 이동 가능 영역: 길, 밝은 풀밭, 풀숲을 크게 잡고,
// 장애물 영역: 나무, 건물, 절벽, 돌은 BLOCKED_RECTS에서 다시 막습니다.
const WALKABLE_RECTS = [
  [0.0, 4.7, 4.2, 10.2],
  [4.1, 5.1, 8.6, 9.9],
  [0.0, 10.5, 8.0, 13.7],
  [7.6, 4.3, 15.3, 8.7],
  [15.3, 0.0, 17.9, 10.7],
  [11.1, 8.5, 17.6, 12.4],
  [14.0, 11.0, 23.2, 16.0],
  [18.2, 6.1, 23.8, 10.0],
  [24.2, 3.4, 29.6, 8.2],
  [22.4, 8.2, 29.5, 15.4],
  [19.2, 13.3, 21.4, 17.4]
];

const BLOCKED_RECTS = [
  [0.0, 0.0, 15.0, 4.55],
  [18.0, 0.0, 30.0, 3.35],
  [14.75, 1.0, 18.25, 5.15],
  [0.0, 4.8, 0.75, 8.2],
  [3.65, 4.9, 4.35, 9.5],
  [5.3, 7.7, 8.55, 10.65],
  [8.65, 8.8, 10.3, 13.25],
  [10.25, 9.8, 13.8, 13.6],
  [12.0, 8.6, 15.15, 11.3],
  [17.55, 0.0, 19.1, 8.15],
  [18.9, 8.9, 22.25, 10.85],
  [23.15, 5.45, 26.15, 9.35],
  [23.35, 12.0, 26.75, 15.8],
  [0.0, 14.55, 16.0, 20.0],
  [16.2, 16.55, 30.0, 20.0]
];

const TALL_GRASS_RECTS = [
  [4.15, 5.15, 8.45, 9.65],
  [0.1, 8.2, 4.15, 10.0],
  [21.25, 5.2, 23.7, 9.45],
  [24.25, 3.55, 29.45, 8.0],
  [22.7, 8.35, 29.3, 15.2]
];

const fallbackWorld = [
  "TTTTTTTTTTTHHHHTTTTTTTTTTTTTT",
  "TTTTTTTTTTTHHHHTTTTTTTTTTTTTT",
  "AAAAAAAAAAGHHHHGAAAAAAAAAAAAAA",
  "AAAAAAAAAAGPPPPGAAAAAGGGGGAAA",
  "AAAGGGGGGGPPPPGGGAAAGFFFFFAAA",
  "AAGGWWWWGGPPPPGGGAAAAFFFFFAAA",
  "AAGGWWWWGGPPPPGGGGGGGAAAAAAGG",
  "GGGGWWWWGGPPPPPPPPPPPGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGPPPGAAAAAAA",
  "GGGAAAAAAAGGGGGGGGPPPGAAAAAAA",
  "GGGAAAAAAAGGGGGGGGPPPGGGGGGGG",
  "GGGGGGGGGGGGGGGGGGPPPPPPPPPGG",
  "GGGGGGGGWWWWGGGGGGGGGGGGGPPPG",
  "TTTGGGGGWWWWWWGGGGGGGGGGPPPGG",
  "TTTGGGGGWWWWWWWWGGGGRRRRGGGGG",
  "TTTAAAAAGGGWWWWWWGGGRRRRGGGGG",
  "TTTAAAAAGGGGGGGWWGGGRRCGGGGGG",
  "TTTAAAAAGGGGGGGGGGGGRRRGGGGGG",
  "TTTTTTTTGGGGGGGGGGGGGGGGGGGGG",
  "TTTTTTTTGGGGGGGGGGGGGGGGGGGGG"
];

const categories = [
  { key: "role", label: "역할", score: 10 },
  { key: "goal", label: "목표", score: 15 },
  { key: "target", label: "대상", score: 10 },
  { key: "data", label: "자료/API", score: 15 },
  { key: "features", label: "기능", score: 20 },
  { key: "screens", label: "화면", score: 10 },
  { key: "conditions", label: "조건", score: 10 },
  { key: "output", label: "출력 형식", score: 10 },
  { key: "exceptions", label: "예외처리", score: 0 }
];

const quests = [
  {
    id: "meal",
    title: "급식정보 앱 만들기",
    pokemon: "snorlax",
    koreanPokemon: "잠만보",
    enemy: "급식 막연몬",
    badPrompt: "급식 앱 만들어줘.",
    cards: {
      role: [
        "너는 학교 현장에서 사용할 교육용 웹앱을 만드는 프론트엔드 개발자야.",
        "너는 특수학교 학생도 쉽게 사용할 수 있는 생활 정보 앱 기획자이자 개발자야."
      ],
      goal: [
        "학교 급식 정보를 날짜별로 쉽고 빠르게 확인할 수 있는 앱을 만들어줘.",
        "학생과 교사가 오늘의 급식, 내일의 급식, 주간 급식을 한눈에 볼 수 있게 해줘."
      ],
      target: [
        "사용 대상은 특수학교 학생, 담임교사, 보조인력이야. 글자는 크고 조작은 쉬워야 해.",
        "초등학생부터 고등학생까지 사용할 수 있게 문장은 짧고 버튼은 크게 만들어줘."
      ],
      data: [
        "나이스 급식 API를 사용할 수 있도록 설계하되, API 키가 없을 때는 예시 데이터로 동작하게 해줘.",
        "급식 데이터는 JavaScript 배열로 관리하고, 날짜, 메뉴, 알레르기 정보를 포함해줘."
      ],
      features: [
        "오늘 급식 보기, 날짜 선택, 주간 급식 보기, 알레르기 표시, 즐겨찾기 기능을 넣어줘.",
        "급식 메뉴 검색, 날짜 이동, 오늘 버튼, 급식 없음 안내 기능을 넣어줘."
      ],
      screens: [
        "화면은 홈 화면, 오늘 급식 화면, 주간 급식 화면, 설정 화면으로 구성해줘.",
        "상단에는 학교명, 가운데에는 급식 카드, 하단에는 큰 이동 버튼을 배치해줘."
      ],
      conditions: [
        "모바일, 태블릿, PC에서 모두 보기 좋게 반응형으로 만들어줘.",
        "터치 화면에서 사용하기 쉽도록 버튼 높이는 충분히 크게 만들어줘."
      ],
      output: [
        "HTML, CSS, JavaScript 전체 코드를 파일별로 나누어 작성해줘.",
        "파일 구조와 실행 방법을 먼저 알려주고, 그다음 전체 코드를 작성해줘."
      ],
      exceptions: [
        "급식 데이터가 없는 날에는 '급식 정보가 없습니다'라고 안내해줘.",
        "API 연결에 실패하면 예시 데이터로 자동 전환되게 해줘."
      ]
    }
  },
  {
    id: "emotion",
    title: "감정 출석 앱 만들기",
    pokemon: "jigglypuff",
    koreanPokemon: "푸린",
    enemy: "감정 대충몬",
    badPrompt: "감정 출석 앱 만들어줘.",
    cards: {
      role: [
        "너는 특수교육 현장에서 사용할 정서 지원 웹앱을 만드는 개발자야.",
        "너는 학생의 감정 표현을 돕는 교육용 앱 기획자야."
      ],
      goal: [
        "학생이 오늘의 감정을 카드로 선택하고 교사가 확인할 수 있는 감정 출석 앱을 만들어줘.",
        "말로 표현하기 어려운 학생도 감정 카드를 눌러 자신의 상태를 표현할 수 있게 해줘."
      ],
      target: [
        "사용 대상은 특수학교 학생과 담임교사야. 그림, 큰 글자, 쉬운 단어가 필요해.",
        "비언어 학생도 사용할 수 있도록 선택 과정은 단순해야 해."
      ],
      data: [
        "감정 데이터는 JavaScript 배열로 관리하고, 감정 이름, 이모지, 설명, 색상을 포함해줘.",
        "외부 API 없이 감정 카드 목록을 코드 안의 배열 데이터로 관리해줘."
      ],
      features: [
        "감정 선택, 학생 이름 입력, 오늘의 출석 저장, 감정 기록 보기, 기록 삭제 기능을 넣어줘.",
        "기쁨, 슬픔, 화남, 걱정, 피곤함, 아픔 같은 감정 카드를 선택할 수 있게 해줘."
      ],
      screens: [
        "화면은 학생 선택 화면, 감정 선택 화면, 오늘 기록 화면, 교사용 확인 화면으로 구성해줘.",
        "감정 카드는 큰 카드형 UI로 보여주고, 선택한 감정은 화면 상단에 크게 표시해줘."
      ],
      conditions: [
        "localStorage를 사용해서 기록이 새로고침 후에도 남게 해줘.",
        "마우스와 터치 모두 편하게 사용할 수 있게 버튼을 크게 만들어줘."
      ],
      output: [
        "HTML, CSS, JavaScript 전체 코드를 작성해줘.",
        "주석을 넣어서 교사가 수정하기 쉽게 설명해줘."
      ],
      exceptions: [
        "학생 이름을 입력하지 않으면 저장하지 말고 안내 문구를 보여줘.",
        "이미 같은 학생이 오늘 감정을 저장했다면 수정할 수 있게 해줘."
      ]
    }
  },
  {
    id: "sticker",
    title: "칭찬 스티커 앱 만들기",
    pokemon: "eevee",
    koreanPokemon: "이브이",
    enemy: "스티커 누락몬",
    badPrompt: "칭찬 스티커 앱 만들어줘.",
    cards: {
      role: [
        "너는 학급 경영을 돕는 보상 시스템 웹앱 개발자야.",
        "너는 학생의 긍정 행동을 강화하는 교육용 앱 기획자야."
      ],
      goal: [
        "학생에게 칭찬 스티커를 주고 누적 개수를 확인할 수 있는 앱을 만들어줘.",
        "교사가 좋은 행동을 바로 기록하고 학생이 성취감을 느낄 수 있게 해줘."
      ],
      target: [
        "사용 대상은 특수학교 교사와 학생이야. 조작은 간단하고 결과는 눈에 잘 보여야 해.",
        "학생이 스티커가 쌓이는 것을 시각적으로 바로 확인할 수 있어야 해."
      ],
      data: [
        "학생 목록과 스티커 기록은 JavaScript 배열과 localStorage로 관리해줘.",
        "학생 이름, 스티커 개수, 칭찬 이유, 날짜 데이터를 저장해줘."
      ],
      features: [
        "학생 추가, 스티커 주기, 스티커 빼기, 칭찬 이유 기록, 전체 초기화 기능을 넣어줘.",
        "목표 개수 달성 시 축하 메시지와 보상 안내가 나오게 해줘."
      ],
      screens: [
        "화면은 학생 목록 화면, 스티커판 화면, 칭찬 기록 화면, 설정 화면으로 구성해줘.",
        "학생별 카드를 만들고 카드 안에 스티커 개수와 최근 칭찬을 보여줘."
      ],
      conditions: [
        "버튼은 크게 만들고 실수로 누른 경우를 위해 확인 절차를 넣어줘.",
        "모바일과 태블릿에서 카드가 자동으로 정렬되게 해줘."
      ],
      output: [
        "HTML, CSS, JavaScript 전체 코드를 파일별로 작성해줘.",
        "localStorage 저장 구조도 함께 설명해줘."
      ],
      exceptions: [
        "학생이 없을 때는 '학생을 먼저 추가하세요'라고 안내해줘.",
        "스티커 개수가 0보다 작아지지 않게 해줘."
      ]
    }
  },
  {
    id: "random",
    title: "랜덤 발표 뽑기 앱 만들기",
    pokemon: "abra",
    koreanPokemon: "캐이시",
    enemy: "뽑기 헷갈몬",
    badPrompt: "랜덤 뽑기 앱 만들어줘.",
    cards: {
      role: [
        "너는 수업 참여를 돕는 교실용 웹앱 개발자야.",
        "너는 발표 활동을 공정하고 재미있게 만드는 앱 기획자야."
      ],
      goal: [
        "학생 이름 목록에서 발표자를 랜덤으로 뽑는 앱을 만들어줘.",
        "수업 중 학생 참여를 높이기 위해 재미있는 뽑기 효과가 있는 앱을 만들어줘."
      ],
      target: [
        "사용 대상은 교사와 학생이야. 전자칠판에서도 잘 보여야 해.",
        "학생들이 결과를 쉽게 이해할 수 있도록 글자와 애니메이션을 크게 보여줘."
      ],
      data: [
        "학생 이름 목록은 JavaScript 배열과 localStorage로 관리해줘.",
        "학생 이름, 뽑힌 횟수, 제외 여부 데이터를 저장해줘."
      ],
      features: [
        "학생 추가, 학생 삭제, 랜덤 뽑기, 뽑힌 횟수 표시, 오늘 제외 기능을 넣어줘.",
        "한 번 뽑힌 학생을 잠시 제외하거나 다시 포함할 수 있게 해줘."
      ],
      screens: [
        "화면은 이름 관리 화면, 뽑기 화면, 결과 화면, 기록 화면으로 구성해줘.",
        "가운데에는 뽑기 버튼을 크게 두고 결과는 카드처럼 크게 보여줘."
      ],
      conditions: [
        "이름이 1명도 없으면 뽑기 버튼을 비활성화해줘.",
        "뽑기 결과가 너무 빠르게 나오지 않도록 짧은 애니메이션을 넣어줘."
      ],
      output: [
        "HTML, CSS, JavaScript 전체 코드를 작성해줘.",
        "교사가 학생 이름만 쉽게 바꿀 수 있도록 주석을 넣어줘."
      ],
      exceptions: [
        "모든 학생이 제외 상태이면 뽑기를 멈추고 안내해줘.",
        "중복 이름을 입력하면 추가하지 말고 안내해줘."
      ]
    }
  },
  {
    id: "lesson",
    title: "수업자료 앱 만들기",
    pokemon: "slowpoke",
    koreanPokemon: "야돈",
    enemy: "자료 빈칸몬",
    badPrompt: "수업자료 앱 만들어줘.",
    cards: {
      role: [
        "너는 교사의 수업 준비를 돕는 교육용 자료 관리 앱 개발자야.",
        "너는 수업 자료를 쉽게 정리하고 활용하게 만드는 웹앱 기획자야."
      ],
      goal: [
        "교사가 수업 자료를 주제별 카드로 정리하고 바로 열 수 있는 앱을 만들어줘.",
        "수업 시간에 필요한 링크, 파일명, 설명을 빠르게 찾을 수 있게 해줘."
      ],
      target: [
        "사용 대상은 교사야. 수업 중에도 빠르게 조작할 수 있어야 해.",
        "컴퓨터와 전자칠판에서 모두 보기 쉽게 만들어줘."
      ],
      data: [
        "자료 데이터는 JavaScript 배열로 관리하고, 제목, 과목, 설명, 링크, 태그를 포함해줘.",
        "외부 API 없이 예시 자료 데이터를 코드 안에 넣어줘."
      ],
      features: [
        "자료 추가, 자료 검색, 과목 필터, 태그 필터, 즐겨찾기 기능을 넣어줘.",
        "자료 카드를 누르면 링크를 새 창으로 열 수 있게 해줘."
      ],
      screens: [
        "화면은 자료 목록 화면, 자료 추가 화면, 즐겨찾기 화면으로 구성해줘.",
        "자료는 카드형 UI로 보여주고 과목별 색상 라벨을 붙여줘."
      ],
      conditions: [
        "검색 결과가 없을 때 안내 문구를 보여줘.",
        "localStorage를 사용해서 추가한 자료가 유지되게 해줘."
      ],
      output: [
        "HTML, CSS, JavaScript 전체 코드를 파일별로 작성해줘.",
        "파일 구조와 실행 방법도 함께 알려줘."
      ],
      exceptions: [
        "링크가 비어 있으면 열기 버튼을 숨겨줘.",
        "제목이 없는 자료는 저장하지 않게 해줘."
      ]
    }
  }
];

const state = {
  screen: "titleScreen",
  titleIndex: 0,
  resultIndex: 0,
  muted: false,
  helpOpen: false,
  player: { x: 16.0, y: 9.7, dir: "down" },
  inEncounter: false,
  grassSteps: 0,
  currentQuest: null,
  currentStep: 0,
  choiceIndex: 0,
  selected: {},
  finalScore: 0,
  finalPrompt: "",
  mapImageAvailable: true,
  layout: {
    stageW: 0,
    stageH: 0,
    mapW: 0,
    mapH: 0,
    tileW: 0,
    tileH: 0,
    cameraX: 0,
    cameraY: 0,
    isMobile: false,
    isPortrait: false
  }
};

const keysDown = new Set();
let lastFrameTime = 0;

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", init);

function init() {
  updateDeviceMode();
  renderFallbackMap();
  bindEvents();
  preloadTitlePokemon();
  loadPlayerBattlePokemon();
  handleMapImageFallback();
  updateMapLayout();
  showScreen("titleScreen");
}

function bindEvents() {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  window.addEventListener("resize", () => {
    updateDeviceMode();
    updateMapLayout();
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      updateDeviceMode();
      updateMapLayout();
    }, 350);
  });

  document.addEventListener("touchmove", (event) => {
    if (["titleScreen", "mapScreen", "battleScreen"].includes(state.screen)) {
      event.preventDefault();
    }
  }, { passive: false });

  document.querySelectorAll("[data-title-action]").forEach((button, index) => {
    button.addEventListener("click", () => runTitleAction(index));
  });

  document.querySelectorAll("[data-move]").forEach((button) => {
    const direction = button.dataset.move;

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startMobileMove(direction);
    });

    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      stopMobileMove(direction);
    });

    button.addEventListener("pointercancel", () => stopMobileMove(direction));
    button.addEventListener("pointerleave", () => stopMobileMove(direction));

    button.addEventListener("click", (event) => {
      event.preventDefault();
      movePlayer(direction);
    });
  });

  $("copyAndMapBtn").addEventListener("click", copyAndReturnMap);
  $("saveDexBtn").addEventListener("click", saveCurrentPrompt);
  $("experimentBtn").addEventListener("click", showExperiment);
  $("backMapBtn").addEventListener("click", returnToMap);

  $("copyBadBtn").addEventListener("click", () => copyText(state.currentQuest.badPrompt));
  $("copyGoodBtn").addEventListener("click", () => copyText(state.finalPrompt));
  $("compareBtn").addEventListener("click", showComparison);
  $("backResultBtn").addEventListener("click", () => showScreen("resultScreen"));

  $("dexToTitleBtn").addEventListener("click", () => {
    playOnly("introBgm");
    showScreen("titleScreen");
  });

  $("dexToMapBtn").addEventListener("click", returnToMap);

  requestAnimationFrame(gameLoop);
}

/* 기기 / 화면 방향 */

function updateDeviceMode() {
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isSmallScreen = window.innerWidth <= 900;
  const isMobile = isTouchDevice || isSmallScreen;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  state.layout.isMobile = isMobile;
  state.layout.isPortrait = isPortrait;

  document.documentElement.classList.toggle("is-mobile", isMobile);
  document.documentElement.classList.toggle("is-pc", !isMobile);
  document.documentElement.classList.toggle("is-portrait", isPortrait);
  document.documentElement.classList.toggle("is-landscape", !isPortrait);
}

/* 화면 */

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  $(screenId).classList.add("active");
  state.screen = screenId;

  keysDown.clear();

  if (screenId === "mapScreen") {
    updateDeviceMode();
    updateMapLayout();
  }

  if (screenId === "resultScreen") {
    state.resultIndex = 0;
    updateResultMenu();
  }
}

/* 음악 / 효과음 */

function audioIds() {
  return ["introBgm", "fieldBgm", "battleBgm", "victoryBgm"];
}

function stopAllMusic() {
  audioIds().forEach((id) => {
    const audio = $(id);
    audio.pause();
    audio.currentTime = 0;
  });
}

function playOnly(id) {
  stopAllMusic();

  if (state.muted) return;

  const audio = $(id);
  audio.volume = id === "battleBgm" ? 0.56 : 0.45;
  audio.currentTime = 0;
  audio.play().catch(() => showToast("화면을 한 번 누른 뒤 다시 선택하세요."));
}

function playVictory() {
  stopAllMusic();

  if (state.muted) return;

  const audio = $("victoryBgm");
  audio.volume = 0.58;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playSfx(id) {
  if (state.muted) return;

  const audio = $(id);
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch(() => {});
  } catch {}
}

function toggleMute() {
  state.muted = !state.muted;

  const muteButton = document.querySelector('[data-title-action="mute"]');
  muteButton.textContent = state.muted ? "소리 꺼짐" : "소리 켜짐";

  if (state.muted) {
    stopAllMusic();
    return;
  }

  if (state.screen === "titleScreen") playOnly("introBgm");
  if (state.screen === "mapScreen") playOnly("fieldBgm");
  if (state.screen === "battleScreen") playOnly("battleBgm");
}

function playEncounterEffect() {
  if (state.muted) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    [698, 932, 1244].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.1);
    });
  } catch {}
}

/* PokeAPI */

async function fetchPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) throw new Error("PokeAPI 연결 실패");
  return response.json();
}

function getFrontSprite(data) {
  return (
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ||
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.front_default ||
    data?.sprites?.front_default ||
    data?.sprites?.other?.["official-artwork"]?.front_default ||
    ""
  );
}

function getBackSprite(data) {
  return (
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.back_default ||
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.back_default ||
    data?.sprites?.back_default ||
    data?.sprites?.front_default ||
    ""
  );
}

async function setPokemonSprite(imgId, fallbackId, pokemon, direction = "front") {
  const img = $(imgId);
  const fallback = fallbackId ? $(fallbackId) : null;

  img.classList.add("hidden");
  if (fallback) fallback.classList.remove("hidden");

  try {
    const data = await fetchPokemon(pokemon);
    const sprite = direction === "back" ? getBackSprite(data) : getFrontSprite(data);

    if (!sprite) throw new Error("스프라이트 없음");

    img.onload = () => {
      img.classList.remove("hidden");
      if (fallback) fallback.classList.add("hidden");
    };

    img.onerror = () => {
      img.classList.add("hidden");
      if (fallback) fallback.classList.remove("hidden");
    };

    img.src = sprite;
  } catch {
    img.classList.add("hidden");
    if (fallback) fallback.classList.remove("hidden");
  }
}

async function preloadTitlePokemon() {
  const list = [
    ["titlePokemonLeft", "eevee"],
    ["titlePokemonCenter", "pikachu"],
    ["titlePokemonRight", "snorlax"]
  ];

  list.forEach(async ([id, name]) => {
    try {
      const data = await fetchPokemon(name);
      const sprite =
        data?.sprites?.other?.["official-artwork"]?.front_default ||
        data?.sprites?.other?.home?.front_default ||
        getFrontSprite(data);

      if (sprite) $(id).src = sprite;
    } catch {
      $(id).style.display = "none";
    }
  });
}

function loadPlayerBattlePokemon() {
  setPokemonSprite("playerPokemonSprite", "playerFallback", "pikachu", "back");
}

/* 키보드 / 터치 */

function handleKeydown(event) {
  if (state.helpOpen && ["Enter", " "].includes(event.key)) {
    event.preventDefault();
    playSfx("plinkSfx");
    closeHelp();
    return;
  }

  if (state.screen === "titleScreen") handleTitleKey(event);
  else if (state.screen === "mapScreen") handleMapKey(event);
  else if (state.screen === "battleScreen") handleBattleKey(event);
  else if (state.screen === "resultScreen") handleResultKey(event);
}

function handleKeyup(event) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    keysDown.delete(event.key);
  }
}

function startMobileMove(direction) {
  if (state.screen !== "mapScreen") return;

  const key = directionToKey(direction);
  if (key) keysDown.add(key);
}

function stopMobileMove(direction) {
  const key = directionToKey(direction);
  if (key) keysDown.delete(key);
}

function directionToKey(direction) {
  if (direction === "up") return "ArrowUp";
  if (direction === "down") return "ArrowDown";
  if (direction === "left") return "ArrowLeft";
  if (direction === "right") return "ArrowRight";
  return "";
}

function gameLoop(time) {
  const dt = Math.min(0.05, (time - lastFrameTime) / 1000 || 0);
  lastFrameTime = time;

  if (state.screen === "mapScreen" && !state.inEncounter) {
    updateSmoothMovement(dt);
  }

  requestAnimationFrame(gameLoop);
}

function updateSmoothMovement(dt) {
  if (keysDown.size === 0) return;

  let dx = 0;
  let dy = 0;

  if (keysDown.has("ArrowLeft")) dx -= 1;
  if (keysDown.has("ArrowRight")) dx += 1;
  if (keysDown.has("ArrowUp")) dy -= 1;
  if (keysDown.has("ArrowDown")) dy += 1;

  if (dx === 0 && dy === 0) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    state.player.dir = dx < 0 ? "left" : "right";
  } else if (dy !== 0) {
    state.player.dir = dy < 0 ? "up" : "down";
  }

  const len = Math.hypot(dx, dy) || 1;
  dx = (dx / len) * MOVE_SPEED * dt;
  dy = (dy / len) * MOVE_SPEED * dt;

  tryMoveBy(dx, dy);
}

function handleTitleKey(event) {
  const buttons = [...document.querySelectorAll("[data-title-action]")];
  const cols = 2;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
    event.preventDefault();
  }

  const before = state.titleIndex;

  if (event.key === "ArrowLeft") state.titleIndex = Math.max(0, state.titleIndex - 1);
  if (event.key === "ArrowRight") state.titleIndex = Math.min(buttons.length - 1, state.titleIndex + 1);
  if (event.key === "ArrowUp") state.titleIndex = Math.max(0, state.titleIndex - cols);
  if (event.key === "ArrowDown") state.titleIndex = Math.min(buttons.length - 1, state.titleIndex + cols);

  if (before !== state.titleIndex) {
    playSfx("plinkSfx");
    updateTitleMenu();
  }

  if (event.key === "Enter" || event.key === " ") {
    playSfx("plinkSfx");
    runTitleAction(state.titleIndex);
  }
}

function updateTitleMenu() {
  document.querySelectorAll("[data-title-action]").forEach((button, index) => {
    button.classList.toggle("selected", index === state.titleIndex);
  });
}

function runTitleAction(index) {
  state.titleIndex = index;
  updateTitleMenu();

  const action = document.querySelectorAll("[data-title-action]")[index]?.dataset.titleAction;

  if (action === "start") {
    showScreen("mapScreen");
    playOnly("fieldBgm");
  }

  if (action === "help") openHelp();

  if (action === "dex") {
    renderDex();
    stopAllMusic();
    showScreen("dexScreen");
  }

  if (action === "mute") toggleMute();
}

function openHelp() {
  state.helpOpen = true;
  $("helpBox").classList.remove("hidden");
}

function closeHelp() {
  state.helpOpen = false;
  $("helpBox").classList.add("hidden");
}

function handleMapKey(event) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    keysDown.add(event.key);
  }
}

function handleBattleKey(event) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "Backspace"].includes(event.key)) {
    event.preventDefault();
  }

  const options = getCurrentOptions();
  const totalChoices = options.length + 2;
  const cols = 2;
  const before = state.choiceIndex;

  if (event.key === "ArrowLeft") state.choiceIndex = Math.max(0, state.choiceIndex - 1);
  if (event.key === "ArrowRight") state.choiceIndex = Math.min(totalChoices - 1, state.choiceIndex + 1);
  if (event.key === "ArrowUp") state.choiceIndex = Math.max(0, state.choiceIndex - cols);
  if (event.key === "ArrowDown") state.choiceIndex = Math.min(totalChoices - 1, state.choiceIndex + cols);

  if (before !== state.choiceIndex) {
    playSfx("plinkSfx");
    renderBattleStep();
    scrollSelectedChoiceIntoView();
  }

  if (event.key === "Backspace") {
    playSfx("plinkSfx");
    previousStep();
  }

  if (event.key === "Enter" || event.key === " ") {
    playSfx("plinkSfx");

    if (state.choiceIndex === options.length) {
      skipStep();
    } else if (state.choiceIndex === options.length + 1) {
      runAway();
    } else {
      selectCurrentChoice();
    }
  }
}

function handleResultKey(event) {
  const buttons = [...document.querySelectorAll(".result-menu .menu-item")];

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
    event.preventDefault();
  }

  const before = state.resultIndex;

  if (event.key === "ArrowLeft") state.resultIndex = Math.max(0, state.resultIndex - 1);
  if (event.key === "ArrowRight") state.resultIndex = Math.min(buttons.length - 1, state.resultIndex + 1);
  if (event.key === "ArrowUp") state.resultIndex = Math.max(0, state.resultIndex - 2);
  if (event.key === "ArrowDown") state.resultIndex = Math.min(buttons.length - 1, state.resultIndex + 2);

  if (before !== state.resultIndex) {
    playSfx("plinkSfx");
    updateResultMenu();
  }

  if (event.key === "Enter" || event.key === " ") {
    playSfx("plinkSfx");
    buttons[state.resultIndex]?.click();
  }
}

function updateResultMenu() {
  document.querySelectorAll(".result-menu .menu-item").forEach((button, index) => {
    button.classList.toggle("selected", index === state.resultIndex);
  });
}

/* 맵 / 카메라 / 충돌 */

function handleMapImageFallback() {
  const mapImage = $("mapImage");

  mapImage.onload = () => {
    state.mapImageAvailable = true;
    $("fallbackTileMap").style.display = "none";
    mapImage.style.display = "block";
    updateMapLayout();
  };

  mapImage.onerror = () => {
    state.mapImageAvailable = false;
    mapImage.style.display = "none";
    $("fallbackTileMap").style.display = "grid";
    updateMapLayout();
  };
}

function renderFallbackMap() {
  const map = $("fallbackTileMap");
  map.innerHTML = "";

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const tile = document.createElement("div");
      tile.className = `tile ${getTileClass(x, y)}`;
      map.appendChild(tile);
    }
  }
}

function getTileClass(x, y) {
  const code = fallbackWorld[y]?.[x];

  if (code === "T") return "tree";
  if (code === "A") return "tallgrass";
  if (code === "P") return "path";
  if (code === "W") return "water";
  if (code === "H") return y <= 1 ? "roof" : "house";
  if (code === "F") return "flower";
  if (code === "R") return "rock";
  if (code === "C") return "cave";

  return "grass";
}

function updateMapLayout() {
  const stage = $("mapStage");
  const camera = $("mapCamera");

  if (!stage || !camera) return;

  const rect = stage.getBoundingClientRect();
  const stageW = rect.width || window.innerWidth;
  const stageH = rect.height || window.innerHeight;
  const isMobile = state.layout.isMobile;
  const isPortrait = state.layout.isPortrait;

  let mapW;
  let mapH;

  if (isMobile) {
    // 모바일은 맵을 크게 두고 카메라가 따라갑니다.
    // 세로는 더 크게, 가로는 조금만 크게 보여줍니다.
    const minWidthFromHeight = stageH * (COLS / ROWS);

    if (isPortrait) {
      mapW = Math.max(stageW * 2.35, minWidthFromHeight * 1.08);
    } else {
      mapW = Math.max(stageW * 1.42, minWidthFromHeight);
    }

    mapH = mapW * (ROWS / COLS);

    if (mapH < stageH * 1.03) {
      mapH = stageH * 1.03;
      mapW = mapH * (COLS / ROWS);
    }
  } else {
    // PC는 전체 맵을 게임 프레임 안에 맞춰 보여줍니다.
    mapW = stageW;
    mapH = stageH;
  }

  state.layout.stageW = stageW;
  state.layout.stageH = stageH;
  state.layout.mapW = mapW;
  state.layout.mapH = mapH;
  state.layout.tileW = mapW / COLS;
  state.layout.tileH = mapH / ROWS;

  camera.style.width = `${mapW}px`;
  camera.style.height = `${mapH}px`;

  updatePlayerPosition();
}

function updatePlayerPosition() {
  const { tileW, tileH, isMobile } = state.layout;
  if (!tileW || !tileH) return;

  const player = $("player");
  const sprite = $("playerSprite");

  const px = state.player.x * tileW + tileW / 2;
  const py = state.player.y * tileH + tileH;

  player.style.left = `${px}px`;
  player.style.top = `${py}px`;

  const width = isMobile
    ? Math.max(28, Math.min(42, tileW * 0.8))
    : Math.max(30, Math.min(46, tileW * 1.05));

  const height = isMobile
    ? Math.max(38, Math.min(56, tileH * 1.15))
    : Math.max(42, Math.min(62, tileH * 1.45));

  player.style.width = `${width}px`;
  player.style.height = `${height}px`;

  sprite.src = PLAYER_SPRITES[state.player.dir];

  updateCamera();
}

function updateCamera() {
  const camera = $("mapCamera");
  const { stageW, stageH, mapW, mapH, tileW, tileH, isMobile } = state.layout;

  if (!camera || !tileW || !tileH) return;

  if (!isMobile) {
    state.layout.cameraX = 0;
    state.layout.cameraY = 0;
    camera.style.transform = "translate3d(0, 0, 0)";
    return;
  }

  const playerPx = state.player.x * tileW + tileW / 2;
  const playerPy = state.player.y * tileH + tileH / 2;

  let cameraX = stageW / 2 - playerPx;
  let cameraY = stageH / 2 - playerPy;

  cameraX = clamp(cameraX, stageW - mapW, 0);
  cameraY = clamp(cameraY, stageH - mapH, 0);

  state.layout.cameraX = cameraX;
  state.layout.cameraY = cameraY;

  camera.style.transform = `translate3d(${cameraX}px, ${cameraY}px, 0)`;
}

function movePlayer(direction) {
  if (state.inEncounter) return;

  const delta = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };

  const [dx, dy] = delta[direction];
  state.player.dir = direction;

  tryMoveBy(dx * 0.35, dy * 0.35);
}

function tryMoveBy(dx, dy) {
  let moved = false;

  const nextX = state.player.x + dx;
  if (canStandAt(nextX, state.player.y)) {
    state.player.x = nextX;
    moved = true;
  }

  const nextY = state.player.y + dy;
  if (canStandAt(state.player.x, nextY)) {
    state.player.y = nextY;
    moved = true;
  }

  if (moved) {
    if (isEncounterArea(state.player.x, state.player.y)) {
      state.grassSteps += Math.abs(dx) + Math.abs(dy);
    } else {
      state.grassSteps = 0;
    }

    tryEncounter();
  }

  updatePlayerPosition();
}

function canStandAt(x, y) {
  const points = [
    [x, y],
    [x - PLAYER_RADIUS_X, y],
    [x + PLAYER_RADIUS_X, y],
    [x, y - PLAYER_RADIUS_Y],
    [x - PLAYER_RADIUS_X, y - PLAYER_RADIUS_Y],
    [x + PLAYER_RADIUS_X, y - PLAYER_RADIUS_Y]
  ];

  return points.every(([px, py]) => !isBlocked(px, py));
}

function isInsideRect(x, y, rect) {
  return x >= rect[0] && x <= rect[2] && y >= rect[1] && y <= rect[3];
}

function isBlocked(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;

  if (state.mapImageAvailable) {
    const inWalkable = WALKABLE_RECTS.some((rect) => isInsideRect(x, y, rect));
    const inBlocked = BLOCKED_RECTS.some((rect) => isInsideRect(x, y, rect));
    return !inWalkable || inBlocked;
  }

  return ["tree", "water", "roof", "house", "rock"].includes(getTileClass(Math.floor(x), Math.floor(y)));
}

function isEncounterArea(x, y) {
  if (state.mapImageAvailable) {
    return TALL_GRASS_RECTS.some((rect) => isInsideRect(x, y, rect));
  }

  return getTileClass(Math.floor(x), Math.floor(y)) === "tallgrass";
}

function tryEncounter() {
  if (!isEncounterArea(state.player.x, state.player.y)) return;
  if (state.grassSteps < 1.2) return;

  if (Math.random() < ENCOUNTER_RATE) {
    const quest = quests[Math.floor(Math.random() * quests.length)];
    startEncounter(quest);
  }
}

function startEncounter(quest) {
  state.inEncounter = true;
  keysDown.clear();

  $("mapDialogText").textContent = `앗! 야생의 ${quest.koreanPokemon}가 나타났다! ${quest.title} 퀘스트다!`;
  $("mapDialog").classList.remove("hidden");

  playEncounterEffect();

  setTimeout(() => {
    $("mapDialog").classList.add("hidden");
    $("flashEffect").classList.remove("hidden");

    setTimeout(() => {
      $("flashEffect").classList.add("hidden");
      startBattle(quest);
    }, 650);
  }, 1100);
}

/* 배틀 */

function startBattle(quest) {
  state.currentQuest = quest;
  state.currentStep = 0;
  state.choiceIndex = 0;
  state.selected = {};
  state.finalScore = 0;
  state.finalPrompt = "";

  $("enemyPokemonName").textContent = quest.koreanPokemon;
  $("badPromptText").textContent = quest.badPrompt;
  $("battleMessage").textContent = `야생의 ${quest.koreanPokemon}가 나타났다! 막연한 요청을 좋은 프롬프트로 바꿔라!`;

  setPokemonSprite("enemyPokemonSprite", "enemyFallback", quest.pokemon, "front");

  renderBattleStep();
  updateScoreHp();

  showScreen("battleScreen");
  playOnly("battleBgm");
}

function getCurrentOptions() {
  const category = categories[state.currentStep];
  return state.currentQuest.cards[category.key] || [];
}

function renderBattleStep() {
  const category = categories[state.currentStep];
  const options = getCurrentOptions();

  $("currentStepText").textContent = `${category.label} 카드 선택`;
  $("scoreText").textContent = `${calculateScore().total}점`;

  const choiceList = $("choiceList");
  choiceList.innerHTML = "";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = `${index + 1}. ${option}`;
    button.classList.toggle("selected", state.choiceIndex === index);
    button.addEventListener("click", () => {
      state.choiceIndex = index;
      playSfx("plinkSfx");
      selectCurrentChoice();
    });
    choiceList.appendChild(button);
  });

  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "choice-btn";
  skip.textContent = category.score === 0 ? "완료" : "건너뛰기";
  skip.classList.toggle("selected", state.choiceIndex === options.length);
  skip.addEventListener("click", () => {
    playSfx("plinkSfx");
    skipStep();
  });
  choiceList.appendChild(skip);

  const run = document.createElement("button");
  run.type = "button";
  run.className = "choice-btn run-away";
  run.textContent = "도망가기";
  run.classList.toggle("selected", state.choiceIndex === options.length + 1);
  run.addEventListener("click", () => {
    playSfx("plinkSfx");
    runAway();
  });
  choiceList.appendChild(run);

  const message = category.score > 0
    ? `${category.label} 카드는 ${category.score}점이다. 한 장을 골라라!`
    : `${category.label} 카드는 보조 카드다. 선택하면 더 좋아진다!`;

  $("battleMessage").textContent = message;
}

function scrollSelectedChoiceIntoView() {
  const selected = document.querySelector(".choice-btn.selected");
  if (selected) {
    selected.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function selectCurrentChoice() {
  const category = categories[state.currentStep];
  const options = getCurrentOptions();
  const value = options[state.choiceIndex];

  if (!value) {
    skipStep();
    return;
  }

  state.selected[category.key] = value;
  assemblePrompt();

  $("battleMessage").textContent = `${category.label} 카드를 선택했다!`;
  playAttackMotion(() => {
    goNextStepSoon();
  });
}

function playAttackMotion(done) {
  const player = $("playerPokemonSprite");
  const enemy = $("enemyPokemonSprite") || $("enemyFallback");

  player.classList.remove("attack-motion");
  enemy.classList.remove("hit-shake");

  void player.offsetWidth;
  void enemy.offsetWidth;

  player.classList.add("attack-motion");

  setTimeout(() => {
    playSfx("hitSfx");
    enemy.classList.add("hit-shake");
  }, 130);

  setTimeout(() => {
    player.classList.remove("attack-motion");
    enemy.classList.remove("hit-shake");
    done();
  }, 430);
}

function skipStep() {
  const category = categories[state.currentStep];
  delete state.selected[category.key];

  assemblePrompt();
  goNextStepSoon();
}

function previousStep() {
  if (state.currentStep <= 0) return;

  state.currentStep -= 1;
  state.choiceIndex = 0;
  renderBattleStep();
}

function goNextStepSoon() {
  setTimeout(() => {
    if (state.currentStep < categories.length - 1) {
      state.currentStep += 1;
      state.choiceIndex = 0;
      renderBattleStep();
      updateScoreHp();
    } else {
      judgeBattle();
    }
  }, 170);
}

function assemblePrompt() {
  const lines = [];

  categories.forEach((category) => {
    const text = state.selected[category.key];

    if (text) {
      lines.push(`[${category.label}]\n${text}`);
    }
  });

  state.finalPrompt = lines.join("\n\n");
  updateScoreHp();
}

function calculateScore() {
  let total = 0;
  const breakdown = [];

  categories.forEach((category) => {
    if (category.score === 0) return;

    const success = Boolean(state.selected[category.key]);

    if (success) total += category.score;

    breakdown.push({
      label: category.label,
      score: success ? category.score : 0,
      max: category.score,
      success
    });
  });

  return { total, breakdown };
}

function updateScoreHp() {
  const result = calculateScore();
  const hp = Math.max(0, 100 - result.total);

  $("scoreText").textContent = `${result.total}점`;
  $("enemyHpFill").style.width = `${hp}%`;
  $("enemyHpText").textContent = `${hp} / 100`;
}

function judgeBattle() {
  if (!state.finalPrompt.trim()) {
    showToast("프롬프트가 비어 있습니다.");
    return;
  }

  const result = calculateScore();

  state.finalScore = result.total;

  renderResult(result);
  playVictory();
  showScreen("resultScreen");
}

function renderResult(result) {
  const score = result.total;
  const hp = Math.max(0, 100 - score);

  $("resultTitle").textContent = score >= 90
    ? "완벽 승리!"
    : score >= 70
      ? "승리!"
      : "조금 더 훈련하자!";

  $("finalScoreText").textContent = `${score}점`;
  $("resultHpText").textContent = `${hp} / 100`;
  $("finalPromptText").textContent = state.finalPrompt;

  const area = $("breakdownArea");
  area.innerHTML = "";

  result.breakdown.forEach((item) => {
    const div = document.createElement("div");
    div.className = item.success ? "breakdown-item" : "breakdown-item missing";
    div.textContent = item.success ? `${item.label} +${item.score}` : `${item.label} 0`;
    area.appendChild(div);
  });
}

function runAway() {
  $("battleMessage").textContent = "무사히 도망쳤다! 맵으로 돌아간다.";
  playSfx("runAwaySfx");

  setTimeout(() => {
    returnToMap();
  }, 1200);
}

/* 결과 이후 */

async function copyAndReturnMap() {
  await copyText(state.finalPrompt);
  $("copyModal").classList.remove("hidden");

  setTimeout(() => {
    $("copyModal").classList.add("hidden");
    returnToMap();
  }, 1500);
}

function returnToMap() {
  state.inEncounter = false;
  state.grassSteps = 0;
  keysDown.clear();
  showScreen("mapScreen");
  playOnly("fieldBgm");
}

/* LLM 실험 */

function showExperiment() {
  $("experimentBadPrompt").textContent = state.currentQuest.badPrompt;
  $("experimentGoodPrompt").textContent = state.finalPrompt;
  $("badResultInput").value = "";
  $("goodResultInput").value = "";
  $("compareBox").classList.add("hidden");

  showScreen("experimentScreen");
}

function showComparison() {
  const bad = $("badResultInput").value.trim();
  const good = $("goodResultInput").value.trim();

  const rows = [
    ["구체성", "앱 종류만 말해서 대부분 추측해야 합니다.", "역할, 목표, 대상, 기능, 화면 조건이 들어 있어 요구가 분명합니다."],
    ["기능 포함 여부", "필요 기능이 빠질 가능성이 큽니다.", state.selected.features || "기능 카드가 빠져 있습니다."],
    ["다시 질문해야 하는 정도", `질문 표시 ${countQuestions(bad)}개`, `질문 표시 ${countQuestions(good)}개`],
    ["바로 사용 가능성", "결과가 짧거나 방향이 빗나갈 수 있습니다.", "출력 형식이 정해져 있어 바로 복사해 쓰기 좋습니다."],
    ["수업 활용 가능성", "학생 수준과 교실 상황이 빠져 있습니다.", state.selected.target || "대상 카드가 빠져 있습니다."]
  ];

  $("compareTableBody").innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row[0])}</td>
      <td>${escapeHtml(row[1])}</td>
      <td>${escapeHtml(row[2])}</td>
    </tr>
  `).join("");

  $("compareSummary").textContent =
    "좋은 프롬프트는 LLM에게 추측할 여지를 줄이고, 필요한 기능과 화면을 분명히 알려 주기 때문에 결과가 더 구체적입니다.";

  $("compareBox").classList.remove("hidden");
}

function countQuestions(text) {
  return (text.match(/[?？]/g) || []).length;
}

/* 도감 */

function saveCurrentPrompt() {
  if (!state.finalPrompt) {
    showToast("저장할 프롬프트가 없습니다.");
    return;
  }

  const list = loadDex();

  list.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: state.currentQuest.title,
    pokemon: state.currentQuest.koreanPokemon,
    score: state.finalScore,
    prompt: state.finalPrompt,
    createdAt: new Date().toLocaleString("ko-KR")
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  showToast("도감에 저장했습니다.");
}

function loadDex() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function renderDex() {
  const list = loadDex();
  const box = $("dexList");

  if (list.length === 0) {
    box.innerHTML = `<div class="dex-empty">아직 저장된 프롬프트가 없습니다.</div>`;
    return;
  }

  box.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "dex-item";

    card.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <small>${escapeHtml(item.createdAt)} · ${escapeHtml(item.pokemon)} · ${item.score}점</small>
      <pre>${escapeHtml(item.prompt)}</pre>
      <div class="dex-actions">
        <button data-action="copy" type="button">복사</button>
        <button data-action="delete" type="button">삭제</button>
      </div>
    `;

    card.querySelector('[data-action="copy"]').addEventListener("click", () => copyText(item.prompt));

    card.querySelector('[data-action="delete"]').addEventListener("click", () => {
      const next = loadDex().filter((saved) => saved.id !== item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      renderDex();
    });

    box.appendChild(card);
  });
}

/* 공통 */

async function copyText(text) {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }

  showToast("복사가 완료되었습니다.");
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
