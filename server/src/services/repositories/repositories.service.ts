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
