# 자연·문화유산·공통 상황 그림 제작 기록

## 위험 상황 표정 재검수와 수정본

2026-11-14 추가 검수. 화재 상황에서 웃는 표정이 부적합하다는 사용자 지적에 따라 이 작업 소유 그림도 다시 확인했다. 야생동물·벌 대면, 팔 불편함·더위 불편함, 지진 뒤 집결 그림의 활짝 웃는 표정은 안전 맥락과 맞지 않아 편집했다. 익수 목격 그림은 원래도 놀란 입 모양이었으나, 같은 검수 기준으로 닫힌 입과 침착한 걱정 표현을 더 명확하게 했다.

Built-in `image_gen` EDIT로 기존 그림 각각을 대상으로 삼아 사람의 표정만 바꾸도록 지시했다. 인물 정체성·옷·행동·배경·안전 거리·위험 요소를 유지했고 공포를 과장하지 않았다. 결과를 개별로 직접 확인하고 최종 1200×800 WebP 및 컨택시트에서 다시 검수했다. 원본은 보존하고 아래 sibling 수정본을 저장했다. 런타임 연결은 앱 통합 담당자가 수행한다.

### park-rescue-serious.webp

편집 대상: `media/scenarios/park-rescue.webp`

결과 원본: 공통 생성 폴더의 `exec-5f4ef3aa-28af-4f79-abbd-57019673c777.png`

정확한 편집 프롬프트:

Edit ONLY the FACIAL EXPRESSIONS of the two foreground people in this exact supplied safety illustration. It depicts witnessing a person in trouble in a lake, so foreground hero and male teacher must look worried but composed and focused, NOT cheerful. Give both a small CLOSED neutral/slightly downturned mouth and gently concerned eyebrows; no grin, no open smile, no exaggerated terror. Keep their eyes alert. Preserve exact character identity, face proportions, hair, glasses, white HA hero costume, casual teacher outfit, all body poses and gestures, phone call, pointing hand, scene composition, outlines, colors, railing, lake, distant person asking for help, and every other object. Do not change the distant person's small help-calling expression. No additions, no text. Same landscape 3:2 canvas and original flat 2D cel-shaded style. Expression-only correction.

### park-wildlife-serious.webp

편집 대상: `media/scenarios/park-wildlife.webp`

결과 원본: 공통 생성 폴더의 `exec-717c0be8-5584-4c80-a71d-869ebf56e832.png`

정확한 편집 프롬프트:

Edit ONLY the two foreground HUMAN FACIAL EXPRESSIONS in this exact ecological-park safety picture. A snake and a bee are hazards they are giving space, so hero and teacher should be calm, attentive and mildly concerned, not happy or excited. Replace both open cheerful smiles with SMALL CLOSED neutral mouths, gently focused eyebrows, alert attentive eyes. No big frown, terror or anger. Preserve exact character identities, faces' proportions, hero hair and HA costume, teacher glasses and casual outfit, all poses and hand gestures, their distance from animals, animal sizes and locations, all background/colors/composition. Do not add or remove anything, no text. Same landscape 3:2 and clean thick-outline flat cel-shaded illustration. Strict expression-only correction.

### park-grass-serious.webp

편집 대상: `media/scenarios/park-grass.webp`

결과 원본: 공통 생성 폴더의 `exec-b514e080-da4e-4bd2-a5bc-29041f79c844.png`

정확한 편집 프롬프트:

Edit ONLY HUMAN FACIAL EXPRESSIONS in this exact supplied educational illustration. The hero is reporting itching/discomfort after being near grass. Female teacher must listen with caring focused concern, not an open cheerful smile. Give teacher a small CLOSED neutral mouth and gentle attentive eyebrows. Hero should have a small CLOSED slightly downturned mouth, mildly uncomfortable and seeking help, no grin, no panic or crying. Preserve identity, face proportions, eyes, hair, hero HA costume, teacher casual clothing, crouching pose, open-hand gesture toward bench, hero pointing to covered arm, all body positions, background, grass, lake, color palette and outlines. Do not add injury or rash. Same 3:2 composition, same flat 2D cel-shaded character-sheet art. Expression-only correction, no text.

