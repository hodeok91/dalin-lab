# 질문별 안전 상황 그림

제작일: 2026-11-14. 내장 `image_gen`으로 한 그림마다 별도 호출했다. CLI/API 대체 경로는 사용하지 않았다. 런타임·학습 문항·기존 장소 그림은 수정하지 않았다.

## 저장 파일과 검수

출력은 모두 1200×800, 3:2, WebP이다. 원본 캐릭터 시트의 얼굴·머리·체형·형아맨 복장을 유지하고, 교사 옷만 장소에 맞게 바꿨다. 인물과 배경 모두 굵고 선명한 어두운 윤곽선과 단순한 2D 셀 채색을 사용했다. 이미지마다 직접 확인한 뒤 Sharp로 크기·포맷만 변환하고 메타데이터를 검사했다.

| 파일 (`media/scenarios/`) | 장면과 확인한 내용 |
|---|---|
| museum-touch.webp | 형아맨과 남교사가 관람 경계 밖에서 전시물을 눈으로 본다. 교사는 전시물과 관람선을 안내하며, 형아맨은 손을 뻗거나 유리·유물을 만지지 않는다. |
| museum-lost.webp | 형아맨이 안내 데스크 앞의 안전한 곳에서 직원에게 도움을 요청한다. 직원과 전화가 보이고, 형아맨은 혼자 출구를 찾아 돌아다니지 않는다. |
| cinema-noise.webp | 형아맨이 영화관 좌석에 앉아 한 손으로 귀를 가리고 다른 손으로 옆 여교사에게 불편함을 알린다. 교사는 표현을 받아 준다. |
| cinema-fire.webp | 형아맨과 여교사가 직원의 안내에 따라 장애물 없는 통로로 걸어 열린 출구를 향한다. 화염·연기·부상·공황 장면은 없다. |
| cinema-quake.webp | 형아맨이 자리에 앉아 자세를 낮추고 가방으로 머리를 보호한다. 여교사도 머리를 보호하며 앉아 있다. 흔들리는 동안 이동하거나 출구로 뛰지 않는다. |
| sports-injury.webp | 형아맨이 활동을 멈추고 성인에게 도움을 요청한다. 친구는 트램펄린 옆 패드에 앉아 있고, 누구도 억지로 일으키거나 끌지 않는다. 상처·출혈·골절 묘사는 없다. |

이는 문항 내용을 설명하는 그림이며 현장 대피도·실제 안전 능력 평가·응급처치 지침을 대신하지 않는다. 재난 문항은 교사가 장소의 실제 안내와 학생별 지원 방법을 함께 설명한다.

## 참조와 생성 원본

참조 캐릭터:

- `E:/안전교육/캐릭터원본/형아맨.png`
- `E:/안전교육/캐릭터원본/남자선생님.png`
- `E:/안전교육/캐릭터원본/여자선생님.png`

장소·화풍 참조: 기존 `media/illustrations/museum.webp`, `cinema.webp`, `sports.webp`를 직접 열어 확인하고 사용했다.

