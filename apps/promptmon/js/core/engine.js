import {
  normalizeCardOption,
  buildPromptFromSelection,
  calculatePromptScore,
  buildCardFeedback,
  buildBadPromptAnalysis,
  buildComparisonGuide
} from "../battle/promptBuilder.js?v=learning1";

const STORAGE_KEY = "promptmon_responsive_camera_final_v1";
const COLS = 30;
const ROWS = 20;
const ENCOUNTER_RATE = 0.25;

const MOVE_SPEED = 5.3;
const PLAYER_RADIUS_X = 0.18;
const PLAYER_RADIUS_Y = 0.16;

const PLAYER_SPRITES = {
  down: [
    "./assets/trainer_down_1.png",
    "./assets/trainer_down_2.png",
    "./assets/trainer_down_3.png",
    "./assets/trainer_down_4.png"
  ],
  up: [
    "./assets/trainer_up_1.png",
    "./assets/trainer_up_2.png",
    "./assets/trainer_up_3.png",
    "./assets/trainer_up_4.png"
  ],
  left: [
    "./assets/trainer_left_1.png",
    "./assets/trainer_left_2.png",
    "./assets/trainer_left_3.png",
    "./assets/trainer_left_4.png"
  ],
  right: [
    "./assets/trainer_right_1.png",
    "./assets/trainer_right_2.png",
    "./assets/trainer_right_3.png",
    "./assets/trainer_right_4.png"
  ]
};

// Legacy engine note.
// Legacy engine note.
// Legacy engine note.
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

const categories = window.PROMPTMON_DATA.categories;
const quests = window.PROMPTMON_DATA.quests;
const encounterZones = window.PROMPTMON_DATA.encounterZones;
const maps = window.PROMPTMON_DATA.maps || {};
const MAPS = maps;


const state = {
  screen: "titleScreen",
  titleIndex: 0,
  resultIndex: 0,
  dexIndex: 0,
  muted: false,
  helpOpen: false,
  debugGrid: false,
  player: { x: 11.0, y: 9.8, dir: "up" },
  inEncounter: false,
  grassSteps: 0,
  walkDistance: 0,
  stepMove: null,
  playerWalking: false,
  playerFrameIndex: 0,
  playerFrameTime: 0,
  lastMoveKey: "",
  professorDialogIndex: 0,
  currentQuest: null,
  currentStep: 0,
  choiceIndex: 0,
  selected: {},
  finalScore: 0,
  finalPrompt: "",
  mapId: "professor-lab",
  mapImageAvailable: true,
  transitionCooldown: 0,
  pendingPortalSpawn: null,
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
let titleAudioStarted = false;
let currentMusicId = "";

const $ = (id) => document.getElementById(id);

function currentMap() {
  return maps[state.mapId] || maps["professor-lab"] || maps["vague-village"] || null;
}

function mapCols() {
  return currentMap()?.cols || COLS;
}

function mapRows() {
  return currentMap()?.rows || ROWS;
}

function loadMap(mapId, spawn) {
  const nextMap = maps[mapId];
  if (!nextMap) return;

  state.mapId = mapId;
  const portalSpawn = spawn?.portalId ? spawn : null;
  const start = portalSpawn?.fallback || spawn || nextMap.start || { x: mapCols() / 2, y: mapRows() / 2, dir: "down" };

  state.player.x = start.x;
  state.player.y = start.y;
  state.player.dir = start.dir || "down";
  state.pendingPortalSpawn = portalSpawn ? {
    portalId: portalSpawn.portalId,
    portalSide: portalSpawn.portalSide || "",
    hint: portalSpawn.hint || null,
    dir: portalSpawn.dir || start.dir || "down"
  } : null;
  state.inEncounter = false;
  state.grassSteps = 0;
  state.stepMove = null;
  state.transitionCooldown = 0.45;
  keysDown.clear();

  const mapImage = $("mapImage");
  if (mapImage && mapImage.getAttribute("src") !== nextMap.src) {
    collisionReady = false;
    collisionMaskReady = false;
    mapImage.src = nextMap.src;
  } else {
    buildCollisionMaskCanvas(nextMap);
  }

  updatePlaceName();
  updateMapLayout();
  if (state.screen === "mapScreen") playMapMusic();
}

function init() {
  if (window.PROMPTMON_BOOTED) return;
  window.PROMPTMON_BOOTED = true;

  const mapImage = $("mapImage");
  const firstMap = currentMap();
  if (mapImage && firstMap) mapImage.src = firstMap.src;

  updateDeviceMode();
  renderFallbackMap();
  bindEvents();
  preloadTitlePokemon();
  loadPlayerBattlePokemon();
  handleMapImageFallback();
  updateMapLayout();
  showScreen("titleScreen");
  requestIntroAutoplay();
}

function bindEvents() {
  document.addEventListener("pointerdown", startTitleAudioFromGesture, { capture: true });
  document.addEventListener("keydown", startTitleAudioFromGesture, { capture: true });
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

  $("professorNpc")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (state.screen === "mapScreen" && isNearProfessor()) {
      showProfessorDialog();
    }
  });

  $("mapDialog")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (state.screen === "mapScreen" && !$("mapDialog").classList.contains("hidden")) {
      showProfessorDialog();
    }
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

/* Legacy engine note. */


/* removed duplicate function updateDeviceMode; final definition kept below */


/* ?붾㈃ */


/* removed duplicate function showScreen; final definition kept below */


/* ?뚯븙 / ?④낵??*/

function audioIds() {
  return ["introBgm", "fieldBgm", "labBgm", "vagueBgm", "codingBgm", "artBgm", "soundBgm", "battleBgm", "victoryBgm"];
}

function stopAllMusic() {
  audioIds().forEach((id) => {
    const audio = $(id);
    audio.pause();
    audio.currentTime = 0;
  });
  currentMusicId = "";
}

function playOnly(id) {
  const audio = $(id);
  if (currentMusicId === id && audio && !audio.paused) return;

  stopAllMusic();

  if (state.muted) return;

  if (!audio) return;
  audio.volume = id === "battleBgm" ? 0.56 : 0.45;
  audio.currentTime = 0;
  return audio.play()
    .then(() => {
      currentMusicId = id;
    })
    .catch(() => showToast("오디오 재생이 차단되었습니다. 화면을 한 번 클릭한 뒤 다시 선택하세요."));
}

function playMapMusic() {
  const id = currentMap()?.bgm || "fieldBgm";
  playOnly($(id) ? id : "fieldBgm");
}

function requestIntroAutoplay() {
  if (state.muted || state.screen !== "titleScreen") return;

  const audio = $("introBgm");
  if (!audio) return;

  audio.volume = 0.45;
  audio.currentTime = 0;
  audio.play()
    .then(() => {
      titleAudioStarted = true;
      currentMusicId = "introBgm";
    })
    .catch(() => {
      titleAudioStarted = false;
    });
}

function startTitleAudioFromGesture() {
  if (titleAudioStarted || state.muted || state.screen !== "titleScreen") return;

  titleAudioStarted = true;
  const audio = $("introBgm");
  if (!audio) return;

  audio.volume = 0.45;
  audio.play()
    .then(() => {
      currentMusicId = "introBgm";
    })
    .catch(() => {
      titleAudioStarted = false;
    });
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
  muteButton.textContent = state.muted ? "소리 켜기" : "소리 끄기";

  if (state.muted) {
    stopAllMusic();
    return;
  }

  if (state.screen === "titleScreen") playOnly("introBgm");
  if (state.screen === "mapScreen") playMapMusic();
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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);
  const pokemonName = encodeURIComponent(String(name || "").trim().toLowerCase());

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, {
    signal: controller.signal
  }).finally(() => window.clearTimeout(timeout));

  if (!response.ok) throw new Error("PokeAPI 연결 실패");
  return response.json();
}

const POKEMON_SPRITE_FALLBACKS = {
  bulbasaur: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif", "https://play.pokemonshowdown.com/sprites/ani/bulbasaur.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/1.gif", "https://play.pokemonshowdown.com/sprites/ani-back/bulbasaur.gif"]
  },
  pikachu: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif", "https://play.pokemonshowdown.com/sprites/ani/pikachu.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/25.gif", "https://play.pokemonshowdown.com/sprites/ani-back/pikachu.gif"]
  },
  jigglypuff: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/39.gif", "https://play.pokemonshowdown.com/sprites/ani/jigglypuff.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/39.gif", "https://play.pokemonshowdown.com/sprites/ani-back/jigglypuff.gif"]
  },
  porygon: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/137.gif", "https://play.pokemonshowdown.com/sprites/ani/porygon.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/137.gif", "https://play.pokemonshowdown.com/sprites/ani-back/porygon.gif"]
  },
  rotom: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/479.gif", "https://play.pokemonshowdown.com/sprites/ani/rotom.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/479.gif", "https://play.pokemonshowdown.com/sprites/ani-back/rotom.gif"]
  },
  eevee: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif", "https://play.pokemonshowdown.com/sprites/ani/eevee.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/133.gif", "https://play.pokemonshowdown.com/sprites/ani-back/eevee.gif"]
  },
  snorlax: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/143.gif", "https://play.pokemonshowdown.com/sprites/ani/snorlax.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/143.gif", "https://play.pokemonshowdown.com/sprites/ani-back/snorlax.gif"]
  },
  loudred: {
    front: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/294.gif", "https://play.pokemonshowdown.com/sprites/ani/loudred.gif"],
    back: ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/294.gif", "https://play.pokemonshowdown.com/sprites/ani-back/loudred.gif"]
  }
};

