import { Handle, Position, type NodeProps } from "@xyflow/react";

interface GraphNodeData extends Record<string, unknown> {
  name: string;
  nodeType: "file" | "function";
  filePath: string;
}

export default function GraphNode({ data }: NodeProps) {
  const nodeData = data as GraphNodeData;

  const isFile = nodeData.nodeType === "file";

  return (
    <div
      style={{
        minWidth: 180,
        border: "1px solid #d1d5db",
        borderRadius: 8,
        background: "#ffffff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          padding: "8px 12px",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {isFile ? "File" : "Function"}
      </div>

      <div
        style={{
          padding: "10px 12px",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {nodeData.name}
      </div>

      {isFile && (
        <div
          style={{
            padding: "0 12px 10px",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          {nodeData.filePath}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
