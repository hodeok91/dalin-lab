# 장소 그림 스타일 최종 통일

2026-11-13 · built-in image_gen 이미지 편집. CLI/API 우회 미사용.

## 적용 파일

media/illustrations/의 sports, cinema, museum, experience, theme-park, park, garden, heritage, lodging, bus, rest, night, escape.webp — 총 13장, 1200×800 WebP quality 84.

기존 파일은 E:/안전교육/원본백업/스타일통일전/에 보존했다. guide/AAC/sprite 파일은 이 작업에서 수정하지 않았다.

## 기준

참조 원본: E:/안전교육/캐릭터원본/남자선생님.png, 여자선생님.png, 형아맨.png.

각 장면을 직접 읽고 기존 이미지를 편집 대상으로, 세 캐릭터 시트를 정체성·화풍 참조로 사용했다. 원본 시트의 정장을 복사하지 않고 이미 수정된 편한 현장학습 복장과 운동화를 유지하도록 요청했다. 형아맨의 HA 표시·흰 슈트·파란 장갑·벨트·부츠를 고정했다.

배경의 광택·반사·사진 질감·3D 렌더 느낌·흐림을 없애고, 인물과 배경 모두 명료한 짙은 외곽선·넓은 색면·2~3단계 셀채색으로 맞췄다. 보행로·난간·관람선·안전띠·출구 등 안전 의미는 보존하는 방향으로 검수했다.

## 최종 공통 프롬프트

Use case: background-only style-transfer. Image 1 is the EDIT TARGET of the named safety education scene. Images 2-4 are original character sheet STYLE / IDENTITY references only, NOT formal outfit references. Change ONLY the environment/background rendering to the same clean 2D outlined educational cartoon as the character sheets: dark tidy contours, broad calm matte colors and 2-3 simple cel-shading steps. Remove glossy floor reflections, photographic material texture, microtexture, photographic foliage, blur, 3D-render polish, cinematic glow, lens effects and excessive tiny details. Preserve every character's identity, face, eyes, hair, glasses, current casual clothes, sneakers, pose, expression and proportions. Hyeong-a-man's HA mark, white suit and blue gloves/belt/boots remain unchanged. Preserve important object placement, safety actions, recognizable facility context and clear routes. No added people, new text, speech bubbles or watermark. One 3:2 landscape scene.

장면별로 영화관 출구·계단, 박물관 관람 경계, 트램펄린 구획, 도구·보호안경, 놀이공원 울타리, 공원 호수 난간·그늘, 수목원 관찰로·열매·경계, 궁궐 관람 구역, 숙소 통로·가방 정리, 버스 3점식 안전띠, 휴게소 앉아서 식사, 야간 호출, 휠체어 학생의 평지 대피 지원을 유지하도록 추가했다.

수목원 1차 결과의 왼쪽 젖은 바닥이 넓은 물길처럼 표현되어 다음 표적 편집으로 수정했다: "Make ONLY one correction: the broad blue strip along the far left edge must be a gray paved walkway with just two small shallow irregular puddles on it, matching a wet floor that could be slippery, NOT a pond, river, channel or pool. Keep every other part unchanged." 최종 결과는 작은 물웅덩이 두 곳으로 확인했다.

## 시각 검수와 한계

13장 모두 생성 결과를 직접 열어 검수했다. 남녀 교사의 편한 복장, 형아맨 정체성, 시설별 핵심 안전 맥락과 배경의 동일한 선화·색면을 확인했다. 생성형 편집이므로 원본과 픽셀 단위 동일성을 보증하지 않는다. 그림 위치 자체를 정답 좌표로 쓰는 경우 별도의 좌표 검수가 필요하다. 최종 대피 장면은 야간으로 표현되어 숙박형 대피 연습의 맥락에 맞췄으며, 화재·연기·공포 장면은 추가하지 않았다. 밤 미션에는 복도 안 출구 유도등이 표현되었다.

## 생성 원본 파일

| 최종 파일 | 생성 PNG 원본 |
|---|---|
| cinema.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-36164431-ee7a-4e60-8fe9-ecc270964d5e.png |
| museum.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-1bbb317c-79ec-4ab6-b81c-0b4e6a566c8b.png |
| sports.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-382abf73-c37f-4db8-ae76-9bf6b034cb60.png |
| experience.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-1de0c3ae-63ec-4786-a52b-921657178bd9.png |
| theme-park.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-d2c3bbbd-bc6d-46c1-9927-b0e56b6c5218.png |
| park.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-d5669b56-4d86-413e-8483-7898da4dd244.png |
| heritage.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-d15c6c40-8cb4-4dd4-8c86-c721caf9014b.png |
| lodging.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-2db93cd0-6ef7-445d-ac8f-251ff6ddf935.png |
| garden.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-2e4dd257-b13b-4574-bd26-e2d659681e33.png |
| bus.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-1b8e340f-1ab9-4c97-be14-81e19833973b.png |
| rest.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-bc0efd07-a89b-4a21-8215-d016cb32e6f1.png |
| night.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-e7b0bf4d-c27d-45e9-89ee-f0fd8b024272.png |
| escape.webp | C:/Users/호밀하우스/.codex/generated_images/01a1d429-c532-7cd3-943c-288693b0e594/exec-d99f3481-e9c9-40b1-ab7c-0365fb3fd277.png |

