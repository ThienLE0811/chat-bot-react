import { ProCard } from "@ant-design/pro-components";
import RcResizeObserver from "rc-resize-observer";
import { useState } from "react";
import { Card, Button, notification, Row, Col } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/charts";

const { Meta } = Card;
export default () => {
  const [responsive, setResponsive] = useState(false);

  const showModal = () => {
    notification.success({
      message: "Chat bot cảm ơn bạn, hãy cùng trải nghiệm phần mềm nhé",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      placement: "topLeft",
    });
    console.log("123");
  };

  return (
    // <RcResizeObserver
    //   key="resize-observer"
    //   onResize={(offset) => {
    //     setResponsive(offset.width < 596);
    //   }}
    // >
    //   <ProCard
    //     title="Trang chủ"
    //     extra="08 tháng 3 năm 2023"
    //     split={responsive ? "horizontal" : "vertical"}
    //     bordered
    //     headerBordered
    //   >
    //     <ProCard colSpan="70%">
    //       <div
    //         style={{
    //           width: "100%",
    //           height: 480,
    //           boxSizing: "border-box",
    //           display: "flex",
    //           // justifyContent: "flex-end",
    //           justifyContent: "space-between",
    //         }}
    //       >
    //         <Card
    //           hoverable
    //           style={{
    //             width: 250,
    //             height: 150,
    //             textAlign: "center",
    //             marginTop: "20%",
    //           }}
    //         >
    //           <Meta
    //             // title="Xin chào "
    //             description="Chat bot xin chào bạn, Bạn có thể chào chat bot được không"
    //             style={{ textAlign: "center" }}
    //           ></Meta>
    //           <Button
    //             type="primary"
    //             onClick={showModal}
    //             style={{
    //               marginTop: 24,
    //             }}
    //           >
    //             Xin chào
    //           </Button>
    //         </Card>

    //         <Card
    //           hoverable
    //           style={{ width: 600, height: 480 }}
    //           cover={
    //             <img
    //               alt="example"
    //               srcSet="./chatbot-gif.gif"
    //               // srcSet="./side-img-1.gif"
    //               style={{ width: 600, height: 480 }}
    //             />
    //           }
    //         ></Card>
    //       </div>
    //     </ProCard>
    //     <ProCard title="Một số thông tin về chat bot">
    //       <div style={{ height: 480 }}>Một số thông tin về chat bot</div>
    //     </ProCard>
    //   </ProCard>
    // </RcResizeObserver>
    <Card>
      <Row>
        <Col span={24}>
          <div className={""}>123</div>
        </Col>
        <Col span={24}>
          <div className={""}>
            <Column
              height={400}
              // loading={loadingChart}
              isGroup={true}
              data={
                // chartData.filter(
                //   (predicate) => predicate?.status !== "Tổng số"
                // ) as any
                // api data
                []
              }
              seriesField="typeBusiness"
              xField="status"
              yField="ticket"
              marginRatio={0}
              label={{
                position: "middle",
                layout: [
                  {
                    type: "interval-adjust-position",
                  },
                  {
                    type: "interval-hide-overlap",
                  },
                  {
                    type: "adjust-color",
                  },
                ],
              }}
              xAxis={{
                // visible: true,
                title: {
                  text: "Trạng thái",
                  // visible: false,
                },
              }}
              yAxis={{
                // visible: true,
                title: {
                  text: "chatbot",
                  // visible: false,
                },
              }}
              // meta={{
              //     y: {
              //         alias: 'Số lượng',
              //     },
              // }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};
