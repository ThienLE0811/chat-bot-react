import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import type { ActionType, ProFormInstance } from "@ant-design/pro-components";
import {
  ModalForm,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Tabs,
  Tooltip,
} from "antd";
import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { setCurrentParse } from "../../../redux/slices/account";
import { getPermissionRole } from "../../../services/groupService";
import { parseMessage } from "../../../services/trainService";
import {
  createUser,
  updateUser,
  handleLoginApi,
} from "../../../services/userService";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<any>;

export type ModalFormUserProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: () => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormTrain: React.FC = () => {
  //   const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
  //     props;
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const dispatch = useAppDispatch();
  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res: any = await parseMessage(formValues);

      console.log("log user:: ", res);
      if (res) {
        // onVisibleChange(false);
        // onSuccess?.();
        dispatch(setCurrentParse(res));
        notification.success({
          message: "Kiểm tra độ chính xác thành công",
        });
        return Promise.resolve();
      } else {
        // onFailure?.(res?.data);
        notification.error({
          message: "Kiểm tra độ chính xác không thành công",
        });
        return Promise.reject();
      }
    } catch (error) {
      notification.error({
        message: "Kiểm tra độ chính xác không thành công",
      });
      console.log(error);
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      //   onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Text"
        name="text"
        rules={[{ required: true, message: "Vui lòng không để trống!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModalFormTrain;
