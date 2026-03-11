import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TheoryReplies } from "./TheoryReplies";
import { UserAvatar } from "./UserAvatar";
import { VoteIcon } from "./VoteIcon";

export function TheoryCard({
  theory,
  compact = false,
  onVote,
  onFavorite,
  onPin,
  pinning = false,
  pinned = false,
  favoriting = false,
  voting = false,
  onDelete,
  deleting = false,
  onUpdate,
  updating = false,
}) {
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [replyCount, setReplyCount] = useState(theory.responseCount ?? 0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: theory.title, content: theory.content });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const content = compact ? theory.excerpt : theory.content;

  useEffect(() => {
    setReplyCount(theory.responseCount ?? 0);
  }, [theory.responseCount]);

  useEffect(() => {
    setDraft({ title: theory.title, content: theory.content });
  }, [theory.content, theory.title]);

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedbackMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const resolveVoteValue = (clickedValue) => {
    if (theory.viewerVote === clickedValue) {
      return 0;
    }

    return clickedValue;
  };

  const handleSave = async () => {
    await onUpdate?.(theory.id, {
      title: draft.title.trim(),
      content: draft.content.trim(),
    });
    setEditing(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/theories/${theory.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: theory.title,
          text: theory.excerpt,
          url,
        });
        setFeedbackMessage("Teoria compartida.");
        return;
      }

      await navigator.clipboard.writeText(url);
      setFeedbackMessage("Enlace copiado.");
    } catch {
      window.prompt("Copia este enlace", url);
      setFeedbackMessage("Copia manual del enlace abierta.");
    }
  };

  const handleFavorite = async () => {
    const updatedTheory = await onFavorite?.(theory.id);
    setFeedbackMessage(updatedTheory?.bookmarked ? "Teoria guardada." : "Teoria eliminada de guardados.");
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

      {editing ? (
        <div className="theory-card-copy theory-inline-editor">
          <label>
            Titulo
            <input
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              maxLength={180}
            />
          </label>
          <label>
            Desarrollo
            <textarea
              rows="6"
              value={draft.content}
              onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
            />
          </label>
        </div>
      ) : (
        <div className="theory-card-copy">
          <h3>
            <Link to={`/theories/${theory.id}`} className="theory-title-link">
              {theory.title}
            </Link>
          </h3>
          <p>{content}</p>
        </div>
      )}

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
          {onUpdate ? (
            editing ? (
              <>
                <button
                  type="button"
                  className="vote-chip"
                  onClick={handleSave}
                  disabled={updating || !draft.title.trim() || !draft.content.trim()}
                >
                  {updating ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="vote-chip"
                  onClick={() => {
                    setDraft({ title: theory.title, content: theory.content });
                    setEditing(false);
                  }}
                  disabled={updating}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" className="vote-chip" onClick={() => setEditing(true)}>
                Editar
              </button>
            )
          ) : null}
          {onFavorite ? (
            <button
              type="button"
              className={theory.bookmarked ? "vote-chip bookmark-chip active-bookmark" : "vote-chip bookmark-chip"}
              onClick={handleFavorite}
              disabled={favoriting}
            >
              {favoriting ? "Guardando..." : theory.bookmarked ? "Guardada" : "Guardar"}
            </button>
          ) : null}
          {onPin ? (
            <button
              type="button"
              className={pinned ? "vote-chip active-like" : "vote-chip"}
              onClick={() => onPin(theory.id)}
              disabled={pinning}
            >
              {pinning ? "Actualizando..." : pinned ? "Destacada" : "Destacar"}
            </button>
          ) : null}
          <button type="button" className="vote-chip" onClick={handleShare}>
            Compartir
          </button>
        </div>
      </footer>

      {feedbackMessage ? <p className="feedback theory-card-feedback">{feedbackMessage}</p> : null}

      <TheoryReplies
        theory={theory}
        open={discussionOpen}
        onOpen={() => setDiscussionOpen(true)}
        onCountChange={setReplyCount}
      />
    </article>
  );
}
