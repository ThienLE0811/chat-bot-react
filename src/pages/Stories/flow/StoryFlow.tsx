import { Background, Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import type { EditorOptions } from "../components/StepsEditor";
import { KnownNames, StepItem } from "../steps";
import { buildChain } from "./graph";
import StepNode from "./StepNode";

const nodeTypes = { step: StepNode };

/** How many steps the first view shows; later ones are a scroll away. */
const FIRST_VIEW_STEPS = 6;

interface StoryFlowProps {
  items: StepItem[];
  options: EditorOptions;
  known: KnownNames;
  /** A step was clicked; the page takes the user to it in the editor. */
  onSelectStep: (key: string) => void;
}

/** One story drawn as the conversation it describes, including unsaved edits. */
const StoryFlow = ({ items, options, known, onSelectStep }: StoryFlowProps) => {
  const { nodes, edges } = useMemo(
    () => buildChain(items, options, known),
    [items, options, known]
  );

  return (
    <div className="story-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{
          nodes: nodes.slice(0, FIRST_VIEW_STEPS + 1).map(({ id }) => ({ id })),
          maxZoom: 1,
        }}
        minZoom={0.2}
        onNodeClick={(_, node) => node.id !== "start" && onSelectStep(node.id)}
      >
        <Background gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default StoryFlow;
