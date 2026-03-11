import { UserAvatar } from "./UserAvatar";
import { VoteIcon } from "./VoteIcon";
import { useState } from "react";

const RANK_LABELS = ["1", "2", "3"];

export function TopTheoryPodium({ theories, loading, error, onVote }) {
  const [pendingTheoryId, setPendingTheoryId] = useState(null);

  const handleVoteClick = async (theoryId, value) => {
    if (!onVote || pendingTheoryId === theoryId) {
      return;
    }

    setPendingTheoryId(theoryId);

    try {
      await onVote(theoryId, value);
    } finally {
      setPendingTheoryId(null);
    }
  };

  return (
    <section className="feed-surface">
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">TOP Teorias</p>
          <h2>Podio de la comunidad</h2>
        </div>
        <span className="pill">{theories.length} destacadas</span>
      </div>

      {loading ? <p>Cargando podio...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="top-podium-grid">
        {theories.map((theory, index) => (
          <article key={theory.id} className={`top-podium-card rank-${index + 1}`}>
            <div className={`top-podium-rank rank-${index + 1}`}>{RANK_LABELS[index] ?? String(index + 1)}</div>
            <div className={`top-podium-avatar-frame rank-${index + 1}`}>
              <UserAvatar user={theory.author} className="top-podium-avatar" />
            </div>
            <div className="top-podium-body">
              <p className="panel-kicker">#{index + 1}</p>
              <h3>{theory.title}</h3>
              <p className="top-podium-copy">{theory.excerpt}</p>
              <div className="top-podium-meta">
                <span className="social-action">@{theory.author?.username ?? "usuario"}</span>
                <span className="social-action">Score {theory.score}</span>
              </div>
              <div className="top-podium-actions">
                <button
                  type="button"
                  className={theory.viewerVote === 1 ? "vote-chip vote-chip-icon-only like-chip active-like" : "vote-chip vote-chip-icon-only like-chip"}
                  aria-label="Like"
                  title="Like"
                  disabled={pendingTheoryId === theory.id}
                  onClick={() => handleVoteClick(theory.id, theory.viewerVote === 1 ? 0 : 1)}
                >
                  <VoteIcon direction="up" className="vote-icon" />
                </button>
                <button
                  type="button"
                  className={theory.viewerVote === -1 ? "vote-chip vote-chip-icon-only dislike-chip active-dislike" : "vote-chip vote-chip-icon-only dislike-chip"}
                  aria-label="Dislike"
                  title="Dislike"
                  disabled={pendingTheoryId === theory.id}
                  onClick={() => handleVoteClick(theory.id, theory.viewerVote === -1 ? 0 : -1)}
                >
                  <VoteIcon direction="down" className="vote-icon" />
                </button>
              </div>
            </div>
          </article>
        ))}

        {!loading && theories.length === 0 ? (
          <div className="empty-state-card">
            <p className="panel-kicker">Sin ranking</p>
            <h3>Todavia no hay teorias suficientes para el podio.</h3>
            <p>Cuando haya votos acumulados, aqui apareceran las tres teorias lideres.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
