import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProList,
} from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Drawer,
  List,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
// import ModalFormSlots from "./components/ModalFormSlots";
import { useRef, useState } from "react";
import {
  ContainerOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import columnsIntentTable from "./components/columnsIntentTable";
import { deleteSlots, getSlots } from "../../services/slotsService";
import DetailStories from "./components/DetailRules";
import ModalFormStories from "./components/ModalFormRules";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setShowDataStories } from "../../redux/slices/stories";
import { deleteStories, getStories } from "../../services/stories";
import { fetchStoriesTableData } from "../../redux/slices/stories/action";
import { StoriesData } from "../../redux/slices/stories/data";
import { deleteRules, getRules } from "../../services/rulesService";
import DetailRules from "./components/DetailRules";
import ModalFormRules from "./components/ModalFormRules";
import ResponsesiveTextTable from "../components/ResponsiveTextTable";
import Link from "antd/es/typography/Link";

function Rules() {
  const [modalFormIntentVisible, setModalFormIntentVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const dispatch = useAppDispatch();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [ModalForm, setModalForm] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: "Tên",
      dataIndex: "rule",
      width: 120,
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
      title: "steps",
      valueType: "treeSelect",
      render: (text, record) => (
        // <>
        //   {record?.data?.mapping.map((value: any) => `type: ${value.type}`)}
        //   <br />
        //   {record?.data?.mapping.map((value: any) => value.type)}
        // </>
        <List
          itemLayout="horizontal"
          dataSource={record?.steps}
          style={{ width: 400 }}
          renderItem={(item: any, index) => (
            <List.Item>
              <List.Item.Meta
                // avatar={
                //   <Avatar
                //     src={`https://joesch.moe/api/v1/random?key=${index}`}
                //   />
                // }
                title={item?.intent}
                description={`entity: ${item?.action}`}
              />
            </List.Item>
          )}
        />
      ),
      ellipsis: true,
      hideInSearch: true,
      // dataIndex: "data",
    },
  ] as ProColumns<any>[];

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 8,
        paddingBlock: 4,
        height: "100%",
        width: "100%",
        // backgroundColor: "white",
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <ProList
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="primary"
              danger
              onClick={() => {
                setModalForm(true);
              }}
              // disabled={!access?.["USER_MANAGEMENT.CREATE_USER"]}
            >
              <PlusOutlined /> Tạo rules
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
        // dataSource={currentRow}
        request={async (params, sort, filters) => await getRules()}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} stories`,
        }}
        headerTitle="Danh sách Rules"
        metas={{
          title: {
            render: (dom: any, entity: any) => {
              return <div>{entity?.rule}</div>;
            },
          },
          actions: {
            render: (dom, entity: any) => {
              return [
                <Tooltip title="Chi tiết" key={"1"}>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setShowDetail(true);
                      setCurrentRow(entity);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Sửa thông tin" key={"2"}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setCurrentRow(entity);
                      setModalForm(true);
                    }}
                  />
                </Tooltip>,
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  key={"3"}
                  onConfirm={async () => {
                    const res = await deleteRules(entity?._id);
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
                icon={<ContainerOutlined />}
              />
            ),
            search: false,
          },
        }}
      />

      <ModalFormRules
        visible={ModalForm}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !ModalForm) setCurrentRow(undefined);
          setModalForm(visible);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />

      <Drawer
        width={"60%"}
        open={showDetail}
        title={false}
        // headerStyle={{
        //   padding: 0,
        // }}
        // bodyStyle={{ padding: 0 }}
        onClose={() => {
          setShowDetail(false);
        }}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open) {
            // fetchUserInfo(currentRow?.usrUid);
          } else {
            setCurrentRow(undefined);
          }
        }}
        // closable={false}
      >
        <ProDescriptions<any>
          column={{ xl: 1, sm: 1, xs: 1, md: 1 }}
          title={`Thông tin chi tiết của rule: ${currentRow?.rule}`}
          dataSource={currentRow}
          // request={async () => ({
          //   data: userInfo || {},
          // })}
          params={{
            id: currentRow?.usrUid,
          }}
          columns={columns as ProDescriptionsItemProps<any>[]}
        />
      </Drawer>
    </PageContainer>
  );
}

export default Rules;
