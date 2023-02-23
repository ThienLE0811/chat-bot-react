import {
  BookOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";
import Dialogue from "../Dialogue";
import Train from "../Train";
import User from "../User";

const menuData: MenuDataItem[] = [
  {
    path: "/home/dialogue",
    name: "Dialogue",
    icon: <DatabaseOutlined />,
    element: <Dialogue />,
  },
  {
    path: "/home/train",
    name: "Train",
    icon: <BookOutlined />,
    element: <Train />,
  },
  {
    path: "/home/user",
    name: "Users",
    icon: <UserOutlined />,
    element: <User />,
  },
  {
    path: "/",
    name: "Đăng xuất",
    icon: <LogoutOutlined />,
  },
];

export default menuData;
