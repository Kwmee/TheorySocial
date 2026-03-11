import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TheoryCard } from "../components/TheoryCard";
import { fetchTheoryById, toggleFavoriteTheory, voteTheory } from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function TheoryDetailPage() {
  const { theoryId } = useParams();
  const [theory, setTheory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTheory() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTheoryById(theoryId);
        if (active) {
          setTheory(enrichTheory(data));
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

    loadTheory();

    return () => {
      active = false;
    };
  }, [theoryId]);

  const handleVote = async (id, value) => {
    setVoting(true);
    setError("");

    try {
      const updated = enrichTheory(await voteTheory(id, value));
      setTheory(updated);
      return updated;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setVoting(false);
    }
  };

  const handleFavorite = async (id) => {
    setError("");

    try {
      const updated = enrichTheory(await toggleFavoriteTheory(id));
      setTheory(updated);
      return updated;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Teoria</p>
            <h2>Vista individual</h2>
            <p className="feed-masthead-copy">
              Comparte una teoria por URL directa y entra al debate sin depender del feed.
            </p>
          </div>
        </header>

        <section className="feed-surface">
          {loading ? <p>Cargando teoria...</p> : null}
          {error ? <p className="error">{error}</p> : null}
          {theory ? (
            <TheoryCard theory={theory} onVote={handleVote} onFavorite={handleFavorite} voting={voting} />
          ) : null}
        </section>
      </section>
    </main>
  );
}
