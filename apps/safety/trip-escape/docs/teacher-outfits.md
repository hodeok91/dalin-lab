# 교사 현장학습 복장 수정 기록

2026-11-13 · built-in image_gen 이미지 편집 사용. CLI/API 우회 미사용.

사용자 지시: 형아맨은 유지하고 남녀 교사의 정장을 상황에 어울리는 편한 옷으로 교체한다. 얼굴·헤어·안경·비율·화풍·표정·포즈·장면을 보존하고 교사 의복·신발만 변경하도록 요청했다.

원본 시트는 부모 작업에서 정한 동일 캐릭터 기준을 사용했다. 각 기존 장면을 직접 확인한 후 해당 장면을 유일한 edit target/reference로 전달하여 기존 얼굴과 형아맨을 유지했다. 장면별 생성 결과를 직접 검수했다. 결과는 1200×800 WebP quality 84로 변환했다. 이전 초안은 E:/안전교육/원본백업/캐릭터초안/에 보존했다.

| 파일 | 교사 복장 |
|---|---|
| cinema.webp | 여교사 민트 캐주얼 카디건·상의, 네이비 바지, 흰 운동화 |
| museum.webp | 남교사 연한 파랑 롤업 셔츠, 베이지 치노, 흰 운동화 |
| experience.webp | 남교사 옅은 청록 폴로, 편한 바지, 운동화 |
| park.webp | 여교사 옅은 복숭아색 가벼운 외투, 네이비 바지, 흰 운동화 |
| garden.webp | 남교사 세이지색 캐주얼 오버셔츠·크림 티셔츠, 베이지 바지, 흰 운동화 |
| heritage.webp | 여교사 옅은 파랑 가벼운 외투·흰 티셔츠, 네이비 바지, 흰 운동화 |
| bus.webp | 남교사 연한 파랑 폴로, 네이비 바지, 흰 운동화 |
| rest.webp | 여교사 민트 카디건·크림 티셔츠, 편한 바지·낮은 신발(하체 비노출) |

## 공통 최종 프롬프트

Use case: identity-preserve. Image 1 is the EDIT TARGET. Precise outfit edit ONLY. Preserve the entire composition, background, safety context, all faces, expressions, hair, glasses if any, skin, body proportions, poses and hand positions. Hyeong-a-man must remain unchanged, including brown hair, face, HA chest mark, white suit, blue gloves, belt and boots. Preserve the original clean dark outlines and soft cel shading. Change ONLY the adult teacher's clothes and shoes to comfortable situation-appropriate field-trip clothing. No formal blazer, necktie or high heels. No new text or watermark. Keep 3:2 landscape.

개별 복장 지시는 위 표대로 공통 프롬프트에 추가했다. 영화관의 출구·계단, 박물관의 관람선, 체험관의 도구와 보호안경, 공원의 물가 난간, 수목원의 관찰 경계, 궁궐의 관람 동선, 버스의 3점식 안전띠·안전장치, 휴게소의 앉아서 먹는 구성을 보존하도록 강조했다.

## 검수

8개 결과에서 정장·넥타이·하이힐 제거, 교사 얼굴과 형아맨 정체성 유지, 기존 안전 장면 유지 여부를 직접 시각 확인했다. 생성형 편집 특성상 원본과 픽셀 단위 동일성을 보증하는 작업은 아니다. 학생 안전 행동의 정답 판정은 그림의 정밀 좌표가 아닌 별도 교육 콘텐츠와 터치 UI에서 수행한다.

## 생성 원본 경로

- cinema: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-4d277524-3fda-4029-a714-bdd5f86e730a.png
- museum: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-c862e592-66c5-4cbf-96a6-b795c215b40d.png
- experience: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-3b5c49d0-a3c4-4ba9-b607-c4c281720d07.png
- park: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-8ace2998-8b3e-449a-bb37-26f9a8ed45de.png
- garden: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-11806cac-8f91-46f8-8f79-9faeb9b5f561.png
- heritage: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-b48ca2f4-31b8-4af4-8c72-c9eef5fade46.png
- bus: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-cbdb38e5-b8df-40bd-9b72-35cd62725241.png
- rest: C:\Users\호밀하우스\.codex\generated_images\01a1d090-8823-7472-8633-a69c82653004\exec-edf08315-0f51-46bb-b2df-c5245b293a9c.png

