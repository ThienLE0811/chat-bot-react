import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import {
  CloseOutlined,
  DragOutlined,
  InteractionOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Space,
  Table,
  notification,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactDragListView from "react-drag-listview";
import { useDynamicList } from "ahooks";
import { getSlots } from "../../../services/slotsService";
import { setShowDataStories } from "../../../redux/slices/stories";
import { useAppDispatch } from "../../../hooks/redux";
import { getOneStories, updateStories } from "../../../services/stories";
import { updateStoriesData } from "../../../redux/slices/stories/action";

interface Item {
  name?: string;
  age?: string;
  memo?: string;
}

const DetailStories = ({ initData }: any) => {
  const actionRef = useRef<ActionType>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState(undefined);
  const [defaultValue, setDefaultValue] = useState(undefined);
  const [valueUpdate, setValueUpdate] = useState(undefined);
  const dispatch = useAppDispatch();
  const _ = require("lodash");
  const [initialData, setInitialData] = useState<any>(initData);
  const [form] = Form.useForm();

  const [result, setResult] = useState<any>();
  useEffect(() => {
    const getData = async () => {
      const res = await getOneStories(initData?._id);
      setInitialData(res?.data);
    };
    getData();
  }, []);
  console.log("initialData", initialData?.steps);
  console.log("initdata ", initData?.steps);
  const { list, remove, getKey, move, push, sortList } = useDynamicList<any>(
    initialData?.steps
  );

  const columns = [
    {
      title: "intent",
      dataIndex: "intent",
      key: "intent",
      render: (text: string, row: Item, index: number) => (
        <>
          <DragOutlined style={{ cursor: "move", marginRight: 8 }} />
          <Form.Item
            name={["params", getKey(index), "intent"]}
            initialValue={text}
            noStyle
          >
            <Input
              style={{ width: "max-content", marginRight: 16 }}
              placeholder={"....."}
              disabled
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "action",
      dataIndex: "action",
      key: "action",
      render: (text: string, row: Item, index: number) => (
        <>
          <DragOutlined style={{ cursor: "move", marginRight: 8 }} />
          <Form.Item
            name={["params", getKey(index), "action"]}
            initialValue={text}
            noStyle
          >
            <Input
              style={{ width: "max-content", marginRight: 16 }}
              placeholder={"....."}
              disabled
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: "option",
      title: "Hành động",
      dataIndex: "",
      render: (text: any, row: Item, index: number) => (
        <>
          <Form.Item
            // name={["params", getKey(index), ""]}
            initialValue={text}
            noStyle
          ></Form.Item>
          <Button.Group>
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);

                const obj = text;
                const key: any = Object.keys(obj)[0];
                const value: any = Object.values(obj)[0];
                setCurrentRow(key);
                setDefaultValue(value);
                setValueUpdate(obj);
              }}
            >
              Update
            </Button>
            <Button danger onClick={() => remove(index)}>
              Delete
            </Button>
          </Button.Group>
        </>
      ),
    },
  ];
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<ProfileOutlined />}
        onClick={() => {
          push({ name: "new row", age: "25" });
        }}
      >
        Intent
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          push({ name: "new row", age: "25" });
        }}
        icon={<InteractionOutlined />}
      >
        Action
      </Menu.Item>
    </Menu>
  );

  return (
    // <div style={{ height: "max-content" }}>
    //   <h2>React Flow Renderer</h2>
    //   <div style={{ height: "800px" }}>
    //     <OverviewFlow />
    //   </div>
    // </div>
    <>
      <ProCard
        title={`Thông tin chi tiết stories: ${initData?.story}`}
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
            {/* <Button
            size="small"
            key={1}
            onClick={() => push({ name: "new row", age: "25" })}
          >
            + Add row
          </Button> */}
            <Button size="small" key={1}>
              <Dropdown overlay={menu} trigger={["hover"]}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  // className={`action account`}
                >
                  {/* <Avatar icon={<UserOutlined />} className={"avatar"} /> */}
                  + Add row
                </span>
              </Dropdown>
            </Button>

            <Button
              type="primary"
              size="small"
              key={2}
              onClick={() => {
                form
                  .validateFields()
                  .then(async (val) => {
                    console.log(val, val.params);
                    const sortedResult: any = sortList(val.params);
                    const data = {
                      steps: sortedResult,
                      story: initData?.story,
                    };
                    const transformData = {
                      id: initData?._id,
                      data: data,
                    };
                    console.log("sortedResult:: ", sortedResult);
                    // setResult(JSON.stringify(sortedResult, null, 2));
                    setResult(sortedResult);
                    // try {
                    //   const res: any = await updateStories(initData?._id, data);
                    //   if (res?.data?.statusCode === 200) {
                    //     // onVisibleChange(false);
                    //     // onSuccess?.();
                    //     // actionRef.current?.reload();
                    //     notification.success({
                    //       message: "Cập nhật stories thành công",
                    //     });
                    //     return Promise.resolve();
                    //   } else {
                    //     notification.error({
                    //       message: "Thao tác không thành công",
                    //     });
                    //     return Promise.reject();
                    //   }
                    // } catch (error) {
                    //   console.log(error);
                    // }
                    dispatch(updateStoriesData(transformData));
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
                pagination={false}
                tableLayout="fixed"

                // pagination={{
                //   defaultPageSize: 10,
                //   showSizeChanger: true,
                //   showTotal: (total, range) =>
                //     `${range[0]}-${range[1]} trên ${total} thực thể`,
                // }}
              />
            </ReactDragListView>
          </Form>

          <div style={{ whiteSpace: "pre" }}>{}</div>

          <div style={{ whiteSpace: "pre" }}>
            {result && `content: ${result}`}
          </div>
        </div>
      </ProCard>
      <ModalForm
        open={showModal}
        initialValues={currentRow}
        onOpenChange={(open) => {
          if (!open) setCurrentRow(undefined);

          setShowModal(open);
        }}
        title={"Cập nhật ::"}
        width={"40%"}
        onFinish={async (values) => {
          const filteredData = initData?.steps.filter(
            (item: any) => !_.isEqual(item, valueUpdate)
          );
          console.log(" filteredData:: ", filteredData);
          filteredData.push(values);
          console.log(" filteredData:: ", filteredData);
          const data = {
            steps: filteredData,
            story: initData?.story,
          };
          const transformData = {
            id: initData?._id,
            data: data,
          };
          // await dispatch(updateStoriesData(transformData));
          try {
            const res = await dispatch(updateStoriesData(transformData));
            console.log("res:: ", res);
            if (res?.meta?.requestStatus === "fulfilled") {
              setShowModal(false);
              const res = await getOneStories(initData?._id);
              setInitialData(res?.data);
              actionRef.current?.reload();
            }
          } catch (error) {}
        }}
      >
        <ProFormText name={currentRow} initialValue={defaultValue} />
      </ModalForm>
    </>
  );
};

export default DetailStories;
