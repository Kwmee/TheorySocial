import { PopularTheoryDeck } from "../components/PopularTheoryDeck";
import { useAuth } from "../hooks/useAuth";
import { useTheories } from "../hooks/useTheories";

export function DiscoverPage() {
  const { user, completeSwipeTutorial } = useAuth();
  const { popularLoading, popularError, popularTheories, voteTheory } = useTheories();

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <PopularTheoryDeck
          theories={popularTheories}
          loading={popularLoading}
          error={popularError}
          onVote={voteTheory}
          tutorialSeen={Boolean(user?.swipeTutorialSeen)}
          onCompleteTutorial={completeSwipeTutorial}
        />
      </section>
    </main>
  );
}
