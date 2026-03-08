export function SocialNavigation({
  sections,
  activeSection,
  onSelect,
  variant = "sidebar",
}) {
  const className =
    variant === "mobile" ? "social-navigation social-navigation-mobile" : "social-navigation";

  return (
    <nav className={className} aria-label="Navegacion principal">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={activeSection === section.id ? "social-nav-item active" : "social-nav-item"}
          onClick={() => onSelect(section.id)}
        >
          <span className="social-nav-label">{section.label}</span>
          {variant === "sidebar" ? <span className="social-nav-copy">{section.eyebrow}</span> : null}
        </button>
      ))}
    </nav>
  );
}
