/* 검수된 문항·선택지·단서 그림. docs/그림문항검수_v2.8.json 참조. */
(function(root){'use strict';
const entries={
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
    "image": "media/scenarios/sports-flip-user.webp",
    "find": {
      "prompt": "공중제비를 도는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
      "targets": [
        {
          "id": "flip",
          "label": "공중제비를 도는 형아맨",
          "kind": "danger",
          "box": [
            19,
            8,
            47,
            62
          ]
        }
      ]
    }
  },
  "sports/quiz/stop": {
    "image": "media/question-art/scene-sports-quiz-stop.webp",
    "find": {
      "prompt": "아파서 놀이를 멈추고 도움을 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "stop",
          "label": "아파서 놀이를 멈추고 도움을 알리는 형아맨",
          "kind": "safe",
          "box": [
            52,
            24,
            28,
            69
          ]
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
      "prompt": "어두운 계단에서 뛰는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "cinema/quiz/help": {
    "image": "media/question-art/scene-cinema-quiz-help.webp",
    "find": {
      "prompt": "소리가 힘들다고 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "help",
          "label": "소리가 힘들다고 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            48,
            17,
            24,
            78
          ]
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
      "prompt": "혼자 다른 전시실로 가는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "museum/quiz/touch": {
    "image": "media/question-art/scene-museum-quiz-touch.webp",
    "find": {
      "prompt": "전시물 안내를 확인하는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "touch",
          "label": "전시물 안내를 확인하는 형아맨",
          "kind": "safe",
          "box": [
            45,
            20,
            30,
            73
          ]
        }
      ]
    }
  },
  "museum/quiz/flash": {
    "image": "media/question-art/scene-museum-quiz-flash.webp",
    "find": {
      "prompt": "플래시를 켜고 사진 찍는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "museum/quiz/food": {
    "image": "media/question-art/scene-museum-quiz-food-review1.webp",
    "find": {
      "prompt": "휴게 공간에서 간식을 먹는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "food",
          "label": "휴게 공간에서 간식을 먹는 형아맨",
          "kind": "safe",
          "box": [
            50,
            27,
            19,
            69
          ]
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
      "prompt": "체험 재료를 입에 가져가는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "experience/quiz/guide": {
    "image": "media/question-art/scene-experience-quiz-guide.webp",
    "find": {
      "prompt": "도구 안내를 확인하는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "guide",
          "label": "도구 안내를 확인하는 형아맨",
          "kind": "safe",
          "box": [
            59,
            14,
            20,
            81
          ]
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
      "prompt": "울타리를 넘으려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "theme-park/quiz/condition": {
    "image": "media/question-art/scene-theme-park-quiz-condition.webp",
    "find": {
      "prompt": "직원과 이용 조건을 확인하는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "condition",
          "label": "직원과 이용 조건을 확인하는 형아맨",
          "kind": "safe",
          "box": [
            49,
            24,
            25,
            72
          ]
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
      "prompt": "난간을 넘으려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "park/quiz/rest": {
    "image": "media/question-art/scene-park-quiz-rest-review1.webp",
    "find": {
      "prompt": "쉬고 싶다고 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "rest",
          "label": "쉬고 싶다고 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            53,
            31,
            25,
            65
          ]
        }
      ]
    }
  },
  "park/quiz/grass": {
    "image": "media/question-art/scene-park-quiz-grass.webp",
    "find": {
      "prompt": "풀숲을 피해 산책로를 걷는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "grass",
          "label": "풀숲을 피해 산책로를 걷는 형아맨",
          "kind": "safe",
          "box": [
            52,
            28,
            22,
            63
          ]
        }
      ]
    }
  },
  "park/quiz/drowning": {
    "image": "media/question-art/scene-park-quiz-drowning.webp",
    "find": {
      "prompt": "물에 뛰어들려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
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
      "prompt": "모르는 열매를 입에 가져가는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "garden/quiz/path": {
    "image": "media/question-art/scene-garden-quiz-path.webp",
    "find": {
      "prompt": "관찰로에서 함께 걷는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "path",
          "label": "관찰로에서 함께 걷는 형아맨",
          "kind": "safe",
          "box": [
            55,
            26,
            21,
            64
          ]
        }
      ]
    }
  },
  "lodging/choice/hurt": {
    "image": "media/scenarios/lodging-health-serious.webp",
    "cards": {
      "file": "media/question-art/cards-lodging-hurt.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "lodging/choice/door": {
    "image": "media/question-art/lodging-door.webp",
    "cards": {
      "file": "media/question-art/cards-lodging-door.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "lodging/choice/toilet": {
    "image": "media/scenarios/lodging-night.webp",
    "cards": {
      "file": "media/question-art/cards-lodging-toilet-review1.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "lodging/choice/medicine": {
    "image": "media/scenarios/lodging-medicine-serious.webp",
    "cards": {
      "file": "media/question-art/cards-lodging-medicine.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "lodging/quiz/jump": {
    "image": "media/question-art/scene-lodging-quiz-jump.webp",
    "find": {
      "prompt": "침대 위에서 뛰는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "lodging/quiz/help": {
    "image": "media/question-art/scene-lodging-quiz-help.webp",
    "find": {
      "prompt": "아프다고 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "help",
          "label": "아프다고 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            49,
            12,
            23,
            82
          ]
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
    "image": "media/question-art/scene-bus-quiz-belt-review2.webp",
    "find": {
      "prompt": "안전벨트를 매고 앉은 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "belt",
          "label": "안전벨트를 매고 앉은 형아맨",
          "kind": "safe",
          "box": [
            53,
            18,
            25,
            79
          ]
        }
      ]
    }
  },
  "bus/quiz/cross": {
    "image": "media/question-art/scene-bus-quiz-cross.webp",
    "find": {
      "prompt": "버스 앞으로 길을 건너려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
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
    "image": "media/question-art/scene-rest-quiz-food.webp",
    "find": {
      "prompt": "뜨거운 음식을 들고 뛰는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
      "targets": [
        {
          "id": "food",
          "label": "뜨거운 음식을 들고 뛰는 친구",
          "kind": "danger",
          "box": [
            58,
            29,
            25,
            64
          ]
        }
      ]
    }
  },
  "rest/quiz/teacher": {
    "image": "media/question-art/scene-rest-quiz-teacher.webp",
    "find": {
      "prompt": "이동 전에 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "teacher",
          "label": "이동 전에 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            49,
            28,
            26,
            67
          ]
        }
      ]
    }
  },
  "night/choice/toilet": {
    "image": "media/question-art/scene-night-choice-toilet.webp",
    "cards": {
      "file": "media/question-art/cards-night-toilet-review1.webp",
      "width": 1600,
      "height": 800
    }
  },
  "night/choice/medicine": {
    "image": "media/question-art/scene-night-choice-medicine.webp",
    "cards": {
      "file": "media/question-art/cards-night-medicine.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "night/quiz/night-help": {
    "image": "media/question-art/scene-night-quiz-night-help.webp",
    "find": {
      "prompt": "밤에 아프다고 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "night-help",
          "label": "밤에 아프다고 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            49,
            13,
            23,
            82
          ]
        }
      ]
    }
  },
  "night/quiz/corridor": {
    "image": "media/question-art/scene-night-quiz-corridor.webp",
    "find": {
      "prompt": "통로 옆 보관대에 둔 파란 가방을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "corridor",
          "label": "통로 옆 보관대에 둔 파란 가방",
          "kind": "safe",
          "box": [
            69,
            51,
            14,
            26
          ]
        }
      ]
    }
  },
  "escape/quiz/lift": {
    "image": "media/question-art/scene-escape-quiz-lift.webp",
    "find": {
      "prompt": "화재 때 타면 안 되는 일반 엘리베이터를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
      "targets": [
        {
          "id": "lift",
          "label": "화재 때 타면 안 되는 일반 엘리베이터",
          "kind": "danger",
          "box": [
            69,
            14,
            28,
            77
          ]
        }
      ]
    }
  },
  "escape/quiz/return": {
    "image": "media/question-art/scene-escape-quiz-return.webp",
    "find": {
      "prompt": "가방을 찾으러 건물에 다시 들어가려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
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
      "prompt": "출입 금지 줄을 넘으려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "heritage/quiz/help": {
    "image": "media/question-art/scene-heritage-quiz-help.webp",
    "find": {
      "prompt": "문턱 앞에서 도움을 요청하는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "help",
          "label": "문턱 앞에서 도움을 요청하는 형아맨",
          "kind": "safe",
          "box": [
            49,
            27,
            24,
            65
          ]
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
    "image": "media/question-art/scene-homecoming-quiz-stop.webp",
    "find": {
      "prompt": "버스가 멈춘 뒤 천천히 내리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "stop",
          "label": "버스가 멈춘 뒤 천천히 내리는 형아맨",
          "kind": "safe",
          "box": [
            57,
            23,
            25,
            65
          ]
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
      "prompt": "동물 울타리 안으로 혼자 들어가려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "farm/quiz/wash": {
    "image": "media/question-art/scene-farm-quiz-wash.webp",
    "find": {
      "prompt": "비누로 손을 씻는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "wash",
          "label": "비누로 손을 씻는 형아맨",
          "kind": "safe",
          "box": [
            57,
            19,
            24,
            76
          ]
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
      "prompt": "혼자 물에 들어가려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "water/quiz/run": {
    "image": "media/question-art/scene-water-quiz-run.webp",
    "find": {
      "prompt": "수영장 바닥을 천천히 걷는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "run",
          "label": "수영장 바닥을 천천히 걷는 형아맨",
          "kind": "safe",
          "box": [
            50,
            15,
            25,
            81
          ]
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
    "image": "media/question-art/scene-library-quiz-help.webp",
    "find": {
      "prompt": "공연이 힘들다고 선생님께 알리는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "help",
          "label": "공연이 힘들다고 선생님께 알리는 형아맨",
          "kind": "safe",
          "box": [
            52,
            20,
            20,
            72
          ]
        }
      ]
    }
  },
  "library/quiz/move": {
    "image": "media/question-art/scene-library-quiz-move.webp",
    "find": {
      "prompt": "혼자 관람실 밖으로 나가는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
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
    "image": "media/question-art/scene-playground-quiz-wet.webp",
    "find": {
      "prompt": "물기가 고인 바닥을 피해 걷는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "wet",
          "label": "물기가 고인 바닥을 피해 걷는 형아맨",
          "kind": "safe",
          "box": [
            54,
            22,
            24,
            66
          ]
        }
      ]
    }
  },
  "playground/quiz/grass": {
    "image": "media/question-art/scene-playground-quiz-grass.webp",
    "find": {
      "prompt": "모르는 풀을 만지려는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
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
    "image": "media/scenarios/eco-bee.webp",
    "cards": {
      "file": "media/question-art/cards-eco-park-bee.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "eco-park/quiz/path": {
    "image": "media/question-art/scene-eco-park-quiz-path.webp",
    "find": {
      "prompt": "탐방로에서 함께 걷는 형아맨을 찾아 눌러요.",
      "instruction": "그림 속 설명한 안전 행동이나 대상을 찾아요.",
      "targets": [
        {
          "id": "path",
          "label": "탐방로에서 함께 걷는 형아맨",
          "kind": "safe",
          "box": [
            53,
            22,
            24,
            71
          ]
        }
      ]
    }
  },
  "eco-park/quiz/wildlife": {
    "image": "media/question-art/scene-eco-park-quiz-wildlife.webp",
    "find": {
      "prompt": "뱀에게 손을 뻗는 친구를 찾아 눌러요.",
      "instruction": "그림 속 위험한 행동을 하는 사람이나 대상을 찾아요.",
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
          ]
        }
      ]
    }
  },
  "escape/choice/alarm": {
    "image": "media/scenarios/escape-alarm-serious.webp",
    "cards": {
      "file": "media/question-art/cards-escape-alarm-review1.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "escape/choice/clear": {
    "image": "media/scenarios/escape-clear-serious.webp",
    "cards": {
      "file": "media/question-art/cards-escape-clear.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "escape/choice/mobility": {
    "image": "media/scenarios/escape-support-serious.webp",
    "cards": {
      "file": "media/question-art/cards-escape-mobility.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "escape/choice/blocked": {
    "image": "media/scenarios/escape-blocked-serious.webp",
    "cards": {
      "file": "media/question-art/cards-escape-blocked-review1.webp",
      "width": 1536,
      "height": 1024
    }
  },
  "escape/choice/call": {
    "image": "media/question-art/escape-call-fix.webp",
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
    "image": "media/scenarios/heritage-quake-serious.webp",
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
};
const clues={
  "sports/one": {
    "file": "media/question-art/clue-sports-one.webp",
    "width": 1280,
    "height": 853,
    "label": "이용 안내 확인"
  },
  "sports/clothes": {
    "file": "media/question-art/clue-sports-clothes.webp",
    "width": 1280,
    "height": 853,
    "label": "놀이 전 준비"
  },
  "sports/queue": {
    "file": "media/question-art/clue-sports-queue.webp",
    "width": 1280,
    "height": 853,
    "label": "차례와 거리"
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
    "file": "media/question-art/cards-experience-unknown-review1.webp",
    "width": 1536,
    "height": 1024,
    "panel": 0,
    "label": "시작 신호 확인"
  },
  "experience/tool": {
    "file": "media/question-art/cards-experience-tool.webp",
    "width": 1536,
    "height": 1024,
    "panel": 1,
    "label": "도구와 보호구"
  },
  "experience/food": {
    "file": "media/question-art/clue-experience-food.webp",
    "width": 1280,
    "height": 853,
    "label": "먹기 전에 확인"
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
    "file": "media/question-art/clue-lodging-window.webp",
    "width": 1280,
    "height": 853,
    "label": "창문과 침대"
  },
  "lodging/plug": {
    "file": "media/question-art/clue-lodging-plug.webp",
    "width": 1280,
    "height": 853,
    "label": "전기와 뜨거운 물"
  },
  "lodging/teacher": {
    "file": "media/question-art/clue-lodging-teacher.webp",
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
    "file": "media/question-art/scene-night-quiz-night-help.webp",
    "label": "도움 요청 연습"
  },
  "night/route": {
    "file": "media/question-art/cards-night-toilet-review1.webp",
    "width": 1600,
    "height": 800,
    "panel": 1,
    "label": "이동 경로 확인"
  },
  "night/belongings": {
    "file": "media/question-art/scene-night-quiz-corridor.webp",
    "label": "통로 정리"
  },
  "escape/adult": {
    "file": "media/question-art/cards-escape-alarm-review1.webp",
    "width": 1536,
    "height": 1024,
    "panel": 1,
    "label": "주변에 알리기"
  },
  "escape/route": {
    "file": "media/question-art/cards-escape-clear.webp",
    "width": 1536,
    "height": 1024,
    "panel": 0,
    "label": "안전한 경로 확인"
  },
  "escape/help": {
    "file": "media/question-art/cards-escape-mobility.webp",
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
};
const venues={"eco-park":"media/question-art/venue-eco.webp","homecoming":"media/question-art/venue-homecoming.webp"};
function key(place,q){return place+'/'+(typeof q.answer==='boolean'?'quiz':'choice')+'/'+q.id.replace(/^surprise-/,'');}
const dimensions={"media/scenarios/sports-injury-serious.webp":[1200,800],"media/question-art/cards-sports-injury-fix.webp":[1536,1024],"media/scenarios/sports-tired-serious.webp":[1200,800],"media/question-art/cards-sports-tired.webp":[1536,1024],"media/scenarios/sports-flip-user.webp":[1440,1080],"media/question-art/scene-sports-quiz-stop.webp":[1280,853],"media/scenarios/cinema-noise-serious.webp":[1200,800],"media/question-art/cards-cinema-noise.webp":[1536,1024],"media/scenarios/cinema-fire-serious.webp":[1200,800],"media/question-art/cards-cinema-alarm.webp":[1600,800],"media/question-art/scene-cinema-quiz-aisle.webp":[1280,853],"media/question-art/scene-cinema-quiz-help.webp":[1280,853],"media/scenarios/museum-touch.webp":[1200,800],"media/question-art/cards-museum-touch.webp":[1536,1024],"media/scenarios/museum-lost-serious.webp":[1200,800],"media/question-art/cards-museum-lost-review1.webp":[1536,1024],"media/scenarios/museum-voice.webp":[1200,800],"media/question-art/cards-museum-voice.webp":[1536,1024],"media/question-art/scene-museum-quiz-group.webp":[1280,853],"media/question-art/scene-museum-quiz-touch.webp":[1280,853],"media/question-art/scene-museum-quiz-flash.webp":[1280,853],"media/question-art/scene-museum-quiz-food-review1.webp":[1280,853],"media/scenarios/experience-tool-serious.webp":[1200,800],"media/question-art/cards-experience-tool.webp":[1536,1024],"media/question-art/experience-unknown.webp":[1280,853],"media/question-art/cards-experience-unknown-review1.webp":[1536,1024],"media/question-art/scene-experience-quiz-material.webp":[1280,853],"media/question-art/scene-experience-quiz-guide.webp":[1280,853],"media/scenarios/theme-item-serious.webp":[1200,800],"media/question-art/cards-theme-park-item.webp":[1536,1024],"media/scenarios/theme-ride.webp":[1200,800],"media/question-art/cards-theme-park-ride-review1.webp":[1536,1024],"media/scenarios/theme-lost-serious.webp":[1200,800],"media/question-art/cards-theme-park-lost-review1.webp":[1536,1024],"media/question-art/scene-theme-park-quiz-fence.webp":[1280,853],"media/question-art/scene-theme-park-quiz-condition.webp":[1280,853],"media/scenarios/park-lake.webp":[1200,800],"media/question-art/cards-park-lake-review1.webp":[1536,1024],"media/scenarios/park-heat-serious.webp":[1200,800],"media/question-art/cards-park-heat.webp":[1536,1024],"media/scenarios/park-grass-serious.webp":[1200,800],"media/question-art/cards-park-grass.webp":[1536,1024],"media/scenarios/park-rescue-serious.webp":[1200,800],"media/question-art/cards-park-drowning-review1.webp":[1536,1024],"media/scenarios/park-wildlife-serious.webp":[1200,800],"media/question-art/cards-park-snake-review1.webp":[1536,1024],"media/question-art/scene-park-quiz-rail.webp":[1280,853],"media/question-art/scene-park-quiz-rest-review1.webp":[1280,853],"media/question-art/scene-park-quiz-grass.webp":[1280,853],"media/question-art/scene-park-quiz-drowning.webp":[1280,853],"media/scenarios/garden-berry.webp":[1200,800],"media/question-art/cards-garden-berry-review1.webp":[1536,1024],"media/scenarios/garden-bee-serious.webp":[1200,800],"media/question-art/cards-garden-bee-review3.webp":[1536,1024],"media/question-art/scene-garden-quiz-fruit.webp":[1280,853],"media/question-art/scene-garden-quiz-path.webp":[1280,853],"media/scenarios/lodging-health-serious.webp":[1200,800],"media/question-art/cards-lodging-hurt.webp":[1536,1024],"media/question-art/lodging-door.webp":[1280,853],"media/question-art/cards-lodging-door.webp":[1536,1024],"media/scenarios/lodging-night.webp":[1200,800],"media/question-art/cards-lodging-toilet-review1.webp":[1536,1024],"media/scenarios/lodging-medicine-serious.webp":[1200,800],"media/question-art/cards-lodging-medicine.webp":[1536,1024],"media/question-art/scene-lodging-quiz-jump.webp":[1280,853],"media/question-art/scene-lodging-quiz-help.webp":[1280,853],"media/game/bus-stand.webp":[1200,800],"media/question-art/cards-bus-stand-review1.webp":[1536,1024],"media/game/bus-cross.webp":[1200,800],"media/question-art/cards-bus-cross.webp":[1536,1024],"media/question-art/scene-bus-quiz-belt-review2.webp":[1280,853],"media/question-art/scene-bus-quiz-cross.webp":[1280,853],"media/scenarios/rest-toilet.webp":[1200,800],"media/question-art/cards-rest-alone.webp":[1536,1024],"media/scenarios/rest-lost-serious.webp":[1200,800],"media/question-art/cards-rest-lost-review1.webp":[1536,1024],"media/question-art/rest-friend.webp":[1280,853],"media/question-art/cards-rest-friend-review2.webp":[1536,1024],"media/question-art/scene-rest-quiz-food.webp":[1280,853],"media/question-art/scene-rest-quiz-teacher.webp":[1280,853],"media/question-art/scene-night-choice-toilet.webp":[1280,853],"media/question-art/cards-night-toilet-review1.webp":[1600,800],"media/question-art/scene-night-choice-medicine.webp":[1280,853],"media/question-art/cards-night-medicine.webp":[1536,1024],"media/question-art/scene-night-quiz-night-help.webp":[1280,853],"media/question-art/scene-night-quiz-corridor.webp":[1280,853],"media/question-art/scene-escape-quiz-lift.webp":[1280,853],"media/question-art/scene-escape-quiz-return.webp":[1280,853],"media/scenarios/heritage-threshold.webp":[1200,800],"media/question-art/cards-heritage-threshold-review1.webp":[1536,1024],"media/scenarios/heritage-photo.webp":[1200,800],"media/question-art/cards-heritage-photo.webp":[1536,1024],"media/question-art/scene-heritage-quiz-boundary.webp":[1280,853],"media/question-art/scene-heritage-quiz-help.webp":[1280,853],"media/question-art/scene-homecoming-choice-stop-review1.webp":[1280,853],"media/question-art/cards-homecoming-stop-review1.webp":[1536,1024],"media/scenarios/home-count.webp":[1200,800],"media/question-art/cards-homecoming-count.webp":[1536,1024],"media/question-art/scene-homecoming-quiz-stop.webp":[1280,853],"media/scenarios/farm-feed.webp":[1440,810],"media/question-art/cards-farm-feed-review1.webp":[1536,1024],"media/question-art/scene-farm-choice-wash.webp":[1280,853],"media/question-art/cards-farm-wash.webp":[1536,1024],"media/question-art/scene-farm-quiz-fence.webp":[1280,853],"media/question-art/scene-farm-quiz-wash.webp":[1280,853],"media/question-art/scene-water-choice-entry.webp":[1280,853],"media/question-art/cards-water-entry-review1.webp":[1536,1024],"media/scenarios/water-walk-swim.webp":[1440,960],"media/question-art/cards-water-slip.webp":[1536,1024],"media/question-art/scene-water-quiz-alone.webp":[1280,853],"media/question-art/scene-water-quiz-run.webp":[1280,853],"media/question-art/scene-library-choice-voice.webp":[1280,853],"media/question-art/cards-library-voice-review1.webp":[1536,1024],"media/scenarios/library-noise.webp":[1440,810],"media/question-art/cards-library-noise-review1.webp":[1536,1024],"media/question-art/scene-library-quiz-help.webp":[1280,853],"media/question-art/scene-library-quiz-move.webp":[1280,853],"media/question-art/scene-playground-choice-grass.webp":[1280,853],"media/question-art/cards-playground-grass.webp":[1536,1024],"media/question-art/scene-playground-choice-heat.webp":[1280,853],"media/question-art/cards-playground-heat-review1.webp":[1536,1024],"media/question-art/scene-playground-quiz-wet.webp":[1280,853],"media/question-art/scene-playground-quiz-grass.webp":[1280,853],"media/question-art/scene-eco-park-choice-snake.webp":[1280,853],"media/question-art/cards-eco-park-snake-review1.webp":[1536,1024],"media/scenarios/eco-bee.webp":[1440,960],"media/question-art/cards-eco-park-bee.webp":[1536,1024],"media/question-art/scene-eco-park-quiz-path.webp":[1280,853],"media/question-art/scene-eco-park-quiz-wildlife.webp":[1280,853],"media/scenarios/escape-alarm-serious.webp":[1200,800],"media/question-art/cards-escape-alarm-review1.webp":[1536,1024],"media/scenarios/escape-clear-serious.webp":[1200,800],"media/question-art/cards-escape-clear.webp":[1536,1024],"media/scenarios/escape-support-serious.webp":[1200,800],"media/question-art/cards-escape-mobility.webp":[1536,1024],"media/scenarios/escape-blocked-serious.webp":[1200,800],"media/question-art/cards-escape-blocked-review1.webp":[1536,1024],"media/question-art/escape-call-fix.webp":[1280,853],"media/scenarios/escape-assembly-serious.webp":[1200,800],"media/question-art/cards-escape-assembly.webp":[1536,1024],"media/scenarios/sports-fire-serious.webp":[1200,800],"media/question-art/cards-sports-sports-fire.webp":[1536,1024],"media/scenarios/sports-quake-serious.webp":[1200,800],"media/question-art/cards-sports-sports-quake-review1.webp":[1536,1024],"media/question-art/scene-cinema-choice-cinema-fire.webp":[1280,853],"media/question-art/cards-cinema-cinema-fire.webp":[1536,1024],"media/scenarios/cinema-smoke-serious.webp":[1200,800],"media/question-art/cards-cinema-cinema-smoke.webp":[1536,1024],"media/scenarios/cinema-quake.webp":[1200,800],"media/question-art/cards-cinema-cinema-quake.webp":[1536,1024],"media/question-art/cinema-quake-exit.webp":[1280,853],"media/question-art/cards-cinema-cinema-quake-exit.webp":[1536,1024],"media/scenarios/museum-fire-serious.webp":[1200,800],"media/question-art/cards-museum-museum-fire.webp":[1536,1024],"media/scenarios/museum-quake-serious.webp":[1200,800],"media/question-art/cards-museum-museum-quake.webp":[1536,1024],"media/scenarios/experience-fire-serious.webp":[1200,800],"media/question-art/cards-experience-experience-fire.webp":[1536,1024],"media/scenarios/experience-quake-serious.webp":[1200,800],"media/question-art/cards-experience-experience-quake.webp":[1536,1024],"media/question-art/scene-theme-park-choice-ride-quake.webp":[1280,853],"media/question-art/cards-theme-park-ride-quake-review1.webp":[1536,1024],"media/scenarios/heritage-quake-serious.webp":[1200,800],"media/question-art/cards-heritage-heritage-quake-review1.webp":[1536,1024],"media/scenarios/heritage-open-serious.webp":[1200,800],"media/question-art/cards-heritage-heritage-open.webp":[1536,1024],"media/question-art/scene-bus-choice-arrival-group.webp":[1280,853],"media/question-art/cards-bus-arrival-group.webp":[1600,800],"media/question-art/clue-sports-one.webp":[1280,853],"media/question-art/clue-sports-clothes.webp":[1280,853],"media/question-art/clue-sports-queue.webp":[1280,853],"media/question-art/clue-museum-group.webp":[1280,853],"media/question-art/clue-experience-food.webp":[1280,853],"media/question-art/clue-theme-park-wait.webp":[1280,853],"media/question-art/clue-park-shade.webp":[1280,853],"media/question-art/clue-lodging-window.webp":[1280,853],"media/question-art/clue-lodging-plug.webp":[1280,853],"media/question-art/clue-lodging-teacher.webp":[1280,853],"media/question-art/clue-bus-device.webp":[1280,853],"media/question-art/clue-rest-food.webp":[1280,853],"media/question-art/clue-rest-floor.webp":[1280,853],"media/question-art/clue-heritage-together.webp":[1280,853],"media/question-art/clue-water-rule2.webp":[1280,853],"media/question-art/venue-eco.webp":[1280,853],"media/question-art/venue-homecoming.webp":[1280,853]};
const api={entries,clues,venues,dimensions,key,resolve:(place,q)=>entries[key(place,q)]?.image,card:(place,q)=>entries[key(place,q)]?.cards,find:(place,q)=>entries[key(place,q)]?.find,clue:(place,id)=>clues[place+'/'+id]};
root.SafetyQuestionArt=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
