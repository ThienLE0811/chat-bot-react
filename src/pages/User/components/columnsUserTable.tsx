// import ResponsesiveTextTable from "@/components/ResponsiveTextTable";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Badge, Button, message, Popconfirm, Switch, Tooltip } from "antd";
import { useRef, useState } from "react";
import ResponsesiveTextTable from "../../components/ResponsiveTextTable";

export default () => {
  //   const {
  //     currentRow,
  //     setCurrentRow,
  //     setShowDetail,
  //     setModalFormUserVisible,
  //     actionRef,
  //   } = useModel("user", (model) => ({
  //     currentRow: model.currentRow,
  //     setCurrentRow: model.setCurrentRow,
  //     setShowDetail: model.setShowDetail,
  //     setModalFormUserVisible: model.setModalFormUserVisible,
  //     actionRef: model.actionRef,
  //   }));

  const [modalFormUserVisible, setModalFormUserVisible] =
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
      title: "Tài khoản",
      dataIndex: "userName",
      width: 90,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "usrStatus",
    //   valueType: "select",
    //   initialValue: "ACTIVE",
    //   valueEnum: {
    //     ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
    //     INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
    //   },
    // },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "firstName",
      hideInSearch: true,
      renderText: (text, record) => `${record?.firstname} ${record?.lastname}`,
    },
    {
      title: "Nhóm",
      renderText: (text, record) => (
        <ResponsesiveTextTable
          maxWidth={200}
          minWidth={40}
          text={record?.grpName}
        />
      ),
      ellipsis: true,
      debounceTime: 800,
      fieldProps: {
        showSearch: true,
      },
      formItemProps: {},
      //   request: async ({ keyWords }) =>
      //     (
      //       await api.group.getListGroup({ params: { keyword: keyWords } })
      //     ).data?.map((value: any) => ({
      //       label: value?.grpName,
      //       value: value?.grpCode,
      //     })),
      dataIndex: "userRoleName",
    },
    // {
    //   title: 'Domain name',
    //   render: (text) => <ResponsesiveTextTable maxWidth={200} minWidth={90} text={text} />,
    //   ellipsis: true,
    //   hideInSearch: true,
    //   dataIndex: 'usrDn',
    // },
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
      dataIndex: "updateAt",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={100} text={text} />
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
      width: 80,
      render: (_, record) => [
        <Tooltip title="Sửa thông tin" key={"1"}>
          <Button
            icon={<EditOutlined />}
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
            onClick={() => {
              !currentRow?.usrUid && setCurrentRow(record);
              setModalFormUserVisible(true);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title="Xóa thông tin"
          key={"2"}
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
            danger
            // disabled={access?.["USER_MANAGEMENT.UPDATE_USER"] ? false : true}
          />
        </Popconfirm>,
      ],
    },
  ] as ProColumns<any>[];
};