function fallbackPokemonSprites(name, direction = "front") {
  const key = String(name || "").toLowerCase();
  const sprites = POKEMON_SPRITE_FALLBACKS[key]?.[direction] || POKEMON_SPRITE_FALLBACKS[key]?.front || [];
  return Array.isArray(sprites) ? sprites : [sprites].filter(Boolean);
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

async function setPokemonSprite(imgId, fallbackId, pokemon, direction = "front", fallbackLabel = pokemon) {
  const img = $(imgId);
  const fallback = fallbackId ? $(fallbackId) : null;
  const hardcoded = fallbackPokemonSprites(pokemon, direction);

  if (!img) return;

  img.classList.add("hidden");
  if (fallback) {
    fallback.textContent = String(fallbackLabel || pokemon || "몬");
    fallback.classList.remove("hidden");
  }

  const showImage = () => {
    img.classList.remove("hidden");
    if (fallback) fallback.classList.add("hidden");
  };

  const showFallback = () => {
    img.classList.add("hidden");
    if (fallback) fallback.classList.remove("hidden");
  };

  const tryCandidates = (sources, index = 0) => {
    const src = sources[index];
    if (!src) {
      showFallback();
      return;
    }

    img.onload = showImage;
    img.onerror = () => tryCandidates(sources, index + 1);
    img.src = src;
    if (img.complete && img.naturalWidth > 0) showImage();
  };

  if (hardcoded.length) {
    tryCandidates(hardcoded);
  }

  try {
    const data = await fetchPokemon(pokemon);
    const sprite = direction === "back" ? getBackSprite(data) : getFrontSprite(data);

    if (!sprite) throw new Error("스프라이트 없음");

    img.onload = showImage;

    img.onerror = () => {
      if (hardcoded.length) {
        tryCandidates(hardcoded);
        return;
      }
      showFallback();
    };

    img.src = sprite;
    if (img.complete && img.naturalWidth > 0) showImage();
  } catch {
    if (hardcoded.length) {
      tryCandidates(hardcoded);
      return;
    }
    showFallback();
  }
}

async function preloadTitlePokemon() {
  const list = [
    ["titlePokemonLeft", "eevee"],
    ["titlePokemonCenter", "pikachu"],
    ["titlePokemonRight", "snorlax"]
  ];

  list.forEach(([id, name]) => setPokemonSprite(id, null, name, "front"));
}

function loadPlayerBattlePokemon() {
  setPokemonSprite("playerPokemonSprite", "playerFallback", "pikachu", "back", "프롬프트몬");
}

/* ?ㅻ낫??/ ?곗튂 */

function handleKeydown(event) {
  if (event.key.toLowerCase() === "g" && state.screen === "mapScreen") {
    event.preventDefault();
    toggleGridDebug();
    return;
  }

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
  else if (state.screen === "dexScreen") handleDexKey(event);
}

function handleKeyup(event) {
  const key = normalizeMoveKey(event.key);
  if (key) {
    keysDown.delete(key);
    if (state.lastMoveKey === key) state.lastMoveKey = [...keysDown].at(-1) || "";
  }
}

function startMobileMove(direction) {
  if (state.screen !== "mapScreen") return;

  const key = directionToKey(direction);
  if (key) {
    keysDown.add(key);
    state.lastMoveKey = key;
    state.player.dir = direction;
    updatePlayerPosition();
  }
}

function stopMobileMove(direction) {
  const key = directionToKey(direction);
  if (key) {
    keysDown.delete(key);
    if (state.lastMoveKey === key) state.lastMoveKey = [...keysDown].at(-1) || "";
  }
}

function directionToKey(direction) {
  if (direction === "up") return "ArrowUp";
  if (direction === "down") return "ArrowDown";
  if (direction === "left") return "ArrowLeft";
  if (direction === "right") return "ArrowRight";
  return "";
}

function normalizeMoveKey(key) {
  const normalized = key.toLowerCase();

  if (key === "ArrowUp" || normalized === "w") return "ArrowUp";
  if (key === "ArrowDown" || normalized === "s") return "ArrowDown";
  if (key === "ArrowLeft" || normalized === "a") return "ArrowLeft";
  if (key === "ArrowRight" || normalized === "d") return "ArrowRight";
  return "";
}

function gameLoop(time) {
  const dt = Math.min(0.05, (time - lastFrameTime) / 1000 || 0);
  lastFrameTime = time;

  if (state.screen === "mapScreen" && !state.inEncounter) {
    state.transitionCooldown = Math.max(0, state.transitionCooldown - dt);
    updateMapMovement(dt);
    updateSmoothMovement(dt);
    updatePlayerAnimation(dt);
  }

  requestAnimationFrame(gameLoop);
}

function updateSmoothMovement(dt) {
  if (!state.stepMove) return;

  const move = state.stepMove;
  move.elapsed += dt;

  const t = clamp(move.elapsed / move.duration, 0, 1);
  const eased = t;

  state.player.x = move.fromX + (move.toX - move.fromX) * eased;
  state.player.y = move.fromY + (move.toY - move.fromY) * eased;
  updatePlayerPosition();

  if (t >= 1) {
    state.player.x = move.toX;
    state.player.y = move.toY;
    state.stepMove = null;
    setPlayerWalking(false);
    completePlayerStep();
  }
}

function continueHeldMovement() {
  if (state.stepMove || state.inEncounter) return;

  const key = state.lastMoveKey && keysDown.has(state.lastMoveKey)
    ? state.lastMoveKey
    : [...keysDown].at(-1);

  if (key) movePlayer(keyToDirection(key));
}

function updateMapMovement(dt) {
  if (state.stepMove || state.inEncounter) {
    return;
  }

  const active = [...keysDown].filter(Boolean);
  if (!active.length) {
    setPlayerWalking(false);
    return;
  }

  const key = state.lastMoveKey && keysDown.has(state.lastMoveKey)
    ? state.lastMoveKey
    : active.at(-1);

  const direction = keyToDirection(key);
  movePlayer(direction);
}

function setPlayerWalking(isWalking) {
  if (state.playerWalking === isWalking) return;

  state.playerWalking = isWalking;
  state.playerFrameTime = 0;
  state.playerFrameIndex = 0;
  $("player")?.classList.toggle("walking", isWalking);
  updatePlayerSprite();
}

function updatePlayerAnimation(dt) {
  if (!state.playerWalking) return;

  state.playerFrameTime += dt;
  if (state.playerFrameTime < 0.055) return;

  state.playerFrameTime = 0;
  state.playerFrameIndex = (state.playerFrameIndex + 1) % 4;
  updatePlayerSprite();
}

function updatePlayerSprite() {
  const sprite = $("playerSprite");
  if (!sprite) return;

  const frames = PLAYER_SPRITES[state.player.dir] || PLAYER_SPRITES.down;
  const frameIndex = state.playerWalking ? state.playerFrameIndex : 0;
  const nextSrc = frames[frameIndex] || frames[0];
  if (sprite.getAttribute("src") !== nextSrc) {
    sprite.src = nextSrc;
  }
}

function movePlayerBy(dx, dy) {
  const beforeX = state.player.x;
  const beforeY = state.player.y;

  const nextX = state.player.x + dx;
  if (canStandAt(nextX, state.player.y)) {
    state.player.x = nextX;
  }

  const nextY = state.player.y + dy;
  if (canStandAt(state.player.x, nextY)) {
    state.player.y = nextY;
  }

  return Math.hypot(state.player.x - beforeX, state.player.y - beforeY);
}

function handleTitleKey(event) {
  const buttons = [...document.querySelectorAll("[data-title-action]")];
  const cols = 2;
  const moveKey = normalizeMoveKey(event.key);

  if (moveKey || ["Enter", " "].includes(event.key)) {
    event.preventDefault();
  }

  const before = state.titleIndex;

  if (moveKey) {
    state.titleIndex = moveGridIndex(state.titleIndex, moveKey, buttons.length, cols);
  }

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
    playMapMusic();
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
  const key = normalizeMoveKey(event.key);

  if (key) {
    event.preventDefault();
    keysDown.add(key);
    state.lastMoveKey = key;
    state.player.dir = keyToDirection(key);
    updatePlayerPosition();
    return;
  }

  if (["Enter", " "].includes(event.key) && isNearProfessor()) {
    event.preventDefault();
    playSfx("plinkSfx");
    showProfessorDialog();
  }
}

function handleBattleKey(event) {
  const moveKey = normalizeMoveKey(event.key);

  if (moveKey || ["Enter", " ", "Backspace"].includes(event.key)) {
    event.preventDefault();
  }

  const options = getCurrentOptions();
  const totalChoices = options.length + 2;
  const cols = 1;
  const before = state.choiceIndex;

  if (moveKey) {
    if (moveKey === "ArrowUp" || moveKey === "ArrowDown") {
      state.choiceIndex = moveGridIndex(state.choiceIndex, moveKey, totalChoices, cols);
    }
  }

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
  const moveKey = normalizeMoveKey(event.key);

  if (moveKey || ["Enter", " "].includes(event.key)) {
    event.preventDefault();
  }

  const before = state.resultIndex;

  if (moveKey) {
    state.resultIndex = moveGridIndex(state.resultIndex, moveKey, buttons.length, 2);
  }

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

function moveGridIndex(index, key, total, cols) {
  if (total <= 0) return 0;

  const rows = Math.ceil(total / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  const rowStart = row * cols;
  const rowEnd = Math.min(rowStart + cols, total) - 1;

  if (key === "ArrowLeft") return index <= rowStart ? rowEnd : index - 1;
  if (key === "ArrowRight") return index >= rowEnd ? rowStart : index + 1;

  if (key === "ArrowUp") {
    let next = index - cols;
    if (next < 0) {
      const lastRowStart = (rows - 1) * cols;
      next = lastRowStart + col;
      if (next >= total) next -= cols;
    }
    return next;
  }

  if (key === "ArrowDown") {
    const next = index + cols;
    return next >= total ? col : next;
  }

  return index;
}

/* Legacy engine note. */


/* removed duplicate function handleMapImageFallback; final definition kept below */


function renderFallbackMap() {
  const map = $("fallbackTileMap");
  map.innerHTML = "";

  for (let y = 0; y < mapRows(); y++) {
    for (let x = 0; x < mapCols(); x++) {
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


/* removed duplicate function updateMapLayout; final definition kept below */


function updatePlayerPosition() {
  const { tileW, tileH, isMobile } = state.layout;
  if (!tileW || !tileH) return;

  const player = $("player");
  const indoor = currentMap()?.indoor;

  const px = state.player.x * tileW + tileW / 2;
  const py = state.player.y * tileH + tileH;

  player.style.left = `${px}px`;
  player.style.top = `${py}px`;

  const width = indoor
    ? Math.max(46, Math.min(72, tileW * 1.55))
    : isMobile
      ? Math.max(28, Math.min(42, tileW * 0.8))
      : Math.max(30, Math.min(46, tileW * 1.05));

  const height = indoor
    ? Math.max(62, Math.min(96, tileH * 2.05))
    : isMobile
      ? Math.max(38, Math.min(56, tileH * 1.15))
      : Math.max(42, Math.min(62, tileH * 1.45));

  player.style.width = `${width}px`;
  player.style.height = `${height}px`;

  updatePlayerSprite();

  updateProfessorPosition();
  updatePortalLayer();
  updateGridDebug();
  updatePlaceName();
  updateCamera();
}

function updatePortalLayer() {
  const layer = $("portalLayer");
  const { tileW, tileH } = state.layout;
  const exits = currentMap()?.exits || [];

  if (!layer || !tileW || !tileH) return;

  const signature = `${state.mapId}:${tileW.toFixed(2)}:${tileH.toFixed(2)}`;
  if (layer.dataset.signature === signature) return;

  layer.dataset.signature = signature;
  layer.innerHTML = "";

  exits.forEach((exit) => {
    const x0 = Math.floor(exit.rect[0]);
    const y0 = Math.floor(exit.rect[1]);
    const x1 = Math.ceil(exit.rect[2]);
    const y1 = Math.ceil(exit.rect[3]);
    const marker = document.createElement("div");
    marker.className = "portal-marker";
    marker.style.left = `${x0 * tileW}px`;
    marker.style.top = `${y0 * tileH}px`;
    marker.style.width = `${Math.max(1, x1 - x0) * tileW}px`;
    marker.style.height = `${Math.max(1, y1 - y0) * tileH}px`;
    layer.appendChild(marker);
  });
}

function toggleGridDebug() {
  state.debugGrid = !state.debugGrid;
  updateGridDebug();
}

function ensureGridDebugElements() {
  const camera = $("mapCamera");
  const stage = $("mapStage");
  if (!camera || !stage) return {};

  let canvas = $("gridDebugCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "gridDebugCanvas";
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = "30";
    canvas.style.pointerEvents = "none";
    canvas.style.imageRendering = "pixelated";
    camera.appendChild(canvas);
  }

  let panel = $("gridDebugPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "gridDebugPanel";
    panel.style.position = "absolute";
    panel.style.left = "10px";
    panel.style.top = "10px";
    panel.style.zIndex = "80";
    panel.style.padding = "8px 10px";
    panel.style.border = "2px solid rgba(255,255,255,0.9)";
    panel.style.background = "rgba(0,0,0,0.72)";
    panel.style.color = "#fff";
    panel.style.font = "12px/1.35 monospace";
    panel.style.whiteSpace = "pre";
    panel.style.pointerEvents = "none";
    stage.appendChild(panel);
  }

  return { canvas, panel };
}

function updateGridDebug() {
  const { canvas, panel } = ensureGridDebugElements();
  if (!canvas || !panel) return;

  canvas.style.display = state.debugGrid && state.screen === "mapScreen" ? "block" : "none";
  panel.style.display = state.debugGrid && state.screen === "mapScreen" ? "block" : "none";
  if (!state.debugGrid || state.screen !== "mapScreen") return;

  drawGridDebug(canvas, panel);
}

function drawGridDebug(canvas, panel) {
  const map = currentMap();
  const { mapW, mapH, tileW, tileH } = state.layout;
  const cols = mapCols();
  const rows = mapRows();
  if (!map || !mapW || !mapH || !tileW || !tileH) return;

  canvas.width = Math.round(mapW);
  canvas.height = Math.round(mapH);
  canvas.style.width = `${mapW}px`;
  canvas.style.height = `${mapH}px`;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.fillStyle = "rgba(255, 0, 0, 0.28)";
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!isBlocked(col, row)) continue;
      ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
    }
  }

  ctx.fillStyle = "rgba(0, 110, 255, 0.32)";
  ctx.strokeStyle = "rgba(0, 150, 255, 0.95)";
  ctx.lineWidth = 2;
  ctx.font = "10px monospace";
  ctx.textBaseline = "top";
  getCurrentPortals(map).forEach((portal) => {
    if (Array.isArray(portal.tiles) && portal.tiles.length) {
      portal.tiles.forEach((tile) => {
        const x = tile.x * tileW;
        const y = tile.y * tileH;
        ctx.fillRect(x, y, tileW, tileH);
        ctx.strokeRect(x, y, tileW, tileH);
      });
      const labelTile = portal.tiles[0];
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(`${portal.id}->${portal.toMap}`, labelTile.x * tileW + 3, labelTile.y * tileH + 3);
      ctx.fillStyle = "rgba(0, 110, 255, 0.32)";
      return;
    }
    const x = portal.x1 * tileW;
    const y = portal.y1 * tileH;
    const w = Math.max(1, portal.x2 - portal.x1 + 1) * tileW;
    const h = Math.max(1, portal.y2 - portal.y1 + 1) * tileH;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(`${portal.id}->${portal.toMap}`, x + 3, y + 3);
    ctx.fillStyle = "rgba(0, 110, 255, 0.32)";
  });

  ctx.strokeStyle = "rgba(255, 255, 255, 0.48)";
  ctx.lineWidth = 1;
  for (let col = 0; col <= cols; col += 1) {
    const x = Math.round(col * tileW) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, mapH);
    ctx.stroke();
  }
  for (let row = 0; row <= rows; row += 1) {
    const y = Math.round(row * tileH) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(mapW, y);
    ctx.stroke();
  }

  ctx.font = "9px monospace";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.lineWidth = 3;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const text = `${col},${row}`;
      const x = col * tileW + 2;
      const y = row * tileH + 2;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }
  }

  const metrics = getPlayerDebugMetrics();
  ctx.fillStyle = "rgba(255, 255, 0, 0.95)";
  ctx.beginPath();
  ctx.arc(metrics.footX, metrics.footY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.stroke();
  ctx.restore();

  const readyPortal = getReadyPortal();
  const collisionSource = getCollisionDebugSource(map);
  panel.textContent = [
    `currentMapId: ${state.mapId}`,
    `collision: ${collisionSource}`,
    `tileSize: ${tileW.toFixed(2)} x ${tileH.toFixed(2)}`,
    `cols,rows: ${cols},${rows}`,
    `worldX,Y: ${metrics.worldX.toFixed(1)}, ${metrics.worldY.toFixed(1)}`,
    `playerW,H: ${metrics.width.toFixed(1)}, ${metrics.height.toFixed(1)}`,
    `footX,Y: ${metrics.footX.toFixed(1)}, ${metrics.footY.toFixed(1)}`,
    `tileX,Y: ${metrics.tileX}, ${metrics.tileY}`,
    `footTile: ${metrics.worldTileX.toFixed(2)}, ${metrics.worldTileY.toFixed(2)}`,
    `facing: ${state.player.dir}`,
    readyPortal ? `PORTAL READY: ${readyPortal.id} -> ${readyPortal.toMap}` : "PORTAL READY: no"
  ].join("\n");
}

function updateCamera() {
  const camera = $("mapCamera");
  const { stageW, stageH, mapW, mapH, tileW, tileH } = state.layout;

  if (!camera || !tileW || !tileH) return;

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
  if (state.inEncounter || state.stepMove) return;

  const delta = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };

  const [dx, dy] = delta[direction];
  state.player.dir = direction;

  const fromX = state.player.x;
  const fromY = state.player.y;
  const baseX = Math.round(fromX);
  const baseY = Math.round(fromY);
  const toX = baseX + dx;
  const toY = baseY + dy;

  if (canStandAt(toX, toY)) {
    state.stepMove = {
      fromX,
      fromY,
      toX,
      toY,
      elapsed: 0,
      duration: currentMap()?.indoor ? 0.12 : 0.14
    };
    setPlayerWalking(true);
  } else {
    setPlayerWalking(false);
  }

  updatePlayerPosition();
}

