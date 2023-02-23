import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { message, Space, Tabs } from "antd";
import { CSSProperties, useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { handleSingUpApi } from "../../services/userService";

const iconStyles: CSSProperties = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

function SingUp() {
  const navigate = useNavigate();
  const handleSignUp = async (values: any) => {
    const { username, password, email } = values;
    try {
      const res = await handleSingUpApi(username, password, email);
      console.log(res?.data);
      message.success("Đăng ký thành công");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error("Đăng ký thất bại");
    }
  };

  return (
    <div className="container">
      <div className="singup">
        <LoginForm
          logo="https://gogroup.vn/wp-content/uploads/2022/12/gogroup-logo.png"
          title="AceBot"
          subTitle="Nền tảng xây dựng chat bot"
          submitter={{
            searchConfig: { submitText: "Đăng ký" },
          }}
          onFinish={handleSignUp}
        >
          <Tabs centered>
            <Tabs.TabPane key={"account"} tab={"Đăng ký tài khoản"} />
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

            <ProFormText
              name="email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Email:"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                  whitespace: true,
                  type: "email",
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
            <ProFormText.Password
              name="confirm_password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Nhập lại mật khẩu:"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu！",
                  whitespace: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Hai mật khẩu bạn đã nhập không khớp!")
                    );
                  },
                }),
              ]}
            />
          </>
        </LoginForm>
      </div>
    </div>
  );
}

export default SingUp;
