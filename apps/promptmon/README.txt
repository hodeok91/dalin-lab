# 프롬프트몬

초기 프롬프트몬 엔진을 유지하면서 맵, 배틀 카드, 도감, 지박사 NPC를 모듈형으로 정리한 교육용 미니 게임입니다.

## 현재 구조

- `index.html`: 화면 뼈대와 오디오 태그
- `css/main.css`: CSS 진입점
- `css/legacy.css`: 기존 게임 화면 스타일
- `css/ui.css`: 카드/도감 UI 보정
- `css/mobile.css`: 모바일 보정
- `js/main.js`: 데이터 로딩 및 엔진 진입점
- `js/core/engine.js`: 게임 엔진
- `js/data/maps.v2.js`: 맵 모듈 묶음
- `js/data/maps/*.js`: 맵별 blockedTiles, portals, encounterTiles 설정
- `js/data/categories.js`: 프롬프트 카드 카테고리
- `js/data/promptmons.js`: 프롬프트몬/퀘스트 데이터
- `js/data/villages.js`: 마을 데이터
- `js/battle/promptBuilder.js`: 프롬프트 조합 보조 함수
- `assets/maps/*.png`: 원본 맵 이미지
- `assets/professor-*.png`: 지박사 NPC 스프라이트
- `assets/trainer_*_*.png`: 플레이어 방향별 걷기 프레임
- `sound/*.mp3`: 배경음과 효과음

## 좌표 수정

게임 중 `G` 키를 누르면 격자 디버그 모드가 켜집니다.
각 맵의 이동/포탈/몬스터 출현 위치는 `js/data/maps/` 안의 맵별 파일에서 수정합니다.

## 로컬 테스트

```bash
python -m http.server 8000
```

접속 주소:

```txt
http://localhost:8000
```

## 배포 캐시

현재 캐시 버전은 `cleanup3`입니다.
GitHub Pages 배포 후 캐시가 남으면 URL 뒤에 `?v=cleanup7`를 붙여 확인하세요.
