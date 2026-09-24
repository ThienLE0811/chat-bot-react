import { Button, Empty, Space, Spin, Typography, notification } from "antd";
import { useEffect, useRef } from "react";
import {
  ConversationMessage,
  setMessageReview,
} from "../../../services/conversationsService";
import { IntentTag } from "../../components/IntentConfidence";
import { ReviewTag, formatTime } from "./labels";

interface Props {
  messages: ConversationMessage[];
  loading: boolean;
  /** Message to scroll to and highlight, e.g. opened from the review list. */
  highlightId?: string;
  onAdd: (message: ConversationMessage) => void;
  onChanged: () => void;
}

/** Commands and button payloads, which are not something to learn from. */
const isCommand = (text?: string) => !!text && /^\s*\//.test(text);

const Transcript = ({
  messages,
  loading,
  highlightId,
  onAdd,
  onChanged,
}: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const count = messages.length;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const target = highlightId
      ? list.querySelector<HTMLElement>(`[data-id="${highlightId}"]`)
      : null;
    if (target) target.scrollIntoView({ block: "center" });
    else list.scrollTo({ top: list.scrollHeight });
  }, [highlightId, count]);

  const review = async (
    message: ConversationMessage,
    status: "wrong" | "open"
  ) => {
    try {
      await setMessageReview(message._id, status);
      onChanged();
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  if (loading && !count) {
    return (
      <div className="conversations__transcript conversations__center">
        <Spin />
      </div>
    );
  }
  if (!count) {
    return (
      <div className="conversations__transcript conversations__center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chọn một cuộc hội thoại để xem."
        />
      </div>
    );
  }

  return (
    <div className="conversations__transcript" ref={listRef}>
      {messages.map((message) =>
        message.from === "bot" ? (
          <div key={message._id} className="conversations__row">
            <div className="conversations__bubble conversations__bubble--bot">
              {message.text}
            </div>
            <Typography.Text type="secondary" className="conversations__small">
              {formatTime(message.createdAt)}
            </Typography.Text>
          </div>
        ) : (
          <div
            key={message._id}
            data-id={message._id}
            className={`conversations__row conversations__row--user${
              message._id === highlightId ? " conversations__row--highlight" : ""
            }`}
          >
            <div className="conversations__bubble conversations__bubble--user">
              {message.text ?? "(không có nội dung chữ)"}
            </div>
            <Space size={[6, 4]} wrap className="conversations__meta">
              <Typography.Text type="secondary" className="conversations__small">
                {formatTime(message.createdAt)}
              </Typography.Text>
              {message.error ? (
                <Typography.Text type="danger" className="conversations__small">
                  Bot lỗi: {message.error}
                </Typography.Text>
              ) : (
                message.intent && <IntentTag intent={message.intent} />
              )}
              <ReviewTag review={message.review} />
            </Space>
            {message.text && !isCommand(message.text) && (
              <Space size={0} className="conversations__actions">
                {message.review?.status === "wrong" ? (
                  <Button type="link" size="small" onClick={() => review(message, "open")}>
                    Bỏ đánh dấu sai
                  </Button>
                ) : (
                  !message.review && (
                    <Button type="link" size="small" onClick={() => review(message, "wrong")}>
                      Bot hiểu sai
                    </Button>
                  )
                )}
                {message.review?.status !== "added" && (
                  <Button type="link" size="small" onClick={() => onAdd(message)}>
                    Thêm vào ý định
                  </Button>
                )}
              </Space>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Transcript;
