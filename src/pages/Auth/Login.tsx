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
import { CSSProperties, useState } from "react";
import "./Login.css";

import { handleLoginApi } from "../../services/userService";

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function Login() {
  const handleLogin = async (values: any) => {
    const { username, password } = values;
    await handleLoginApi(username, password)
      .then((res) => {
        console.log(res);
        message.success("Đăng nhập thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Đăng nhập thất bại");
      });
  };

  return (
    <div className="container">
      <ProConfigProvider hashed={false}>
        <div className="login">
          <LoginForm
            logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
            title="AceBot"
            subTitle="Nền tảng xây dựng chat bot"
            submitter={{
              searchConfig: { submitText: "Đăng nhập" },
            }}
            initialValues={{ autoLogin: true }}
            actions={
              <Space>
                Đăng nhập với
                <FacebookOutlined style={iconStyles} />
                <GoogleOutlined style={iconStyles} />
              </Space>
            }
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
      </ProConfigProvider>
    </div>
  );
}

export default Login;
