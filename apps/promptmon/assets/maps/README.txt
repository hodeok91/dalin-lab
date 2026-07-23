Promptmon map files

Outdoor maps
- vague-village.png
  막연마을. Main hub map. The professor NPC stands near the lab.
  Path exits:
  - left path -> art-village.png
  - top path -> coding-village.png
  - right path -> sound-village.png
  - lab door -> professor-lab.png
  - other house doors -> vague-house-1.png through vague-house-5.png

- art-village.png
  예술마을 outdoor map. Grass encounters use art Promptmon.
  Return path: right edge -> vague-village.png

- coding-village.png
  코딩마을 outdoor map. Grass encounters use coding Promptmon.
  Return path: bottom edge -> vague-village.png

- sound-village.png
  소리마을 outdoor map. Grass encounters use sound Promptmon.
  Return path: left edge -> vague-village.png

Indoor maps
- professor-lab.png
  지박사 연구소 interior.

- vague-house-1.png
- vague-house-2.png
- vague-house-3.png
- vague-house-4.png
- vague-house-5.png
  막연마을 building interiors for future NPC term explanations.

Engine data
- js/data/maps.js stores each map image path, grid size, walkable rectangles,
  blocked rectangles, grass encounter rectangles, and exits.
- Outdoor maps use a 40 x 20 tile grid.
- Indoor maps use a 30 x 20 tile grid.

Coordinate note
Coordinates are tile rectangles in this format:
[left, top, right, bottom]

Tune these values in js/data/maps.js after playtesting if the player catches on
trees, buildings, furniture, or path edges.
