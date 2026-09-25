import type { ProFormInstance } from "@ant-design/pro-components";
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Alert, Checkbox, Col, Row, Typography, message, notification } from "antd";
import React, { useRef } from "react";
import { errorMessage } from "../../../lib/auth";
import {
  PermissionModule,
  Role,
  createRole,
  updateRole,
} from "../../../services/groupService";

const ADMIN_ROLE = "ADMIN";

export type ModalFormGroupProps = {
  visible: boolean;
  initiateData?: Role;
  catalog: PermissionModule[];
  onSuccess?: () => void;
  onVisibleChange: (visible: boolean) => void;
};

/**
 * Có một quyền bất kỳ của module thì phải có quyền đầu tiên (Xem) của module
 * đó; backend cũng tự thêm, ở đây chỉ để người dùng thấy đúng.
 */
function withImplied(selected: string[], catalog: PermissionModule[]) {
  const result = new Set(selected);
  for (const group of catalog) {
    const keys = group.permissions.map((p) => p.key);
    if (keys.some((key) => result.has(key))) result.add(keys[0]);
  }
  return [...result];
}

const ModalFormGroup: React.FC<ModalFormGroupProps> = (props) => {
  const { visible, onVisibleChange, initiateData, catalog, onSuccess } = props;
  const formRef = useRef<ProFormInstance>();
  const isEdit = !!initiateData?._id;
  const isAdmin = initiateData?.code === ADMIN_ROLE;

  const handleSubmit = async (formValues: any) => {
    try {
      const values = {
        ...formValues,
        permissions: formValues.permissions ?? [],
      };
      if (isEdit) await updateRole(initiateData!._id, values);
      else await createRole(values);
      onVisibleChange(false);
      onSuccess?.();
      notification.success({
        message: isEdit ? "Cập nhật nhóm thành công" : "Tạo mới nhóm thành công",
      });
      return true;
    } catch (error: any) {
      // 403 đã được báo chung trong lib/auth.ts
      if (error?.response?.status !== 403) {
        message.error(errorMessage(error, "Lưu nhóm không thành công"));
      }
      return false;
    }
  };

  return (
    <ModalForm
      open={visible}
      width={"60%"}
      modalProps={{
        destroyOnClose: true,
        okText: "Xác nhận",
      }}
      initialValues={initiateData ?? { permissions: [] }}
      formRef={formRef}
      onFinish={handleSubmit}
      onOpenChange={onVisibleChange}
      title={isEdit ? "Cập nhật nhóm" : "Tạo mới nhóm"}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            label="Tên nhóm"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhóm" },
              { max: 100, message: "Vui lòng không nhập quá 100 kí tự" },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Mã nhóm"
            name="code"
            disabled={isEdit}
            tooltip="Mã không đổi được sau khi tạo; người dùng gắn với nhóm qua mã này"
            placeholder="VD: BIEN_TAP"
            fieldProps={{ style: { textTransform: "uppercase" } }}
            rules={[
              { required: !isEdit, message: "Vui lòng nhập mã nhóm" },
              {
                pattern: /^[A-Za-z][A-Za-z0-9_]{1,31}$/,
                message:
                  "2-32 kí tự: chữ không dấu, số, dấu gạch dưới, bắt đầu bằng chữ",
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProFormTextArea
            label="Mô tả"
            name="description"
            fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
        <Col span={24}>
          {isAdmin && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message="Nhóm ADMIN luôn có mọi quyền, không bỏ bớt được."
            />
          )}
          <ProForm.Item
            label="Quyền"
            name="permissions"
            normalize={(value: string[]) => withImplied(value ?? [], catalog)}
          >
            <Checkbox.Group style={{ width: "100%" }} disabled={isAdmin}>
              {catalog.map((group) => (
                <div key={group.module} style={{ marginBottom: 12 }}>
                  <Typography.Text strong>{group.label}</Typography.Text>
                  <Typography.Text type="secondary">
                    {" "}
                    · {group.description}
                  </Typography.Text>
                  <div style={{ marginTop: 4 }}>
                    {group.permissions.map((permission) => (
                      <Checkbox key={permission.key} value={permission.key}>
                        {permission.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </Checkbox.Group>
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormGroup;
