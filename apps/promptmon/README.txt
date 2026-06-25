프롬프트몬 수정 버전

수정 사항
1. 전투 선택창에서 좌우 방향키 선택 가능
2. 결과 메뉴에서도 좌우/상하 방향키 선택 가능
3. 선택지를 이동하거나 선택할 때 plink.mp3 재생
4. 프롬프트 카드를 선택하면 포켓몬 공격 모션 + hit.mp3 재생
5. 선택 텍스트가 길어도 아래 텍스트가 잘리지 않도록 전투 하단 UI 확장 및 스크롤 적용
6. 맵 경로를 ./images/map.png로 변경

파일 구조

promptmon-app/
├─ index.html
├─ styles.css
├─ script.js
├─ assets/
│  ├─ logo.png
│  ├─ trainer-down.png
│  ├─ trainer-up.png
│  ├─ trainer-left.png
│  └─ trainer-right.png
├─ images/
│  └─ map.png
└─ sound/
   ├─ intro.mp3
   ├─ New bark town.mp3
   ├─ Battle vs wild pokemon.mp3
   ├─ Victory theme.mp3
   ├─ plink.mp3
   └─ hit.mp3

중요:
- C:\Users\user\Desktop\promptmon-app\images\map.png 파일은 브라우저 코드에서 직접 C 경로로 읽지 않습니다.
- 프로젝트 폴더 안의 images/map.png로 넣어야 합니다.
- 즉 index.html 기준 상대경로는 ./images/map.png입니다.


추가 수정 사항
- 전투 선택지에 '도망가기' 버튼 추가
- 도망가기 선택 시 plink.mp3 후 run away.mp3 재생, 맵으로 복귀
- 전투 카드 선택 시 plink.mp3 → 공격 모션 → hit.mp3 순서로 재생
- 전투 선택창에서 텍스트가 길어도 잘리지 않도록 스크롤/높이 수정
- 맵 이동은 형광펜으로 표시한 길/풀숲 영역만 통과하도록 WALKABLE_RECTS로 제한
- 나무, 건물, 돌 등은 BLOCKED_RECTS로 통과 금지
- 캐릭터 크기 축소

소리 파일 추가
sound/
└─ run away.mp3


추가 재수정 사항
- 방향키를 누르는 동안 requestAnimationFrame으로 부드럽게 이동하도록 수정
- keydown 반복 이동을 제거해서 뚝뚝 끊기는 느낌을 줄임
- 캐릭터 크기를 더 작게 조정
- 충돌 판정을 발밑 여러 점으로 검사하도록 수정
- WALKABLE_RECTS + BLOCKED_RECTS 조합으로 이동 가능 구역과 장애물 구역을 분리
- 랜덤 몬스터는 TALL_GRASS_RECTS에 들어간 풀숲에서만 등장
