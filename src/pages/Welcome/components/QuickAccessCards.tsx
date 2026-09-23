import { Card, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FolderOpenOutlined,
  GatewayOutlined,
  HddOutlined,
  HistoryOutlined,
  ReadOutlined,
  SwapOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const accountInfo: any = JSON.parse(
  sessionStorage.getItem("accountInfo") as any
);

const items = [
  {
    title: "Ý định",
    description: "Quản lý ý định người dùng",
    icon: <ReadOutlined />,
    path: "/dialogue/intents",
    visible: accountInfo?.DIALOGUE_MANAGEMENT,
  },
  {
    title: "Thực thể",
    description: "Quản lý thực thể hội thoại",
    icon: <FolderOpenOutlined />,
    path: "/dialogue/entity",
    visible: accountInfo?.DIALOGUE_MANAGEMENT,
  },
  {
    title: "Phản hồi",
    description: "Quản lý phản hồi chatbot",
    icon: <SwapOutlined />,
    path: "/dialogue/response",
    visible: accountInfo?.DIALOGUE_MANAGEMENT,
  },
  {
    title: "Kho hội thoại",
    description: "Quản lý kịch bản hội thoại",
    icon: <HddOutlined />,
    path: "/dialogue/stories",
    visible: accountInfo?.DIALOGUE_MANAGEMENT,
  },
  {
    title: "Train Model",
    description: "Huấn luyện mô hình chatbot",
    icon: <GatewayOutlined />,
    path: "/train/train-model",
    visible: accountInfo?.TRAIN_MANAGEMENT,
  },
  {
    title: "Lịch sử train",
    description: "Xem lại các lần huấn luyện",
    icon: <HistoryOutlined />,
    path: "/train/history-train",
    visible: accountInfo?.TRAIN_MANAGEMENT,
  },
];

const QuickAccessCards = () => {
  const navigate = useNavigate();
  const visibleItems = items.filter((item) => item.visible);

  if (visibleItems.length === 0) return null;

  return (
    <Row gutter={[16, 16]}>
      {visibleItems.map((item) => (
        <Col xs={24} sm={12} md={8} key={item.path}>
          <Card
            hoverable
            onClick={() => navigate(item.path)}
            bodyStyle={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                fontSize: 24,
                color: "#06762F",
                background: "#e4f5e7",
                borderRadius: 8,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <Text strong>{item.title}</Text>
              <br />
              <Text type="secondary">{item.description}</Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default QuickAccessCards;
