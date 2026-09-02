import pool from "../../database/connection";

export async function createRepository(
  owner: string,
  name: string,
  url: string,
) {
  // insert to database
  const result = await pool.query(
    "INSERT INTO repositories (github_owner, github_name, github_url) VALUES ($1, $2, $3) RETURNING *",
    [owner, name, url],
  );

  return result.rows[0];
}

export async function getAllRepositories() {
  const result = await pool.query(
    "SELECT * FROM repositories ORDER BY created_at DESC",
  );

  return result.rows;
}

export async function getRepositoryById(id: number) {
  const result = await pool.query("SELECT * FROM repositories WHERE id = $1", [
    id,
  ]);

  return result.rows[0];
}

export async function deleteRepository(id: number) {
  const result = await pool.query(
    "DELETE FROM repositories WHERE id = $1 RETURNING *",
    [id],
  );

  return result.rows[0];
}
