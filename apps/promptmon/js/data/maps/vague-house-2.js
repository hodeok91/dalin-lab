import { tilesFromRects } from "./helpers.js";

const blockedTiles = tilesFromRects([
  [0, 0, 29, 3],
  [0, 0, 2, 19],
  [27, 0, 29, 19],
  [0, 19, 13, 19],
  [17, 19, 29, 19],
  [4, 4, 9, 8],
  [21, 4, 26, 8],
  [10, 9, 20, 15]
]);

export const vagueHouse2Map = {
  id: "vague-house-2",
  name: "막연마을 설명방 2",
  src: "./assets/maps/vague-house-2.png",
  cols: 30,
  rows: 20,
  indoor: true,
  bgm: "vagueBgm",
  collision: "tiles",
  start: { x: 15, y: 17, dir: "up" },
  blockedTiles,
  grass: [],
  encounters: [],
  portals: [
    { id: "exit-house-2", x1: 14, y1: 18, x2: 16, y2: 19, facing: "down", toMap: "vague-village", toX: 12, toY: 5.2, toDir: "down" }
  ],
  exits: []
};
