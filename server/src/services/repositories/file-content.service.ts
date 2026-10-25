import pool from "../../database/connection";

export async function getRepositoryFileContent(
  repositoryId: number,
  filePath: string,
) {
  const result = await pool.query(
    `
    SELECT
      id,
      path,
      content
    FROM files
    WHERE repository_id = $1
      AND path = $2
    LIMIT 1
    `,
    [repositoryId, filePath],
  );

  return result.rows[0] ?? null;
}
