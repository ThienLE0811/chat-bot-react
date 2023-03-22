// import ResponsesiveTextTable from "@/components/ResponsiveTextTable";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Badge, Button, message, Popconfirm, Switch, Tooltip } from "antd";
import { useRef, useState } from "react";
import ResponsesiveTextTable from "../../components/ResponsiveTextTable";

export default () => {
  const [modalFormIntentVisible, setModalFormIntentVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>(
  //   []
  // );
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loadCheck, setLoadCheck] = useState({});
  //   const access = useAccess();

  return [
    {
      title: "Tên",
      dataIndex: "title",
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
      title: "Nội dung",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={300} minWidth={150} text={text} />
      ),
      ellipsis: true,
      hideInSearch: true,
      // hideInTable: true,
      dataIndex: "dataIntent",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={70} text={text} />
      ),
      hideInSearch: true,
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "Ngày cập nhật",
      hideInForm: true,
      dataIndex: "updatedAt",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={300} minWidth={150} text={text} />
      ),
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
      hideInSearch: true,
    },
    {
      title: "Hành động",
      dataIndex: "option",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (_, record) => [
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
            onClick={() => {
              setCurrentRow(record);
              setModalFormIntentVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title="Xóa thông tin"
          key={"1"}
          onConfirm={async () => {
            const res = await 1;
            if (res) {
              message.success("Xóa thành công");
              actionRef.current?.reload();
            } else {
              message.error("Xóa không thành công");
            }
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          />
        </Popconfirm>,
      ],
    },
  ] as ProColumns<any>[];
};
