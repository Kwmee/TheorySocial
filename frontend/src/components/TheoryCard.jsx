export function TheoryCard({
  theory,
  compact = false,
  onVote,
  voting = false,
}) {
  const content = compact ? theory.excerpt : theory.content;

  const resolveVoteValue = (clickedValue) => {
    if (theory.viewerVote === clickedValue) {
      return 0;
    }

    return clickedValue;
  };

  return (
    <article className="theory-card">
      <header className="theory-card-header">
        <div className="theory-author">
          <div className="author-avatar">{theory.authorInitial}</div>
          <div className="theory-author-meta">
            <strong>{theory.author?.username ?? "Usuario"}</strong>
            <p className="theory-meta">{new Date(theory.createdAt).toLocaleString("es-ES")}</p>
          </div>
        </div>
        <span className="vote-total">Score {theory.score}</span>
      </header>

      <div className="theory-card-copy">
        <h3>{theory.title}</h3>
        <p>{content}</p>
      </div>

      <div className="theory-card-topics">
        {theory.topics.map((topic) => (
          <span key={`${theory.id}-${topic.slug}`} className="topic-tag">
            #{topic.label}
          </span>
        ))}
      </div>

      <footer className="theory-card-footer">
        <div className="theory-card-actions" role="group" aria-label="Acciones de voto">
          <button
            type="button"
            className={theory.viewerVote === 1 ? "vote-chip active-like" : "vote-chip"}
            onClick={() => onVote?.(theory.id, resolveVoteValue(1))}
            disabled={voting}
            aria-pressed={theory.viewerVote === 1}
          >
            Like
          </button>
          <button
            type="button"
            className={theory.viewerVote === -1 ? "vote-chip active-dislike" : "vote-chip"}
            onClick={() => onVote?.(theory.id, resolveVoteValue(-1))}
            disabled={voting}
            aria-pressed={theory.viewerVote === -1}
          >
            Dislike
          </button>
        </div>

        <div className="theory-card-stats">
          <span className="social-action">Debate abierto</span>
        </div>
      </footer>
    </article>
  );
}
