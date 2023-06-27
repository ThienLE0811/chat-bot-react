import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProFormInstance,
  ProFormItem,
  ProFormList,
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
import {
  createEntities,
  updateEntities,
} from "../../../services/entitiesService";
import { createIntent, updateIntent } from "../../../services/intentServices";
import {
  createResponse,
  updateResponse,
} from "../../../services/responseService";

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

const ModalFormResponse: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  console.log("init:: ", initiateData);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    console.log("value e::: ", formValues);

    try {
      const res: any = initiateData?._id
        ? await updateResponse(initiateData?._id, formValues)
        : await createResponse(formValues);
      console.log("response:: ", res);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật câu trả lời thành công"
            : "Tạo mới câu trả lời thành công",
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
      width={"50%"}
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
      title={initiateData?._id ? "Cập nhật câu trả lời" : "Tạo mới câu trả lời"}
    >
      <Row gutter={16}>
        <Col span={24}>
          <ProFormText
            label="Tên"
            required
            name="title"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
              {
                whitespace: true,
                message:
                  "Vui lòng không nhập kí tự khoảng trắng ở đầu và cuối câu!",
                required: true,
              },
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
        {/* <Col span={24}>
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
        </Col> */}
        <Col span={24}>
          <ProFormList
            label="Nội dung"
            name="data"
            // copyIconProps={{ tooltipText: "Sao chép câu hỏi này" }}
            copyIconProps={false}
            deleteIconProps={{ tooltipText: "Xóa câu phản hồi này" }}
            creatorButtonProps={{ creatorButtonText: "Thêm câu phản hồi" }}
            style={{
              padding: 2,
              backgroundColor: "#F1F5F8",
            }}
          >
            <Row gutter={16} style={{ paddingTop: 12, width: "100%" }}>
              <Divider children={`Điền thông tin câu trả lời:`} />
              <Col span={24}>
                <ProFormTextArea
                  label="Text"
                  name="text"
                  placeholder={"Nhập câu phản hồi"}
                  rules={[
                    {
                      whitespace: true,
                      message:
                        "Vui lòng không nhập kí tự khoảng trắng ở đầu và cuối câu!",
                      required: true,
                    },
                  ]}
                ></ProFormTextArea>
              </Col>
            </Row>
          </ProFormList>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormResponse;
