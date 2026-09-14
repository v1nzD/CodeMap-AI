import { useEffect, useState } from "react";
import type { Node, Edge } from "@xyflow/react";

import CodeGraph from "../components/graph/CodeGraph";
import { getRepositoryGraph } from "../services/repository.service";

interface DashboardProps {
  repositoryId: number;
}

export default function Dashboard({ repositoryId }: DashboardProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    async function loadGraph() {
      const graph = await getRepositoryGraph(repositoryId);

      const graphNodes: Node[] = graph.nodes.map((node, index) => ({
        id: String(node.id),
        position: {
          x: (index % 4) * 250,
          y: Math.floor(index / 4) * 150,
        },
        data: {
          label: `${node.node_type}: ${node.name}`,
        },
      }));

      const graphEdges: Edge[] = graph.relationships.map((relationship) => ({
        id: String(relationship.id),
        source: String(relationship.source_node_id),
        target: String(relationship.target_node_id),
        label: relationship.relationship_type,
      }));

      setNodes(graphNodes);
      setEdges(graphEdges);
    }

    loadGraph();
  }, [repositoryId]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CodeGraph nodes={nodes} edges={edges} />
    </div>
  );
}
