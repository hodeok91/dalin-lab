# 상황 그림 지원 — 2026-11-14

## 검수 정정: 위험 상황의 표정 누락

기존 제작 검수는 행동 배치와 화풍을 확인했지만, 화재·지진·길 잃음·몸의 불편함 등 상황에서 인물이 활짝 웃는 부적절한 표정을 놓쳤다. 사용자의 지적에 따라 이 누락을 정정한다. **이전의 검수 기록은 교육자료 전체 적합성 검수가 완료됐다는 뜻으로 사용하면 안 된다.**

위험·주의 상황은 닫힌 중립 입, 집중하거나 약간 걱정하는 눈썹·시선, 침착하지만 상황을 진지하게 받아들이는 교사 표정으로 수정한다. 공포·울음·분노는 과장하지 않는다. 몸짓·안전 행동·복장·구도·색·캐릭터 정체성은 유지한다. 실제 안전 행동을 잘못 이해하게 하는 웃음이나 표정은 화풍과 별도로 검수해야 한다.

기존 원본은 덮어쓰지 않고 `*-serious.webp` 형제 파일에 표정 수정본을 저장했다. 해당 장면의 배포 참조는 수정본을 사용해야 한다. 안전하게 놀이기구를 이용하는 평상 활동이나 밝은 복도 동행 요청은 위험 장면과 구분한다.

## 초기 제작 기록

built-in image_gen을 사용했다. 원본 형아맨·남녀 교사 시트를 정체성·화풍 참고로 삼았다. 형아맨의 갈색 머리·흰 HA 슈트·파란 장갑/벨트/부츠를 유지했다. 교사는 민트 폴로/코랄 카디건과 편한 바지·운동화로 그렸다. 정장·넥타이·하이힐은 사용하지 않았다. 그림마다 하나의 안전 행동을 명료하게 보여주고 글자·UI·말풍선은 넣지 않았다.

모든 초기 제작 파일: `media/scenarios/`, 1200×800(3:2), WebP quality 89. 시각 검수에서 그림의 핵심 행동·문/출구·도구·인물 위치와 캐릭터 정체성을 확인했다. 아래 이미지는 실제 훈련의 관찰 결과나 안전 능력 인증이 아니다.

| 파일 | 안전 행동과 검수 |
|---|---|
| experience-tool.webp | 형아맨이 두 손을 자기 몸 앞에 두고 뜨거운 글루건에 손대지 않은 채 남교사 시범을 기다림. 교사는 절연 손잡이를 잡고 매트 위 판에 사용. 도구 거치대가 따로 있음. 여교사도 지켜보는 장면. |
| lodging-door.webp | 숙소 문이 닫혀 있고 형아맨은 손잡이에서 떨어져 여교사에게 확인 요청. 여교사가 문을 열지 않고 확인. 남교사도 뒤에서 지켜봄. |
| lodging-health.webp | 침대 끝에 안전하게 앉아 배가 불편함을 여교사에게 알리고, 교사는 눈높이에 앉아 경청. 응급 공포·약물/진단 표시 없음. |
| lodging-night.webp | 밝은 숙소 문간에서 교사와 나란히 서서 복도 쪽 동행 요청. 창밖만 밤이며 방·복도는 밝음. |
| rest-lost.webp | 일행이 없는 형아맨이 실내 직원 안내대에 머물며 도움 요청, 직원이 전화. 교사 둘이 잘못 추가된 초안은 삭제 편집하고, 의자 바닥 반사도 없앰. 주차 버스는 창밖 멀리 있음. |
| heritage-quake.webp | 기와 담장과 지붕에서 멀리 떨어진 넓은 궁궐 마당에서 형아맨·남교사가 낮게 앉아 머리 보호. 붕괴/낙하물/공포 연출 없음. |

## 공통 프롬프트

