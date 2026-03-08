import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Inicio" },
  { to: "/discover", label: "Descubrir" },
  { to: "/create", label: "Crear" },
  { to: "/search", label: "Buscar" },
  { to: "/profile", label: "Mi perfil" },
];

export function SocialNavigation() {
  return (
    <nav className="social-navigation" aria-label="Navegacion principal">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => (isActive ? "social-nav-link active" : "social-nav-link")}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
