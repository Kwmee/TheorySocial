import { useState } from "react";

export function TheoryList({
  theories,
  loading,
  error,
  onVote,
  title = "Conversaciones activas",
  kicker = "Feed privado",
  emptyTitle = "No hay teorias todavia.",
  emptyCopy = "Publica la primera teoria para iniciar el debate.",
  compact = false,
}) {
  const [voteError, setVoteError] = useState("");
  const [votingId, setVotingId] = useState(null);

  const handleVote = async (theoryId, value) => {
    if (!onVote) {
      return;
    }

    setVotingId(theoryId);
    setVoteError("");

    try {
      await onVote(theoryId, value);
    } catch (requestError) {
      setVoteError(requestError.message);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <section className={compact ? "theory-feed-surface compact" : "panel social-panel theory-feed-panel"}>
      <div className="section-head social-section-head">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <span className="pill">{theories.length} visibles</span>
      </div>

      {loading ? <p>Cargando teorias...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {voteError ? <p className="error">{voteError}</p> : null}

      <div className={compact ? "theory-feed theory-feed-compact" : "theory-feed theory-feed-scroll"}>
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
              <p>{compact ? theory.excerpt : theory.content}</p>
            </div>

            <div className="theory-topic-row">
              {theory.topics.map((topic) => (
                <span key={`${theory.id}-${topic.slug}`} className="topic-tag">
                  #{topic.label}
                </span>
              ))}
            </div>

            <footer className="theory-social-footer">
              <div className="vote-cluster">
                <button
                  type="button"
                  className={theory.viewerVote === 1 ? "vote-button active-like" : "vote-button"}
                  onClick={() => handleVote(theory.id, 1)}
                  disabled={votingId === theory.id}
                >
                  Like
                </button>
                <button
                  type="button"
                  className={theory.viewerVote === -1 ? "vote-button active-dislike" : "vote-button"}
                  onClick={() => handleVote(theory.id, -1)}
                  disabled={votingId === theory.id}
                >
                  Dislike
                </button>
              </div>
              <span className="social-action">Debate abierto</span>
              <span className="social-action">Autor visible</span>
            </footer>
          </article>
        ))}

        {!loading && theories.length === 0 ? (
          <div className="empty-state-card">
            <p className="panel-kicker">Sin coincidencias</p>
            <h3>{emptyTitle}</h3>
            <p>{emptyCopy}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
