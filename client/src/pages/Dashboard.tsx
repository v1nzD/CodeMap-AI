import { useEffect, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import CodeGraph from "../components/graph/CodeGraph";
import { getRepositoryGraph } from "../services/repository.service";
import { getLayoutedElements } from "../components/graph/graph-layout";
import NodeDetailsPanel from "../components/graph/NodeDetailsPanel";
import type { GraphNode, RepositoryGraph } from "../types/graph";

interface DashboardProps {
  repositoryId: number;
}

export default function Dashboard({ repositoryId }: DashboardProps) {
  const [graph, setGraph] = useState<RepositoryGraph | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);

        const graph = await getRepositoryGraph(repositoryId);
        setGraph(graph);

        const graphNodes: Node[] = graph.nodes.map((node) => ({
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

        const graphEdges: Edge[] = graph.relationships.map((relationship) => {
          const relationshipType = relationship.relationship_type;

          return {
            id: String(relationship.id),

            source: String(relationship.source_node_id),

            target: String(relationship.target_node_id),

            label: relationshipType,

            type: "smoothstep",

            animated: relationshipType === "imports",
          };
        });

        const layouted = getLayoutedElements(graphNodes, graphEdges);

        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      } catch (error) {
        console.error(error);
        setError("Failed to load repository graph.");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [repositoryId]);

  const selectedNode: GraphNode | null =
    graph?.nodes.find((node) => node.id === selectedNodeId) ?? null;

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

      <NodeDetailsPanel node={selectedNode} graph={graph} />
    </div>
  );
}
