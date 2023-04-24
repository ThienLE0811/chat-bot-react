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
  Button,
  Drawer,
  message,
  notification,
  Popconfirm,
  Switch,
  Tooltip,
} from "antd";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
// import columnsEntitiesTable from "./components/columnsEntitiesTable";
import { deleteEntities, getEntities } from "../../services/entitiesService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import ModalFormEntities from "./components/ModalFormEntities";

function Entities() {
  const [modalFormEntitiesVisible, setModalFormEntitiesVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loadCheck, setLoadCheck] = useState({});

  const columns = [
    {
      title: "Tên",
      dataIndex: "nameEntities",
      width: 120,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              console.log("click");
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "dataEntities",
      valueType: "treeSelect",
      // render: (text, record) => (
      //   <>
      //     <ResponsesiveTextTable
      //       maxWidth={300}
      //       minWidth={150}
      //       // text={text?.props?.children?.join(", ") || ""}
      //       // text={record?.data.join(", ")}
      //       text={record?.dataEntities.join(", ")}
      //     />
      //   </>
      // ),
    },
    {
      title: "Mô tả",
      render: (text, record) => (
        <>
          <ResponsesiveTextTable
            maxWidth={300}
            minWidth={150}
            // text={text?.props?.children?.join(", ") || ""}
            // text={record?.data.join(", ")}
            text={record?.description}
          />
        </>
      ),
      ellipsis: true,
      hideInSearch: true,
      dataIndex: "data",
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
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
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
            const res = await deleteEntities(record?._id);
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
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          />
        </Popconfirm>,
      ],
    },
  ] as ProColumns<any>[];

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 8,
        paddingBlock: 4,
      }}
    >
      <ProTable
        actionRef={actionRef}
        // formRef={formRef}
        rowKey="usrUid"
        headerTitle="Danh sách thực thể"
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
            <PlusOutlined /> Tạo ý định
          </Button>,
        ]}
        request={(params, sort, filters) => getEntities()}
        columns={columns}
        // columns={access?.["USER_MANAGEMENT.GET_USERS"] && columnsUserTable()}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalFormEntities
        visible={modalFormEntitiesVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormEntitiesVisible(visible);
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
          column={{ xl: 2, sm: 1 }}
          title={`Thông tin chi tiết: ${currentRow?.nameEntities}`}
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

export default Entities;
