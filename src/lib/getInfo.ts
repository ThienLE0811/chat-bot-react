import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";



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
    const access_token= getCookie("access_token");
    const userName = getCookie("userName");
    
    
    
    if (!access_token) {
      message.success("Phiên bản hết hạn vui lòng đăng nhập lại");
      window.location.href = "/auth/login";
      
      return " "
    }

    return "OK"

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
    // const userRole = decodeURIComponent(getCookie("userRole"));
    const userRole = getCookie("userRole").replace(/%22/g, ' ').trim();
    const userName = getCookie("userName");
    const firstName = getCookie("firstName");
    const lastName = getCookie("lastName");
    const _id = getCookie("_id");
    
    return {userName,firstName,lastName,userRole,_id}
}

function useRole()  {
  const { accountInfo } = useAppSelector((state) => state.account);
  return accountInfo?.userRole
}



  export {checkAccess, userInfo, useRole}