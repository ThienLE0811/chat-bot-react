import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProFormInstance,
  ProFormItem,
  ProFormList,
  ProFormSwitch,
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
  Divider,
  Input,
  message,
  notification,
  Row,
  Tooltip,
} from "antd";
import React, { useRef, useState } from "react";
import { createIntent, updateIntent } from "../../../services/intentServices";
import { createSlots, updateSlots } from "../../../services/slotsService";
import { createStories, updateStories } from "../../../services/stories";

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

const ModalFormStories: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;

  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value::: ", formValues);

    try {
      const res: any = initiateData?._id
        ? await updateStories(initiateData?._id, formValues)
        : await createStories(formValues);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật stories thành công"
            : "Tạo mới stories thành công",
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
      width={"40%"}
      className="modal-form-user"
      formRef={restFormRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?._id ? "Cập nhật stories" : "Tạo mới stories"}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProFormText
            label="Tên"
            required
            name="story"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
            ]}
          />
        </Col>

        <Col span={8}>
          <ProFormText name="steps" hidden />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormStories;
