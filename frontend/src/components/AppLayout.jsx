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
      <div className="app-frame app-frame-social">
        <header className="site-header site-header-social">
          <div>
            <p className="brand-mark">Theory Social</p>
            <h1 className="brand-title">Teorias Humanas</h1>
            <p className="header-subcopy">
              Feed privado para explorar ideas por tema, autor y contexto.
            </p>
          </div>

          <nav className="site-nav">
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </nav>

          <div className="header-actions">
            <div className="user-chip user-chip-social">
              <span>{user?.username}</span>
              <small>{user?.email}</small>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <Outlet />

        <footer className="site-footer site-footer-social">
          <div>
            <h2>Theory Social</h2>
            <p>
              Plataforma privada para publicar, descubrir y refinar teorias
              humanas sin exponer contenido a usuarios no autenticados.
            </p>
          </div>
          <div className="footer-grid">
            <div>
              <h3>Seguridad</h3>
              <p>Sesion requerida en todo el producto y terminos persistidos en servidor.</p>
            </div>
            <div>
              <h3>Escalabilidad</h3>
              <p>Los filtros actuales pueden migrar a backend sin rehacer la experiencia.</p>
            </div>
            <div>
              <h3>Evolucion</h3>
              <p>La interfaz queda lista para votos, comentarios, guardados y moderacion futura.</p>
            </div>
          </div>
        </footer>
      </div>
      <TermsModal />
    </>
  );
}
