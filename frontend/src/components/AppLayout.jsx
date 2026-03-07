import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
      <div className="app-frame">
        <header className="site-header">
          <div>
            <p className="brand-mark">Theory Social</p>
            <h1 className="brand-title">Teorias Humanas</h1>
          </div>
          <nav className="site-nav">
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </nav>
          <div className="header-actions">
            <div className="user-chip">
              <span>{user?.username}</span>
              <small>{user?.email}</small>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <Outlet />

        <footer className="site-footer">
          <div>
            <h2>Theory Social</h2>
            <p>
              Espacio privado para explorar, debatir y ordenar teorias con una
              experiencia consistente y protegida.
            </p>
          </div>
          <div className="footer-grid">
            <div>
              <h3>Seguridad</h3>
              <p>Acceso restringido a usuarios autenticados.</p>
            </div>
            <div>
              <h3>Moderacion futura</h3>
              <p>La base queda preparada para votos, comentarios y reportes.</p>
            </div>
            <div>
              <h3>Persistencia</h3>
              <p>La aceptacion de terminos vive en MySQL y aplica en todos los dispositivos.</p>
            </div>
          </div>
        </footer>
      </div>
      <TermsModal />
    </>
  );
}
