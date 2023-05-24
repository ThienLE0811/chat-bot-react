import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProDescriptions,
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
import { createRules, updateRules } from "../../../services/rulesService";

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

const ModalFormRules: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  // const [check, setCheck] = useState<number>(initiateData?._id ? 3 : 4);
  // console.log("check:: ", check);
  const actionRef = useRef<ActionType>();
  const restFormRef = useRef<ProFormInstance>();
  const handleSubmit = async (formValues: any) => {
    // formValues.steps.map((value: any) => value.intent.trim());
    console.log("2112");
    console.log("value::: ", formValues);
    try {
      const res: any = initiateData?._id
        ? await updateRules(initiateData?._id, formValues)
        : await createRules(formValues);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        actionRef.current?.reload();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật rule thành công"
            : "Tạo mới rule thành công",
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
      title={initiateData?._id ? "Cập nhật rule" : "Tạo mới rule"}
    >
      <Row gutter={16}>
        <Col span={24}>
          <ProFormText
            label="Tên"
            required
            name="rule"
            rules={[
              {
                max: 100,
                message: "Vui lòng không nhập quá 100 kí tự hoặc để trống",
                required: true,
              },
            ]}
          />
        </Col>
        {/* <Col span={8}>
          
          <ProFormSwitch name="autoFill" label="auto Fill" />
        </Col> */}
        <Col span={24}>
          <ProFormList
            label="Các bước"
            name="steps"
            max={2}
            // copyIconProps={{ tooltipText: "Sao chép câu hỏi này" }}
            copyIconProps={false}
            deleteIconProps={false}
            alwaysShowItemLabel
            creatorButtonProps={{
              creatorButtonText: "Thêm step",
              // onChange: () => setCheck(1),
            }}
            style={{ padding: 2, backgroundColor: "#F1F5F8" }}
            children={(item, value, values) => (
              <>
                <Row gutter={16} style={{ paddingTop: 12 }}>
                  <Divider children={`Điền thông tin: ${value + 1}`} />
                  <Col span={12}>
                    <ProFormText
                      label="Ý định"
                      name="intent"
                      placeholder={"Nhập ý định"}
                      rules={[
                        {
                          whitespace: true,
                          message: "Vui lòng để kí tự trống",
                        },
                      ]}
                    ></ProFormText>
                  </Col>

                  <Col span={12}>
                    <ProFormText
                      label="Câu trả lời tương ứng"
                      name="action"
                      placeholder={"Nhập câu trả lời tương ứng"}
                      rules={[
                        {
                          whitespace: true,
                          message: "Vui lòng để kí tự trống",
                        },
                      ]}
                    ></ProFormText>
                  </Col>
                </Row>
              </>
            )}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormRules;
