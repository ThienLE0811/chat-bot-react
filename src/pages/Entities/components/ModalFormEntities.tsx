import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProFormInstance,
  ProFormItem,
} from "@ant-design/pro-components";
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
import {
  createEntities,
  updateEntities,
} from "../../../services/entitiesService";
import { createIntent, updateIntent } from "../../../services/intentServices";

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

const ModalFormEntities: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  console.log("init:: ", initiateData);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value::: ", formValues);

    try {
      const res: any = initiateData?._id
        ? await updateEntities(initiateData?._id, formValues)
        : await createEntities(formValues);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật thực thể thành công"
            : "Tạo mới thực thể thành công",
        });
        return Promise.resolve();
      } else {
        notification.error({ message: "Thao tác không thành công" });
        onFailure?.(res);
        return Promise.reject();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalForm
      open={visible}
      initialValues={initiateData}
      modalProps={{
        destroyOnClose: true,
        okText: "Xác nhận",
      }}
      className="modal-form-user"
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?._id ? "Cập nhật thực thể" : "Tạo mới thực thể"}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProFormText
            label="Tên"
            required
            name="nameEntities"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProFormTextArea
            label="Mô tả"
            required
            name="description"
            rules={[
              {
                max: 1000,
                message: "Vui lòng không nhập quá 1000 kí tự hoặc để trống",
                required: true,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProFormSelect
            label="Nội dung"
            name="dataEntities"
            // required
            mode="tags"
            // rules={[
            //   {
            //     max: 500,
            //     message: "Vui lòng không nhập quá 500 kí tự hoặc để trống",
            //     required: true,
            //   },
            // ]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormEntities;
