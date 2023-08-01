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
  Input,
  message,
  notification,
  Row,
  Tooltip,
} from "antd";
import React, { useRef, useState } from "react";
import { getPermissionRole } from "../../../services/groupService";
import {
  createUser,
  updateUser,
  handleLoginApi,
  handleSingUpApi,
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

const ModalFormUser: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res = initiateData?._id
        ? await updateUser(initiateData?._id, formValues)
        : await handleSingUpApi(formValues);
      console.log("log user:: ", res);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();

        notification.success({
          message: initiateData?._id
            ? "Cập nhật Người dùng thành công"
            : "Tạo mới Người dùng thành công",
        });
        return Promise.resolve();
      } else {
        onFailure?.(res?.data);
        return Promise.reject();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalForm
      open={visible}
      //   request={async () =>
      //     !initiateData?.usrUid
      //       ? { usrStatus: "ACTIVE" }
      //       : (await api.user.getUserById(initiateData?.usrUid)).body?.dataRes
      //   }
      modalProps={{
        destroyOnClose: true,
        okText: "Xác nhận",
      }}
      initialValues={initiateData}
      className="modal-form-user"
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?._id ? "Cập nhật người dùng" : "Tạo mới người dùng"}
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProFormText
            label="Tài khoản"
            name="userName"
            disabled={initiateData?._id ? true : false}
            required
            rules={[
              { max: 100, message: "Vui lòng không nhập quá 100 kí tự" },
              { required: true, message: "Vui lòng không bỏ trống!" },
            ]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Email"
            name="email"
            disabled={initiateData?._id ? true : false}
            required
            rules={[
              { max: 100, message: "Vui lòng không nhập quá 100 kí tự" },
              { required: true, message: "Vui lòng không bỏ trống" },
            ]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Mật khẩu"
            name="password"
            disabled={initiateData?._id ? true : false}
            required
            rules={[
              // { max: 20, message: "Vui lòng không nhập quá 20 kí tự" },
              { required: true, message: "Vui lòng không bỏ trống" },
            ]}
          />
        </Col>
        {/* <Col span={8}>
          <ProFormSelect
            label="Trạng thái"
            name="usrStatus"
            allowClear={false}
            valueEnum={{
              ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
              INACTIVE: {
                text: <Badge status="error" text="Không hoạt động" />,
              },
            }}
          />
        </Col> */}
        <Col span={8}>
          <ProFormText
            label="Họ"
            name="firstName"
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Tên"
            name="lastName"
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>

        {/* <Col span={8}>
          <ProFormText
            label="Vai trò"
            name="userRoleName"
            // disabled
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
          />
        </Col> */}
        <Col span={8}>
          <ProFormSelect
            label="Vai trò"
            name="userRoleName"
            showSearch
            initialValue={initiateData?.userRoleName}
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            request={async () => getPermissionRole()}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormUser;
