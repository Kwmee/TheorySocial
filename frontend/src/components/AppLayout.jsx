import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SocialNavigation } from "./SocialNavigation";
import { TermsModal } from "./TermsModal";

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
          <div className="social-topbar-brand">
            <p className="brand-mark">Theory Social</p>
            <h1 className="brand-title">Teorias Humanas</h1>
          </div>

          <SocialNavigation />

          <div className="social-topbar-user">
            <div className="user-chip user-chip-social">
              <span>
                <strong className="user-chip-label">Usuario:</strong>{" "}
                <span>{user?.username ?? ""}</span>
              </span>
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
