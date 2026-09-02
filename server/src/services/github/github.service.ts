import "dotenv/config";
import type { GithubRepository, GithubTreeResponse } from "../../types/github";

export async function getGithubRepository(
  owner: string,
  name: string,
): Promise<GithubRepository> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Github API error: ${response.status}`);
  }

  return response.json();
}

export async function getGithubBranchSha(
  owner: string,
  name: string,
  branch: string,
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${name}/git/ref/heads/${branch}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Github API error: ${response.status}`);
  }

  const data = await response.json();

  return data.object.sha;
}

export async function getGithubFileTree(
  owner: string,
  name: string,
): Promise<GithubTreeResponse> {
  // First get repository information
  const repo = await getGithubRepository(owner, name);

  // Get the repository's default branch
  const branch = repo.default_branch;

  // sha
  const sha = await getGithubBranchSha(owner, name, branch);

  // Request the entire tree recursively
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${name}/git/trees/${sha}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Github API error: ${response.status}`);
  }

  return response.json();
}
