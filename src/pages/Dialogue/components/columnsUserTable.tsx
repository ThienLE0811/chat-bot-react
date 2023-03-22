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
      dataIndex: "usrUsername",
      width: 90,
      render: (dom, entity) => {
        return (
          <a
          // onClick={() => {
          //   if (access?.["USER_MANAGEMENT.GET_USER_BY_ID"]) {
          //     setCurrentRow(entity);
          //     setShowDetail(true);
          //   }
          // }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "usrStatus",
      valueType: "select",
      initialValue: "ACTIVE",
      valueEnum: {
        ACTIVE: { text: <Badge status="success" text="Hoạt động" /> },
        INACTIVE: { text: <Badge status="error" text="Không hoạt động" /> },
      },
    },
    {
      title: "Email",
      dataIndex: "usrEmail",
    },
    {
      title: "Phòng ban",
      dataIndex: "usrPosition",
      hideInSearch: true,
      ellipsis: true,
      // hideInDescriptions: true,
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={60} text={text} />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "usrFirstName",
      hideInSearch: true,
      renderText: (text, record) =>
        `${record?.usrFirstName} ${record?.usrLastName}`,
    },
    {
      title: "Số điện thoại",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={60} text={text} />
      ),
      dataIndex: "usrPhone",
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
      dataIndex: "grpCode",
    },
    // {
    //   title: 'Domain name',
    //   render: (text) => <ResponsesiveTextTable maxWidth={200} minWidth={90} text={text} />,
    //   ellipsis: true,
    //   hideInSearch: true,
    //   dataIndex: 'usrDn',
    // },
    {
      title: "Khu vực",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={50} text={text} />
      ),
      ellipsis: true,
      hideInSearch: true,
      hideInTable: true,
      dataIndex: "depUId",
    },
    {
      title: "Công việc",
      render: (text) => (
        <ResponsesiveTextTable maxWidth={200} minWidth={65} text={text} />
      ),
      ellipsis: true,
      hideInSearch: true,
      dataIndex: "usrJob",
      hideInTable: true,
    },

    {
      title: "Ngày tạo",
      dataIndex: "usrCreateDate",
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
      dataIndex: "usrUpdateDate",
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
        <Tooltip title="Thay đổi trạng thái" key={"2"}>
          <Switch
            checked={record?.usrStatus === "ACTIVE"}
            // disabled={!access?.["USER_MANAGEMENT.IN_ACTIVE_USER"]}
            // onChange={(checked, event) => {
            //   api.user
            //     .updateStatusUser({
            //       usrUid: record?.usrUid,
            //       usrStatus: checked ? "ACTIVE" : "INACTIVE",
            //     })
            //     .then((value:any) => {
            //       if (value.body?.status === "OK") {
            //         message.success("Cập nhật thành công!");
            //         actionRef.current?.reload();
            //       } else {
            //       }
            //       // console.log(event);
            //     });
            // }}
          />
        </Tooltip>,
      ],
    },
  ] as ProColumns<any>[];
};
