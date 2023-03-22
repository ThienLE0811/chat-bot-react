import {
  BookOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  TableOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  MenuDataItem,
  PageContainer,
  ProLayout,
} from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { message, Button, Dropdown, Menu, notification } from "antd";
import { handleLogoutApi } from "../../services/userService";
import { motion } from "framer-motion";
import { workplace } from "../../config/router";
import { variants, transition } from "../../config/pageTransition";
import { clearCredentialCookie } from "../../utils";
import { checkAccess, userInfo } from "../../lib/getInfo";

function Home() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // checkAccess();
  console.log("name:: ", userInfo().userName);

  const handleLogout = () => {
    console.log("ok12112");
    // try {
    //   const res = await handleLogoutApi();
    //   message.success("Đăng xuất thành công");
    //   navigate("/auth/login");
    // } catch (err) {
    //   console.error(err);
    //   message.error("Đăng xuất thất bại");
    // }
  };

  const AvatarDropdown = () => {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="#">Profile</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#">Settings</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <Button
            onClick={async () => {
              await handleLogoutApi();
              clearCredentialCookie();
              navigate("/auth/login");
            }}
          >
            Đăng xuất
          </Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <span style={{ width: "100px" }}>
          <UserOutlined />
        </span>
      </Dropdown>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        location={{
          pathname,
        }}
        token={{
          header: { heightLayoutHeader: 40 },
        }}
        // navTheme="light"
        // title={"Ace Bot"}
        // logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
        logo="/GoGroup-2.png"
        title={""}
        iconfontUrl="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
        layout="mix"
        // route={menuData}
        route={{
          routes: workplace.children,
        }}
        fixedHeader={true}
        fixSiderbar={true}
        splitMenus={true}
        avatarProps={{
          // src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "large",
          title: `${
            userInfo()
              ? `${userInfo().firstName}, ${userInfo().lastName} (${
                  userInfo().userName
                })`
              : ""
          }`,
          icon: <AvatarDropdown />,
        }}
        menu={{
          collapsedShowGroupTitle: true,
        }}
        // menuDataRender={() => menuData}
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
        {/* <PageContainer style={{ paddingInline: 6 }} ghost title={false}>
          <Outlet></Outlet>
        </PageContainer> */}
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants}
        >
          <Outlet />
        </motion.div>
      </ProLayout>
    </div>
  );
}

export default Home;
