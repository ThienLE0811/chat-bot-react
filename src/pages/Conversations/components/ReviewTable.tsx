import { Button, Space, Table, Typography, notification } from "antd";
import {
  ReviewItem,
  setMessageReview,
} from "../../../services/conversationsService";
import { IntentTag } from "../../components/IntentConfidence";
import { ReasonTag, displayName, formatTime } from "./labels";
import { useCan } from "../../../lib/auth";

export const REVIEW_PAGE_SIZE = 20;

interface Props {
  items: ReviewItem[];
  total: number;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onAdd: (item: ReviewItem) => void;
  onOpenConversation: (item: ReviewItem) => void;
  /** Called after a message leaves the queue, so lists can be refreshed. */
  onChanged: () => void;
}

const ReviewTable = ({
  items,
  total,
  page,
  loading,
  onPageChange,
  onAdd,
  onOpenConversation,
  onChanged,
}: Props) => {
  const canReview = useCan()("conversations.review");
  const ignore = async (item: ReviewItem) => {
    try {
      await setMessageReview(item._id, "ignored");
      onChanged();
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  return (
    <Table<ReviewItem>
      rowKey="_id"
      size="middle"
      loading={loading}
      dataSource={items}
      scroll={{ x: "max-content" }}
      locale={{
        emptyText:
          "Không có câu nào cần xem lại. Câu bị fallback, có độ tin cậy thấp hoặc bị đánh dấu sai sẽ hiện ở đây.",
      }}
      pagination={{
        current: page,
        pageSize: REVIEW_PAGE_SIZE,
        total,
        onChange: onPageChange,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      columns={[
        {
          title: "Câu người dùng",
          dataIndex: "text",
          render: (text: string, item) => (
            <div className="conversations__review-text">
              <Typography.Text strong>{text}</Typography.Text>
              <Typography.Text type="secondary" className="conversations__small">
                {displayName(item.user, item.senderId)} · {formatTime(item.createdAt)}
              </Typography.Text>
            </div>
          ),
        },
        {
          title: "Bot hiểu là",
          dataIndex: "intent",
          render: (_, item) => <IntentTag intent={item.intent ?? null} />,
        },
        {
          title: "Lý do",
          dataIndex: "reason",
          render: (_, item) => <ReasonTag reason={item.reason} />,
        },
        {
          title: "",
          key: "actions",
          render: (_, item) => (
            <Space wrap>
              <Button
                type="primary"
                size="small"
                disabled={!canReview}
                onClick={() => onAdd(item)}
              >
                Thêm vào ý định
              </Button>
              <Button size="small" disabled={!canReview} onClick={() => ignore(item)}>
                Bỏ qua
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => onOpenConversation(item)}
              >
                Xem hội thoại
              </Button>
            </Space>
          ),
        },
      ]}
    />
  );
};

export default ReviewTable;
