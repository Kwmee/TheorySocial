import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopularTheoryDeck } from "../components/PopularTheoryDeck";
import { SocialNavigation } from "../components/SocialNavigation";
import { TheoryComposer } from "../components/TheoryComposer";
import { TheoryList } from "../components/TheoryList";
import { TheorySearchModal } from "../components/TheorySearchModal";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

const SECTIONS = [
  { id: "read", label: "Inicio", eyebrow: "Feed", title: "Teorias de la comunidad" },
  { id: "popular", label: "Descubrir", eyebrow: "Swipe", title: "Descubre teorias populares" },
  { id: "compose", label: "Crear", eyebrow: "Editor", title: "Publica una nueva teoria" },
  { id: "search", label: "Buscar", eyebrow: "Filtro", title: "Busca por tema o autor" },
];

export function HomePage() {
  const { user, logout, completeSwipeTutorial } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    popularLoading,
    error,
    popularError,
    createTheory,
    voteTheory,
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    popularTheories,
    filteredTheories,
  } = useTheories();
  const [activeSection, setActiveSection] = useState("read");
  const [searchOpen, setSearchOpen] = useState(false);

  const activeView = SECTIONS.find((section) => section.id === activeSection) ?? SECTIONS[0];

  const handleSelectSection = (sectionId) => {
    if (sectionId === "search") {
      setSearchOpen(true);
      return;
    }

    setActiveSection(sectionId);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="social-app-shell">
      <div className="social-app-grid">
        <aside className="social-sidebar">
          <div className="sidebar-brand">
            <p className="brand-mark">Theory Social</p>
            <h1 className="brand-title">Teorias Humanas</h1>
            <p className="header-subcopy">
              Feed privado de ideas, descubrimiento y debate con una estetica social mas limpia.
            </p>
          </div>

          <SocialNavigation
            sections={SECTIONS}
            activeSection={activeSection}
            onSelect={handleSelectSection}
          />

          <div className="sidebar-card user-summary-card">
            <div className="theory-author">
              <div className="author-avatar">{user?.username?.slice(0, 1).toUpperCase() ?? "U"}</div>
              <div className="theory-author-meta">
                <strong>{user?.username}</strong>
                <p className="theory-meta">
                  {user?.swipeTutorialSeen ? "Tutorial swipe completado" : "Tutorial swipe pendiente"}
                </p>
              </div>
            </div>
            <button type="button" className="ghost-button sidebar-logout" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>

          <div className="sidebar-card metrics-card">
            <p className="panel-kicker">Resumen</p>
            <div className="sidebar-metric-grid">
              <article>
                <span>Feed</span>
                <strong>{filteredTheories.length}</strong>
              </article>
              <article>
                <span>Descubrir</span>
                <strong>{popularTheories.length}</strong>
              </article>
              <article>
                <span>Temas</span>
                <strong>{Math.max(topicOptions.length - 1, 0)}</strong>
              </article>
              <article>
                <span>Terminos</span>
                <strong>{user?.acceptedTerms ? "OK" : "Pend"}</strong>
              </article>
            </div>
          </div>
        </aside>

        <section className="social-main-column">
          <header className="feed-masthead">
            <div>
              <p className="panel-kicker">{activeView.eyebrow}</p>
              <h2>{activeView.title}</h2>
              <p className="feed-masthead-copy">
                Diseno tipo red social con una columna central clara, navegacion persistente y modo
                descubrir separado para el swipe.
              </p>
            </div>
          </header>

          <section className="story-strip" aria-label="Indicadores de actividad">
            <article className="story-chip">
              <span>Usuario</span>
              <strong>{user?.username}</strong>
            </article>
            <article className="story-chip">
              <span>Popular ahora</span>
              <strong>{popularTheories.length}</strong>
            </article>
            <article className="story-chip">
              <span>Feed activo</span>
              <strong>{filteredTheories.length}</strong>
            </article>
            <article className="story-chip">
              <span>Tutorial</span>
              <strong>{user?.swipeTutorialSeen ? "Visto" : "Pendiente"}</strong>
            </article>
          </section>

          <section className="social-content-panel">
            {activeSection === "popular" ? (
              <PopularTheoryDeck
                theories={popularTheories}
                loading={popularLoading}
                error={popularError}
                onVote={voteTheory}
                tutorialSeen={Boolean(user?.swipeTutorialSeen)}
                onCompleteTutorial={completeSwipeTutorial}
              />
            ) : null}

            {activeSection === "compose" ? <TheoryComposer onSubmit={createTheory} /> : null}

            {activeSection === "read" ? (
              <TheoryList
                theories={filteredTheories}
                loading={loading}
                error={error}
                onVote={voteTheory}
                kicker="Feed"
                title="Teorias recientes"
                emptyTitle="No hay teorias disponibles."
                emptyCopy="Publica una teoria nueva o usa la busqueda para explorar otros temas."
              />
            ) : null}
          </section>
        </section>
      </div>

      <div className="mobile-bottom-nav">
        <SocialNavigation
          sections={SECTIONS}
          activeSection={activeSection}
          onSelect={handleSelectSection}
          variant="mobile"
        />
      </div>

      <TheorySearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        topicOptions={topicOptions}
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
        theories={filteredTheories}
        onVote={voteTheory}
      />
    </main>
  );
}
