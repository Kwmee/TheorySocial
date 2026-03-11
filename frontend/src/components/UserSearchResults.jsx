import { Link } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";

export function UserSearchResults({
  users,
  loading,
  error,
  followingUsername,
  onToggleFollow,
}) {
  return (
    <section className="feed-surface">
      <div className="section-head feed-section-head">
        <div>
          <p className="panel-kicker">Perfiles</p>
          <h2>Usuarios encontrados</h2>
        </div>
      </div>

      {loading ? <p>Buscando usuarios...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="suggestion-list">
        {users.map((user) => (
          <article key={user.id} className="suggestion-card">
            <div className="theory-author">
              <UserAvatar user={user} />
              <div className="theory-author-meta">
                <Link to={`/users/${user.username}`}>
                  <strong>{user.username}</strong>
                </Link>
                <p className="theory-meta">
                  {user.followerCount} seguidores · {user.theoryCount} teorias
                </p>
              </div>
            </div>
            <p className="suggestion-copy">
              {user.bio?.trim() || "Todavia no ha escrito una descripcion publica."}
            </p>
            <div className="notification-actions">
              <Link className="vote-chip" to={`/users/${user.username}`}>
                Ver perfil
              </Link>
              <button
                type="button"
                className={user.followedByViewer ? "vote-chip" : "vote-chip active-like"}
                onClick={() => onToggleFollow?.(user)}
                disabled={followingUsername === user.username}
              >
                {followingUsername === user.username
                  ? "Actualizando..."
                  : user.followedByViewer
                    ? "Siguiendo"
                    : "Seguir"}
              </button>
            </div>
          </article>
        ))}

        {!loading && users.length === 0 ? (
          <div className="empty-state-card">
            <p className="panel-kicker">Sin perfiles</p>
            <h3>No hay usuarios para esta busqueda.</h3>
            <p>Prueba otro nombre, interes o descripcion.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
