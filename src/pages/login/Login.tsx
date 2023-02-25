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

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function Login() {
  const navigate = useNavigate();

  const saveCookie = async (res: AxiosResponse<any, any>) => {
    const token = res?.data?.data?.token?.decodeData;
    console.log("token::: ", token);
    document.cookie = `token=${token}`;
    console.log("doc::: ", document.cookie);
  };

  const checkUser = async (res: AxiosResponse<any, any>) => {
    const checkLogin = res?.data?.data?.userRole;
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
    const { username, password } = values;
    try {
      const res = await handleLoginApi(username, password);
      message.success("Đăng nhập thành công");
      await saveCookie(res);
      await checkUser(res);
      // await checkLogin(res);
    } catch (err) {
      console.error(err);
      message.error("Đăng nhập thất bại");
    }
  };

  return (
    <div className="container">
      <div className="login">
        <LoginForm
          logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
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
              name="username"
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
