import {
  PageContainer,
  ProCard,
  ProFormSelect,
} from "@ant-design/pro-components";
import { DragOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Table } from "antd";
import React, { useState } from "react";
import ReactDragListView from "react-drag-listview";
import { useDynamicList } from "ahooks";
import OverviewFlow from "./components/FlowRenderer";
import Flow from "./components/FlowRenderer";
import { getPermissionRole } from "../../services/groupService";

interface Item {
  name?: string;
  age?: string;
  memo?: string;
}

const Stories = () => {
  const { list, remove, getKey, move, push, sortList } = useDynamicList<Item>([
    { name: "my bro", age: "23", memo: "he's my bro" },
    { name: "my sis", age: "21", memo: "she's my sis" },
    {},
  ]);

  const [form] = Form.useForm();

  const [result, setResult] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, row: Item, index: number) => (
        <>
          <DragOutlined style={{ cursor: "move", marginRight: 8 }} />
          <Form.Item
            name={["params", getKey(index), "name"]}
            initialValue={text}
            noStyle
          >
            <Input style={{ width: 120, marginRight: 16 }} placeholder="name" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (text: string, row: Item, index: number) => (
        <Form.Item
          name={["params", getKey(index), "age"]}
          initialValue={text}
          noStyle
        >
          <Input style={{ width: 120, marginRight: 16 }} placeholder="age" />
        </Form.Item>
      ),
    },
    {
      key: "memo",
      title: "Memo",
      dataIndex: "memo",
      render: (text: string, row: Item, index: number) => (
        <>
          <Form.Item
            name={["params", getKey(index), "memo"]}
            initialValue={text}
            noStyle
          >
            <Input
              style={{ width: 300, marginRight: 16 }}
              placeholder="please input the memo"
            />
          </Form.Item>
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

    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 0,
        paddingBlock: 0,
        borderRadius: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <div>
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
              pagination={false}
            />
          </ReactDragListView>
        </Form>
        <Button
          style={{ marginTop: 8 }}
          block
          type="dashed"
          onClick={() => push({ name: "new row", age: "25" })}
        >
          + Add row
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
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
        <div style={{ whiteSpace: "pre" }}>
          {result && `content: ${result}`}
        </div>
      </div>
    </PageContainer>
  );
};

export default Stories;
