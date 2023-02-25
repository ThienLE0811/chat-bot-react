import { PlusOutlined } from "@ant-design/icons";
import {
  ActionType,
  PageContainer,
  ProTable,
} from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef } from "react";
import { PostsInfo } from "../../services/data";

function Dialogue() {
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer
      childrenContentStyle={{
        padding: 12,
      }}
      breadcrumbRender={false}
      title={false}
      footer={[]}
    >
      <ProTable<PostsInfo>
        // columns={columns}
        actionRef={actionRef}
        cardBordered
        bordered
        debounceTime={800}
        headerTitle="Danh sách Intent"
        size="small"
        tableLayout="auto"
        // dataSource={postsListData.data}
        // request={async (params = {}, sort, filter) => {
        //   dispatch(fetchPostsTableData({ params, sort, filter }));
        //   return [];
        // }}
        rowKey="id"
        search={{
          filterType: "light",
        }}
        cardProps={{
          bodyStyle: { padding: 4 },
        }}
        options={{
          search: {
            placeholder: "Tìm kiếm bài viết...",
          },
          setting: false,
          density: false,
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                categorys: values.categorys,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            // onClick={() =>()}
            icon={<PlusOutlined />}
            type="primary"
          >
            Tạo mới
          </Button>,
        ]}
      />
      {/* <ModalPostsForm
        modalProps={{
          open: ,
        }}
        onCancel={() => )}
      /> */}
    </PageContainer>
  );
}

export default Dialogue;
