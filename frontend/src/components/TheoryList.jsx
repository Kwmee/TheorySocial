import { useState } from "react";
import { TheoryCard } from "./TheoryCard";

export function TheoryList({
  theories,
  loading,
  error,
  onVote,
  onFavorite,
  onPin,
  onDelete,
  onUpdate,
  deletingId = null,
  favoritingId = null,
  pinningId = null,
  pinnedTheoryId = null,
  updatingId = null,
  title = "Conversaciones activas",
  kicker = "Feed privado",
  emptyTitle = "No hay teorias todavia.",
  emptyCopy = "Publica la primera teoria para iniciar el debate.",
  compact = false,
  allowSorting = true,
}) {
  const [voteError, setVoteError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [votingId, setVotingId] = useState(null);
  const [sortMode, setSortMode] = useState("recent");

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

  const handleFavorite = async (theoryId) => {
    if (!onFavorite) {
      return null;
    }

    setFavoriteError("");

    try {
      return await onFavorite(theoryId);
    } catch (requestError) {
      setFavoriteError(requestError.message);
      throw requestError;
    }
  };

  const sortedTheories = [...theories].sort((left, right) => {
    if (sortMode === "score") {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
    }

    if (sortMode === "responses") {
      if ((right.responseCount ?? 0) !== (left.responseCount ?? 0)) {
        return (right.responseCount ?? 0) - (left.responseCount ?? 0);
      }
    }

    return new Date(right.createdAt) - new Date(left.createdAt);
  });

  return (
    <section className={compact ? "feed-surface compact" : "feed-surface"}>
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <div className="feed-section-meta">
          {allowSorting ? (
            <div className="sort-chip-group" role="group" aria-label="Ordenar teorias">
              <button
                type="button"
                className={sortMode === "recent" ? "vote-chip active-like" : "vote-chip"}
                onClick={() => setSortMode("recent")}
              >
                Recientes
              </button>
              <button
                type="button"
                className={sortMode === "score" ? "vote-chip active-like" : "vote-chip"}
                onClick={() => setSortMode("score")}
              >
                Votadas
              </button>
              <button
                type="button"
                className={sortMode === "responses" ? "vote-chip active-like" : "vote-chip"}
                onClick={() => setSortMode("responses")}
              >
                Debate
              </button>
            </div>
          ) : null}
          <span className="pill">{theories.length} visibles</span>
        </div>
      </div>

      {loading ? <p>Cargando teorias...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {voteError ? <p className="error">{voteError}</p> : null}
      {favoriteError ? <p className="error">{favoriteError}</p> : null}

      <div className={compact ? "feed-list compact" : "feed-list"} aria-live="polite">
        {sortedTheories.map((theory) => (
          <TheoryCard
            key={theory.id}
            theory={theory}
            compact={compact}
            onVote={handleVote}
            onFavorite={handleFavorite}
            favoriting={favoritingId === theory.id}
            onPin={onPin}
            pinning={pinningId === theory.id}
            pinned={pinnedTheoryId === theory.id}
            voting={votingId === theory.id}
            onDelete={onDelete}
            deleting={deletingId === theory.id}
            onUpdate={onUpdate}
            updating={updatingId === theory.id}
          />
        ))}

        {!loading && sortedTheories.length === 0 ? (
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
