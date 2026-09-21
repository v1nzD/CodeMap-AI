import RepositoryForm from "../components/repository/RepositoryForm";

interface HomeProps {
  onSubmit: (owner: string, name: string, url: string) => Promise<void>;
  loading: boolean;
}

export default function Home({ onSubmit, loading }: HomeProps) {
  return (
    <main>
      <h1>CodeMap AI</h1>

      <p>Visualize and understand any GitHub codebase.</p>

      <RepositoryForm loading={loading} onSubmit={onSubmit} />
    </main>
  );
}
