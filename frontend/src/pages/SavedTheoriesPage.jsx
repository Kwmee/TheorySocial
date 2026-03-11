import { useEffect, useState } from "react";
import { TheoryList } from "../components/TheoryList";
import { fetchFavoriteTheories, toggleFavoriteTheory, voteTheory } from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function SavedTheoriesPage() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritingId, setFavoritingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchFavoriteTheories();
        if (active) {
          setTheories(data.map(enrichTheory));
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  const handleVote = async (theoryId, value) => {
    const updated = enrichTheory(await voteTheory(theoryId, value));
    setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));
    return updated;
  };

  const handleFavorite = async (theoryId) => {
    setFavoritingId(theoryId);
    setError("");

    try {
      const updated = enrichTheory(await toggleFavoriteTheory(theoryId));
      setTheories((current) =>
        updated.bookmarked
          ? current.map((theory) => (theory.id === theoryId ? updated : theory))
          : current.filter((theory) => theory.id !== theoryId),
      );
      return updated;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setFavoritingId(null);
    }
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Guardados</p>
            <h2>Tus teorias marcadas</h2>
            <p className="feed-masthead-copy">
              Guarda ideas para volver a ellas sin perderlas dentro del feed principal.
            </p>
          </div>
        </header>

        <TheoryList
          theories={theories}
          loading={loading}
          error={error}
          onVote={handleVote}
          onFavorite={handleFavorite}
          favoritingId={favoritingId}
          kicker="Biblioteca"
          title="Teorias guardadas"
          emptyTitle="No tienes teorias guardadas."
          emptyCopy="Usa el boton Guardar en cualquier teoria para construir tu propia coleccion."
          compact
        />
      </section>
    </main>
  );
}
