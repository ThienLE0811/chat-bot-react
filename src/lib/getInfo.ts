import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const getCookie = function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return "";
};

const checkAccess = () => {
  const access_token = getCookie("access_token");
  const userName = getCookie("userName");

  if (!access_token || !userName) {
    message.success("Phiên bản hết hạn vui lòng đăng nhập lại");
    window.location.href = "/auth/login";

    return " ";
  }

  return "OK";

  // function getCookie(name: any) {
  //   const cookies = document.cookie.split(";");
  //   for (let i = 0; i < cookies.length; i++) {
  //     const cookie = cookies[i].trim();
  //     if (cookie.startsWith(name + "=")) {
  //       return cookie.substring(name.length + 1);
  //     }
  //   }
  //   return "";
  // }
};

// Quyền: xem lib/auth.ts (can, useCan).
const userInfo = () => {
  const userName = getCookie("userName");
  const firstName = getCookie("firstName");
  const lastName = getCookie("lastName");
  const _id = getCookie("_id");

  return { userName, firstName, lastName, _id };
};

export { checkAccess, userInfo };
