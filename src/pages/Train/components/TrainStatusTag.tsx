import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { TrainStatus } from "../../../services/trainService";

const STATUS: Record<TrainStatus, { label: string; color: string }> = {
  queued: { label: "Đang chờ", color: "default" },
  validating: { label: "Kiểm tra dữ liệu", color: "processing" },
  training: { label: "Đang train", color: "processing" },
  loading: { label: "Đang nạp model", color: "processing" },
  loaded: { label: "Thành công", color: "success" },
  failed: { label: "Thất bại", color: "error" },
};

const ICON: Partial<Record<TrainStatus, JSX.Element>> = {
  queued: <ClockCircleOutlined />,
  validating: <SyncOutlined spin />,
  training: <SyncOutlined spin />,
  loading: <SyncOutlined spin />,
  loaded: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
};

const TrainStatusTag = ({ status }: { status: TrainStatus }) => (
  <Tag color={STATUS[status]?.color} icon={ICON[status]}>
    {STATUS[status]?.label ?? status}
  </Tag>
);

export const formatDuration = (ms?: number | null) => {
  if (ms === undefined || ms === null) return "—";
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}p ${seconds % 60}s` : `${seconds}s`;
};

export default TrainStatusTag;
