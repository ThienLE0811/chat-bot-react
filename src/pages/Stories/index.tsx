import { PageContainer } from "@ant-design/pro-components";
import OverviewFlow from "./components/FlowRenderer";
import Flow from "./components/FlowRenderer";

const Stories = () => {
  return (
    // <div style={{ height: "max-content" }}>
    //   <h2>React Flow Renderer</h2>
    //   <div style={{ height: "800px" }}>
    //     <OverviewFlow />
    //   </div>
    // </div>

    <PageContainer
      title={false}
      breadcrumbRender={false}
      childrenContentStyle={{
        paddingInline: 0,
        paddingBlock: 0,
        borderRadius: 0,
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <div style={{ height: "800px" }}>
        <OverviewFlow />
      </div>
    </PageContainer>
  );
};

export default Stories;
