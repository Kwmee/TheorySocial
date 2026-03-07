import { TheoryComposer } from "./components/TheoryComposer";
import { TheoryList } from "./components/TheoryList";
import { useTheories } from "./hooks/useTheories";

export default function App() {
  const { theories, loading, error, createTheory } = useTheories();

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Theory Social</p>
        <h1>Red social para publicar y debatir teorias humanas.</h1>
        <p className="hero-copy">
          La base inicial conecta React con una API Spring Boot y deja lista la
          evolucion hacia votos, comentarios y moderacion.
        </p>
      </section>

      <section className="content-grid">
        <TheoryComposer onSubmit={createTheory} />
        <TheoryList theories={theories} loading={loading} error={error} />
      </section>
    </main>
  );
}
