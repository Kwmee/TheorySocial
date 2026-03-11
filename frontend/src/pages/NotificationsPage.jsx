import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/api";
import { UserAvatar } from "../components/UserAvatar";

export function NotificationsPage() {
  const { refreshUnreadCount, markOneAsReadLocally, markAllAsReadLocally } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchNotifications();
        if (active) {
          setNotifications(data);
          void refreshUnreadCount();
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

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const handleMarkRead = async (notificationId) => {
    setMarkingId(notificationId);
    setError("");

    try {
      const updated = await markNotificationRead(notificationId);
      setNotifications((current) =>
        current.map((notification) => (notification.id === notificationId ? updated : notification)),
      );
      markOneAsReadLocally();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    setError("");

    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
      markAllAsReadLocally();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Avisos</p>
            <h2>Actividad sobre tus teorias</h2>
            <p className="feed-masthead-copy">
              Aqui ves likes, dislikes y respuestas nuevas sobre el contenido que publicaste.
            </p>
          </div>
          <button type="button" className="ghost-button" onClick={handleMarkAllRead} disabled={markingAll || unreadCount === 0}>
            {markingAll ? "Marcando..." : unreadCount > 0 ? `Marcar todo (${unreadCount})` : "Todo leido"}
          </button>
        </header>

        <section className="feed-surface">
          {loading ? <p>Cargando avisos...</p> : null}
          {error ? <p className="error">{error}</p> : null}

          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={notification.read ? "notification-item" : "notification-item unread"}
              >
                <div className="notification-item-head">
                  <div className="theory-author">
                    <UserAvatar user={notification.actor} />
                    <div className="theory-author-meta">
                      <strong>{notification.actor?.username ?? "Usuario"}</strong>
                      <p className="theory-meta">
                        {new Date(notification.createdAt).toLocaleString("es-ES")}
                      </p>
                    </div>
                  </div>
                  <span className="pill subtle">{notification.type === "THEORY_REPLY" ? "Respuesta" : "Voto"}</span>
                </div>

                <p className="notification-copy">{notification.message}</p>

                <div className="notification-actions">
                  <Link className="vote-chip" to={`/theories/${notification.theory.id}`}>
                    Ver teoria
                  </Link>
                  <Link className="vote-chip" to={`/users/${notification.actor.username}`}>
                    Ver perfil
                  </Link>
                  {!notification.read ? (
                    <button
                      type="button"
                      className="vote-chip"
                      onClick={() => handleMarkRead(notification.id)}
                      disabled={markingId === notification.id}
                    >
                      {markingId === notification.id ? "Marcando..." : "Marcar leida"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}

            {!loading && notifications.length === 0 ? (
              <div className="empty-state-card">
                <p className="panel-kicker">Sin avisos</p>
                <h3>No hay actividad reciente.</h3>
                <p>Cuando alguien vote o responda una de tus teorias, aparecera aqui.</p>
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
