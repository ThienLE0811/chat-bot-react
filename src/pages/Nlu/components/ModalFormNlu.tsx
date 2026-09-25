import {
  ModalForm,
  ProFormInstance,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Col, notification, Row } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IntentOption,
  getIntentOptions,
} from "../../../services/intentServices";
import { createNlu, updateNlu } from "../../../services/nluService";
import { intentSelectProps } from "../../components/intentSelect";

export type ModalFormNluProps = {
  visible: boolean;
  initiateData?: any;
  onSuccess?: () => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

/**
 * Creates or edits the examples of one intent. The server trims them, drops
 * blanks and repeats, and refuses an example another intent already has.
 */
const ModalFormNlu: React.FC<ModalFormNluProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;
  const formRef = useRef<ProFormInstance>();
  const [intents, setIntents] = useState<IntentOption[]>([]);
  const selectProps = useMemo(() => intentSelectProps(intents), [intents]);

  useEffect(() => {
    if (!visible) return;
    getIntentOptions()
      .then(setIntents)
      .catch((error) => notification.error({ message: error.message }));
  }, [visible]);

  const handleSubmit = async (formValues: any) => {
    const values = { intent: formValues.intent, examples: formValues.examples };
    try {
      const res: any = initiateData?._id
        ? await updateNlu(initiateData?._id, values)
        : await createNlu(values);
      if (res?.data?.statusCode === 200) {
        onVisibleChange(false);
        onSuccess?.();
        notification.success({
          message: initiateData?._id
            ? "Cập nhật thành công"
            : "Tạo mới thành công",
        });
        return true;
      }
      notification.error({ message: "Thao tác không thành công" });
      onFailure?.(res);
      return false;
    } catch (error: any) {
      // e.g. the intent already has a list, or an example belongs to another.
      const reason = error?.response?.data?.message;
      notification.error({
        message: "Thao tác không thành công",
        description: Array.isArray(reason) ? reason.join(". ") : reason,
      });
      onFailure?.(error);
      return false;
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
      formRef={formRef}
      onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={initiateData?._id ? "Cập nhật câu mẫu" : "Tạo mới câu mẫu"}
    >
      <Row gutter={16}>
        <Col span={24}>
          <ProFormSelect
            label="Ý định"
            name="intent"
            placeholder="Tìm theo tên tiếng Việt hoặc mã ý định"
            rules={[{ required: true, message: "Vui lòng chọn ý định" }]}
            fieldProps={selectProps}
          />
        </Col>
        <Col span={24}>
          <ProFormSelect
            label="Câu mẫu"
            name="examples"
            mode="tags"
            tooltip="Những câu người dùng hay nói cho ý định này, bot học từ đây khi train. Gõ một câu rồi bấm Enter. Nên có 8–15 câu."
            placeholder="Ví dụ: mấy giờ bên bạn mở cửa"
            fieldProps={{ tokenSeparators: ["\n"], open: false }}
            extra="Đánh dấu thực thể bằng [giá trị](tên_thực_thể), ví dụ: tên mình là [Thiện](customer_name)"
            rules={[{ required: true, message: "Vui lòng nhập câu mẫu" }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormNlu;
