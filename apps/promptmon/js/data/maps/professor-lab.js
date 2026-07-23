import { tilesFromRects } from "./helpers.js";

/*
  지박사 연구소 맵 설정 파일입니다.

  blockedTiles:
  - 캐릭터가 못 가는 칸입니다.
  - [x, y]는 한 칸, [x1, y1, x2, y2]는 사각형 범위입니다.
  - 길까지 막히면 큰 범위를 줄이거나 작은 범위 여러 개로 나누세요.

  portals:
  - width/height 방식이 아니라 x1/y1/x2/y2 범위로 관리합니다.
  - 1x2 포탈: x1과 x2를 같게 두고 y만 2칸으로 잡습니다.
  - 2x1 포탈: y1과 y2를 같게 두고 x만 2칸으로 잡습니다.
*/

const blockedTiles = tilesFromRects([
  // 맵 바깥과 벽입니다.
  [0, 0, 3, 19],
  [27, 0, 29, 19],
  [4, 0, 29, 2],
  [4, 18, 12, 19],
  [17, 18, 26, 19],
  [13, 19, 16, 19],

  // 위쪽 기계, 창문 아래 장식장, 컴퓨터, 책장 영역입니다.
  [4, 3, 13, 3],
  [4, 4, 13, 4],
  [4, 5, 13, 5],
  [17, 3, 26, 3],
  [17, 4, 26, 4],
  [17, 5, 26, 5],

  // 왼쪽 진열대와 왼쪽 아래 화분입니다.
  [4, 6, 5, 14],
  [4, 16, 5, 17],

  // 중앙 큰 테이블입니다.
  [13, 9, 16, 12],



  // 오른쪽 게시판, 오른쪽 아래 책장/서랍장, 오른쪽 아래 화분입니다.
  [23, 7, 26, 7],
  [23, 8, 26, 8],
  [23, 9, 26, 9],
  [23, 11, 26, 11],
  [23, 12, 26, 12],
  [23, 13, 26, 13],
  [23, 14, 26, 14],
  [25, 15, 26, 15],
  [25, 16, 26, 16],
  [25, 17, 26, 17]
]);

export const professorLabMap = {
  id: "professor-lab",
  name: "지박사 연구소",
  src: "./assets/maps/professor-lab.png",

  cols: 30,
  rows: 20,

  indoor: true,
  bgm: "labBgm",
  collision: "tiles",

  start: { x: 11, y: 10, dir: "up" },
  professor: { x: 15, y: 4.8, dir: "down" },

  blockedTiles,

  grass: [],
  encounters: [],

  portals: [
    {
      id: "lab-exit",
      x1: 13,
      y1: 18,
      x2: 16,
      y2: 19,
      facing: "down",
      toMap: "vague-village",
      toX: 12.5,
      toY: 6.2,
      toDir: "down"
    }
  ],

  exits: []
};
