import ts from "typescript";
import path from "path";
import { resolveImport } from "./import.resolver";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

export interface AnalyzedFile {
  path: string;
  imports: string[];
  functions: string[];
  exports: string[];
}

export function analyzeFile(
  sourceCode: string,
  filePath: string,
): AnalyzedFile {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  const imports: string[] = [];
  const functions: string[] = [];
  const exports: string[] = [];

  function visit(node: ts.Node): void {
    // imports
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;

      if (ts.isStringLiteral(moduleSpecifier)) {
        imports.push(moduleSpecifier.text);
      }
    }

    // functions
    if (ts.isFunctionDeclaration(node)) {
      // normal functions
      if (node.name) {
        functions.push(node.name.text);

        // exported functions
        const isExported = node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        );

        if (isExported) {
          exports.push(node.name.text);
        }
      }
    }

    // visit every children node starting from the root (sourceFile)
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    path: filePath,
    imports,
    functions,
    exports,
  };
}

export async function analyzeRepository(
  files: { path: string; content: string; type: string }[],
) {
  // Only analyze actual files with supported source extensions
  const sourceFiles = files.filter(
    (file) =>
      file.type === "blob" && extensions.includes(path.extname(file.path)),
  );

  // Get all source file paths for resolveImport()
  const filePaths = sourceFiles.map((file) => file.path);

  const analyzedFiles = sourceFiles.map((file) => {
    // Analyze the contents of this file
    const analysis = analyzeFile(file.content, file.path);

    // Resolve each import to an actual file
    const dependencies = analysis.imports
      .map((importPath) => resolveImport(file.path, importPath, filePaths))
      .filter((dependency): dependency is string => dependency !== null);

    return {
      ...analysis,
      dependencies,
    };
  });

  return {
    files: analyzedFiles,
  };
}
