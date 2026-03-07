import { TheoryComposer } from "../components/TheoryComposer";
import { TheoryList } from "../components/TheoryList";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function HomePage() {
  const { user } = useAuth();
  const {
    theories,
    loading,
    error,
    createTheory,
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    filteredTheories,
  } = useTheories();

  return (
    <main className="app-shell social-shell">
      <section className="panel social-hero">
        <div className="social-hero-copy">
          <p className="panel-kicker">Comunidad privada</p>
          <h2>Descubre teorias por temas, no solo por orden cronologico.</h2>
          <p>
            El feed mantiene acceso seguro por sesion, pero ya funciona como una
            red social real: exploras ideas, detectas temas y sigues autores sin
            exponer contenido a visitantes anonimos.
          </p>
        </div>

        <div className="social-hero-metrics">
          <article className="social-stat-card">
            <span>Usuario activo</span>
            <strong>{user?.username}</strong>
          </article>
          <article className="social-stat-card">
            <span>Teorias visibles</span>
            <strong>{filteredTheories.length}</strong>
          </article>
          <article className="social-stat-card">
            <span>Temas detectados</span>
            <strong>{Math.max(topicOptions.length - 1, 0)}</strong>
          </article>
          <article className="social-stat-card">
            <span>Terminos</span>
            <strong>{user?.acceptedTerms ? "Aceptados" : "Pendiente"}</strong>
          </article>
        </div>
      </section>

      <section className="social-layout">
        <aside className="social-sidebar">
          <TheoryComposer onSubmit={createTheory} />

          <section className="panel social-panel social-discovery-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Descubrimiento</p>
                <h2>Filtra por tema</h2>
              </div>
            </div>

            <label>
              Buscar teoria o autor
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Confianza, comunidad, identidad..."
              />
            </label>

            <div className="topic-chip-grid">
              {topicOptions.map((topic) => (
                <button
                  key={topic.value}
                  type="button"
                  className={activeTopic === topic.value ? "topic-chip active" : "topic-chip"}
                  onClick={() => setActiveTopic(topic.value)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <TheoryList theories={filteredTheories} loading={loading} error={error} />
      </section>
    </main>
  );
}
