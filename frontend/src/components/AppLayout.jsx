import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SocialNavigation } from "./SocialNavigation";
import { TermsModal } from "./TermsModal";
import { TheorySocialLogo } from "./TheorySocialLogo";
import { UserAvatar } from "./UserAvatar";

export function AppLayout() {
  const { user, logout } = useAuth();
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
