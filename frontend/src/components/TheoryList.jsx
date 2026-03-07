export function TheoryList({ theories, loading, error }) {
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Teorias recientes</h2>
        <span>{theories.length} publicadas</span>
      </div>

      {loading ? <p>Cargando teorias...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="stack">
        {theories.map((theory) => (
          <article key={theory.id} className="theory-card">
            <header>
              <h3>{theory.title}</h3>
              <span>Puntaje: {theory.score}</span>
            </header>
            <p>{theory.content}</p>
            <footer>
              <span>Autor: {theory.author?.username ?? "Sin nombre"}</span>
              <span>{new Date(theory.createdAt).toLocaleString("es-ES")}</span>
            </footer>
          </article>
        ))}

        {!loading && theories.length === 0 ? (
          <p>No hay teorias todavia. Publica la primera.</p>
        ) : null}
      </div>
    </section>
  );
}
