import { LoadingOutlined } from "@ant-design/icons";
import { Steps } from "antd";
import { TrainJob, TrainStatus } from "../../../services/trainService";

const STAGES: { key: TrainStatus; title: string; description: string }[] = [
  { key: "queued", title: "Hàng đợi", description: "Chờ tới lượt" },
  { key: "validating", title: "Kiểm tra dữ liệu", description: "Validate ở server" },
  { key: "training", title: "Train", description: "Rasa đang học" },
  { key: "loading", title: "Nạp model", description: "Đưa model vào chạy" },
  { key: "loaded", title: "Hoàn tất", description: "Model đang chạy" },
];

const STAGE_KEYS = STAGES.map((stage) => stage.key);

function stageTime(job: TrainJob, status: TrainStatus) {
  const entry = job.logs?.find((log) => log.status === status);
  return entry ? new Date(entry.at).toLocaleTimeString("vi-VN") : null;
}

const TrainTimeline = ({ job }: { job: TrainJob }) => {
  const failed = job.status === "failed";
  const current = failed
    ? Math.max(STAGE_KEYS.indexOf(job.error?.stage ?? "queued"), 0)
    : STAGE_KEYS.indexOf(job.status);
  const running = !failed && job.status !== "loaded";

  return (
    <Steps
      size="small"
      current={current}
      status={failed ? "error" : job.status === "loaded" ? "finish" : "process"}
      items={STAGES.map((stage, index) => {
        const time = stageTime(job, stage.key);
        const isCurrent = index === current;
        return {
          title: stage.title,
          description:
            failed && isCurrent
              ? "Thất bại"
              : time ?? (index > current ? stage.description : undefined),
          icon: running && isCurrent ? <LoadingOutlined /> : undefined,
        };
      })}
    />
  );
};

export default TrainTimeline;
