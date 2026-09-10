import pool from "../../database/connection";

export async function saveAnalyzedRepository(
  repositoryId: number,
  analysis: {
    files: {
      path: string;
      imports: string[];
      functions: string[];
      exports: string[];
      dependencies: string[];
    }[];
  },
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // for re-analysis
    // remove the existing graph for this repository
    // nodes and relationships are removed through ON DELETE CASCADE
    await client.query(`DELETE FROM files WHERE repository_id = $1`, [
      repositoryId,
    ]);

    // maps to prevent repeated SQL queries
    const fileNodeMap = new Map<string, number>();

    const functionNodeMap = new Map<string, number>();

    // --------------------------------------------------
    // Create files and nodes
    // --------------------------------------------------
    for (const file of analysis.files) {
      // save file
      const fileResult = await client.query(
        `
      INSERT INTO files (repository_id, path)
      VALUES ($1, $2)
      RETURNING id
      `,
        [repositoryId, file.path],
      );

      const fileId = fileResult.rows[0].id;

      // create file node
      const fileNodeResult = await client.query(
        `
        INSERT INTO nodes (file_id, node_type, name)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [fileId, "file", file.path.split("/").pop() ?? file.path],
      );

      const fileNodeId = fileNodeResult.rows[0].id;

      // store file and nodeId in node map
      fileNodeMap.set(file.path, fileNodeId);

      // create function nodes
      for (const functionName of file.functions) {
        const functionNodeResult = await client.query(
          `
              INSERT INTO nodes(file_id, node_type, name)
              VALUES($1, $2, $3)
              RETURNING id
              `,
          [fileId, "function", functionName],
        );

        const functionNodeId = functionNodeResult.rows[0].id;

        functionNodeMap.set(`${file.path}:${functionName}`, functionNodeId);
      }
    }

    // --------------------------------------------------
    // Create relationships
    // --------------------------------------------------
    for (const file of analysis.files) {
      const fileNodeId = fileNodeMap.get(file.path);

      if (!fileNodeId) {
        continue;
      }

      // -----------------------------------------------
      // File → Function
      // contains
      // -----------------------------------------------
      for (const functionName of file.functions) {
        const functionNodeId = functionNodeMap.get(
          `${file.path}:${functionName}`,
        );

        if (!functionNodeId) {
          continue;
        }

        await client.query(
          `
          INSERT INTO relationships (
            source_node_id,
            target_node_id,
            relationship_type
          )
          VALUES ($1, $2, $3)
          ON CONFLICT (
            source_node_id,
            target_node_id,
            relationship_type
          )
          DO NOTHING
          `,
          [fileNodeId, functionNodeId, "contains"],
        );
      }

      // -----------------------------------------------
      // File → Function
      // exports
      // -----------------------------------------------
      for (const exportedFunction of file.exports) {
        const functionNodeId = functionNodeMap.get(
          `${file.path}:${exportedFunction}`,
        );

        if (!functionNodeId) {
          continue;
        }

        await client.query(
          `
          INSERT INTO relationships (
            source_node_id,
            target_node_id,
            relationship_type
          )
          VALUES ($1, $2, $3)
          ON CONFLICT (
            source_node_id,
            target_node_id,
            relationship_type
          )
          DO NOTHING
          `,
          [fileNodeId, functionNodeId, "exports"],
        );
      }

      // -----------------------------------------------
      // File → File
      // imports
      // -----------------------------------------------
      for (const dependency of file.dependencies) {
        const targetNodeId = fileNodeMap.get(dependency);

        if (!targetNodeId) {
          continue;
        }

        await client.query(
          `
          INSERT INTO relationships (
            source_node_id,
            target_node_id,
            relationship_type
          )
          VALUES ($1, $2, $3)
          ON CONFLICT (
            source_node_id,
            target_node_id,
            relationship_type
          )
          DO NOTHING
          `,
          [fileNodeId, targetNodeId, "imports"],
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
