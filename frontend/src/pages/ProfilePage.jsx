import { useEffect, useState } from "react";
import { TheoryList } from "../components/TheoryList";
import { useAuth } from "../hooks/useAuth";
import { deleteTheory, fetchMyTheories, voteTheory } from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function ProfilePage() {
  const { user } = useAuth();
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadMyTheories() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMyTheories();
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

    loadMyTheories();

    return () => {
      active = false;
    };
  }, []);

  const handleVote = async (theoryId, value) => {
    const updated = enrichTheory(await voteTheory(theoryId, value));
    setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));
    return updated;
  };

  const handleDelete = async (theoryId) => {
    setDeletingId(theoryId);
    setError("");

    try {
      await deleteTheory(theoryId);
      setTheories((current) => current.filter((theory) => theory.id !== theoryId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div>
            <p className="panel-kicker">Mi perfil</p>
            <h2>Mis teorias</h2>
            <p className="feed-masthead-copy">
              Revisa tus publicaciones, elimina ruido y sigue el estado de los debates abiertos por{" "}
              {user?.username ?? "tu cuenta"}.
            </p>
          </div>
        </header>

        <TheoryList
          theories={theories}
          loading={loading}
          error={error}
          onVote={handleVote}
          onDelete={handleDelete}
          deletingId={deletingId}
          kicker="Perfil"
          title="Contenido propio"
          emptyTitle="Todavia no has publicado teorias."
          emptyCopy="Publica una teoria nueva para abrir tu primer debate."
        />
      </section>
    </main>
  );
}
