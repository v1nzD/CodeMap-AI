import type { GraphNode, RepositoryGraph } from "../../types/graph";

import type { RepositoryFileContent } from "../../services/repository.service";

interface NodeDetailsPanelProps {
  node: GraphNode | null;
  graph: RepositoryGraph | null;
  fileContent: RepositoryFileContent | null;
  sourceLoading: boolean;
  sourceError: string | null;
}

export default function NodeDetailsPanel({
  node,
  graph,
  fileContent,
  sourceLoading,
  sourceError,
}: NodeDetailsPanelProps) {
  if (!node || !graph) {
    return (
      <aside
        style={{
          width: 320,
          padding: 24,
          borderLeft: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Node Details</h2>

        <p style={{ color: "#6b7280" }}>Select a node to inspect it.</p>
      </aside>
    );
  }

  const relatedRelationships = graph.relationships.filter(
    (relationship) =>
      relationship.source_node_id === node.id ||
      relationship.target_node_id === node.id,
  );

  const relatedNodeIds = relatedRelationships.map((relationship) =>
    relationship.source_node_id === node.id
      ? relationship.target_node_id
      : relationship.source_node_id,
  );

  const relatedNodes = graph.nodes.filter((graphNode) =>
    relatedNodeIds.includes(graphNode.id),
  );

  const functions = graph.nodes.filter(
    (graphNode) =>
      graphNode.file_path === node.file_path &&
      graphNode.node_type === "function",
  );

  return (
    <aside
      style={{
        width: 320,
        padding: 24,
        borderLeft: "1px solid #e5e7eb",
        background: "#ffffff",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {node.node_type}
      </div>

      <h2 style={{ margin: "0 0 8px" }}>{node.name}</h2>

      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#6b7280",
          wordBreak: "break-word",
        }}
      >
        {node.file_path}
      </p>

      <hr
        style={{
          margin: "24px 0",
          border: 0,
          borderTop: "1px solid #e5e7eb",
        }}
      />

      {node.node_type === "file" && (
        <>
          <h3>Functions</h3>

          {functions.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No functions detected.</p>
          ) : (
            <ul>
              {functions.map((functionNode) => (
                <li key={functionNode.id}>{functionNode.name}</li>
              ))}
            </ul>
          )}
        </>
      )}

      <h3>Relationships</h3>

      {relatedRelationships.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No relationships found.</p>
      ) : (
        <ul>
          {relatedRelationships.map((relationship) => {
            const otherNode = relatedNodes.find(
              (relatedNode) =>
                relatedNode.id ===
                (relationship.source_node_id === node.id
                  ? relationship.target_node_id
                  : relationship.source_node_id),
            );

            return (
              <li key={relationship.id}>
                <strong>{relationship.relationship_type}</strong>
                {" → "}
                {otherNode?.name ?? "Unknown"}
              </li>
            );
          })}
        </ul>
      )}

      <hr
        style={{
          margin: "24px 0",
          border: 0,
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <h3>Source Code</h3>

      {sourceLoading ? (
        <p style={{ color: "#6b7280" }}>Loading source code...</p>
      ) : sourceError ? (
        <p style={{ color: "#dc2626" }}>{sourceError}</p>
      ) : fileContent ? (
        <div
          style={{
            maxHeight: 360,
            overflow: "auto",
            borderRadius: 8,
            background: "#111827",
            padding: 12,
          }}
        >
          <pre
            style={{
              margin: 0,
              color: "#e5e7eb",
              fontSize: 12,
              lineHeight: 1.6,
              whiteSpace: "pre",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            <code>{fileContent.content}</code>
          </pre>
        </div>
      ) : (
        <p style={{ color: "#6b7280" }}>
          Select a file or function to view its source.
        </p>
      )}
    </aside>
  );
}
