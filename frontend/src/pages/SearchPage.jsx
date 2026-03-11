import { useEffect, useState } from "react";
import { TheoryList } from "../components/TheoryList";
import { TheorySearchPanel } from "../components/TheorySearchModal";
import { UserSearchResults } from "../components/UserSearchResults";
import { useTheories } from "../hooks/useTheories";
import { followUser, searchUsers, unfollowUser } from "../services/api";

export function SearchPage() {
  const {
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    filteredTheories,
    voteTheory,
    favoriteTheory,
  } = useTheories();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [followingUsername, setFollowingUsername] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      const query = searchQuery.trim();
      if (query.length < 2) {
        setUsers([]);
        setUsersError("");
        setUsersLoading(false);
        return;
      }

      setUsersLoading(true);
      setUsersError("");

      try {
        const data = await searchUsers(query);
        if (active) {
          setUsers(data);
        }
      } catch (requestError) {
        if (active) {
          setUsersError(requestError.message);
        }
      } finally {
        if (active) {
          setUsersLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const handleToggleFollow = async (user) => {
    setFollowingUsername(user.username);
    setUsersError("");

    try {
      if (user.followedByViewer) {
        await unfollowUser(user.username);
      } else {
        await followUser(user.username);
      }

      setUsers((current) =>
        current.map((entry) =>
          entry.username === user.username
            ? {
                ...entry,
                followedByViewer: !entry.followedByViewer,
                followerCount: entry.followedByViewer
                  ? Math.max(0, entry.followerCount - 1)
                  : entry.followerCount + 1,
              }
            : entry,
        ),
      );
    } catch (requestError) {
      setUsersError(requestError.message);
    } finally {
      setFollowingUsername("");
    }
  };

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
          onFavorite={favoriteTheory}
          kicker="Resultados"
          title="Teorias encontradas"
          emptyTitle="No hay resultados para esta busqueda."
          emptyCopy="Prueba otro termino o cambia el filtro de tema."
        />

        <UserSearchResults
          users={users}
          loading={usersLoading}
          error={usersError}
          followingUsername={followingUsername}
          onToggleFollow={handleToggleFollow}
        />
      </section>
    </main>
  );
}
