import { Handle, Position, type NodeProps } from "@xyflow/react";

interface GraphNodeData extends Record<string, unknown> {
  name: string;
  nodeType: "file" | "function";
  filePath: string;
}

export default function GraphNode({ data, selected }: NodeProps) {
  const nodeData = data as GraphNodeData;

  const isFile = nodeData.nodeType === "file";

  return (
    <div
      style={{
        minWidth: 190,

        border: selected
          ? "2px solid #2563eb"
          : isFile
            ? "1px solid #93c5fd"
            : "1px solid #d1d5db",

        borderRadius: 8,

        background: isFile ? "#eff6ff" : "#ffffff",

        boxShadow: selected
          ? "0 0 0 3px rgba(37, 99, 235, 0.15)"
          : "0 2px 6px rgba(0, 0, 0, 0.08)",

        overflow: "hidden",

        transition: "border 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          padding: "8px 12px",

          fontSize: 11,

          fontWeight: 600,

          textTransform: "uppercase",

          color: isFile ? "#1d4ed8" : "#6b7280",

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

          color: "#111827",

          wordBreak: "break-word",
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

            wordBreak: "break-word",
          }}
        >
          {nodeData.filePath}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
