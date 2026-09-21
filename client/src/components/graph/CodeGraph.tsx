import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import GraphNode from "../GraphNode";

interface CodeGraphProps {
  nodes: Node[];
  edges: Edge[];
}

const nodeTypes = {
  graphNode: GraphNode,
};

export default function CodeGraph({ nodes, edges }: CodeGraphProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
