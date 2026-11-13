# 안전의 달인 AAC 그림 화풍 통일

2026-11-13 · built-in image_gen 사용. CLI/API 대체 경로를 사용하지 않았습니다.

## 기준

- 캐릭터 시트: E:/안전교육/캐릭터원본/형아맨.png, 남자선생님.png, 여자선생님.png.
- 원본 형아맨의 갈색 머리·얼굴·큰 눈·비율·흰 HA 슈트·파란 장갑/부츠/벨트를 유지합니다.
- 교사 얼굴·헤어·안경은 유지하고 정장·넥타이·하이힐을 편한 현장학습 복장과 운동화로 교체했습니다.
- 짙고 정돈된 외곽선, 넓은 색면, 절제된 셀채색, 흰색/옅은 크림 배경으로 통일했습니다.
- 일반 의사소통 카드는 영상·장면 전체 대신 한 가지 행동·표정을 분명하게 보여줍니다.

## 최종 파일

경로: media/illustrations/aac-{key}.webp. 23개 모두 512×512 WebP이며 파일 존재와 크기를 검사했습니다.

- 보존·검수: help, hurt, rest, water, stop, slow, here, unknown
- 교사/직원 캐주얼 수정: scared, toilet, teacher, together, again, lost
- 신규 생성: wait, yes, no, okay, exit, fire, bag, seatbelt, sit

기존 수정 전 파일은 E:/안전교육/원본백업/AAC통일전/에 보존했습니다. help와 hurt는 이전 작업의 캐주얼 수정본을 보존했습니다. teacher는 셔츠/카디건의 읽을 수 없는 장식 글자를 추가로 제거했습니다.

## 공통 생성 프롬프트

Use case: identity-preserve / scientific-educational AAC card. Derive ONE square single-character illustration from the supplied character identity sheet, not a turnaround. Preserve exact original brown hair, large dark eyes, rosy cheeks, 4-head-tall proportions, white HA suit with orange lightning, blue shoulder patches/belt/gloves/boots. Full body with generous margin on a plain white background. Clean dark outlines, broad flat color fields, restrained two-step cel shading exactly like reference. No text except original HA chest mark, no speech bubble, no watermark. Avoid 3D rendering, gloss, photorealism or blur. Show a single clear action.

개별 행동: 기다려 달라는 열린 손바닥 / 고개 끄덕임과 초록 O / 팔을 교차한 거절과 붉은 X / 편안한 표정과 엄지 / 비상구 유도등 확인 / 화재훈련에서 주변에 알리기(실제 불길·연기 없음) / 가방 보관 / 정지한 버스에서 3점식 안전띠 착용 / 의자에 바르게 앉기.

## 공통 편집 프롬프트

Image 1 is the edit target. Change ONLY adult teacher clothes and shoes to a plain mint polo or coral casual cardigan over cream T-shirt, navy comfortable trousers and flat white sneakers. Remove formal suit, necktie, high heels and unreadable lettering/emblems. Preserve exact faces, hair, glasses, expressions, poses, gestures, framing, objects and background. Hyeong-a-man must remain unchanged. Preserve clean dark outlines and broad simple cel shading. No new words or watermark.

## 시각 검수 및 한계

생성·편집 결과를 각각 확인한 후 저장했습니다. 비상구의 초록 유도등, 안전띠의 어깨·허리 부분, 앉은 자세, 교사의 편한 복장과 낮은 신발, 무서움/휴식/도움 요청 등 행동·표정의 구별을 확인했습니다. 본 그림은 사용자 캐릭터 기반의 수업용 의사소통 그림이며 표준 AAC 상징 체계의 임상 검증이나 개별 학생의 이해 검사를 대신하지 않습니다. 학생과 의미를 함께 확인하고 익숙한 표현·응답 방식에 맞춰 사용해야 합니다.

## 생성 원본

- aac-scared: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-a7f311d5-3d8a-4f52-b530-f4caa788c908.png
- aac-toilet: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-bcdfe61c-f21e-41d5-825b-5e325fc5768d.png
- aac-teacher: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-ed1f3b61-5a06-47da-ae08-20d63cb67178.png
- aac-together: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-14d20a81-ddba-4119-bc63-d6f83c16808f.png
- aac-again: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-7ea0f5b0-38c4-4c05-8c36-fa12310cfdfa.png
- aac-wait: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-050c7ca4-02de-410c-a2ca-2f0af1610bf5.png
- aac-yes: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-e5c95e9b-d8fb-40dd-b10e-6b1ef2470ae6.png
- aac-no: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-0b4a9b01-775a-4261-9a67-0b2539ff7679.png
- aac-okay: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-0bb065ce-6deb-45a1-b4db-46614092360e.png
- aac-exit: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-66e28c28-cb29-4644-b2ad-c0ba521b80f5.png
- aac-fire: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-56a1378a-dadb-428b-9565-89335fecdcc3.png
- aac-bag: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-7687740a-6d26-43d1-8f61-32d6e4b8ef08.png
- aac-seatbelt: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-de314950-73a7-47f2-a87b-bb1ffff43950.png
- aac-sit: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-1f279859-5b66-42d5-820f-610c3f72c3e1.png
- aac-lost: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-a109f9f9-3851-4f11-a6cc-18ebd2d526d4.png
- aac-teacher 최종 장식 제거: C:\Users\호밀하우스\.codex\generated_images\01a1d42a-1f36-7d22-9c94-157e326d91f7\exec-cb2f4522-f80b-4d20-8582-43dba8ae57ad.png

