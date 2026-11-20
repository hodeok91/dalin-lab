# GitHub 업로드와 홈페이지 반영

확인일: 2026-11-21. 저장소는 `hodeok91/dalin-lab`, 앱 위치는 `apps/safety/trip-escape`입니다.

## 웹 업로드가 막힌 이유

GitHub 웹 업로드는 한 번에 100개 파일, 파일 하나당 25MiB까지입니다. 이 앱은 파일이 1,000개 이상이고 리듬 곡 `audio/safety-jump.wav`도 28,783,098바이트(약 27.45MiB)라 폴더를 나눠 올려도 제한에 걸립니다. Git으로 올릴 때의 파일당 제한은 100MiB이며 현재 곡은 그 범위 안에 있습니다.

웹에서 폴더를 하나씩 올리는 대신 기존 로컬 Git 저장소를 사용하세요. ZIP을 저장소에 올리는 것만으로는 게임 화면이 배포되지 않습니다.

## GitHub Desktop으로 다음 수정 올리기

1. **File → Add local repository**에서 `E:\안전교육\dalin-lab`을 선택합니다. 앱 하위 폴더가 아니라 `.git`이 있는 이 폴더를 선택합니다.
2. **Current branch**에서 작업 브랜치를 선택합니다. 현재 작업 브랜치 이름은 `feat/school-fieldtrip-20261113`입니다.
3. 변경 내용이 있으면 확인하고 **Commit to …**를 누릅니다. 이미 커밋한 내용은 다시 커밋할 필요가 없습니다.
4. **Publish branch** 또는 **Push origin**을 누릅니다. GitHub 로그인 창이 나오면 본인 계정으로 로그인합니다.
5. GitHub의 **Compare & pull request**에서 `base: main`, `compare: 작업 브랜치`를 확인합니다. 변경을 검토하고 병합하면 Pages의 `main` 배포 설정에 따라 홈페이지에 반영됩니다.
6. 저장소 **Actions → pages build and deployment**의 완료 여부를 확인하고 아래 주소를 새로 고침합니다. 최신 화면이 안 보이면 Ctrl+F5로 다시 불러옵니다.

2026-11-21 GitHub API로 확인한 Pages 설정은 **`main` 브랜치 / 루트(`/`) / branch 배포**이며 현재 홈페이지 주소는 `https://dalinlab.kr/`입니다. 기존 전체 홈페이지는 유지하고 앱 폴더를 같은 경로에 반영합니다.

예상 앱 주소: <https://dalinlab.kr/apps/safety/trip-escape/>

## PowerShell에서 업로드

현재 작업이 이미 커밋되어 있다면 다음 두 줄로 작업 브랜치를 업로드할 수 있습니다.

```powershell
Set-Location -LiteralPath 'E:\안전교육\dalin-lab'
git push -u origin feat/school-fieldtrip-20261113
```

새 수정은 먼저 변경 파일을 검토하고 앱 폴더만 커밋합니다.

```powershell
git status --short
git add -- apps/safety/trip-escape
git commit -m "Update safety education activities"
git push
```

작업 브랜치 업로드와 `main` 병합·홈페이지 반영은 서로 다른 단계입니다. `git push`만으로 현재 작업 브랜치가 `main`으로 합쳐지지는 않습니다.

## 올릴 파일과 보관할 파일

앱의 HTML·JS·CSS, `audio`, 현재 참조하는 `media`, 하위 장소 폴더를 함께 올립니다. 원본 작업 이미지, `node_modules`, 캡처 모음 ZIP, 이전 배포 ZIP은 앱 배포 경로에 추가할 필요가 없습니다. `E:\안전교육` 전체를 저장소 폴더에 복사하지 마세요.

파일 크기와 후보 목록은 앱 폴더에서 아래 읽기 전용 명령으로 확인할 수 있습니다.

```powershell
node tools/check-github.mjs
```

저장소의 코드·그림을 보관하는 것과 방문자가 실행할 파일을 호스팅하는 것은 별개입니다. 현재 앱은 정적 웹 파일이므로 별도 게임 서버나 Unreal 설치 없이 HTTPS 홈페이지에서 실행할 수 있습니다. 마이크는 사용자가 허용한 경우에만 연결합니다.

공식 기준: [GitHub 파일 업로드 제한](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository), [Pages 배포 브랜치 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages 용량 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
