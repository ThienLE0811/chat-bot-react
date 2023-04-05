import { MenuDataItem } from "@ant-design/pro-components";
import { RouteObject } from "react-router-dom";
import {
  ApartmentOutlined,
  ClusterOutlined,
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
import Dialogue from "../pages/Dialogue";
import Login from "../pages/login/Login";
import User from "../pages/User";
import SpaceComponent from "../pages/components/SpaceComponent";
import Intent from "../pages/intent";
import SingUp from "../pages/login/SignUp";
import { message } from "antd";
import Entities from "../pages/Entities";
import Slots from "../pages/slots";
import Response from "../pages/response";
import { checkAccess, userInfo, useRole } from "../lib/getInfo";
import Group from "../pages/Group";
import { useAppSelector } from "../hooks/redux";
import { connect } from "react-redux";
import { AccountInfo } from "../redux/slices/account/data";
import React from "react";
import { setAccountInfo } from "../redux/slices/account";

export const defaultRouter: Record<string, string> = {
  "/dialogue": "/dialogue/intents",
  "/train": "/recruitment/job-board",
  "/user-management": "/user-management/user",
};

const accountInfo: any = JSON.parse(
  sessionStorage.getItem("accountInfo") || "123"
);

console.log("accountInfo:: ", accountInfo);

const filteredMenuItems: MenuDataItem = [
  {
    path: "",
    element: <SpaceComponent />,
  },
  {
    name: "Dialogue",
    path: "dialogue",
    icon: <FileDoneOutlined />,
    hideInMenu: accountInfo.DIALOGUE_MANAGEMENT ? false : true,
    // element: <PostPage />,
    children: [
      {
        name: "Ý định",
        path: "intents",
        icon: <ReadOutlined />,
        element: <Intent />,
      },
      {
        name: "Thực thể",
        path: "entity",
        icon: <FolderOpenOutlined />,
        element: <Entities />,
      },
      {
        name: "Phản hồi",
        path: "response",
        icon: <SwapOutlined />,
        element: <Response />,
      },
      {
        name: "Slots",
        path: "slots",
        icon: <TableOutlined />,
        element: <Slots />,
      },
      {
        name: "Kho hội thoại",
        path: "stories",
        icon: <HddOutlined />,
        element: <>123321</>,
      },
    ],
  },
  {
    name: "Train",
    path: "train",
    icon: <FileDoneOutlined />,
    hideInMenu: accountInfo.TRAIN_MANAGEMENT ? false : true,
    element: <>train</>,
    children: [
      {
        name: "Train Model",
        path: "train-model",
        icon: <GatewayOutlined />,
        element: <Train></Train>,
      },
      {
        name: "Lịch sử train",
        path: "history-train",
        icon: <HistoryOutlined />,
        element: <>Người dùng</>,
      },
    ],
  },
  {
    name: "Quản lý thành phần",
    path: "components-management",
    icon: <FileDoneOutlined />,
    element: <>Quản lý ứng dụng</>,
    hideInMenu: accountInfo.COMPONENT_MANAGEMENT ? false : true,
    children: [
      {
        name: "Thành phần chat bot",
        path: "components",
        icon: <ClusterOutlined />,
        element: <>Quản lý thành phần chat bot</>,
      },
      {
        name: "Quản lý model",
        path: "components-model",
        icon: <ApartmentOutlined />,
        element: <>Uứng dụng</>,
      },
    ],
  },
  {
    name: "Quản lý người dùng",
    path: "user-management",
    icon: <FileDoneOutlined />,
    hideInMenu: accountInfo.USER_MANAGEMENT ? false : true,
    children: [
      {
        name: "Người dùng",
        path: "user",
        icon: <UserOutlined />,
        element: <User></User>,
      },
      {
        name: "Phân quyền",
        path: "permission",
        icon: <UserSwitchOutlined />,
        element: <Group />,
      },
    ],
  },
];

// const filteredMenuItemsWithRole = filteredMenuItems.filter((menuItem) => {

//   return true;
// });

const filteredMenuItemsWithRole = filteredMenuItems.filter((menuItem: any) => {
  return true;
});

export const workplace: RouteObject | MenuDataItem = {
  path: "/",
  element: <Home />,
  children: filteredMenuItemsWithRole,
};

export const routes: MenuDataItem[] | RouteObject[] = [
  {
    path: "*",
    name: "404",
    element: <>123</>,
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

//   workplace: workplace,
//   all: routes,
//   defaultRouter: defaultRouter,
// };
