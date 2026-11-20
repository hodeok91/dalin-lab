# 안전의 달인 브랜드 로고

2026-11-13 · built-in `image_gen`으로 생성·수정했습니다. CLI/API 대체 경로는 사용하지 않았습니다.

## 최종 파일

| 파일 | 용도 | PNG 크기 |
|---|---|---|
| `media/brand/wordmark.png` / `.webp` | 전용 한글 글자 로고 | 2167×466 |
| `media/brand/mascot.png` / `.webp` | 형아맨 상반신 브랜드 캐릭터 로고 | 773×1132 |

광택 표현을 수정하기 전 초안은 최종 폴더에서 제외했습니다. 최종 워드마크와 캐릭터는 각각 독립 파일이며 HTML에서 필요한 배치로 조합할 수 있습니다.

## 기준

사용자 제공 `E:/안전교육/캐릭터원본/형아맨.png`를 정체성·선·채색의 기준으로 사용했습니다. 현재 `media/illustrations/guide.webp`도 직접 보아 앱의 캐릭터와 일치하는지 확인했습니다.

워드마크는 정확히 **안전의 달인** 다섯 음절과 한 칸 띄어쓰기로 제작했습니다. 네이비 외곽선, 형아맨 계열의 파랑과 따뜻한 오렌지, 단정하고 굵은 둥근 레터링을 사용했습니다. 처음 생성본에 있던 반짝이는 흰 곡선 하이라이트는 추가 이미지 편집으로 제거했습니다.

캐릭터 마크는 원본 형아맨의 갈색 머리·큰 눈·분홍 볼·흰 슈트·HA 번개 가슴 표시·파란 장갑과 어깨를 유지한 상반신 엄지 인사 포즈입니다. 방패나 원형 업적 배지를 덧붙이지 않았습니다.

## 프롬프트

### 워드마크

Use case: logo-brand. Create a dedicated Korean logotype ONLY on a truly transparent background for a Korean special-school safety-learning web app. Text, exact and only: "안전의 달인". Spell precisely: 안 전 의 [space] 달 인. Wide horizontal composition, about 3.5:1. All five Hangul syllables fully legible, evenly spaced and carefully crafted. Original friendly rounded block lettering for a children's educational workbook, not a default typed sans font. Clean dark-navy ink outlines, rich medium hero-blue main letter faces, warm orange accent on "달인", cream-white narrow inner highlights. Two flat cel-shading tones maximum. Neat confident hand-lettered feeling matching the reference character sheet's clean illustrated outlines. Small app-header legibility is crucial. The reference is STYLE/PALETTE only; do not include a character, shield, icon, picture, watermark or any additional wording. No 3D extrusion, bevel, gloss, gradient, glow, fake lighting, excessive shadow or busy ornaments.

최종 수정: Retain exact text, all glyph shapes, spacing, arrangement, thick dark navy outline and transparency. Remove shiny white curved streak highlights, smooth gradients, glossy plastic effects, bevels and extrusion. Use flat blue fills on "안전의", flat warm orange fills on "달인", with only one sharply bounded modest darker cel-shadow strip along lower edges. Clear ink-and-color educational character-sheet style. No added shapes or wording.

### 캐릭터 마크

Use case: logo-brand and identity-preserve. Create one standalone transparent-background brand mascot mark based EXACTLY on the supplied Hyeong-a-man character reference sheet. Preserve brown hair silhouette and highlights, big dark eyes, peach skin and pink cheeks, proportions and friendly face. Preserve white superhero costume, red HA chest lettering with orange lightning, blue shoulder panels and blue gloves. Compact waist-up frontal/three-quarter bust, one blue-gloved hand in a friendly thumbs-up. Face large enough for a 44-pixel app-header avatar. Clean dark outlines, broad flat colors, simple two-step cel shading like the reference. True transparent background, no surrounding circle badge or shield, no banner or additional wording, no watermark or 3D effects.

## 검수

- 두 최종 PNG를 직접 열어 한글 철자·형아맨 정체성·모서리 잘림을 확인했습니다.
- PNG alpha 채널 존재와 `alphaMin=0`, `alphaMax=255`를 확인했습니다.
- 투명 여백을 정리한 뒤 PNG와 WebP를 모두 저장했습니다.
- 최종 화면에서의 작은 크기 가독성과 배치는 앱 UI 검수에서 별도로 확인해야 합니다.

## 생성 원본

- 최종 워드마크: `C:/Users/호밀하우스/.codex/generated_images/01a1d471-4435-7e72-95a7-543fb5617081/exec-6bf7981e-7ba5-41e3-adaa-ac62afd054d5.png`
- 캐릭터 마크: `C:/Users/호밀하우스/.codex/generated_images/01a1d471-4435-7e72-95a7-543fb5617081/exec-6ea022cd-7ddd-4ccc-a773-82daa5c01169.png`
