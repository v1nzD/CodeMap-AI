import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";

interface CodeGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export default function CodeGraph({ nodes, edges }: CodeGraphProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
