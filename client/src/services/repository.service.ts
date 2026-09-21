import { api } from "../api/axios";
import type { RepositoryGraph } from "../types/graph";
import type { Repository } from "../types/repository";

export async function getRepositoryGraph(
  repositoryId: number,
): Promise<RepositoryGraph> {
  const response = await api.get(`/repositories/${repositoryId}/graph`);

  return response.data.data;
}

export async function createRepository(
  owner: string,
  name: string,
  url: string,
): Promise<Repository> {
  const response = await api.post("/repositories", { owner, name, url });

  return response.data.data;
}

export async function analyzeRepository(owner: string, name: string) {
  const response = await api.post(`/repositories/${owner}/${name}/analyze`);

  return response.data.data;
}
