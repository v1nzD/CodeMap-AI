import { api } from "../api/axios";
import type { RepositoryGraph } from "../types/graph";

export async function getRepositoryGraph(
  repositoryId: number,
): Promise<RepositoryGraph> {
  const response = await api.get(`/repositories/${repositoryId}/graph`);

  return response.data;
}
