import { useEffect, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import CodeGraph from "../components/graph/CodeGraph";
import NodeDetailsPanel from "../components/graph/NodeDetailsPanel";

import { getRepositoryGraph } from "../services/repository.service";

import { getLayoutedElements } from "../components/graph/graph-layout";

import type { GraphNode, RepositoryGraph } from "../types/graph";

import {
  getRepositoryFileContent,
  type RepositoryFileContent,
} from "../services/repository.service";

interface DashboardProps {
  repositoryId: number;
}

export default function Dashboard({ repositoryId }: DashboardProps) {
  const [graph, setGraph] = useState<RepositoryGraph | null>(null);

  const [baseNodes, setBaseNodes] = useState<Node[]>([]);

  const [baseEdges, setBaseEdges] = useState<Edge[]>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [fileContent, setFileContent] = useState<RepositoryFileContent | null>(
    null,
  );
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);

        const repositoryGraph = await getRepositoryGraph(repositoryId);

        setGraph(repositoryGraph);

        const graphNodes: Node[] = repositoryGraph.nodes.map((node) => ({
          id: String(node.id),

          type: "graphNode",

          position: {
            x: 0,
            y: 0,
          },

          data: {
            name: node.name,
            nodeType: node.node_type,
            filePath: node.file_path,
          },
        }));

        const graphEdges: Edge[] = repositoryGraph.relationships.map(
          (relationship) => {
            const relationshipType = relationship.relationship_type;

            if (relationshipType === "imports") {
              return {
                id: String(relationship.id),

                source: String(relationship.source_node_id),

                target: String(relationship.target_node_id),

                label: "imports",

                type: "smoothstep",

                animated: true,

                style: {
                  stroke: "#2563eb",
                  strokeWidth: 2,
                },

                labelStyle: {
                  fill: "#2563eb",
                  fontWeight: 600,
                },
              };
            }

            if (relationshipType === "exports") {
              return {
                id: String(relationship.id),

                source: String(relationship.source_node_id),

                target: String(relationship.target_node_id),

                label: "exports",

                type: "smoothstep",

                style: {
                  stroke: "#16a34a",
                  strokeWidth: 2,
                },

                labelStyle: {
                  fill: "#16a34a",
                  fontWeight: 600,
                },
              };
            }

            return {
              id: String(relationship.id),

              source: String(relationship.source_node_id),

              target: String(relationship.target_node_id),

              label: "contains",

              type: "smoothstep",

              style: {
                stroke: "#9ca3af",
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              },

              labelStyle: {
                fill: "#6b7280",
                fontWeight: 600,
              },
            };
          },
        );

        const layouted = getLayoutedElements(graphNodes, graphEdges);

        setBaseNodes(layouted.nodes);
        setBaseEdges(layouted.edges);
      } catch (error) {
        console.error(error);

        setError("Failed to load repository graph.");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [repositoryId]);

  // Highlight the selected node's relationships (connected nodes)
  const selectedNode: GraphNode | null =
    graph?.nodes.find((node) => node.id === selectedNodeId) ?? null;

  const connectedNodeIds = new Set<number>();

  if (selectedNodeId !== null && graph) {
    graph.relationships.forEach((relationship) => {
      if (relationship.source_node_id === selectedNodeId) {
        connectedNodeIds.add(relationship.target_node_id);
      }

      if (relationship.target_node_id === selectedNodeId) {
        connectedNodeIds.add(relationship.source_node_id);
      }
    });
  }

  const nodes = baseNodes.map((node) => {
    const nodeId = Number(node.id);

    const isSelected = nodeId === selectedNodeId;

    const isConnected = connectedNodeIds.has(nodeId);

    const hasSelection = selectedNodeId !== null;

    return {
      ...node,

      style: {
        opacity: hasSelection && !isSelected && !isConnected ? 0.25 : 1,
      },
    };
  });

  const edges = baseEdges.map((edge) => {
    const sourceId = Number(edge.source);
    const targetId = Number(edge.target);

    const isConnected =
      selectedNodeId !== null &&
      (sourceId === selectedNodeId || targetId === selectedNodeId);

    return {
      ...edge,

      style: {
        ...edge.style,

        opacity: selectedNodeId !== null ? (isConnected ? 1 : 0.15) : 1,

        strokeWidth: isConnected ? 3 : edge.style?.strokeWidth,
      },
    };
  });

  // the effect runs when the selected node changes
  useEffect(() => {
    if (selectedNodeId === null || !selectedNode) {
      setFileContent(null);
      setSourceError(null);
      setSourceLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSource() {
      try {
        setSourceLoading(true);
        setSourceError(null);
        setFileContent(null);

        const result = await getRepositoryFileContent(
          repositoryId,
          selectedNode.file_path,
        );

        if (!cancelled) {
          setFileContent(result);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setSourceError("Failed to load source code.");
        }
      } finally {
        if (!cancelled) {
          setSourceLoading(false);
        }
      }
    }

    loadSource();

    return () => {
      cancelled = true;
    };
  }, [repositoryId, selectedNodeId, selectedNode?.file_path]);

  if (loading) {
    return <div>Loading codebase...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <CodeGraph
          nodes={nodes}
          edges={edges}
          onNodeClick={setSelectedNodeId}
        />
      </div>

      <NodeDetailsPanel
        node={selectedNode}
        graph={graph}
        fileContent={fileContent}
        sourceLoading={sourceLoading}
        sourceError={sourceError}
      />
    </div>
  );
}
