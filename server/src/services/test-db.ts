import pool from "../database/connection";

async function test() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected!", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await pool.end();
  }
}

test();
