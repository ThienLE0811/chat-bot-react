import { Tooltip } from "antd";
import DOMPurify from "dompurify";
import { convert } from "html-to-text";
type ResponsesiveTextTableProps = {
  text: React.ReactNode | string;
  maxWidth?: number;
  minWidth?: number;
  limitText?: number;
  type?: "text" | "link" | "richtext";
  onClick?: () => void;
};
const ResponsesiveTextTable: React.FC<ResponsesiveTextTableProps> = ({
  text = "",
  maxWidth,
  minWidth,
  limitText,
  onClick,
  type = "text",
}) => {
  switch (type) {
    case "text":
      return (
        <div
          onClick={onClick}
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            maxWidth,
            minWidth,
          }}
        >
          {text}
        </div>
      );
    case "link":
      return (
        <a
          onClick={onClick}
          style={{
            wordWrap: "break-word",
            wordBreak: "break-word",
            maxWidth,
            minWidth,
          }}
        >
          {text}
        </a>
      );
    case "richtext":
      return (
        <Tooltip
          title={
            <div
              // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
              // onClick={onClick}
              style={{
                background: "white",
                color: "black",
                borderRadius: 4,
                fontSize: 12,
              }}
            />
          }
        >
          <div
            onClick={onClick}
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
              maxWidth,
              minWidth,
            }}
          >
            {convert(typeof text === "string" ? text : "")
              .trim()
              .substring(0, limitText)}
          </div>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default ResponsesiveTextTable;