### park-heat-serious.webp

편집 대상: `media/scenarios/park-heat.webp`

결과 원본: 공통 생성 폴더의 `exec-b8892d51-8c35-4931-aa3d-0106d1a17ce4.png`

정확한 편집 프롬프트:

Edit ONLY HUMAN FACIAL EXPRESSIONS in this exact safety illustration. Hero feels dizzy/unwell in heat and female teacher is responding; this must not look like a happy outing. Hero: CLOSED small slightly downturned mouth, gently concerned brows, eyes awake and seeking help. Teacher: CLOSED small neutral mouth, caring focused eyes and mildly concerned eyebrows, not smiling or laughing. No exaggerated panic, no tears, no anger. Preserve all identities/face proportions/hair/eyes, HA costume, casual clothes, bench sitting pose, teacher leaning pose, forehead hand, request gesture, closed water bottle, body positions, full background/lighting/colors/outlines, all objects and original 3:2 composition. Same clean thick-outline 2D cel shading. Do not add medical treatment, injury, symbols, words or anything. Facial-expression-only edit.

### garden-bee-serious.webp

편집 대상: `media/scenarios/garden-bee.webp`

결과 원본: 공통 생성 폴더의 `exec-70e7a775-6850-4d17-93f6-28508cbc06bb.png`

정확한 편집 프롬프트:

Edit ONLY the facial expressions of the TWO HUMAN characters in this exact botanical-garden safety picture. They have noticed a nearby bee and are giving it distance. Remove all open cheerful smiles. Hero and male teacher should have small CLOSED neutral mouths, calm focused eyebrows and attentive eyes, mildly cautious but not frightened or angry. Preserve exact identities, proportions, hair, glasses, costumes and casual clothes, hand gestures, body positions, bee location and safe distance, rope barrier, plants, greenhouse, original palette, outlines, composition and every other object. No added symbols, no text. Same landscape 3:2 canvas and flat cel-shaded character-sheet illustration. Facial-expression-only correction.

### heritage-open-serious.webp

편집 대상: `media/scenarios/heritage-open.webp`

결과 원본: 공통 생성 폴더의 `exec-32177c8e-9765-4d05-b182-3495d3cf1915.png`

정확한 편집 프롬프트:

Edit ONLY the THREE HUMAN FACIAL EXPRESSIONS in this exact supplied illustration of safe assembly in an open palace courtyard AFTER earthquake shaking has stopped. Replace all broad open cheerful smiles with small CLOSED neutral mouths, calm attentive eyes and gently focused eyebrows. Their mood should be composed, relieved to be together yet still listening/checking safety, not celebrating, laughing or grinning. No frightened, crying, angry or exaggerated expressions. Preserve EXACT character identities, face proportions, hairstyles, glasses, HA hero costume, teachers' casual clothes, standing poses and hand gestures, positions of all three people, broad empty courtyard, distant palace and walls, original colors, outlines and all objects. No additions, no text. Keep same 3:2 landscape composition and clean flat 2D cel-shaded character-sheet style. Expressions-only edit.


2026-11-14. Built-in `image_gen`을 사용해 개별 그림 12장을 생성했다. CLI/API 대체 경로는 사용하지 않았다. 원본 캐릭터 시트와 기존 장소 그림을 직접 열어 기준으로 삼았다. 런타임·학습 내용·질문 연결 코드는 이 작업에서 수정하지 않았다.

## 최종 파일과 검수

모든 파일은 `media/scenarios/`의 1200×800 WebP이다. 원본은 1536×1024 PNG이며 가로세로 비율을 그대로 유지해 축소했다. 12장 각각 직접 시각 검수한 뒤 크림색 컨택시트로 함께 보아 인물 정체성·선·색면·발과 위험 경계의 위치를 다시 확인했다. 형아맨은 흰 슈트와 HA 번개, 파란 장갑·부츠를 유지했고 교사는 일상복과 운동화를 입었다.

