import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Alert,
  Button,
  Empty,
  Input,
  List,
  Result,
  Space,
  Spin,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStories } from "../../../services/stories";
import { searchKey } from "../../components/intentSelect";
import { useDialogueOptions } from "../useDialogueOptions";
import { STEP_LABELS, stepKind } from "../steps";
import {
  Conflict,
  KIND_COLORS,
  NODE_HEIGHT,
  NODE_WIDTH,
  StepNode as StepNodeType,
  StoryRecord,
  TREE_COLUMN,
  boundsOf,
  buildOverview,
  describeStep,
} from "./graph";
import StepNode from "./StepNode";

const nodeTypes = { step: StepNode };
const MAX_CONFLICT_LINKS = 5;
const FIRST_VIEW_COLUMNS = 4;
/** Width of the side panel in index.css; focused nodes are centred beside it. */
const PANEL_WIDTH = 320;

/** At a conflict, stories grouped by the reply they give, so the odd one is easy to spot. */
function storyGroups(ids: string[], conflict?: Conflict) {
  if (!conflict) return [{ title: undefined, ids }];
  const replying = new Set(conflict.replies.flatMap((reply) => reply.stories));
  const rest = ids.filter((id) => !replying.has(id));
  return [
    ...conflict.replies.map((reply) => ({
      title: `Bot trả lời ${reply.action} (${reply.stories.length})`,
      ids: reply.stories,
    })),
    ...(rest.length
      ? [{ title: `Đi hướng khác hoặc kết thúc (${rest.length})`, ids: rest }]
      : []),
  ];
}

interface StoriesOverviewProps {
  /** Changes when stories may have been edited, to load them again. */
  reloadKey: number;
  onOpenStory: (story: StoryRecord) => void;
}

