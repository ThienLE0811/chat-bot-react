import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  InputRef,
  Row,
  Space,
  Tag,
  Typography,
  notification,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BotMessage,
  ChatTurn,
  sendTestMessage,
} from "../../services/chatTestService";
import { getModels } from "../../services/trainService";
import TurnInspector from "./components/TurnInspector";
import { IntentTag } from "./components/confidence";
import "./index.css";

type ChatEntry =
  | {
      kind: "user";
      id: string;
      text: string;
      status: "sending" | "sent" | "failed";
      turn?: ChatTurn | null;
      error?: string;
    }
  | { kind: "bot"; id: string; message: BotMessage | null };

type UserEntry = Extract<ChatEntry, { kind: "user" }>;

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Rasa keeps one tracker per sender id, so a new id is a new conversation. */
const newSenderId = () => `chat-test-${newId()}`;

const BotBubble = ({
  message,
  disabled,
  onButton,
}: {
  message: BotMessage | null;
  disabled: boolean;
  onButton: (title: string, payload: string) => void;
}) => {
  if (!message) {
    return (
      <div className="chat-test__bubble chat-test__bubble--bot chat-test__bubble--muted">
        Bot không phản hồi.
      </div>
    );
  }
  return (
    <div className="chat-test__bubble chat-test__bubble--bot">
      {message.text && <div className="chat-test__text">{message.text}</div>}
      {message.image && (
        <img src={message.image} alt="" className="chat-test__image" />
      )}
      {message.buttons && message.buttons.length > 0 && (
        <Space wrap size={[6, 6]} className="chat-test__buttons">
          {message.buttons.map((button) => (
            <Button
              key={button.payload}
              size="small"
              disabled={disabled}
              onClick={() => onButton(button.title, button.payload)}
            >
              {button.title}
            </Button>
          ))}
        </Space>
      )}
      {message.custom !== undefined && (
        <pre className="chat-test__custom">
          {JSON.stringify(message.custom, null, 2)}
        </pre>
      )}
    </div>
  );
};

function ChatTest() {
  const [senderId, setSenderId] = useState(newSenderId);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>();
  const [rasaReachable, setRasaReachable] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    getModels()
      .then((models) => {
        setActiveModel(models.activeModel);
        setRasaReachable(models.rasaReachable);
      })
      .catch(() => setRasaReachable(false));
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [entries]);

  const updateUser = (id: string, patch: Partial<UserEntry>) =>
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id && entry.kind === "user" ? { ...entry, ...patch } : entry
      )
    );

  /** `shown` is what the chat displays, e.g. a button title for its payload. */
  const send = useCallback(
    async (text: string, shown = text) => {
      if (!text.trim() || sending) return;
      const id = newId();
      setEntries((current) => [
        ...current,
        { kind: "user", id, text: shown, status: "sending" },
      ]);
      setSelectedId(id);
      setDraft("");
      setSending(true);
      try {
        const { replies, turn } = await sendTestMessage(senderId, text);
        updateUser(id, { status: "sent", turn });
        const bots: ChatEntry[] = replies.length
          ? replies.map((message) => ({ kind: "bot", id: newId(), message }))
          : [{ kind: "bot", id: newId(), message: null }];
        setEntries((current) => [...current, ...bots]);
      } catch (error: any) {
        updateUser(id, { status: "failed", error: error.message });
        notification.error({ message: error.message });
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [senderId, sending]
  );

  const restart = () => {
    setSenderId(newSenderId());
    setEntries([]);
    setSelectedId(undefined);
    inputRef.current?.focus();
  };

  const selected = entries.find(
    (entry): entry is UserEntry =>
      entry.kind === "user" && entry.id === selectedId
  );

  return (
    <PageContainer
      breadcrumbRender={false}
      title={false}
      childrenContentStyle={{ paddingInline: 12, paddingBlock: 8 }}
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={14}>
          <Card
            title="Chat thử"
            className="chat-test__card"
            bodyStyle={{ padding: 0 }}
            extra={
              <Space wrap>
                {!rasaReachable ? (
                  <Tag color="red">Không kết nối được Rasa</Tag>
                ) : activeModel === null ? (
                  <Tag color="orange">Chưa có model</Tag>
                ) : activeModel ? (
                  <Tag color="green" title="Model đang chạy">
                    {activeModel}
                  </Tag>
                ) : null}
                <Button
                  icon={<PlusOutlined />}
                  onClick={restart}
                  disabled={sending}
                >
                  Hội thoại mới
                </Button>
              </Space>
            }
          >
            <div className="chat-test__messages" ref={listRef}>
              {entries.length === 0 ? (
                <Empty
                  className="chat-test__empty"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Nhắn thử cho bot. Mỗi câu sẽ hiện ý định và độ tin cậy mà bot nhận ra."
                />
              ) : (
                entries.map((entry) =>
                  entry.kind === "bot" ? (
                    <BotBubble
                      key={entry.id}
                      message={entry.message}
                      disabled={sending}
                      onButton={(title, payload) => send(payload, title)}
                    />
                  ) : (
                    <div
                      key={entry.id}
                      className={`chat-test__user${
                        entry.id === selectedId ? " chat-test__user--selected" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="chat-test__bubble chat-test__bubble--user"
                        onClick={() => setSelectedId(entry.id)}
                        title="Xem phân tích câu này"
                      >
                        {entry.text}
                      </button>
                      <div className="chat-test__meta">
                        {entry.status === "sending" && (
                          <Typography.Text type="secondary">
                            Đang gửi…
                          </Typography.Text>
                        )}
                        {entry.status === "failed" && (
                          <Typography.Text type="danger">
                            Không gửi được
                          </Typography.Text>
                        )}
                        {entry.status === "sent" && (
                          <IntentTag intent={entry.turn?.intent ?? null} />
                        )}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
            <div className="chat-test__composer">
              <Input
                ref={inputRef}
                value={draft}
                maxLength={1000}
                placeholder="Nhập tin nhắn rồi bấm Enter"
                onChange={(event) => setDraft(event.target.value)}
                onPressEnter={() => send(draft)}
                autoFocus
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={sending}
                disabled={!draft.trim()}
                onClick={() => send(draft)}
              >
                Gửi
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Bot hiểu gì" className="chat-test__card">
            {selected?.status === "failed" ? (
              <Typography.Text type="danger">{selected.error}</Typography.Text>
            ) : (
              <TurnInspector turn={selected?.turn} />
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default ChatTest;
