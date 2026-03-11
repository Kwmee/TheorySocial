import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { SocialNavigation } from "./SocialNavigation";
import { TermsModal } from "./TermsModal";
import { TheorySocialLogo } from "./TheorySocialLogo";
import { UserAvatar } from "./UserAvatar";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
      <path
        d="M12 3.75a4.5 4.5 0 0 0-4.5 4.5v2.09c0 .7-.21 1.39-.61 1.97l-1.18 1.74A1.5 1.5 0 0 0 6.95 16.5h10.1a1.5 1.5 0 0 0 1.24-2.45l-1.18-1.74a3.38 3.38 0 0 1-.61-1.97V8.25a4.5 4.5 0 0 0-4.5-4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.25a2.2 2.2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <div className="app-layout-shell">
        <header className="social-topbar">
          <Link to="/" className="social-topbar-brand" aria-label="Ir al inicio de Theory Social">
            <TheorySocialLogo className="brand-logo" />
            <h1 className="brand-title">Theory Social</h1>
          </Link>

          <SocialNavigation />

          <div className="social-topbar-user">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive
                  ? "social-nav-link social-nav-link-icon topbar-notification active"
                  : "social-nav-link social-nav-link-icon topbar-notification"
              }
              aria-label="Avisos"
              title="Avisos"
            >
              <BellIcon />
              {unreadCount > 0 ? <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
            </NavLink>
            <div className="user-chip user-chip-social">
              <UserAvatar user={user} className="topbar-avatar" />
              <span>{user?.username ?? ""}</span>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <Outlet />
      </div>
      <TermsModal />
    </>
  );
}
