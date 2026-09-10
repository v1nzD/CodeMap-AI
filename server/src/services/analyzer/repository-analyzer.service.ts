import {
  getGithubFileContent,
  getGithubFileTree,
} from "../github/github.service";

import { analyzeRepository } from "./analyzer.service";
import { saveAnalyzedRepository } from "../repositories/repositories-persistence.service";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

export async function analyzeGithubRepository(
  owner: string,
  name: string,
  repositoryId: number,
) {
  const githubTree = await getGithubFileTree(owner, name);

  const sourceFiles = githubTree.tree.filter(
    (file) =>
      file.type === "blob" &&
      extensions.some((extension) => file.path.endsWith(extension)),
  );

  const files = await Promise.all(
    sourceFiles.map(async (file) => {
      const content = await getGithubFileContent(owner, name, file.path);

      return {
        path: file.path,
        content,
        type: file.type,
      };
    }),
  );

  const analysis = await analyzeRepository(files);

  await saveAnalyzedRepository(repositoryId, analysis);

  return analysis;
}
