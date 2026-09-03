import { analyzeFile } from "./services/analyzer/analyzer.service";

const result = analyzeFile(
  `
    import express from "express";
    import { foo } from "./foo";

    function helper() {}

    export function App() {}
  `,
  "src/App.tsx",
);

console.log(result);
