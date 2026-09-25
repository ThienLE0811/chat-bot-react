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
import { getRoleOptions } from "../../../services/groupService";
import { createUser, updateUser } from "../../../services/userService";
import { errorMessage } from "../../../lib/auth";

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
  const isEdit = !!initiateData?._id;
  const handleSubmit = async (formValues: any) => {
    try {
      // Khi cập nhật, bỏ trống mật khẩu nghĩa là giữ nguyên mật khẩu cũ
      const { password, ...rest } = formValues;
      const updateValues = password ? formValues : rest;
      const res = isEdit
        ? await updateUser(initiateData?._id, updateValues)
        : await createUser(formValues);
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
      // 403 đã được báo chung trong lib/auth.ts
      if ((error as any)?.response?.status !== 403) {
        message.error(errorMessage(error, "Lưu người dùng không thành công"));
      }
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
      initialValues={
        initiateData ? { ...initiateData, password: undefined } : undefined
      }
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
          <ProFormText.Password
            label={isEdit ? "Mật khẩu mới" : "Mật khẩu"}
            name="password"
            required={!isEdit}
            tooltip={isEdit ? "Bỏ trống nếu không muốn đổi mật khẩu" : undefined}
            fieldProps={{
              autoComplete: "new-password",
              placeholder: isEdit ? "Bỏ trống để giữ nguyên" : undefined,
            }}
            rules={[
              { required: !isEdit, message: "Vui lòng không bỏ trống" },
              { min: 6, message: "Mật khẩu cần ít nhất 6 kí tự" },
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
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Tên"
            name="lastName"
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>

        <Col span={8}>
          <ProFormSelect
            label="Nhóm quyền"
            name="roleCode"
            showSearch
            initialValue={initiateData?.roleCode}
            tooltip="Chỉ gán được nhóm có quyền nằm trong quyền của bạn"
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            request={async () => getRoleOptions()}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormUser;
