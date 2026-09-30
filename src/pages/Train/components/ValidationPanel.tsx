import { Alert, Collapse, List, Tag, Typography } from "antd";
import { ValidationIssue, ValidationReport } from "../../../services/trainService";

const IssueList = ({ issues }: { issues: ValidationIssue[] }) => (
  <List
    size="small"
    dataSource={issues}
    renderItem={(issue) => (
      <List.Item>
        <List.Item.Meta
          title={issue.message}
          description={
            <Typography.Text type="secondary" code>
              {issue.path}
            </Typography.Text>
          }
        />
        <Tag color={issue.severity === "error" ? "error" : "warning"}>
          {issue.code}
        </Tag>
      </List.Item>
    )}
  />
);

const ValidationPanel = ({ report }: { report: ValidationReport }) => {
  const { errors, warnings } = report;
  if (errors.length === 0 && warnings.length === 0) {
    return <Alert type="success" showIcon message="Dữ liệu hợp lệ, không có cảnh báo" />;
  }

  return (
    <>
      <Alert
        type={errors.length > 0 ? "error" : "warning"}
        showIcon
        style={{ marginBottom: 12 }}
        message={
          errors.length > 0
            ? `${errors.length} lỗi cần sửa trước khi train`
            : "Dữ liệu train được, nhưng có vài điểm nên xem lại"
        }
        description={
          warnings.length > 0 ? `${warnings.length} cảnh báo` : undefined
        }
      />
      <Collapse
        size="small"
        defaultActiveKey={errors.length > 0 ? ["errors"] : []}
      >
        {errors.length > 0 && (
          <Collapse.Panel key="errors" header={`Lỗi (${errors.length})`}>
            <IssueList issues={errors} />
          </Collapse.Panel>
        )}
        {warnings.length > 0 && (
          <Collapse.Panel key="warnings" header={`Cảnh báo (${warnings.length})`}>
            <IssueList issues={warnings} />
          </Collapse.Panel>
        )}
      </Collapse>
    </>
  );
};

export default ValidationPanel;
