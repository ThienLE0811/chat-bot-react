import { Tag, Tooltip } from "antd";
import { IntentScore } from "../../services/chatTestService";

/** Intent Rasa's FallbackClassifier predicts when no intent is confident enough. */
export const FALLBACK_INTENT = "nlu_fallback";

/**
 * Display bands only. Whether Rasa falls back is decided by the
 * FallbackClassifier threshold in its config, not by these values.
 */
const HIGH_CONFIDENCE = 0.8;
const MEDIUM_CONFIDENCE = 0.5;

/** Two intents closer than this are worth a warning: they are easy to mix up. */
export const AMBIGUITY_GAP = 0.1;

export type ConfidenceLevel = "high" | "medium" | "low";

export function confidenceLevel(intent: IntentScore): ConfidenceLevel {
  if (intent.name === FALLBACK_INTENT) return "low";
  if (intent.confidence >= HIGH_CONFIDENCE) return "high";
  if (intent.confidence >= MEDIUM_CONFIDENCE) return "medium";
  return "low";
}

export const LEVEL_COLORS: Record<ConfidenceLevel, string> = {
  high: "#52c41a",
  medium: "#faad14",
  low: "#ff4d4f",
};

const LEVEL_TAG_COLORS: Record<ConfidenceLevel, string> = {
  high: "success",
  medium: "warning",
  low: "error",
};

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(value >= 0.995 || value === 0 ? 0 : 1)}%`;
}

/** The runner-up intent when it scored within AMBIGUITY_GAP of the winner. */
export function closeRunnerUp(
  ranking: IntentScore[]
): IntentScore | undefined {
  const [first, second] = ranking;
  if (!first || !second || first.name === FALLBACK_INTENT) return undefined;
  return first.confidence - second.confidence < AMBIGUITY_GAP
    ? second
    : undefined;
}

export const IntentTag = ({ intent }: { intent: IntentScore | null }) => {
  if (!intent) return <Tag>không rõ ý định</Tag>;
  const level = confidenceLevel(intent);
  return (
    <Tooltip title="Ý định và độ tin cậy">
      <Tag color={LEVEL_TAG_COLORS[level]} style={{ marginInlineEnd: 0 }}>
        {intent.name} · {formatPercent(intent.confidence)}
      </Tag>
    </Tooltip>
  );
};
