import {
  MessageOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Alert,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  TrainJob,
  TrainingDataStats,
  ValidationReport,
  getModels,
  getTrainJobs,
  isTerminal,
  startTrain,
  validateTrainingData,
} from "../../services/trainService";
import TabsTrain from "./components/TabsTrain";
import TrainLog from "./components/TrainLog";
import TrainStatusTag, { formatDuration } from "./components/TrainStatusTag";
import TrainTimeline from "./components/TrainTimeline";
import ValidationPanel from "./components/ValidationPanel";
import { useTrainJob } from "./useTrainJob";
import "./index.css";

const STAT_LABELS: [keyof TrainingDataStats, string][] = [
  ["intents", "Ý định"],
  ["examples", "Câu mẫu"],
  ["responses", "Phản hồi"],
  ["stories", "Story"],
  ["rules", "Rule"],
  ["slots", "Slot"],
];

/** Re-renders every second while `active`, for the elapsed-time counter. */
function useNow(active: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);
  return now;
}

const ActiveModelTag = ({
  reachable,
  model,
}: {
  reachable: boolean;
  model: string | null;
}) => {
  if (!reachable) return <Tag color="red">Không kết nối được Rasa</Tag>;
  if (!model) return <Tag>Chưa có</Tag>;
  return <Tag color="green">{model}</Tag>;
};

