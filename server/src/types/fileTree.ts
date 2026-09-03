// file       → no children
// directory  → can have children
export interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileTreeNode[];
}
