import { useEffect, useState } from "react";
import { TheoryList } from "../components/TheoryList";
import { UserSuggestionsPanel } from "../components/UserSuggestionsPanel";
import { useTheories } from "../hooks/useTheories";
import {
  fetchFollowingTheories,
  fetchUserSuggestions,
  followUser,
} from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function HomePage() {
  const { loading, error, filteredTheories, voteTheory, favoriteTheory } = useTheories();
  const [feedMode, setFeedMode] = useState("all");
  const [followingTheories, setFollowingTheories] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingError, setFollowingError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState("");
  const [followingUsername, setFollowingUsername] = useState("");

  const topVotedTheories = [...filteredTheories]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return new Date(right.createdAt) - new Date(left.createdAt);
    })
    .slice(0, 10);

  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      setSuggestionsLoading(true);
      setSuggestionsError("");

      try {
        const data = await fetchUserSuggestions();
        if (active) {
          setSuggestions(data);
        }
      } catch (requestError) {
        if (active) {
          setSuggestionsError(requestError.message);
        }
      } finally {
        if (active) {
          setSuggestionsLoading(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (feedMode !== "following") {
      return;
    }

    let active = true;

    async function loadFollowingFeed() {
      setFollowingLoading(true);
      setFollowingError("");

      try {
        const data = await fetchFollowingTheories();
        if (active) {
          setFollowingTheories(data.map(enrichTheory));
        }
      } catch (requestError) {
        if (active) {
          setFollowingError(requestError.message);
        }
      } finally {
        if (active) {
          setFollowingLoading(false);
        }
      }
    }

    loadFollowingFeed();

    return () => {
      active = false;
    };
  }, [feedMode]);

  const handleFollowSuggestion = async (username) => {
    setFollowingUsername(username);
    setSuggestionsError("");

    try {
      await followUser(username);
      setSuggestions((current) => current.filter((suggestion) => suggestion.username !== username));
      if (feedMode === "following") {
        const data = await fetchFollowingTheories();
        setFollowingTheories(data.map(enrichTheory));
      }
    } catch (requestError) {
      setSuggestionsError(requestError.message);
    } finally {
      setFollowingUsername("");
    }
  };

  const handleVote = async (theoryId, value) => {
    const updated = await voteTheory(theoryId, value);
    if (feedMode === "following") {
      setFollowingTheories((current) =>
        current.map((theory) => (theory.id === theoryId ? updated : theory)),
      );
    }
    return updated;
  };

  const handleFavorite = async (theoryId) => {
    const updated = await favoriteTheory(theoryId);
    if (feedMode === "following") {
      setFollowingTheories((current) =>
        current.map((theory) => (theory.id === theoryId ? updated : theory)),
      );
    }
    return updated;
  };

  const activeTheories = feedMode === "following" ? followingTheories : topVotedTheories;
  const activeLoading = feedMode === "following" ? followingLoading : loading;
  const activeError = feedMode === "following" ? followingError : error;

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
          <div className="sort-chip-group">
            <button
              type="button"
              className={feedMode === "all" ? "vote-chip active-like" : "vote-chip"}
              onClick={() => setFeedMode("all")}
            >
              Comunidad
            </button>
            <button
              type="button"
              className={feedMode === "following" ? "vote-chip active-like" : "vote-chip"}
              onClick={() => setFeedMode("following")}
            >
              Siguiendo
            </button>
          </div>
        </header>

        <TheoryList
          theories={activeTheories}
          loading={activeLoading}
          error={activeError}
          onVote={handleVote}
          onFavorite={handleFavorite}
          allowSorting={false}
          kicker={feedMode === "following" ? "Tu red" : "Feed"}
          title={feedMode === "following" ? "Teorias de la gente que sigues" : "Top 10 teorias mas votadas"}
          emptyTitle={
            feedMode === "following"
              ? "Todavia no sigues a nadie."
              : "No hay teorias disponibles."
          }
          emptyCopy={
            feedMode === "following"
              ? "Sigue a algunos usuarios para construir un feed personal."
              : "Publica una teoria nueva o vuelve mas tarde para descubrir nuevas ideas."
          }
        />

        <UserSuggestionsPanel
          suggestions={suggestions}
          loading={suggestionsLoading}
          error={suggestionsError}
          followingUsername={followingUsername}
          onFollow={handleFollowSuggestion}
        />
      </section>
    </main>
  );
}