function keyToDirection(key) {
  if (key === "ArrowUp") return "up";
  if (key === "ArrowDown") return "down";
  if (key === "ArrowLeft") return "left";
  if (key === "ArrowRight") return "right";
  return "down";
}

function completePlayerStep() {
  if (checkMapTransition()) {
    updatePlayerPosition();
    return;
  }

  if (isEncounterArea(state.player.x, state.player.y)) {
    state.grassSteps += 1;
  } else {
    state.grassSteps = 0;
  }

  tryEncounter();
  updatePlayerPosition();
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
    checkMapTransition();
  }

  updatePlayerPosition();
}

function checkMapTransition() {
  if (state.inEncounter) return false;
  if (state.transitionCooldown > 0) return false;

  const map = currentMap();

  const gridRoute = findGridPortalRoute(state.player.x, state.player.y, state.player.dir, map);
  if (gridRoute) {
    loadPortalRoute(gridRoute);
    return true;
  }

  return false;
}

function findAllowedEdgeExit(x, y, map) {
  if (map?.id === "coding-village" && y >= mapRows() - 2) {
    return makeRoute("vague-village", "blue", "left", "right", { x: 1.2, y: 12, dir: "right" });
  }
  if (map?.id === "art-village" && y >= mapRows() - 2) {
    return makeRoute("vague-village", "blue", "right", "left", { x: mapCols() - 1.2, y: 12, dir: "left" });
  }
  if (map?.id === "sound-village" && y >= mapRows() - 2) {
    return makeRoute("vague-village", "blue", "bottom", "up", { x: 20, y: 18, dir: "up" });
  }
  return null;
}

function isTileInPortal(tileX, tileY, portal) {
  if (Array.isArray(portal.tiles) && portal.tiles.length) {
    return portal.tiles.some((tile) => tile.x === tileX && tile.y === tileY);
  }
  return tileX >= portal.x1 && tileX <= portal.x2 && tileY >= portal.y1 && tileY <= portal.y2;
}

function findGridPortalRoute(x, y, dir, map) {
  const portal = getReadyPortal(x, y, dir, map);
  if (!portal) return null;
  return makeRoute(portal.toMap, portal.id, "", portal.toDir || dir, {
    x: portal.toX,
    y: portal.toY,
    dir: portal.toDir || dir
  });
}

function makeRoute(to, portalId, portalSide, dir, fallback) {
  return { to, portalId, portalSide, dir, fallback };
}

function loadPortalRoute(route) {
  if (!route?.to) return;
  const fallback = route.fallback || route.spawn || maps[route.to]?.start || { x: 15, y: 10, dir: "down" };
  loadMap(route.to, {
    ...fallback,
    fallback,
    portalId: route.portalId || route.spawn?.portalId || "",
    portalSide: route.portalSide || route.spawn?.portalSide || "",
    hint: route.hint || route.spawn || fallback,
    dir: route.dir || fallback.dir || "down"
  });
}

