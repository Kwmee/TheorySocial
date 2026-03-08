import { useState } from "react";
import { TheoryCard } from "./TheoryCard";

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
    <section className={compact ? "feed-surface compact" : "feed-surface"}>
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <span className="pill">{theories.length} visibles</span>
      </div>

      {loading ? <p>Cargando teorias...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {voteError ? <p className="error">{voteError}</p> : null}

      <div className={compact ? "feed-list compact" : "feed-list"}>
        {theories.map((theory) => (
          <TheoryCard
            key={theory.id}
            theory={theory}
            compact={compact}
            onVote={handleVote}
            voting={votingId === theory.id}
          />
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
