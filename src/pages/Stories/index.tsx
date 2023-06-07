import { ActionType, PageContainer, ProList } from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Drawer,
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
import DetailStories from "./components/DetailStories";
import ModalFormStories from "./components/ModalFormStories";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setShowDataStories } from "../../redux/slices/stories";
import { deleteStories, getStories } from "../../services/stories";
import { fetchStoriesTableData } from "../../redux/slices/stories/action";
import { StoriesData } from "../../redux/slices/stories/data";

function Stories() {
  const [modalFormIntentVisible, setModalFormIntentVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const dispatch = useAppDispatch();
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const { showDataStories, dataStories } = useAppSelector(
    (state) => state.stories
  );
  console.log("dataStories: ", dataStories);

  const column = [{ title: "name" }];

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
        size="small"
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
              <PlusOutlined /> Tạo stories
            </Button>,
          ];
        }}
        actionRef={actionRef}
        onItem={(record) => {
          return {
            onClick: () => {
              setCurrentRow(record);
              dispatch(setShowDataStories(true));
            },
          };
        }}
        options={{
          search: {
            placeholder: "Nhập từ khoá để tìm kiếm...",
            style: { width: 300 },
          },
          // search: false,
          density: false,
          setting: false,
        }}
        rowKey="_id"
        dataSource={dataStories}
        request={async (params, sort, filters) =>
          await dispatch(fetchStoriesTableData({ params, sort, filters }))
        }
        // search={{
        //   // labelWidth: 120,
        //   filterType: "light",
        //   resetText: "Reset",

        // }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} stories`,
        }}
        headerTitle="Danh sách Stories"
        metas={{
          title: {
            render: (dom: any, entity: any) => {
              return <div>{entity?.story}</div>;
            },
          },
          actions: {
            render: (dom, entity: any) => {
              return [
                <Tooltip title="Chi tiết" key={"1"}>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                      dispatch(setShowDataStories(true));
                      setCurrentRow(entity);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Sửa thông tin" key={"2"}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setCurrentRow(entity);
                      setModalFormIntentVisible(true);
                    }}
                  />
                </Tooltip>,
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  key={"3"}
                  onConfirm={async () => {
                    const res = await deleteStories(entity?._id);
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

      <ModalFormStories
        visible={modalFormIntentVisible}
        initiateData={currentRow}
        onVisibleChange={(visible) => {
          if (!visible && !modalFormIntentVisible) setCurrentRow(undefined);
          setModalFormIntentVisible(visible);
        }}
        onSuccess={() => actionRef.current?.reload()}
      />

      <Drawer
        width={"70%"}
        open={showDataStories}
        title={false}
        headerStyle={{
          padding: 0,
        }}
        bodyStyle={{ padding: 0 }}
        onClose={() => {
          dispatch(setShowDataStories(false));
        }}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open) {
            // fetchUserInfo(currentRow?.usrUid);
          } else {
            setCurrentRow(undefined);
          }
        }}
        closable={false}
      >
        <DetailStories initData={currentRow} />
      </Drawer>
    </PageContainer>
  );
}

export default Stories;
