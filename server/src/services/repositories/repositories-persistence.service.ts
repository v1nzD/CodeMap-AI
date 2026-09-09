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

    const nodeMap = new Map<string, number>();

    // save files and nodes
    for (const file of analysis.files) {
      // save file
      const fileResult = await client.query(
        `
      INSERT INTO files (repository_id, path)
      VALUES ($1, $2)
      ON CONFLICT (repository_id, path)
      DO UPDATE SET path = EXCLUDED.path
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
        ON CONFLICT (file_id)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id`,
        [fileId, "file", file.path.split("/").pop() ?? file.path],
      );

      const nodeId = fileNodeResult.rows[0].id;

      // store file and nodeId in node map
      nodeMap.set(file.path, nodeId);

      // const fileNodeId = fileNodeResult.rows[0].id;

      // // create function nodes
      // for (const functionName of file.functions) {
      //   const functionResult = await client.query(
      //     `
      //         INSERT INTO nodes(file_id, node_type, name)
      //         VALUES($1, $2, $3)
      //         RETURNING id
      //         `,
      //     [fileId, "function", functionName],
      //   );

      //   const functionNodeId = functionResult.rows[0].id;

      //   // connect file -> function
      //   await client.query(
      //     `
      //     INSERT INTO relationships (source_node_id, target_node_id, relationship_type)
      //     VALUES ($1, $2, $3)
      //     ON CONFLICT (source_node_id, target_node_id, relationship_type)
      //     DO NOTHING
      //     `,
      //     [fileNodeId, functionNodeId, "contains"],
      //   );
      // }
    }

    // save import relationships
    for (const file of analysis.files) {
      const sourceNodeId = nodeMap.get(file.path);

      if (!sourceNodeId) {
        continue;
      }

      // process each dependency
      for (const dependency of file.dependencies) {
        const targetNodeId = nodeMap.get(dependency);

        if (!targetNodeId) {
          continue;
        }

        // create import relationship
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
          [sourceNodeId, targetNodeId, "imports"],
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
