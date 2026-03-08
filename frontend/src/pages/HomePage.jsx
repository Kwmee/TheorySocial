import { useState } from "react";
import { PopularTheoryDeck } from "../components/PopularTheoryDeck";
import { TheoryComposer } from "../components/TheoryComposer";
import { TheoryList } from "../components/TheoryList";
import { TheorySearchModal } from "../components/TheorySearchModal";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function HomePage() {
  const { user, completeSwipeTutorial } = useAuth();
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
  const [activeSection, setActiveSection] = useState("popular");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <main className="app-shell social-shell">
      <section className="panel social-hero">
        <div className="social-hero-copy">
          <p className="panel-kicker">Portada privada</p>
          <h2>Prioriza teorias con gestos rapidos y entra al debate solo cuando haga falta.</h2>
          <p>
            La vista principal ahora mezcla ranking reciente y mecánica swipe: decidir
            es inmediato, pero el feed completo y la publicación siguen disponibles
            cuando necesitas mas contexto.
          </p>
        </div>

        <div className="social-hero-metrics">
          <article className="social-stat-card">
            <span>Usuario activo</span>
            <strong>{user?.username}</strong>
          </article>
          <article className="social-stat-card">
            <span>Stack popular</span>
            <strong>{popularTheories.length}</strong>
          </article>
          <article className="social-stat-card">
            <span>Feed completo</span>
            <strong>{filteredTheories.length}</strong>
          </article>
          <article className="social-stat-card">
            <span>Tutorial swipe</span>
            <strong>{user?.swipeTutorialSeen ? "Visto" : "Pendiente"}</strong>
          </article>
          <article className="social-stat-card">
            <span>Temas detectados</span>
            <strong>{Math.max(topicOptions.length - 1, 0)}</strong>
          </article>
        </div>
      </section>

      <section className="forum-toolbar">
        <button
          type="button"
          className={activeSection === "popular" ? "forum-toolbar-button active" : "forum-toolbar-button"}
          onClick={() => setActiveSection("popular")}
        >
          Teorias populares
        </button>
        <button
          type="button"
          className={activeSection === "compose" ? "forum-toolbar-button active" : "forum-toolbar-button"}
          onClick={() => setActiveSection("compose")}
        >
          Insertar nueva teoria
        </button>
        <button
          type="button"
          className="forum-toolbar-button"
          onClick={() => setSearchOpen(true)}
        >
          Buscar teorias
        </button>
        <button
          type="button"
          className={activeSection === "read" ? "forum-toolbar-button active" : "forum-toolbar-button"}
          onClick={() => setActiveSection("read")}
        >
          Leer teorias
        </button>
      </section>

      {activeSection === "popular" ? (
        <section className="forum-section">
          <PopularTheoryDeck
            theories={popularTheories}
            loading={popularLoading}
            error={popularError}
            onVote={voteTheory}
            tutorialSeen={Boolean(user?.swipeTutorialSeen)}
            onCompleteTutorial={completeSwipeTutorial}
          />
        </section>
      ) : null}

      {activeSection === "compose" ? (
        <section className="forum-section">
          <TheoryComposer onSubmit={createTheory} />
        </section>
      ) : null}

      {activeSection === "read" ? (
        <section className="forum-section">
          <TheoryList
            theories={filteredTheories}
            loading={loading}
            error={error}
            onVote={voteTheory}
            kicker="Lectura"
            title="Feed escroleable de teorias"
            emptyTitle="No hay teorias disponibles."
            emptyCopy="Publica una teoria nueva o usa la busqueda para explorar otros temas."
          />
        </section>
      ) : null}

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
