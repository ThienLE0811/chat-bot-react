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

export const defaultRouter: Record<string, string> = {
  "/dialogue": "/dialogue/intents",
  "/train": "/recruitment/job-board",
  "/user-management": "/user-management/user",
  "/candidate-management": "/candidate-management/candidate",
};

const checkRole = () => {
  const userRole = getCookie("userRole");

  function getCookie(name: any) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return "";
  }

  return userRole;
};

const filteredMenuItems = [
  {
    path: "",
    element: <SpaceComponent />,
  },
  {
    name: "Dialogue",
    path: "dialogue",
    icon: <FileDoneOutlined />,
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
        element: <>123321</>,
      },
      {
        name: "Slots",
        path: "slots",
        icon: <TableOutlined />,
        element: <>123321</>,
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
        element: <>Uứng dụng</>,
      },
    ],
  },
];

const filteredMenuItemsWithRole = filteredMenuItems.filter((menuItem) => {
  // Kiểm tra nếu role không phải là "ADMIN"
  if (checkRole() !== "ADMIN") {
    // Thay đổi trường element
    return (
      menuItem.path !== "components-management" &&
      menuItem.path !== "user-management"
    );
  }
  // Trả về nguyên vẹn phần tử nếu không thỏa mãn điều kiện
  return true;
});

export const workplace: RouteObject | MenuDataItem = {
  path: "/",
  element: <Home />,
  // children: [
  //   {
  //     path: "",
  //     element: <SpaceComponent />,
  //   },
  //   {
  //     name: "Dialogue",
  //     path: "dialogue",
  //     icon: <FileDoneOutlined />,
  //     // element: <PostPage />,
  //     children: [
  //       {
  //         name: "Ý định",
  //         path: "intents",
  //         icon: <ReadOutlined />,
  //         element: <Intent />,
  //       },
  //       {
  //         name: "Thực thể",
  //         path: "entity",
  //         icon: <FolderOpenOutlined />,
  //         element: <>123</>,
  //       },
  //       {
  //         name: "Phản hồi",
  //         path: "response",
  //         icon: <SwapOutlined />,
  //         element: <>123321</>,
  //       },
  //       {
  //         name: "Slots",
  //         path: "slots",
  //         icon: <TableOutlined />,
  //         element: <>123321</>,
  //       },
  //       {
  //         name: "Kho hội thoại",
  //         path: "stories",
  //         icon: <HddOutlined />,
  //         element: <>123321</>,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Train",
  //     path: "train",
  //     icon: <FileDoneOutlined />,
  //     element: <>train</>,
  //     children: [
  //       {
  //         name: "Train Model",
  //         path: "train-model",
  //         icon: <GatewayOutlined />,
  //         element: <Train></Train>,
  //       },
  //       {
  //         name: "Lịch sử train",
  //         path: "history-train",
  //         icon: <HistoryOutlined />,
  //         element: <>Người dùng</>,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Quản lý thành phần",
  //     path: `${checkRole() === "ADMIN" ? "components-management" : ""}`,
  //     icon: <FileDoneOutlined />,
  //     element: <>Quản lý ứng dụng</>,
  //     children: [
  //       {
  //         name: "Thành phần chat bot",
  //         path: "components",
  //         icon: <ClusterOutlined />,
  //         element: <>Quản lý thành phần chat bot</>,
  //       },
  //       {
  //         name: "Quản lý model",
  //         path: "components-model",
  //         icon: <ApartmentOutlined />,
  //         element: <>Uứng dụng</>,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Quản lý người dùng",
  //     path: "user-management",
  //     icon: <FileDoneOutlined />,

  //     children: [
  //       {
  //         name: "Người dùng",
  //         path: "user",
  //         icon: <UserOutlined />,
  //         element: <User></User>,
  //       },
  //       {
  //         name: "Phân quyền",
  //         path: "permission",
  //         icon: <UserSwitchOutlined />,
  //         element: <>Uứng dụng</>,
  //       },
  //     ],
  //   },
  // ],
  children: filteredMenuItemsWithRole,
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