function getPlayerDebugMetrics() {
  const { tileW, tileH } = state.layout;
  const player = $("player");
  const width = player?.offsetWidth || parseFloat(player?.style?.width) || tileW || 0;
  const height = player?.offsetHeight || parseFloat(player?.style?.height) || tileH || 0;
  const tileX = Math.floor(state.player.x);
  const tileY = Math.floor(state.player.y);
  const anchorX = state.player.x * tileW + tileW / 2;
  const anchorY = state.player.y * tileH + tileH;
  const worldX = anchorX - width / 2;
  const worldY = anchorY - height * 0.86;
  const footX = (tileX + 0.5) * tileW;
  const footY = (tileY + 0.5) * tileH;

  return {
    worldX,
    worldY,
    width,
    height,
    footX,
    footY,
    tileX,
    tileY,
    worldTileX: state.player.x,
    worldTileY: state.player.y
  };
}

function getCurrentPortals(map = currentMap()) {
  return MAPS[state.mapId]?.portals || map?.portals || [];
}

function getReadyPortal(x = state.player.x, y = state.player.y, dir = state.player.dir, map = currentMap()) {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  const portals = getCurrentPortals(map);
  return portals.find((portal) => (
    isTileInPortal(tileX, tileY, portal) &&
    (!portal.facing || portal.facing === dir)
  )) || null;
}

function resolvePortalRoute(portalPoint) {
  const mapId = state.mapId;
  const id = portalPoint?.portalId;
  if (!id) return null;

  if (mapId === "vague-village") {
    if (id === "blue") {
      if (portalPoint.x <= mapCols() * 0.25) {
        return makeRoute("coding-village", "blue", "bottom", "up", { x: 20, y: 18, dir: "up" });
      }
      if (portalPoint.x >= mapCols() * 0.75) {
        return makeRoute("art-village", "blue", "bottom", "up", { x: 20, y: 18, dir: "up" });
      }
      if (portalPoint.y >= mapRows() * 0.72) {
        return makeRoute("sound-village", "blue", "bottom", "up", { x: 20, y: 18, dir: "up" });
      }
      return null;
    }

    const roomRoutes = {
      red: "professor-lab",
      yellow: "vague-house-1",
      cyan: "vague-house-2",
      pink: "vague-house-3",
      purple: "vague-house-4",
      brown: "vague-house-5"
    };
    const to = roomRoutes[id];
    return to ? makeRoute(to, id, "bottom", "up", { x: 15, y: 17, dir: "up" }) : null;
  }

  if (mapId === "professor-lab") {
    return id === "red" ? makeRoute("vague-village", "red", "", "down", { x: 14, y: 7, dir: "down" }) : null;
  }

  const houseRoutes = {
    "vague-house-1": "yellow",
    "vague-house-2": "cyan",
    "vague-house-3": "pink",
    "vague-house-4": "purple",
    "vague-house-5": "brown"
  };
  if (houseRoutes[mapId]) {
    const returnId = houseRoutes[mapId];
    return id === returnId || id === "red" || id === "yellow" || id === "cyan" || id === "pink" || id === "purple" || id === "brown"
      ? makeRoute("vague-village", returnId, "", "down", currentMap()?.exits?.[0]?.spawn || { x: 15, y: 12, dir: "down" })
      : null;
  }

  if (mapId === "coding-village" && id === "blue") {
    return makeRoute("vague-village", "blue", "left", "right", { x: 1.2, y: 12, dir: "right" });
  }
  if (mapId === "art-village" && id === "blue") {
    return makeRoute("vague-village", "blue", "right", "left", { x: mapCols() - 1.2, y: 12, dir: "left" });
  }
  if (mapId === "sound-village" && id === "blue") {
    return makeRoute("vague-village", "blue", "bottom", "up", { x: 20, y: 18, dir: "up" });
  }

  return null;
}

function findTouchedPortalPoint(x, y) {
  const componentHit = findTouchedPortalComponent(x, y);
  if (componentHit) return componentHit;

  const [dx, dy] = directionVector(state.player.dir);
  const candidates = [
    [x, y],
    [x + dx, y + dy],
    [x - 0.35, y],
    [x + 0.35, y],
    [x, y - 0.35],
    [x, y + 0.35]
  ];

  for (const [sampleX, sampleY] of candidates) {
    const portalId = getCollisionMaskPortalId(sampleX, sampleY);
    if (portalId) {
      return { x: sampleX, y: sampleY, portalId };
    }
  }

  return null;
}

function findTouchedPortalComponent(x, y) {
  const footX = x + 0.5;
  const footY = y + 0.86;
  const colors = ["blue", "red", "yellow", "cyan", "pink", "purple", "brown"];
  const hits = [];

  colors.forEach((portalId) => {
    findMarkerComponents(portalId).forEach((component) => {
      const marginX = Math.max(0.35, (component.maxX - component.minX) * 0.15);
      const marginY = Math.max(0.35, (component.maxY - component.minY) * 0.15);
      const inside = (
        footX >= component.minX - marginX &&
        footX <= component.maxX + marginX &&
        footY >= component.minY - marginY &&
        footY <= component.maxY + marginY
      );

      if (!inside) return;

      hits.push({
        portalId,
        x: component.x,
        y: component.y,
        distance: Math.hypot(component.x - footX, component.y - footY),
        size: component.size
      });
    });
  });

  if (!hits.length) return null;
  hits.sort((a, b) => a.distance - b.distance || b.size - a.size);
  return hits[0];
}

function nearestExitTo(x, y, exits) {
  const nearby = exits.reduce((best, exit) => {
    const centerX = (exit.rect[0] + exit.rect[2]) / 2;
    const centerY = (exit.rect[1] + exit.rect[3]) / 2;
    const distance = Math.hypot(centerX - x, centerY - y);
    return !best || distance < best.distance ? { exit, distance } : best;
  }, null);

  if (!nearby) return null;
  return nearby.distance <= 6 ? nearby.exit : null;
}


/* removed duplicate function canStandAt; final definition kept below */


function isInsideRect(x, y, rect) {
  return x >= rect[0] && x <= rect[2] && y >= rect[1] && y <= rect[3];
}


/* removed duplicate function isBlocked; final definition kept below */



/* removed duplicate function isEncounterArea; final definition kept below */


function tryEncounter() {
  if (!isEncounterArea(state.player.x, state.player.y)) return;
  if (state.grassSteps < 1.2) return;

  if (Math.random() < ENCOUNTER_RATE) {
    const zone = getCurrentEncounterZone();
    const pool = zone ? quests.filter((quest) => quest.village === zone.village) : quests;
    const questPool = pool.length ? pool : quests;
    const quest = questPool[Math.floor(Math.random() * questPool.length)];
    startEncounter(quest);
  }
}

function getCurrentEncounterZone() {
  const map = currentMap();
  if (isTileInList(state.player.x, state.player.y, map?.encounterTiles || [])) {
    return {
      village: map.encounterVillage || "coding",
      name: map.name || ""
    };
  }

  const zones = currentMap()?.encounters || encounterZones;
  return zones.find((item) => (
    item.rects.some((rect) => isInsideRect(state.player.x, state.player.y, rect))
  ));
}

function updatePlaceName() {
  const placeName = $("placeName");
  if (!placeName) return;
  placeName.textContent = currentMap()?.name || "프롬프트몬 연구 마을";
}

function startEncounter(quest) {
  const beginEncounter = () => {
    state.inEncounter = true;
    keysDown.clear();

    $("mapDialogText").textContent = `야생의 ${quest.koreanPokemon}가 나타났다! ${quest.title} 테스트다!`;
    $("mapDialog").classList.remove("hidden");
    $("flashEffect").classList.remove("hidden");

    setTimeout(() => {
      $("mapDialog").classList.add("hidden");

      setTimeout(() => {
        $("flashEffect").classList.add("hidden");
        startBattle(quest);
      }, 420);
    }, 520);
  };

  const musicReady = playOnly("battleBgm");
  if (musicReady?.then) {
    musicReady.finally(beginEncounter);
  } else {
    beginEncounter();
  }

}

/* Legacy engine note. */

function startBattle(quest) {
  state.currentQuest = quest;
  state.currentStep = 0;
  state.choiceIndex = 0;
  state.selected = {};
  state.finalScore = 0;
  state.finalPrompt = "";

  $("enemyPokemonName").textContent = quest.koreanPokemon;
  $("badPromptText").textContent = quest.badPrompt;
  $("battleMessage").textContent = `야생의 ${quest.koreanPokemon}가 나타났다! 막연한 요청을 좋은 프롬프트로 바꿔보자.`;

  setPokemonSprite("enemyPokemonSprite", "enemyFallback", quest.pokemon, "front", quest.koreanPokemon || quest.pokemon);

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
    const normalized = normalizeCardOption(option);
    button.className = "choice-btn prompt-card";
    button.textContent = `${index + 1}. ${normalized.text}`;
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
  const rawValue = options[state.choiceIndex];

  if (!rawValue) {
    skipStep();
    return;
  }

  const value = normalizeCardOption(rawValue);

  state.selected[category.key] = value;
  assemblePrompt();

  $("battleMessage").textContent = value.feedback || `${category.label} 카드를 선택했다.`;

  if (value.scoreRatio < 0.6) {
    playEnemyCounterMotion(() => {
      goNextStepSoon();
    });
    return;
  }

  playAttackMotion(() => {
    goNextStepSoon();
  });
}

function playEnemyCounterMotion(done) {
  const player = $("playerPokemonSprite") || $("playerFallback");
  const enemy = $("enemyPokemonSprite") || $("enemyFallback");

  player.classList.remove("hit-shake");
  enemy.classList.remove("attack-motion");
  void player.offsetWidth;
  void enemy.offsetWidth;

  enemy.classList.add("attack-motion");
  setTimeout(() => {
    playSfx("hitSfx");
    player.classList.add("hit-shake");
  }, 130);
  setTimeout(() => {
    enemy.classList.remove("attack-motion");
    player.classList.remove("hit-shake");
    done();
  }, 430);
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
  state.finalPrompt = buildPromptFromSelection(state.currentQuest, state.selected, categories);
  updateScoreHp();
}

