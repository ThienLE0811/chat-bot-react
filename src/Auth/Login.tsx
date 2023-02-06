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
import type { CSSProperties } from "react";
import { useState } from "react";
import "./Login.css";

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function Login() {
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: "white" }} className="login">
        <LoginForm
          logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
          title="AceBot"
          subTitle="Nền tảng xây dựng chat bot"
          submitter={{
            searchConfig: { submitText: "Đăng nhập" },
          }}
          actions={
            <Space>
              Đăng nhập với
              <FacebookOutlined style={iconStyles} />
              <GoogleOutlined style={iconStyles} />
            </Space>
          }
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
              style={{
                float: "left",
              }}
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
  );
}

export default Login;
