import axios from "axios";
import { API_URL } from "./trainService";

export interface IntentScore {
  name: string;
  confidence: number;
}

export interface ExtractedEntity {
  entity: string;
  value: unknown;
  start: number | null;
  end: number | null;
  confidence: number | null;
  extractor: string | null;
  role: string | null;
  group: string | null;
}

export interface PredictedAction {
  name: string;
  policy: string | null;
  confidence: number | null;
}

/** What Rasa understood from one user message and what it did about it. */
export interface ChatTurn {
  text: string;
  messageId: string | null;
  timestamp: number | null;
  intent: IntentScore | null;
  intentRanking: IntentScore[];
  entities: ExtractedEntity[];
  actions: PredictedAction[];
  slots: { name: string; value: unknown }[];
}

export interface BotMessage {
  recipient_id: string;
  text?: string;
  image?: string;
  buttons?: { title: string; payload: string }[];
  custom?: unknown;
}

export interface ChatTestReply {
  replies: BotMessage[];
  turn: ChatTurn | null;
}

export const sendTestMessage = async (
  senderId: string,
  text: string
): Promise<ChatTestReply> => {
  try {
    const { data } = await axios.post<ChatTestReply>(
      `${API_URL}/chat-test/messages`,
      { senderId, text }
    );
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message;
    throw new Error(
      (Array.isArray(message) ? message[0] : message) ??
        "Không gửi được tin nhắn tới bot"
    );
  }
};