function calculateScore() {
  return calculatePromptScore(state.selected, categories);
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
    state.finalPrompt = `[막연한 프롬프트]
${state.currentQuest.badPrompt}

좋은 카드를 충분히 고르지 못해 막연한 프롬프트가 남았습니다.`;
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
  const cardFeedback = buildCardFeedback(state.selected, categories);
  const badAnalysis = buildBadPromptAnalysis(state.currentQuest);

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

  const scoreTitle = document.createElement("h3");
  scoreTitle.textContent = "카테고리별 점수";
  area.appendChild(scoreTitle);

  result.breakdown.forEach((item) => {
    const div = document.createElement("div");
    div.className = item.success ? "breakdown-item" : "breakdown-item missing";
    div.innerHTML = `
      <strong>${escapeHtml(item.label)}</strong>
      <span>${item.score} / ${item.max}점</span>
      <small>${escapeHtml(item.feedback)}</small>
    `;
    area.appendChild(div);
  });

  const feedbackTitle = document.createElement("h3");
  feedbackTitle.textContent = "선택 카드 피드백";
  area.appendChild(feedbackTitle);

  cardFeedback.forEach((item) => {
    const div = document.createElement("div");
    div.className = "breakdown-item card-feedback";
    div.innerHTML = `
      <strong>${escapeHtml(item.label)}</strong>
      <span>${escapeHtml(item.text)}</span>
      <small>${escapeHtml(item.feedback)}</small>
    `;
    area.appendChild(div);
  });

  const analysisBox = document.createElement("div");
  analysisBox.className = "result-learning-box";
  analysisBox.innerHTML = `
    <h3>막연한 프롬프트가 약한 이유</h3>
    <ul>${badAnalysis.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>다음 행동</h3>
    <p>완성된 좋은 프롬프트를 LLM에 붙여 넣고, 생성된 결과를 VS Code에 적용하세요. 오류가 나오면 오류 메시지를 그대로 다시 붙여 넣어 수정 요청을 하면 됩니다.</p>
  `;
  area.appendChild(analysisBox);
}

function runAway() {
  $("battleMessage").textContent = "무사히 도망쳤다! 맵으로 돌아간다.";
  playSfx("runAwaySfx");

  setTimeout(() => {
    returnToMap();
  }, 1200);
}

/* Legacy engine note. */

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
  playMapMusic();
}

/* LLM ?ㅽ뿕 */

function showExperiment() {
  $("experimentBadPrompt").textContent = state.currentQuest.badPrompt;
  $("experimentGoodPrompt").textContent = `${state.finalPrompt}

사용 방법:
1. 위 좋은 프롬프트를 LLM에 붙여 넣습니다.
2. 나온 결과를 VS Code에 적용합니다.
3. 오류가 나오면 오류 메시지를 다시 LLM에 붙여 넣고 수정 요청을 합니다.`;
  $("badResultInput").value = "";
  $("goodResultInput").value = "";
  $("compareBox").classList.add("hidden");

  showScreen("experimentScreen");
}

function showComparison() {
  const rows = buildComparisonGuide(state.currentQuest, state.selected, categories);

  $("compareTableBody").innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row[0])}</td>
      <td>${escapeHtml(row[1])}</td>
      <td>${escapeHtml(row[2])}</td>
    </tr>
  `).join("");

  $("compareSummary").textContent =
    "좋은 프롬프트는 역할, 목표, 대상, 기능, 출력 조건을 나누어 알려 주기 때문에 LLM 결과가 더 구체적입니다. 결과를 VS Code에 적용한 뒤 오류 메시지를 다시 질문하면 개선 흐름을 이어갈 수 있습니다.";

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
    badPrompt: state.currentQuest.badPrompt,
    score: state.finalScore,
    prompt: state.finalPrompt,
    finalPrompt: state.finalPrompt,
    selectedCards: categories.map((category) => {
      const option = state.selected[category.key];
      const normalized = option ? normalizeCardOption(option) : null;
      return {
        key: category.key,
        label: category.label,
        text: normalized?.text || "",
        level: normalized?.level || "missing",
        scoreRatio: normalized?.scoreRatio || 0,
        feedback: normalized?.feedback || `${category.label} 정보가 비어 있습니다.`
      };
    }),
    cardFeedback: buildCardFeedback(state.selected, categories),
    badPromptAnalysis: buildBadPromptAnalysis(state.currentQuest),
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

function renderDexLegacy() {
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



/* 지박사 NPC */

function renderDex() {
  const list = loadDex();
  const box = $("dexList");

  if (list.length === 0) {
    state.dexIndex = 0;
    box.innerHTML = `<div class="dex-empty">아직 저장된 프롬프트몬 기록이 없습니다.</div>`;
    return;
  }

  state.dexIndex = clamp(state.dexIndex, 0, list.length - 1);
  const selected = list[state.dexIndex];
  const promptText = selected.finalPrompt || selected.prompt || "";
  const analysis = Array.isArray(selected.badPromptAnalysis) ? selected.badPromptAnalysis : [];
  const cardFeedback = Array.isArray(selected.cardFeedback) ? selected.cardFeedback : [];

  box.innerHTML = `
    <div class="dex-board-list" role="listbox" aria-label="저장한 프롬프트몬 목록"></div>
    <article class="dex-detail">
      <div>
        <h3>${escapeHtml(selected.pokemon || selected.title)}</h3>
        <small>${escapeHtml(selected.createdAt || "")} · ${escapeHtml(selected.title || "")} · ${selected.score || 0}점</small>
      </div>
      ${selected.badPrompt ? `<p><strong>막연한 요청:</strong> ${escapeHtml(selected.badPrompt)}</p>` : ""}
      ${analysis.length ? `<ul class="dex-analysis">${analysis.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : ""}
      ${cardFeedback.length ? `<div class="dex-card-feedback">${cardFeedback.map((item) => `
        <p><strong>${escapeHtml(item.label)}</strong> ${escapeHtml(item.feedback)}</p>
      `).join("")}</div>` : ""}
      <pre>${escapeHtml(promptText)}</pre>
      <div class="dex-actions">
        <button data-action="copy" type="button">프롬프트 복사</button>
        <button data-action="delete" type="button">기록 삭제</button>
      </div>
    </article>
  `;

  const listBox = box.querySelector(".dex-board-list");

  list.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = `dex-board-item${index === state.dexIndex ? " selected" : ""}`;
    button.type = "button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === state.dexIndex ? "true" : "false");
    button.innerHTML = `
      <strong>${escapeHtml(item.pokemon || item.title)}</strong>
      <span>${escapeHtml(item.title || "")}</span>
    `;
    button.addEventListener("click", () => {
      state.dexIndex = index;
      renderDex();
    });
    listBox.appendChild(button);
  });

  box.querySelector('[data-action="copy"]').addEventListener("click", () => copyText(promptText));

  box.querySelector('[data-action="delete"]').addEventListener("click", () => {
    const next = loadDex().filter((saved) => saved.id !== selected.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state.dexIndex = Math.max(0, state.dexIndex - 1);
    renderDex();
  });
}

