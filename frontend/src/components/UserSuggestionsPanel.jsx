import { UserAvatar } from "./UserAvatar";

export function UserSuggestionsPanel({
  suggestions,
  loading,
  error,
  followingUsername,
  onFollow,
}) {
  return (
    <section className="feed-surface">
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">Sugerencias</p>
          <h2>Usuarios para seguir</h2>
        </div>
      </div>

      {loading ? <p>Cargando sugerencias...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="suggestion-list">
        {suggestions.map((suggestion) => (
          <article key={suggestion.id} className="suggestion-card">
            <div className="theory-author">
              <UserAvatar user={suggestion} />
              <div className="theory-author-meta">
                <strong>{suggestion.username}</strong>
                <p className="theory-meta">
                  {suggestion.followerCount} seguidores · {suggestion.theoryCount} teorias
                </p>
              </div>
            </div>
            <p className="suggestion-copy">
              {suggestion.bio?.trim() || "Todavia no ha escrito una descripcion publica."}
            </p>
            <button
              type="button"
              className="vote-chip active-like"
              onClick={() => onFollow?.(suggestion.username)}
              disabled={followingUsername === suggestion.username}
            >
              {followingUsername === suggestion.username ? "Siguiendo..." : "Seguir"}
            </button>
          </article>
        ))}

        {!loading && suggestions.length === 0 ? (
          <div className="empty-state-card">
            <p className="panel-kicker">Sin sugerencias</p>
            <h3>Ya sigues a todos los perfiles sugeridos.</h3>
            <p>Vuelve mas tarde cuando entren usuarios nuevos o explora perfiles desde el feed.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
