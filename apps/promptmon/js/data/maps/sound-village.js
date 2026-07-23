import { tilesFromRects } from "./helpers.js";

// 소리마을 수정 파일입니다. blockedTiles는 못 가는 칸, encounterTiles는 몬스터 출현 칸입니다.
const blockedTiles = tilesFromRects([
  [0, 0, 39, 1],
  [0, 19, 18, 19],
  [22, 19, 39, 19],
  [0, 0, 0, 19],
  [39, 0, 39, 19],
  [17, 1, 23, 5],
  [17, 8, 23, 11],
  [19, 15, 21, 17],
  [8, 2, 11, 4],
  [29, 2, 32, 4],
  [11, 7, 15, 10],
  [25, 7, 29, 10],
  [3, 2, 8, 6],
  [32, 3, 38, 8],
  [6, 12, 9, 15],
  [30, 12, 34, 15]
]);

const encounterTiles = tilesFromRects([
  [1, 2, 8, 9],
  [32, 2, 38, 9],
  [1, 12, 8, 18],
  [31, 12, 38, 18]
]);

export const soundVillageMap = {
  id: "sound-village",
  name: "소리마을",
  src: "./assets/maps/sound-village.png",
  cols: 40,
  rows: 20,
  bgm: "soundBgm",
  collision: "tiles",
  start: { x: 20, y: 18, dir: "up" },
  blockedTiles,
  encounterTiles,
  encounterVillage: "sound",
  grass: [],
  encounters: [{ village: "sound", name: "소리마을", rects: [[1, 2, 8, 9], [32, 2, 38, 9], [1, 12, 8, 18], [31, 12, 38, 18]] }],
  portals: [
    { id: "to-vague-south", x1: 19, y1: 19, x2: 20, y2: 19, facing: "down", toMap: "vague-village", toX: 20, toY: 18, toDir: "up" }
  ],
  exits: []
};
