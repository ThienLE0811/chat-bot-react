import {
  ModalForm,
  ProFormDependency,
  ProFormText,
} from "@ant-design/pro-components";
import { Col, Divider, Row, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { errorMessage } from "../../../lib/auth";
import { setAccountInfo } from "../../../redux/slices/account";
import { updateMe } from "../../../services/userService";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** "Tài khoản của tôi": ai đăng nhập cũng tự sửa được, không cần quyền users.*. */
const AccountModal = ({ open, onOpenChange }: Props) => {
  const dispatch = useAppDispatch();
  const { accountInfo } = useAppSelector((state) => state.account);

  const handleFinish = async (values: any) => {
    const { confirmPassword, ...rest } = values;
    const input = rest.newPassword
      ? rest
      : { ...rest, newPassword: undefined, currentPassword: undefined };
    try {
      const me = await updateMe(input);
      dispatch(setAccountInfo(me.user));
      message.success(
        input.newPassword ? "Đã cập nhật tài khoản và đổi mật khẩu" : "Đã cập nhật tài khoản"
      );
      return true;
    } catch (error) {
      message.error(errorMessage(error, "Cập nhật tài khoản không thành công"));
      return false;
    }
  };

  return (
    <ModalForm
      title="Tài khoản của tôi"
      open={open}
      onOpenChange={onOpenChange}
      width={560}
      modalProps={{ destroyOnClose: true, okText: "Lưu" }}
      initialValues={{
        firstName: accountInfo?.firstName,
        lastName: accountInfo?.lastName,
        email: accountInfo?.email,
      }}
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText label="Tài khoản" fieldProps={{ value: accountInfo?.userName }} disabled />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Nhóm quyền"
            fieldProps={{ value: accountInfo?.roleName ?? accountInfo?.roleCode }}
            disabled
            tooltip="Chỉ quản trị viên đổi được nhóm quyền"
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Họ"
            name="firstName"
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label="Tên"
            name="lastName"
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={24}>
          <ProFormText
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          />
        </Col>
      </Row>

      <Divider orientation="left" plain>
        Đổi mật khẩu (bỏ trống nếu không đổi)
      </Divider>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormText.Password
            label="Mật khẩu mới"
            name="newPassword"
            fieldProps={{ autoComplete: "new-password" }}
            rules={[{ min: 6, message: "Mật khẩu cần ít nhất 6 kí tự" }]}
          />
        </Col>
        <ProFormDependency name={["newPassword"]}>
          {({ newPassword }) =>
            newPassword ? (
              <>
                <Col span={12}>
                  <ProFormText.Password
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    fieldProps={{ autoComplete: "new-password" }}
                    rules={[
                      { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
                      ({ getFieldValue }) => ({
                        validator: (_, value) =>
                          !value || value === getFieldValue("newPassword")
                            ? Promise.resolve()
                            : Promise.reject(new Error("Hai mật khẩu không khớp")),
                      }),
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <ProFormText.Password
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    fieldProps={{ autoComplete: "current-password" }}
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                  />
                </Col>
              </>
            ) : null
          }
        </ProFormDependency>
      </Row>
    </ModalForm>
  );
};

export default AccountModal;
