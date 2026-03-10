import { useEffect, useState } from "react";
import { TheoryReplies } from "./TheoryReplies";
import { UserAvatar } from "./UserAvatar";
import { VoteIcon } from "./VoteIcon";

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
          <UserAvatar user={theory.author} fallback={theory.authorInitial} />
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
            className={theory.viewerVote === 1 ? "vote-chip vote-chip-icon-only like-chip active-like" : "vote-chip vote-chip-icon-only like-chip"}
            onClick={() => onVote?.(theory.id, resolveVoteValue(1))}
            disabled={voting}
            aria-pressed={theory.viewerVote === 1}
            aria-label="Like"
            title="Like"
          >
            <VoteIcon direction="up" className="vote-icon" />
          </button>
          <button
            type="button"
            className={theory.viewerVote === -1 ? "vote-chip vote-chip-icon-only dislike-chip active-dislike" : "vote-chip vote-chip-icon-only dislike-chip"}
            onClick={() => onVote?.(theory.id, resolveVoteValue(-1))}
            disabled={voting}
            aria-pressed={theory.viewerVote === -1}
            aria-label="Dislike"
            title="Dislike"
          >
            <VoteIcon direction="down" className="vote-icon" />
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
