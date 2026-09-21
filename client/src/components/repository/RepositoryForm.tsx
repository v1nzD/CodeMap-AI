import { FormEvent, useState } from "react";

interface RepositoryFormProps {
  onSubmit: (owner: string, name: string, url: string) => Promise<void>;
  loading: boolean;
}

export default function RepositoryForm({
  onSubmit,
  loading,
}: RepositoryFormProps) {
  const [url, setUrl] = useState("");

  function parseGithubUrl(value: string) {
    try {
      const parsedUrl = new URL(value);

      if (parsedUrl.hostname !== "github.com") {
        return null;
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);

      if (parts.length < 2) {
        return null;
      }

      return { owner: parts[0], name: parts[1].replace(/\.git$/, "") };
    } catch {
      return null;
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const repository = parseGithubUrl(url);

    if (!repository) {
      alert("Please enter a valid Github repository URL");
      return;
    }

    await onSubmit(repository.owner, repository.name, url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="https://github.com/owner/repository"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Repository"}
      </button>
    </form>
  );
}