전용 삽화는 질문에서 말하는 안전 상황을 보여 주는 자료이며 실제 시설의 구조나 공식 대피 지도는 아니다. 특히 문화유산의 무단차 통로는 일반화한 예시이므로 해당 방문지의 실제 접근 경로·안내를 교사가 확인해야 한다. 지진 뒤 집결 그림에는 ‘흔들림이 멈춘 뒤’라는 맥락을 별도 문장으로 제시해야 한다. 물에 빠진 사람 그림은 사고 상황을 다루므로 학생 특성에 따라 교사가 미리 확인해 사용한다.

| 파일 | 핵심 장면 |
|---|---|
| `park-lake.webp` | 난간 밖 모자를 직접 주우러 가지 않고 선생님에게 알리기. |
| `park-grass.webp` | 풀숲 밖 관찰로에서 팔의 불편함을 알리고 쉬기. |
| `park-wildlife.webp` | 뱀·벌과 충분히 거리를 두고 만지거나 쫓지 않기. |
| `park-rescue.webp` | 물에 빠진 사람을 보고 물에 들어가지 않고 교사에게 알리기. 교사는 전화로 도움 요청. |
| `heritage-threshold.webp` | 높은 문턱 앞에서 멈추고 교사와 이용 가능한 다른 길 확인. |
| `garden-berry.webp` | 모르는 열매를 만지거나 맛보지 않고 눈으로 관찰. |
| `park-heat.webp` | 그늘 벤치에서 몸의 불편함을 알리기. 쓰러짐·강제 음수 표현 없음. |
| `heritage-photo.webp` | 관람 경계선 밖 공용 길에서 멈춰 사진 찍기. |
| `garden-bee.webp` | 온실 관찰로에서 벌과 거리 유지, 선생님에게 알리기. 뱀 없음. |
| `heritage-open.webp` | 흔들림이 멈춘 뒤 건물·담장과 떨어진 넓은 곳에서 일행과 함께 있기. |
| `rest-toilet.webp` | 휴게소 내부 공용 복도에서 화장실에 가고 싶다고 알리기. 사적 공간 묘사 없음. |
| `home-count.webp` | 학교 도착 뒤 정차 버스와 분리된 보행 대기 공간에서 인원 확인. |

## 참고 원본

- `E:/안전교육/캐릭터원본/형아맨.png`: 모든 형아맨의 정체성·옷·비율·셀채색 기준.
- `E:/안전교육/캐릭터원본/남자선생님.png`, `여자선생님.png`: 얼굴·머리·안경 정체성 기준. 의복은 장소에 맞게 교체했다.
- `media/illustrations/park.webp`, `garden.webp`, `heritage.webp`, `rest.webp`, `bus.webp`: 기존 앱의 배경 표현·색·외곽선 기준.

## 생성 원본과 정확한 프롬프트

생성 원본 공통 폴더: `C:/Users/호밀하우스/.codex/generated_images/01a1d57b-b60d-7980-a28b-37e1bd493225/`.

### park-lake

원본: `exec-b04070c9-46af-42ab-bc8b-517d8d33218c.png`