function handleDexKey(event) {
  const moveKey = normalizeMoveKey(event.key);
  const list = loadDex();

  if (moveKey || ["Enter", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (!list.length) return;

  if (moveKey) {
    state.dexIndex = moveGridIndex(state.dexIndex, moveKey, list.length, 1);
    playSfx("plinkSfx");
    renderDex();
  }

  if (event.key === "Enter" || event.key === " ") {
    playSfx("plinkSfx");
    copyText(list[state.dexIndex]?.finalPrompt || list[state.dexIndex]?.prompt || "");
  }
}

const PROFESSOR_TILE = { x: 16.05, y: 5.45, dir: "down" };
const PROFESSOR_DIALOG_LINES = [
  "지박사: 어서 오너라. 프롬프트몬은 풀숲에서만 나타난단다.",
  "지박사: 코딩마을, 예술마을, 소리마을은 길과 바닥을 따라 움직이면 된다.",
  "지박사: 좋은 카드와 부족한 카드를 비교하면서 역할, 목표, 조건을 또렷하게 만들어 보자!"
];

function professorFacingPlayerSprite() {
  const professor = currentMap()?.professor;
  if (!professor) return "./assets/professor-down.png";

  const dx = state.player.x - professor.x;
  const dy = state.player.y - professor.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx < 0 ? "./assets/professor-left.png" : "./assets/professor-right.png";
  }

  return dy < 0 ? "./assets/professor-up.png" : "./assets/professor-down.png";
}

function faceProfessorTowardPlayer() {
  const sprite = $("professorSprite");
  if (sprite && currentMap()?.professor) {
    sprite.src = professorFacingPlayerSprite();
  }
}

function updateProfessorPosition() {
  const npc = $("professorNpc");
  const sprite = $("professorSprite");

  if (!npc || !sprite || !state.layout.tileW || !state.layout.tileH) return;

  const professor = currentMap()?.professor;
  if (!professor) {
    npc.classList.add("hidden");
    return;
  }

  npc.classList.remove("hidden");

  const { tileW, tileH, isMobile } = state.layout;
  const indoor = currentMap()?.indoor;

  npc.style.left = `${professor.x * tileW + tileW / 2}px`;
  npc.style.top = `${professor.y * tileH + tileH}px`;

  const width = indoor
    ? Math.max(54, Math.min(84, tileW * 1.8))
    : isMobile
      ? Math.max(34, Math.min(52, tileW * 1.05))
      : Math.max(40, Math.min(64, tileW * 1.35));

  const height = indoor
    ? Math.max(72, Math.min(112, tileH * 2.35))
    : isMobile
      ? Math.max(48, Math.min(74, tileH * 1.45))
      : Math.max(54, Math.min(84, tileH * 1.8));

  npc.style.width = `${width}px`;
  npc.style.height = `${height}px`;

  if (professor.dir && $("mapDialog")?.classList.contains("hidden")) {
    sprite.src = `./assets/professor-${professor.dir}.png`;
    return;
  }

  sprite.src = professorFacingPlayerSprite();
}

function isNearProfessor() {
  const professor = currentMap()?.professor;
  if (!professor) return false;

  const rangeX = currentMap()?.indoor ? 2.0 : 1.25;
  const rangeY = currentMap()?.indoor ? 2.1 : 1.15;

  return Math.abs(state.player.x - professor.x) <= rangeX &&
         Math.abs(state.player.y - professor.y) <= rangeY;
}

function showProfessorDialog() {
  const dialog = $("mapDialog");
  const text = $("mapDialogText");

  if (!dialog || !text) return;

  faceProfessorTowardPlayer();

  const opening = dialog.classList.contains("hidden");
  if (opening) {
    state.professorDialogIndex = 0;
  } else {
    state.professorDialogIndex += 1;
  }

  if (state.professorDialogIndex >= PROFESSOR_DIALOG_LINES.length) {
    dialog.classList.add("hidden");
    state.professorDialogIndex = 0;
    return;
  }

  text.textContent = PROFESSOR_DIALOG_LINES[state.professorDialogIndex];
  dialog.classList.remove("hidden");
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


/* Legacy engine note. */

let collisionCanvas = null;
let collisionCtx = null;
let collisionReady = false;
let collisionMaskCanvas = null;
let collisionMaskCtx = null;
let collisionMaskReady = false;
let collisionMaskMapId = "";
let markerMaskCanvas = null;
let markerMaskCtx = null;
let markerMaskReady = false;
let markerMaskMapId = "";
let markerComponentCache = new Map();

function collisionMaskSrcFor(map) {
  const id = map?.id || state.mapId;
  return map?.mask || `./assets/maps/collision/${id} (2).png`;
}

function collisionMaskFallbackSrcFor(map) {
  const id = map?.id || state.mapId;
  return `./assets/maps/collision/${id}-mask.png`;
}

function markerMaskSrcFor(map) {
  const id = map?.id || state.mapId;
  return `./assets/maps/collision/${id}.png`;
}

function getCollisionDebugSource(map = currentMap()) {
  if (!map) return "none";
  if (map.collision === "tiles") {
    return `tiles ${map.blockedTiles?.length || 0} blocked`;
  }
  if (collisionMaskReady && collisionMaskMapId === map.id) {
    return `mask ${collisionMaskCanvas?.width || 0}x${collisionMaskCanvas?.height || 0}`;
  }
  return `${map.collision || "rect"} fallback - mask missing`;
}

function buildCollisionMaskCanvas(map = currentMap()) {
  collisionMaskReady = false;
  collisionMaskMapId = "";
  markerMaskReady = false;
  markerMaskMapId = "";
  markerComponentCache = new Map();

  if (!map) return;

  const maskImage = new Image();
  maskImage.onload = () => {
    try {
      collisionMaskCanvas = document.createElement("canvas");
      collisionMaskCanvas.width = maskImage.naturalWidth;
      collisionMaskCanvas.height = maskImage.naturalHeight;
      collisionMaskCtx = collisionMaskCanvas.getContext("2d", { willReadFrequently: true });
      collisionMaskCtx.drawImage(maskImage, 0, 0);
      collisionMaskMapId = map.id;
      collisionMaskReady = true;
    } catch {
      collisionMaskReady = false;
      collisionMaskMapId = "";
    }
  };
  maskImage.onerror = () => {
    const fallbackSrc = `${collisionMaskFallbackSrcFor(map)}?v=learning1`;
    if (maskImage.src !== new URL(fallbackSrc, window.location.href).href) {
      maskImage.src = fallbackSrc;
      return;
    }
    collisionMaskReady = false;
    collisionMaskMapId = "";
  };
  maskImage.src = `${collisionMaskSrcFor(map)}?v=learning1`;

  const markerImage = new Image();
  markerImage.onload = () => {
    try {
      markerMaskCanvas = document.createElement("canvas");
      markerMaskCanvas.width = markerImage.naturalWidth;
      markerMaskCanvas.height = markerImage.naturalHeight;
      markerMaskCtx = markerMaskCanvas.getContext("2d", { willReadFrequently: true });
      markerMaskCtx.drawImage(markerImage, 0, 0);
      markerMaskMapId = map.id;
      markerMaskReady = true;
      applyPendingPortalSpawn();
    } catch {
      markerMaskReady = false;
      markerMaskMapId = "";
    }
  };
  markerImage.onerror = () => {
    markerMaskReady = false;
    markerMaskMapId = "";
  };
  markerImage.src = `${markerMaskSrcFor(map)}?v=learning1`;
}

function applyPendingPortalSpawn() {
  const pending = state.pendingPortalSpawn;
  if (!pending || !markerMaskReady || markerMaskMapId !== state.mapId) return;

  const portal = findPortalCenterById(pending.portalId, {
    side: pending.portalSide,
    hint: pending.hint
  });
  if (!portal) return;

  const point = pickPortalExitSpawn(portal, pending.dir);

  state.player.x = point.x;
  state.player.y = point.y;
  state.player.dir = pending.dir || state.player.dir || "down";
  state.stepMove = null;
  state.grassSteps = 0;
  state.pendingPortalSpawn = null;
  updatePlayerPosition();
}

function directionVector(direction = "down") {
  if (direction === "up") return [0, -1];
  if (direction === "down") return [0, 1];
  if (direction === "left") return [-1, 0];
  if (direction === "right") return [1, 0];
  return [0, 1];
}

function roundedPortalBounds(portal) {
  const xs = portal.tiles.map(([x]) => x);
  const ys = portal.tiles.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    centerX: Math.round(portal.x),
    centerY: Math.round(portal.y)
  };
}

function pickPortalExitSpawn(portal, direction = "down") {
  const [dx, dy] = directionVector(direction);
  const bounds = roundedPortalBounds(portal);
  const primary = {
    x: dx < 0 ? bounds.minX - 1 : dx > 0 ? bounds.maxX + 1 : bounds.centerX,
    y: dy < 0 ? bounds.minY - 1 : dy > 0 ? bounds.maxY + 1 : bounds.centerY
  };

  const candidates = [
    primary,
    { x: primary.x + dx, y: primary.y + dy },
    { x: bounds.centerX + dx, y: bounds.centerY + dy },
    { x: bounds.centerX + dx * 2, y: bounds.centerY + dy * 2 },
    { x: bounds.centerX, y: bounds.centerY }
  ];

  const sideAxis = dx === 0
    ? [[-1, 0], [1, 0], [-2, 0], [2, 0]]
    : [[0, -1], [0, 1], [0, -2], [0, 2]];

  sideAxis.forEach(([sx, sy]) => {
    candidates.push({ x: primary.x + sx, y: primary.y + sy });
  });

  return candidates.find(({ x, y }) => isValidPortalSpawn(x, y)) || primary;
}

function isValidPortalSpawn(x, y) {
  if (x < 0 || x >= mapCols() || y < 0 || y >= mapRows()) return false;
  if (getCollisionMaskPortalId(x, y)) return false;
  return canStandAt(x, y);
}

function findPortalCenterById(portalId, options = {}) {
  if (!portalId || !markerMaskReady || markerMaskMapId !== state.mapId) return null;

  const side = typeof options === "string" ? "" : options.side || "";
  const hint = typeof options === "string" ? options : options.hint || null;
  const cols = mapCols();
  const rows = mapRows();
  const components = findMarkerComponents(portalId);

  const filtered = components.filter((component) => (
    component.size >= 2 &&
    (!side || isPortalOnSide(component, side, cols, rows))
  ));
  const usable = filtered.length ? filtered : components;
  if (!usable.length) return null;
  if (!hint) return usable.sort((a, b) => b.size - a.size)[0];

  return usable.reduce((best, component) => {
    const distance = Math.hypot(component.x - hint.x, component.y - hint.y);
    const score = distance - Math.min(component.size, 12) * 0.08;
    return !best || score < best.score ? { ...component, distance, score } : best;
  }, null);
}

function isPortalOnSide(component, side, cols, rows) {
  if (side === "left") return component.x <= cols * 0.25;
  if (side === "right") return component.x >= cols * 0.75;
  if (side === "top") return component.y <= rows * 0.25;
  if (side === "bottom") return component.y >= rows * 0.7;
  return true;
}

function findMarkerComponents(targetId) {
  if (!markerMaskReady || !markerMaskCtx || !markerMaskCanvas || markerMaskMapId !== state.mapId) return [];
  const cacheKey = `${state.mapId}:${targetId}`;
  if (markerComponentCache.has(cacheKey)) return markerComponentCache.get(cacheKey);

  const width = markerMaskCanvas.width;
  const height = markerMaskCanvas.height;
  const markerData = markerMaskCtx.getImageData(0, 0, width, height).data;
  const baseData = collisionCtx && collisionCanvas && collisionReady
    ? collisionCtx.getImageData(0, 0, collisionCanvas.width, collisionCanvas.height).data
    : null;
  const visited = new Uint8Array(width * height);
  const components = [];

  const readMarkerPixel = (index) => ({
    r: markerData[index * 4],
    g: markerData[index * 4 + 1],
    b: markerData[index * 4 + 2],
    a: markerData[index * 4 + 3]
  });
  const readBasePixel = (x, y) => {
    if (!baseData || !collisionCanvas) return null;
    const bx = clamp(Math.round((x / width) * (collisionCanvas.width - 1)), 0, collisionCanvas.width - 1);
    const by = clamp(Math.round((y / height) * (collisionCanvas.height - 1)), 0, collisionCanvas.height - 1);
    const baseIndex = (by * collisionCanvas.width + bx) * 4;
    return {
      r: baseData[baseIndex],
      g: baseData[baseIndex + 1],
      b: baseData[baseIndex + 2],
      a: baseData[baseIndex + 3]
    };
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (visited[index]) continue;

      const pixel = readMarkerPixel(index);
      const id = portalIdFromPixel(pixel, readBasePixel(x, y));
      if (id !== targetId) {
        visited[index] = 1;
        continue;
      }

      const queue = [[x, y]];
      visited[index] = 1;
      let count = 0;
      let sumX = 0;
      let sumY = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;

      while (queue.length) {
        const [cx, cy] = queue.shift();
        count += 1;
        sumX += cx;
        sumY += cy;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);

        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const nextIndex = ny * width + nx;
          if (visited[nextIndex]) continue;
          const nextPixel = readMarkerPixel(nextIndex);
          if (portalIdFromPixel(nextPixel, readBasePixel(nx, ny)) !== targetId) {
            visited[nextIndex] = 1;
            continue;
          }
          visited[nextIndex] = 1;
          queue.push([nx, ny]);
        }
      }

      if (count >= 12) {
        const tileX = ((sumX / count) / width) * mapCols();
        const tileY = ((sumY / count) / height) * mapRows();
        const minTileX = (minX / width) * mapCols();
        const maxTileX = (maxX / width) * mapCols();
        const minTileY = (minY / height) * mapRows();
        const maxTileY = (maxY / height) * mapRows();
        components.push({
          x: tileX,
          y: tileY,
          size: count,
          tiles: [
            [Math.floor(minTileX), Math.floor(minTileY)],
            [Math.ceil(maxTileX), Math.ceil(maxTileY)]
          ],
          minX: Math.floor(minTileX),
          maxX: Math.ceil(maxTileX),
          minY: Math.floor(minTileY),
          maxY: Math.ceil(maxTileY)
        });
      }
    }
  }

  markerComponentCache.set(cacheKey, components);
  return components;
}

