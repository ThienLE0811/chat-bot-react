import { RocketOutlined } from "@ant-design/icons";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import {
  Button,
  Divider,
  List,
  notification,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { setDataModel } from "../../redux/slices/account";
import { getIntent } from "../../services/intentServices";
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

  return (
    <PageContainer
      breadcrumbRender={false}
      header={{
        title: "Train",

        extra: [
          <Tooltip title="Train Bot">
            <Button
              key="1"
              icon={<RocketOutlined />}
              shape="circle"
              size="large"
            ></Button>
          </Tooltip>,
        ],
      }}
      tabList={[
        {
          tab: <span className="train-list-header">Ý định</span>,
          key: "1",
          animated: true,
          children: (
            <div>
              <ProTable
                actionRef={actionRef}
                bordered
                className="train-list"
                rowSelection={{
                  onSelect: (record, selected, selectedRows: any) => {
                    setSelectedRows(selectedRows);
                  },
                  alwaysShowAlert: true,
                }}
                tableAlertRender={({
                  selectedRowKeys,
                  selectedRows,
                  onCleanSelected,
                }) => {
                  return (
                    <Space size={24}>
                      <span className="train-list-header">
                        Đã chọn {selectedRows.length} mục
                      </span>
                    </Space>
                  );
                }}
                tableAlertOptionRender={() => {
                  const handleCreate = () => {
                    const data = selectedRows.map((value: any) => value);

                    console.log("data:: ", data);

                    dispatch(setDataModel(data));

                    // setSelectedRows([]);
                    // actionRef.current?.reload();
                  };

                  return (
                    <Popconfirm
                      key={1}
                      title="Bạn chắc chắn muốn thêm dữ liệu cho model không?"
                      onConfirm={handleCreate}
                    >
                      <Button
                        key={2}
                        type="primary"
                        size="middle"
                        color="green"
                      >
                        Thêm
                      </Button>
                    </Popconfirm>
                  );
                }}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} trên ${total} ý định`,
                }}
                options={false}
                request={() => getIntent()}
                columns={columns}
                rowKey="_id"
              />
            </div>
          ),
        },
        {
          tab: <span className="train-list-header">Phản hồi</span>,
          key: "2",
          animated: true,
          children: <Table bordered className="train-list" />,
        },
        {
          tab: <span className="train-list-header">Thực thể</span>,
          key: "3",
          animated: true,
          children: <Table bordered className="train-list" />,
        },
        {
          tab: <span className="train-list-header">Slots</span>,
          key: "4",
          animated: true,
          children: <Table bordered className="train-list" />,
        },
        {
          tab: <span className="train-list-header">Kho hội thoại</span>,
          key: "5",
          animated: true,
          children: <Table bordered className="train-list" />,
        },
      ]}
    ></PageContainer>
  );
}

export default Train;
