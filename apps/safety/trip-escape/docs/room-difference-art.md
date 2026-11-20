# 숙소 다른 그림 찾기 — 2026-11-14

## 그림과 검수

- `media/game/room-before.webp` / `media/game/room-after.webp`: 각각 1200×675, 16:9.
- built-in image_gen으로 기준 그림 한 장을 생성하고 **그 기준 파일을 참조한 precise-object-edit**로 정리 후 그림을 제작했다.
- 참고 화풍은 기존 숙소 그림 및 형아맨 캐릭터 시트다. 굵은 네이비 윤곽선과 명료한 셀채색을 유지했다. 독립된 동일 숙소 장면이며 인물·제목·UI·문자는 넣지 않았다.
- 두 그림을 나란히 비교했다. 창문·커튼·문·가구의 위치·구도는 동일하고, 의미 있는 차이는 아래 세 사물의 위치·정리 상태다. 원본 이미지를 단순 생성 두 번으로 만들지 않았다.
- 물기 처리는 학생에게 독자적으로 치우라고 요구하는 행동으로 평가하지 않는다. 교사에게 알리고 안전하게 정리된 뒤 통행한다는 안내가 필요하다.

## 세 차이와 터치 영역

모든 좌표는 이미지의 왼쪽 위 기준 **퍼센트**이며 x,y,w,h 순서다. 그림 자체를 클릭하는 포인터 활동과 같은 의미의 큰 대체 버튼을 함께 제공한다. 타이머나 오답 감점은 필요 없다.

| ID | 배운 행동 | 정리 전 영역 | 정리 후 영역 | 두 위치를 아우르는 그룹 |
|---|---|---|---|---|
| board | 침대 위 물건은 지정한 선반에 정리해요. | 9,64,19,18 | 5,36,16,12 | 3,31,32,56 |
| bag | 통로를 비우고 가방을 사물함에 넣어요. | 42,59,17,30 | 41,44,10,19 | 39,41,24,49 |
| cup | 젖은 바닥은 선생님께 알리고 물기를 제거한 뒤 다녀요. | 76,79,19,18 | 77,55,6,12 | 75,54,20,43 |

컵의 정리 후 영역은 화면이 작으면 44px 이상 터치 영역을 보장하도록 넓히거나 아래 대체 버튼을 사용한다. 보드·컵·가방의 출발 위치와 도착 위치 중 어느 쪽을 눌러도 해당 차이 발견으로 처리할 수 있다.

## 생성 프롬프트 기록

기준: “ONE 16:9 landscape illustration, the BEFORE image of a children's lodging safety spot-the-difference activity. STYLE only references. Bold dark navy outlines, restrained 2D cel shading, warm cream/coral/blue. No people, no text, no UI. Fixed frontal slightly elevated three-quarter bedroom. Left: low bed with blue blanket and red skateboard on top; empty shelf behind. Middle: empty two-cubby locker and blue-yellow backpack obstructing floor path. Right: empty low tabletop; green tipped cup and small blue spill on floor. Exactly three unsafe objects. No extra objects.”

편집: “Same exact dimensions/camera/framing/style and unchanged details. Move red skateboard into upper left shelf; blue-yellow backpack into left cubby of middle locker; green cup upright onto right table and remove all spilled water. Change exactly those three objects. Preserve all furniture/window/curtain/pillow/blanket/floor/door geometry. No people/text/checkmarks.”

원본: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-8e7b-7e91-9b73-97017c7fcbfa/exec-2aa37d33-c270-49e4-b126-eb583b0566ed.png`, `exec-f3cbd518-1ab8-4993-a11c-22cda3dc079d.png`. 개발용 비교본 `E:/안전교육/미리보기/room-difference-pair.png`, 좌표 JSON `room-difference-regions.json`.
