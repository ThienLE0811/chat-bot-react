import { PageContainer, ProCard } from "@ant-design/pro-components";
import { CloseOutlined, DragOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import ReactDragListView from "react-drag-listview";
import { useDynamicList } from "ahooks";
import { getSlots } from "../../../services/slotsService";
import { setShowDataStories } from "../../../redux/slices/account";
import { useAppDispatch } from "../../../hooks/redux";

interface Item {
  name?: string;
  age?: string;
  memo?: string;
}

const DetailStories = ({ initData }: any) => {
  console.log("initdata:: ", initData);
  const { list, remove, getKey, move, push, sortList } = useDynamicList<any>([
    initData,
  ]);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [result, setResult] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "nameSlot",
      key: "nameSlot",
      render: (text: string, row: Item, index: number) => (
        <>
          <DragOutlined style={{ cursor: "move", marginRight: 8 }} />
          <Form.Item
            name={["params", getKey(index), "nameSlot"]}
            initialValue={text}
            noStyle
          >
            <Input style={{ width: 120, marginRight: 16 }} placeholder="name" />
          </Form.Item>
        </>
      ),
    },
    {
      key: "option",
      title: "Hành động",
      dataIndex: "memo",
      render: (text: string, row: Item, index: number) => (
        <>
          <Form.Item
            name={["params", getKey(index), "memo"]}
            initialValue={text}
            noStyle
          ></Form.Item>
          <Button.Group>
            <Button type="primary">Update</Button>
            <Button danger onClick={() => remove(index)}>
              Delete
            </Button>
          </Button.Group>
        </>
      ),
    },
  ];

  return (
    // <div style={{ height: "max-content" }}>
    //   <h2>React Flow Renderer</h2>
    //   <div style={{ height: "800px" }}>
    //     <OverviewFlow />
    //   </div>
    // </div>

    <ProCard
      title={`Thông tin chi tiết stories: ${initData?.nameSlot}`}
      bodyStyle={{
        paddingInline: 16,
        paddingBlock: 2,
        height: "100%",
        width: "100%",
      }}
      headStyle={{
        paddingInline: 4,
        paddingBlock: 4,
        backgroundColor: "#dbdbdb",
      }}
      bordered
      boxShadow
      style={{ height: "100%", width: "100%" }}
      extra={
        <Space>
          <Button
            size="small"
            key={1}
            onClick={() => push({ name: "new row", age: "25" })}
          >
            + Add row
          </Button>

          <Button
            type="primary"
            size="small"
            key={2}
            onClick={() => {
              form
                .validateFields()
                .then((val) => {
                  console.log(val, val.params);
                  const sortedResult = sortList(val.params);
                  setResult(JSON.stringify(sortedResult, null, 2));
                })
                .catch(() => {});
            }}
          >
            Submit
          </Button>

          <Button
            icon={<CloseOutlined />}
            danger
            size="small"
            key={3}
            type="default"
            onClick={() => {
              dispatch(setShowDataStories(false));
            }}
          >
            Đóng
          </Button>
        </Space>
      }
    >
      <div style={{ height: "100%", width: "100%", boxSizing: "border-box" }}>
        <Form form={form}>
          <ReactDragListView
            onDragEnd={(oldIndex: number, newIndex: number) =>
              move(oldIndex, newIndex)
            }
            handleSelector={'span[aria-label="drag"]'}
          >
            <Table
              columns={columns}
              dataSource={list}
              rowKey="_id"
              // pagination={false}
              tableLayout="fixed"
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} trên ${total} thực thể`,
              }}
            />
          </ReactDragListView>
        </Form>

        <div style={{ whiteSpace: "pre" }}>
          {result && `content: ${result}`}
        </div>
      </div>
    </ProCard>
  );
};

export default DetailStories;
