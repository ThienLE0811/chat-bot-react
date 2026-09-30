import { RollbackOutlined } from "@ant-design/icons";
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Alert, Button, Popconfirm, Tag, Tooltip, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  API_URL,
  ModelList,
  ModelVersion,
  TrainStreamEvent,
  activateModel,
  getModels,
} from "../../services/trainService";
import { useCan, withToken } from "../../lib/auth";
import TrainStatusTag, {
  formatDuration,
} from "../Train/components/TrainStatusTag";

function HistoryTrain() {
  const canRun = useCan()("train.run");
  const actionRef = useRef<ActionType>();
  const [summary, setSummary] = useState<Omit<ModelList, "items"> | null>(
    null
  );
  const [activating, setActivating] = useState<string | null>(null);

  // Reload when any training finishes or someone switches models elsewhere.
  useEffect(() => {
    const source = new EventSource(withToken(`${API_URL}/train/events`));
    source.onmessage = (message) => {
      const event: TrainStreamEvent = JSON.parse(message.data);
      if (event.type === "model.activated" || event.type === "done") {
        actionRef.current?.reload();
      }
    };
    return () => source.close();
  }, []);

  const handleActivate = async (modelFile: string) => {
    setActivating(modelFile);
    try {
      await activateModel(modelFile);
      notification.success({
        message: "Đã chuyển model",
        description: `${modelFile} đang chạy.`,
      });
      actionRef.current?.reload();
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setActivating(null);
    }
  };

  const columns: ProColumns<ModelVersion>[] = [
    {
      title: "Tên file model",
      dataIndex: "modelFile",
      render: (_, record) => (
        <>
          <span style={{ fontFamily: "monospace" }}>{record.modelFile}</span>
          {record.isActive && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              Đang chạy
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) =>
        record.status ? <TrainStatusTag status={record.status} /> : "—",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (_, record) =>
        record.createdAt
          ? new Date(record.createdAt).toLocaleString("vi-VN")
          : "—",
    },
    {
      title: "Thời gian train",
      dataIndex: "durationMs",
      render: (_, record) => formatDuration(record.durationMs),
    },
    {
      title: "Dữ liệu",
      dataIndex: "stats",
      render: (_, record) =>
        record.stats ? (
          <Tooltip title={record.dataHash ? `sha256 ${record.dataHash}` : ""}>
            {record.stats.intents} ý định · {record.stats.examples} câu mẫu ·{" "}
            {record.stats.stories} story
          </Tooltip>
        ) : (
          <Tag>{record.source === "legacy" ? "Bản cũ" : "—"}</Tag>
        ),
    },
    {
      title: "Lần kích hoạt gần nhất",
      dataIndex: "lastActivatedAt",
      render: (_, record) =>
        record.lastActivatedAt
          ? new Date(record.lastActivatedAt).toLocaleString("vi-VN")
          : "—",
    },
    {
      title: "",
      valueType: "option",
      fixed: "right",
      render: (_, record) =>
        record.isActive ? null : (
          <Popconfirm
            key="activate"
            title="Chuyển bot sang model này?"
            description="Model đang chạy sẽ được thay ngay lập tức."
            okText="Chuyển"
            cancelText="Huỷ"
            disabled={!canRun}
            onConfirm={() => handleActivate(record.modelFile)}
          >
            <Button
              size="small"
              icon={<RollbackOutlined />}
              loading={activating === record.modelFile}
              disabled={!canRun || !summary?.rasaReachable || !!activating}
            >
              Dùng bản này
            </Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{ paddingInline: 12, paddingBlock: 4 }}
    >
      {summary && !summary.rasaReachable && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 12 }}
          message="Không kết nối được Rasa, chưa thể xem hoặc đổi model đang chạy."
        />
      )}
      <ProTable<ModelVersion>
        actionRef={actionRef}
        rowKey="modelFile"
        headerTitle="Phiên bản model"
        search={false}
        size="small"
        scroll={{ x: "max-content" }}
        options={{ density: false, setting: false, reload: true }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} model`,
        }}
        request={async () => {
          try {
            const { items, ...rest } = await getModels();
            setSummary(rest);
            return { data: items, success: true, total: items.length };
          } catch {
            notification.error({ message: "Không lấy được danh sách model" });
            return { data: [], success: false };
          }
        }}
        columns={columns}
      />
    </PageContainer>
  );
}

export default HistoryTrain;