Use case: scientific-educational illustration-story. Make one landscape 3:2 safety situation picture for a Korean special-school learning app. Reference 1 defines EXACT Hyeong-a-man hero identity: brown hair, big dark eyes, white HA lightning suit, blue gloves/boots. Reference 2 defines male teacher face/hair/glasses ONLY; dress him in mint polo shirt, navy casual trousers and white sneakers, no suit. Reference 3 defines matching park setting and clean 2D cel-shaded character-sheet art. Scene: the hero and teacher stand safely on a wide paved lakeside walking path IN FRONT OF a continuous solid metal safety railing. A dropped orange sunhat lies on the sloping grass BEYOND the railing towards the lake, clearly out of reach. Hero points to the fallen hat while telling the teacher; both feet remain planted well away from the railing. Teacher calmly responds with open palm and another hand pointing toward an adult park attendant further along the safe path. Neither character leans over, climbs or reaches beyond the railing. Lake and trees clearly visible, uncluttered composition, the barrier and lost hat visually unmistakable. Thick tidy dark outlines, broad flat colors and 2-3 crisp cel shade tones matching the reference, no photorealism, no glossy 3D, no blur, no text, no speech bubbles, no signs with letters, no badge.

### park-grass

원본: `exec-8c04e489-bb5a-496e-a371-f579f39ad986.png`

Use case: scientific-educational illustration-story. One landscape 3:2 safety situation picture for a Korean special-school learning app. Reference1 EXACT Hyeong-a-man character identity and costume, reference2 female teacher face/hair ONLY (dress her in peach hooded casual jacket, navy trousers, white sneakers, NO suit/heels), reference3 existing park art style. Scene on a clear wide paved eco-park walking path with dense tall grasses outside its edge. Hero stands on the clear path beside female teacher and points with one gloved hand to his own covered opposite forearm, looking mildly uncomfortable and asking for help. His white sleeve remains closed/covering arm. Female teacher crouches slightly to eye level and listens warmly, one hand calmly indicating a nearby bench on the clear path where they can stop. Both are safely outside the grass, no touching grass. Dense grass clearly visible to one side as context. No rash closeup, no red wound or bite marks, no scratching, no medical treatment pictured. The key visible action is expressing discomfort to the teacher. Clean thick dark navy outlines, flat broad colors, crisp 2-3 tone cel shading, friendly chibi proportions matching character sheets, uncluttered background. No text, no speech bubbles, no signs with letters, no badge, no photorealism, no 3D, no blur.

### park-wildlife

원본: `exec-809c8495-51cb-4259-90f9-3e02d1d87805.png`

Use case: scientific-educational illustration-story. One landscape 3:2 situation picture for Korean special-school safety education. Ref1 exact Hyeong-a-man character and white HA hero costume/blue gloves/boots, ref2 male teacher face/black hair/glasses only (mint casual polo, navy trousers, white sneakers; no suit), ref3 park drawing style. Scene: on an ecological park's broad paved footpath, Hyeong-a-man and male teacher have stopped CALMLY in the far-left foreground, standing beside each other. At least three full body lengths of clear empty path separate them from a small realistic-in-cartoon-style green-brown snake farther along path on the right. A single small bee flies beyond a flowering bush far to the right, visibly far from the people. Both people turn their bodies slightly away to give space; teacher's lowered open hand calmly indicates stopping and slowly stepping back, hero watches teacher. No one touches, chases, picks up, kicks or swats any animal. Snake is low to ground, not rearing, no fangs or angry expression, no monster size. Bee is tiny and neutral. Clear visual distance is the main learning cue. Thick clean dark outlines, big flat colors, crisp two-step cel shading, same friendly chibi character-sheet art across environment. No words, no speech bubble, no infographic arrows, no terror, no gore, no 3D, no blur, no shiny photorealistic textures.

### park-rescue

원본: `exec-2b0a5403-80fb-4c72-86ba-0c2520bcabc2.png`

