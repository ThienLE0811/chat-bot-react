import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Tag } from "antd";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FolderOpenOutlined,
  HddOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { getIntent } from "../../../services/intentServices";
import { getEntities } from "../../../services/entitiesService";
import { getStories } from "../../../services/stories";
import { getHistory } from "../../../services/historyService";

interface Counts {
  intents?: number;
  entities?: number;
  stories?: number;
}

interface LastTrain {
  name?: string;
  status?: string;
  createdAt?: string;
}

const asArray = (value: any): any[] => (Array.isArray(value) ? value : []);

const QuickStats = () => {
  const [counts, setCounts] = useState<Counts>({});
  const [lastTrain, setLastTrain] = useState<LastTrain | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      getIntent({ title: undefined }, {}, {}),
      getEntities({}, {}, {}),
      getStories({}, {}, {}),
      getHistory(),
    ]).then(([intentsRes, entitiesRes, storiesRes, historyRes]) => {
      if (!mounted) return;

      setCounts({
        intents:
          intentsRes.status === "fulfilled"
            ? asArray(intentsRes.value?.data).length
            : undefined,
        entities:
          entitiesRes.status === "fulfilled"
            ? asArray(entitiesRes.value?.data).length
            : undefined,
        stories:
          storiesRes.status === "fulfilled"
            ? asArray(storiesRes.value?.data).length
            : undefined,
      });

      if (historyRes.status === "fulfilled") {
        const history = asArray(historyRes.value?.data);
        setLastTrain(history[0] ?? null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Ý định",
      value: counts.intents,
      icon: <ReadOutlined style={{ color: "#06762F" }} />,
    },
    {
      title: "Thực thể",
      value: counts.entities,
      icon: <FolderOpenOutlined style={{ color: "#06762F" }} />,
    },
    {
      title: "Kịch bản hội thoại",
      value: counts.stories,
      icon: <HddOutlined style={{ color: "#06762F" }} />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statCards.map((stat) => (
        <Col xs={24} sm={12} md={6} key={stat.title}>
          <Card loading={loading} bordered>
            <Statistic
              title={stat.title}
              value={stat.value ?? "--"}
              prefix={stat.icon}
            />
          </Card>
        </Col>
      ))}
      <Col xs={24} sm={12} md={6}>
        <Card loading={loading} bordered>
          <Statistic
            title="Lần train gần nhất"
            value={lastTrain?.createdAt ?? "--"}
            prefix={<ApartmentOutlined style={{ color: "#06762F" }} />}
            suffix={
              lastTrain?.status !== undefined && (
                <Tag
                  color={lastTrain.status === "true" ? "success" : "error"}
                  icon={
                    lastTrain.status === "true" ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  style={{ marginLeft: 8 }}
                >
                  {lastTrain.status === "true" ? "Thành công" : "Lỗi"}
                </Tag>
              )
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default QuickStats;
