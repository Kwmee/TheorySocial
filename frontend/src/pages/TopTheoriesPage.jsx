import { useEffect, useState } from "react";
import { TopTheoryPodium } from "../components/TopTheoryPodium";
import { fetchTheories, fetchTopTheories, voteTheory } from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function TopTheoriesPage() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTopTheories() {
      setLoading(true);
      setError("");

      try {
        let data;

        try {
          data = await fetchTopTheories({ limit: 3 });
        } catch (requestError) {
          if (requestError.status !== 405) {
            throw requestError;
          }

          // Fallback for a backend instance that has not been restarted yet.
          data = await fetchTheories();
        }

        if (active) {
          setTheories(
            data
              .map(enrichTheory)
              .sort((left, right) => {
                if (right.score !== left.score) {
                  return right.score - left.score;
                }

                return new Date(right.createdAt) - new Date(left.createdAt);
              })
              .slice(0, 3),
          );
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

    loadTopTheories();

    return () => {
      active = false;
    };
  }, []);

  const handleVote = async (theoryId, value) => {
    const updated = enrichTheory(await voteTheory(theoryId, value));
    setTheories((current) =>
      current
        .map((theory) => (theory.id === theoryId ? updated : theory))
        .sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          return new Date(right.createdAt) - new Date(left.createdAt);
        }),
    );
    return updated;
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Ranking</p>
            <h2>TOP Teorias</h2>
            <p className="feed-masthead-copy">
              Solo las tres teorias mas votadas, con podio visual claro y acceso directo al perfil de
              cada autor desde su foto.
            </p>
          </div>
        </header>

        <TopTheoryPodium theories={theories} loading={loading} error={error} onVote={handleVote} />
      </section>
    </main>
  );
}
