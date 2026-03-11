import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  createTheoryResponse,
  deleteTheoryResponse,
  fetchTheoryResponses,
  updateTheoryResponse,
  voteTheoryResponse,
} from "../services/api";
import { UserAvatar } from "./UserAvatar";
import { VoteIcon } from "./VoteIcon";

export function TheoryReplies({ theory, open, onOpen, onCountChange }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [votingId, setVotingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingDraft, setEditingDraft] = useState("");

  useEffect(() => {
    if (!open || loaded) {
      return;
    }

    let active = true;

    async function loadReplies() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTheoryResponses(theory.id);
        if (active) {
          setReplies(data);
          onCountChange?.(data.length);
          setLoaded(true);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReplies();

    return () => {
      active = false;
    };
  }, [loaded, open, theory.id]);

  const handleCreateReply = async (event) => {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created = await createTheoryResponse(theory.id, { content: draft.trim() });
      setReplies((current) => {
        const nextReplies = [...current, created];
        onCountChange?.(nextReplies.length);
        return nextReplies;
      });
      setDraft("");
      setLoaded(true);
      onOpen?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (replyId, clickedValue) => {
    const currentReply = replies.find((reply) => reply.id === replyId);
    if (!currentReply) {
      return;
    }

    const nextValue = currentReply.viewerVote === clickedValue ? 0 : clickedValue;

    setVotingId(replyId);
    setError("");

    try {
      const updated = await voteTheoryResponse(replyId, nextValue);
      setReplies((current) => current.map((reply) => (reply.id === replyId ? updated : reply)));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setVotingId(null);
    }
  };

  const handleDelete = async (replyId) => {
    setDeletingId(replyId);
    setError("");

    try {
      await deleteTheoryResponse(replyId);
      setReplies((current) => {
        const nextReplies = current.filter((reply) => reply.id !== replyId);
        onCountChange?.(nextReplies.length);
        return nextReplies;
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (reply) => {
    setEditingId(reply.id);
    setEditingDraft(reply.content);
  };

  const handleUpdate = async (replyId) => {
    setVotingId(replyId);
    setError("");

    try {
      const updated = await updateTheoryResponse(replyId, { content: editingDraft.trim() });
      setReplies((current) => current.map((reply) => (reply.id === replyId ? updated : reply)));
      setEditingId(null);
      setEditingDraft("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setVotingId(null);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <section className="theory-replies is-open">
      <form className="reply-composer" onSubmit={handleCreateReply}>
        <label>
          Responder a esta teoria
          <textarea
            value={draft}
            onFocus={() => onOpen?.()}
            onChange={(event) => setDraft(event.target.value)}
            rows="3"
            placeholder="Aporta un matiz, una objecion o una extension de la teoria."
          />
        </label>
        <div className="reply-composer-footer">
          <span className="social-action">{replies.length} respuestas visibles</span>
          <button type="submit" className="primary-action" disabled={submitting}>
            {submitting ? "Publicando..." : "Responder"}
          </button>
        </div>
      </form>

      {open ? (
        <div className="reply-thread" aria-live="polite">
          {loading ? <p>Cargando debate...</p> : null}
          {error ? <p className="error">{error}</p> : null}

          {!loading && replies.length === 0 ? (
            <div className="reply-empty">
              <p className="panel-kicker">Sin respuestas</p>
              <p>Abre el debate con la primera respuesta util y concreta.</p>
            </div>
          ) : null}

          {replies.map((reply) => (
            <article key={reply.id} className="reply-card">
              <header className="reply-card-header">
                <div className="theory-author">
                  <UserAvatar user={reply.author} className="reply-avatar" />
                  <div className="theory-author-meta">
                    <strong>{reply.author?.username ?? "Usuario"}</strong>
                    <p className="theory-meta">
                      {new Date(reply.createdAt).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>
                <span className="vote-total">Score {reply.score}</span>
              </header>

              {editingId === reply.id ? (
                <div className="theory-inline-editor">
                  <label>
                    Editar respuesta
                    <textarea
                      rows="4"
                      value={editingDraft}
                      onChange={(event) => setEditingDraft(event.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <p className="reply-card-copy">{reply.content}</p>
              )}

              <footer className="reply-card-footer">
                <div className="theory-card-actions" role="group" aria-label="Votos de respuesta">
                  <button
                    type="button"
                    className={reply.viewerVote === 1 ? "vote-chip vote-chip-icon-only like-chip active-like" : "vote-chip vote-chip-icon-only like-chip"}
                    onClick={() => handleVote(reply.id, 1)}
                    disabled={votingId === reply.id}
                    aria-pressed={reply.viewerVote === 1}
                    aria-label="Like"
                    title="Like"
                  >
                    <VoteIcon direction="up" className="vote-icon" />
                  </button>
                  <button
                    type="button"
                    className={reply.viewerVote === -1 ? "vote-chip vote-chip-icon-only dislike-chip active-dislike" : "vote-chip vote-chip-icon-only dislike-chip"}
                    onClick={() => handleVote(reply.id, -1)}
                    disabled={votingId === reply.id}
                    aria-pressed={reply.viewerVote === -1}
                    aria-label="Dislike"
                    title="Dislike"
                  >
                    <VoteIcon direction="down" className="vote-icon" />
                  </button>
                </div>

                {user?.username === reply.author?.username ? (
                  <>
                    {editingId === reply.id ? (
                      <>
                        <button
                          type="button"
                          className="vote-chip"
                          onClick={() => handleUpdate(reply.id)}
                          disabled={votingId === reply.id || !editingDraft.trim()}
                        >
                          {votingId === reply.id ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          type="button"
                          className="vote-chip"
                          onClick={() => {
                            setEditingId(null);
                            setEditingDraft("");
                          }}
                          disabled={votingId === reply.id}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="button" className="vote-chip" onClick={() => startEditing(reply)}>
                        Editar
                      </button>
                    )}
                    <button
                      type="button"
                      className="vote-chip delete-chip"
                      onClick={() => handleDelete(reply.id)}
                      disabled={deletingId === reply.id}
                    >
                      {deletingId === reply.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </>
                ) : null}
              </footer>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
