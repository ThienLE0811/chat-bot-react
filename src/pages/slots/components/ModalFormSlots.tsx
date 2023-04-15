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

const ModalFormSlots: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  console.log("init:: ", initiateData);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value::: ", formValues);

    try {
      const res: any = initiateData?._id
        ? await updateSlots(initiateData?._id, formValues)
        : await createSlots(formValues);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật slots thành công"
            : "Tạo mới slots thành công",
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
      title={initiateData?._id ? "Cập nhật slots" : "Tạo mới slots"}
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProFormText
            label="Tên"
            required
            name="nameSlot"
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
          <ProFormText
            label="Kiểu"
            // required
            name="type"
            // rules={[
            //   {
            //     max: 100,
            //     message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
            //     required: true,
            //   },
            // ]}
          />
        </Col>
        <Col span={8}>
          {/* <ProFormSelect
            label="auto Fill"
            name="autoFill"
            allowClear={false}
            initialValue={initiateData?.autoFill}
            valueEnum={{
              true: { text: <Badge status="success" text="True" /> },
              false: {
                text: <Badge status="error" text="False" />,
              },
            }}
          /> */}
          <ProFormSwitch name="autoFill" label="auto Fill" />
        </Col>
        <Col span={24}>
          <ProFormList
            label="Mapping"
            name="mapping"
            max={5}
            // copyIconProps={{ tooltipText: "Sao chép câu hỏi này" }}
            copyIconProps={false}
            deleteIconProps={{ tooltipText: "Xóa mapping này" }}
            creatorButtonProps={{ creatorButtonText: "Thêm mapping" }}
            style={{ padding: 2, backgroundColor: "#F1F5F8" }}
          >
            <Row gutter={16} style={{ paddingTop: 12 }}>
              <Divider children={`Điền thông tin mapping:`} />
              <Col span={8}>
                <ProFormText
                  label="Kiểu"
                  name="type"
                  placeholder={"Nhập kiểu"}
                ></ProFormText>
              </Col>
              <Col span={8}>
                <ProFormText
                  label="Giá trị tương ứng"
                  name="value"
                  placeholder={"Nhập giá trị tương ứng"}
                ></ProFormText>
              </Col>
              <Col span={8}>
                <ProFormText
                  label="Thực thể tương ứng"
                  name="entity"
                  placeholder={"Nhập thực thể tương ứng"}
                ></ProFormText>
              </Col>
            </Row>
          </ProFormList>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormSlots;
