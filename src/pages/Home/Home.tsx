import {
  BookOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";
import {
  MenuDataItem,
  PageContainer,
  ProLayout,
} from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { handleLogoutApi } from "../../services/userService";
import menuData from "./router";
import Train from "../Train";
import Dialogue from "../Dialogue";

function Home() {
  const navigate = useNavigate();
  const [pathname, setPathname] = useState<string>("");

  const checkAccess = () => {
    const checkAccess = document.cookie;
    console.log("checkAccess::", checkAccess);
    if (!checkAccess || checkAccess === null) {
      navigate("/");
    }
  };
  checkAccess();

  const handleLogout = async () => {
    try {
      const res = await handleLogoutApi();
      message.success("Đăng xuất thành công");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error("Đăng xuất thất bại");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        location={{
          pathname: "/home",
        }}
        // navTheme="light"
        title={"AceBot"}
        logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
        iconfontUrl="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
        layout="mix"
        route={menuData}
        fixedHeader={true}
        fixSiderbar={true}
        avatarProps={{
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: "Nguyễn Văn A",
          onClick: () => {
            console.log("logout");
            navigate("/");
          },
        }}
        menuDataRender={() => menuData}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              console.log(item);
              navigate(item?.path || "/");
              // setPathname(item.path || "/home");
            }}
          >
            {dom}
          </div>
        )}
      >
        <PageContainer style={{ paddingInline: 6 }} ghost title={false}>
          <Outlet></Outlet>
        </PageContainer>
      </ProLayout>
    </div>
  );
}

export default Home;
