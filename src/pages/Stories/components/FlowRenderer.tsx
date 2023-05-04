import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap ,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";
import CustomNode from "./CustomNode";
import defaultNodes from './nodes';
import defaultEdges from './edges';
import "reactflow/dist/style.css";
import "./overview.css";
import "./index.css"

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {

  const nodeColor = (node:any) => {
    switch (node.type) {
      case 'input':
        return '#6ede87';
      case 'output':
        return '#6865A5';
      default:
        return '#ff0072';
    }
  };

  return (
    // <ReactFlow
    //   nodes={nodes}
    //   edges={edgesWithUpdatedTypes}
    //   onNodesChange={onNodesChange}
    //   onEdgesChange={onEdgesChange}
    //   onConnect={onConnect}
    //   onInit={onInit}
    //   fitView
    //   attributionPosition="top-right"
    //   nodeTypes={nodeTypes}
    // >
    //   <MiniMap style={minimapStyle} zoomable pannable />
    //   <Controls />
    //   <Background color="#aaa" gap={16} />
    // </ReactFlow>
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView className="editor">
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
      <Background color="#aaa" gap={16} />
      <Controls />
  </ReactFlow>
  );
};

export default OverviewFlow;
