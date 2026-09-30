import { Button, Typography } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../../../lib/getInfo";

const { Title, Paragraph } = Typography;

const WelcomeHero = () => {
  const navigate = useNavigate();
  const { firstName, lastName } = userInfo();
  const displayName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <div
      style={{
        borderRadius: 12,
        padding: "32px 40px",
        background: "linear-gradient(135deg, #06762F 0%, #1fa855 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Xin chào{displayName ? `, ${displayName}` : ""} 👋
        </Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.85)", marginTop: 8, marginBottom: 0 }}>
          Chào mừng quay lại AceBot. Cùng xem tổng quan hệ thống chatbot của bạn.
        </Paragraph>
      </div>
      <Button
        type="primary"
        size="large"
        icon={<RocketOutlined />}
        style={{ background: "#fff", color: "#06762F", borderColor: "#fff" }}
        onClick={() => navigate("/train/train-model")}
      >
        Huấn luyện mô hình
      </Button>
    </div>
  );
};

export default WelcomeHero;
