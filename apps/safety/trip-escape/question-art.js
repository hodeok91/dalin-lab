/* v2.9 장소·행동 대조 및 숙소 맥락 검수. */
(function(root){'use strict';
const data={
  "entries": {
    "sports/choice/injury": {
      "image": "media/scenarios/sports-injury-serious.webp",
      "cards": {
        "file": "media/question-art/cards-sports-injury-fix.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "sports/choice/tired": {
      "image": "media/scenarios/sports-tired-serious.webp",
      "cards": {
        "file": "media/question-art/cards-sports-tired.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "sports/quiz/flip": {
      "image": "media/review-v29/mixed-sports-flip.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 공중제비를 도는 형아맨 / 매트 밖에서 자기 차례를 기다리는 친구",
        "instruction": "공중제비를 도는 형아맨, 매트 밖에서 자기 차례를 기다리는 친구 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "flip-danger",
            "label": "공중제비를 도는 형아맨",
            "kind": "danger",
            "box": [
              15,
              19,
              43,
              53
            ],
            "rule": "위험한 묘기와 과한 점프는 하지 않아요."
          },
          {
            "id": "flip-safe",
            "label": "매트 밖에서 자기 차례를 기다리는 친구",
            "kind": "safe",
            "box": [
              62,
              39,
              17,
              46
            ],
            "rule": "위험한 묘기와 과한 점프는 하지 않아요."
          }
        ]
      }
    },
    "sports/quiz/stop": {
      "image": "media/review-v29/mixed-sports-stop.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 아픈데도 계속 뛰는 친구 / 놀이를 멈추고 아프다고 알리는 형아맨",
        "instruction": "아픈데도 계속 뛰는 친구, 놀이를 멈추고 아프다고 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "stop-danger",
            "label": "아픈데도 계속 뛰는 친구",
            "kind": "danger",
            "box": [
              12,
              18,
              30,
              65
            ],
            "rule": "아프면 놀이를 멈추고 선생님께 알려요."
          },
          {
            "id": "stop-safe",
            "label": "놀이를 멈추고 아프다고 알리는 형아맨",
            "kind": "safe",
            "box": [
              50,
              33,
              25,
              53
            ],
            "rule": "아프면 놀이를 멈추고 선생님께 알려요."
          }
        ]
      }
    },
    "cinema/choice/noise": {
      "image": "media/scenarios/cinema-noise-serious.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-noise.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "cinema/choice/alarm": {
      "image": "media/scenarios/cinema-fire-serious.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-alarm.webp",
        "width": 1600,
        "height": 800
      }
    },
    "cinema/quiz/aisle": {
      "image": "media/question-art/scene-cinema-quiz-aisle.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 어두운 계단에서 뛰는 친구 / 통로에서 뛰지 않고 선생님 곁에 있는 형아맨",
        "instruction": "어두운 계단에서 뛰는 친구, 통로에서 뛰지 않고 선생님 곁에 있는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "aisle",
            "label": "어두운 계단에서 뛰는 친구",
            "kind": "danger",
            "box": [
              64,
              29,
              25,
              58
            ],
            "rule": "통로에서는 천천히 이동하고 필요한 도움을 요청해요."
          },
          {
            "id": "aisle-safe",
            "label": "통로에서 뛰지 않고 선생님 곁에 있는 형아맨",
            "kind": "safe",
            "box": [
              21,
              30,
              20,
              66
            ],
            "rule": "어두운 상영관 통로에서는 뛰지 않고 선생님과 천천히 이동해요."
          }
        ]
      }
    },
    "cinema/quiz/help": {
      "image": "media/review-v29/mixed-cinema-help.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 말하지 않고 혼자 출구로 가는 친구 / 소리가 힘들다고 선생님께 알리는 형아맨",
        "instruction": "말하지 않고 혼자 출구로 가는 친구, 소리가 힘들다고 선생님께 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "help-danger",
            "label": "말하지 않고 혼자 출구로 가는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "불편하다는 표현도 안전을 지키는 행동이에요."
          },
          {
            "id": "help-safe",
            "label": "소리가 힘들다고 선생님께 알리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "불편하다는 표현도 안전을 지키는 행동이에요."
          }
        ]
      }
    },
    "museum/choice/touch": {
      "image": "media/scenarios/museum-touch.webp",
      "cards": {
        "file": "media/question-art/cards-museum-touch.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "museum/choice/lost": {
      "image": "media/scenarios/museum-lost-serious.webp",
      "cards": {
        "file": "media/question-art/cards-museum-lost-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "museum/choice/voice": {
      "image": "media/scenarios/museum-voice.webp",
      "cards": {
        "file": "media/question-art/cards-museum-voice.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "museum/quiz/group": {
      "image": "media/question-art/scene-museum-quiz-group.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 혼자 다른 전시실로 가는 친구 / 선생님 곁에 함께 있는 형아맨",
        "instruction": "혼자 다른 전시실로 가는 친구, 선생님 곁에 함께 있는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "group",
            "label": "혼자 다른 전시실로 가는 친구",
            "kind": "danger",
            "box": [
              68,
              27,
              19,
              65
            ],
            "rule": "선생님께 알리고 함께 이동해요."
          },
          {
            "id": "group-safe",
            "label": "선생님 곁에 함께 있는 형아맨",
            "kind": "safe",
            "box": [
              3,
              22,
              15,
              72
            ],
            "rule": "다른 전시실로 옮길 때는 알리고 일행과 함께 이동해요."
          }
        ]
      }
    },
    "museum/quiz/touch": {
      "image": "media/review-v29/mixed-museum-touch.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 보호 전시물에 손을 대는 친구 / 체험물 이용 안내를 확인하는 형아맨",
        "instruction": "보호 전시물에 손을 대는 친구, 체험물 이용 안내를 확인하는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "touch-danger",
            "label": "보호 전시물에 손을 대는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "모든 전시물의 이용 방법이 같지는 않아요."
          },
          {
            "id": "touch-safe",
            "label": "체험물 이용 안내를 확인하는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "모든 전시물의 이용 방법이 같지는 않아요."
          }
        ]
      }
    },
    "museum/quiz/flash": {
      "image": "media/question-art/scene-museum-quiz-flash.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 플래시를 켜고 사진 찍는 친구 / 사진 찍기 전에 선생님과 확인하는 형아맨",
        "instruction": "플래시를 켜고 사진 찍는 친구, 사진 찍기 전에 선생님과 확인하는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "flash",
            "label": "플래시를 켜고 사진 찍는 친구",
            "kind": "danger",
            "box": [
              62,
              25,
              22,
              71
            ],
            "rule": "촬영·플래시 허용 여부는 전시실 안내를 먼저 확인해요."
          },
          {
            "id": "flash-safe",
            "label": "사진 찍기 전에 선생님과 확인하는 형아맨",
            "kind": "safe",
            "box": [
              40,
              33,
              19,
              61
            ],
            "rule": "촬영할 수 있는지, 플래시를 꺼야 하는지 안내를 확인해요."
          }
        ]
      }
    },
    "museum/quiz/food": {
      "image": "media/review-v29/mixed-museum-food.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 전시물 옆에서 과자를 먹는 친구 / 휴게 공간에 앉아 간식을 먹는 형아맨",
        "instruction": "전시물 옆에서 과자를 먹는 친구, 휴게 공간에 앉아 간식을 먹는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "food-danger",
            "label": "전시물 옆에서 과자를 먹는 친구",
            "kind": "danger",
            "box": [
              12,
              34,
              23,
              61
            ],
            "rule": "음식을 먹어도 되는 장소와 나에게 맞는 음식을 선생님과 확인해요."
          },
          {
            "id": "food-safe",
            "label": "휴게 공간에 앉아 간식을 먹는 형아맨",
            "kind": "safe",
            "box": [
              49,
              38,
              23,
              58
            ],
            "rule": "음식을 먹어도 되는 장소와 나에게 맞는 음식을 선생님과 확인해요."
          }
        ]
      }
    },
    "experience/choice/tool": {
      "image": "media/scenarios/experience-tool-serious.webp",
      "cards": {
        "file": "media/question-art/cards-experience-tool.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "experience/choice/unknown": {
      "image": "media/question-art/experience-unknown.webp",
      "cards": {
        "file": "media/question-art/cards-experience-unknown-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "experience/quiz/material": {
      "image": "media/question-art/scene-experience-quiz-material.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 체험 재료를 입에 가져가는 친구 / 재료를 입에 넣지 않고 기다리는 형아맨",
        "instruction": "체험 재료를 입에 가져가는 친구, 재료를 입에 넣지 않고 기다리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "material",
            "label": "체험 재료를 입에 가져가는 친구",
            "kind": "danger",
            "box": [
              49,
              31,
              24,
              47
            ],
            "rule": "먹는 재료인지, 내가 먹어도 되는지 먼저 확인해요."
          },
          {
            "id": "material-safe",
            "label": "재료를 입에 넣지 않고 기다리는 형아맨",
            "kind": "safe",
            "box": [
              1,
              27,
              20,
              49
            ],
            "rule": "만들기 재료는 먹지 않고 손으로만 안내에 맞게 사용해요."
          }
        ]
      }
    },
    "experience/quiz/guide": {
      "image": "media/review-v29/mixed-experience-guide.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 허락 없이 글루건에 손을 뻗는 친구 / 도구 설명을 듣고 물어보는 형아맨",
        "instruction": "허락 없이 글루건에 손을 뻗는 친구, 도구 설명을 듣고 물어보는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "guide-danger",
            "label": "허락 없이 글루건에 손을 뻗는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "안내를 확인하고 내게 맞는 도움을 받아요."
          },
          {
            "id": "guide-safe",
            "label": "도구 설명을 듣고 물어보는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "안내를 확인하고 내게 맞는 도움을 받아요."
          }
        ]
      }
    },
    "theme-park/choice/item": {
      "image": "media/scenarios/theme-item-serious.webp",
      "cards": {
        "file": "media/question-art/cards-theme-park-item.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "theme-park/choice/ride": {
      "image": "media/scenarios/theme-ride.webp",
      "cards": {
        "file": "media/question-art/cards-theme-park-ride-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "theme-park/choice/lost": {
      "image": "media/scenarios/theme-lost-serious.webp",
      "cards": {
        "file": "media/question-art/cards-theme-park-lost-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "theme-park/quiz/fence": {
      "image": "media/question-art/scene-theme-park-quiz-fence.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 울타리를 넘으려는 친구 / 놀이기구 울타리 밖에서 기다리는 형아맨",
        "instruction": "울타리를 넘으려는 친구, 놀이기구 울타리 밖에서 기다리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "fence",
            "label": "울타리를 넘으려는 친구",
            "kind": "danger",
            "box": [
              58,
              31,
              28,
              61
            ],
            "rule": "울타리 밖에서 직원에게 도움을 요청해요."
          },
          {
            "id": "fence-safe",
            "label": "놀이기구 울타리 밖에서 기다리는 형아맨",
            "kind": "safe",
            "box": [
              23,
              25,
              17,
              70
            ],
            "rule": "울타리 밖 정해진 자리에서 기다리고 직원 안내를 따라요."
          }
        ]
      }
    },
    "theme-park/quiz/condition": {
      "image": "media/review-v29/mixed-theme-park-condition.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 안내를 확인하지 않고 탑승 줄을 넘는 친구 / 직원과 이용 조건을 확인하는 형아맨",
        "instruction": "안내를 확인하지 않고 탑승 줄을 넘는 친구, 직원과 이용 조건을 확인하는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "condition-danger",
            "label": "안내를 확인하지 않고 탑승 줄을 넘는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "내게 맞는 활동인지 확인하고 이용해요."
          },
          {
            "id": "condition-safe",
            "label": "직원과 이용 조건을 확인하는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "내게 맞는 활동인지 확인하고 이용해요."
          }
        ]
      }
    },
    "park/choice/lake": {
      "image": "media/scenarios/park-lake.webp",
      "cards": {
        "file": "media/question-art/cards-park-lake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "park/choice/heat": {
      "image": "media/scenarios/park-heat-serious.webp",
      "cards": {
        "file": "media/question-art/cards-park-heat.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "park/choice/grass": {
      "image": "media/scenarios/park-grass-serious.webp",
      "cards": {
        "file": "media/question-art/cards-park-grass.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "park/choice/drowning": {
      "image": "media/scenarios/park-rescue-serious.webp",
      "cards": {
        "file": "media/question-art/cards-park-drowning-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "park/choice/snake": {
      "image": "media/scenarios/park-wildlife-serious.webp",
      "cards": {
        "file": "media/question-art/cards-park-snake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "park/quiz/rail": {
      "image": "media/question-art/scene-park-quiz-rail.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 난간을 넘으려는 친구 / 난간을 넘지 않고 선생님 곁에 있는 형아맨",
        "instruction": "난간을 넘으려는 친구, 난간을 넘지 않고 선생님 곁에 있는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "rail",
            "label": "난간을 넘으려는 친구",
            "kind": "danger",
            "box": [
              65,
              28,
              25,
              64
            ],
            "rule": "난간 밖과 물가에 접근하지 않아요."
          },
          {
            "id": "rail-safe",
            "label": "난간을 넘지 않고 선생님 곁에 있는 형아맨",
            "kind": "safe",
            "box": [
              4,
              31,
              16,
              65
            ],
            "rule": "난간은 넘어가는 곳이 아니에요. 산책로 안에서 함께 걸어요."
          }
        ]
      }
    },
    "park/quiz/rest": {
      "image": "media/review-v29/mixed-park-rest.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 힘든데도 계속 달리는 친구 / 그늘에서 쉬고 싶다고 알리는 형아맨",
        "instruction": "힘든데도 계속 달리는 친구, 그늘에서 쉬고 싶다고 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "rest-danger",
            "label": "힘든데도 계속 달리는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "몸의 신호를 알리고 물과 휴식을 챙겨요."
          },
          {
            "id": "rest-safe",
            "label": "그늘에서 쉬고 싶다고 알리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "몸의 신호를 알리고 물과 휴식을 챙겨요."
          }
        ]
      }
    },
    "park/quiz/grass": {
      "image": "media/review-v29/mixed-park-grass.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 풀숲 안으로 들어가는 친구 / 정해진 산책로에서 함께 걷는 형아맨",
        "instruction": "풀숲 안으로 들어가는 친구, 정해진 산책로에서 함께 걷는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "grass-danger",
            "label": "풀숲 안으로 들어가는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "정해진 길로 이동해요. 풀·식물 접촉이나 벌레 물림으로 불편하면 바로 알려요."
          },
          {
            "id": "grass-safe",
            "label": "정해진 산책로에서 함께 걷는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "정해진 길로 이동해요. 풀·식물 접촉이나 벌레 물림으로 불편하면 바로 알려요."
          }
        ]
      }
    },
    "park/quiz/drowning": {
      "image": "media/question-art/scene-park-quiz-drowning.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 물에 뛰어들려는 친구 / 물에 뛰어들지 않고 어른 곁에서 알리는 형아맨",
        "instruction": "물에 뛰어들려는 친구, 물에 뛰어들지 않고 어른 곁에서 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "drowning",
            "label": "물에 뛰어들려는 친구",
            "kind": "danger",
            "box": [
              53,
              28,
              26,
              66
            ],
            "rule": "직접 들어가지 않고 안전한 곳에서 어른에게 즉시 알려요. 119 구조 도움을 요청해요."
          },
          {
            "id": "drowning-safe",
            "label": "물에 뛰어들지 않고 어른 곁에서 알리는 형아맨",
            "kind": "safe",
            "box": [
              30,
              33,
              20,
              62
            ],
            "rule": "물에 빠진 사람을 보면 직접 뛰어들지 않고 주변 어른과 119에 알려요."
          }
        ]
      }
    },
    "garden/choice/berry": {
      "image": "media/scenarios/garden-berry.webp",
      "cards": {
        "file": "media/question-art/cards-garden-berry-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "garden/choice/bee": {
      "image": "media/scenarios/garden-bee-serious.webp",
      "cards": {
        "file": "media/question-art/cards-garden-bee-review3.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "garden/quiz/fruit": {
      "image": "media/question-art/scene-garden-quiz-fruit.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 모르는 열매를 입에 가져가는 친구 / 식물을 먹지 않고 관찰하는 형아맨",
        "instruction": "모르는 열매를 입에 가져가는 친구, 식물을 먹지 않고 관찰하는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "fruit",
            "label": "모르는 열매를 입에 가져가는 친구",
            "kind": "danger",
            "box": [
              67,
              26,
              23,
              68
            ],
            "rule": "모르는 열매와 식물을 먹거나 만지지 않아요."
          },
          {
            "id": "fruit-safe",
            "label": "식물을 먹지 않고 관찰하는 형아맨",
            "kind": "safe",
            "box": [
              20,
              27,
              19,
              64
            ],
            "rule": "정체를 모르는 열매나 식물은 먹거나 따지 않고 눈으로 관찰해요."
          }
        ]
      }
    },
    "garden/quiz/path": {
      "image": "media/review-v29/mixed-garden-path.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 관찰로 밖 식물 사이로 들어가는 친구 / 정해진 관찰로에서 함께 걷는 형아맨",
        "instruction": "관찰로 밖 식물 사이로 들어가는 친구, 정해진 관찰로에서 함께 걷는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "path-danger",
            "label": "관찰로 밖 식물 사이로 들어가는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "온실 바닥·문·경사를 살피고 안내에 따라 이동해요."
          },
          {
            "id": "path-safe",
            "label": "정해진 관찰로에서 함께 걷는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "온실 바닥·문·경사를 살피고 안내에 따라 이동해요."
          }
        ]
      }
    },
    "lodging/choice/hurt": {
      "image": "media/review-v29/lodging-health-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-lodging-hurt.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "lodging/choice/door": {
      "image": "media/review-v29/lodging-door.webp",
      "cards": {
        "file": "media/review-v29/cards-lodging-door.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "lodging/choice/toilet": {
      "image": "media/review-v29/lodging-night.webp",
      "cards": {
        "file": "media/review-v29/cards-lodging-toilet-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "lodging/choice/medicine": {
      "image": "media/review-v29/lodging-medicine-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-lodging-medicine.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "lodging/quiz/jump": {
      "image": "media/review-v29/scene-lodging-quiz-jump.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 침대 위에서 뛰는 친구 / 침대에서 뛰지 않고 바닥에 서 있는 형아맨",
        "instruction": "침대 위에서 뛰는 친구, 침대에서 뛰지 않고 바닥에 서 있는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "jump",
            "label": "침대 위에서 뛰는 친구",
            "kind": "danger",
            "box": [
              55,
              9,
              25,
              57
            ],
            "rule": "침대는 쉬는 곳이에요. 뛰면 떨어질 수 있어요."
          },
          {
            "id": "jump-safe",
            "label": "침대에서 뛰지 않고 바닥에 서 있는 형아맨",
            "kind": "safe",
            "box": [
              4,
              24,
              17,
              70
            ],
            "rule": "침대는 쉬는 곳이에요. 바닥에서도 뛰거나 밀지 않아요."
          }
        ]
      }
    },
    "lodging/quiz/help": {
      "image": "media/review-v29/mixed-lodging-help.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 도움 없이 혼자 이불 속에서 아파하는 친구 / 아프다고 남자 선생님께 알리는 형아맨",
        "instruction": "도움 없이 혼자 이불 속에서 아파하는 친구, 아프다고 남자 선생님께 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "help-danger",
            "label": "도움 없이 혼자 이불 속에서 아파하는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "몸과 마음이 불편하면 도움을 요청해요."
          },
          {
            "id": "help-safe",
            "label": "아프다고 남자 선생님께 알리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "몸과 마음이 불편하면 도움을 요청해요."
          }
        ]
      }
    },
    "bus/choice/stand": {
      "image": "media/game/bus-stand.webp",
      "cards": {
        "file": "media/question-art/cards-bus-stand-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "bus/choice/cross": {
      "image": "media/game/bus-cross.webp",
      "cards": {
        "file": "media/question-art/cards-bus-cross.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "bus/quiz/belt": {
      "image": "media/review-v29/mixed-bus-belt.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 벨트를 풀고 통로에 서 있는 친구 / 안전벨트를 매고 앉은 형아맨",
        "instruction": "벨트를 풀고 통로에 서 있는 친구, 안전벨트를 매고 앉은 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "belt-danger",
            "label": "벨트를 풀고 통로에 서 있는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "안전벨트와 필요한 고정장치를 확인해요."
          },
          {
            "id": "belt-safe",
            "label": "안전벨트를 매고 앉은 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "안전벨트와 필요한 고정장치를 확인해요."
          }
        ]
      }
    },
    "bus/quiz/cross": {
      "image": "media/question-art/scene-bus-quiz-cross.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 버스 앞으로 길을 건너려는 친구 / 버스 옆 보도에서 선생님과 기다리는 형아맨",
        "instruction": "버스 앞으로 길을 건너려는 친구, 버스 옆 보도에서 선생님과 기다리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "cross",
            "label": "버스 앞으로 길을 건너려는 친구",
            "kind": "danger",
            "box": [
              62,
              27,
              25,
              63
            ],
            "rule": "인솔자와 함께 안전한 횡단 장소를 이용해요."
          },
          {
            "id": "cross-safe",
            "label": "버스 옆 보도에서 선생님과 기다리는 형아맨",
            "kind": "safe",
            "box": [
              16,
              29,
              19,
              63
            ],
            "rule": "버스 앞뒤로 바로 뛰어나가지 않고 선생님과 안전한 이동 경로를 확인해요."
          }
        ]
      }
    },
    "rest/choice/alone": {
      "image": "media/scenarios/rest-toilet.webp",
      "cards": {
        "file": "media/question-art/cards-rest-alone.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "rest/choice/lost": {
      "image": "media/scenarios/rest-lost-serious.webp",
      "cards": {
        "file": "media/question-art/cards-rest-lost-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "rest/choice/friend": {
      "image": "media/question-art/rest-friend.webp",
      "cards": {
        "file": "media/question-art/cards-rest-friend-review2.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "rest/quiz/food": {
      "image": "media/review-v29/mixed-rest-food.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 뜨거운 음식을 들고 뛰는 친구 / 정해진 자리에 앉아 음식을 먹는 형아맨",
        "instruction": "뜨거운 음식을 들고 뛰는 친구, 정해진 자리에 앉아 음식을 먹는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "food-danger",
            "label": "뜨거운 음식을 들고 뛰는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "뜨거운 음식은 앉아서 먹어요."
          },
          {
            "id": "food-safe",
            "label": "정해진 자리에 앉아 음식을 먹는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "뜨거운 음식은 앉아서 먹어요."
          }
        ]
      }
    },
    "rest/quiz/teacher": {
      "image": "media/review-v29/mixed-rest-teacher.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 말없이 혼자 주차장 쪽으로 가는 친구 / 이동 전에 선생님께 알리는 형아맨",
        "instruction": "말없이 혼자 주차장 쪽으로 가는 친구, 이동 전에 선생님께 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "teacher-danger",
            "label": "말없이 혼자 주차장 쪽으로 가는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "동행·만나는 장소·시간 약속을 확인해요."
          },
          {
            "id": "teacher-safe",
            "label": "이동 전에 선생님께 알리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "동행·만나는 장소·시간 약속을 확인해요."
          }
        ]
      }
    },
    "night/choice/toilet": {
      "image": "media/review-v29/scene-night-choice-toilet.webp",
      "cards": {
        "file": "media/review-v29/cards-night-toilet-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "night/choice/medicine": {
      "image": "media/review-v29/scene-night-choice-medicine.webp",
      "cards": {
        "file": "media/review-v29/cards-night-medicine.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "night/quiz/night-help": {
      "image": "media/review-v29/mixed-night-night-help.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 도움 없이 혼자 아파하는 친구 / 밤에 아프다고 남자 선생님께 알리는 형아맨",
        "instruction": "도움 없이 혼자 아파하는 친구, 밤에 아프다고 남자 선생님께 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "night-help-danger",
            "label": "도움 없이 혼자 아파하는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "밤에도 불편하거나 도움이 필요하면 알려요."
          },
          {
            "id": "night-help-safe",
            "label": "밤에 아프다고 남자 선생님께 알리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "밤에도 불편하거나 도움이 필요하면 알려요."
          }
        ]
      }
    },
    "night/quiz/corridor": {
      "image": "media/review-v29/mixed-night-corridor.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 통로 한가운데 가방을 놓는 친구 / 가방을 선반에 넣어 길을 비우는 형아맨",
        "instruction": "통로 한가운데 가방을 놓는 친구, 가방을 선반에 넣어 길을 비우는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "corridor-danger",
            "label": "통로 한가운데 가방을 놓는 친구",
            "kind": "danger",
            "box": [
              7,
              26,
              40,
              66
            ],
            "rule": "어두울 때도 이동할 수 있도록 통로를 정리해요."
          },
          {
            "id": "corridor-safe",
            "label": "가방을 선반에 넣어 길을 비우는 형아맨",
            "kind": "safe",
            "box": [
              52,
              26,
              25,
              65
            ],
            "rule": "어두울 때도 이동할 수 있도록 통로를 정리해요."
          }
        ]
      }
    },
    "escape/quiz/lift": {
      "image": "media/review-v29/mixed-escape-lift.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 일반 엘리베이터로 가려는 친구 / 선생님과 확인된 계단 출구로 가는 형아맨",
        "instruction": "일반 엘리베이터로 가려는 친구, 선생님과 확인된 계단 출구로 가는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "lift-danger",
            "label": "일반 엘리베이터로 가려는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "선생님·직원의 안내와 미리 정한 피난계획을 따라요. 일반 엘리베이터를 이용하지 않아요."
          },
          {
            "id": "lift-safe",
            "label": "선생님과 확인된 계단 출구로 가는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "선생님·직원의 안내와 미리 정한 피난계획을 따라요. 일반 엘리베이터를 이용하지 않아요."
          }
        ]
      }
    },
    "escape/quiz/return": {
      "image": "media/question-art/scene-escape-quiz-return.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 가방을 찾으러 건물에 다시 들어가려는 친구 / 건물 밖에서 선생님과 기다리는 형아맨",
        "instruction": "가방을 찾으러 건물에 다시 들어가려는 친구, 건물 밖에서 선생님과 기다리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "return",
            "label": "가방을 찾으러 건물에 다시 들어가려는 친구",
            "kind": "danger",
            "box": [
              60,
              28,
              22,
              62
            ],
            "rule": "집결지에서 인원 확인과 안내를 기다려요. 물건을 찾으러 다시 들어가지 않아요."
          },
          {
            "id": "return-safe",
            "label": "건물 밖에서 선생님과 기다리는 형아맨",
            "kind": "safe",
            "box": [
              16,
              30,
              19,
              65
            ],
            "rule": "대피한 뒤에는 물건을 가지러 다시 들어가지 않고 집결지에서 인원을 확인해요."
          }
        ]
      }
    },
    "heritage/choice/threshold": {
      "image": "media/scenarios/heritage-threshold.webp",
      "cards": {
        "file": "media/question-art/cards-heritage-threshold-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "heritage/choice/photo": {
      "image": "media/scenarios/heritage-photo.webp",
      "cards": {
        "file": "media/question-art/cards-heritage-photo.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "heritage/quiz/boundary": {
      "image": "media/question-art/scene-heritage-quiz-boundary.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 출입 금지 줄을 넘으려는 친구 / 관람 줄 바깥에 머무르는 형아맨",
        "instruction": "출입 금지 줄을 넘으려는 친구, 관람 줄 바깥에 머무르는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "boundary",
            "label": "출입 금지 줄을 넘으려는 친구",
            "kind": "danger",
            "box": [
              53,
              26,
              29,
              67
            ],
            "rule": "정해진 관람 구역에서 관찰하고 사진을 찍어요."
          },
          {
            "id": "boundary-safe",
            "label": "관람 줄 바깥에 머무르는 형아맨",
            "kind": "safe",
            "box": [
              21,
              32,
              18,
              65
            ],
            "rule": "보호 구역의 줄을 넘지 않고 허용된 관람로에서 봐요."
          }
        ]
      }
    },
    "heritage/quiz/help": {
      "image": "media/review-v29/mixed-heritage-help.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 높은 돌계단을 혼자 뛰어오르는 친구 / 다른 길과 도움을 선생님께 묻는 형아맨",
        "instruction": "높은 돌계단을 혼자 뛰어오르는 친구, 다른 길과 도움을 선생님께 묻는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "help-danger",
            "label": "높은 돌계단을 혼자 뛰어오르는 친구",
            "kind": "danger",
            "box": [
              8,
              33,
              30,
              60
            ],
            "rule": "이용 가능한 경로와 필요한 도움을 확인해요."
          },
          {
            "id": "help-safe",
            "label": "다른 길과 도움을 선생님께 묻는 형아맨",
            "kind": "safe",
            "box": [
              49,
              29,
              23,
              64
            ],
            "rule": "이용 가능한 경로와 필요한 도움을 확인해요."
          }
        ]
      }
    },
    "homecoming/choice/stop": {
      "image": "media/question-art/scene-homecoming-choice-stop-review1.webp",
      "cards": {
        "file": "media/question-art/cards-homecoming-stop-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "homecoming/choice/count": {
      "image": "media/scenarios/home-count.webp",
      "cards": {
        "file": "media/question-art/cards-homecoming-count.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "homecoming/quiz/stop": {
      "image": "media/review-v29/mixed-homecoming-stop.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 버스 계단에서 뛰어내리는 친구 / 손잡이를 잡고 천천히 내리는 형아맨",
        "instruction": "버스 계단에서 뛰어내리는 친구, 손잡이를 잡고 천천히 내리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "stop-danger",
            "label": "버스 계단에서 뛰어내리는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "돌아오는 길에도 안전벨트와 승하차 약속을 지켜요."
          },
          {
            "id": "stop-safe",
            "label": "손잡이를 잡고 천천히 내리는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "돌아오는 길에도 안전벨트와 승하차 약속을 지켜요."
          }
        ]
      }
    },
    "farm/choice/feed": {
      "image": "media/scenarios/farm-feed.webp",
      "cards": {
        "file": "media/question-art/cards-farm-feed-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "farm/choice/wash": {
      "image": "media/question-art/scene-farm-choice-wash.webp",
      "cards": {
        "file": "media/question-art/cards-farm-wash.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "farm/quiz/fence": {
      "image": "media/question-art/scene-farm-quiz-fence.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 동물 울타리 안으로 혼자 들어가려는 친구 / 동물 울타리 밖에서 선생님과 기다리는 형아맨",
        "instruction": "동물 울타리 안으로 혼자 들어가려는 친구, 동물 울타리 밖에서 선생님과 기다리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "fence",
            "label": "동물 울타리 안으로 혼자 들어가려는 친구",
            "kind": "danger",
            "box": [
              60,
              29,
              24,
              66
            ],
            "rule": "울타리 밖의 허용된 장소에서 직원 안내를 확인해요."
          },
          {
            "id": "fence-safe",
            "label": "동물 울타리 밖에서 선생님과 기다리는 형아맨",
            "kind": "safe",
            "box": [
              21,
              24,
              18,
              71
            ],
            "rule": "동물 우리에 임의로 들어가지 않고 담당자의 안내를 받아요."
          }
        ]
      }
    },
    "farm/quiz/wash": {
      "image": "media/review-v29/mixed-farm-wash.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 동물을 만진 뒤 손을 안 씻고 먹는 친구 / 비누로 손을 씻는 형아맨",
        "instruction": "동물을 만진 뒤 손을 안 씻고 먹는 친구, 비누로 손을 씻는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "wash-danger",
            "label": "동물을 만진 뒤 손을 안 씻고 먹는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "흐르는 물과 비누로 30초 이상, 손의 여섯 부위를 골고루 씻어요."
          },
          {
            "id": "wash-safe",
            "label": "비누로 손을 씻는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "흐르는 물과 비누로 30초 이상, 손의 여섯 부위를 골고루 씻어요."
          }
        ]
      }
    },
    "water/choice/entry": {
      "image": "media/question-art/scene-water-choice-entry.webp",
      "cards": {
        "file": "media/question-art/cards-water-entry-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "water/choice/slip": {
      "image": "media/scenarios/water-walk-swim.webp",
      "cards": {
        "file": "media/question-art/cards-water-slip.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "water/quiz/alone": {
      "image": "media/question-art/scene-water-quiz-alone.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 혼자 물에 들어가려는 친구 / 수영모를 쓰고 선생님 곁에 앉아 기다리는 친구",
        "instruction": "혼자 물에 들어가려는 친구, 수영모를 쓰고 선생님 곁에 앉아 기다리는 친구 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "alone",
            "label": "혼자 물에 들어가려는 친구",
            "kind": "danger",
            "box": [
              64,
              21,
              27,
              74
            ],
            "rule": "구명조끼가 있어도 허용된 곳에서 인솔자와 함께해요."
          },
          {
            "id": "alone-safe",
            "label": "수영모를 쓰고 선생님 곁에 앉아 기다리는 친구",
            "kind": "safe",
            "box": [
              27,
              24,
              20,
              65
            ],
            "rule": "수영복과 구명조끼를 갖춰도 혼자 먼저 물에 들어가지 않아요. 선생님 안내를 기다려요."
          }
        ]
      }
    },
    "water/quiz/run": {
      "image": "media/review-v29/mixed-water-run.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 젖은 바닥에서 뛰는 친구 / 젖은 곳을 피해 천천히 걷는 형아맨",
        "instruction": "젖은 바닥에서 뛰는 친구, 젖은 곳을 피해 천천히 걷는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "run-danger",
            "label": "젖은 바닥에서 뛰는 친구",
            "kind": "danger",
            "box": [
              5,
              20,
              31,
              75
            ],
            "rule": "젖은 바닥에서 뛰지 않아요."
          },
          {
            "id": "run-safe",
            "label": "젖은 곳을 피해 천천히 걷는 형아맨",
            "kind": "safe",
            "box": [
              49,
              26,
              22,
              69
            ],
            "rule": "젖은 바닥에서 뛰지 않아요."
          }
        ]
      }
    },
    "library/choice/voice": {
      "image": "media/question-art/scene-library-choice-voice.webp",
      "cards": {
        "file": "media/question-art/cards-library-voice-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "library/choice/noise": {
      "image": "media/scenarios/library-noise.webp",
      "cards": {
        "file": "media/question-art/cards-library-noise-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "library/quiz/help": {
      "image": "media/review-v29/mixed-library-help.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 말하지 않고 혼자 관람실 밖으로 가는 친구 / 공연이 힘들다고 선생님께 알리는 형아맨",
        "instruction": "말하지 않고 혼자 관람실 밖으로 가는 친구, 공연이 힘들다고 선생님께 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "help-danger",
            "label": "말하지 않고 혼자 관람실 밖으로 가는 친구",
            "kind": "danger",
            "box": [
              4,
              25,
              27,
              65
            ],
            "rule": "말·AAC·손짓 등 편한 방법으로 알려요."
          },
          {
            "id": "help-safe",
            "label": "공연이 힘들다고 선생님께 알리는 형아맨",
            "kind": "safe",
            "box": [
              64,
              33,
              20,
              58
            ],
            "rule": "말·AAC·손짓 등 편한 방법으로 알려요."
          }
        ]
      }
    },
    "library/quiz/move": {
      "image": "media/question-art/scene-library-quiz-move.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 혼자 관람실 밖으로 나가는 친구 / 선생님 곁에 머물러 이동을 확인하는 형아맨",
        "instruction": "혼자 관람실 밖으로 나가는 친구, 선생님 곁에 머물러 이동을 확인하는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "move",
            "label": "혼자 관람실 밖으로 나가는 친구",
            "kind": "danger",
            "box": [
              60,
              30,
              22,
              64
            ],
            "rule": "이동할 때는 선생님께 알리고 함께 가요."
          },
          {
            "id": "move-safe",
            "label": "선생님 곁에 머물러 이동을 확인하는 형아맨",
            "kind": "safe",
            "box": [
              36,
              28,
              19,
              68
            ],
            "rule": "관람 중 이동하거나 밖으로 나가려면 먼저 선생님께 알려요."
          }
        ]
      }
    },
    "playground/choice/grass": {
      "image": "media/question-art/scene-playground-choice-grass.webp",
      "cards": {
        "file": "media/question-art/cards-playground-grass.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "playground/choice/heat": {
      "image": "media/question-art/scene-playground-choice-heat.webp",
      "cards": {
        "file": "media/question-art/cards-playground-heat-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "playground/quiz/wet": {
      "image": "media/review-v29/mixed-playground-wet.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 물기가 고인 곳으로 뛰는 친구 / 젖은 곳을 피해 천천히 걷는 형아맨",
        "instruction": "물기가 고인 곳으로 뛰는 친구, 젖은 곳을 피해 천천히 걷는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "wet-danger",
            "label": "물기가 고인 곳으로 뛰는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "젖은 곳을 피하고 선생님께 알려요."
          },
          {
            "id": "wet-safe",
            "label": "젖은 곳을 피해 천천히 걷는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "젖은 곳을 피하고 선생님께 알려요."
          }
        ]
      }
    },
    "playground/quiz/grass": {
      "image": "media/question-art/scene-playground-quiz-grass.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 모르는 풀을 만지려는 친구 / 산책로 안에서 친구에게 멈추라고 알리는 형아맨",
        "instruction": "모르는 풀을 만지려는 친구, 산책로 안에서 친구에게 멈추라고 알리는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "grass",
            "label": "모르는 풀을 만지려는 친구",
            "kind": "danger",
            "box": [
              43,
              35,
              37,
              60
            ],
            "rule": "모르는 풀은 만지지 않고 정해진 길로 가요."
          },
          {
            "id": "grass-safe",
            "label": "산책로 안에서 친구에게 멈추라고 알리는 형아맨",
            "kind": "safe",
            "box": [
              31,
              25,
              19,
              67
            ],
            "rule": "풀숲과 돌 틈에 손을 넣지 않고 정해진 길에서 함께 움직여요."
          }
        ]
      }
    },
    "eco-park/choice/snake": {
      "image": "media/question-art/scene-eco-park-choice-snake.webp",
      "cards": {
        "file": "media/question-art/cards-eco-park-snake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "eco-park/choice/bee": {
      "image": "media/review-v29/eco-bee.webp",
      "cards": {
        "file": "media/question-art/cards-eco-park-bee.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "eco-park/quiz/path": {
      "image": "media/review-v29/mixed-eco-park-path.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 탐방로 밖 풀숲으로 들어가는 친구 / 정해진 탐방로에서 함께 걷는 형아맨",
        "instruction": "탐방로 밖 풀숲으로 들어가는 친구, 정해진 탐방로에서 함께 걷는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "path-danger",
            "label": "탐방로 밖 풀숲으로 들어가는 친구",
            "kind": "danger",
            "box": [
              5,
              16,
              32,
              79
            ],
            "rule": "풀숲으로 들어가지 않고 함께 이동해요."
          },
          {
            "id": "path-safe",
            "label": "정해진 탐방로에서 함께 걷는 형아맨",
            "kind": "safe",
            "box": [
              53,
              16,
              25,
              80
            ],
            "rule": "풀숲으로 들어가지 않고 함께 이동해요."
          }
        ]
      }
    },
    "eco-park/quiz/wildlife": {
      "image": "media/question-art/scene-eco-park-quiz-wildlife.webp",
      "find": {
        "prompt": "위험 행동과 안전 행동을 찾아요: 뱀에게 손을 뻗는 친구 / 동물과 거리를 두고 어른 곁에 있는 형아맨",
        "instruction": "뱀에게 손을 뻗는 친구, 동물과 거리를 두고 어른 곁에 있는 형아맨 — 두 행동을 각각 찾아 눌러요.",
        "targets": [
          {
            "id": "wildlife",
            "label": "뱀에게 손을 뻗는 친구",
            "kind": "danger",
            "box": [
              60,
              36,
              30,
              52
            ],
            "rule": "다가가거나 잡지 않고 어른에게 알려요."
          },
          {
            "id": "wildlife-safe",
            "label": "동물과 거리를 두고 어른 곁에 있는 형아맨",
            "kind": "safe",
            "box": [
              2,
              27,
              16,
              70
            ],
            "rule": "벌이나 뱀은 만지거나 쫓지 않아요. 거리를 두고 천천히 물러나 어른에게 알려요."
          }
        ]
      }
    },
    "escape/choice/alarm": {
      "image": "media/review-v29/escape-alarm-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-escape-alarm-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "escape/choice/clear": {
      "image": "media/scenarios/escape-clear-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-escape-clear.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "escape/choice/mobility": {
      "image": "media/scenarios/escape-support-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-escape-mobility.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "escape/choice/blocked": {
      "image": "media/review-v29/escape-blocked-serious.webp",
      "cards": {
        "file": "media/review-v29/cards-escape-blocked-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "escape/choice/call": {
      "image": "media/review-v29/escape-call-fix.webp",
      "find": {
        "prompt": "방 번호, 화재경보, 이동에 도움이 필요한 사람을 찾아요.",
        "instruction": "신고할 때 알려 줄 세 가지 내용을 그림에서 하나씩 눌러요.",
        "targets": [
          {
            "id": "location",
            "label": "방 번호 203",
            "kind": "safe",
            "box": [
              69,
              20,
              9,
              9
            ]
          },
          {
            "id": "situation",
            "label": "빨간 화재경보",
            "kind": "danger",
            "box": [
              81,
              0,
              9,
              10
            ]
          },
          {
            "id": "support",
            "label": "이동에 도움이 필요한 사람",
            "kind": "safe",
            "box": [
              2,
              28,
              31,
              68
            ]
          }
        ]
      }
    },
    "escape/choice/assembly": {
      "image": "media/scenarios/escape-assembly-serious.webp",
      "cards": {
        "file": "media/question-art/cards-escape-assembly.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "sports/choice/sports-fire": {
      "image": "media/scenarios/sports-fire-serious.webp",
      "cards": {
        "file": "media/question-art/cards-sports-sports-fire.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "sports/choice/sports-quake": {
      "image": "media/scenarios/sports-quake-serious.webp",
      "cards": {
        "file": "media/question-art/cards-sports-sports-quake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "cinema/choice/cinema-fire": {
      "image": "media/question-art/scene-cinema-choice-cinema-fire.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-cinema-fire.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "cinema/choice/cinema-smoke": {
      "image": "media/scenarios/cinema-smoke-serious.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-cinema-smoke.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "cinema/choice/cinema-quake": {
      "image": "media/scenarios/cinema-quake.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-cinema-quake.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "cinema/choice/cinema-quake-exit": {
      "image": "media/question-art/cinema-quake-exit.webp",
      "cards": {
        "file": "media/question-art/cards-cinema-cinema-quake-exit.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "museum/choice/museum-fire": {
      "image": "media/scenarios/museum-fire-serious.webp",
      "cards": {
        "file": "media/question-art/cards-museum-museum-fire.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "museum/choice/museum-quake": {
      "image": "media/scenarios/museum-quake-serious.webp",
      "cards": {
        "file": "media/question-art/cards-museum-museum-quake.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "experience/choice/experience-fire": {
      "image": "media/scenarios/experience-fire-serious.webp",
      "cards": {
        "file": "media/question-art/cards-experience-experience-fire.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "experience/choice/experience-quake": {
      "image": "media/scenarios/experience-quake-serious.webp",
      "cards": {
        "file": "media/question-art/cards-experience-experience-quake.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "theme-park/choice/ride-quake": {
      "image": "media/question-art/scene-theme-park-choice-ride-quake.webp",
      "cards": {
        "file": "media/question-art/cards-theme-park-ride-quake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "heritage/choice/heritage-quake": {
      "image": "media/review-v29/heritage-quake-serious.webp",
      "cards": {
        "file": "media/question-art/cards-heritage-heritage-quake-review1.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "heritage/choice/heritage-open": {
      "image": "media/scenarios/heritage-open-serious.webp",
      "cards": {
        "file": "media/question-art/cards-heritage-heritage-open.webp",
        "width": 1536,
        "height": 1024
      }
    },
    "bus/choice/arrival-group": {
      "image": "media/question-art/scene-bus-choice-arrival-group.webp",
      "cards": {
        "file": "media/question-art/cards-bus-arrival-group.webp",
        "width": 1600,
        "height": 800
      }
    }
  },
  "clues": {
    "sports/one": {
      "file": "media/game/prep-sports-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "이용 안내 확인",
      "crop": [
        0,
        10,
        37,
        48
      ]
    },
    "sports/clothes": {
      "file": "media/game/prep-sports-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "놀이 전 준비",
      "crop": [
        30,
        48,
        35,
        50
      ]
    },
    "sports/queue": {
      "file": "media/game/prep-sports-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "차례와 거리",
      "crop": [
        70,
        48,
        29,
        50
      ]
    },
    "cinema/exit": {
      "file": "media/question-art/cards-cinema-alarm.webp",
      "width": 1600,
      "height": 800,
      "panel": 1,
      "label": "출구 먼저 확인"
    },
    "cinema/aisle": {
      "file": "media/question-art/cards-cinema-cinema-quake-exit.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "통로에서는 천천히"
    },
    "cinema/sound": {
      "file": "media/question-art/cards-cinema-noise.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "불편하면 알려요"
    },
    "museum/line": {
      "file": "media/question-art/cards-museum-touch.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "관람선 확인"
    },
    "museum/group": {
      "file": "media/question-art/clue-museum-group.webp",
      "width": 1280,
      "height": 853,
      "label": "일행과 함께"
    },
    "museum/guide": {
      "file": "media/question-art/cards-museum-touch.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "안내 확인"
    },
    "experience/guide": {
      "file": "media/game/prep-experience-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "시작 신호 확인",
      "crop": [
        0,
        10,
        40,
        52
      ]
    },
    "experience/tool": {
      "file": "media/game/prep-experience-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "도구와 보호구",
      "crop": [
        33,
        45,
        30,
        54
      ]
    },
    "experience/food": {
      "file": "media/game/prep-experience-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "먹기 전에 확인",
      "crop": [
        62,
        46,
        37,
        53
      ]
    },
    "theme-park/wait": {
      "file": "media/question-art/clue-theme-park-wait.webp",
      "width": 1280,
      "height": 853,
      "label": "차례 기다리기"
    },
    "theme-park/bar": {
      "file": "media/question-art/cards-theme-park-ride-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "안전장치 확인"
    },
    "theme-park/fence": {
      "file": "media/question-art/cards-theme-park-item.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "울타리 밖에 있어요"
    },
    "park/water": {
      "file": "media/question-art/cards-park-lake-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "물가와 난간"
    },
    "park/path": {
      "file": "media/question-art/scene-park-quiz-grass.webp",
      "label": "정해진 길"
    },
    "park/shade": {
      "file": "media/question-art/clue-park-shade.webp",
      "width": 1280,
      "height": 853,
      "label": "그늘과 휴식"
    },
    "park/grass": {
      "file": "media/question-art/cards-park-grass.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "풀숲과 벌레 주의"
    },
    "park/wildlife": {
      "file": "media/question-art/cards-park-snake-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "뱀·벌은 멀리서"
    },
    "garden/plant": {
      "file": "media/question-art/cards-garden-berry-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "식물과 열매"
    },
    "garden/path": {
      "file": "media/question-art/scene-garden-quiz-path.webp",
      "label": "관찰하는 길"
    },
    "garden/insect": {
      "file": "media/question-art/cards-garden-bee-review3.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "벌레와 불편함"
    },
    "lodging/window": {
      "file": "media/review-v29/clue-lodging-window.webp",
      "width": 1280,
      "height": 853,
      "label": "창문과 침대"
    },
    "lodging/plug": {
      "file": "media/review-v29/clue-lodging-plug.webp",
      "width": 1280,
      "height": 853,
      "label": "전기와 뜨거운 물"
    },
    "lodging/teacher": {
      "file": "media/review-v29/clue-lodging-teacher.webp",
      "width": 1280,
      "height": 853,
      "label": "선생님과 만나는 곳"
    },
    "bus/belt": {
      "file": "media/question-art/scene-bus-quiz-belt-review2.webp",
      "label": "안전벨트와 고정장치"
    },
    "bus/device": {
      "file": "media/question-art/clue-bus-device.webp",
      "width": 1280,
      "height": 853,
      "label": "안전장치 위치"
    },
    "bus/stop": {
      "file": "media/question-art/scene-homecoming-quiz-stop.webp",
      "label": "멈춘 뒤 내리기"
    },
    "rest/food": {
      "file": "media/question-art/clue-rest-food.webp",
      "width": 1280,
      "height": 853,
      "label": "뜨거운 음식"
    },
    "rest/group": {
      "file": "media/question-art/cards-rest-alone.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "약속과 인원 확인"
    },
    "rest/floor": {
      "file": "media/question-art/clue-rest-floor.webp",
      "width": 1280,
      "height": 853,
      "label": "차량과 바닥"
    },
    "night/contact": {
      "file": "media/game/prep-night-v29.webp",
      "label": "도움 요청 연습",
      "width": 1536,
      "height": 1024,
      "crop": [
        0,
        50,
        37,
        49
      ]
    },
    "night/route": {
      "file": "media/game/prep-night-v29.webp",
      "width": 1536,
      "height": 1024,
      "label": "이동 경로 확인",
      "crop": [
        50,
        3,
        46,
        48
      ]
    },
    "night/belongings": {
      "file": "media/game/prep-night-v29.webp",
      "label": "통로 정리",
      "width": 1536,
      "height": 1024,
      "crop": [
        35,
        52,
        35,
        47
      ]
    },
    "escape/adult": {
      "file": "media/review-v29/cards-escape-alarm-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "주변에 알리기"
    },
    "escape/route": {
      "file": "media/review-v29/cards-escape-clear.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "안전한 경로 확인"
    },
    "escape/help": {
      "file": "media/review-v29/cards-escape-mobility.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "이동이 어려울 때"
    },
    "heritage/boundary": {
      "file": "media/question-art/cards-heritage-photo.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "관람 구역 확인"
    },
    "heritage/step": {
      "file": "media/question-art/cards-heritage-threshold-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "돌계단과 문턱"
    },
    "heritage/together": {
      "file": "media/question-art/clue-heritage-together.webp",
      "width": 1280,
      "height": 853,
      "label": "함께 쉬며 이동"
    },
    "homecoming/belt": {
      "file": "media/question-art/cards-homecoming-stop-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "돌아올 때도 안전벨트"
    },
    "homecoming/stop": {
      "file": "media/question-art/scene-homecoming-quiz-stop.webp",
      "label": "완전히 멈춘 뒤 이동"
    },
    "homecoming/count": {
      "file": "media/question-art/cards-homecoming-count.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "함께 인원 확인"
    },
    "farm/rule0": {
      "file": "media/question-art/cards-farm-feed-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "동물에게 다가가기 전"
    },
    "farm/rule1": {
      "file": "media/question-art/cards-farm-feed-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "동물 울타리 지키기"
    },
    "farm/rule2": {
      "file": "media/question-art/scene-farm-quiz-wash.webp",
      "label": "체험 뒤 손 씻기"
    },
    "water/rule0": {
      "file": "media/question-art/cards-water-entry-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "오늘의 준비물"
    },
    "water/rule1": {
      "file": "media/question-art/scene-water-quiz-run.webp",
      "label": "젖은 바닥"
    },
    "water/rule2": {
      "file": "media/question-art/clue-water-rule2.webp",
      "width": 1280,
      "height": 853,
      "label": "물에서는 함께"
    },
    "library/rule0": {
      "file": "media/question-art/cards-library-voice-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "관람할 때 목소리"
    },
    "library/rule1": {
      "file": "media/question-art/scene-library-quiz-help.webp",
      "label": "불편하면 알리기"
    },
    "library/rule2": {
      "file": "media/question-art/cards-library-noise-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "이동 안내 확인"
    },
    "playground/rule0": {
      "file": "media/question-art/scene-playground-quiz-wet.webp",
      "label": "젖은 바닥 피하기"
    },
    "playground/rule1": {
      "file": "media/question-art/cards-playground-grass.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "풀숲에 들어가지 않기"
    },
    "playground/rule2": {
      "file": "media/question-art/cards-playground-heat-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 0,
      "label": "힘들면 쉬기"
    },
    "eco-park/rule0": {
      "file": "media/question-art/scene-eco-park-quiz-path.webp",
      "label": "안내에 따라 이동"
    },
    "eco-park/rule1": {
      "file": "media/question-art/cards-eco-park-snake-review1.webp",
      "width": 1536,
      "height": 1024,
      "panel": 1,
      "label": "뱀과 벌은 멀리서"
    },
    "eco-park/rule2": {
      "file": "media/question-art/scene-eco-park-quiz-path.webp",
      "label": "풀숲 피하기"
    }
  },
  "venues": {
    "eco-park": "media/question-art/venue-eco.webp",
    "homecoming": "media/question-art/venue-homecoming.webp",
    "lodging": "media/review-v29/lodging-venue.webp"
  },
  "dimensions": {
    "media/scenarios/sports-injury-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-sports-injury-fix.webp": [
      1536,
      1024
    ],
    "media/scenarios/sports-tired-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-sports-tired.webp": [
      1536,
      1024
    ],
    "media/scenarios/sports-flip-user.webp": [
      1440,
      1080
    ],
    "media/question-art/scene-sports-quiz-stop.webp": [
      1280,
      853
    ],
    "media/scenarios/cinema-noise-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-cinema-noise.webp": [
      1536,
      1024
    ],
    "media/scenarios/cinema-fire-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-cinema-alarm.webp": [
      1600,
      800
    ],
    "media/question-art/scene-cinema-quiz-aisle.webp": [
      1280,
      853
    ],
    "media/question-art/scene-cinema-quiz-help.webp": [
      1280,
      853
    ],
    "media/scenarios/museum-touch.webp": [
      1200,
      800
    ],
    "media/question-art/cards-museum-touch.webp": [
      1536,
      1024
    ],
    "media/scenarios/museum-lost-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-museum-lost-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/museum-voice.webp": [
      1200,
      800
    ],
    "media/question-art/cards-museum-voice.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-museum-quiz-group.webp": [
      1280,
      853
    ],
    "media/question-art/scene-museum-quiz-touch.webp": [
      1280,
      853
    ],
    "media/question-art/scene-museum-quiz-flash.webp": [
      1280,
      853
    ],
    "media/question-art/scene-museum-quiz-food-review1.webp": [
      1280,
      853
    ],
    "media/scenarios/experience-tool-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-experience-tool.webp": [
      1536,
      1024
    ],
    "media/question-art/experience-unknown.webp": [
      1280,
      853
    ],
    "media/question-art/cards-experience-unknown-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-experience-quiz-material.webp": [
      1280,
      853
    ],
    "media/question-art/scene-experience-quiz-guide.webp": [
      1280,
      853
    ],
    "media/scenarios/theme-item-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-theme-park-item.webp": [
      1536,
      1024
    ],
    "media/scenarios/theme-ride.webp": [
      1200,
      800
    ],
    "media/question-art/cards-theme-park-ride-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/theme-lost-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-theme-park-lost-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-theme-park-quiz-fence.webp": [
      1280,
      853
    ],
    "media/question-art/scene-theme-park-quiz-condition.webp": [
      1280,
      853
    ],
    "media/scenarios/park-lake.webp": [
      1200,
      800
    ],
    "media/question-art/cards-park-lake-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/park-heat-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-park-heat.webp": [
      1536,
      1024
    ],
    "media/scenarios/park-grass-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-park-grass.webp": [
      1536,
      1024
    ],
    "media/scenarios/park-rescue-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-park-drowning-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/park-wildlife-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-park-snake-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-park-quiz-rail.webp": [
      1280,
      853
    ],
    "media/question-art/scene-park-quiz-rest-review1.webp": [
      1280,
      853
    ],
    "media/question-art/scene-park-quiz-grass.webp": [
      1280,
      853
    ],
    "media/question-art/scene-park-quiz-drowning.webp": [
      1280,
      853
    ],
    "media/scenarios/garden-berry.webp": [
      1200,
      800
    ],
    "media/question-art/cards-garden-berry-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/garden-bee-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-garden-bee-review3.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-garden-quiz-fruit.webp": [
      1280,
      853
    ],
    "media/question-art/scene-garden-quiz-path.webp": [
      1280,
      853
    ],
    "media/scenarios/lodging-health-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-lodging-hurt.webp": [
      1536,
      1024
    ],
    "media/question-art/lodging-door.webp": [
      1280,
      853
    ],
    "media/question-art/cards-lodging-door.webp": [
      1536,
      1024
    ],
    "media/scenarios/lodging-night.webp": [
      1200,
      800
    ],
    "media/question-art/cards-lodging-toilet-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/lodging-medicine-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-lodging-medicine.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-lodging-quiz-jump.webp": [
      1280,
      853
    ],
    "media/question-art/scene-lodging-quiz-help.webp": [
      1280,
      853
    ],
    "media/game/bus-stand.webp": [
      1200,
      800
    ],
    "media/question-art/cards-bus-stand-review1.webp": [
      1536,
      1024
    ],
    "media/game/bus-cross.webp": [
      1200,
      800
    ],
    "media/question-art/cards-bus-cross.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-bus-quiz-belt-review2.webp": [
      1280,
      853
    ],
    "media/question-art/scene-bus-quiz-cross.webp": [
      1280,
      853
    ],
    "media/scenarios/rest-toilet.webp": [
      1200,
      800
    ],
    "media/question-art/cards-rest-alone.webp": [
      1536,
      1024
    ],
    "media/scenarios/rest-lost-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-rest-lost-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/rest-friend.webp": [
      1280,
      853
    ],
    "media/question-art/cards-rest-friend-review2.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-rest-quiz-food.webp": [
      1280,
      853
    ],
    "media/question-art/scene-rest-quiz-teacher.webp": [
      1280,
      853
    ],
    "media/question-art/scene-night-choice-toilet.webp": [
      1280,
      853
    ],
    "media/question-art/cards-night-toilet-review1.webp": [
      1600,
      800
    ],
    "media/question-art/scene-night-choice-medicine.webp": [
      1280,
      853
    ],
    "media/question-art/cards-night-medicine.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-night-quiz-night-help.webp": [
      1280,
      853
    ],
    "media/question-art/scene-night-quiz-corridor.webp": [
      1280,
      853
    ],
    "media/question-art/scene-escape-quiz-lift.webp": [
      1280,
      853
    ],
    "media/question-art/scene-escape-quiz-return.webp": [
      1280,
      853
    ],
    "media/scenarios/heritage-threshold.webp": [
      1200,
      800
    ],
    "media/question-art/cards-heritage-threshold-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/heritage-photo.webp": [
      1200,
      800
    ],
    "media/question-art/cards-heritage-photo.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-heritage-quiz-boundary.webp": [
      1280,
      853
    ],
    "media/question-art/scene-heritage-quiz-help.webp": [
      1280,
      853
    ],
    "media/question-art/scene-homecoming-choice-stop-review1.webp": [
      1280,
      853
    ],
    "media/question-art/cards-homecoming-stop-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/home-count.webp": [
      1200,
      800
    ],
    "media/question-art/cards-homecoming-count.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-homecoming-quiz-stop.webp": [
      1280,
      853
    ],
    "media/scenarios/farm-feed.webp": [
      1440,
      810
    ],
    "media/question-art/cards-farm-feed-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-farm-choice-wash.webp": [
      1280,
      853
    ],
    "media/question-art/cards-farm-wash.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-farm-quiz-fence.webp": [
      1280,
      853
    ],
    "media/question-art/scene-farm-quiz-wash.webp": [
      1280,
      853
    ],
    "media/question-art/scene-water-choice-entry.webp": [
      1280,
      853
    ],
    "media/question-art/cards-water-entry-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/water-walk-swim.webp": [
      1440,
      960
    ],
    "media/question-art/cards-water-slip.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-water-quiz-alone.webp": [
      1280,
      853
    ],
    "media/question-art/scene-water-quiz-run.webp": [
      1280,
      853
    ],
    "media/question-art/scene-library-choice-voice.webp": [
      1280,
      853
    ],
    "media/question-art/cards-library-voice-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/library-noise.webp": [
      1440,
      810
    ],
    "media/question-art/cards-library-noise-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-library-quiz-help.webp": [
      1280,
      853
    ],
    "media/question-art/scene-library-quiz-move.webp": [
      1280,
      853
    ],
    "media/question-art/scene-playground-choice-grass.webp": [
      1280,
      853
    ],
    "media/question-art/cards-playground-grass.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-playground-choice-heat.webp": [
      1280,
      853
    ],
    "media/question-art/cards-playground-heat-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-playground-quiz-wet.webp": [
      1280,
      853
    ],
    "media/question-art/scene-playground-quiz-grass.webp": [
      1280,
      853
    ],
    "media/question-art/scene-eco-park-choice-snake.webp": [
      1280,
      853
    ],
    "media/question-art/cards-eco-park-snake-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/eco-bee.webp": [
      1440,
      960
    ],
    "media/question-art/cards-eco-park-bee.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-eco-park-quiz-path.webp": [
      1280,
      853
    ],
    "media/question-art/scene-eco-park-quiz-wildlife.webp": [
      1280,
      853
    ],
    "media/scenarios/escape-alarm-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-escape-alarm-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/escape-clear-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-escape-clear.webp": [
      1536,
      1024
    ],
    "media/scenarios/escape-support-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-escape-mobility.webp": [
      1536,
      1024
    ],
    "media/scenarios/escape-blocked-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-escape-blocked-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/escape-call-fix.webp": [
      1280,
      853
    ],
    "media/scenarios/escape-assembly-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-escape-assembly.webp": [
      1536,
      1024
    ],
    "media/scenarios/sports-fire-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-sports-sports-fire.webp": [
      1536,
      1024
    ],
    "media/scenarios/sports-quake-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-sports-sports-quake-review1.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-cinema-choice-cinema-fire.webp": [
      1280,
      853
    ],
    "media/question-art/cards-cinema-cinema-fire.webp": [
      1536,
      1024
    ],
    "media/scenarios/cinema-smoke-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-cinema-cinema-smoke.webp": [
      1536,
      1024
    ],
    "media/scenarios/cinema-quake.webp": [
      1200,
      800
    ],
    "media/question-art/cards-cinema-cinema-quake.webp": [
      1536,
      1024
    ],
    "media/question-art/cinema-quake-exit.webp": [
      1280,
      853
    ],
    "media/question-art/cards-cinema-cinema-quake-exit.webp": [
      1536,
      1024
    ],
    "media/scenarios/museum-fire-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-museum-museum-fire.webp": [
      1536,
      1024
    ],
    "media/scenarios/museum-quake-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-museum-museum-quake.webp": [
      1536,
      1024
    ],
    "media/scenarios/experience-fire-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-experience-experience-fire.webp": [
      1536,
      1024
    ],
    "media/scenarios/experience-quake-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-experience-experience-quake.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-theme-park-choice-ride-quake.webp": [
      1280,
      853
    ],
    "media/question-art/cards-theme-park-ride-quake-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/heritage-quake-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-heritage-heritage-quake-review1.webp": [
      1536,
      1024
    ],
    "media/scenarios/heritage-open-serious.webp": [
      1200,
      800
    ],
    "media/question-art/cards-heritage-heritage-open.webp": [
      1536,
      1024
    ],
    "media/question-art/scene-bus-choice-arrival-group.webp": [
      1280,
      853
    ],
    "media/question-art/cards-bus-arrival-group.webp": [
      1600,
      800
    ],
    "media/question-art/clue-sports-one.webp": [
      1280,
      853
    ],
    "media/question-art/clue-sports-clothes.webp": [
      1280,
      853
    ],
    "media/question-art/clue-sports-queue.webp": [
      1280,
      853
    ],
    "media/question-art/clue-museum-group.webp": [
      1280,
      853
    ],
    "media/question-art/clue-experience-food.webp": [
      1280,
      853
    ],
    "media/question-art/clue-theme-park-wait.webp": [
      1280,
      853
    ],
    "media/question-art/clue-park-shade.webp": [
      1280,
      853
    ],
    "media/question-art/clue-lodging-window.webp": [
      1280,
      853
    ],
    "media/question-art/clue-lodging-plug.webp": [
      1280,
      853
    ],
    "media/question-art/clue-lodging-teacher.webp": [
      1280,
      853
    ],
    "media/question-art/clue-bus-device.webp": [
      1280,
      853
    ],
    "media/question-art/clue-rest-food.webp": [
      1280,
      853
    ],
    "media/question-art/clue-rest-floor.webp": [
      1280,
      853
    ],
    "media/question-art/clue-heritage-together.webp": [
      1280,
      853
    ],
    "media/question-art/clue-water-rule2.webp": [
      1280,
      853
    ],
    "media/question-art/venue-eco.webp": [
      1280,
      853
    ],
    "media/question-art/venue-homecoming.webp": [
      1280,
      853
    ],
    "media/review-v29/lodging-health-serious.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-lodging-hurt.webp": [
      1536,
      1024
    ],
    "media/review-v29/lodging-door.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-lodging-door.webp": [
      1536,
      1024
    ],
    "media/review-v29/lodging-night.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-lodging-toilet-review1.webp": [
      1536,
      1024
    ],
    "media/review-v29/lodging-medicine-serious.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-lodging-medicine.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-lodging-quiz-jump.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-lodging-quiz-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-night-choice-toilet.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-night-toilet-review1.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-night-choice-medicine.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-night-medicine.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-night-quiz-night-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/scene-night-quiz-corridor.webp": [
      1536,
      1024
    ],
    "media/review-v29/escape-alarm-serious.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-escape-alarm-review1.webp": [
      1536,
      1024
    ],
    "media/review-v29/escape-blocked-serious.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-escape-blocked-review1.webp": [
      1536,
      1024
    ],
    "media/review-v29/escape-call-fix.webp": [
      1536,
      1024
    ],
    "media/review-v29/clue-lodging-window.webp": [
      1536,
      1024
    ],
    "media/review-v29/clue-lodging-plug.webp": [
      1536,
      1024
    ],
    "media/review-v29/clue-lodging-teacher.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-escape-clear.webp": [
      1536,
      1024
    ],
    "media/review-v29/cards-escape-mobility.webp": [
      1536,
      1024
    ],
    "media/review-v29/lodging-find-v25.webp": [
      1536,
      1024
    ],
    "media/review-v29/heritage-quake-serious.webp": [
      1536,
      1024
    ],
    "media/review-v29/eco-bee.webp": [
      1536,
      1024
    ],
    "media/review-v29/lodging-venue.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-sports-flip.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-sports-stop.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-cinema-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-museum-touch.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-museum-food.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-experience-guide.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-theme-park-condition.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-park-rest.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-park-grass.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-garden-path.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-lodging-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-bus-belt.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-rest-food.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-rest-teacher.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-night-night-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-night-corridor.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-escape-lift.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-heritage-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-homecoming-stop.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-farm-wash.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-water-run.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-library-help.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-playground-wet.webp": [
      1536,
      1024
    ],
    "media/review-v29/mixed-eco-park-path.webp": [
      1536,
      1024
    ]
  }
};
const {entries,clues,venues,dimensions}=data;
function key(place,q){return place+'/'+(typeof q.answer==='boolean'?'quiz':'choice')+'/'+q.id.replace(/^surprise-/,'');}
const api={entries,clues,venues,dimensions,key,resolve:(place,q)=>entries[key(place,q)]?.image,card:(place,q)=>entries[key(place,q)]?.cards,find:(place,q)=>entries[key(place,q)]?.find,clue:(place,id)=>clues[place+'/'+id]};root.SafetyQuestionArt=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
