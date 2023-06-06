import { debounce } from "lodash";
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
  createNlu,
  getListIntent,
  updateNlu,
} from "../../../services/nluService";

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

const ModalFormNlu: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  console.log("init:: ", initiateData);
  // const delayedGetListIntent = debounce(getListIntent, 3000);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value::: ", formValues);
    const trimmedData = {
      intent: formValues.intent,
      examples: formValues.examples.map((item: string) => item.trim()),
    };
    try {
      const res: any = initiateData?._id
        ? await updateNlu(initiateData?._id, trimmedData)
        : await createNlu(trimmedData);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật thành công"
            : "Tạo mới thành công",
        });
        return Promise.resolve();
      } else {
        notification.error({ message: "Thao tác không thành công" });
        onFailure?.(res);
        return Promise.reject();
      }
    } catch (error) {
      notification.error({ message: "Ý định đã được sử dụng!" });
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
      title={initiateData?._id ? "Cập nhật Nlu" : "Tạo mới Nlu"}
    >
      <Row gutter={16}>
        {/* <Col span={16}>
          <ProFormText
            label="Tên intent"
            required
            name="intent"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
            ]}
          />
        </Col> */}
        <Col span={16}>
          <ProFormSelect
            label="Tên intent"
            name="intent"
            showSearch
            initialValue={initiateData?.userRoleName}
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            // request={async () => delayedGetListIntent()}
            request={async () => getListIntent()}
          />
        </Col>
        <Col span={24}>
          <ProFormSelect
            label="Examples"
            name="examples"
            // required
            mode="tags"
            rules={
              [
                // {
                //   max: 500,
                //   message: "Vui lòng không nhập quá 500 kí tự hoặc để trống",
                //   required: true,
                // },
              ]
            }
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormNlu;
