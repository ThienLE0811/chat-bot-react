import { FacebookOutlined, GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
  FooterToolbar,
} from "@ant-design/pro-components";
import { message, Space, Tabs } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { getMe, handleLoginApi } from "../../services/userService";
import { saveCredentialCookie } from "../../utils";
import { errorMessage, storePermissions } from "../../lib/auth";
import { useAppDispatch } from "../../hooks/redux";
import { LoginResponseSuccessData } from "../../services/data";
import { setAccountInfo } from "../../redux/slices/account";
import { Footer } from "antd/es/layout/layout";
import SingUp from "./SignUp";
import SingUp2 from "./SignUp2";
import Link from "antd/es/typography/Link";

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
  const handleLogin = async (values: any) => {
    const { userName, password } = values;
    try {
      const response = await handleLoginApi(userName, password);
      const loginData: LoginResponseSuccessData = response.data?.data;
      saveCredentialCookie(loginData);
      const me = await getMe();
      dispatch(setAccountInfo(me.user));
      storePermissions(me.permissions);
      message.success("Đăng nhập thành công");
      // Tải lại cả trang: menu được dựng lúc tải, theo quyền vừa lưu.
      window.location.href = "/";
    } catch (error: any) {
      message.error(errorMessage(error, "Đăng nhập thất bại"));
    }
  };

  return (
    <div className="container">
      <div className="login">
        <LoginForm
          logo="/logo.svg"
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
              {/* <a href="/singup">Đăng ký</a> */}
              <Link onClick={() => navigate("/singup")}>Đăng ký</Link>
            </Space>,
            // <div className="footer-text">
            //   <p
            //     style={{
            //       textAlign: "center",
            //     }}
            //   >
            //     Công ty cổ phần công nghệ
            //   </p>
            // </div>,
          ]}
          onFinish={handleLogin}
        >
          <Tabs centered>
            <Tabs.TabPane key={"account"} tab={"Đăng nhập tài khoản"} />
            {/* <Tabs.TabPane
              key={"signup"}
              tab={"Đăng kí tài khoản"}
              children={<SingUp2 />}
        /> */}
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
            {/* <a
              style={{
                float: "right",
              }}
            >
              Quên mật khẩu
            </a> */}
          </div>
        </LoginForm>

        {/* <div className="form-login">
        </div> */}
      </div>
    </div>
  );
}

export default Login;
