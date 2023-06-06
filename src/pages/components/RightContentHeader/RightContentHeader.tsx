import {
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, MenuProps } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import { handleLogoutApi } from "../../../services/userService";
import { clearCredentialCookie } from "../../../utils";
import "./index.css";
function RightContentHeader() {
  const navigate = useNavigate();
  const { accountInfo } = useAppSelector((state) => state.account);

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="0" icon={<ProfileOutlined />}>
  //       Profile
  //     </Menu.Item>

  //     <Menu.Divider />
  //     <Menu.Item
  //       key="2"
  //       onClick={async () => {
  //         await handleLogoutApi();
  //         clearCredentialCookie();
  //         navigate("/auth/login");
  //       }}
  //       icon={<LogoutOutlined />}
  //     >
  //       Đăng xuất
  //     </Menu.Item>
  //   </Menu>
  // );

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: async () => {
        await handleLogoutApi();
        clearCredentialCookie();
        navigate("/auth/login");
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]}>
      <span
        style={{ display: "flex", alignItems: "center" }}
        className={`action account`}
      >
        <Avatar icon={<UserOutlined />} className={"avatar"} />
        <div
          className={"name"}
          style={{ color: "#ffffff" }}
        >{`${accountInfo?.firstName},${accountInfo?.lastName}(${accountInfo?.userName})`}</div>
      </span>
    </Dropdown>
  );
}

export default RightContentHeader;
