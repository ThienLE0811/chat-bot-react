import { RocketOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tooltip } from "antd";
import { parseMessage } from "../../../services/trainService";
import "./index.css";

const ViewTrain = () => {
  return (
    <Card
      title="Train"
      className="view-train"
      extra={
        <Space>
          <Tooltip title="Đang train">
            <Button
              key={1}
              shape="circle"
              size="large"
              loading
              style={{ cursor: "pointer" }}
            ></Button>
          </Tooltip>

          <Tooltip title="Train Bot">
            <Button
              key="2"
              icon={<RocketOutlined />}
              shape="circle"
              size="large"
              // onClick={() => parseMessage()}
            ></Button>
          </Tooltip>
        </Space>
      }
    >
      <div>1</div>
    </Card>
  );
};

export default ViewTrain;
