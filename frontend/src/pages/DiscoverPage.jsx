import { PopularTheoryDeck } from "../components/PopularTheoryDeck";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function DiscoverPage() {
  const { user, completeSwipeTutorial } = useAuth();
  const {
    popularLoading,
    popularError,
    popularTheories,
    voteTheory,
    favoriteTheory,
    dismissPopularTheory,
  } = useTheories();

  const handleFavoriteFromDiscover = async (theory) => {
    let updatedTheory = theory;

    if (!theory.bookmarked) {
      updatedTheory = await favoriteTheory(theory.id);
    }

    dismissPopularTheory(theory.id);
    return {
      ...updatedTheory,
      bookmarked: true,
    };
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <PopularTheoryDeck
          theories={popularTheories}
          loading={popularLoading}
          error={popularError}
          onVote={voteTheory}
          onFavorite={handleFavoriteFromDiscover}
          tutorialSeen={Boolean(user?.swipeTutorialSeen)}
          onCompleteTutorial={completeSwipeTutorial}
        />
      </section>
    </main>
  );
}
