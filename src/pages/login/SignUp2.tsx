import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LoginForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, message, Space, Tabs } from "antd";
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

function SingUp2() {
  const navigate = useNavigate();
  const handleSignUp = async (values: any) => {
    console.log("values:: ", values);
    const { userName, password, email } = values;
    try {
      const res = await handleSingUpApi(userName, password, email);
      console.log(res?.data);
      message.success("Đăng ký thành công");
      navigate("/auth/login");
    } catch (err: any) {
      message.error(err?.response?.data?.message);
      // console.log("err:: ", err?.response?.data?.message);
    }
  };

  return (
    <ProForm
      onFinish={handleSignUp}
      submitter={{
        searchConfig: {
          submitText: "Xác nhận",
        },
        resetButtonProps: false,
        render({ form }, dom) {
          return <div style={{ display: "flex" }}>{dom}</div>;
        },
      }}
    >
      <ProFormText
        name="userName"
        label="Username"
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
        label="Email"
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
    </ProForm>
  );
}

export default SingUp2;
