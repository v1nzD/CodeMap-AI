import pool from "../../database/connection";

export async function getRepositoryGraph(repositoryId: number) {
  // check if repository exists
  const repositoryResult = await pool.query(
    `
    SELECT id
    FROM repositories 
    WHERE id = $1
    `,
    [repositoryId],
  );

  // validate repository
  if (repositoryResult.rows.length === 0) {
    return null;
  }

  // Find every node whose associated file belongs to this repo. For each node, return its id, type, name and path
  const nodesResult = await pool.query(
    `
    SELECT
      n.id,
      n.node_type,
      n.name,
      f.path AS file_path
    FROM nodes n
    JOIN files f
      ON f.id = n.file_id
    WHERE f.repository_id = $1
    ORDER BY n.id
    `,
    [repositoryId],
  );

  const relationshipsResult = await pool.query(
    `
    SELECT
      r.id,
      r.source_node_id,
      r.target_node_id,
      r.relationship_type
    FROM relationships r

    JOIN nodes source_node
      ON source_node.id = r.source_node_id

    JOIN files source_file
      ON source_file.id = source_node.file_id

    WHERE source_file.repository_id = $1
    ORDER BY r.id
    `,
    [repositoryId],
  );

  return {
    nodes: nodesResult.rows,
    relationships: relationshipsResult.rows,
  };
}
