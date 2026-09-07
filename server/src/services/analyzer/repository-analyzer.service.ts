import {
  getGithubFileContent,
  getGithubFileTree,
} from "../github/github.service";
import { analyzeRepository } from "./analyzer.service";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

export async function analyzeGithubRepository(owner: string, name: string) {
  // get github tree
  const githubTree = await getGithubFileTree(owner, name);

  // keep only supported files
  const sourceFiles = githubTree.tree.filter(
    (file) =>
      file.type === "blob" &&
      extensions.some((extension) => file.path.endsWith(extension)),
  );

  // retrieve contents of each file
  // requests happen concurrently => waits for all the files
  const files = await Promise.all(
    sourceFiles.map(async (file) => {
      const content = await getGithubFileContent(owner, name, file.path);

      return { path: file.path, content, type: file.type };
    }),
  );

  // analzye the entire repository
  return analyzeRepository(files);
}
