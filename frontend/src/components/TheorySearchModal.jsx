export function TheorySearchPanel({
  searchQuery,
  onSearchChange,
  topicOptions,
  activeTopic,
  onTopicChange,
}) {
  return (
    <div className="stack search-page-controls">
      <div className="auth-panel-top">
        <div>
          <p className="panel-kicker">Filtro activo</p>
          <h2>Encuentra conversaciones por tema, autor o lenguaje clave.</h2>
        </div>
        <p className="auth-panel-copy">
          El filtrado se hace sobre titulo, contenido, autor y topicos detectados.
        </p>
      </div>

      <label>
        Buscar
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Confianza, poder, identidad, comunidad..."
        />
      </label>

      <div className="topic-chip-grid">
        {topicOptions.map((topic) => (
          <button
            key={topic.value}
            type="button"
            className={activeTopic === topic.value ? "topic-chip active" : "topic-chip"}
            onClick={() => onTopicChange(topic.value)}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
