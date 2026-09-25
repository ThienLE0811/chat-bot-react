import { ReloadOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Tabs,
  Typography,
  notification,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationMessage,
  ConversationSummary,
  LOW_CONFIDENCE,
  ReviewItem,
  getConversationMessages,
  getConversations,
  IntentOption,
  getIntentOptions,
  getReviewQueue,
} from "../../services/conversationsService";
import AddToIntentModal from "./components/AddToIntentModal";
import ReviewTable, { REVIEW_PAGE_SIZE } from "./components/ReviewTable";
import Transcript from "./components/Transcript";
import { displayName, formatTime } from "./components/labels";
import "./index.css";

/** New Telegram messages show up without reloading the page. */
const REFRESH_MS = 15_000;

type TabKey = "review" | "conversations";

function Conversations() {
  const [tab, setTab] = useState<TabKey>("review");
  const [intents, setIntents] = useState<IntentOption[]>([]);
  const [adding, setAdding] = useState<ConversationMessage | null>(null);

  const [review, setReview] = useState<{ items: ReviewItem[]; total: number }>(
    { items: [], total: 0 }
  );
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState(true);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [selected, setSelected] = useState<string>();
  const [highlightId, setHighlightId] = useState<string>();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  /** Drops a slow response for a conversation that is no longer selected. */
  const selectedRef = useRef<string>();

  const loadReview = useCallback(async (page: number) => {
    try {
      setReview(await getReviewQueue(REVIEW_PAGE_SIZE, (page - 1) * REVIEW_PAGE_SIZE));
    } catch (error: any) {
      notification.error({ message: error.message, key: "review" });
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setConversations((await getConversations()).items);
    } catch (error: any) {
      notification.error({ message: error.message, key: "conversations" });
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (senderId: string | undefined) => {
    if (!senderId) return;
    try {
      const result = await getConversationMessages(senderId);
      if (selectedRef.current === senderId) setMessages(result);
    } catch (error: any) {
      notification.error({ message: error.message, key: "messages" });
    } finally {
      if (selectedRef.current === senderId) setMessagesLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    loadReview(reviewPage);
    loadConversations();
    loadMessages(selectedRef.current);
  }, [loadReview, loadConversations, loadMessages, reviewPage]);

  useEffect(() => {
    getIntentOptions()
      .then(setIntents)
      .catch((error) => notification.error({ message: error.message }));
  }, []);

  useEffect(() => {
    loadReview(reviewPage);
  }, [loadReview, reviewPage]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const openConversation = (senderId: string, messageId?: string) => {
    selectedRef.current = senderId;
    setSelected(senderId);
    setHighlightId(messageId);
    setMessages([]);
    setMessagesLoading(true);
    loadMessages(senderId);
  };

  // Open the most recent conversation once the list first arrives.
  useEffect(() => {
    if (!selectedRef.current && conversations[0]) {
      openConversation(conversations[0].senderId);
    }
  }, [conversations]);

  const current = conversations.find((item) => item.senderId === selected);

  return (
    <PageContainer
      breadcrumbRender={false}
      title={false}
      childrenContentStyle={{ paddingInline: 12, paddingBlock: 8 }}
    >
      <Card
        title="Hội thoại thật"
        extra={
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            Làm mới
          </Button>
        }
        bodyStyle={{ paddingTop: 0 }}
      >
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as TabKey)}
          items={[
            {
              key: "review",
              label: (
                <span>
                  Cần xem lại{" "}
                  <Badge
                    count={review.total}
                    overflowCount={999}
                    style={{ marginInlineStart: 4 }}
                  />
                </span>
              ),
              children: (
                <>
                  <Typography.Paragraph type="secondary">
                    Câu người dùng bị bot trả lời bằng fallback, có độ tin cậy
                    dưới {LOW_CONFIDENCE * 100}%, hoặc bị bạn đánh dấu "bot hiểu
                    sai". Thêm câu vào đúng ý định rồi train lại để bot học từ
                    chính câu hỏi thật.
                  </Typography.Paragraph>
                  <ReviewTable
                    items={review.items}
                    total={review.total}
                    page={reviewPage}
                    loading={reviewLoading}
                    onPageChange={setReviewPage}
                    onAdd={setAdding}
                    onOpenConversation={(item) => {
                      setTab("conversations");
                      openConversation(item.senderId, item._id);
                    }}
                    onChanged={refresh}
                  />
                </>
              ),
            },
            {
              key: "conversations",
              label: `Hội thoại (${conversations.length})`,
              children: (
                <Row gutter={[12, 12]}>
                  <Col xs={24} lg={8}>
                    <List<ConversationSummary>
                      className="conversations__list"
                      loading={conversationsLoading}
                      dataSource={conversations}
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Chưa có ai nhắn cho bot trên Telegram."
                          />
                        ),
                      }}
                      renderItem={(item) => (
                        <List.Item
                          className={`conversations__item${
                            item.senderId === selected
                              ? " conversations__item--selected"
                              : ""
                          }`}
                          onClick={() => openConversation(item.senderId)}
                        >
                          <List.Item.Meta
                            title={
                              <div className="conversations__item-title">
                                <Typography.Text strong ellipsis>
                                  {displayName(item.user, item.senderId)}
                                </Typography.Text>
                                <Badge count={item.needsReview} title="Câu cần xem lại" />
                              </div>
                            }
                            description={
                              <>
                                <Typography.Text
                                  type="secondary"
                                  ellipsis
                                  className="conversations__preview"
                                >
                                  {item.lastMessage.from === "bot" ? "Bot: " : ""}
                                  {item.lastMessage.text ?? ""}
                                </Typography.Text>
                                <Typography.Text
                                  type="secondary"
                                  className="conversations__small"
                                >
                                  {formatTime(item.lastAt)} · {item.messageCount} tin
                                </Typography.Text>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} lg={16}>
                    {current && (
                      <Typography.Title level={5} className="conversations__heading">
                        {displayName(current.user, current.senderId)}
                      </Typography.Title>
                    )}
                    <Transcript
                      messages={messages}
                      loading={messagesLoading}
                      highlightId={highlightId}
                      onAdd={setAdding}
                      onChanged={refresh}
                    />
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>

      <AddToIntentModal
        message={adding}
        intents={intents}
        onClose={() => setAdding(null)}
        onAdded={() => {
          setAdding(null);
          refresh();
        }}
      />
    </PageContainer>
  );
}

export default Conversations;
