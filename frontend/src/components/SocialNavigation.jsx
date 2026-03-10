import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/top", label: "TOP Teorias", shortLabel: "Top" },
  { to: "/discover", label: "Descubrir", shortLabel: "Swipe" },
  { to: "/create", label: "Crear", shortLabel: "Crear" },
  { to: "/search", label: "Buscar", shortLabel: "Buscar" },
  { to: "/profile", label: "Mi perfil", shortLabel: "Perfil" },
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
          <span className="nav-label-full">{item.label}</span>
          <span className="nav-label-short">{item.shortLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}
