import {
  CodeOutlined,
  DatabaseOutlined,
  FlagOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Tooltip } from "antd";
import { ReactNode, memo } from "react";
import { NODE_HEIGHT, NODE_WIDTH, StepNode as StepNodeType } from "./graph";

const ICONS: Record<StepNodeType["data"]["kind"], ReactNode> = {
  start: <PlayCircleOutlined />,
  user: <UserOutlined />,
  bot: <RobotOutlined />,
  slot: <DatabaseOutlined />,
  other: <CodeOutlined />,
};

const StepNode = ({ data, selected }: NodeProps<StepNodeType>) => {
  const vertical = data.direction === "TB";
  const classes = [
    "story-node",
    `story-node--${data.kind}`,
    data.status && `story-node--${data.status}`,
    data.conflict && "story-node--conflict",
    data.dimmed && "story-node--dimmed",
    data.highlighted && "story-node--highlight",
    selected && "story-node--selected",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}>
      {data.kind !== "start" && (
        <Handle
          type="target"
          position={vertical ? Position.Top : Position.Left}
          isConnectable={false}
        />
      )}
      <div className="story-node__header">
        <span className="story-node__icon">{ICONS[data.kind]}</span>
        <span className="story-node__title" title={data.title}>
          {data.title}
        </span>
        {data.number !== undefined && (
          <span className="story-node__meta">Bước {data.number}</span>
        )}
        {data.count !== undefined && (
          <span className="story-node__meta" title="Số story đi qua bước này">
            {data.count} story
          </span>
        )}
      </div>
      {data.code && <div className="story-node__code">{data.code}</div>}
      {data.detail && (
        <div className="story-node__detail" title={data.detail}>
          {data.detail}
        </div>
      )}
      {data.tags.length > 0 && (
        <div className="story-node__tags" title={data.tags.join(", ")}>
          {data.tags.join(" · ")}
        </div>
      )}
      <div className="story-node__badges">
        {data.status === "error" && (
          <span className="story-node__badge story-node__badge--error">
            Chưa điền đủ
          </span>
        )}
        {data.status === "warning" && (
          <span className="story-node__badge story-node__badge--warning">
            <WarningOutlined /> Cảnh báo
          </span>
        )}
        {data.conflict && (
          <Tooltip
            title={`Cùng đoạn hội thoại này nhưng bot trả lời khác nhau: ${data.conflict.join(
              ", "
            )}. Rasa sẽ báo xung đột story.`}
          >
            <span className="story-node__badge story-node__badge--conflict">
              <WarningOutlined /> Xung đột
            </span>
          </Tooltip>
        )}
        {!!data.endings && (
          <span className="story-node__badge" title="Số story kết thúc ở bước này">
            <FlagOutlined /> {data.endings}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={vertical ? Position.Bottom : Position.Right}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(StepNode);
