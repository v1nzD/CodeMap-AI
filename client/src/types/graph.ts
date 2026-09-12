export type GraphNodeType = "file" | "function";
export type RelationshipType = "contains" | "exports" | "imports";

export interface GraphNode {
  id: number;
  node_type: GraphNodeType;
  name: string;
  file_path: string;
}

export interface GraphRelationship {
  id: number;
  source_node_id: number;
  target_node_id: number;
  relationship_type: RelationshipType;
}

export interface RepositoryGraph {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}
