import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import type { ProFormInstance } from "@ant-design/pro-components";
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
import { handleLoginApi } from "../../../services/userService";

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
  onSuccess?: (data: any) => void;
  onFailure?: (reason: any) => void;
  onVisibleChange: (visible: boolean) => void;
};

const ModalFormUser: React.FC<ModalFormUserProps> = (props) => {
  const { visible, onVisibleChange, initiateData, onSuccess, onFailure } =
    props;

  const restFormRef = useRef<ProFormInstance>();
  //   const handleSubmit = async (formValues: any) => {
  //     console.log(formValues);

  //     try {
  //       const res = !initiateData?.usrUid
  //         ? await handleLoginApi(username, password)
  //         : await handleLoginApi.user.updateUser({
  //             ...formValues,
  //             usrUid: restFormRef.current?.getFieldValue(["usrUid"]),
  //           });
  //       if (res.body?.status === "OK") {
  //         onVisibleChange(false);
  //         onSuccess?.(res.body?.dataRes);
  //         notification.success({
  //           message: initiateData?.usrUid
  //             ? "Cập nhật Người dùng thành công"
  //             : "Tạo mới Người dùng thành công",
  //         });
  //         return Promise.resolve();
  //       } else {
  //         onFailure?.(res.body);
  //         return Promise.reject();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <ModalForm
      open={visible}
      //   request={async () =>
      //     !initiateData?.usrUid
      //       ? { usrStatus: "ACTIVE" }
      //       : (await api.user.getUserById(initiateData?.usrUid)).body?.dataRes
      //   }
      modalProps={{
        destroyOnClose: true,
        okText: "Xác nhận",
      }}
      className="modal-form-user"
      formRef={restFormRef}
      //   onFinish={handleSubmit}
      onVisibleChange={onVisibleChange}
      title={
        initiateData?.usrUid ? "Cập nhật người dùng" : "Tạo mới người dùng"
      }
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProForm.Item label="Tài khoản" required name="usrUsername">
            <Input.Group compact>
              <Input
                style={{ width: "calc(100% - 80px)" }}
                allowClear
                placeholder="Nhập tài khoản"
                // disabled={
                //   initiateData?.usrUid ||
                //   !access?.["USER_MANAGEMENT.FETCH_USER_LDAP"]
                // }
                name="usrUsername"
                // onKeyDown={(e) => {
                //   e.key === "Enter";
                // }}
                onChange={(e) =>
                  restFormRef.current?.setFieldsValue({
                    usrUsername: e.target.value,
                  })
                }
                defaultValue={initiateData?.usrUsername}
                required
              />
            </Input.Group>
          </ProForm.Item>
        </Col>
        <Col span={8}>
          <ProFormText
            label="Email"
            name="usrEmail"
            disabled
            rules={[{ max: 100, message: "Vui lòng không nhập quá 100 kí tự" }]}
          />
        </Col>
        <Col span={8}>
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
        </Col>
        <Col span={8}>
          <ProFormText
            label="Họ"
            disabled
            name="usrFirstName"
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Tên"
            disabled
            name="usrLastName"
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
        <Col span={8}>
          <ProFormTextArea
            label="Phòng ban"
            name="usrPosition"
            disabled
            fieldProps={{
              autoSize: {
                minRows: 1,
                maxRows: 3,
              },
            }}
            rules={[{ max: 500, message: "Vui lòng không nhập quá 500 kí tự" }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Số điện thoại"
            name="usrPhone"
            rules={[{ max: 15, message: "Vui lòng không nhập quá 15 kí tự" }]}
            // required
            // rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="Khu vực"
            name="depUId"
            // required
            // rules={[
            //   { required: true, message: 'Vui lòng không bỏ trống' },
            //   { max: 500, message: 'Vui lòng không nhập quá 500 kí tự' },
            // ]}
          />
        </Col>
        {/* <Col span={8}>
          <ProFormText
            label="Vai trò"
            name="usrRole"
            required
            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col> */}
        <Col span={8}>
          <ProFormText
            label="Công việc"
            name="usrJob"
            // required
            // rules={[
            //   { required: true, message: 'Vui lòng không bỏ trống' },
            //   { max: 500, message: 'Vui lòng không nhập quá 500 kí tự' },
            // ]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Nhóm nghiệp vụ"
            name="typeBusiness"
            fieldProps={{
              showSearch: true,
              //   filterOption: filterOptionWithVietnamese,
            }}
            // request={async () =>
            //   getMasterDataByTypeUtil("TypeBusiness", true, true)
            // }
            // rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="Nhóm"
            name="grpCode"
            required
            showSearch
            debounceTime={800}
            // request={async ({ keyWords }) =>
            //   (
            //     await api.group.getListGroup({
            //       params: { keyword: keyWords },
            //       sort: {},
            //       filters: {},
            //     })
            //   ).data
            //     ?.map((value: any) => ({
            //       label: value?.grpTitle,
            //       value: value?.grpCode,
            //     }))

            //     // .filter((predicate: any) =>
            //     //   !checkRole("SUPER_ADMIN")
            //     //     ? predicate.value !== "SUPER_ADMIN"
            //     //     : true
            //     // ) || []
            // }
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ModalFormUser;