Use case: scientific-educational illustration-story. One landscape 3:2 safety situation picture for Korean special-school students, calm clear learning context. Ref1 exact Hyeong-a-man identity, face and white HA costume/blue gloves/boots. Ref2 male teacher face, glasses, hair only, wearing mint polo shirt/navy casual trousers/white sneakers, no suit. Ref3 park setting and chibi cel-shaded drawing style. Foreground: hero is safely on a wide paved lakeside path, well BACK from an unbroken high metal lakeside railing, urgently but calmly pointing across the lake while turning to tell the teacher. Teacher stands beside him and is calling for emergency help on a smartphone held at his ear. In the middle distance of the lake is ONE small person, only head and one raised arm visible above the calm water, visibly asking for help, not smiling or swimming for fun. Show enough separation that the person cannot be reached from shore. No one from foreground enters the lake or climbs railing; no touching water, no risky rescue attempt. Composition clearly pairs notifying a responsible adult with distant trouble in water. Main foreground figures large, distant person small but discernible, simple lake background, no distracting objects. Bold tidy dark outlines, broad flat colors, 2-3 crisp cel shade tones, matching character sheets exactly. No scary closeup, no injury, no death, no panic faces, no gore, no text or numbers, no speech bubbles, no glossy 3D or photorealism.

### heritage-threshold

원본: `exec-acf95f3e-79e7-430a-a5f6-6e8419e93ebd.png`

Use case: scientific-educational illustration-story. One landscape 3:2 situation picture for Korean special-school safety learning. Ref1 exact Hyeong-a-man character identity and white HA hero costume, ref2 female teacher face/hair ONLY (light blue casual hooded jacket, navy trousers, white sneakers, no suit or heels), ref3 heritage setting and chibi cel-shaded art style. Scene in a GENERIC traditional Korean palace courtyard, no claim to be a mapped real palace. Hero and teacher stand together on the smooth courtyard path at the left foreground, looking at a clearly high wooden threshold across an open traditional red gate doorway at center. The threshold is substantial enough to notice, hero has stopped before it, both feet on flat ground. Teacher calmly points toward a visibly smooth step-free alternative route curving around the side through a separate wide open side passage, with a low gentle accessible ramp and handrail, leading onward on the right. Both threshold obstacle and continuous safe alternative route should be clearly readable at small size. Do not show climbing the gate/threshold, running, jumping, carrying a person, or damaging a heritage structure. No wheelchair necessary. Friendly clean thick dark outlines, broad flat colors, crisp 2-3 tone cel shadows matching supplied character sheets; simplified traditional roof and red/green painted wood in background. No text, labels, numbers, signs, arrows, speech bubbles, badges, photo textures, 3D, blur or shiny effects.

### garden-berry

원본: `exec-952190a2-1cab-4375-b6fa-f80afbfa330c.png`

Use case: scientific-educational illustration-story. One landscape 3:2 safety situation picture in a botanical garden greenhouse for Korean special-school students. Reference1 exact Hyeong-a-man face, brown hair and white HA lightning superhero costume with blue gloves and boots. Reference2 male teacher face/hair/glasses ONLY; wear an olive overshirt over cream T-shirt, tan trousers and white sneakers, no formal suit. Reference3 existing greenhouse scene style and environment. Scene: hero stands on a clear broad dry observation path beside teacher, both outside a low wooden-post-and-rope plant boundary. Beyond the rope is a leafy shrub with a small cluster of visually obvious unknown red berries. Hero looks curious and points toward the berries with a bent arm, hand still well on his own side of the barrier and far from plant. Teacher calmly answers and gestures with open palm to observe without touching. No touching, picking, tasting, eating, feeding, or holding berries. Clearly show the berries connected to the shrub, both people fully in frame, barrier separates path and plants. Clean thick dark navy outlines, broad flat colors, crisp two-three-tone cel shading across characters and background, matching friendly chibi reference proportions. No text, no bubbles, no signs, no badge, no rash/injury, no photo textures, no glossy3D, no blur.

### park-heat

원본: `exec-158addd2-bdd5-4491-b2a5-ecd671ad6e10.png`

