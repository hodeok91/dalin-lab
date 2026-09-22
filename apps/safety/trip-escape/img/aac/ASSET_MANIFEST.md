# AAC visual asset manifest

> FOLLOW-UP 2: 현재 연결 목록은 `../../qa/aac-manifest.json`, 발견 crop 좌표는 `../../source-crops.js`가 기준입니다. 아래 목록은 이전 파일의 보관 기록입니다. 신규 트램펄린·사고 대응·공용 AAC 12개·이벤트 선택 그림 9개가 추가되었고, 필수 placeholder는 없습니다. 재생성 명령은 `python tools/refine_aac_assets.py`입니다.

All files are 512×512 PNG. `tools/build_aac_assets.py` regenerates the scene and source crops reproducibly.

## Game scene crops

- `scenes/bus-seatbelt.png`, `bus-sit.png`, `bus-extinguisher.png`, `bus-hammer.png`
- `scenes/rest-hotfood.png`, `rest-together.png`, `rest-slip.png`
- `scenes/park-wait.png`, `park-safetybar.png`, `park-fence.png`, `park-walk.png`
- `scenes/museum-no-touch.png`, `museum-exhibit.png`
- `scenes/room-bed.png`, `room-window.png`, `room-outlet.png`, `room-hotfood.png`
- `scenes/escape-alarm.png`, `escape-extinguisher.png`, `escape-exit.png`

## Education-office crops

- `precheck/hurt-tell-teacher.png` — cardnews 3 illustration
- `precheck/pack-bag.png` — cardnews 4 illustration
- `precheck/wash-hands.png` — cardnews 5 illustration

## Supplied-character crops

- `characters/hero.png` — H⚡A 형아맨 front turnaround
- `characters/teacher-male.png` — male teacher front turnaround
- `characters/teacher-female.png` — female teacher front turnaround

## Core communication visuals

`core/yes.png`, `no.png`, `again.png`, `unknown.png`, `wait.png`, `stop.png`, `here.png`, `rest.png`, and `bag.png` use the supplied H⚡A hero crop with a simple non-font drawn vector symbol. The other `core/` files reuse a meaningful scene, education, or supplied-character crop.

## Previous pending list — resolved in FOLLOW-UP 2

help/toilet/scared/wait/slow have now been replaced with dedicated generated H⚡A illustrations. here retains a reference crop and a drawn location symbol. The list below records the original brief:

- `core/help.png`: H⚡A raising a hand to the male or female teacher
- `core/toilet.png`: H⚡A beside a real restroom sign
- `core/scared.png`: H⚡A showing fear in a safe, non-threatening setting
- `core/wait.png`: H⚡A waiting at a meeting point
- `core/slow.png`: H⚡A walking slowly and safely
- `core/here.png`: H⚡A indicating a meeting location

The indoor event now uses `img/events/trampoline-injury.png` and three dedicated injury-response choice pictures.
