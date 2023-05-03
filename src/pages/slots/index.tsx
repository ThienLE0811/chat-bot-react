import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProList,
  ProTable,
} from "@ant-design/pro-components";
import Home from "../Home/Home";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  message,
  notification,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import ModalFormSlots from "./components/ModalFormSlots";
import { useRef, useState } from "react";
import {
  BookFilled,
  BulbFilled,
  DeleteOutlined,
  EditOutlined,
  MailFilled,
  PlusOutlined,
} from "@ant-design/icons";
// import columnsIntentTable from "./components/columnsIntentTable";
import { deleteSlots, getSlots } from "../../services/slotsService";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";

function Slots() {
  const [modalFormIntentVisible, setModalFormIntentVisible] =
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
      dataIndex: "nameSlot",
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
      title: "mapping",
      valueType: "treeSelect",
      render: (text, record) => (
        // <>
        //   {record?.data?.mapping.map((value: any) => `type: ${value.type}`)}
        //   <br />
        //   {record?.data?.mapping.map((value: any) => value.type)}
        // </>
        <List
          itemLayout="horizontal"
          dataSource={record?.mapping}
          style={{ width: 400 }}
          renderItem={(item: any, index) => (
            <List.Item>
              <List.Item.Meta
                // avatar={
                //   <Avatar
                //     src={`https://joesch.moe/api/v1/random?key=${index}`}
                //   />
                // }
                title={item?.value}
                description={`entity: ${item?.entity}
                 - type: ${item?.type}`}
              />
            </List.Item>
          )}
        />
      ),
      ellipsis: true,
      hideInSearch: true,
      // dataIndex: "data",
    },
    {
      title: "type",
      dataIndex: "type",
      render: (text, record) => (
        <ResponsesiveTextTable
          maxWidth={200}
          minWidth={70}
          text={record?.type}
        />
      ),
    },
    // {
    //   title: "auto fill",
    //   // dataIndex: "type",
    //   render: (text, record) => (
    //     <ResponsesiveTextTable
    //       maxWidth={200}
    //       minWidth={70}
    //       text={record?.autoFill ? "true" : "false"}
    //     />
    //   ),
    // },
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
    //   dataIndex: "updatedAt",
    //   render: (text) => (
    //     <ResponsesiveTextTable maxWidth={300} minWidth={150} text={text} />
    //   ),
    //   valueType: "date",
    //   fieldProps: {
    //     format: "DD/MM/YYYY",
    //   },
    //   hideInSearch: true,
    // },
    // {
    //   title: "Hành động",
    //   dataIndex: "option",
    //   valueType: "option",
    //   fixed: "right",
    //   width: 100,
    //   render: (_, record) => [
    //     <Tooltip title="Sửa thông tin" key={"1"}>
    //       <Button
    //         icon={<EditOutlined />}
    //         // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
    //         onClick={() => {
    //           setCurrentRow(record);
    //           setModalFormIntentVisible(true);
    //         }}
    //       />
    //     </Tooltip>,
    //     <Popconfirm
    //       title="Bạn chắc chắn muốn xóa?"
    //       key={"2"}
    //       onConfirm={async () => {
    //         const res = await deleteIntent(record?._id);
    //         if (res?.data?.statusCode === 200) {
    //           notification.success({ message: "Xóa thành công" });
    //           actionRef.current?.reload();
    //         } else {
    //           notification.error({ message: "Xóa không thành công" });
    //         }
    //       }}
    //     >
    //       <Button
    //         icon={<DeleteOutlined />}
    //         danger
    //         // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
    //       />
    //     </Popconfirm>,
    //   ],
    // },
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
      <ProList
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="primary"
              danger
              onClick={() => {
                setModalFormIntentVisible(true);
              }}
              // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
            >
              <PlusOutlined /> Tạo slots
            </Button>,
          ];
        }}
        actionRef={actionRef}
        onItem={(record) => {
          return {
            onClick: () => {
              setCurrentRow(record);
              setShowDetail(true);
            },
          };
        }}
        options={{
          // search: {
          //   placeholder: "Nhập từ khoá để tìm kiếm...",
          //   style: { width: 300 },
          // },
          search: false,
          density: false,
          setting: false,
        }}
        rowKey="_id"
        request={(params, sort, filters) => getSlots()}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} slots`,
        }}
        headerTitle="Danh sách Slots"
        metas={{
          title: {
            render: (dom, entity: any) => {
              return <div>{entity?.nameSlot}</div>;
            },
          },
          description: {
            search: false,
            render: (dom, entity: any) => [
              <>
                Type: <Tag color="processing">{entity?.type}</Tag>
              </>,
              // <>
              //   auto fill:{" "}
              //   <Tag color="processing">
              //     {entity?.autoFill === true ? "true" : "false"}
              //   </Tag>
              // </>,
              <>
                mapping: <Tag color="processing">{entity?.mapping.length}</Tag>
              </>,
            ],
          },

          actions: {
            render: (dom, entity: any) => {
              return [
                <Tooltip title="Sửa thông tin" key={"1"}>
                  <Button
                    icon={<EditOutlined />}
                    // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
                    onClick={() => {
                      setCurrentRow(entity);
                      setModalFormIntentVisible(true);
                    }}
                  />
                </Tooltip>,
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  key={"2"}
                  onConfirm={async () => {
                    const res = await deleteSlots(entity?._id);
                    if (res?.data?.statusCode === 200) {
                      notification.success({ message: "Xóa thành công" });
                      actionRef.current?.reload();
                    } else {
                      notification.error({ message: "Xóa không thành công" });
                    }
                  }}
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>,
              ];
            },
          },
          avatar: {
            render: () => (
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                // icon={<BulbFilled />}
                icon={<BookFilled />}
              />
            ),
            search: false,
          },
        }}
      />

      <ModalFormSlots
        visible={modalFormIntentVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !showDetail) setCurrentRow(undefined);
          setModalFormIntentVisible(visible);
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
          column={{ xl: 1, sm: 1, xs: 1, md: 1 }}
          title={`Thông tin chi tiết của slots: ${currentRow?.nameSlot}`}
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

export default Slots;
