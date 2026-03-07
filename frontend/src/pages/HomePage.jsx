import { useState } from "react";
import { TheoryComposer } from "../components/TheoryComposer";
import { TheoryList } from "../components/TheoryList";
import { TheorySearchModal } from "../components/TheorySearchModal";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function HomePage() {
  const { user } = useAuth();
  const {
    loading,
    error,
    createTheory,
    voteTheory,
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    filteredTheories,
  } = useTheories();
  const [activeSection, setActiveSection] = useState("read");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <main className="app-shell social-shell">
      <section className="panel social-hero">
        <div className="social-hero-copy">
          <p className="panel-kicker">Comunidad privada</p>
          <h2>Lee, busca o publica teorias desde una estructura de foro clara.</h2>
          <p>
            La experiencia queda separada por tareas para que el producto se sienta
            mas ordenado: leer es flujo continuo, buscar es exploracion modal y
            publicar es una accion dedicada.
          </p>
        </div>

        <div className="social-hero-metrics">
          <article className="social-stat-card">
            <span>Usuario activo</span>
            <strong>{user?.username}</strong>
          </article>
          <article className="social-stat-card">
            <span>Teorias visibles</span>
            <strong>{filteredTheories.length}</strong>
          </article>
          <article className="social-stat-card">
            <span>Temas detectados</span>
            <strong>{Math.max(topicOptions.length - 1, 0)}</strong>
          </article>
          <article className="social-stat-card">
            <span>Terminos</span>
            <strong>{user?.acceptedTerms ? "Aceptados" : "Pendiente"}</strong>
          </article>
        </div>
      </section>

      <section className="forum-toolbar">
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

      {activeSection === "compose" ? (
        <section className="forum-section">
          <TheoryComposer onSubmit={createTheory} />
        </section>
      ) : (
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
      )}

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
