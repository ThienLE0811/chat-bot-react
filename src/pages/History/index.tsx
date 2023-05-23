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
  Tag,
  Tooltip,
} from "antd";
import { useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import columnsEntitiesTable from "./components/columnsEntitiesTable";
import { deleteEntities, getEntities } from "../../services/entitiesService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import Link from "antd/es/typography/Link";

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

  const dataSource = [
    {
      id: 1,
      name: "20230523-023329-hgyg-gour.tar.gz",
      status: "true",
      createdAt: "23/5/2023",
    },
    {
      id: 2,
      name: "20230523-043916-eclipse-differential.tar.gz",
      status: "true",
      createdAt: "23/5/2023",
    },
    {
      id: 3,
      name: "20230522-013421-solutin-wogy.tar.gz",
      status: "true",
      createdAt: "22/5/2023",
    },
    {
      id: 4,
      name: "20230522-076541-chelly-kojud.tar.gz",
      status: "true",
      createdAt: "22/5/2023",
    },
    {
      id: 5,
      name: "20230521-431114-overstation-dudo.tar.gz",
      status: "true",
      createdAt: "21/5/2023",
    },
    {
      id: 6,
      name: "20230521-077831-regacle-karierl.tar.gz",
      status: "true",
      createdAt: "21/5/2023",
    },
    {
      id: 7,
      name: "20230521-076662-holution-foguit.tar.gz",
      status: "false",
      createdAt: "23/5/2023",
    },
    {
      id: 8,
      name: "20230520-022311-staytion-beadrouto.tar.gz",
      status: "true",
      createdAt: "20/5/2023",
    },
  ];

  const columns = [
    {
      title: "Tên file model",
      dataIndex: "name",
      // width: 120,
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         console.log("click");
      //         setCurrentRow(entity);
      //         setShowDetail(true);
      //       }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
      render: (_, record) => <Link>{record.name}</Link>,
    },
    {
      title: "Trạng thái",
      render: (text, record) => (
        // <>
        //   <ResponsesiveTextTable
        //     maxWidth={300}
        //     minWidth={50}
        //     // text={text?.props?.children?.join(", ") || ""}
        //     // text={record?.data.join(", ")}
        //     text={record?.status}
        //   />
        // </>
        <Tag
          color={record?.status === "true" ? "success" : "error"}
          icon={
            record?.status === "true" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
        >
          {record?.status === "true" ? "Thành công" : "Lỗi"}
        </Tag>
      ),
      ellipsis: true,
      hideInSearch: true,
      dataIndex: "data",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      // valueType: "date",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={70} text={text} />
      ),
      hideInSearch: true,
      // fieldProps: {
      //   format: "DD/MM/YYYY",
      // },
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
        dataSource={dataSource}
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
