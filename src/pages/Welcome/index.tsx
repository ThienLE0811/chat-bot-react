import { PageContainer } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import WelcomeHero from "./components/WelcomeHero";
import QuickStats from "./components/QuickStats";
import QuickAccessCards from "./components/QuickAccessCards";

const { Title } = Typography;

const Welcome = () => {
  return (
    <PageContainer title={false} breadcrumbRender={false}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <WelcomeHero />
        <QuickStats />
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Truy cập nhanh
          </Title>
          <QuickAccessCards />
        </div>
      </Space>
    </PageContainer>
  );
};

export default Welcome;
