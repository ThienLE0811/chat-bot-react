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

  Cookies.set("userName", data?.userInfo?.userName || "", {
    expires: 3000,
  });

  Cookies.set("_id", data?.userInfo?._id || "", {
    expires: 3000,
  });

  Cookies.set("firstName", data?.userInfo?.firstName || "", {
    expires: 3000,
  });

  Cookies.set("lastName", data?.userInfo?.lastName || "", {
    expires: 3000,
  });

  Cookies.set("userRoleName", JSON.stringify(data?.userInfo?.userRoleName) || "", {
    expires: 3000
  });

  sessionStorage.setItem(
          "accountInfo",
          JSON.stringify(data?.userInfo?.userRole)
        );
};

//httpOnly: true

export const clearCredentialCookie = () => {
  Cookies.remove("userRoleName", { path: "/" });
  Cookies.remove("userName", { path: "/" });
  Cookies.remove("firstName", { path: "/" });
  Cookies.remove("lastName", { path: "/" });
  Cookies.remove("userInfo", { path: "/" });
  Cookies.remove("access_token", { path: "/"});
  Cookies.remove("_id", { path: "/" });
  sessionStorage.removeItem('accountInfo');
};