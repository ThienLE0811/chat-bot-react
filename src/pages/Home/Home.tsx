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
import {
  getUser,
  getUserId,
  handleLogoutApi,
} from "../../services/userService";
import { motion } from "framer-motion";
import { workplace } from "../../config/router";
import { variants, transition } from "../../config/pageTransition";
import { clearCredentialCookie } from "../../utils";
import { checkAccess, userInfo } from "../../lib/getInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setAccountInfo } from "../../redux/slices/account";
import RightContentHeader from "../components/RightContentHeader/RightContentHeader";
import MenuFooterHeader from "../components/MenuFooter";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const { accountInfo } = useAppSelector((state) => state.account);

  checkAccess();
  useEffect(() => {
    getUserId(userInfo()._id || "")
      .then((response) => {
        dispatch(setAccountInfo(response.data));
        sessionStorage.setItem(
          "accountInfo",
          JSON.stringify(response?.data?.userRole) || ""
        );
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("log ne");
  }, []);
  // console.log("accountInfo:: ", accountInfo);

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
          header: {
            heightLayoutHeader: 40,
            colorBgHeader: "#06762F",
            colorTextMenuActive: "#404040",
            colorTextMenuSelected: "#404040",
            colorBgMenuItemSelected: "#fff",
            colorTextMenu: "#fff",
            colorBgMenuItemHover: "#FFFFFF",
          },
          bgLayout: "#e4f5e7",

          sider: {
            // paddingInlineLayoutMenu: 6,
            paddingBlockLayoutMenu: 6,
          },
        }}
        // navTheme="light"
        // title={"Ace Bot"}
        // logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
        // logo="/GoGroup-2.png"
        logo="/logo.png"
        logoStyle={{ width: 200 }}
        iconfontUrl="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
        layout="mix"
        // route={menuData}
        rightContentRender={(props) => <RightContentHeader />}
        route={{
          routes: workplace.children,
        }}
        fixedHeader={true}
        fixSiderbar={true}
        splitMenus={true}
        // avatarProps={{
        //   // src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        //   size: "large",
        //   title: `${
        //     userInfo()
        //       ? `${userInfo().firstName}, ${userInfo().lastName} (${
        //           userInfo().userName
        //         })`
        //       : ""
        //   }`,
        //   style: { color: "#fff", backgroundColor: "#47B749" },
        //   icon: <AvatarDropdown />,
        // }}
        menu={{
          collapsedShowGroupTitle: true,
        }}
        headerTitleRender={(props) => {
          return (
            <div
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            >
              {props}{" "}
              <span
                className="header-title"
                style={{
                  margin: " 0 20px 0 10px",
                  fontFamily: "Roboto, Times, serif",
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: 1,
                  color: "#ffffff",
                }}
              >
                AceBot
              </span>
            </div>
          );
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return <MenuFooterHeader />;
        }}
        // menuDataRender={() => menuData}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              console.log("item:: ", dom);
              navigate(item?.path || "/");
              // setPathname(item.path || "/home");
            }}
          >
            {dom}
          </div>
        )}
      >
        <motion.div
          key={pathname}
          initial={accountInfo}
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
