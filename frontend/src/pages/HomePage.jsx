import { TheoryComposer } from "../components/TheoryComposer";
import { TheoryList } from "../components/TheoryList";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function HomePage() {
  const { user } = useAuth();
  const { theories, loading, error, createTheory } = useTheories();

  return (
    <main className="app-shell">
      <section className="hero panel hero-panel">
        <div>
          <p className="panel-kicker">Comunidad privada</p>
          <h2>Debate teorias con contexto, autoria y trazabilidad.</h2>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Usuario activo</span>
            <strong>{user?.username}</strong>
          </div>
          <div className="stat-card">
            <span>Estado legal</span>
            <strong>{user?.acceptedTerms ? "Terminos aceptados" : "Pendiente"}</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <TheoryComposer onSubmit={createTheory} />
        <TheoryList theories={theories} loading={loading} error={error} />
      </section>
    </main>
  );
}
