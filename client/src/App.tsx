import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import {
  analyzeRepository,
  createRepository,
} from "./services/repository.service";

function App() {
  const [repositoryId, setRepositoryId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleRepositorySubmit(
    owner: string,
    name: string,
    url: string,
  ) {
    try {
      setLoading(true);

      const repository = await createRepository(owner, name, url);

      await analyzeRepository(owner, name);

      setRepositoryId(repository.id);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze repository.");
    } finally {
      setLoading(false);
    }
  }

  if (repositoryId !== null) {
    return <Dashboard repositoryId={repositoryId} />;
  }

  return <Home loading={loading} onSubmit={handleRepositorySubmit} />;
}

export default App;
