# UI 그림 추가 기록 — 2026-11-14

도구: built-in image_gen. 원본 캐릭터 시트와 기존 `media/ui/help.webp`를 스타일 참고로 사용했다. 실제 투명 알파를 보존한 256×256 WebP로 저장했다. 외곽 알파 0, 내부 알파 255를 확인했고 크림 바탕 합성으로 시각 검수했다.

- `media/ui/aac.webp`: 이전 생성 원본을 복구했다. 형아맨과 그림 의사소통 카드·말풍선.
- `media/ui/home.webp`: 크림색 학교 건물, 파란 지붕·방패, 주황 문. 처음 화면.
- `media/ui/check.webp`: 크림색 원형 방패와 초록 체크. 확인·완료.
- `media/ui/select.webp`: 파란 형아맨 장갑으로 주황 카드를 누르는 모습. 선택·터치.
- `media/ui/stop.webp`: 다섯 손가락을 편 파란 장갑과 주황 테두리 원판. 멈춤.

공통 생성 프롬프트: “One square scientific-educational UI illustration for the Korean special-school game 안전의 달인. References: existing help icon for style; HA character sheet for palette and line language. Bold clean dark navy outlines, rounded child-friendly shapes, broad cel-shaded colors with at most two shadows. Centered large with clear padding, readable at 48 px. Actual transparent background, no text, watermark, floor, halo, sparkle, 3D or photorealism.” 각 파일의 주제를 위 목록대로 명시했다. 체크 기호와 손가락 다섯 개, 장갑·소매 색을 육안으로 확인했다.

생성 원본은 `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-8e7b-7e91-9b73-97017c7fcbfa/`에 남겨 두었다. 프로젝트는 위 media 경로만 참조해야 한다. 원본 경로·알파 검수 상세는 개발용 `E:/안전교육/미리보기/primary-icons-report.json`에 기록했다.
