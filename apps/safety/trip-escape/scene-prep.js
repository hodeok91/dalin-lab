/* 한 장면 속 안전 행동 세 곳과 위험 행동 두 곳을 모두 찾습니다. */
(function(root){'use strict';
const specs={
  "sports": {
    "image": "media/game/prep-sports-v29.webp",
    "title": "놀이 전, 안전 행동과 위험 행동을 찾아요",
    "targets": [
      {
        "id": "one",
        "label": "안내판을 보며 설명을 듣는 형아맨",
        "box": [
          3,
          20,
          12,
          40
        ],
        "kind": "safe",
        "rule": "안내를 먼저 듣고 오늘의 이용 약속을 확인해요."
      },
      {
        "id": "clothes",
        "label": "가방을 보관함에 넣는 친구",
        "box": [
          39,
          52,
          19,
          43
        ],
        "kind": "safe",
        "rule": "가방과 작은 물건을 보관해 걸림을 막아요."
      },
      {
        "id": "queue",
        "label": "줄 뒤에서 차례를 기다리는 노란 옷 친구",
        "box": [
          79,
          53,
          14,
          42
        ],
        "kind": "safe",
        "rule": "앞사람이 끝날 때까지 선 밖에서 차례를 기다려요."
      },
      {
        "id": "push",
        "label": "트램펄린에서 친구를 미는 아이",
        "kind": "danger",
        "box": [
          41,
          18,
          21,
          31
        ],
        "rule": "친구를 밀거나 같은 칸에서 부딪치며 뛰면 다칠 수 있어요. 한 칸에 한 명씩 이용해요."
      },
      {
        "id": "flip",
        "label": "공중제비를 도는 초록 옷 친구",
        "kind": "danger",
        "box": [
          79,
          16,
          17,
          29
        ],
        "rule": "공중제비나 거꾸로 도는 동작은 머리와 목을 다칠 수 있어요. 안내받은 기본 점프만 해요."
      }
    ]
  },
  "experience": {
    "image": "media/game/prep-experience-v29.webp",
    "title": "체험실의 안전 행동과 위험 행동을 찾아요",
    "targets": [
      {
        "id": "guide",
        "label": "손을 들어 선생님께 물어보는 형아맨",
        "box": [
          22,
          20,
          18,
          32
        ],
        "kind": "safe",
        "rule": "모르는 활동은 선생님께 먼저 물어봐요."
      },
      {
        "id": "tool",
        "label": "보호 안경을 쓰고 블록을 만드는 친구",
        "box": [
          37,
          47,
          23,
          43
        ],
        "kind": "safe",
        "rule": "보호 안경을 쓰고 안내받은 재료로 만들어요."
      },
      {
        "id": "food",
        "label": "재료를 입에 넣지 않고 쟁반에 정리하는 노란 옷 친구",
        "box": [
          68,
          48,
          24,
          43
        ],
        "kind": "safe",
        "rule": "재료를 입에 넣지 않고 쟁반에 정리해요."
      },
      {
        "id": "mouth",
        "label": "작은 재료를 입에 가져가는 친구",
        "kind": "danger",
        "box": [
          41,
          12,
          18,
          29
        ],
        "rule": "작은 만들기 재료를 입에 넣으면 목에 걸릴 수 있어요. 재료는 쟁반에 두어요."
      },
      {
        "id": "hot",
        "label": "뜨거운 글루건으로 손을 뻗는 친구",
        "kind": "danger",
        "box": [
          64,
          13,
          18,
          30
        ],
        "rule": "뜨거운 글루건은 손을 데일 수 있어요. 직접 만지지 않고 선생님께 부탁해요."
      }
    ]
  },
  "night": {
    "image": "media/game/prep-night-v29.webp",
    "title": "숙소의 안전 행동과 위험 행동을 찾아요",
    "targets": [
      {
        "id": "contact",
        "label": "그림카드로 선생님께 도움을 요청하는 형아맨",
        "box": [
          3,
          55,
          16,
          40
        ],
        "kind": "safe",
        "rule": "불편하거나 도움이 필요하면 담당 선생님께 알려요."
      },
      {
        "id": "route",
        "label": "선생님과 함께 이동 안내도를 확인하는 친구",
        "box": [
          65,
          10,
          17,
          38
        ],
        "kind": "safe",
        "rule": "선생님과 이동 경로를 미리 확인해요."
      },
      {
        "id": "belongings",
        "label": "가방을 선반에 넣어 통로를 비우는 친구",
        "box": [
          36,
          53,
          19,
          40
        ],
        "kind": "safe",
        "rule": "가방을 보관해 통로를 비워요."
      },
      {
        "id": "jump",
        "label": "침대 위에서 뛰는 친구",
        "kind": "danger",
        "box": [
          6,
          9,
          22,
          34
        ],
        "rule": "침대에서 뛰면 떨어지거나 다른 사람과 부딪칠 수 있어요. 침대에서는 쉬어요."
      },
      {
        "id": "alone",
        "label": "알리지 않고 혼자 문 밖으로 나가는 친구",
        "kind": "danger",
        "box": [
          77,
          51,
          22,
          43
        ],
        "rule": "밤에 혼자 밖으로 나가면 길을 잃거나 도움을 받기 어려워요. 먼저 담당 선생님께 알려요."
      }
    ]
  }
};
function instruction(id){return '안전한 행동 세 곳과 위험한 행동 두 곳을 모두 찾아요. '+specs[id].targets.map(t=>t.label).join(', ');}
const api={specs,instruction};root.SafetyScenePrep=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
