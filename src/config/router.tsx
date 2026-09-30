import { MenuDataItem } from "@ant-design/pro-components";
import { Navigate, RouteObject } from "react-router-dom";
import {
  ApartmentOutlined,
  ClusterOutlined,
  CommentOutlined,
  MessageOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  GatewayOutlined,
  GlobalOutlined,
  HddOutlined,
  HistoryOutlined,
  NotificationOutlined,
  ReadOutlined,
  SwapOutlined,
  TableOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import Home from "../pages/Home/Home";
import Train from "../pages/Train";
import ChatTest from "../pages/ChatTest";
import Conversations from "../pages/Conversations";
import Dialogue from "../pages/Dialogue";
import Login from "../pages/login/Login";
import User from "../pages/User";
import Welcome from "../pages/Welcome";
import Intent from "../pages/intent";
import SingUp from "../pages/login/SignUp";
import { message } from "antd";
import Entities from "../pages/Entities";
import Slots from "../pages/slots";
import Response from "../pages/response";
import { can, storedPermissions } from "../lib/auth";
import Group from "../pages/Group";
import { useAppSelector } from "../hooks/redux";
import { connect } from "react-redux";
import { AccountInfo } from "../redux/slices/account/data";
import React from "react";
import { setAccountInfo } from "../redux/slices/account";
import NoFoundPage from "../pages/components/404";
import Stories from "../pages/Stories";
import Nlu from "../pages/Nlu";
import Rules from "../pages/Rules";
import History from "../pages/History";
import HistoryTrain from "../pages/History";
import RequirePermission from "../pages/components/RequirePermission";

// Menu dựng một lần lúc tải trang, theo quyền lưu từ /auth/me.
// Ẩn menu chỉ để gọn giao diện; backend mới là nơi chặn quyền.
const permissions = storedPermissions();
const hidden = (permission: string) => !can(permission, permissions);
// Vào thẳng bằng URL mà không có quyền thì thấy trang 403.
const guard = (permission: string, page: React.ReactNode) => (
  <RequirePermission permission={permission}>{page}</RequirePermission>
);

const filteredMenuItems: MenuDataItem = [
  {
    path: "",
    element: <Welcome />,
  },
  {
    name: "Dialogue",
    path: "dialogue",
    icon: <FileDoneOutlined />,
    hideInMenu: hidden("dialogue.read"),
    // element: <PostPage />,
    children: [
      {
        name: "Ý định",
        path: "intents",
        icon: <ReadOutlined />,
        element: guard("dialogue.read", <Intent />),
      },
      {
        name: "Thực thể",
        path: "entity",
        icon: <FolderOpenOutlined />,
        element: guard("dialogue.read", <Entities />),
      },
      {
        name: "Phản hồi",
        path: "response",
        icon: <SwapOutlined />,
        element: guard("dialogue.read", <Response />),
      },
      {
        name: "Slots",
        path: "slots",
        icon: <TableOutlined />,
        element: guard("dialogue.read", <Slots />),
      },

      {
        name: "Nlu",
        path: "nlu",
        icon: <CreditCardOutlined />,
        element: guard("dialogue.read", <Nlu />),
      },
      {
        name: "Rules",
        path: "rules",
        icon: <ApartmentOutlined />,
        element: guard("dialogue.read", <Rules />),
      },
      {
        name: "Kho hội thoại",
        path: "stories",
        icon: <HddOutlined />,
        element: guard("dialogue.read", <Stories />),
      },
    ],
  },
  {
    name: "Train",
    path: "train",
    icon: <FileDoneOutlined />,
    hideInMenu:
      hidden("train.read") &&
      hidden("chat_test.use") &&
      hidden("conversations.read"),
    children: [
      {
        name: "Train Model",
        path: "train-model",
        icon: <GatewayOutlined />,
        element: guard("train.read", <Train />),
        hideInMenu: hidden("train.read"),
      },
      {
        name: "Chat thử",
        path: "chat-test",
        icon: <CommentOutlined />,
        element: guard("chat_test.use", <ChatTest />),
        hideInMenu: hidden("chat_test.use"),
      },
      {
        name: "Hội thoại thật",
        path: "conversations",
        icon: <MessageOutlined />,
        element: guard("conversations.read", <Conversations />),
        hideInMenu: hidden("conversations.read"),
      },
      {
        name: "Lịch sử train",
        path: "history-train",
        icon: <HistoryOutlined />,
        element: guard("train.read", <HistoryTrain />),
        hideInMenu: hidden("train.read"),
      },
    ],
  },
  // {
  //   name: "Quản lý thành phần",
  //   path: "components-management",
  //   icon: <FileDoneOutlined />,
  //   element: <>Quản lý ứng dụng</>,
  //   hideInMenu: accountInfo.COMPONENT_MANAGEMENT ? false : true,
  //   children: [
  //     {
  //       name: "Thành phần chat bot",
  //       path: "components",
  //       icon: <ClusterOutlined />,
  //       element: <>Quản lý thành phần chat bot</>,
  //     },
  //     {
  //       name: "Quản lý model",
  //       path: "components-model",
  //       icon: <ApartmentOutlined />,
  //       element: <>Uứng dụng</>,
  //     },
  //   ],
  // },
  {
    name: "Quản lý người dùng",
    path: "user-management",
    icon: <FileDoneOutlined />,
    hideInMenu: hidden("users.read") && hidden("roles.read"),
    children: [
      {
        name: "Người dùng",
        path: "user",
        icon: <UserOutlined />,
        element: guard("users.read", <User />),
        hideInMenu: hidden("users.read"),
      },
      {
        name: "Phân quyền",
        path: "permission",
        icon: <UserSwitchOutlined />,
        element: guard("roles.read", <Group />),
        hideInMenu: hidden("roles.read"),
      },
    ],
  },
];

// const filteredMenuItemsWithRole = filteredMenuItems.filter((menuItem) => {

//   return true;
// });

// Vào route cha (vd: /train) thì tự chuyển tới route con đầu tiên được thấy (vd: /train/train-model)
const withDefaultChild = (menuItem: any) => {
  const firstChild = menuItem.children?.find(
    (child: any) => child.path && !child.hideInMenu
  );
  if (!firstChild) return menuItem;
  return {
    ...menuItem,
    children: [
      {
        index: true,
        hideInMenu: true,
        element: <Navigate to={firstChild.path} replace />,
      },
      ...menuItem.children,
    ],
  };
};

const filteredMenuItemsWithRole = filteredMenuItems
  .filter((menuItem: any) => {
    return true;
  })
  .map(withDefaultChild);

export const workplace: RouteObject | MenuDataItem = {
  path: "/",
  element: <Home />,
  children: filteredMenuItemsWithRole,
};

export const routes: MenuDataItem[] | RouteObject[] = [
  {
    path: "*",
    name: "404",
    element: <NoFoundPage />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/singup",
    element: <SingUp />,
  },
  workplace,
];
