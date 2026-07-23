import { tilesFromRects } from "./helpers.js";

/*
  막연마을 맵 설정 파일입니다.

  blockedTiles: 못 가는 칸입니다. [x, y] 또는 [x1, y1, x2, y2]로 적습니다.
  encounterTiles: 프롬프트몬이 나오는 칸입니다. 외부 풀숲 칸만 적으세요.
  portals: 다른 맵으로 이동하는 칸입니다.
*/

const blockedTiles = tilesFromRects([
  [0, 0, 18, 0],
  [0, 1, 18, 1],
  [21, 0, 39, 0],
  [0, 18, 18, 19],
  [21, 18, 39, 19],
  [0, 0, 1, 9],
  [0, 11, 3, 19],
  [4, 11, 5, 13],
  [39, 0, 39, 9],
  [39, 11, 39, 19],
  [11, 1, 15, 4],
  [21, 1, 31, 3],
  [6, 7, 11, 9],
  [7, 12],
  [8, 14, 9, 14],
  [9, 8, 11, 8],
  [9, 9, 11, 9],
  [28, 7, 30, 9],
  [8, 2, 17, 5],
  [8, 6, 11, 6],
  [12, 17, 17, 17],
  [13, 15, 18, 15],
  [14, 6, 17, 6],
  [18, 2],
  [18, 3],
  [18, 5],
  [18, 16],
  [11, 12, 15, 13],
  [16, 13],
  [25, 4, 31, 5],
  [27, 6, 32,6],
  [27, 7],
  [24, 12, 29, 14],
  [16, 3, 17, 5],
  [21, 6],
  [22, 3, 24, 6],
  [18, 9],
  [21, 9],
  [14, 7, 16, 7],
  [14, 8, 15, 8],
  [18, 11],
  [21, 11],
  [21, 14, 23, 16],
  [22, 17, 28, 17],
  [23, 7, 24, 7],
  [24, 8, 25, 8],
  [24, 15, 26, 17],
  [14, 13],
  [16, 14],
  [23, 13],
  [8, 9],
  [15, 14],
  [17, 14],
  [27, 9],
  [28, 15, 29, 15],
  [30, 13],
  [30, 14, 31, 15],
  [32, 7, 33, 9],
  [32, 1, 38, 1],
  [32, 11, 32, 14],
  [33, 11, 34, 11],  
  [34, 9],
  [36, 2, 38, 4],
  [37, 11,38, 17],
  [38, 5, 38, 9]
]);

const encounterTiles = tilesFromRects([
  [1, 2, 6, 10],
  [1, 14, 7, 18],
  [34, 2, 38, 9],
  [33, 14, 38, 18]
]);

export const vagueVillageMap = {
  id: "vague-village",
  name: "막연마을",
  src: "./assets/maps/vague-village.png",
  cols: 40,
  rows: 20,
  bgm: "vagueBgm",
  collision: "tiles",
  start: { x: 14.45, y: 7.15, dir: "down" },
  blockedTiles,
  encounterTiles,
  encounterVillage: "coding",
  grass: [],
  encounters: [
    { village: "coding", name: "막연마을", rects: [[1, 2, 7, 11], [1, 14, 8, 19]] },
    { village: "art", name: "막연마을", rects: [[34, 2, 39, 10], [33, 14, 39, 19]] }
  ],
  portals: [
    { id: "to-coding", x1: 0, y1: 10, x2: 0, y2: 10, facing: "left", toMap: "coding-village", toX: 20, toY: 18, toDir: "up" },
    { id: "to-art", x1: 39, y1: 10, x2: 39, y2: 10, facing: "right", toMap: "art-village", toX: 20, toY: 18, toDir: "up" },
    { id: "to-sound", x1: 19, y1: 19, x2: 20, y2: 19, facing: "down", toMap: "sound-village", toX: 20, toY: 18, toDir: "up" },
    { id: "to-lab", x1: 12, y1: 4, x2: 13, y2: 5, facing: "up", toMap: "professor-lab", toX: 15, toY: 17, toDir: "up" },
    { id: "to-house-1", x1: 10, y1: 9, x2: 10, y2: 9, facing: "up", toMap: "vague-house-1", toX: 15, toY: 17, toDir: "up" },
    { id: "to-house-2", x1: 12, y1: 14, x2: 12, y2: 14, facing: "up", toMap: "vague-house-2", toX: 15, toY: 17, toDir: "up" },
    { id: "to-house-2", x1: 12, y1: 14, x2: 12, y2: 14, facing: "right", toMap: "vague-house-2", toX: 15, toY: 17, toDir: "right" },
    { id: "to-house-3", x1: 27, y1: 14, x2: 27, y2: 14, facing: "up", toMap: "vague-house-3", toX: 15, toY: 17, toDir: "up" },
    { id: "to-house-4", x1: 28, y1: 9, x2: 29, y2: 9, facing: "up", toMap: "vague-house-4", toX: 15, toY: 17, toDir: "up" },
    { id: "to-house-5", x1: 26, y1: 5, x2: 26, y2: 5, facing: "up", toMap: "vague-house-5", toX: 15, toY: 17, toDir: "up" },
  ],
  exits: []
};

