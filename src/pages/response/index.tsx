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
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
// import columnsResponseTable from "./components/columnsResponseTable";
import { deleteResponse, getResponse } from "../../services/responseService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import ModalFormResponse from "./components/ModalFormResponse";

function Response() {
  const [modalFormResponseVisible, setModalFormResponseVisible] =
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
      title: "Tên câu trả lời",
      dataIndex: "title",
      width: 120,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              // setShowDetail(true);
              console.log("click:: ", entity);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    // {
    //   title: "Tên câu trả lời",
    //   dataIndex: "dataResponse",
    //   valueType: "treeSelect",
    //   render: (text, record) => (
    //     <>
    //       <ResponsesiveTextTable
    //         maxWidth={300}
    //         minWidth={150}
    //         // text={text?.props?.children?.join(", ") || ""}
    //         // text={record?.data.join(", ")}

    //         text={record?.data.map((value: any) => value.name_data)}
    //       />
    //     </>
    //   ),
    // },
    {
      title: "Nội dung",
      // render: (text, record) => (
      //   <>
      //     <ResponsesiveTextTable
      //       maxWidth={1300}
      //       minWidth={150}
      //       // text={text?.props?.children?.join(", ") || ""}
      //       // text={record?.data.join(", ")}

      //       text={
      //         record?.data.map((value: any) => (
      //           <Tag color={"green"} style={{ paddingRight: "10px" }}>
      //             {value?.text}
      //           </Tag>
      //         )) || ""
      //       }
      //     />
      //     {console.log("log:: ", record?.data)}
      //   </>
      // ),
      render: (text, record) => (
        <>
          {record?.data.map((value: any, index: number) => (
            <Tag color={"green"} style={{ paddingRight: "10px" }} key={index}>
              {value?.text}
            </Tag>
          ))}
        </>
      ),
      width: 250,
      valueType: "",
      ellipsis: true,
      hideInSearch: true,
      dataIndex: "data",
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   valueType: "date",
    //   render: (text) => (
    //     <ResponsesiveTextTable maxWidth={200} minWidth={70} text={text} />
    //   ),
    //   hideInSearch: true,
    //   fieldProps: {
    //     format: "DD/MM/YYYY",
    //   },
    // },
    // {
    //   title: "Ngày cập nhật",
    //   dataIndex: "updateAt",
    //   render: (text) => (
    //     <ResponsesiveTextTable maxWidth={300} minWidth={150} text={text} />
    //   ),
    //   valueType: "date",
    //   fieldProps: {
    //     format: "DD/MM/YYYY",
    //   },
    //   hideInSearch: true,
    // },
    {
      title: "Hành động",
      // dataIndex: "option",
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
              setModalFormResponseVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title="Bạn chắc chắn muốn xóa?"
          key={"2"}
          onConfirm={async () => {
            const res = await deleteResponse(record?._id);
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
        paddingInline: 12,
        paddingBlock: 4,
      }}
    >
      <ProTable
        actionRef={actionRef}
        // formRef={formRef}
        rowKey="_id"
        headerTitle="Danh sách câu trả lời"
        // search={{
        //   labelWidth: 120,
        // }}

        scroll={{ x: "max-content", y: "calc(100vh - 260px)" }}
        options={{
          // search: {
          //   placeholder: "Nhập từ khoá để tìm kiếm...",
          //   style: { width: 300 },
          // },
          search: false,
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
        search={{
          // labelWidth: 120,
          filterType: "light",
          resetText: "Reset",
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} câu trả lời`,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            danger
            onClick={() => {
              setModalFormResponseVisible(true);
            }}
            // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
          >
            <PlusOutlined /> Tạo phản hồi
          </Button>,
        ]}
        request={(params, sort, filters) => getResponse(params, sort, filters)}
        columns={columns}
      />

      <ModalFormResponse
        visible={modalFormResponseVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormResponseVisible(visible);
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
          title={`Thông tin chi tiết: ${currentRow?.nameResponse}`}
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

export default Response;
