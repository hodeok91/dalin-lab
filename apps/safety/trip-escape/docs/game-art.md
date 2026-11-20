# 게임 오브젝트와 탐험 맵

2026-11-14. 도구: 내장 `image_gen` (CLI/API 대체 사용 없음).
원본 캐릭터 시트는 스타일 참조로만 사용했다. 기존 위험물 생성 원본을 회수하고, 실제 알파는 있었지만 외곽에 남은 색상 헤일로를 내장 도구로 다시 편집했다. Sharp는 출력 파일의 크기·포맷 변환에만 사용했다.

## 저장 결과

- `media/game/{water-edge,grass,bee,snake,puddle,clear-path}.webp`: 각 256×256, 실제 알파 투명 배경.
- `media/maps/{cinema,park,sports}.webp`: 각 1200×675, 인물과 UI 없는 배경.
- 원본 생성 경로: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-da07-7293-9e10-b4189a966287/`.

| 최종 파일 | 생성 원본 PNG (`exec-` 접두사) |
|---|---|
| snake | 162a6ced-ec94-40cb-a788-aa70776797a0 |
| water-edge | 45ae1f54-fc42-4610-9d9d-52071930a549 |
| grass | 7f32ddc7-5b91-483a-a87f-7d10a09d82af |
| bee | cc60e7da-38cb-462d-bbe2-199ad4fe5353 |
| puddle | fc5b7b54-002c-4017-ace2-872f97420575 |
| clear-path | 6c4b1138-305a-44ec-a48f-e18ed634b1b6 |
| park | 3439a21b-7836-47bc-a558-cb083a47eb6b |
| cinema | b63a58eb-0b96-411c-af72-54b29e9715ad |
| sports | 29515568-191a-47b8-9847-1eebaaa1ce3a |

## 최종 프롬프트 세트

위험물 편집 공통: Keep the single original subject and recognizable colors/proportions. Thick dark crisp contour, clear flat 2D character-sheet cartoon cel shading, matte simple colors. Remove ALL outer colored glow/halo/ambient shadow. Crisp outer dark contour must immediately meet 100% transparent empty background. No semitransparent haze, vignette, drop shadow, sticker border, plate, text, additional icon or objects. Full centered object with clear margin, no crop. Square transparent canvas.

- snake: olive green S-shaped snake, dark green patches, large dark eye and cream belly. Keep complete tail and head.
- water-edge: blue lake behind robust metal railing and small peach pathway base. Keep protective fence, no person. Simplify glossy gradients to flat cel fills.
- grass: tall green clump rooted in small tan soil patch. Keep every leaf tip. No green halo or tan halo.
- bee: yellow and dark brown striped honeybee, six legs, antennae, pale blue wings, dark oval eyes. No smiling fantasy accessories. Preserve complete wings/antennae/legs.
- puddle: small shallow blue puddle in tan soil outline. Full puddle visible. Matte flat cel colors.
- clear-path: winding peach clear path with low green grass shoulders. No stones on walking path; tiny stones at grass edges permitted.

맵 공통: Use case illustration-story. Safety-game exploration background, landscape 16:9, 1200×675 composition. Original HA sheet is STYLE reference only; do not depict character/text. Park scene or park map is palette/environment/style reference. Friendly bold crisp dark contours, clear matte flat 2D cel shading, simple readable shapes, no painterly/photo/3D/glossy realism or diffuse glow. Three-quarter side-game view. Three zones stay above 62% image height at x20/50/80. Lower65–94% one broad continuous EMPTY clear pedestrian floor/walkway across full width; no obstacles, equipment, steps, water, foliage, floor markings, or objects on this strip. NO PEOPLE, CHARACTERS, ANIMALS, TEXT, LETTERS, MISSION MARKERS, UI, BADGES, ICONS, or borders. Full bleed scenery, a separate avatar is overlaid.

- park: blue lake upper left behind continuous robust metal fence; center shaded trail and rest bench; right meeting pavilion; lush trees in background. Light peach continuous safe lower walkway, all water behind fence.
- cinema: upper left exit corridor and green white exiting-person pictogram (no letters); upper center auditorium entrance showing red seats, dim room but friendly clear scene; upper right bright lobby meeting area and upholstered bench. Warm cream lower floor, no fake-text posters/counters/snack clutter.
- sports: upper left lockers/cubby storage and low rack; upper center separated trampoline area behind blue padded perimeter rail, orange/blue trampoline mats; upper right rest bench. Pale peach lower pedestrian floor, no equipment/steps/padding/nets/toys on strip. Blue/orange/cream palette, no glossy floor reflections.

## 확인 범위

9개 이미지를 직접 열어 대상·외곽·스타일·인물/문자 유무·보행 띠를 확인했다. 6개 오브젝트의 알파와 픽셀 크기, 3개 맵의 출력 크기를 Sharp 메타데이터로 검사했다. 시네마 녹색 표지는 방향 개념을 보여 주는 그림이며 실제 현장 비상구 위치를 대신하지 않는다. 탐험 맵의 하단 보행 띠는 게임 상 이동 영역으로 제한해서 사용한다.

## 추가: 위험 행동 찾기 2장

기존 장소 안내 삽화는 유지하고 별도 게임 그림으로 저장했다. 각1200×800 WebP. 내장image_gen 1장/호출, 원본시트와 기존공원/놀이공원그림 참조. HA는 원래복장, 남교사는민트폴로·운동화, 여교사는복숭아색후드·운동화. 상해·추락·충돌·국쏟아짐 없음. 두그림 직접 검수.

| 최종 파일 | 생성 원본 PNG (`exec-` 접두사) |
|---|---|
| theme-park-find.webp | e0af568f-d190-4b65-890d-b9bed126bf97 |
| rest-find.webp | 0f3c8cb9-7f2d-49b2-b578-50c88d5f4596 |

다음은 최종 그림 기준 권장 터치 영역이다. x/y는 왼쪽 위, w/h는 너비/높이, 모두 전체 그림에 대한 백분율이다. 임의 점수·실제현장능력 판정에 사용하지 않는다.

| 그림 | 행동 | x | y | w | h |
|---|---|---:|---:|---:|---:|
| theme-park-find | 줄에서 친구를 밀거나 앞질러 가기 | 5 | 27 | 25 | 40 |
| theme-park-find | 직원 안내 전 놀이기구 안에서 일어나려 하기 | 44 | 12 | 20 | 29 |
| theme-park-find | 울타리 너머 떨어진 모자에 손 뻗기 | 71 | 23 | 27 | 33 |
| theme-park-find | 이동로에서 뛰기 | 64 | 58 | 23 | 40 |
| rest-find | 뜨거운 국이 담긴 쟁반을 들고 뛰기 | 3 | 34 | 24 | 44 |
| rest-find | 일행에게 알리지 않고 혼자 멀어지기 | 83 | 23 | 11 | 30 |
| rest-find | 젖은 바닥을 그대로 지나가려 하기 | 63 | 54 | 36 | 43 |

테마파크 차량은 멈춘 그림이다. 해당 피드백은 '직원 안내 전 일어서지 않고, 이용 조건과 안전장치를 확인한다'로 쓴다. 그림만으로 운행 중이라고 설명하거나 안전바의 기술적 상태를 단정하지 않는다. 휴게소혼자이동의 작고 좁은 화면좌표는 확대/목록버튼 대체를 제공한다.

추가 최종프롬프트:

- theme-park-find: Scientific educational 'find 4 unsafe actions' Korean amusement park, 3:2 1200×800. Keep HA exact identity/outfit and mint-polo male teacher from references, thick dark crisp cartoon outlines and simple flat2D cel shading. Four large distinct action groups with clear gaps: upperleft queue child cutting in/pushing another child's shoulder; uppercenter stationary ride car child beginning to stand with lapbar up; upperright safe-side child hand reaching over sturdy fence toward dropped blue cap, both feet on safeground; lowerright child running on open pedestrian lane. HA and teacher calmly stand lowercenter guiding. No other hazards, crowd clutter, text/UI/labels/markers/captions, scaryexpressions, injury/fall/collision. Only HA uniform emblem lettering. Background ferriswheel/trees/booth simplified.
- rest-find: Scientific educational 'find 3 unsafe situations' rest-stop food court, 3:2 1200×800. HA exactcostume; longwavy chestnut female teacher identity fromsheet, peachhoodie/navypants/whitesneakers frompark reference. Bolddark contours, friendly clear matte2D cel shading. Left child running carrying upright tray and steaming hot soup bowl, NO spill/collision; upperright child alone walkingaway to faropen visible corridor, rearview; lowerright shallow wetpatch and yellow caution stand with slip-person pictogram/noletters, thirdchild about tostep towardpatch with nofall. HA andteacher stand lowercenter safely guiding. Distinct targetareas, fullbodyfeet, simplifiedfoodcourt background, no writtenmenus/labels/UI/numbers/captions/borders/extra hazards/injuries/scaryfaces.

## 추가: 버스 위험 행동과 안전장치 함께 찾기

`media/game/bus-find.webp`, 1200×800. 내장 `image_gen` 1회 생성. 원본 `exec-8e7fe7a4-7788-4831-97c2-f6a97523abb8.png` (위와 같은 생성 폴더). 기존 `media/illustrations/bus.webp`는 유지한다.

그림은 학교에서 **출발 준비 중인 정지한 버스**이다. 왼쪽 일반 학생이 서 있고 옆 빈자리의 벨트가 풀려 있다. HA는 중앙에서 안전벨트를 맨 채 앉아 있다. 교사는 일상복과 운동화를 착용하고 출발 준비를 확인한다. 비상망치와 소화기는 가리지 않고 완전히 보이며, 위험 행동과 같은 장면에서 찾을 수 있는 안전장치이다. 장치를 함부로 쓰는 것이 미션은 아니다.

권장 터치 영역(백분율 x,y,w,h):

| 대상 | x | y | w | h |
|---|---:|---:|---:|---:|
| 서 있는 학생과 풀린 안전벨트 | 4 | 33 | 32 | 64 |
| 왼쪽 위 비상망치 | 14 | 12 | 8 | 20 |
| 오른쪽 위 소화기 | 81 | 17 | 9 | 21 |

기기의 좁은 화면에서는 장치 영역의 터치가 작아지므로 아래 목록 버튼으로도 같은 대상을 선택할 수 있어야 한다. 움직이는 버스라고 단정하거나, 교사가 출발 준비 중 서 있는 것까지 오답으로 처리하지 않는다. 학생에게는 '출발 전에 자리에 앉아 안전벨트를 확인해요'로 안내한다.

최종 프롬프트: Scientific-educational 3:2 landscape school-bus interior, 1200×800. Exact HA character-sheet identity/costume; existing bus scene as setting, male teacher identity and style reference. Thick dark clean cartoon ink, matte simple flat2D cel shading, warm cream/navy/blue palette; no3D/gloss/photo/painterly. Parked bus at school BEFORE DEPARTURE. Three distinct unobscured learning targets in one coherent scene: left foreground ordinary yellow-green-shirt boy standing on floor beside his seat, fullbody visible, NOT HA, two loose belt/buckle ends visibly unfastened on adjacent seat; upperleft T-shaped pointed emergency hammer in transparent wall case; right rear red fire extinguisher with black hose/handle and plain blank label. HA safely seated at centerfront wearing clear dark shoulder/lapbelt; casual lightblue/mint polo male teacher with navy pants and white sneakers checking preparations, no suit/tie. Empty other seats, clear gaps, school trees outside, no injury/fall/movingvehicle/crowd. No words/letters except HA emblem; no UI/markers/arrows/numbers/circles/badges/captions/borders. Exactly one hammer and one extinguisher. Final image inspected for identities, loose belt, full equipment visibility and separated targets; dimensions verified from saved WebP metadata.