생성 원본 폴더: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-da07-7293-9e10-b4189a966287/`.

| 최종 이름 | 생성 원본 PNG (`exec-` 접두사) |
|---|---|
| museum-touch | 96c25d18-7f53-4ac5-be7a-6319906db7ef |
| museum-lost | 7191f7b3-c24d-422e-acc7-b54e52ac479e |
| cinema-noise | 61ae2020-e4e2-4105-be7e-d4b70ac921d7 |
| cinema-fire | a18c9b15-7950-4866-a130-12bb122b85a7 |
| cinema-quake | 75d0c231-c10b-412d-9d49-9e5c64d2ffeb |
| sports-injury | 4319f25f-c62d-47b5-b744-8b8a813a0ee3 |

## 최종 프롬프트 세트

다음 공통 요구와 각 장면의 구체 내용을 합쳐 개별 프롬프트로 사용했다.

공통: Use case scientific-educational. ONE complete landscape 3:2 safety-question illustration, 1200×800 composition. Exact HA character-sheet identity: brown hair, friendly chibi face, white suit, blue gloves/boots/belt, red HA lightning chest emblem. Teacher reference sheets lock face/hair identity ONLY; replace formal suit/heels with appropriate casual clothing and sneakers matching existing venue illustration. Crisp thick dark navy cartoon outlines, matte simple flat 2D cel shading, consistent friendly proportions. No 3D/gloss/photo/painterly. No words/letters except HA chest emblem; no written labels, UI, numbers, arrows, badges, speech bubbles, markers or borders. Readable calm educational action; no graphic injury or frightening disaster details.

### museum-touch

Museum exhibit viewing WITHOUT TOUCHING. Use male teacher with light-blue rolled-sleeve casual button shirt, beige pants and white sneakers. HA stands left, hands lowered near body and feet behind a clear red velvet viewing rope/observation boundary. Teacher stands beside HA, calmly open-hand gesturing to exhibit and viewing line. Right: large pottery vase inside closed clear glass showcase on sturdy low plinth, unobscured, boundary clearly separates visitors and case. Interested calm HA, no reaching over rope, no touching glass/artifact, no crossing barrier. Simple bright museum gallery and small background exhibits, no prohibition icon.

### museum-lost

HA cannot see his class group and seeks staff HELP at a staffed information desk. HA stands safely and calmly at left of museum information counter, feet stationary, one hand raised/open asking for help, looking to staff. Friendly ordinary female employee behind counter, navy vest over cream shirt, blank name tag, reassuring open hand and simple desk phone. No teacher/classmate next to HA so asking staff is clear; no wandering toward exit. Small museum cases/pottery, safe bright lobby. No distress, tears, chasing, abduction, injury or speech bubbles. Full HA body and staff face visible.

### cinema-noise

Cinema sound feels too loud; HA communicates discomfort to teacher. Female teacher in mint cardigan, navy pants and white sneakers, same identity as sheet and existing cinema scene. HA seated left/center in red theater chair, one gloved hand over ear, other open hand gently signaling to teacher seated right. Turns to teacher with mildly uncomfortable calm face, no screaming/crying. Teacher faces HA attentively with reassuring open hand and recognizes request for a break. Both remain seated; upper bodies, hands and ear gesture clear. Red chairs, dim but readable friendly lighting, blank screen and simple speakers in background, no sound-effect writing or dramatic darkness.

### cinema-fire

Calm cinema evacuation DRILL guided by staff along CLEAR safe exit. Ordinary friendly cinema staff in navy vest/cap at right, open arm guiding to wide open exit doorway into bright empty corridor. HA walks calmly beside/behind staff at center; mint-cardigan teacher safely follows left. Together, not running, feet visible. Clear continuous unobstructed aisle between red seat rows leads to doorway; no bags/equipment/furniture, bottleneck or stairs. Green sign above exit with white exiting-person pictogram only, no words/arrows. Friendly drill, no flames/smoke/debris/blood/panic/crowd/elevator, no fetching wet cloth, firefighting or smoke-crawling.

### cinema-quake

During earthquake shaking in cinema: PROTECT HEAD and lower posture while STAYING at seat; do NOT evacuate during shaking. HA seated left/center in red chair, leans forward with body low, holds soft blue schoolbag firmly over top of head with both gloved hands. Head/chest tucked, not under chair, not standing/running. Mint-cardigan female teacher seated adjacent right in same low forward posture with both arms over top/back of head. Calm focused faces; seats, bodies and feet near chairs clearly visible. Empty aisle, nobody walking. Blank screen, intact ceiling, no falling objects/collapse/flames/debris/injury. No shaking icons needed; protective action is the focus.

### sports-injury

Trampoline facility: friend has fallen and sits on padding; HA STOPS ACTIVITY and asks adult staff for HELP. Ordinary friend in green casual sports shirt sits safely on flat padded mat at right/center beside trampoline edge, knees bent and hands near knee, mildly uncomfortable neutral face. No wound/bruising/blood/deformity or dramatic crying; not pulled/carried. HA stands safely off trampoline at left/center on clear flat walkway, one hand alerts adult and other indicates seated friend. HA does not lift/touch friend. Female adult in teal sports zip jacket, navy track pants and white sneakers listens attentively, calmly open-hand signaling wait. Empty unused trampolines in background, no jumping children, loose equipment or clutter. Full figures and feet visible. Get adult help, do not force friend up or resume bouncing.

## 이전에 생성을 시작한 버스 그림 2장의 처리

기존 `media/game/bus-cross.webp`와 `bus-stand.webp`는 덮어쓰지 않았다. 실행 중이던 추가 후보만 `bus-cross-v2.webp`와 `bus-stand-v2.webp`에 저장했다. 이 두 그림은 새 질문 장면 6종과 별도 후보이며 자동으로 채택하지 않았다.

## 추가 6종: 스포츠·박물관 재난 상황과 막힌 연기 통로

출력 크기·도구·화풍은 위와 같다. 각 장면을 직접 열어 행동·주변 위험과의 거리·캐릭터 일관성을 검사했다. 기존 정상 파일은 덮어쓰지 않았다.

| 파일 (`media/scenarios/`) | 생성 원본 PNG (`exec-` 접두사) | 검수한 핵심 |
|---|---|---|
| sports-tired.webp | 892bb287-5af7-46cc-aba0-af84485fbabc | 활동을 멈춘 HA가 안정된 벤치에 앉아 불편함을 성인에게 표현한다. |
| sports-fire.webp | db501e52-1948-4c00-9f04-fc3b2ee25a14 | 트램펄린을 떠나 장애물 없는 바닥 통로로 성인과 함께 열린 출구를 향한다. |
| sports-quake.webp | 1fb8cefc-6b29-4b8d-8fd7-7f5353ac48a4 | 트램펄린 밖의 안정된 바닥에서 낮은 자세로 머리를 보호한다. 흔들리는 동안 뛰거나 이동하지 않는다. |
| museum-fire.webp | 53d84ba5-6c33-42b6-af26-674906250986 | 관람을 중단하고 직원·교사와 열린 전시실 출구로 함께 걸어간다. |
| museum-quake.webp | 8d23ecef-d59d-4f0b-8416-7bc03fa96ca8 | 유리 진열장과 충분한 빈 공간을 두고 떨어져 머리·몸을 보호한다. 진열장을 붙잡지 않는다. |
| cinema-smoke.webp | c57bc946-2617-419d-923e-2e54e598c37e | 복도 끝 연기 통로에서 멀리 떨어진 곳에 멈춰 직원에게 알린다. 직원의 정지 손바닥이 보이고 누구도 연기로 향하지 않는다. |

cinema-smoke 최초 생성본 `exec-e5355b27-151c-416d-8010-647f454b1249.png`의 직원 한쪽 팔이 연기 방향으로 펼쳐져 있었다. 오해를 줄이기 위해 해당 팔만 내리는 정밀 편집을 한 번 했고, 편집 후 최종본만 프로젝트에 저장했다.

### 추가 최종 프롬프트 세트

앞의 공통 화풍·캐릭터 고정·금지 요소를 동일하게 적용했다.

- **sports-tired:** Feeling dizzy/tired during trampoline play: STOP and tell adult. HA seated safely on stable rest bench on clear solid floor, one glove touches forehead, other open hand tells nearby teal-tracksuit female staff. Mildly tired/concerned, conscious, no falling/crying/dizziness stars. Staff listens, does not make HA stand/drink/exercise. Empty unused trampolines in background, clear resting area, no medical drama.
- **sports-fire:** Sports evacuation drill. HA walks calmly following teal-tracksuit adult to wide open confirmed clear exit and bright empty corridor. Empty trampolines behind rail left, unobstructed flat solid-floor route. Full bodies/feet, green exiting-person pictogram only. No stairs, elevator, flames, smoke, panic, crawling, firefighting or fetching possessions.
- **sports-quake:** During shaking stop play and protect head on stable clear perimeter floor BESIDE equipment, not on/under trampoline. HA and teal-tracksuit adult kneeling/crouching low, both forearms/hands securely over head, stable feet, no walking/running. Empty equipment far behind rail, safe open space away from large glass/equipment. Intact structure, no injuries/debris or shaking icons needed.
- **museum-fire:** Museum evacuation drill. Navy-vest museum staff leads HA and casual light-blue-shirt male teacher calmly through wide open gallery exit into clear bright corridor. Glass cases remain behind, no touching/carrying artifacts or returning for items. Broad unobstructed flat aisle, full bodies/feet, no stairs/elevator, no flames/smoke/broken glass/crowd/panic.
- **museum-quake:** Protect head and body FAR AWAY FROM GLASS SHOWCASES. HA and casual male teacher low kneeling/crouching on clear floor in lower-left/center, both hands/forearms over head. Museum cases far upper-right, conspicuous wide empty floor gap. Neither touches/leans/grabs cases, rope or pedestal; not under them; no walking/evacuation during shaking. Intact cases and room, no falling exhibits/injury/drama.
- **cinema-smoke:** Dense opaque dark-gray smoke confined to far-right corridor doorway. HA and navy-vest/cap cinema staff stand STILL in clear air at left/center with several body-widths of empty floor before smoke. HA raises open glove to alert staff; staff raised STOP palm toward HA, other arm relaxed at side. Nobody approaches, enters, crawls into or points toward smoke. Red cinema entrance/seat context left. No flames, injury, panic, wet cloth or firefighting.
- **cinema-smoke 정밀 편집:** Preserve whole scene and exact identities/style. Change ONLY staff arm on viewer right from extended-toward-smoke to lowered relaxed arm with hand at own hip. Keep other STOP palm raised. Characters stationary in clear air, large gap and distant confined smoke unchanged. No new objects/text/UI/arrows; no gesture toward smoky passage.

## 마지막 추가 3종: 대화·경보 알림·깨끗한 대피 경로

각 1200×800 WebP. 동일 내장 도구·원본 시트·기존 장소 삽화 화풍을 사용했다. 각 결과를 직접 열어 문항 의미와 인물·행동을 검사한 뒤 크기·포맷만 변환했다. 총 질문 장면 15종이 이 문서의 제작 범위다.

| 파일 (`media/scenarios/`) | 생성 원본 PNG (`exec-` 접두사) | 검수한 내용 |
|---|---|---|
| museum-voice.webp | eea61407-6c64-4970-8e26-7d26fcfbd732 | HA가 관람선 밖에서 친구에게 작은 입 모양과 차분한 몸짓으로 말한다. 교사는 가까이서 지켜보며 혼내거나 입을 막지 않는다. |
| escape-alarm.webp | d720b99f-8dcb-433d-86cf-7bf2cb8d26cc | 숙소 방의 붉은 경보기 불빛을 본 HA가 교사에게 알린다. 연기·화염·짐을 챙기는 행동이 없다. |
| escape-clear.webp | 0b0179de-8f49-49a5-92fc-5f43f3df88e9 | HA와 교사가 빈손으로 장애물 없는 숙소 복도를 함께 걸어, 외부로 이어지는 확인된 출구로 향한다. |

추가 화풍 참조는 `media/illustrations/lodging.webp`와 `escape.webp`이며 직접 열어 확인했다. 기존 숙소 손전등 게임 배경과 원래 안내 그림은 변경하지 않았다.

최종 프롬프트 세트(앞의 공통 시트 고정·2D 셀 채색·텍스트/UI 금지 조건을 동일 적용):

- **museum-voice:** Museum small-voice friendly conversation. HA and ordinary green-shirt friend stand safely outside velvet viewing rope; HA turned to friend with small softly open mouth and relaxed low open hands, friend listens. Casual light-blue-shirt male teacher nearby calmly observes, not shushing/scolding/punishing. Closed pottery showcase on right, no reaching/touching/running/shouting. No sound writing/bubbles; gentle voice through restrained expression, not silencing involuntary sounds.
- **escape-alarm:** Lodging bedroom; visible small red alarm beacon high near open room doorway. Exact HA stands safely on floor, raises open glove to draw casual peach/orange-cardigan female teacher's attention to alarm, other hand open asking for help. Teacher listens with gentle concern. Simple bed/window, clear floor, full figures/feet. No smoke/flames, no hiding/running/panic, no belongings in hands or getting bag. Notify adult promptly rather than ignore alarm or delay for possessions.
- **escape-clear:** Verified clear lodging exit, leaving belongings. Exact HA and mint-zip-hoodie female teacher walk calmly together on clean smooth corridor toward wide open exit on right, teacher leads with open hand. EMPTY HANDS, no bags/towels/phones/possessions, no returning for objects. Closed guest-room doors and handrail left, no obstacles/stairs/elevator, continuous ground-level exit to safe outdoor assembly garden. Green exiting-person pictogram only, full bodies/feet, no smoke/flames/panic/crowd/crawling/firefighting.

## 위험 상황 표정 재검수와 수정본

사용자의 지적에 따라 제작한 15종을 모두 다시 열어 표정을 검사했다. 화재·지진·경보·연기·부상·불편함·길 잃음 상황에서 웃는 표정이 상황 의미를 약하게 만들고 있어, 해당 12종을 내장 `image_gen`으로 **얼굴 표정만 편집**했다. 기존 원본은 보존하고 `-serious.webp` 형제 파일로 저장했다. 새 연결 대상으로 아래 수정본을 사용한다.

표정 기준은 침착하고 진지한 집중, 또는 약간의 걱정이다. 입은 닫힌 중립선이나 살짝 아래로 향한 선이며, 인물 모두의 웃음·환호·즐거운 눈빛을 없앴다. 화난 표정·과도한 공포·울음으로 바꾸지 않았다. 구도·의상·손짓·안전 행동·진열장과의 거리·대피 경로·연기와의 안전 간격은 유지했다. 모든 수정본을 직접 확인했으며, 크기는 각1200×800이다.

| 편집 결과 (`media/scenarios/`) | 생성 원본 PNG (`exec-` 접두사) |
|---|---|
| sports-injury-serious.webp | 3bc5c275-3ab4-40f2-b8c6-ffcec0ab687c |
| sports-tired-serious.webp | ad3c9c74-c623-42c6-9b25-9ea6dde6f437 |
| sports-fire-serious.webp | 1ddace22-c84f-4558-ab7e-60010240f6cc |
| sports-quake-serious.webp | 46605b82-834d-4ecb-a237-499ab83cb435 |
| museum-fire-serious.webp | c7b17387-2e6e-45c1-9dd5-2d52b203b7e4 |
| museum-quake-serious.webp | 8319d4c2-1e8e-491d-ac33-5a06e1cdd8ce |
| cinema-fire-serious.webp | 9e6dc3e1-e789-47f8-adb9-8e76f3d46a2e |
| cinema-smoke-serious.webp | 69f5f71b-6595-45f1-b382-d4babe5f2464 |
| escape-alarm-serious.webp | 61332a0e-9ca4-4855-a969-0332c7a12651 |
| escape-clear-serious.webp | b7be4dc1-0275-48ed-998e-61692b73627b |
| cinema-noise-serious.webp | 3635c924-d904-44b8-b357-e9a1fe066880 |
| museum-lost-serious.webp | 58580a0f-0419-4f8f-8170-257d36680ce4 |

검수 후 편집을 생략한 3종:

- `cinema-quake.webp`: 이미 닫힌 입과 진지한 표정으로 머리를 보호하고 있었다.
- `museum-touch.webp`: 평상시 관람 경계·눈으로 보는 행동을 안내하는 장면이므로 친근한 표정을 유지했다.
- `museum-voice.webp`: 위험 발생 장면이 아닌 차분한 대화 장면으로, 작은 입 모양과 자연스러운 표정을 유지했다.

공통 최종 편집 프롬프트:

> Precise FACE-ONLY EDIT of this existing safety education illustration. Preserve composition, every character's EXACT identity/hair/outfit/proportions and ALL body poses/hands/gestures/safety actions, background, objects, routes, distances, palette and thick dark navy lineart/flat2D cel shading. Change ONLY FACIAL EXPRESSIONS of EVERY VISIBLE PERSON: calm SERIOUS ATTENTIVE, slightly concerned focused eyebrows, eyes open attentive with no joyous/laughing look. Every mouth CLOSED, a small neutral straight or slightly downward line; NO upturned mouth corners, NO smiles, grins, open-mouth cheerfulness or celebratory expressions. Do NOT make them angry, panicked, crying or terrified. This is a DANGER or DISCOMFORT/help-seeking situation, so people must look serious and caring. No thumbs-up, no text/UI, add nothing else. Preserve exact3:2 landscape framing, complete bodies and original safe action.

위 공통 프롬프트 뒤에 각 그림의 원래 행동 보존 조건을 덧붙였다. 부상 친구는 앉아 있고 아무도 일으키지 않는다. 어지러운 HA는 이마를 짚고 앉아 있다. 화재 대피는 확인된 출구로 함께 걷는다. 지진은 손으로 머리를 보호하며 낮은 자세를 유지한다. 연기는 직원의 정지 손바닥·옆으로 내린 다른 팔·연기와의 넓은 간격을 유지한다. 경보 알림에서는 연기나 새 물건을 추가하지 않는다. 소음 불편은 귀를 가린 손과 앉은 자세를, 길 잃음은 직원·안내 데스크·전화와 도움 요청 손짓을 유지한다.

### 위험 미션용 형아맨 초상

`media/brand/hero-concerned.png`를 별도로 제작했다. 877×960 PNG, 실제 알파 투명 배경. 생성 원본 `exec-960270f8-1631-4214-ae69-61d7610f9fdb.png`. 원본 시트를 다시 열어 참조했고, 형아맨의 머리·얼굴·흰색/파란색 복장·HA 문양을 유지했다. 팔을 내린 자세, 닫힌 입, 진지하게 집중하는 눈과 눈썹이며 칭찬·엄지·환호 표현이 없다.

최종 프롬프트: One transparent isolated character portrait for serious safety mission dialogue. Exact same HA character from ORIGINAL sheet: brown side-swept hair, large brown eyes, cheek shape/chibi proportions, white suit, blue shoulder pads/gloves/belt, original redHA with orange lightning chest emblem, dark clean outlines and flat2D cel shading. Keep identity/costume unchanged. Single near-front/slight-three-quarter figure, arms lowered naturally at sides, relaxed hands, no raised hands/thumbs/fists/celebration. Calm SERIOUS/FOCUSED expression with slightly concerned brows, attentive eyes, CLOSED small neutral straight mouth. No smile/upturned corners/laughter/joyful eyes; not angry/terrified/crying/injured/panicked. Emergency/danger dialogue portrait, NOT praise mascot. Full head/hair/shoulders/waist, clear margin, crisp silhouette meeting actual transparent background, no glow/halo/plate/sticker border/drop shadow/vignette. No text except original HA emblem, no scenery/UI/badges/arrows. Preserve complete head and hands.