function Train() {
  const [selectedJobId, setSelectedJobId] = useState<string>();
  const [recentJobs, setRecentJobs] = useState<TrainJob[]>([]);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [rasaReachable, setRasaReachable] = useState(true);
  const [starting, setStarting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dryRun, setDryRun] = useState<
    (ValidationReport & { stats: TrainingDataStats }) | null
  >(null);
  const [parseDrawerOpen, setParseDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    const [jobs, models] = await Promise.allSettled([
      getTrainJobs(10),
      getModels(),
    ]);
    if (jobs.status === "fulfilled") setRecentJobs(jobs.value.items);
    if (models.status === "fulfilled") {
      setActiveModel(models.value.activeModel);
      setRasaReachable(models.value.rasaReachable);
    }
    return jobs.status === "fulfilled" ? jobs.value.items : [];
  }, []);

  useEffect(() => {
    refresh().then((jobs) => {
      if (jobs[0]) setSelectedJobId((current) => current ?? jobs[0]._id);
    });
  }, [refresh]);

  const handleDone = useCallback(
    (finished: TrainJob) => {
      refresh();
      if (finished.status === "loaded") {
        notification.success({
          message: "Train thành công",
          description: `Model ${finished.modelFile} đang chạy.`,
        });
      } else {
        notification.error({
          message: "Train thất bại",
          description: finished.error?.message,
        });
      }
    },
    [refresh]
  );

  const { job, connected } = useTrainJob(selectedJobId, handleDone);
  const running = !!job && !isTerminal(job.status);
  const now = useNow(running);

  const handleTrain = async () => {
    setStarting(true);
    try {
      const { jobId, alreadyRunning } = await startTrain();
      if (alreadyRunning) {
        notification.info({
          message: "Đang có phiên train chạy",
          description: "Đang hiển thị tiến độ của phiên đó.",
        });
      }
      setDryRun(null);
      setSelectedJobId(jobId);
      refresh();
    } catch (error: any) {
      notification.error({ message: error.message });
    } finally {
      setStarting(false);
    }
  };

  const handleValidate = async () => {
    setChecking(true);
    try {
      setDryRun(await validateTrainingData());
    } catch {
      notification.error({ message: "Không kiểm tra được dữ liệu" });
    } finally {
      setChecking(false);
    }
  };

  const validation = dryRun ?? job?.validation;
  const stats = dryRun?.stats ?? job?.stats;
  const elapsed = job?.startedAt
    ? Math.max(
        (job.finishedAt ? new Date(job.finishedAt).getTime() : now) -
          new Date(job.startedAt).getTime(),
        0
      )
    : undefined;
  // The list is fetched once; show the followed job's live status in it.
  const jobRows = recentJobs.map((row) =>
    job && row._id === job._id ? { ...row, ...job } : row
  );

  return (
    <PageContainer
      breadcrumbRender={false}
      title={false}
      childrenContentStyle={{ paddingInline: 12, paddingBlock: 8 }}
    >
      <Card
        title="Train model"
        className="train-page__card"
        extra={
          <Space wrap>
            <Tooltip title="Kiểm tra dữ liệu mà không train">
              <Button
                icon={<SafetyCertificateOutlined />}
                loading={checking}
                onClick={handleValidate}
              >
                Kiểm tra dữ liệu
              </Button>
            </Tooltip>
            <Button
              icon={<MessageOutlined />}
              onClick={() => setParseDrawerOpen(true)}
            >
              Thử câu
            </Button>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              loading={starting || running}
              onClick={handleTrain}
            >
              {running ? "Đang train" : "Train"}
            </Button>
          </Space>
        }
      >
        <Space wrap size={[16, 8]} className="train-page__summary">
          <span>
            Model đang chạy:{" "}
            <ActiveModelTag reachable={rasaReachable} model={activeModel} />
          </span>
          {job && (
            <>
              <span>
                Phiên hiện tại: <TrainStatusTag status={job.status} />
              </span>
              <span>Thời gian: {formatDuration(elapsed)}</span>
              {running && (
                <Tag color={connected ? "blue" : "orange"}>
                  {connected ? "Đang nhận tiến độ trực tiếp" : "Đang kết nối lại…"}
                </Tag>
              )}
            </>
          )}
        </Space>

        {job ? (
          <>
            <div className="train-page__timeline">
              <TrainTimeline job={job} />
            </div>
            {job.status === "failed" && job.error && (
              <Alert
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                message="Train thất bại"
                description={job.error.message}
              />
            )}
          </>
        ) : (
          <Empty
            style={{ margin: "24px 0" }}
            description="Chưa có phiên train nào. Bấm Train để bắt đầu."
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={15}>
            <Typography.Title level={5}>Log</Typography.Title>
            <TrainLog logs={job?.logs ?? []} live={running} />
          </Col>
          <Col xs={24} lg={9}>
            <Typography.Title level={5}>
              Dữ liệu {dryRun && <Tag>kết quả kiểm tra thử</Tag>}
            </Typography.Title>
            {stats && (
              <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
                {STAT_LABELS.map(([key, label]) => (
                  <Col span={8} key={key}>
                    <Statistic title={label} value={stats[key]} />
                  </Col>
                ))}
              </Row>
            )}
            {validation ? (
              <ValidationPanel report={validation} />
            ) : (
              <Typography.Text type="secondary">
                Kết quả kiểm tra dữ liệu sẽ hiện ở đây.
              </Typography.Text>
            )}
          </Col>
        </Row>
      </Card>

      <Card title="Các phiên gần đây" style={{ marginTop: 12 }}>
        <Table<TrainJob>
          size="small"
          rowKey="_id"
          pagination={false}
          dataSource={jobRows}
          scroll={{ x: "max-content" }}
          rowClassName={(record) =>
            record._id === selectedJobId ? "train-page__row--selected" : ""
          }
          onRow={(record) => ({
            onClick: () => {
              setDryRun(null);
              setSelectedJobId(record._id);
            },
            style: { cursor: "pointer" },
          })}
          columns={[
            {
              title: "Bắt đầu",
              dataIndex: "createdAt",
              render: (value: string) =>
                new Date(value).toLocaleString("vi-VN"),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (status) => <TrainStatusTag status={status} />,
            },
            {
              title: "Thời lượng",
              dataIndex: "durationMs",
              render: (value?: number) => formatDuration(value),
            },
            {
              title: "Model",
              dataIndex: "modelFile",
              render: (value?: string) => value ?? "—",
            },
            {
              title: "Lỗi",
              dataIndex: ["error", "message"],
              ellipsis: true,
              render: (value?: string) => value ?? "",
            },
          ]}
        />
      </Card>

      <Drawer
        width="60%"
        title="Kiểm tra độ chính xác"
        headerStyle={{ padding: 2 }}
        open={parseDrawerOpen}
        destroyOnClose
        onClose={() => setParseDrawerOpen(false)}
      >
        <TabsTrain />
      </Drawer>
    </PageContainer>
  );
}

export default Train;
