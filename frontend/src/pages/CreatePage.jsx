import { TheoryComposer } from "../components/TheoryComposer";
import { useTheories } from "../hooks/useTheories";

export function CreatePage() {
  const { createTheory } = useTheories();

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Crear</p>
            <h2>Publica una nueva teoria</h2>
            <p className="feed-masthead-copy">
              Escribe con contexto y deja la idea lista para votos, debate y refinamiento.
            </p>
          </div>
        </header>

        <TheoryComposer onSubmit={createTheory} />
      </section>
    </main>
  );
}
