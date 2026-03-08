import { useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 120;
const MAX_VISIBLE_CARDS = 3;

export function PopularTheoryDeck({
  theories,
  loading,
  error,
  onVote,
  tutorialSeen,
  onCompleteTutorial,
}) {
  const topCardRef = useRef(null);
  const dragStateRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
  });
  const [voteError, setVoteError] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [committedDirection, setCommittedDirection] = useState(null);
  const [tutorialError, setTutorialError] = useState("");
  const [tutorialSaving, setTutorialSaving] = useState(false);

  const topTheory = theories[0] ?? null;

  useEffect(() => {
    resetCardStyles();
    setCommittedDirection(null);
    setIsVoting(false);
  }, [topTheory?.id]);

  const resetCardStyles = () => {
    const node = topCardRef.current;
    if (!node) {
      return;
    }

    node.style.setProperty("--swipe-x", "0px");
    node.style.setProperty("--swipe-y", "0px");
    node.style.setProperty("--swipe-rotate", "0deg");
    node.style.setProperty("--like-opacity", "0");
    node.style.setProperty("--dislike-opacity", "0");
  };

  const updateCardStyles = (deltaX, deltaY) => {
    const node = topCardRef.current;
    if (!node) {
      return;
    }

    const rotation = Math.max(Math.min(deltaX / 22, 18), -18);
    const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);

    node.style.setProperty("--swipe-x", `${deltaX}px`);
    node.style.setProperty("--swipe-y", `${deltaY}px`);
    node.style.setProperty("--swipe-rotate", `${rotation}deg`);
    node.style.setProperty("--like-opacity", deltaX > 0 ? `${progress}` : "0");
    node.style.setProperty("--dislike-opacity", deltaX < 0 ? `${progress}` : "0");
  };

  const handlePointerDown = (event) => {
    if (!topTheory || isVoting || committedDirection) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (dragStateRef.current.pointerId !== event.pointerId || isVoting || committedDirection) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    dragStateRef.current.deltaX = deltaX;
    dragStateRef.current.deltaY = deltaY;
    updateCardStyles(deltaX, deltaY);
  };

  const handlePointerEnd = async (event) => {
    if (dragStateRef.current.pointerId !== event.pointerId || !topTheory || isVoting) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    const { deltaX, deltaY } = dragStateRef.current;
    dragStateRef.current.pointerId = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      resetCardStyles();
      return;
    }

    const direction = deltaX > 0 ? "right" : "left";
    const value = direction === "right" ? 1 : -1;
    const exitX = direction === "right" ? window.innerWidth : -window.innerWidth;

    setCommittedDirection(direction);
    setIsVoting(true);
    setVoteError("");
    updateCardStyles(exitX, deltaY, direction);

    try {
      await onVote(topTheory.id, value);
    } catch (requestError) {
      setVoteError(requestError.message);
      setCommittedDirection(null);
      setIsVoting(false);
      resetCardStyles();
    }
  };

  const handleTutorialComplete = async () => {
    setTutorialSaving(true);
    setTutorialError("");

    try {
      await onCompleteTutorial();
    } catch (requestError) {
      setTutorialError(requestError.message);
    } finally {
      setTutorialSaving(false);
    }
  };

  return (
    <section className="discover-panel">
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">Descubrir</p>
          <h2>Desliza para decidir que ideas suben al frente del producto.</h2>
        </div>
        <span className="pill">{theories.length} pendientes</span>
      </div>

      <p className="popular-intro">
        El stack prioriza teorias con mejor balance de votos recientes y oculta las que ya
        juzgaste para mantener el inicio util.
      </p>

      {loading ? <p>Cargando teorias populares...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {voteError ? <p className="error">{voteError}</p> : null}

      <div className="swipe-layout">
        <div className="swipe-deck-shell">
          <div className="swipe-deck">
            {theories.slice(0, MAX_VISIBLE_CARDS).reverse().map((theory, reverseIndex, slice) => {
              const stackIndex = slice.length - reverseIndex - 1;
              const isTopCard = stackIndex === 0;
              const className = [
                "swipe-card",
                isTopCard ? "is-top" : "is-background",
                committedDirection && isTopCard ? `is-committing-${committedDirection}` : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article
                  key={theory.id}
                  ref={isTopCard ? topCardRef : null}
                  className={className}
                  style={{
                    "--stack-index": stackIndex,
                  }}
                  onPointerDown={isTopCard ? handlePointerDown : undefined}
                  onPointerMove={isTopCard ? handlePointerMove : undefined}
                  onPointerUp={isTopCard ? handlePointerEnd : undefined}
                  onPointerCancel={isTopCard ? handlePointerEnd : undefined}
                >
                  <div className="swipe-card-badge swipe-card-badge-like">Like</div>
                  <div className="swipe-card-badge swipe-card-badge-dislike">Dislike</div>

                  <header className="swipe-card-header">
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

                  <div className="swipe-card-content">
                    <h3>{theory.title}</h3>
                    <p>{theory.content}</p>
                  </div>

                  <div className="theory-topic-row">
                    {theory.topics.map((topic) => (
                      <span key={`${theory.id}-${topic.slug}`} className="topic-tag">
                        #{topic.label}
                      </span>
                    ))}
                  </div>

                  <footer className="swipe-card-footer">
                    <span className="swipe-hint swipe-hint-left">Izquierda para Dislike</span>
                    <span className="swipe-hint swipe-hint-right">Derecha para Like</span>
                  </footer>
                </article>
              );
            })}

            {!loading && theories.length === 0 ? (
              <div className="empty-state-card swipe-empty-state">
                <p className="panel-kicker">Stack agotado</p>
                <h3>No quedan teorias populares por evaluar.</h3>
                <p>Vuelve mas tarde o usa el feed completo para revisar el resto del debate.</p>
              </div>
            ) : null}

            {!tutorialSeen && topTheory ? (
              <div className="swipe-tutorial-overlay">
                <div className="swipe-tutorial-card">
                  <p className="panel-kicker">Tutorial rapido</p>
                  <h3>Esta portada funciona por gestos.</h3>
                  <p>
                    Arrastra la carta a la derecha para apoyar una teoria y a la izquierda
                    para bajarla. Solo se muestra una vez por usuario.
                  </p>
                  <div className="swipe-tutorial-actions">
                    <button type="button" onClick={handleTutorialComplete} disabled={tutorialSaving}>
                      Entendido
                    </button>
                  </div>
                  {tutorialError ? <p className="error">{tutorialError}</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="swipe-side-panel">
          <div className="swipe-side-card">
            <p className="panel-kicker">Interaccion</p>
            <h3>Descubrir con decisiones rapidas</h3>
            <p>
              El ranking se ordena por votos netos recientes y volumen de interaccion. Cada
              swipe actualiza el score persistido del backend.
            </p>
          </div>
          <div className="swipe-side-card">
            <p className="panel-kicker">Regla de negocio</p>
            <h3>Un voto activo por usuario y teoria</h3>
            <p>
              Si ya votaste una teoria, desaparece del stack popular para evitar duplicados
              y mantener la experiencia limpia.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
