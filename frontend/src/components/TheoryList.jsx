export function TheoryList({ theories, loading, error }) {
  return (
    <section className="panel social-panel theory-feed-panel">
      <div className="section-head social-section-head">
        <div>
          <p className="panel-kicker">Feed privado</p>
          <h2>Conversaciones activas</h2>
        </div>
        <span className="pill">{theories.length} visibles</span>
      </div>

      {loading ? <p>Cargando teorias...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="theory-feed">
        {theories.map((theory) => (
          <article key={theory.id} className="theory-social-card">
            <header className="theory-social-header">
              <div className="theory-author">
                <div className="author-avatar">{theory.authorInitial}</div>
                <div>
                  <strong>{theory.author?.username ?? "Usuario"}</strong>
                  <p className="theory-meta">
                    {new Date(theory.createdAt).toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
              <span className="pill subtle">Score {theory.score}</span>
            </header>

            <div className="theory-social-content">
              <h3>{theory.title}</h3>
              <p>{theory.excerpt}</p>
            </div>

            <div className="theory-topic-row">
              {theory.topics.map((topic) => (
                <span key={`${theory.id}-${topic.slug}`} className="topic-tag">
                  #{topic.label}
                </span>
              ))}
            </div>

            <footer className="theory-social-footer">
              <span className="social-action">Debate abierto</span>
              <span className="social-action">Autor visible</span>
              <span className="social-action">Base preparada para votos</span>
            </footer>
          </article>
        ))}

        {!loading && theories.length === 0 ? (
          <div className="empty-state-card">
            <p className="panel-kicker">Sin coincidencias</p>
            <h3>No hay teorias para ese filtro.</h3>
            <p>
              Prueba otro tema o limpia la busqueda para volver al flujo general
              de la comunidad.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
