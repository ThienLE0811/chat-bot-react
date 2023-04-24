import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
} from "@ant-design/pro-components";
import { message, Space, Tabs } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { handleLoginApi } from "../../services/userService";
// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

import { AxiosResponse } from "axios";
import { saveCredentialCookie } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { LoginResponseSuccessData } from "../../services/data";
import { setAccountInfo } from "../../redux/slices/account";

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accountInfo } = useAppSelector((state) => state.account);
  const checkUser = async (res: AxiosResponse<any, any>) => {
    const checkLogin = res?.data?.data?.userInfo?.userRoleName;
    console.log("checkLogin", checkLogin);
    return navigate("/");
    // return checkLogin === ("ADMIN" || "USER")
    //   ? navigate("/home")
    //   : navigate("/singup");
  };

  // const checkLogin = async (res: AxiosResponse<any, any>) => {
  //   const checkLogin = res?.data?.data?.username;
  //   console.log("check::: ", checkLogin);
  //   return checkLogin ? history.push("/home") : history.push("/singup");
  // };

  const handleLogin = async (values: any) => {
    const { userName, password } = values;
    try {
      const response = await handleLoginApi(userName, password);
      console.log("res:: ", response);
      if (response) {
        const loginData: LoginResponseSuccessData = response.data?.data;
        saveCredentialCookie(loginData);
        dispatch(setAccountInfo(loginData?.userInfo));
        await checkUser(response);
        message.success("Đăng nhập thành công");
        console.log("account:: ", accountInfo?.userRoleName);
        console.log("data login:: ", loginData?.userInfo?.userRoleName);
        accountInfo?.userRoleName !== loginData?.userInfo?.userRoleName &&
          window.location.reload();
      } else {
        message.error("Đăng nhập thất bại");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
      console.log("error", error);
    }
  };

  return (
    <div className="container">
      <div className="login">
        <LoginForm
          logo="/logo.png"
          title="AceBot"
          subTitle="Nền tảng xây dựng chat bot"
          submitter={{
            searchConfig: { submitText: "Đăng nhập" },
          }}
          initialValues={{ autoLogin: true }}
          actions={[
            // </Space> //   <GoogleOutlined style={iconStyles} /> //   {/* <FacebookOutlined style={iconStyles} /> */} //   Đăng nhập với // <Space>
            <Space>
              Bạn chưa có tài khoản?
              <a href="/singup">Đăng ký</a>
            </Space>,
            <div className="footer-text">
              <p
                style={{
                  textAlign: "center",
                }}
              >
                Công ty cổ phần công nghệ AceSoft
              </p>
            </div>,
          ]}
          onFinish={handleLogin}
        >
          <Tabs centered>
            <Tabs.TabPane key={"account"} tab={"Đăng nhập tài khoản"} />
          </Tabs>

          <>
            <ProFormText
              name="userName"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Tài khoản:"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tài khoản!",
                  whitespace: true,
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Mật khẩu:"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu！",
                  whitespace: true,
                },
              ]}
            />
          </>

          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Nhớ mật khẩu
            </ProFormCheckbox>
            <a
              style={{
                float: "right",
              }}
            >
              Quên mật khẩu
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
}

export default Login;