function buildCollisionCanvas() {
  const img = $("mapImage");
  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) {
    collisionReady = false;
    return;
  }

  try {
    collisionCanvas = document.createElement("canvas");
    collisionCanvas.width = img.naturalWidth;
    collisionCanvas.height = img.naturalHeight;
    collisionCtx = collisionCanvas.getContext("2d", { willReadFrequently: true });
    collisionCtx.drawImage(img, 0, 0);
    collisionReady = true;
    buildCollisionMaskCanvas();
  } catch {
    collisionReady = false;
  }
}

// Legacy engine note.
function handleMapImageFallback() {
  const mapImage = $("mapImage");

  mapImage.onload = () => {
    state.mapImageAvailable = true;
    $("fallbackTileMap").style.display = "none";
    mapImage.style.display = "block";
    buildCollisionCanvas();
    updateMapLayout();
  };

  mapImage.onerror = () => {
    state.mapImageAvailable = false;
    collisionReady = false;
    mapImage.style.display = "none";
    $("fallbackTileMap").style.display = "grid";
    updateMapLayout();
  };

  if (mapImage.complete && mapImage.naturalWidth) {
    state.mapImageAvailable = true;
    $("fallbackTileMap").style.display = "none";
    mapImage.style.display = "block";
    buildCollisionCanvas();
  }
}

// Legacy engine note.

/* removed duplicate function isBlocked; final definition kept below */


// Legacy engine note.

/* removed duplicate function isEncounterArea; final definition kept below */


// Legacy engine note.

/* removed duplicate function canStandAt; final definition kept below */


// Legacy engine note.

/* removed duplicate function updateMapLayout; final definition kept below */



/* Legacy engine note. */

const MOBILE_WALKABLE_RECTS_V2 = [
  // Mobile outdoor fallback path blocks.
  // Legacy engine note.
  [0.0, 9.4, 12.2, 14.5],
  // Legacy engine note.
  [12.0, 0.0, 18.3, 12.2],
  // Legacy engine note.
  [8.0, 5.5, 23.2, 12.8],
  // Legacy engine note.
  [13.0, 10.4, 23.8, 16.8],
  // Legacy engine note.
  [20.0, 3.0, 30.0, 10.4],
  // Legacy engine note.
  [21.0, 8.6, 30.0, 16.3],
  // Legacy engine note.
  [18.2, 13.0, 22.1, 18.0]
];

const MOBILE_BLOCKED_RECTS_V2 = [
  // Legacy engine note.
  [0.0, 0.0, 13.2, 3.4],
  [18.6, 0.0, 30.0, 2.9],

  // Legacy engine note.
  [13.7, 0.7, 18.4, 4.9],

  // Mobile bottom fallback blocks.

  // Legacy engine note.
  [4.0, 7.7, 6.9, 10.0],
  [7.0, 7.6, 8.8, 10.4],
  [8.7, 9.3, 12.0, 12.9],
  [10.8, 9.7, 13.8, 13.5],
  [17.7, 4.5, 19.0, 8.5],
  [19.2, 8.5, 22.0, 10.8],
  [23.1, 5.2, 25.9, 9.2],
  [23.2, 12.0, 26.7, 15.8]
];

const MOBILE_TALL_GRASS_RECTS_V2 = [
  [3.7, 4.8, 8.9, 9.4],
  [0.0, 8.0, 4.1, 10.5],
  [20.5, 5.0, 23.5, 9.6],
  [24.0, 3.3, 29.5, 8.0],
  [22.2, 8.1, 29.7, 15.4]
];

function isInAnyRectList(x, y, list) {
  return list.some((rect) => isInsideRect(x, y, rect));
}

// Legacy engine note.

/* removed duplicate function isBlocked; final definition kept below */


// Legacy engine note.

/* removed duplicate function isEncounterArea; final definition kept below */


// Legacy engine note.

/* removed duplicate function canStandAt; final definition kept below */


// Legacy engine note.

/* removed duplicate function updateMapLayout; final definition kept below */



/* Legacy engine note. */

function updateDeviceMode() {
  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const touchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|KAKAOTALK|SamsungBrowser/i.test(navigator.userAgent);
  const isMobile = coarse || touchPoints || mobileUA;
  const isPortrait = window.innerHeight >= window.innerWidth;

  state.layout.isMobile = isMobile;
  state.layout.isPortrait = isPortrait;

  document.documentElement.classList.toggle("is-mobile", isMobile);
  document.documentElement.classList.toggle("is-pc", !isMobile);
  document.documentElement.classList.toggle("touch-device", isMobile);
  document.documentElement.classList.toggle("is-portrait", isPortrait);
  document.documentElement.classList.toggle("is-landscape", !isPortrait);
}

// 시작 위치가 막힌 곳이면 안전한 좌표로 보정합니다.
function ensurePlayerOnWalkable() {
  if (!isBlocked(state.player.x, state.player.y)) return;

  const map = currentMap();
  const start = map?.start || { x: mapCols() / 2, y: mapRows() / 2 };
  const center = [mapCols() / 2, mapRows() / 2];
  const candidates = [
    [Math.round(start.x), Math.round(start.y)],
    center,
    [center[0], center[1] + 1],
    [center[0], center[1] - 1],
    [center[0] - 1, center[1]],
    [center[0] + 1, center[1]],
    [Math.max(1, mapCols() / 2), Math.max(2, mapRows() - 2)]
  ];

  const found = candidates.find(([x, y]) => !isBlocked(x, y));

  if (found) {
    state.player.x = found[0];
    state.player.y = found[1];
  }
}

// Legacy engine note.
const WALKABLE_V7 = [
  [0.0, 3.5, 30.0, 16.7],
  [14.2, 0.0, 18.2, 16.7],
  [18.0, 3.0, 30.0, 16.7]
];

const BLOCKED_V7 = [
  // Legacy engine note.
  [0.0, 0.0, 13.3, 3.15],
  [18.7, 0.0, 30.0, 2.75],

  // Legacy engine note.
  [13.65, 0.6, 18.35, 4.65],

  // ?섎떒 ??  [0.0, 17.0, 30.0, 20.0],

  // Legacy engine note.
  [0.0, 5.2, 0.8, 8.1],
  [4.1, 7.6, 6.8, 9.95],
  [7.1, 7.6, 8.7, 10.1],
  [8.8, 9.4, 11.8, 12.7],
  [10.8, 9.6, 13.6, 13.4],
  [17.7, 4.6, 18.9, 8.2],
  [19.2, 8.4, 22.0, 10.75],
  [23.2, 5.2, 25.8, 9.1],
  [23.2, 12.0, 26.7, 15.7]
];

const TALL_GRASS_V7 = [
  [3.8, 4.8, 8.9, 9.5],
  [0.0, 7.9, 4.1, 10.6],
  [18.2, 5.0, 23.6, 9.7],
  [21.0, 8.6, 23.8, 11.5],
  [24.0, 3.2, 29.6, 8.0],
  [23.8, 8.0, 29.7, 15.5]
];

function inRectListV7(x, y, list) {
  return list.some((rect) => isInsideRect(x, y, rect));
}

function getMapPixelAtTile(x, y, offsetX = 0, offsetY = 0) {
  if (!collisionReady || !collisionCtx || !collisionCanvas) return null;

  const sampleX = (x + 0.5 + offsetX) / mapCols();
  const sampleY = (y + 0.86 + offsetY) / mapRows();
  const px = clamp(Math.round(sampleX * collisionCanvas.width), 0, collisionCanvas.width - 1);
  const py = clamp(Math.round(sampleY * collisionCanvas.height), 0, collisionCanvas.height - 1);
  const data = collisionCtx.getImageData(px, py, 1, 1).data;

  return { r: data[0], g: data[1], b: data[2], a: data[3] };
}

function isOutdoorPixelWalkable(pixel) {
  if (!pixel || pixel.a < 20) return false;

  const { r, g, b } = pixel;
  const total = r + g + b;
  if (total < 145) return false;
  if (b > 150 && b > r + 25 && b > g - 10) return false;

  const dirt = r >= 120 && g >= 90 && g <= 220 && b >= 45 && b <= 155 && r >= g - 45;
  const greenGround = g >= 108 && b >= 42 && b <= 170 && g > r + 22 && g > b + 20;
  const veryDarkTree = total < 210 && b < 42 && g > r + 24;

  return dirt || (greenGround && !veryDarkTree);
}

function isIndoorPixelWalkable(pixel) {
  if (!pixel || pixel.a < 20) return false;

  const { r, g, b } = pixel;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const greyFloor = max - min <= 42 && r >= 105 && r <= 235 && g >= 105 && g <= 235 && b >= 105 && b <= 235;
  const redCarpet = r >= 135 && g >= 45 && g <= 135 && b >= 35 && b <= 135 && r > g + 25 && r > b + 25;

  return greyFloor || redCarpet;
}

function isPixelTerrainWalkable(x, y, map) {
  const classifier = map?.indoor ? isIndoorPixelWalkable : isOutdoorPixelWalkable;
  const offsets = [
    [0, 0],
    [-0.12, 0],
    [0.12, 0],
    [0, -0.1],
    [0, 0.08],
    [-0.1, -0.08],
    [0.1, -0.08]
  ];
  const hits = offsets.reduce((count, [offsetX, offsetY]) => (
    count + (classifier(getMapPixelAtTile(x, y, offsetX, offsetY)) ? 1 : 0)
  ), 0);

  return hits >= 3;
}

function isTallGrassPixel(pixel) {
  if (!pixel || pixel.a < 20) return false;

  const { r, g, b } = pixel;
  const dirt = r >= 120 && g >= 85 && b >= 35 && b <= 170 && r >= g - 45;
  const vividGrass = g >= 105 && g > r + 28 && g > b + 8 && r <= 110 && b >= 45 && b <= 165;
  const darkGrassStroke = g >= 70 && g > r + 20 && b >= 35 && b <= 135 && r <= 75;

  return !dirt && (vividGrass || darkGrassStroke);
}

function isTallGrassAt(x, y) {
  const offsets = [
    [0, 0],
    [-0.18, 0],
    [0.18, 0],
    [0, -0.18],
    [0, 0.18]
  ];
  const hits = offsets.reduce((count, [offsetX, offsetY]) => (
    count + (isTallGrassPixel(getMapPixelAtTile(x, y, offsetX, offsetY)) ? 1 : 0)
  ), 0);

  return hits >= 3;
}

