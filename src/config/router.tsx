import { MenuDataItem } from "@ant-design/pro-components";
import { RouteObject } from "react-router-dom";
import {
  FileDoneOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  NotificationOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import Home from "../pages/Home/Home";
import Train from "../pages/Train";
import Dialogue from "../pages/Dialogue";
import Login from "../pages/login/Login";

export const defaultRouter: Record<string, string> = {
  "/cms": "/cms/posts",
  "/recruitment": "/recruitment/job-board",
  "/user-management": "/user-management/user",
  "/candidate-management": "/candidate-management/candidate",
};

export const workplace: RouteObject | MenuDataItem = {
  path: "/",
  element: <Home />,
  children: [
    {
      name: "Dialogue",
      path: "dialogue",
      icon: <ReadOutlined />,
      // element: <PostPage />,
      children: [
        {
          name: "Bài viết",
          path: "posts",
          icon: <ReadOutlined />,
          element: <Dialogue />,
        },
        {
          name: "Chuyên mục",
          path: "category",
          icon: <FolderOpenOutlined />,
          element: <>123</>,
        },
        {
          name: "Menu",
          path: "menu",
          icon: <NotificationOutlined />,
          element: <>123321</>,
        },
      ],
    },
    {
      name: "Train",
      path: "recruitment",
      icon: <FileDoneOutlined />,
      element: <>train</>,
      children: [
        {
          name: "Công việc",
          path: "job-board",
          icon: <FolderOpenOutlined />,
          element: <Train></Train>,
        },
        {
          name: "Thư mục",
          path: "folder",
          icon: <ReadOutlined />,
          element: <>Người dùng</>,
        },
        {
          name: "Mẫu việc làm",
          path: "job-template",
          icon: <FolderOpenOutlined />,
          element: <>Người dùng</>,
        },
      ],
    },
    {
      name: "Quản lý ứng dụng",
      path: "user-management",
      icon: <FileDoneOutlined />,
      element: <>Quản lý ứng dụng</>,
      children: [
        {
          name: "Người dùng",
          path: "user",
          icon: <ReadOutlined />,
          element: <>Người dùng</>,
        },
        {
          name: "Phân quyền",
          path: "permission",
          icon: <FolderOpenOutlined />,
          element: <>Uứng dụng</>,
        },
      ],
    },
  ],
};

export const routes: MenuDataItem[] | RouteObject[] = [
  {
    path: "*",
    name: "404",
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
  workplace,
];

//   workplace: workplace,
//   all: routes,
//   defaultRouter: defaultRouter,
// };
