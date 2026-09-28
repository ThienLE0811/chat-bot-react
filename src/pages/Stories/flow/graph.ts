import type { Edge, Node } from "@xyflow/react";
import type { EditorOptions } from "../components/StepsEditor";
import {
  KnownNames,
  STEP_LABELS,
  Step,
  StepItem,
  StepKind,
  checkStep,
  isEmptyStep,
  stepKind,
  toPairs,
} from "../steps";

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 88;
// Nodes have a fixed size, so give it up front: the tree is laid out with it
// and the minimap draws nodes only when their size is known.
const NODE_SIZE = { width: NODE_WIDTH, height: NODE_HEIGHT };
const CHAIN_GAP = 40;
const TREE_GAP_X = 70;
/** Horizontal distance between two depths of the overview tree. */
export const TREE_COLUMN = NODE_WIDTH + TREE_GAP_X;
const TREE_GAP_Y = 24;

export type Direction = "TB" | "LR";

/** Same colours as the step cards in index.css, for the minimap. */
export const KIND_COLORS: Record<StepKind | "start", string> = {
  start: "#595959",
  user: "#1677ff",
  bot: "#52c41a",
  slot: "#fa8c16",
  other: "#8c8c8c",
};

export interface StepNodeData extends Record<string, unknown> {
  kind: StepKind | "start";
  title: string;
  /** Intent or action code, when the title is a human name for it. */
  code?: string;
  detail?: string;
  tags: string[];
  direction: Direction;
  /** "Bước 3" in a single story. */
  number?: number;
  /** Stories going through this node, in the overview. */
  count?: number;
  /** Stories that end at this node, in the overview. */
  endings?: number;
  status?: "error" | "warning";
  /** Different bot replies after the same conversation. */
  conflict?: string[];
  dimmed?: boolean;
  highlighted?: boolean;
}

export type StepNode = Node<StepNodeData, "step">;

export interface StoryRecord {
  _id: string;
  story?: string;
  steps?: Step[];
}

const formatValue = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value);

const pairTags = (value: unknown) =>
  toPairs(value).map(({ name, value }) =>
    value === undefined ? name : `${name} = ${formatValue(value)}`
  );

/** What a node shows for a step. */
export function describeStep(step: Step, options: EditorOptions) {
  const kind = stepKind(step);
  switch (kind) {
    case "user": {
      const intent = String(step.intent ?? "");
      const label = options.intents.find((i) => i.name === intent)?.label;
      return {
        kind,
        title: label ?? (intent || "Chưa chọn ý định"),
        code: label ? intent : undefined,
        tags: pairTags(step.entities),
      };
    }
    case "bot": {
      const action = String(step.action ?? "");
      return {
        kind,
        title: action || "Chưa chọn phản hồi",
        detail: options.actions.find((a) => a.name === action)?.preview,
        tags: [],
      };
    }
    case "slot":
      return { kind, title: STEP_LABELS.slot, tags: pairTags(step.slot_was_set) };
    default:
      return isEmptyStep(step)
        ? {
            kind,
            title: "Bước rỗng",
            detail: "Nên xoá: Rasa sẽ báo lỗi khi train",
            tags: [],
          }
        : {
            kind,
            title: Object.keys(step).join(", "),
            detail: JSON.stringify(step),
            tags: [],
          };
  }
}