function getCollisionMaskPixelAtTile(x, y) {
  if (!collisionMaskReady || !collisionMaskCtx || !collisionMaskCanvas || collisionMaskMapId !== state.mapId) {
    return null;
  }

  const sampleX = (x + 0.5) / mapCols();
  const sampleY = (y + 0.86) / mapRows();
  const px = clamp(Math.round(sampleX * collisionMaskCanvas.width), 0, collisionMaskCanvas.width - 1);
  const py = clamp(Math.round(sampleY * collisionMaskCanvas.height), 0, collisionMaskCanvas.height - 1);
  const data = collisionMaskCtx.getImageData(px, py, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2], a: data[3] };
}

function getMarkerMaskPixelAtTile(x, y) {
  if (!markerMaskReady || !markerMaskCtx || !markerMaskCanvas || markerMaskMapId !== state.mapId) {
    return null;
  }

  const sampleX = (x + 0.5) / mapCols();
  const sampleY = (y + 0.86) / mapRows();
  const px = clamp(Math.round(sampleX * markerMaskCanvas.width), 0, markerMaskCanvas.width - 1);
  const py = clamp(Math.round(sampleY * markerMaskCanvas.height), 0, markerMaskCanvas.height - 1);
  const data = markerMaskCtx.getImageData(px, py, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2], a: data[3] };
}

function isMaskBlockedPixel(pixel) {
  if (!pixel || pixel.a < 20) return true;
  return pixel.r < 45 && pixel.g < 45 && pixel.b < 45;
}

function colorDistance(a, b) {
  if (!a || !b) return 999;
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

function isAnnotationPixel(pixel, basePixel) {
  return pixel && pixel.a >= 20 && (!basePixel || colorDistance(pixel, basePixel) >= 38);
}

function markerPortalColor(pixel) {
  if (!pixel || pixel.a < 20) return false;

  const { r, g, b } = pixel;

  if (b >= 150 && r <= 120 && g >= 120) return "cyan";
  if (b >= 150 && r <= 120 && g <= 130) return "blue";
  if (r >= 210 && g <= 80 && b <= 90) return "red";
  if (r >= 205 && g >= 190 && b <= 95) return "yellow";
  if (r >= 125 && r <= 205 && g >= 45 && g <= 130 && b >= 120 && b <= 210) return "purple";
  if (r >= 85 && r <= 170 && g <= 85 && b <= 85) return "brown";
  if (r >= 205 && g >= 120 && g <= 205 && b >= 155) return "pink";

  return "";
}

function markerEncounterColor(pixel) {
  if (!pixel || pixel.a < 20) return false;
  const green = pixel.g >= 175 && pixel.r <= 125 && pixel.b <= 155 && pixel.g > pixel.r + 55;
  const orange = pixel.r >= 220 && pixel.g >= 95 && pixel.g <= 175 && pixel.b <= 90;
  const magenta = pixel.r >= 170 && pixel.b >= 150 && pixel.g <= 100;
  return green || orange || magenta;
}

function portalIdFromPixel(pixel, basePixel) {
  if (!isAnnotationPixel(pixel, basePixel)) return false;
  return markerPortalColor(pixel);
}

function isMaskPortalPixel(pixel, basePixel) {
  return Boolean(portalIdFromPixel(pixel, basePixel));
}

function isMaskEncounterPixel(pixel, basePixel) {
  if (!isAnnotationPixel(pixel, basePixel)) return false;
  return markerEncounterColor(pixel);
}

function getCollisionMaskMarker(x, y) {
  const offsets = [
    [0, 0],
    [-0.22, 0],
    [0.22, 0],
    [0, -0.22],
    [0, 0.22]
  ];
  let sawPixel = false;
  let sawEncounter = false;

  for (const [offsetX, offsetY] of offsets) {
    const sampleX = x + offsetX;
    const sampleY = y + offsetY;
    const pixel = getMarkerMaskPixelAtTile(sampleX, sampleY);
    if (!pixel) continue;
    const basePixel = getMapPixelAtTile(sampleX, sampleY);
    sawPixel = true;
    if (isMaskPortalPixel(pixel, basePixel)) return "portal";
    if (isMaskEncounterPixel(pixel, basePixel)) sawEncounter = true;
  }

  if (sawEncounter) return "encounter";
  return sawPixel ? "walkable" : null;
}

function getCollisionMaskPortalId(x, y) {
  const offsets = [
    [0, 0],
    [-0.22, 0],
    [0.22, 0],
    [0, -0.22],
    [0, 0.22]
  ];

  for (const [offsetX, offsetY] of offsets) {
    const sampleX = x + offsetX;
    const sampleY = y + offsetY;
    const pixel = getMarkerMaskPixelAtTile(sampleX, sampleY);
    if (!pixel) continue;
    const basePixel = getMapPixelAtTile(sampleX, sampleY);
    const portalId = portalIdFromPixel(pixel, basePixel);
    if (portalId) return portalId;
  }

  return "";
}

function isCollisionMaskWalkable(x, y) {
  const pixel = getCollisionMaskPixelAtTile(x, y);
  if (!pixel) return null;
  if (pixel.a < 20) return false;
  if (markerPortalColor(pixel) || markerEncounterColor(pixel)) return true;
  return pixel.r + pixel.g + pixel.b >= 384;
}

function isBlocked(x, y) {
  const map = currentMap();
  if (x < 0 || x >= mapCols() || y < 0 || y >= mapRows()) return true;

  if (isProfessorBlockingTile(x, y)) return true;
  if (isCurrentPortalTile(x, y, map)) return false;

  if (map?.collision === "tiles") {
    return isTileBlockedByList(x, y, map.blockedTiles || []);
  }

  const maskWalkable = isCollisionMaskWalkable(x, y);
  if (maskWalkable !== null) return !maskWalkable;

  if (map?.collision === "rect") {
    return !inRectListV7(x, y, map.walkable || []) || inRectListV7(x, y, map.blocked || []);
  }

  if (collisionReady && map?.src) {
    if (inRectListV7(x, y, map.blocked || [])) return true;
    return !isPixelTerrainWalkable(x, y, map);
  }

  if (state.mapImageAvailable && map?.walkable) {
    return !inRectListV7(x, y, map.walkable) || inRectListV7(x, y, map.blocked || []);
  }

  if (state.mapImageAvailable) {
    return !inRectListV7(x, y, WALKABLE_V7) || inRectListV7(x, y, BLOCKED_V7);
  }

  return ["tree", "water", "roof", "house", "rock"].includes(getTileClass(Math.floor(x), Math.floor(y)));
}

function isTileBlockedByList(x, y, tiles) {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  return tiles.some((tile) => tile.x === tileX && tile.y === tileY);
}

function isTileInList(x, y, tiles) {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  return tiles.some((tile) => tile.x === tileX && tile.y === tileY);
}

function isCurrentPortalTile(x, y, map = currentMap()) {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  return getCurrentPortals(map).some((portal) => isTileInPortal(tileX, tileY, portal));
}

function isProfessorBlockingTile(x, y) {
  const professor = currentMap()?.professor;
  if (!professor) return false;

  return Math.abs(x - professor.x) <= 0.55 && Math.abs(y - professor.y) <= 0.65;
}

function isEncounterArea(x, y) {
  const map = currentMap();
  if (map?.indoor) return false;

  if (isTileInList(x, y, map?.encounterTiles || [])) {
    return true;
  }

  if (getCollisionMaskMarker(Math.round(x), Math.round(y)) === "encounter") {
    return true;
  }

  if (state.mapImageAvailable && map?.grass) {
    return inRectListV7(x, y, map.grass) && isTallGrassAt(x, y);
  }

  if (state.mapImageAvailable) {
    return inRectListV7(x, y, TALL_GRASS_V7);
  }

  return getTileClass(Math.floor(x), Math.floor(y)) === "tallgrass";
}

function canStandAt(x, y) {
  if (currentMap()?.collision === "tiles") {
    return !isBlocked(x, y);
  }

  const points = [
    [x, y],
    [x - 0.045, y],
    [x + 0.045, y],
    [x, y - 0.035]
  ];

  return points.every(([px, py]) => !isBlocked(px, py));
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  $(screenId).classList.add("active");
  state.screen = screenId;

  document.documentElement.classList.toggle("in-title", screenId === "titleScreen");
  document.documentElement.classList.toggle("in-map", screenId === "mapScreen");
  document.documentElement.classList.toggle("in-battle", screenId === "battleScreen");
  document.documentElement.classList.toggle("in-result", screenId === "resultScreen");
  document.documentElement.classList.toggle("in-panel", ["experimentScreen", "dexScreen"].includes(screenId));
  updateGridDebug();

  keysDown.clear();

  if (screenId === "mapScreen") {
    const mapStage = $("mapStage");
    if (mapStage) {
      mapStage.setAttribute("tabindex", "0");
      setTimeout(() => mapStage.focus(), 30);
    }
    updateDeviceMode();
    ensurePlayerOnWalkable();
    updateMapLayout();
  }

  if (screenId === "battleScreen") {
    updateDeviceMode();
  }

  if (screenId === "resultScreen") {
    state.resultIndex = 0;
    updateResultMenu();
  }
}

// Legacy engine note.
function updateMapLayout() {
  const stage = $("mapStage");
  const camera = $("mapCamera");

  if (!stage || !camera) return;

  updateDeviceMode();

  const rect = stage.getBoundingClientRect();
  const stageW = rect.width || window.innerWidth;
  const stageH = rect.height || window.innerHeight;
  const isMobile = state.layout.isMobile;
  const isPortrait = state.layout.isPortrait;

  ensurePlayerOnWalkable();

  let mapW;
  let mapH;

  const minWidthFromHeight = stageH * (mapCols() / mapRows());

  if (isMobile) {
    mapW = isPortrait
      ? Math.max(stageW * 1.52, minWidthFromHeight * 1.01)
      : Math.max(stageW * 1.08, minWidthFromHeight);
  } else {
    mapW = Math.max(stageW * 1.18, minWidthFromHeight);
    if (currentMap()?.indoor) mapW = Math.max(stageW * 1.06, minWidthFromHeight);
  }

  mapH = mapW * (mapRows() / mapCols());

  if (mapH < stageH * 1.02) {
    mapH = stageH * 1.02;
    mapW = mapH * (mapCols() / mapRows());
  }

  state.layout.stageW = stageW;
  state.layout.stageH = stageH;
  state.layout.mapW = mapW;
  state.layout.mapH = mapH;
  state.layout.tileW = mapW / mapCols();
  state.layout.tileH = mapH / mapRows();

  camera.style.width = `${mapW}px`;
  camera.style.height = `${mapH}px`;

  updatePlayerPosition();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
