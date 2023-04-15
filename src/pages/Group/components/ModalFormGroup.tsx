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
import { updatePermission } from "../../../services/groupService";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<any>;

export type ModalFormGroupProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: () => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormGroup: React.FC<ModalFormGroupProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log(formValues);

    try {
      const res = initiateData?._id
        ? await updatePermission(initiateData?._id, formValues)
        : await Promise.reject();
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();

        notification.success({
          message: initiateData?._id
            ? "Cập nhật nhóm thành công"
            : "Tạo mới nhóm thành công",
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
      width={"50%"}
      modalProps={{
        destroyOnClose: true,
        okText: "Xác nhận",
      }}
      initialValues={initiateData}
      className="modal-form-user"
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?._id ? "Cập nhật nhóm" : "Tạo mới nhóm"}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            label="Tên nhóm"
            name="name"
            required
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Code nhóm"
            name="roleType"
            required
            disabled
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Nhóm"
            name="description"
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormGroup;
