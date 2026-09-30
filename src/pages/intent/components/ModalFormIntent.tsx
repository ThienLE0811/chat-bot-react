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

const ModalFormUser: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  console.log("init:: ", initiateData);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value::: ", formValues);

    try {
      const res: any = initiateData?._id
        ? await updateIntent(initiateData?._id, formValues)
        : await createIntent(formValues);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật ý định thành công"
            : "Tạo mới ý định thành công",
        });
        return Promise.resolve();
      } else {
        notification.error({ message: "Thao tác không thành công" });
        onFailure?.(res);
        return Promise.reject();
      }
    } catch (error: any) {
      // e.g. the code is taken, or an example already belongs to another intent.
      const reason = error?.response?.data?.message;
      notification.error({
        message: "Thao tác không thành công",
        description: Array.isArray(reason) ? reason.join(". ") : reason,
      });
      onFailure?.(error);
      return Promise.reject();
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
      title={initiateData?._id ? "Cập nhật ý định" : "Tạo mới ý định"}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProFormText
            label="Mã ý định"
            tooltip="Mã Rasa dùng để train, ví dụ ask_user_name"
            required
            name="title"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
              {
                pattern: /^[A-Za-z0-9_]+$/,
                message: 'Mã ý định chỉ gồm chữ không dấu, số và "_"',
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProFormText
            label="Tên tiếng Việt"
            tooltip="Tên dễ hiểu hiển thị cho người dùng khi chọn ý định"
            name="description"
            placeholder="Ví dụ: Hỏi giờ làm việc"
            rules={[
              { max: 200, message: "Vui lòng không nhập quá 200 kí tự" },
            ]}
          />
        </Col>
        {/* <Col span={8}>
          <ProFormSelect
            label="Trạng thái"
            required
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
        <Col span={24}>
          <ProFormSelect
            label="Câu mẫu"
            name="examples"
            mode="tags"
            tooltip="Những câu người dùng hay nói cho ý định này, bot học từ đây khi train. Gõ một câu rồi bấm Enter. Nên có 8–15 câu."
            placeholder="Ví dụ: mấy giờ bên bạn mở cửa"
            fieldProps={{ tokenSeparators: ["\n"], open: false }}
            extra="Đánh dấu thực thể bằng [giá trị](tên_thực_thể), ví dụ: tên mình là [Thiện](customer_name)"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormUser;
