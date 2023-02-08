import {
  BookOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { PageContainer, ProLayout } from "@ant-design/pro-components";

function Home() {
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        location={{
          pathname: "/articles/new",
        }}
        title="AceBot"
        logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
        iconfontUrl="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
        route={{
          path: "/",
          routes: [
            {
              path: "/dialogue",
              name: "Dialogue",
              icon: <BookOutlined />,
            },
            {
              path: "/nlu",
              name: "NLU",
              component: "",
              icon: <TableOutlined />,
            },
            {
              path: "https://www.google.com/",
              name: "Train",
              icon: <DatabaseOutlined />,
            },
            {
              path: "/login",
              name: "Đăng xuất",
              icon: <LogoutOutlined />,
              component: "../Auth/Login.tsx",
            },
          ],
        }}
      >
        <PageContainer content="Chat bot">
          <div>Hello World</div>
        </PageContainer>
      </ProLayout>
    </div>
  );
}

export default Home;
