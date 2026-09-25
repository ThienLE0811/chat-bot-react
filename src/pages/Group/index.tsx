import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag, Tooltip, message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import ModalFormGroup from "./components/ModalFormGroup";
import {
  PermissionModule,
  Role,
  deleteRole,
  getPermissionCatalog,
  getRoles,
} from "../../services/groupService";
import { errorMessage, useCan } from "../../lib/auth";

function Group() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Role>();
  const [catalog, setCatalog] = useState<PermissionModule[]>([]);
  const actionRef = useRef<ActionType>();
  const canWrite = useCan()("roles.write");

  useEffect(() => {
    getPermissionCatalog()
      .then(setCatalog)
      .catch(() => message.error("Không lấy được danh mục quyền"));
  }, []);

  // "Thiết kế hội thoại: Xem, Thêm, sửa, xóa" cho từng module nhóm có quyền.
  const summarize = useMemo(
    () => (permissions: string[]) =>
      catalog
        .map((group) => ({
          label: group.label,
          granted: group.permissions.filter((p) => permissions.includes(p.key)),
        }))
        .filter((group) => group.granted.length > 0)
        .map((group) => (
          <Tag key={group.label} style={{ marginBottom: 4 }}>
            {group.label}: {group.granted.map((p) => p.label).join(", ")}
          </Tag>
        )),
    [catalog]
  );

  const columns = [
    {
      title: "Tên nhóm",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "Mã nhóm",
      dataIndex: "code",
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          {record.code}
          {record.isSystem && <Tag color="green">Hệ thống</Tag>}
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={240} minWidth={100} text={text} />
      ),
    },
    {
      title: "Quyền",
      dataIndex: "permissions",
      render: (_, record) =>
        record.permissions.length ? summarize(record.permissions) : "Không có quyền",
    },
    {
      title: "Số người dùng",
      dataIndex: "userCount",
      width: 110,
    },
    {
      title: "Hành động",
      dataIndex: "option",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (_, record) => [
        <Tooltip title="Sửa nhóm" key="edit">
          <Button
            icon={<EditOutlined />}
            disabled={!canWrite}
            onClick={() => {
              setCurrentRow(record);
              setModalVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title={`Xóa nhóm ${record.code}?`}
          disabled={!canWrite || record.isSystem}
          onConfirm={async () => {
            try {
              await deleteRole(record._id);
              message.success("Xóa nhóm thành công");
              actionRef.current?.reload();
            } catch (error: any) {
              if (error?.response?.status !== 403) {
                message.error(errorMessage(error, "Xóa nhóm không thành công"));
              }
            }
          }}
        >
          <Tooltip
            title={
              record.isSystem
                ? "Không xóa được nhóm hệ thống"
                : record.userCount > 0
                ? "Chuyển người dùng sang nhóm khác trước khi xóa"
                : "Xóa nhóm"
            }
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={!canWrite || record.isSystem || record.userCount > 0}
            />
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ] as ProColumns<Role>[];

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 8,
        paddingBlock: 4,
      }}
    >
      <ProTable<Role>
        actionRef={actionRef}
        rowKey="_id"
        headerTitle="Danh sách nhóm quyền"
        search={false}
        scroll={{ x: "max-content", y: "calc(100vh - 260px)" }}
        options={{ density: false, setting: false }}
        size="small"
        cardProps={{
          bodyStyle: {
            paddingBottom: 0,
            paddingTop: 0,
            paddingInline: 12,
          },
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} nhóm`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            danger
            disabled={!canWrite}
            onClick={() => {
              setCurrentRow(undefined);
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> Tạo nhóm
          </Button>,
        ]}
        request={() => getRoles()}
        columns={columns}
      />
      <ModalFormGroup
        visible={modalVisible}
        initiateData={currentRow}
        catalog={catalog}
        onVisibleChange={(visible: boolean) => {
          if (!visible) setCurrentRow(undefined);
          setModalVisible(visible);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
}

export default Group;
