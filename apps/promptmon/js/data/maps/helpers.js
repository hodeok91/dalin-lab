export function tilesFromRects(rects) {
  const seen = new Set();
  const tiles = [];

  rects.forEach((rect) => {
    const [x1, y1, rawX2, rawY2] = rect;
    const x2 = rawX2 ?? x1;
    const y2 = rawY2 ?? y1;

    for (let y = y1; y <= y2; y += 1) {
      for (let x = x1; x <= x2; x += 1) {
        const key = `${x},${y}`;
        if (seen.has(key)) continue;
        seen.add(key);
        tiles.push({ x, y });
      }
    }
  });

  return tiles;
}

export const emptyTiles = [];
