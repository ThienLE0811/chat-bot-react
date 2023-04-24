import {
  LoadingOutlined,
  RocketOutlined,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  notification,
  Popconfirm,
  Result,
  Space,
  Table,
  Tag,
  Image,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { setDataModel } from "../../redux/slices/account";
import { getIntent } from "../../services/intentServices";
import { parseMessage } from "../../services/trainService";
import ViewTrain from "./components/ViewTrain";
import "./index.css";

interface DataType {
  title: string;
  data: string;
}

const columns: any = [
  {
    title: "id",
    dataIndex: "_id",
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: "Tên",
    dataIndex: "title",
  },
  {
    title: "Mô tả",
    dataIndex: "examples",
    valueType: "treeSelect",
    hideInSearch: true,
  },
];

function Train() {
  const [showTableAlert, setShowTableAlert] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const actionRef = useRef<ActionType>();

  const dispatch = useAppDispatch();
  const [hello, setHello] = useState("ok");
  setTimeout(() => {
    setHello("no");
  }, 10000);

  return (
    // <PageContainer
    //   breadcrumbRender={false}
    //   header={{
    //     title: "Train",

    //     extra: [
    //       <Tooltip title="Train Bot">
    //         <Button
    //           key="1"
    //           icon={<RocketOutlined />}
    //           shape="circle"
    //           size="large"
    //         ></Button>
    //       </Tooltip>,
    //     ],
    //   }}
    //   tabList={[
    //     {
    //       tab: <span className="train-list-header">Ý định</span>,
    //       key: "1",
    //       animated: true,
    //       children: (
    //         <div>
    //           <ProTable
    //             actionRef={actionRef}
    //             bordered
    //             className="train-list"
    //             rowSelection={{
    //               onSelect: (record, selected, selectedRows: any) => {
    //                 setSelectedRows(selectedRows);
    //               },
    //               alwaysShowAlert: true,
    //             }}
    //             tableAlertRender={({
    //               selectedRowKeys,
    //               selectedRows,
    //               onCleanSelected,
    //             }) => {
    //               return (
    //                 <Space size={24}>
    //                   <span className="train-list-header">
    //                     Đã chọn {selectedRows.length} mục
    //                   </span>
    //                 </Space>
    //               );
    //             }}
    //             tableAlertOptionRender={() => {
    //               const handleCreate = () => {
    //                 const data = selectedRows.map((value: any) => value);

    //                 console.log("data:: ", data);

    //                 dispatch(setDataModel(data));

    //                 // setSelectedRows([]);
    //                 // actionRef.current?.reload();
    //               };

    //               return (
    //                 <Popconfirm
    //                   key={1}
    //                   title="Bạn chắc chắn muốn thêm dữ liệu cho model không?"
    //                   onConfirm={handleCreate}
    //                 >
    //                   <Button
    //                     key={2}
    //                     type="primary"
    //                     size="middle"
    //                     color="green"
    //                   >
    //                     Thêm
    //                   </Button>
    //                 </Popconfirm>
    //               );
    //             }}
    //             pagination={{
    //               defaultPageSize: 10,
    //               showSizeChanger: true,
    //               showTotal: (total, range) =>
    //                 `${range[0]}-${range[1]} trên ${total} ý định`,
    //             }}
    //             options={false}
    //             request={() => getIntent()}
    //             columns={columns}
    //             rowKey="_id"
    //           />
    //         </div>
    //       ),
    //     },
    //     {
    //       tab: <span className="train-list-header">Phản hồi</span>,
    //       key: "2",
    //       animated: true,
    //       children: <Table bordered className="train-list" />,
    //     },
    //     {
    //       tab: <span className="train-list-header">Thực thể</span>,
    //       key: "3",
    //       animated: true,
    //       children: <Table bordered className="train-list" />,
    //     },
    //     {
    //       tab: <span className="train-list-header">Slots</span>,
    //       key: "4",
    //       animated: true,
    //       children: <Table bordered className="train-list" />,
    //     },
    //     {
    //       tab: <span className="train-list-header">Kho hội thoại</span>,
    //       key: "5",
    //       animated: true,
    //       children: <Table bordered className="train-list" />,
    //     },
    //   ]}
    // ></PageContainer>

    <PageContainer
      breadcrumbRender={false}
      // header={{
      //   title: false,
      //   extra: [
      //     <Tooltip title="Train Bot">
      //       <Button
      //         key="1"
      //         icon={<RocketOutlined />}
      //         shape="circle"
      //         size="large"
      //       ></Button>
      //     </Tooltip>,
      //   ],
      // }}

      childrenContentStyle={{
        paddingInline: 0,
        paddingBlock: 0,
        borderRadius: 0,
        height: "100%",
        backgroundColor: "white",
      }}
      title={false}
    >
      {/* <ProTable
        headerTitle="Train Bot"
        style={{ width: "100%", padding: 0, height: "100%" }}
        options={false}
        search={false}
        defaultSize="small"
        toolBarRender={() => [
          // <Button
          // >
          //   Choose Connector
          // </Button>,

          // <Tag color={"processing"}>{<SyncOutlined spin />}</Tag>,
          <Tooltip title="Đang train">
            <Button
              key={1}
              shape="circle"
              size="large"
              loading
              style={{ cursor: "pointer" }}
            ></Button>
          </Tooltip>,
          <Tooltip title="Train Bot">
            <Button
              key="2"
              icon={<RocketOutlined />}
              shape="circle"
              size="large"
              onClick={() => parseMessage()}
            ></Button>
          </Tooltip>,
        ]}
        tableViewRender={() => <ViewTrain />}
      /> */}
      <Card
        title="Train"
        className="view-train"
        extra={
          <Space>
            {/* <Tooltip title="Đang train">
              <Button
                key={1}
                shape="circle"
                size="large"
                loading
                style={{ cursor: "pointer" }}
              ></Button>
            </Tooltip> */}

            <Tooltip title="Train Bot">
              <Button
                key="1"
                icon={<RocketOutlined />}
                shape="circle"
                size="large"
                // onClick={() => parseMessage()}
              ></Button>
            </Tooltip>
          </Space>
        }
      >
        {hello === "ok" ? (
          <Result
            icon={<LoadingOutlined />}
            title="Đang trong quá trình đào tạo model của bạn!"
            subTitle="Quá trình đào tạo có thể mất vài phút, vui lòng đợi."
            extra={<Button type="primary">OK</Button>}
          />
        ) : (
          <Result
            status="success"
            title="Model của bạn đã được đào tạo thành công, hãy cùng trải nghiệm nhé!"
            subTitle="Bạn có thể kiểm tra độ chính xác của model bạn vừa đào tạo."
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => parseMessage()}
              >
                Kiểm tra
              </Button>,
            ]}
          />
        )}
        <div className="img-train">
          <Image
            width={280}
            src="/avatarChatbot.jpg"
            sizes="large"
            preview={false}
          />
        </div>
      </Card>
    </PageContainer>
  );
}

export default Train;