“ONE 3:2 landscape scientific-educational safety-learning illustration. Match exact friendly chibi 2D character sheets: bold clean dark outlines, broad flat fills, restrained two-step cel shading, same eyes and head proportions. Preserve HA brown hair/white suit/red HA lightning/blue gloves, belt and boots. Teachers retain identity with casual clothes and sneakers. Warm cream/blue/coral colors; clear simple background in same cartoon style. No photoreal texture, blur, shiny floor, 3D, watercolor, sparkles, written labels, speech bubbles, UI or watermark. Show unmistakable safe behavior.”

각 장면 지시는 표의 안전 행동을 구체적으로 추가했다. 건강·밤 초안은 배경의 사실적 재질·바닥 반사가 섞여 기존 숙소 그림을 스타일 참조로 한 `style-transfer` 편집을 수행했다. 밤 창밖이 낮으로 바뀐 수정 초안은 창밖만 밤으로 바꾸는 `precise-object-edit`로 바로잡았다. 휴게소 초안의 동행 교사 둘을 삭제하고, 바닥 반사도 제거했다.

## 원본 파일

기본 경로: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-8e7b-7e91-9b73-97017c7fcbfa/`

- experience-tool: `exec-4872d687-9599-44aa-a481-2cb15b225cc0.png`
- lodging-door: `exec-6c363ba2-d96b-4932-a683-dac69ee1201c.png`
- lodging-health: `exec-14103c36-d0a8-4766-ae88-4c1e685f3ac6.png`
- lodging-night: `exec-0577d9f9-033c-4bbc-bc85-270ebbefd800.png`
- rest-lost: `exec-6446af6e-4e91-4dd9-97ec-f39d360f6275.png`
- heritage-quake: `exec-8a28fa50-cb81-4389-a5c0-bb941efa29b3.png`

## 추가 여섯 장면

| 파일 | 최종 행동·시각 검수 |
|---|---|
| experience-fire.webp | 글루건을 거치대 위에 두고, 형아맨이 직원과 확인된 맑은 출구로 걸어감. 도구 운반·연기 통과 없음. 유도등의 초록 픽토그램과 문밖 개방 공간 확인. |
| experience-quake.webp | 작업을 중단하고 튼튼한 체험 탁자 아래에서 형아맨·남교사가 머리를 보호. 글루건은 탁자 위 거치대에 있으며 만지지 않음. |
| theme-item.webp | 떨어진 빨간 모자는 울타리 안, 형아맨과 직원은 울타리 밖 보행로에서 소통. 울타리 넘기·몸 들이밀기 없음. |
| theme-ride.webp | 형아맨·여교사가 낮은 기차형 놀이기구에 앉아 닫힌 안전바를 잡고 유지. 발은 차체 안. 바퀴의 작은 움직임 표시, 좌석 일어서기 없음. |
| theme-lost.webp | 일행 없이 직원 안내대에 멈춘 형아맨이 도움 요청. 직원은 무전기로 연락, 안내소 밖으로 떠나지 않음. |
| lodging-medicine.webp | 친구가 건네는 약 포장을 형아맨이 편 손으로 정중히 거절하고 여교사에게 확인. 약을 입에 넣거나 받아 쥐는 모습 없음. 친구 비난 표정 없음. |

새 여섯 장면도 각 장면별 built-in image_gen으로 생성했다. 놀이공원 세 장면과 약물 장면의 초안에서 사실적 배경, 교사 정장·구두, 불필요한 글씨/말풍선이 섞였다. `lodging-health.webp`를 순수 화풍 참조로 넣은 style-transfer 편집으로 모든 배경을 굵은 선·넓은 셀 색면으로 단순화하고, 여교사를 코랄 카디건·크림 티·편한 바지·흰 운동화로 수정했다. 형아맨 가슴 외의 장식 HA 로고와 영어 안내문은 제거했다. 핵심 인물·행동·안전 경계를 보존했는지 최종 육안 확인했다.

추가 생성 원본(동일 기본 경로):

- experience-fire: `exec-1dfa2be3-904e-4773-8773-3682f71d7d22.png`
- experience-quake: `exec-dd81a7ed-4c18-4e3a-81b9-654603cf5a59.png`
- theme-item: `exec-4b822674-ec51-4d12-90a6-0455a37d3d6a.png`
- theme-ride: `exec-effb05e8-0493-40ea-b38f-38ec4e65e86e.png`
- theme-lost: `exec-d1b3caf8-be3e-40f3-8c10-692a095db3a0.png`
- lodging-medicine: `exec-3e94679f-8c90-4036-8743-53288e84649d.png`

## 대피 지원 장면

| 파일 | 최종 행동·시각 검수 |
|---|---|
| escape-support.webp | 휠체어를 사용하는 학생이 교사에게 직접 손짓으로 필요한 이동 도움을 표현하고 형아맨도 교사에게 도움 요청. 교사는 눈높이를 낮춰 경청하며 임의로 밀거나 들어올리지 않음. 발 받침·평탄한 이동 길 확인. |
| escape-blocked.webp | 글자 없는 두 장면: 왼쪽에는 사람이 들어가지 않는 연기 찬 복도, 오른쪽에는 닫힌 문 안의 맑은 방에서 창가 가까이 교사가 전화로 도움 요청하고 형아맨이 함께 머묾. 연기 속 진입·창밖 뛰어내림 없음. 실제 숙소 평면도나 특정 시설의 대피 경로를 나타내지 않음. |

이 두 그림은 기존 `media/illustrations/escape.webp`를 화풍·지원 인물 참고로 삼고, 형아맨 원본 시트로 정체성을 유지해 별도 상황 그림으로 생성했다. 그림 속 경로는 실제 시설의 접근 가능한 대피 경로 확인을 대신하지 않는다.

- escape-support: `exec-08b8b9da-e1c6-4dc7-b64c-66edb4d62405.png`
- escape-blocked: `exec-65030402-6212-45e6-b233-279a5f43c7ef.png`

추가 최종 장면 `escape-assembly.webp`: 건물에서 멀리 떨어진 넓고 평탄한 집결 장소에서 교사가 형아맨·휠체어 학생을 포함한 일행의 인원을 확인한다. 집결 픽토그램을 확인했고 재진입하는 사람은 없다.

- escape-assembly 최종 생성 원본: `exec-f2619ab8-0a7c-4e63-b520-f9d69ace1568.png`
- 같은 style/reference 규칙으로 안전 집결·인원 확인·건물과 거리 유지·재진입 금지를 명시했다. 최종 1200×800 파일과 15장 시각 비교본에서 장면·화풍을 확인했다.
- 검수용 15장 묶음: 개발용 `E:/안전교육/미리보기/scenario-support-contact.png`. 배포는 개별 `media/scenarios/*.webp`를 사용한다.



## 표정 수정본 최종 기록 — 2026-11-14

아래 13장 33명의 얼굴을 각각 확인했다. 기존 장면을 image_gen에 **편집 대상 1개로만** 넣고, 입·눈썹·미세한 눈 표정만 바꾸도록 요청했다. 수정본은 모두 1200×800 WebP이며 기존 파일을 덮어쓰지 않았다. 육안상 안전 행동·옷·손짓·주요 배경 배치를 보존했으며 픽셀 단위 동일성을 뜻하지 않는다.

| 수정본(이 표의 경로는 모두 media/scenarios/) | 얼굴 수 | 표정 확인 |
|---|---:|---|
| escape-blocked-serious.webp | 2 | 화재 도움 요청에 맞는 진지함, 입 닫힘, 웃음 없음 |
| experience-fire-serious.webp | 2 | 침착한 대피 집중, 입 닫힘, 웃음 없음 |
| experience-quake-serious.webp | 2 | 머리 보호에 집중, 입 닫힘, 웃음 없음 |
| escape-support-serious.webp | 3 | 필요한 도움을 진지하게 표현·경청, 웃음 없음 |
| escape-assembly-serious.webp | 5 | 인원 확인에 집중, 전원 입 닫힘·웃음 없음 |
| lodging-health-serious.webp | 2 | 불편함을 알리는 학생과 염려하며 듣는 교사, 웃음 없음 |
| theme-lost-serious.webp | 2 | 일행과 떨어진 학생·도움 주는 직원, 웃음 없음 |
| lodging-medicine-serious.webp | 3 | 정중히 거절·확인하는 주의 상황, 친구 비난·공포 없이 웃음 없음 |
| heritage-quake-serious.webp | 2 | 지진 머리 보호에 집중, 입 닫힘, 웃음 없음 |
| rest-lost-serious.webp | 2 | 일행을 찾는 도움 요청, 웃음 없음 |
| lodging-door-serious.webp | 3 | 문을 열기 전 확인에 집중, 웃음 없음 |
| theme-item-serious.webp | 2 | 울타리 안 물건을 직원에게 알리는 상황에 집중, 웃음 없음 |
| experience-tool-serious.webp | 3 | 뜨거운 도구 시범을 차분히 집중 관찰, 웃음·공포 과장 없음 |

수정하지 않은 `theme-ride.webp`는 안전하게 앉아 놀이기구를 타는 평상 활동, `lodging-night.webp`는 밝은 복도에 교사 동행을 요청하는 평상 활동이다. 이 두 장면의 즐거움과 위험 장면의 정서를 구분했다. 이후 다른 위험을 덧붙여 재사용할 경우 표정도 다시 검토해야 한다.

### 표정 편집 공통 프롬프트

“FACE EXPRESSIONS ONLY. Keep exact composition, clothing, HA identity, hair, body and hand gestures, all safety actions, colors, background and line style. For EVERY person replace happy smiling/grinning mouths with CLOSED NEUTRAL mouth, short level lip line with no upward corners. Gently concerned or attentive focused eyebrows and eyes. Teacher/staff calm but serious. No smiles/laughter/cheerful open mouths; no panic, crying, anger or exaggerated fear. Change only mouth/eyebrows/subtle eye expression. No added text or UI.”

도구 시범은 공포·걱정보다 차분한 집중, 길 잃음·몸의 불편함·대피는 약간 걱정하면서 침착한 집중을 요청했다. 여러 인물이 있는 장면은 전원 수를 프롬프트에 명시하고 각각의 얼굴을 확인했다.

### 수정 원본 목록

동일 생성 기본 경로 아래 파일:

- escape-blocked: `exec-58b820b2-5ffe-4025-96ef-ba6a08d4a2ef.png`
- experience-fire: `exec-26ff9fa6-1767-43d0-81b7-0bea513652e3.png`
- experience-quake: `exec-3926d58e-abf6-4933-ae1b-3aa368739074.png`
- escape-support: `exec-fd8f6fd5-7881-4c52-b72d-54d5f495c5c6.png`
- escape-assembly: `exec-7b0f505b-19f6-42c2-b6b4-0b80b2e0f18a.png`
- lodging-health: `exec-11738c80-1c4f-46aa-aed1-e3e18b5d0062.png`
- theme-lost: `exec-fe46cd05-691a-4248-9d1f-bfa588292940.png`
- lodging-medicine: `exec-fe1140c6-17a0-4e85-bb13-eab1757d13f0.png`
- heritage-quake: `exec-61874010-6b35-475c-b505-aa03427134b1.png`
- rest-lost: `exec-86f918d1-292c-4cbb-b733-604ea27c52ac.png`
- lodging-door: `exec-e21bddae-5f46-4f8a-8801-462bd4358e67.png`
- theme-item: `exec-6ee18cc7-e525-4662-8aaf-671a3e2fe7f6.png`
- experience-tool: `exec-e34fcfd6-63eb-4ea5-98bb-48d5d33f0842.png`

검수 비교본: 개발용 `E:/안전교육/미리보기/scenario-serious-contact.png`. 경로·해상도·얼굴 수·원본 목록: `scenario-serious-review.json`. 이 확인은 그림의 표정·구도·행동 표현 검토이며, 학생별 실제 사용성과 현장 행동을 검증했다는 뜻이 아니다.
