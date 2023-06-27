import { ProDescriptions } from "@ant-design/pro-components";
import { Badge, Card, Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/redux";

const DetailParse = () => {
  const { currentParse } = useAppSelector((state) => state.account);
  const [color, setColor] = useState("");
  const [colorTitle, setColorTitle] = useState("");
  const [title, setTitle] = useState("");
  console.log("current:: ", currentParse);
  const intent = currentParse?.intent;
  const intentRanking = currentParse?.intent_ranking;

  useEffect(() => {
    setColor(
      intent?.name === "nlu_fallback"
        ? "rgb(252, 201, 201)"
        : "rgb(195, 244, 203)"
    );
    setTitle(intent?.name === "nlu_fallback" ? "Cảnh báo" : "Thông tin");
    setColorTitle(intent?.name === "nlu_fallback" ? "red" : "#1677FF");
  }, [currentParse]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Card
            title={
              currentParse?.text
                ? `Độ chính xác của "${currentParse?.text}" như sau:`
                : ""
            }
            headStyle={{ backgroundColor: "rgb(195, 244, 203)" }}
          >
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                label={intent?.name ? `${intent?.name}` : "Ý định"}
                style={{ fontWeight: 700 }}
              >
                {intent?.confidence}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Thực thể">
                {currentParse?.entities?.map((value: any) => (
                  <>
                    {value?.entity} - {value?.value}
                    <br />
                  </>
                ))}
              </ProDescriptions.Item>
              {intentRanking &&
                intentRanking.map(
                  (value: any) =>
                    value?.name !== intent?.name && (
                      <ProDescriptions.Item label={`${value?.name}`}>
                        {value?.confidence}
                      </ProDescriptions.Item>
                    )
                )}
            </ProDescriptions>
          </Card>
        </Col>
      </Row>

      <Divider style={{ color: colorTitle }}>{title}</Divider>

      <Card
        style={{
          background: color,
        }}
      >
        <ProDescriptions.Item
          label={intent?.name === "nlu_fallback" ? "nlu_fallback" : ""}
        >
          {intent?.name === "nlu_fallback"
            ? " Hệ thống đang không thể phân tích Câu truy vấn (thông điệp), hãy thử lại!"
            : `Với thông điệp "${currentParse?.text}" - bot sẽ hiểu được ý định của người dùng tương ứng với ý định: ${intent?.name}`}
        </ProDescriptions.Item>
      </Card>
    </>
  );
};

export default DetailParse;
