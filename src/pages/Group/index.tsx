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
import ModalFormUser from "./components/ModalFormGroup";
import { useRef, useState } from "react";
import {
  ControlOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { deleteUser, getUser } from "../../services/userService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import ModalFormGroup from "./components/ModalFormGroup";
import { getPermission } from "../../services/groupService";
import { useAppSelector } from "../../hooks/redux";

function Group() {
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

  const columns = [
    {
      title: "Tên nhóm",
      dataIndex: "name",
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
      title: "Code nhóm",
      dataIndex: "roleType",
    },
    {
      title: "Nhóm",
      dataIndex: "description",
      hideInSearch: true,
      renderText: (text, record) => `${record?.description}`,
    },
    {
      title: "Số lượng người dùng",
      renderText: (text, record) => (
        <ResponsesiveTextTable
          maxWidth={200}
          minWidth={100}
          text={record?.user}
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
      dataIndex: "userCount",
    },
    {
      title: "Hành động",
      dataIndex: "option",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (_, record) => [
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            disabled={
              accountInfo?.userRole?.PERMISSION_MANAGEMENT ? false : true
            }
            onClick={() => {
              !currentRow?._id && setCurrentRow(record);
              setModalFormUserVisible(true);
            }}
          />
        </Tooltip>,
        // <Tooltip title="Phân quyền" key={"2"}>
        //   <Button
        //     icon={<ControlOutlined />}
        //     disabled={
        //       accountInfo?.userRole?.PERMISSION_MANAGEMENT ? false : true
        //     }
        //     onClick={() => {
        //       !currentRow?._id && setModalFormUserVisible(true);
        //     }}
        //   />
        // </Tooltip>,
      ],
    },
  ] as ProColumns<any>[];

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      style={{ padding: 0 }}
    >
      <ProTable
        actionRef={actionRef}
        // formRef={formRef}
        rowKey="usrUid"
        headerTitle="Danh sách nhóm"
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
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     danger
        //     onClick={() => {
        //       setModalFormUserVisible(true);
        //     }}
        //     // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
        //   >
        //     <PlusOutlined /> Tạo người dùng
        //   </Button>,
        // ]}
        request={() => getPermission()}
        columns={columns}
        // columns={access?.["USER_MANAGEMENT.GET_USERS"] && columnsUserTable()}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalFormGroup
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

export default Group;
