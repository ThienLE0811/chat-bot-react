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

function HistoryTrain() {
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
      title: "Tên file model",
      dataIndex: "",
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
      title: "Trạng thái",
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
  ] as ProColumns<any>[];

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
        rowKey="_id"
        headerTitle="Lịch sử train model"
        // search={{
        //   labelWidth: 120,
        // }}
        search={false}
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
            `${range[0]}-${range[1]} trên ${total} model`,
        }}
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     danger
        //     onClick={() => {
        //       setModalFormEntitiesVisible(true);
        //     }}
        //     // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
        //   >
        //     <PlusOutlined /> Tạo thực thể
        //   </Button>,
        // ]}
        // request={(params, sort, filters) => getEntities()}
        columns={columns}
        // columns={access?.["USER_MANAGEMENT.GET_USERS"] && columnsUserTable()}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
    </PageContainer>
  );
}

export default HistoryTrain;
