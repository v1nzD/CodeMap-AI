import path from "path";

const extensions = [".ts", ".js", ".tsx", ".jsx"];

export function resolveImport(
  currentFile: string,
  importPath: string,
  repositoryFiles: string[],
): string | null {
  if (!importPath.startsWith(".")) {
    return null;
  }

  // find directory of current file
  const currentDirectory = path.posix.dirname(currentFile);

  // build the base path
  //   currentDirectory = "src";
  //   importPath = "./components/Navbar";
  // produces = src/components/Navbar
  const basePath = path.posix.normalize(
    path.posix.join(currentDirectory, importPath),
  );

  // tries every extension
  // returns file if found
  for (const extension of extensions) {
    const candidate = `${basePath}${extension}`;

    if (repositoryFiles.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}
