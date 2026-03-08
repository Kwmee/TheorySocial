import { TheoryList } from "../components/TheoryList";
import { TheorySearchPanel } from "../components/TheorySearchModal";
import { useTheories } from "../hooks/useTheories";

export function SearchPage() {
  const {
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    filteredTheories,
    voteTheory,
  } = useTheories();

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Buscar</p>
            <h2>Busca por tema o autor</h2>
            <p className="feed-masthead-copy">
              Filtra el contenido sin salir del flujo principal y encuentra teorias por lenguaje,
              tema detectado o autor.
            </p>
          </div>
        </header>

        <section className="feed-surface">
          <TheorySearchPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            topicOptions={topicOptions}
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
          />
        </section>

        <TheoryList
          theories={filteredTheories}
          loading={false}
          error=""
          onVote={voteTheory}
          kicker="Resultados"
          title="Teorias encontradas"
          emptyTitle="No hay resultados para esta busqueda."
          emptyCopy="Prueba otro termino o cambia el filtro de tema."
        />
      </section>
    </main>
  );
}
