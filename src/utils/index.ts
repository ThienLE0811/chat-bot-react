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


  export const saveCredentialCookie = ({
  refreshToken,
  accessToken,
  expires,
  userId,
}: LoginResponseSuccessData) => {
  Cookies.set("refreshToken", refreshToken || "", {
    expires: 3000,
  });

  Cookies.set("access_token", accessToken || "", {
    expires: expires,
  });

  Cookies.set("userId", userId || "", {
    expires: 3000,
  });
};