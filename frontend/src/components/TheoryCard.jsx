import { useEffect, useState } from "react";
import { TheoryReplies } from "./TheoryReplies";

export function TheoryCard({
  theory,
  compact = false,
  onVote,
  voting = false,
  onDelete,
  deleting = false,
}) {
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [replyCount, setReplyCount] = useState(theory.responseCount ?? 0);
  const content = compact ? theory.excerpt : theory.content;

  useEffect(() => {
    setReplyCount(theory.responseCount ?? 0);
  }, [theory.responseCount]);

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
          <button
            type="button"
            className={discussionOpen ? "vote-chip active-like" : "vote-chip"}
            onClick={() => setDiscussionOpen((current) => !current)}
            aria-expanded={discussionOpen}
          >
            {discussionOpen ? "Ocultar debate" : "Abrir debate"} ({replyCount})
          </button>
          {onDelete ? (
            <button type="button" className="vote-chip delete-chip" onClick={() => onDelete(theory.id)} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          ) : null}
        </div>
      </footer>

      <TheoryReplies
        theory={theory}
        open={discussionOpen}
        onOpen={() => setDiscussionOpen(true)}
        onCountChange={setReplyCount}
      />
    </article>
  );
}