Use case: scientific-educational illustration-story. One landscape 3:2 summer park safety situation in the SAME clean cel-shaded chibi character-sheet style as references. Ref1 exact Hyeong-a-man hero face and white HA costume/blue gloves/boots. Ref2 female teacher face/hair only, peach casual hooded jacket/navy trousers/white sneakers, no suit/heels. Ref3 park environment style. Scene: at a lakeside park on a warm sunny day, hero is seated securely on a wooden bench completely in the shade of a large tree and simple pergola. He looks mildly dizzy/uncomfortable, one gloved hand near his forehead and the other gesturing to female teacher standing close beside bench, clearly telling her he feels unwell. Teacher gently leans to listen and respond, calm attentive expression, holding a closed water bottle at her side. Hero is awake and upright, no fainting, no forced drinking or treatment. Lake is safely beyond intact metal railing in background. Make the shaded rest spot, expressed discomfort and teacher support obvious. Keep sunlight outside shaded bench area, uncluttered path and trees. Thick tidy dark outlines, broad flat colors, crisp 2-3 step cel shading, no gradients/gloss/photorealism. No text, no thermometer icons, no speech bubbles, no rash, no hospital imagery, no panic.

### heritage-photo

원본: `exec-1d4b39e1-b9ea-46d1-9592-c8238f782d8c.png`

Use case: scientific-educational illustration-story. One landscape 3:2 safety situation picture for Korean special-school students. Reference1 exact Hyeong-a-man hero identity, white HA costume and blue gloves/boots. Reference2 female teacher face/hair ONLY, wearing light blue casual hooded jacket, navy trousers and white sneakers, no suit or heels. Reference3 gives clean cel-shaded palace background style. Scene in a generic traditional Korean palace: hero and teacher stand together on the PUBLIC visitor path in front of a clearly continuous low POST-AND-ROPE no-entry boundary. Beyond rope is the raised stone platform and traditional red/green palace hall. Hero stands still with feet safely on public path, holding a smartphone with both hands at chest height to photograph the hall. Teacher beside hero calmly points at the boundary and helps him keep a comfortable distance. Entire bodies and feet visible. Neither character crosses, reaches through, sits on or climbs the rope, and no walking backward while taking photos. The rope must visibly separate people from restricted platform. No text or written signs; no image UI on phone screen needed. Chibi proportions and faces matching sheets, thick tidy dark navy outlines, broad flat colors, crisp 2-3 cel shade tones for entire scene, no 3D, no photo textures, no glossy effects, no blur, no speech bubbles or badges.

### garden-bee

원본: `exec-63e462d6-6d05-432d-838a-83aaee29a162.png`

Use case: scientific-educational illustration-story. One landscape 3:2 botanical greenhouse safety situation for Korean special-school students. Reference1 exact Hyeong-a-man face, brown hair, white HA lightning suit, blue gloves/boots. Reference2 male teacher face/black hair/glasses ONLY, olive casual overshirt over cream T-shirt, tan trousers and white sneakers (no suit). Reference3 greenhouse drawing style. Scene: Hyeong-a-man and teacher have stopped together on the LEFT of a broad clear greenhouse observation path. On the FAR RIGHT beyond a low post-and-rope plant boundary, a SINGLE SMALL BEE is calmly flying near a flowering shrub. Several body lengths of open space separate bee and people. Hero turns his face toward teacher to notify him and points only with a small bent-arm gesture held close to his own chest. Teacher listens and holds a relaxed low open palm to signal giving space and slowly moving away. No hands reaching at bee, no swatting, no running, no catching, no touching plants. NO snake anywhere. Thick clean dark navy outlines, big flat colors, crisp two-step cel shading, friendly chibi character-sheet proportions, all feet visible, bee small but clear, simple glass roof framework in background. No text, no speech bubbles, no fear symbols, no injury, no 3D, no photo textures or blur.

### heritage-open

원본: `exec-7cb4bb98-18e8-4be7-856e-7111c3d32618.png`

