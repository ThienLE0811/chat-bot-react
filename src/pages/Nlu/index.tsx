import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from "@ant-design/pro-components";
import Home from "../Home/Home";
import {
  Avatar,
  Button,
  Drawer,
  List,
  message,
  notification,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import { useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import columnsEntitiesTable from "./components/columnsEntitiesTable";
import { deleteNlu, getNlu } from "../../services/nluService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import ModalFormNlu from "./components/ModalFormNlu";
import Link from "antd/es/typography/Link";

function Nlu() {
  const [modalFormEntitiesVisible, setModalFormEntitiesVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [hiddenView, setHiddenView] = useState<boolean>(false);
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loadCheck, setLoadCheck] = useState({});

  const columns = [
    {
      title: "Tên intent",
      dataIndex: "intent",
      // width: 120,
      render: (dom, entity) => {
        return (
          <Link
            onClick={() => {
              console.log("click");
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </Link>
        );
      },
    },
    {
      title: "Examples",
      dataIndex: "examples",
      ellipsis: true,
      valueType: "treeSelect",
      hideInTable: true,
      hideInSearch: true,
      width: 500,
      render: (text, record) => (
        <List
          itemLayout="horizontal"
          dataSource={record?.examples}
          renderItem={(item: any, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={<Tag color={"green"}>{item}</Tag>}
                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
      ),
    },
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
      dataIndex: "updatedAt",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={300} minWidth={150} text={text} />
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
      width: 100,
      render: (_, record) => [
        <Button
          icon={<EyeOutlined />}
          // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          key={1}
          style={{ display: hiddenView ? "none" : "" }}
          onClick={() => {
            console.log("click");
            setCurrentRow(record);
            setShowDetail(true);
            setHiddenView(true);
          }}
        />,
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
            key={2}
            onClick={() => {
              setCurrentRow(record);
              setModalFormEntitiesVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title="Bạn chắc chắn muốn xóa?"
          key={"2"}
          onConfirm={async () => {
            const res = await deleteNlu(record?._id);
            if (res?.data?.statusCode === 200) {
              notification.success({ message: "Xóa thành công" });
              actionRef.current?.reload();
            } else {
              notification.error({ message: "Xóa không thành công" });
            }
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            key={3}
            style={{ display: hiddenView ? "none" : "" }}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          />
        </Popconfirm>,
      ],
    },
  ] as ProColumns<any>[];

  const handleSearch = (value: any) => {
    console.log("Kết quả tìm kiếm:", value);
    // Thực hiện xử lý tìm kiếm dữ liệu theo giá trị `value`
    // Ví dụ: gán dữ liệu đã lọc vào một biến state
  };

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 12,
        paddingBlock: 4,
      }}
    >
      <ProTable
        actionRef={actionRef}
        // formRef={formRef}
        rowKey="usrUid"
        headerTitle="Danh sách NLU"
        search={{
          // labelWidth: 120,
          filterType: "light",
          resetText: "Reset",
        }}
        // search={false}
        scroll={{ x: "max-content", y: "calc(100vh - 260px)" }}
        options={{
          // search: {
          //   placeholder: "Nhập từ khoá để tìm kiếm...",
          //   style: { width: 300 },
          // },
          density: false,
          setting: false,
          search: false,
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
            `${range[0]}-${range[1]} trên ${total} thực thể`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            danger
            onClick={() => {
              setModalFormEntitiesVisible(true);
            }}
            // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
          >
            <PlusOutlined /> Tạo mới
          </Button>,
        ]}
        request={(params, sort, filters) => getNlu(params, sort, filters)}
        columns={columns}
        // columns={access?.["USER_MANAGEMENT.GET_USERS"] && columnsUserTable()}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalFormNlu
        visible={modalFormEntitiesVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormEntitiesVisible(visible);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />
      <Drawer
        width={"70%"}
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
        afterOpenChange={(open) => {
          if (open) {
            // fetchUserInfo(currentRow?.usrUid);
          } else {
            setCurrentRow(undefined);
            setHiddenView(false);
          }
        }}
        closable={false}
      >
        {/* {currentRow?.usrUid && ( */}
        <ProDescriptions<any>
          column={1}
          title={`Thông tin chi tiết: ${currentRow?.intent}`}
          dataSource={currentRow}
          // request={async () => ({
          //   data: userInfo || {},
          // })}
          params={{
            id: currentRow?.usrUid,
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

export default Nlu;
