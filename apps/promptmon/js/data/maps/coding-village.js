import { tilesFromRects } from "./helpers.js";

// 코딩마을 수정 파일입니다. blockedTiles는 못 가는 칸, encounterTiles는 몬스터 출현 칸입니다.
const blockedTiles = tilesFromRects([
  [0, 0, 39, 1],
  [0, 19, 18, 19],
  [22, 19, 39, 19],
  [0, 0, 0, 19],
  [39, 0, 39, 19],
  [17, 3, 23, 7],
  [13, 5, 15, 8],
  [25, 5, 27, 8],
  [9, 7, 13, 10],
  [27, 7, 31, 10],
  [12, 13, 18, 15],
  [21, 13, 27, 15]
]);

const encounterTiles = tilesFromRects([
  [1, 2, 8, 9],
  [32, 2, 38, 9],
  [1, 12, 8, 18],
  [31, 12, 38, 18]
]);

export const codingVillageMap = {
  id: "coding-village",
  name: "코딩마을",
  src: "./assets/maps/coding-village.png",
  cols: 40,
  rows: 20,
  bgm: "codingBgm",
  collision: "tiles",
  start: { x: 20, y: 18, dir: "up" },
  blockedTiles,
  encounterTiles,
  encounterVillage: "coding",
  grass: [],
  encounters: [{ village: "coding", name: "코딩마을", rects: [[1, 2, 8, 9], [32, 2, 38, 9], [1, 12, 8, 18], [31, 12, 38, 18]] }],
  portals: [
    { id: "to-vague-west", x1: 19, y1: 19, x2: 20, y2: 19, facing: "down", toMap: "vague-village", toX: 1.2, toY: 10, toDir: "right" }
  ],
  exits: []
};
