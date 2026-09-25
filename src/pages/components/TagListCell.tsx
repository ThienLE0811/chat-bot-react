import { Space, Tag, Tooltip } from "antd";
import { CSSProperties } from "react";

type TagListCellProps = {
  items?: string[];
  maxVisible?: number;
  maxTagWidth?: number;
  color?: string;
};

/** Shows the first few items as truncated tags and folds the rest into a "+N" tag. */
const TagListCell: React.FC<TagListCellProps> = ({
  items = [],
  maxVisible = 3,
  maxTagWidth = 180,
  color,
}) => {
  if (!items.length) return <>-</>;

  const visible = items.slice(0, maxVisible);
  const hidden = items.slice(maxVisible);

  const tagStyle: CSSProperties = {
    maxWidth: maxTagWidth,
    marginInlineEnd: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  return (
    <Space size={[4, 4]} wrap>
      {visible.map((item, index) => (
        <Tag key={index} title={item} color={color} style={tagStyle}>
          {item}
        </Tag>
      ))}
      {hidden.length > 0 && (
        <Tooltip
          title={hidden.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        >
          <Tag style={{ marginInlineEnd: 0, cursor: "pointer" }}>
            +{hidden.length}
          </Tag>
        </Tooltip>
      )}
    </Space>
  );
};

export default TagListCell;