/** The rectangle around some nodes, to point the view at them. */
export function boundsOf(nodes: StepNode[]) {
  const xs = nodes.map((node) => node.position.x);
  const ys = nodes.map((node) => node.position.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return {
    x,
    y,
    width: Math.max(...xs) + NODE_WIDTH - x,
    height: Math.max(...ys) + NODE_HEIGHT - y,
  };
}

const startNode = (
  id: string,
  direction: Direction,
  extra: Partial<StepNodeData> = {}
): StepNode => ({
  id,
  type: "step",
  ...NODE_SIZE,
  position: { x: 0, y: 0 },
  data: { kind: "start", title: "Bắt đầu hội thoại", tags: [], direction, ...extra },
});

const edge = (source: string, target: string, extra: Partial<Edge> = {}): Edge => ({
  id: `${source}->${target}`,
  source,
  target,
  ...extra,
});

/** One story, top to bottom, with each step's problems marked. */
export function buildChain(
  items: StepItem[],
  options: EditorOptions,
  known: KnownNames
) {
  const nodes: StepNode[] = [startNode("start", "TB")];
  items.forEach((item, index) => {
    const problem = checkStep(item.step, known);
    nodes.push({
      id: item.key,
      type: "step",
      ...NODE_SIZE,
      position: { x: 0, y: 0 },
      data: {
        ...describeStep(item.step, options),
        direction: "TB",
        number: index + 1,
        status: problem.error
          ? "error"
          : problem.warnings.length
          ? "warning"
          : undefined,
      },
    });
  });
  nodes.forEach((node, index) => {
    node.position = { x: 0, y: index * (NODE_HEIGHT + CHAIN_GAP) };
  });
  const edges = nodes
    .slice(1)
    .map((node, index) => edge(nodes[index].id, node.id));
  return { nodes, edges };
}

/** JSON with sorted keys, so `{a, b}` and `{b, a}` count as the same step. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Short djb2 hash, in base 36. */
function hash(text: string): string {
  let value = 5381;
  for (let i = 0; i < text.length; i++) {
    value = ((value << 5) + value + text.charCodeAt(i)) | 0;
  }
  return (value >>> 0).toString(36);
}

interface TreeNode {
  id: string;
  step?: Step;
  depth: number;
  children: TreeNode[];
  byStep: Map<string, TreeNode>;
  stories: string[];
  endings: string[];
  y: number;
}

export interface Conflict {
  /** Node after which the replies differ. */
  nodeId: string;
  actions: string[];
  /** Which stories give which reply. */
  replies: { action: string; stories: string[] }[];
}

export interface Overview {
  nodes: StepNode[];
  edges: Edge[];
  conflicts: Conflict[];
  /** Story ids going through each node. */
  storiesAt: Map<string, string[]>;
  /** The step each node stands for; the start node has none. */
  stepAt: Map<string, Step>;
}

/**
 * All stories as one tree: stories that begin with the same steps share
 * those nodes and split where they differ. Where the same conversation is
 * followed by different bot replies, Rasa cannot learn which reply is right
 * and reports a story conflict; those splits are returned as conflicts.
 */
export function buildOverview(
  stories: StoryRecord[],
  options: EditorOptions,
  highlightStory?: string
): Overview {
  // Ids come from the path to the node, so a node keeps its id (and stays
  // selected) when filtering adds or removes other stories.
  const usedIds = new Set<string>();
  const pathId = (parent: TreeNode, key: string) => {
    const base = `n${hash(`${parent.id}>${key}`)}`;
    let id = base;
    for (let n = 1; usedIds.has(id); n++) id = `${base}-${n}`;
    usedIds.add(id);
    return id;
  };
  const makeNode = (id: string, depth: number, step?: Step): TreeNode => ({
    id,
    step,
    depth,
    children: [],
    byStep: new Map(),
    stories: [],
    endings: [],
    y: 0,
  });

  const root = makeNode("start", 0);
  for (const story of stories) {
    let node = root;
    node.stories.push(story._id);
    for (const step of story.steps ?? []) {
      const key = canonical(step);
      let child = node.byStep.get(key);
      if (!child) {
        child = makeNode(pathId(node, key), node.depth + 1, step);
        node.byStep.set(key, child);
        node.children.push(child);
      }
      child.stories.push(story._id);
      node = child;
    }
    node.endings.push(story._id);
  }

  const conflicts: Conflict[] = [];
  const all: TreeNode[] = [];
  let leaves = 0;
  const walk = (node: TreeNode) => {
    all.push(node);
    node.children.forEach(walk);
    node.y = node.children.length
      ? (node.children[0].y + node.children[node.children.length - 1].y) / 2
      : leaves++ * (NODE_HEIGHT + TREE_GAP_Y);

    // Equal steps share a node, so each bot child is a different reply.
    const replies = node.children
      .filter((child) => child.step && stepKind(child.step) === "bot")
      .map((child) => ({
        action: String(child.step!.action),
        stories: child.stories,
      }));
    if (replies.length > 1) {
      conflicts.push({
        nodeId: node.id,
        actions: replies.map((reply) => reply.action),
        replies,
      });
    }
  };
  walk(root);

  const conflictAt = new Map(conflicts.map((c) => [c.nodeId, c]));
  const inHighlight = (node: TreeNode) =>
    !!highlightStory && node.stories.includes(highlightStory);

  const nodes: StepNode[] = all.map((node) => {
    const base = node.step
      ? { ...describeStep(node.step, options), direction: "LR" as const }
      : startNode("start", "LR").data;
    return {
      id: node.id,
      type: "step",
      ...NODE_SIZE,
      position: { x: node.depth * TREE_COLUMN, y: node.y },
      data: {
        ...base,
        count: node.stories.length,
        endings: node.endings.length,
        status: node.step && isEmptyStep(node.step) ? "error" : undefined,
        conflict: conflictAt.get(node.id)?.actions,
        highlighted: inHighlight(node),
        dimmed: !!highlightStory && !inHighlight(node),
      },
    };
  });

  const conflictEdge = (parent: TreeNode, child: TreeNode) =>
    conflictAt.has(parent.id) && child.step && stepKind(child.step) === "bot";
  const edges = all.flatMap((parent) =>
    parent.children.map((child) =>
      edge(parent.id, child.id, {
        className: [
          conflictEdge(parent, child) ? "story-edge--conflict" : "",
          highlightStory && inHighlight(child) ? "story-edge--highlight" : "",
          highlightStory && !inHighlight(child) ? "story-edge--dimmed" : "",
        ]
          .filter(Boolean)
          .join(" "),
      })
    )
  );

  return {
    nodes,
    edges,
    conflicts,
    storiesAt: new Map(all.map((node) => [node.id, node.stories])),
    stepAt: new Map(
      all.flatMap((node) => (node.step ? [[node.id, node.step]] : []))
    ),
  };
}
