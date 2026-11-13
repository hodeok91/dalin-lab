# 동작·학습지원 그림 아이콘

2026-11-14. 앱 전용 그림 세트의 누락분을 마무리했다. Built-in `image_gen`으로 생성한 원본을 사용했으며 CLI/API 대체 경로는 사용하지 않았다. 앱 코드는 이 작업에서 수정하지 않았다.

## 최종 파일

`media/ui/again.webp`, `hint.webp`, `open.webp`, `pause.webp`, `motion.webp`, `text.webp`, `picture.webp`.

모두 256×256 WebP, 실제 alpha 채널이며 각 파일의 alpha 최솟값 0, 최댓값 255를 확인했다. 투명 여백을 정리한 뒤 정사각형 안에 비율을 유지하여 담았다. 크림색 배경 컨택시트로 선 잘림, 배경 잔상, 작은 크기 식별성을 확인했다.

남은 배치·버튼 이름·대체 텍스트·키보드 동작은 앱 통합 검수 대상이다. `picture`에는 그림 카드와 발화 도움을 함께 나타내는 스피커가 있어 그림 지원 버튼에 쓸 수 있다.

## 복구 원본

다음 세 파일은 사용 한도 중단 전에 이미 생성되어 있었으므로 재생성하지 않고 복구했다. 당시 호출 전문은 이 문서에서 새로 만들어 기록하지 않는다.

- again: `C:/Users/호밀하우스/.codex/generated_images/01a1d471-ed11-7852-b504-15c83f6a7769/exec-bb6b5724-1d85-4ed3-9142-74c2fd5f70be.png`
- hint: 같은 폴더의 `exec-195803e2-2edf-4e6c-a09e-90618099295c.png`
- open: 같은 폴더의 `exec-9041cee7-8078-4b20-be21-6162ac7ddf5d.png`

## 신규 생성 기준과 프롬프트

공통 참고 이미지는 사용자 제공 `E:/안전교육/캐릭터원본/형아맨.png`와 기존 `media/ui/read.webp`이다. 두 파일을 직접 열어 확인했다. 형아맨의 갈색 머리·큰 눈·HA 번개 표시·흰 슈트·파란 장갑과 부츠를 유지하며, 굵은 네이비 외곽선과 파랑·오렌지·크림 색면을 사용했다. 다음은 각 호출에 전달한 프롬프트이다.

### pause

Use case: illustration-story. Asset type: one educational app UI icon for pause / rest. Create ONE standalone icon on a genuinely transparent background: a small friendly Hyeong-a-man mascot sitting comfortably on a low blue bench, beside two clear orange pause bars. Match reference image 1 character sheet exactly for identity: brown hair, big dark eyes, peach skin, white hero suit with red HA lightning emblem, blue gloves and boots. Reference image 2 is icon outline/color style only. Clean thick dark navy ink outlines, rounded shapes, broad flat colors, two-step cel shading. Friendly crisp Korean educational character-sheet art, readable at 64px, compact centered square composition with generous transparent margins. No words, no gradients, no shiny plastic, no 3D, no glow, no badge or background.

원본: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-b60d-7980-a28b-37e1bd493225/exec-363aac64-f7e4-4d1d-bd1b-89dc0fbc9de0.png`

### motion

Use case: illustration-story. Create ONE standalone UI icon for reducing animation / motion in a Korean special-school app. Transparent background. A blue sneaker in side view with two short orange motion lines behind it and a small cream switch with a blue circular knob in front, suggesting movement can be adjusted. No letters and no text. Style matches supplied character-sheet and icon references: very clean thick dark navy ink outlines, simple broad flat royal-blue/orange/cream fills, exactly one sharply bounded darker cel-shadow area per form. 2D hand-inked educational workbook illustration. Centered compact square composition, readable at 48px. No 3D modeling, no gradient shading, no gloss, no reflected shine, no glow, no drop shadow, no background shape, no emoji. Actual alpha transparency.

원본: 같은 생성 폴더의 `exec-4bf0415c-b28d-428e-94a0-48567407b154.png`

### text

Use case: illustration-story. ONE standalone icon for making text larger in a Korean special-school learning app. A cream sheet of paper with rounded corners held inside a blue border, showing a LARGE dark blue Hangul character '가' at upper left and a smaller dark blue '가' lower right; one orange upward sizing arrow in the lower corner. Exact text only 가 twice. Match references' cheerful hand-inked educational cartoon style: clean thick dark navy outlines, broad flat blue/cream/orange colors with one crisp cel-shadow tone, no gradients. Square compact centered icon, small-size readable. True transparent alpha background, generous empty transparent margins. No characters, no additional text, no 3D, no gloss, no glow, no fake shadow.

원본: 같은 생성 폴더의 `exec-69a5cb03-e27b-4a55-a82b-fdc3220920c2.png`

### picture

Use case: illustration-story. ONE standalone UI icon meaning picture supports / show pictures for a Korean special-school app. Two overlapping cream educational picture cards with blue ink borders. Front card contains a tiny friendly portrait of the EXACT Hyeong-a-man character from reference sheet: brown hair, big dark eyes, white HA superhero suit, blue shoulders. Rear card contains a simple green tree and orange sun. No words or letters except the tiny red HA on the costume if legible. Reference sheet controls character identity and 2D cel-shaded style; read icon controls outline weight and palette. Bold clean dark navy outlines, large flat color fields, sharp simple two-step cel shadows. Square centered compact composition, readable at 48px, actual alpha transparent background with generous margin. No checkerboard, no 3D, no smooth gradients, no plastic shine, no glow, no badge.

원본: 같은 생성 폴더의 `exec-c4b72106-722c-42d6-8c6f-26bd3f05a79c.png`
