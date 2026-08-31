export async function checkHealth() {
  const response = await fetch("http://localhost:5000/api/health");

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}