Use case: scientific-educational illustration-story. One landscape 3:2 Korean special-school safety picture, a generic traditional palace courtyard AFTER earthquake shaking has stopped. Reference1 exact Hyeong-a-man hero identity, white HA costume and blue gloves/boots. Reference2 male teacher face/hair/glasses only, mint polo/navy trousers/white sneakers. Reference3 female teacher face/long brown hair only, light blue casual jacket/navy trousers/white sneakers. Reference4 matching palace art and clean chibi cel-shaded style. Show the three characters grouped together in the CENTER of an extremely broad empty open stone/sandy palace courtyard. All three full bodies visible, standing calmly together while male teacher checks the group and female teacher calmly indicates the wide safe assembly space. Every palace building, high stone wall, gate, roof eave and tree is FAR away along distant edges; at least several character heights of empty open ground between group and any structure. Avoid putting characters next to a wall, under a tree, beneath roofs, in a doorway or beside objects that could fall. No one runs. No falling debris, no shaking, no cracks, no damage, no fear, no text or labels, no arrows, no speech bubbles, no badge. Simple clear composition emphasizes staying together in a broad unobstructed place away from buildings/walls after shaking stops. Thick tidy dark outlines, broad flat colors, crisp 2-3 tone cel shadows matching character sheets across all figures and background. No photorealism, no 3D or blur.

### rest-toilet

원본: `exec-2a82862c-f90a-43b8-9e82-0ce5ebe4b9f6.png`

Use case: scientific-educational illustration-story. One landscape 3:2 safety situation picture for a Korean special-school learning app. Ref1 exact Hyeong-a-man hero identity, white HA lightning costume and blue gloves/boots. Ref2 female teacher face and long brown hair only, wearing a green casual cardigan over cream top, navy trousers and white sneakers (no suit or heels). Ref3 existing rest-stop interior style and palette. Scene INSIDE a highway rest-stop building, on a broad clean corridor BEFORE the shared toilet lobby entrance. Above entrance a clear generic toilet pictogram sign with simple person and wheelchair pictograms, no letters. Hero stands beside his teacher, facing her and politely pointing toward the toilet entrance to notify her he wants to use the toilet and ask for support. Teacher calmly listens with open hand and prepares to accompany him according to their plan. Both characters remain in shared public corridor, nobody enters a gendered toilet room, no toileting/private imagery. Simplified rest-stop cafeteria visible through opening on far left, but no outdoor cars or roads. Key cue is telling the teacher before going, no lone wandering. Clean thick dark navy outlines, broad flat colors, crisp two-step cel shading, friendly chibi reference-sheet proportions for both people and environment. Full bodies visible, uncluttered. No words, text, speech bubbles, badges, photorealism, 3D, gloss or blur.

### home-count

원본: `exec-bb1dc406-1e35-4aae-8ab2-b30a0193914d.png`

Use case: scientific-educational illustration-story. One landscape 3:2 school field-trip return safety picture for Korean special-school students. Reference1 exact Hyeong-a-man hero face/hair, white HA lightning costume, blue gloves/boots. Reference2 male teacher face/black hair/glasses ONLY, wearing blue casual polo, navy trousers and white sneakers, no suit. Reference3 established bus illustration palette and chibi cel-shaded art style. Scene OUTSIDE at a school arrival area after bus trip. In foreground a wide clearly separated paved PEDESTRIAN waiting area is protected from the bus lane by a continuous raised curb and bollards. All children are already safely OFF bus, standing together well inside pedestrian area: Hyeong-a-man plus three friendly chibi pupils in modest colorful casual clothes and sneakers. Male teacher stands facing them with a clipboard, visually checking each child's presence and counting the group. Children calmly face teacher, no wandering. In background a yellow school bus is completely stopped parallel to curb, with parking wheels still and passenger door open on curb side; no motion lines. School building and entrance visible behind group. No child on roadway, no running, no standing behind bus, no crossing bus lane, no figures near wheels. Show full body figures, clear separation of safe waiting space from bus. Clean thick dark navy outlines, broad flat colors, crisp two-three tone cel shading consistent with character sheets, no photo textures, no 3D, no blur, no text/sign lettering, no number labels, no speech bubbles or badge.

