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
            <Button danger onClick={() => remove(index)}>
              Delete
            </Button>
          </Button.Group>
        </>
      ),
    },
  ];

  // onDragEnd(fromIndex, toIndex) {
  //   const data = [...that.state.data];
  //   const item = data.splice(fromIndex, 1)[0];
  //   data.splice(toIndex, 0, item);
  //   that.setState({ data });
  // },

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
          {/* <Table
              columns={columns}
              dataSource={list}
              rowKey="_id"
              handleSelector={'span[aria-label="drag"]'}
              pagination={false}
            /> */}
          {list.map((val, key) => (
            <ReactDragListView
              onDragEnd={(oldIndex: number, newIndex: number) => {
                move(oldIndex, newIndex);
                console.log("oldIndex:: ", oldIndex);
              }}
              handleSelector={".drag"}
              nodeSelector="div"
            >
              <div>
                <DragOutlined
                  style={{ cursor: "move", marginRight: 8 }}
                  className="drag"
                />{" "}
                {val?.name}
              </div>
              <div>{val?.age}</div>
              <div>{val?.memo}</div>
            </ReactDragListView>
          ))}
        </Form>
        <Button
          style={{ marginTop: 8 }}
          // style={{ margin: "16px 50%" }}
          block
          type="dashed"
          onClick={() => push({ name: "new row", age: "25" })}
        >
          + Add row
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          // style={{ margin: "16px auto" }}
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
          {result && `Thông tin stories: ${result}`}
        </div>
      </div>
    </PageContainer>
    // <ProCard
    //   headStyle={{ padding: 0, margin: 0 }}
    //   bodyStyle={{ height: "100%", padding: 0, margin: 0 }}
    //   style={{ height: "100%" }}
    // >
    //   <div style={{ minHeight: "800px", height: "100%" }}>
    //     <OverviewFlow />
    //   </div>
    // </ProCard>
  );
};

export default Stories;