const Overview = ({ reloadKey, onOpenStory }: StoriesOverviewProps) => {
  const { options } = useDialogueOptions();
  const { fitBounds, setCenter } = useReactFlow();
  const [stories, setStories] = useState<StoryRecord[]>();
  const [loadFailed, setLoadFailed] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const [hoveredStory, setHoveredStory] = useState<string>();
  const canvasRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoadFailed(false);
    try {
      const res = await getStories({}, {}, {});
      setStories(Array.isArray(res?.data) ? res.data : []);
    } catch {
      // getStories already told the user.
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, reloadKey]);

  const shown = useMemo(() => {
    const wanted = searchKey(keyword.trim());
    return (stories ?? []).filter((story) =>
      searchKey(story.story ?? "").includes(wanted)
    );
  }, [stories, keyword]);

  const overview = useMemo(
    () => buildOverview(shown, options, hoveredStory),
    [shown, options, hoveredStory]
  );

  // A filter change rebuilds the tree, so an old selection may be gone.
  useEffect(() => {
    if (selectedId && !overview.storiesAt.has(selectedId)) {
      setSelectedId(undefined);
    }
  }, [overview, selectedId]);

  const nodes = useMemo(
    () =>
      overview.nodes.map((node) => ({
        ...node,
        selected: node.id === selectedId,
      })),
    [overview.nodes, selectedId]
  );

  // fitView() waits for a node change this read-only canvas never makes, so
  // the view is moved with setCenter and fitBounds instead.
  const focus = (id: string) => {
    const node = overview.nodes.find((n) => n.id === id);
    setSelectedId(id);
    if (!node) return;
    // Keep the node clear of the panel: beside it on wide screens, above it
    // where the panel sits at the bottom (see index.css).
    const canvas = canvasRef.current?.getBoundingClientRect();
    const wide = !canvas || canvas.width > PANEL_WIDTH * 2;
    setCenter(
      node.position.x + NODE_WIDTH / 2 + (wide ? PANEL_WIDTH / 2 : 0),
      node.position.y + NODE_HEIGHT / 2 + (wide ? 0 : canvas.height / 4),
      { zoom: 1, duration: 400 }
    );
  };

  // The whole tree is too small to read once fitted, so start on its first
  // columns; the fit-view control still shows everything. Runs again when the
  // filter changes which stories are drawn, but not on hover highlighting.
  const firstColumns = useMemo(
    () =>
      overview.nodes.filter(
        (node) => node.position.x < FIRST_VIEW_COLUMNS * TREE_COLUMN
      ),
    [overview.nodes]
  );
  const firstBounds = useRef(boundsOf(firstColumns));
  firstBounds.current = boundsOf(firstColumns);
  useEffect(() => {
    if (!shown.length) return;
    const timer = window.setTimeout(() =>
      fitBounds(firstBounds.current, { padding: 0.05 })
    );
    return () => window.clearTimeout(timer);
  }, [shown, fitBounds]);

  const byId = useMemo(
    () => new Map((stories ?? []).map((story) => [story._id, story])),
    [stories]
  );
  const selectedStories = (selectedId && overview.storiesAt.get(selectedId)) || [];
  const selectedStep = selectedId ? overview.stepAt.get(selectedId) : undefined;
  const selectedConflict = overview.conflicts.find((c) => c.nodeId === selectedId);

  if (loadFailed) {
    return (
      <Result
        status="error"
        title="Không tải được danh sách story"
        extra={<Button onClick={load}>Thử lại</Button>}
      />
    );
  }
  if (!stories) {
    return (
      <div className="story-detail__loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="stories-overview">
      <div className="stories-overview__toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Lọc theo tên story"
          aria-label="Lọc theo tên story"
          className="stories-overview__search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Typography.Text type="secondary">
          {shown.length} story · {overview.nodes.length - 1} bước khác nhau.
          Story có chung đoạn mở đầu được gộp lại; bấm vào một bước để xem story
          đi qua nó.
        </Typography.Text>
      </div>

      {overview.conflicts.length > 0 && (
        <Alert
          type="warning"
          showIcon
          className="stories-overview__alert"
          message={`${overview.conflicts.length} chỗ bot trả lời khác nhau sau cùng một đoạn hội thoại. Rasa sẽ báo xung đột story khi train.`}
          action={
            <Space wrap size={4}>
              {overview.conflicts.slice(0, MAX_CONFLICT_LINKS).map((c, index) => (
                <Button key={c.nodeId} size="small" onClick={() => focus(c.nodeId)}>
                  Xem chỗ {index + 1}
                </Button>
              ))}
            </Space>
          }
        />
      )}

      {shown.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={keyword ? "Không có story nào khớp" : "Chưa có story nào"}
        />
      ) : (
        <div className="stories-overview__canvas" ref={canvasRef}>
          <ReactFlow
            nodes={nodes}
            edges={overview.edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            minZoom={0.1}
            maxZoom={1.5}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(undefined)}
          >
            <Background gap={16} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => KIND_COLORS[(node as StepNodeType).data.kind]}
            />
          </ReactFlow>

          {selectedId && (
            <aside className="stories-overview__panel" aria-label="Story đi qua bước đã chọn">
              <div className="stories-overview__panel-header">
                <Typography.Text strong ellipsis>
                  {selectedStep
                    ? `${STEP_LABELS[stepKind(selectedStep)]}: ${
                        describeStep(selectedStep, options).title
                      }`
                    : "Bắt đầu hội thoại"}
                </Typography.Text>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  aria-label="Đóng"
                  onClick={() => setSelectedId(undefined)}
                />
              </div>
              {selectedConflict && (
                <Alert
                  type="warning"
                  showIcon
                  message="Bot trả lời khác nhau sau bước này"
                  description="Rasa không biết nên chọn phản hồi nào. Sửa để đoạn hội thoại này chỉ còn một phản hồi, hoặc thêm một bước khác nhau ở phía trước."
                />
              )}
              <Typography.Text type="secondary">
                {selectedStories.length} story đi qua bước này
              </Typography.Text>
              <div className="stories-overview__stories">
                {storyGroups(selectedStories, selectedConflict).map((group) => (
                  <section key={group.title ?? "all"}>
                    {group.title && (
                      <Typography.Text strong className="stories-overview__group">
                        {group.title}
                      </Typography.Text>
                    )}
                    <List
                      size="small"
                      dataSource={group.ids}
                      renderItem={(id) => {
                        const story = byId.get(id);
                        return (
                          <List.Item
                            onMouseEnter={() => setHoveredStory(id)}
                            onMouseLeave={() => setHoveredStory(undefined)}
                            actions={[
                              <Button
                                key="open"
                                type="link"
                                size="small"
                                onFocus={() => setHoveredStory(id)}
                                onBlur={() => setHoveredStory(undefined)}
                                onClick={() => story && onOpenStory(story)}
                              >
                                Mở
                              </Button>,
                            ]}
                          >
                            <Typography.Text ellipsis>
                              {story?.story ?? id}
                            </Typography.Text>
                          </List.Item>
                        );
                      }}
                    />
                  </section>
                ))}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
};

/** Every story in one tree, to see how conversations branch and where they clash. */
const StoriesOverview = (props: StoriesOverviewProps) => (
  <ReactFlowProvider>
    <Overview {...props} />
  </ReactFlowProvider>
);

export default StoriesOverview;
