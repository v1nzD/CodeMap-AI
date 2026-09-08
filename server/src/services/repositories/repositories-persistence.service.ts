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
  // save files and nodes
  for (const file of analysis.files) {
    const fileResult = await pool.query(
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

    await pool.query(
      `
        INSERT INTO nodes (file_id, node_type, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (file_id)
        DO UPDATE SET name = EXCLUDED.name`,
      [fileId, "file", file.path.split("/").pop() ?? file.path],
    );
  }

  // save relationships
  for (const file of analysis.files) {
    const sourceResult = await pool.query(
      `
    SELECT nodes.id
    FROM nodes
    JOIN files ON files.id = nodes.file_id
    WHERE files.repository_id = $1
      AND files.path = $2
    `,
      [repositoryId, file.path],
    );

    const sourceNodeId = sourceResult.rows[0]?.id;

    if (!sourceNodeId) {
      continue;
    }

    for (const dependency of file.dependencies) {
      const targetResult = await pool.query(
        `
      SELECT nodes.id
      FROM nodes
      JOIN files ON files.id = nodes.file_id
      WHERE files.repository_id = $1
        AND files.path = $2
      `,
        [repositoryId, dependency],
      );

      const targetNodeId = targetResult.rows[0]?.id;

      if (!targetNodeId) {
        continue;
      }

      await pool.query(
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
}
