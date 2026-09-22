// Bounds are x,y,width,height in the original 1536 x 1024 scene, not viewport pixels.
const SOURCE_TARGETS = [
  {"scene":"#s1-scene","key":"nobelt","source":"img/trip02_bus.png","bounds":[1120,355,416,669],"crop":"bus-nobelt.png","aacKey":"busUnbelted"},
  {"scene":"#s1-scene","key":"ext","source":"img/trip02_bus.png","bounds":[1420,650,116,250],"crop":"bus-extinguisher.png","aacKey":"busExt"},
  {"scene":"#s1-scene","key":"hammer","source":"img/trip02_bus.png","bounds":[45,60,88,182],"crop":"bus-hammer.png","aacKey":"busHammer"},
  {"scene":"#s2-scene","key":"hotfood","source":"img/trip07_rest.png","bounds":[710,386,226,274],"crop":"rest-hotfood.png","aacKey":"restHotfood"},
  {"scene":"#s2-scene","key":"lost","source":"img/trip07_rest.png","bounds":[1054,404,146,241],"crop":"rest-lost.png","aacKey":"restLost"},
  {"scene":"#s2-scene","key":"slip","source":"img/trip07_rest.png","bounds":[997,603,344,309],"crop":"rest-slip.png","aacKey":"restSlip"},
  {"scene":"#s3-scene","key":"cut","source":"img/trip03_park.png","bounds":[0,433,268,325],"crop":"park-wait.png","aacKey":"parkWait"},
  {"scene":"#s3-scene","key":"bar","source":"img/trip03_park.png","bounds":[615,48,171,196],"crop":"park-safetybar.png","aacKey":"parkBar"},
  {"scene":"#s3-scene","key":"fence","source":"img/trip03_park.png","bounds":[1130,394,191,201],"crop":"park-fence.png","aacKey":"parkFence"},
  {"scene":"#s3-scene","key":"run","source":"img/trip03_park.png","bounds":[1040,616,496,354],"crop":"park-walk.png","aacKey":"parkWalk"},
  {"scene":"#s5-scene","key":"jump","source":"img/trip05_room.png","bounds":[174,0,286,351],"crop":"room-bed.png","aacKey":"roomBed"},
  {"scene":"#s5-scene","key":"win","source":"img/trip05_room.png","bounds":[590,253,325,350],"crop":"room-window.png","aacKey":"roomWindow"},
  {"scene":"#s5-scene","key":"plug","source":"img/trip05_room.png","bounds":[744,574,185,170],"crop":"room-outlet.png","aacKey":"roomOutlet"},
  {"scene":"#s5-scene","key":"noodle","source":"img/trip05_room.png","bounds":[857,387,355,597],"crop":"room-hotfood.png","aacKey":"roomHotfood"},
  {"scene":"#s6-scene","key":"alarm","source":"img/trip08_corridor.png","bounds":[591,455,102,150],"crop":"escape-alarm.png","aacKey":"escapeAlarm"},
  {"scene":"#s6-scene","key":"extbox","source":"img/trip08_corridor.png","bounds":[146,418,104,269],"crop":"escape-extinguisher.png","aacKey":"escapeExt"},
  {"scene":"#s6-scene","key":"exit","source":"img/trip08_corridor.png","bounds":[1176,321,132,88],"crop":"escape-exit.png","aacKey":"escapeExit"},
  {"scene":"#indoor-scene","key":"together","source":"img/stages/indoor-playground.png","bounds":[65,58,430,300],"crop":"trampoline-one.png","aacKey":"trampolineOne"},
  {"scene":"#indoor-scene","key":"flip","source":"img/stages/indoor-playground.png","bounds":[1135,60,237,290],"crop":"trampoline-flip.png","aacKey":"trampolineFlip"},
  {"scene":"#indoor-scene","key":"clothes","source":"img/stages/indoor-playground.png","bounds":[22,390,370,624],"crop":"trampoline-clothes.png","aacKey":"trampolineClothes"},
  {"scene":"#indoor-scene","key":"queue","source":"img/stages/indoor-playground.png","bounds":[1010,418,526,606],"crop":"trampoline-queue.png","aacKey":"trampolineQueue"}
];
