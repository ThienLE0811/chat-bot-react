import { Alert, Empty, Progress, Table, Tag, Typography } from "antd";
import { ReactNode } from "react";
import {
  ChatTurn,
  ExtractedEntity,
} from "../../../services/chatTestService";
import {
  FALLBACK_INTENT,
  LEVEL_COLORS,
  closeRunnerUp,
  confidenceLevel,
  formatPercent,
} from "./confidence";

const MAX_RANKING = 10;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="chat-test__section">
    <Typography.Title level={5} className="chat-test__section-title">
      {title}
    </Typography.Title>
    {children}
  </section>
);

function formatValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

/** The message with each extracted entity marked where Rasa found it. */
const HighlightedText = ({
  text,
  entities,
}: {
  text: string;
  entities: ExtractedEntity[];
}) => {
  const spans = entities
    .filter(
      (e): e is ExtractedEntity & { start: number; end: number } =>
        e.start !== null && e.end !== null && e.start < e.end
    )
    .sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let cursor = 0;
  spans.forEach((span) => {
    // Entities from different extractors can overlap; keep the first one.
    if (span.start < cursor) return;
    parts.push(
      text.slice(cursor, span.start),
      <mark key={span.start} className="chat-test__entity-mark">
        {text.slice(span.start, span.end)}
        <sub>{span.entity}</sub>
      </mark>
    );
    cursor = span.end;
  });
  parts.push(text.slice(cursor));

  return <div className="chat-test__quote">{parts}</div>;
};

const TurnInspector = ({ turn }: { turn: ChatTurn | null | undefined }) => {
  if (!turn) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Gửi một câu hoặc chọn một câu trong hội thoại để xem bot hiểu thế nào."
      />
    );
  }

  const { intent, intentRanking, entities, actions, slots } = turn;
  const runnerUp = closeRunnerUp(intentRanking);
  const nearestIntent = intentRanking.find(
    (score) => score.name !== FALLBACK_INTENT
  );

  return (
    <div>
      <HighlightedText text={turn.text} entities={entities} />

      <Section title="Ý định">
        {intent ? (
          <>
            <div className="chat-test__intent-head">
              <Typography.Text strong>{intent.name}</Typography.Text>
              <Typography.Text>{formatPercent(intent.confidence)}</Typography.Text>
            </div>
            <Progress
              percent={intent.confidence * 100}
              showInfo={false}
              strokeColor={LEVEL_COLORS[confidenceLevel(intent)]}
            />
          </>
        ) : (
          <Typography.Text type="secondary">
            Rasa không trả về ý định cho câu này.
          </Typography.Text>
        )}
        {intent?.name === FALLBACK_INTENT && (
          <Alert
            type="error"
            showIcon
            message="Bot không hiểu câu này"
            description={`Không ý định nào đủ độ tin cậy${
              nearestIntent
                ? ` (gần nhất là "${nearestIntent.name}" với ${formatPercent(
                    nearestIntent.confidence
                  )})`
                : ""
            }. Hãy thêm câu mẫu tương tự vào ý định phù hợp rồi train lại.`}
          />
        )}
        {runnerUp && intent && (
          <Alert
            type="warning"
            showIcon
            message={`Dễ nhầm với "${runnerUp.name}"`}
            description={`Hai ý định chỉ cách nhau ${formatPercent(
              intent.confidence - runnerUp.confidence
            )}. Nên thêm câu mẫu giúp phân biệt chúng.`}
          />
        )}
      </Section>

      {intentRanking.length > 1 && (
        <Section title="Xếp hạng ý định">
          {intentRanking.slice(0, MAX_RANKING).map((score) => (
            <div key={score.name} className="chat-test__rank-row">
              <Typography.Text
                ellipsis={{ tooltip: score.name }}
                className="chat-test__rank-name"
              >
                {score.name}
              </Typography.Text>
              <Progress
                size="small"
                percent={score.confidence * 100}
                showInfo={false}
                strokeColor={
                  score.name === intent?.name
                    ? LEVEL_COLORS[confidenceLevel(score)]
                    : "#bfbfbf"
                }
              />
              <Typography.Text type="secondary" className="chat-test__rank-value">
                {formatPercent(score.confidence)}
              </Typography.Text>
            </div>
          ))}
        </Section>
      )}

      <Section title="Thực thể">
        {entities.length ? (
          <Table<ExtractedEntity>
            size="small"
            pagination={false}
            rowKey={(row, index) => `${row.entity}-${row.start}-${index}`}
            dataSource={entities}
            columns={[
              { title: "Thực thể", dataIndex: "entity" },
              {
                title: "Giá trị",
                dataIndex: "value",
                render: (value: unknown) => formatValue(value),
              },
              {
                title: "Tin cậy",
                dataIndex: "confidence",
                render: (value: number | null) => formatPercent(value),
              },
              {
                title: "Nguồn",
                dataIndex: "extractor",
                render: (value: string | null) => value ?? "—",
              },
            ]}
          />
        ) : (
          <Typography.Text type="secondary">Không có thực thể nào.</Typography.Text>
        )}
      </Section>

      <Section title="Hành động bot đã chọn">
        {actions.length ? (
          <ol className="chat-test__actions">
            {actions.map((action, index) => (
              <li key={`${action.name}-${index}`}>
                <Typography.Text code>{action.name}</Typography.Text>
                {action.policy && <Tag>{action.policy}</Tag>}
                <Typography.Text type="secondary">
                  {formatPercent(action.confidence)}
                </Typography.Text>
              </li>
            ))}
          </ol>
        ) : (
          <Typography.Text type="secondary">
            Bot không chạy hành động nào sau câu này.
          </Typography.Text>
        )}
      </Section>

      {slots.length > 0 && (
        <Section title="Slot được gán">
          {slots.map((slot, index) => (
            <div key={`${slot.name}-${index}`}>
              <Typography.Text code>{slot.name}</Typography.Text> ={" "}
              <Typography.Text>{formatValue(slot.value)}</Typography.Text>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
};

export default TurnInspector;
