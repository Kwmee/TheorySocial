import { TheoryList } from "../components/TheoryList";
import { useTheories } from "../hooks/useTheories";

export function HomePage() {
  const { loading, error, filteredTheories, voteTheory } = useTheories();

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Inicio</p>
            <h2>Teorias de la comunidad</h2>
            <p className="feed-masthead-copy">
              Un feed limpio y lineal para leer, valorar y seguir conversaciones sin cambiar de
              contexto.
            </p>
          </div>
        </header>

        <TheoryList
          theories={filteredTheories}
          loading={loading}
          error={error}
          onVote={voteTheory}
          kicker="Feed"
          title="Teorias recientes"
          emptyTitle="No hay teorias disponibles."
          emptyCopy="Publica una teoria nueva o vuelve mas tarde para descubrir nuevas ideas."
        />
      </section>
    </main>
  );
}
