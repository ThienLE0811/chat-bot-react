import { MenuDataItem } from "@ant-design/pro-layout";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { RouteObject } from "react-router";
import { LoginResponseSuccessData } from "../services/data";

export const newStructureRoutesProLayout = (
  props: RouteObject[] = []
): MenuDataItem =>
  props.map((routerObj) => ({
    ...routerObj,
    ...(routerObj?.children && {
      routes: routerObj.children.map((value) =>
        newStructureRoutesProLayout([value])
      ),
    }),
  }));


  export const saveCredentialCookie = (
  data:any) => {
  // Cookies.set("refreshToken", refreshToken || "", {
  //   expires: 3000,
  // });

  Cookies.set("access_token", data?.token?.token || "", {
    expires: 3000,
  });

  Cookies.set("userName", data?.userInfo?.username || "", {
    expires: 3000,
  });

  Cookies.set("firstName", data?.userInfo?.firstname || "", {
    expires: 3000,
  });

  Cookies.set("lastName", data?.userInfo?.lastname || "", {
    expires: 3000,
  });

  Cookies.set("userRole", JSON.stringify(data?.userInfo?.userRole) || "", {
    expires: 3000
  });
};

//httpOnly: true

export const clearCredentialCookie = () => {
  Cookies.remove("userRole", { path: "/" });
  Cookies.remove("userName", { path: "/" });
  Cookies.remove("firstName", { path: "/" });
  Cookies.remove("lastName", { path: "/" });
  Cookies.remove("userInfo", { path: "/" });
  Cookies.remove("access_token", { path: "/"});
};