export interface GithubRepository {
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
}

// path → file/folder path
// type → file (blob) or folder (tree)
// sha → GitHub identifier
export interface GithubTreeItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
}

export interface GithubTreeResponse {
  sha: string;
  tree: GithubTreeItem[];
  truncated: boolean;
}
