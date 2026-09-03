import ts from "typescript";

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
