const LEVEL_RATIOS = {
  excellent: 1,
  good: 0.85,
  partial: 0.6,
  vague: 0.3,
  trap: 0.1
};

const DEFAULT_FEEDBACK = {
  excellent: "핵심 조건이 또렷해서 바로 쓸 수 있는 카드입니다.",
  good: "방향은 좋습니다. 한두 가지 조건을 더 붙이면 더 강해집니다.",
  partial: "일부 조건은 들어 있지만 아직 빠진 정보가 있습니다.",
  vague: "말이 넓어서 AI가 추측해야 합니다. 더 구체적으로 고르는 것이 좋습니다.",
  trap: "겉보기엔 그럴듯하지만 결과를 흐리게 만드는 카드입니다."
};

function inferLevel(option) {
  if (option?.level && LEVEL_RATIOS[option.level] !== undefined) return option.level;
  if (option?.good === false) return "vague";
  return "excellent";
}

export function normalizeCardOption(option) {
  if (typeof option === "string") {
    return {
      text: option,
      level: "excellent",
      scoreRatio: LEVEL_RATIOS.excellent,
      feedback: DEFAULT_FEEDBACK.excellent,
      good: true
    };
  }

  const level = inferLevel(option);
  const scoreRatio = Number.isFinite(option?.scoreRatio)
    ? clampRatio(option.scoreRatio)
    : LEVEL_RATIOS[level];

  return {
    text: option?.text || "",
    level,
    scoreRatio,
    feedback: option?.feedback || DEFAULT_FEEDBACK[level],
    good: option?.good !== false && scoreRatio >= 0.6
  };
}

export function buildPromptFromSelection(quest, selected, categories) {
  const lines = [];
  const title = quest?.title ? `# ${quest.title}` : "# 프롬프트";

  categories.forEach((category) => {
    const option = selected?.[category.key];
    if (!option) return;

    const normalized = normalizeCardOption(option);
    if (!normalized.text.trim()) return;
    lines.push(`${category.label}: ${normalized.text.trim()}`);
  });

  if (!lines.length) return "";

  return [
    title,
    "",
    "아래 조건을 모두 반영해서 결과를 만들어 주세요.",
    "",
    ...lines,
    "",
    "조건이 충돌하면 먼저 사용자에게 확인 질문을 하고, 가능한 부분은 바로 실행 가능한 형태로 제안해 주세요."
  ].join("\n");
}

export function calculatePromptScore(selected, categories) {
  let total = 0;
  const breakdown = [];

  categories.forEach((category) => {
    const max = category.score || 0;
    if (max <= 0) return;

    const option = selected?.[category.key];
    const normalized = option ? normalizeCardOption(option) : null;
    const score = normalized ? Math.round(max * normalized.scoreRatio) : 0;

    total += score;
    breakdown.push({
      key: category.key,
      label: category.label,
      score,
      max,
      level: normalized?.level || "missing",
      feedback: normalized?.feedback || `${category.label} 조건이 비어 있습니다.`,
      success: score >= Math.ceil(max * 0.6),
      text: normalized?.text || ""
    });
  });

  return { total: Math.min(100, total), breakdown };
}

export function buildCardFeedback(selected, categories) {
  return categories
    .map((category) => {
      const option = selected?.[category.key];
      if (!option) {
        return {
          label: category.label,
          text: "선택하지 않음",
          feedback: `${category.label} 정보가 빠져 결과가 흔들릴 수 있습니다.`,
          level: "missing"
        };
      }

      const normalized = normalizeCardOption(option);
      return {
        label: category.label,
        text: normalized.text,
        feedback: normalized.feedback,
        level: normalized.level
      };
    });
}

export function buildBadPromptAnalysis(quest) {
  const badPrompt = quest?.badPrompt || "막연한 요청";
  return [
    `"${badPrompt}"은 무엇을, 누구에게, 어떤 조건으로 만들지 부족합니다.`,
    "AI가 기능, 화면, 출력 형식을 추측하게 되어 결과가 매번 달라질 수 있습니다.",
    "좋은 프롬프트는 역할, 목표, 대상, 조건, 출력 형식을 나누어 알려 줍니다."
  ];
}

export function buildComparisonGuide(quest, selected, categories) {
  const selectedFeatures = normalizeMaybe(selected?.features)?.text || "핵심 기능 카드가 비어 있습니다.";
  const selectedTarget = normalizeMaybe(selected?.target)?.text || "대상 카드가 비어 있습니다.";
  const selectedOutput = normalizeMaybe(selected?.output)?.text || "출력 형식 카드가 비어 있습니다.";

  return [
    ["막연한 요청", quest?.badPrompt || "막연한 요청", "AI가 필요한 조건을 추측해야 합니다."],
    ["대상", "대상이 거의 드러나지 않습니다.", selectedTarget],
    ["핵심 기능", "무엇을 넣어야 하는지 부족합니다.", selectedFeatures],
    ["출력 형식", "결과물을 어떻게 받을지 정해져 있지 않습니다.", selectedOutput],
    ["다음 행동", "다시 질문을 많이 받을 수 있습니다.", "좋은 프롬프트 결과를 LLM에 붙여 넣고, 생성된 코드를 VS Code에 적용한 뒤 오류 메시지를 다시 질문하세요."]
  ];
}

function normalizeMaybe(option) {
  return option ? normalizeCardOption(option) : null;
}

function clampRatio(value) {
  return Math.max(0, Math.min(1, value));
}
