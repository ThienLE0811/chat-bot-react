import { Tag } from "antd";
import {
  ConversationMessage,
  ConversationUser,
  ReviewReason,
} from "../../../services/conversationsService";

const REASONS: Record<ReviewReason, { label: string; color: string }> = {
  flagged: { label: "Bị đánh dấu sai", color: "magenta" },
  fallback: { label: "Bot không hiểu", color: "red" },
  low_confidence: { label: "Độ tin cậy thấp", color: "orange" },
};

export const ReasonTag = ({ reason }: { reason: ReviewReason }) => (
  <Tag color={REASONS[reason].color}>{REASONS[reason].label}</Tag>
);

/** What a designer already decided about a message, if anything. */
export const ReviewTag = ({ review }: Pick<ConversationMessage, "review">) => {
  if (!review) return null;
  if (review.status === "added") {
    return <Tag color="green">Đã thêm vào {review.intent}</Tag>;
  }
  if (review.status === "ignored") return <Tag>Đã bỏ qua</Tag>;
  return <Tag color="magenta">Bot hiểu sai</Tag>;
};

export function displayName(
  user: ConversationUser | null | undefined,
  senderId: string
): string {
  if (!user) return senderId;
  const name = user.firstName ?? "";
  if (user.username) return name ? `${name} (@${user.username})` : `@${user.username}`;
  return name || senderId;
}

export function formatTime(value: string): string {
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
