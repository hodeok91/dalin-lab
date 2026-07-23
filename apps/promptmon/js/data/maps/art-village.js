import { tilesFromRects } from "./helpers.js";

// 예술마을 수정 파일입니다. blockedTiles는 못 가는 칸, encounterTiles는 몬스터 출현 칸입니다.
const blockedTiles = tilesFromRects([
  [0, 0, 39, 1],
  [0, 19, 18, 19],
  [22, 19, 39, 19],
  [0, 0, 0, 19],
  [39, 0, 39, 19],
  [18, 1, 23, 5],
  [10, 7, 15, 10],
  [25, 7, 30, 10],
  [19, 7, 21, 9],
  [17, 10, 23, 12],
  [12, 12, 17, 15],
  [24, 12, 29, 15]
]);

const encounterTiles = tilesFromRects([
  [1, 2, 8, 9],
  [32, 2, 38, 9],
  [1, 12, 8, 18],
  [31, 12, 38, 18]
]);

export const artVillageMap = {
  id: "art-village",
  name: "예술마을",
  src: "./assets/maps/art-village.png",
  cols: 40,
  rows: 20,
  bgm: "artBgm",
  collision: "tiles",
  start: { x: 20, y: 18, dir: "up" },
  blockedTiles,
  encounterTiles,
  encounterVillage: "art",
  grass: [],
  encounters: [{ village: "art", name: "예술마을", rects: [[1, 2, 8, 9], [32, 2, 38, 9], [1, 12, 8, 18], [31, 12, 38, 18]] }],
  portals: [
    { id: "to-vague-east", x1: 19, y1: 19, x2: 21, y2: 19, facing: "down", toMap: "vague-village", toX: 38.8, toY: 10, toDir: "left" }
  ],
  exits: []
};
