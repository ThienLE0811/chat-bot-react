import { ProDescriptions } from "@ant-design/pro-components";
import { Divider } from "antd";
import { useAppSelector } from "../../../hooks/redux";

const DetailParse = () => {
  const { currentParse } = useAppSelector((state) => state.account);
  console.log("current:: ", currentParse);
  const intent = currentParse.intent;
  const intentRanking = currentParse.intent_ranking;
  return (
    <>
      <ProDescriptions
        column={2}
        title={`Độ chính xác của ${currentParse.text} như sau:`}
      >
        <ProDescriptions.Item
          label={`${intent.name}`}
          style={{ fontWeight: 700 }}
        >
          {intent.confidence}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="Thực thể">
          {currentParse.entities}
        </ProDescriptions.Item>
        {intentRanking.map(
          (value: any) =>
            value.name !== intent.name && (
              <ProDescriptions.Item label={`${value.name}`}>
                {value.confidence}
              </ProDescriptions.Item>
            )
        )}
      </ProDescriptions>
    </>
  );
};

export default DetailParse;
