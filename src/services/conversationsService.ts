import axios from "axios";
import { IntentScore } from "./chatTestService";
import { API_URL } from "./trainService";

export type ReviewStatus = "wrong" | "added" | "ignored";
export type ReviewReason = "flagged" | "fallback" | "low_confidence";

export interface ConversationUser {
  id?: number;
  username?: string;
  firstName?: string;
}

export interface ConversationSummary {
  senderId: string;
  channel: string;
  user: ConversationUser | null;
  messageCount: number;
  needsReview: number;
  lastMessage: { from: "user" | "bot"; text: string | null };
  startedAt: string;
  lastAt: string;
}

export interface ConversationMessage {
  _id: string;
  channel: string;
  senderId: string;
  from: "user" | "bot";
  text?: string;
  intent?: IntentScore | null;
  actions?: string[];
  user?: ConversationUser;
  error?: string;
  review?: { status: ReviewStatus; intent?: string; at: string };
  createdAt: string;
}

export type ReviewItem = ConversationMessage & { reason: ReviewReason };

export interface Page<T> {
  items: T[];
  total: number;
}

/** Messages Rasa was less sure about than this count as needing review. */
export const LOW_CONFIDENCE = 0.6;

function errorMessage(error: any, fallback: string): string {
  const message = error?.response?.data?.message;
  return (Array.isArray(message) ? message[0] : message) ?? fallback;
}

async function request<T>(run: () => Promise<{ data: T }>, fallback: string) {
  try {
    const { data } = await run();
    return data;
  } catch (error) {
    throw new Error(errorMessage(error, fallback));
  }
}

export const getConversations = (limit = 50, skip = 0) =>
  request<Page<ConversationSummary>>(
    () =>
      axios.get(`${API_URL}/conversations`, {
        params: { limit, skip, maxConfidence: LOW_CONFIDENCE },
      }),
    "Không tải được danh sách hội thoại"
  );

export const getConversationMessages = (senderId: string) =>
  request<ConversationMessage[]>(
    () =>
      axios.get(
        `${API_URL}/conversations/${encodeURIComponent(senderId)}/messages`
      ),
    "Không tải được hội thoại"
  );

export const getReviewQueue = (limit = 50, skip = 0) =>
  request<Page<ReviewItem>>(
    () =>
      axios.get(`${API_URL}/conversations/review`, {
        params: { limit, skip, maxConfidence: LOW_CONFIDENCE },
      }),
    "Không tải được danh sách cần xem lại"
  );

/** `open` clears an earlier decision and puts the message back in review. */
export const setMessageReview = (
  id: string,
  status: "wrong" | "ignored" | "open"
) =>
  request<ConversationMessage>(
    () =>
      axios.patch(`${API_URL}/conversations/messages/${id}/review`, {
        status,
      }),
    "Không cập nhật được tin nhắn"
  );

export const addMessageToIntent = (id: string, intent: string) =>
  request<{ intent: string; text: string; alreadyExisted: boolean }>(
    () =>
      axios.post(`${API_URL}/conversations/messages/${id}/add-to-intent`, {
        intent,
      }),
    "Không thêm được câu mẫu"
  );

export interface IntentOption {
  /** Code Rasa trains and predicts, e.g. `ask_user_name`. */
  name: string;
  /** Vietnamese name shown to people, from the intent's description. */
  label?: string;
}

/** Intents, for choosing where a message belongs. */
export const getIntentOptions = () =>
  request<{ title: string; description?: string }[]>(
    () => axios.get(`${API_URL}/intents/getList`),
    "Không tải được danh sách ý định"
  ).then((intents) =>
    intents
      .map((intent) => ({
        name: intent.title,
        label: intent.description?.trim() || undefined,
      }))
      .sort((a, b) =>
        (a.label ?? a.name).localeCompare(b.label ?? b.name, "vi")
      )
  );
