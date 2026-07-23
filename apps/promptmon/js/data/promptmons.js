const levelRatios = {
  excellent: 1,
  good: 0.85,
  partial: 0.6,
  vague: 0.3,
  trap: 0.1
};

const levelFeedback = {
  excellent: "역할과 조건이 또렷해서 바로 쓸 수 있는 카드다.",
  good: "방향은 좋다. 조금 더 구체화하면 더 강해진다.",
  partial: "일부 정보는 있지만 빠진 조건이 있어 결과가 흔들릴 수 있다.",
  vague: "너무 막연해서 AI가 추측해야 한다.",
  trap: "그럴듯하지만 주제와 맞지 않거나 결과를 흐리게 만든다."
};

function card(text, level = "excellent", feedback = "") {
  return {
    text,
    level,
    scoreRatio: levelRatios[level] ?? levelRatios.excellent,
    feedback: feedback || levelFeedback[level] || levelFeedback.excellent,
    good: (levelRatios[level] ?? 1) >= 0.6
  };
}

function choiceSet(topic, categoryLabel, excellentText, vagueText) {
  const goodText = `${topic} 주제에 맞게 ${categoryLabel} 조건을 분명히 정해줘.`;
  const partialText = `${topic}에 필요한 ${categoryLabel}을 간단히 넣어줘.`;
  const trapText = `${topic}와 상관없는 멋진 결과로 알아서 바꿔줘.`;

  return [
    card(excellentText, "excellent", `${categoryLabel} 조건이 구체적이라 결과가 안정적이다.`),
    card(goodText, "good", `${categoryLabel} 방향은 좋지만 세부 조건을 더 넣으면 좋다.`),
    card(partialText, "partial", `${categoryLabel}이 일부만 들어 있어 보완이 필요하다.`),
    card(vagueText, "vague", `${categoryLabel}이 너무 막연해서 상대에게 반격당했다.`),
    card(trapText, "trap", `${categoryLabel}이 주제에서 벗어나 결과를 망칠 수 있다.`)
  ];
}

function makeCards(topic, goodRole, goodGoal, goodTarget, goodData, goodFeatures, goodScreens, goodConditions, goodOutput, goodExceptions) {
  return {
    role: choiceSet(topic, "역할", goodRole, "전문가처럼 해줘."),
    goal: choiceSet(topic, "목표", goodGoal, "좋게 만들어줘."),
    target: choiceSet(topic, "대상", goodTarget, "아무나 쓰게 해줘."),
    data: choiceSet(topic, "자료/도구", goodData, "알아서 찾아서 해줘."),
    features: choiceSet(topic, "핵심 내용", goodFeatures, "기능 많이 넣어줘."),
    screens: choiceSet(topic, "구성", goodScreens, "예쁘게 구성해줘."),
    conditions: choiceSet(topic, "조건", goodConditions, "사용하기 좋게 해줘."),
    output: choiceSet(topic, "출력 형식", goodOutput, "결과만 줘."),
    exceptions: choiceSet(topic, "예외/보완", goodExceptions, `${topic} 오류 없게 해줘.`)
  };
}

