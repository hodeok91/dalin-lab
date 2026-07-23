# 급식의 달인 V4 통합본

이번 파일은 패치가 아니라 전체 프로젝트입니다.

## 교체 방법

1. 기존 `.env` 파일만 따로 보관합니다.
2. 기존 프로젝트 폴더의 내용을 모두 삭제합니다.
3. 이 압축파일의 `lunch-master` 폴더 안 내용을 모두 넣습니다.
4. 보관한 `.env`를 다시 넣습니다.
5. 아래 명령을 실행합니다.

```powershell
npm install
npm run dev
```

## 환경변수

```text
NEIS_API_KEY=NEIS 인증키
UNSPLASH_ACCESS_KEY=Unsplash Access Key
```

## 포함 기능

- 학교명 검색 및 학교 저장
- 이전·다음 날짜 이동
- 날짜 숫자 클릭 시 큰 앱 전용 달력
- 오늘 날짜로 이동
- NEIS 급식 조회
- 선택급식 선택 1·선택 2 분리
- 저장된 음식 이미지 우선
- 저장 이미지가 없을 때 Unsplash 검색
- 검색도 실패하면 음식 종류 이모지
- 이미지 안내 문구
- 메뉴 보관함 중복 제거
- 실제 메뉴 수만큼만 식판 목표 생성
- 메뉴 글자 위를 이미지가 정확히 덮는 맞추기 모드
- 빈 식판에 그림+글자 카드를 넣는 자율 배식 모드
- 메뉴별 음절 칸 쓰기
- 개별 메뉴 10회 쓰기
- 덧쓰기·독립쓰기 단계
- 십자·줄공책·빈 공책
- 마우스·터치·S펜 지원

## 이미지 순서

```text
assets/foods/exact
→ assets/foods/fallback의 31개 저장 이미지
→ Unsplash
→ 음식 종류 이모지
```

## 브라우저 캐시 초기화

이전 검색 이미지가 남아 있다면 개발자 도구 콘솔에서 한 번 실행합니다.

```javascript
localStorage.removeItem("foodImageCacheV3");
location.reload();
```


## V4.0.1 수정
- syncDateControls 무한 재귀 오류 수정
