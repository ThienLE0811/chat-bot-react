import { message } from "antd";

const getCookie = function getCookie(name: any) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return "";
    }

const checkAccess = () => {
    const userRole = getCookie("userRole");
    const userName = getCookie("userName");

    if (!userName) {
      message.success("Vui lòng đăng nhập lại");
      window.location.href = "/auth/login";
    }

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

const userInfo = () => {
    const userRole = getCookie("userRole");
    const userName = getCookie("userName");
    const firstName = getCookie("firstName");
    const lastName = getCookie("lastName");

    return {userName,firstName,lastName,userRole}
}

  export {checkAccess, userInfo}