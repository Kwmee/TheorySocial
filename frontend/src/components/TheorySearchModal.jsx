import { TheoryList } from "./TheoryList";

export function TheorySearchModal({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  topicOptions,
  activeTopic,
  onTopicChange,
  theories,
  onVote,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
      <div className="auth-modal-card search-modal-card">
        <button
          aria-label="Cerrar busqueda"
          className="auth-modal-close"
          onClick={onClose}
          type="button"
        >
          x
        </button>

        <div className="auth-panel-top">
          <div>
            <p className="panel-kicker">Buscar teorias</p>
            <h2>Encuentra conversaciones por tema, autor o lenguaje clave.</h2>
          </div>
          <p className="auth-panel-copy">
            El filtrado se hace sobre titulo, contenido, autor y topicos detectados.
          </p>
        </div>

        <div className="stack search-modal-controls">
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

        <TheoryList
          theories={theories}
          loading={false}
          error=""
          onVote={onVote}
          compact
          kicker="Resultados"
          title="Teorias encontradas"
          emptyTitle="No hay resultados para esa busqueda."
          emptyCopy="Prueba otro termino o vuelve al feed general."
        />
      </div>
    </div>
  );
}
