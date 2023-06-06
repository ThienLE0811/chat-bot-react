import { Tabs } from "antd";
import ModalFormTrain from "./ModalFormTrain";
import "./index.css";
import DetailParse from "./DetailParse";
const TabsTrain = () => {
  return (
    <Tabs
      size="small"
      tabBarStyle={{
        marginBottom: 0,
        paddingInline: 12,
        background: "white",
      }}
      tabBarGutter={48}
      //   activeKey={tabKeyPanel}
      //   onChange={setTabKeyPanel}

      items={[
        {
          label: "Kiểm tra",
          key: "1",
          children: <ModalFormTrain />,
        },

        {
          label: "Thông tin",
          key: "2",
          children: <DetailParse />,
        },
      ]}
    />
  );
};

export default TabsTrain;
