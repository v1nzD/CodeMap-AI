import type { GithubTreeItem } from "../types/github";
import type { FileTreeNode } from "../types/fileTree";

// transforms data into nest file tree
export function buildFileTree(items: GithubTreeItem[]): FileTreeNode {
  const root: FileTreeNode = {
    name: "root",
    type: "directory",
    path: "",
    children: [],
  };

  for (const item of items) {
    const parts = item.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1 && item.type === "blob";

      let child = current.children?.find((node) => node.name === part);

      if (!child) {
        child = {
          name: part,
          type: isFile ? "file" : "directory",
          path: parts.slice(0, i + 1).join("/"),
          ...(isFile ? {} : { children: [] }),
        };

        current.children?.push(child);
      }

      current = child;
    }
  }

  return root;
}