export const quests = [
  {
    id: "mealmon",
    village: "coding",
    title: "급식 정보 앱 만들기",
    pokemon: "porygon",
    koreanPokemon: "급식몬",
    enemy: "급식 막연몬",
    badPrompt: "급식 앱 만들어줘.",
    cards: makeCards(
      "급식",
      "너는 학교 현장에서 사용할 교육용 웹앱을 만드는 프론트엔드 개발자야.",
      "오늘 급식과 주간 급식을 학생이 빠르게 확인할 수 있는 앱을 만들어줘.",
      "사용 대상은 초등학생, 담임교사, 보조 인력이야. 글자는 크고 조작은 쉬워야 해.",
      "나이스 급식 API를 사용할 수 있게 설계하고, API가 없을 때는 예시 데이터로 동작하게 해줘.",
      "오늘 급식 보기, 날짜 선택, 주간 급식 보기, 알레르기 정보 표시 기능을 넣어줘.",
      "화면은 오늘 급식, 주간 급식, 설정 화면으로 구성해줘.",
      "모바일, 태블릿, PC에서 보기 좋은 반응형으로 만들어줘.",
      "HTML, CSS, JavaScript 전체 코드를 파일별로 나누어 작성해줘.",
      "급식 데이터가 없을 때는 '급식 정보가 없습니다'라고 안내해줘."
    )
  },
  {
    id: "attendmon",
    village: "coding",
    title: "감정 출석 앱 만들기",
    pokemon: "rotom",
    koreanPokemon: "출석몬",
    enemy: "출석 막연몬",
    badPrompt: "감정 출석 앱 만들어줘.",
    cards: makeCards(
      "출석",
      "너는 특수교육 현장에서 사용할 정서 지원 웹앱을 만드는 개발자야.",
      "학생이 오늘의 감정을 카드로 선택하고 교사가 확인할 수 있는 출석 앱을 만들어줘.",
      "대상은 감정 표현 지원이 필요한 학생과 담임교사야.",
      "학생 이름과 감정 카드 목록은 예시 데이터로 시작하고 나중에 수정할 수 있게 해줘.",
      "이름 선택, 감정 카드 선택, 출석 완료 표시, 오늘 기록 보기 기능을 넣어줘.",
      "학생 선택 화면, 감정 선택 화면, 교사용 확인 화면으로 구성해줘.",
      "버튼은 크게 만들고 색상은 차분하게 구성해줘.",
      "HTML, CSS, JavaScript 전체 코드를 작성하고 실행 방법도 알려줘.",
      "학생을 선택하지 않았을 때 먼저 학생을 선택하라고 안내해줘."
    )
  },
  {
    id: "animalmon",
    village: "art",
    title: "동물 이미지 프롬프트 만들기",
    pokemon: "eevee",
    koreanPokemon: "동물몬",
    enemy: "동물 막연몬",
    badPrompt: "동물 그려줘.",
    cards: makeCards(
      "동물",
      "너는 Canva 이미지 생성을 돕는 미술 프롬프트 선생님이야.",
      "귀여운 동물 캐릭터 이미지를 만들 수 있는 구체적인 프롬프트를 작성해줘.",
      "초등학생이 보고 따라 그릴 수 있는 친근한 동물 캐릭터가 대상이야.",
      "동물의 종류, 표정, 자세, 배경, 색감 정보를 포함해줘.",
      "동물의 생김새, 옷이나 소품, 주변 배경, 분위기를 한 문장 안에 담아줘.",
      "프롬프트를 대상, 모습, 배경, 스타일 순서로 정리해줘.",
      "폭력적이거나 무서운 표현은 피하고 밝고 따뜻한 느낌으로 작성해줘.",
      "이미지 생성기에 바로 넣을 수 있는 한글 프롬프트로 출력해줘.",
      "동물이 정해지지 않았다면 강아지, 고양이, 토끼 중 하나를 추천해줘."
    )
  },
  {
    id: "seasonmon",
    village: "art",
    title: "계절 풍경 프롬프트 만들기",
    pokemon: "bulbasaur",
    koreanPokemon: "계절몬",
    enemy: "계절 막연몬",
    badPrompt: "봄 그림 그려줘.",
    cards: makeCards(
      "계절",
      "너는 계절 풍경을 설명하는 미술 프롬프트 도우미야.",
      "봄의 분위기가 잘 드러나는 풍경 이미지 프롬프트를 만들어줘.",
      "초등학생이 계절의 특징을 이해할 수 있는 풍경을 대상으로 해줘.",
      "꽃, 나무, 날씨, 하늘, 사람이나 동물의 활동을 포함해줘.",
      "색감, 빛, 배경 요소, 화면 구도를 구체적으로 묘사해줘.",
      "장면 설명, 분위기, 스타일, 제외할 요소 순서로 정리해줘.",
      "따뜻하고 밝은 색을 중심으로 하고 어두운 표현은 피해줘.",
      "이미지 생성기에 바로 넣을 수 있는 프롬프트 한 단락으로 출력해줘.",
      "계절이 바뀌어도 꽃, 날씨, 색감만 바꿔 재사용할 수 있게 작성해줘."
    )
  },
  {
    id: "friendsongmon",
    village: "sound",
    title: "친구송 프롬프트 만들기",
    pokemon: "jigglypuff",
    koreanPokemon: "친구송몬",
    enemy: "친구송 막연몬",
    badPrompt: "친구 노래 만들어줘.",
    cards: makeCards(
      "친구송",
      "너는 초등학생이 부를 수 있는 노래 프롬프트를 만드는 음악 선생님이야.",
      "친구와 사이좋게 지내자는 메시지를 담은 짧은 노래 프롬프트를 만들어줘.",
      "대상은 초등학생이고 쉬운 단어와 따라 부르기 쉬운 멜로디가 필요해.",
      "주제, 분위기, 장르, 악기, 가사 조건을 포함해줘.",
      "밝은 팝 스타일, 손뼉 리듬, 짧은 후렴, 친구를 칭찬하는 가사를 넣어줘.",
      "노래 주제, 장르, 분위기, 악기, 가사 조건 순서로 작성해줘.",
      "가사는 쉽고 긍정적으로 쓰고 놀림이나 비교 표현은 피해줘.",
      "Suno에 넣을 음악 생성 프롬프트로 작성해줘.",
      "30초 정도로 짧고 따라 하기 쉽게 만들어줘."
    )
  },
  {
    id: "rhythmmon",
    village: "sound",
    title: "리듬 놀이 프롬프트 만들기",
    pokemon: "loudred",
    koreanPokemon: "리듬몬",
    enemy: "리듬 막연몬",
    badPrompt: "리듬 음악 만들어줘.",
    cards: makeCards(
      "리듬",
      "너는 수업용 리듬 놀이 음악을 설계하는 음악 활동 선생님이야.",
      "학생들이 박수를 치며 따라 할 수 있는 리듬 음악 프롬프트를 만들어줘.",
      "대상은 초등학생이며 빠르지 않고 반복이 쉬워야 해.",
      "템포, 악기, 박수 패턴, 반복 구간, 분위기를 포함해줘.",
      "드럼, 박수, 짧은 구호, 4박자 반복 패턴을 넣어줘.",
      "활동 목표, 리듬 패턴, 악기, 가사 또는 구호 순서로 정리해줘.",
      "너무 빠르지 않게 보통 속도로 만들고 교실에서 따라 하기 쉽게 해줘.",
      "음악 생성기에 넣을 수 있는 프롬프트 한 단락으로 출력해줘.",
      "말로 따라 하는 구호가 부담스러우면 박수 리듬만으로도 가능하게 해줘."
    )
  }
];
