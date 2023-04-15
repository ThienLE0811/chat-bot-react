import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from "@ant-design/pro-components";
import Home from "../Home/Home";
import { Button, Drawer, message, Popconfirm, Tooltip } from "antd";
import ModalFormUser from "./components/ModalFormUser";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import columnsUserTable from "./components/columnsUserTable";
import { deleteUser, getUser } from "../../services/userService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import { useAppSelector } from "../../hooks/redux";

function User() {
  const [modalFormUserVisible, setModalFormUserVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loadCheck, setLoadCheck] = useState({});
  const { accountInfo } = useAppSelector((state) => state.account);
  console.log("accountInfo:: ", accountInfo);

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "userName",
      width: 90,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "usrStatus",
    //   valueType: "select",
    //   initialValue: "ACTIVE",
    //   valueEnum: {
    //     ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
    //     INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
    //   },
    // },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "firstName",
      hideInSearch: true,
      renderText: (text, record) => `${record?.firstName} ${record?.lastName}`,
    },
    {
      title: "Nhóm",
      renderText: (text, record) => (
        <ResponsesiveTextTable
          maxWidth={200}
          minWidth={40}
          text={record?.userGroup}
        />
      ),
      ellipsis: true,
      debounceTime: 800,
      fieldProps: {
        showSearch: true,
      },
      formItemProps: {},
      //   request: async ({ keyWords }) =>
      //     (
      //       await api.group.getListGroup({ params: { keyword: keyWords } })
      //     ).data?.map((value: any) => ({
      //       label: value?.grpName,
      //       value: value?.grpCode,
      //     })),
      dataIndex: "userGroup",
    },
    // {
    //   title: 'Domain name',
    //   render: (text) => <ResponsesiveTextTable maxWidth={200} minWidth={90} text={text} />,
    //   ellipsis: true,
    //   hideInSearch: true,
    //   dataIndex: 'usrDn',
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={70} text={text} />
      ),
      hideInSearch: true,
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "Ngày cập nhật",
      hideInForm: true,
      dataIndex: "updateAt",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={100} text={text} />
      ),
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
      hideInSearch: true,
    },
    {
      title: "Hành động",
      dataIndex: "option",
      valueType: "option",
      fixed: "right",
      width: 80,
      render: (_, record) => [
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            // disabled={accountInfo?.USER_MANAGEMENT.UPDATE_USER ? false : true}
            onClick={() => {
              !currentRow?.usrUid && setCurrentRow(record);
              setModalFormUserVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title="Xóa nguời dùng"
          key={"2"}
          onConfirm={async () => {
            const res = await deleteUser(record?._id);
            console.log("res:: ", res);
            if (res?.data?.statusCode === 200) {
              actionRef.current?.reload();
              message.success("Xóa người dùng thành công");
            } else {
              message.error("Xóa người dùng không thành công");
            }
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          />
        </Popconfirm>,
      ],
    },
  ] as ProColumns<any>[];

  return (
    <PageContainer title={false} breadcrumbRender={false}>
      <ProTable
        actionRef={actionRef}
        // formRef={formRef}
        rowKey="usrUid"
        headerTitle="Danh sách người dùng"
        // search={{
        //   labelWidth: 120,
        // }}
        search={false}
        scroll={{ x: "max-content", y: "calc(100vh - 260px)" }}
        options={{
          search: {
            placeholder: "Nhập từ khoá để tìm kiếm...",
            style: { width: 300 },
          },
          density: false,
          setting: false,
        }}
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
            `${range[0]}-${range[1]} trên ${total} người dùng`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            danger
            onClick={() => {
              setModalFormUserVisible(true);
            }}
            // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
          >
            <PlusOutlined /> Tạo người dùng
          </Button>,
        ]}
        request={() => getUser()}
        columns={columns}
        // columns={access?.["USER_MANAGEMENT.GET_USERS"] && columnsUserTable()}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalFormUser
        visible={modalFormUserVisible}
        initiateData={currentRow}
        onVisibleChange={(visible: boolean) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormUserVisible(visible);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />
      <Drawer
        width={"60%"}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
        afterOpenChange={(open) => {
          if (open) {
            // fetchUserInfo(currentRow?.usrUid);
          } else {
            setCurrentRow(undefined);
          }
        }}
        closable={false}
      >
        {/* {currentRow?.usrUid && ( */}
        <ProDescriptions<any>
          column={{ xl: 3 }}
          // loading={loadingUserInfo}
          title={`${currentRow?.lastname} ${currentRow?.firstname}`}
          dataSource={currentRow}
          // request={async () => ({
          //   data: userInfo || {},
          // })}
          params={{
            id: currentRow?._id,
          }}
          columns={columns as ProDescriptionsItemProps<any>[]}
        />
        {/* )} */}
        {/* {currentRow?.grpUid && (
          <DetailPermission groupId={currentRow?.grpUid} />
        )} */}
      </Drawer>
    </PageContainer>
  );
}

export default User;
