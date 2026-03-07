import { useDeferredValue, useEffect, useState } from "react";
import {
  createTheory as createTheoryRequest,
  fetchTheories,
  voteTheory as voteTheoryRequest,
} from "../services/api";
import { buildTopicOptions, enrichTheory, filterTheories } from "../services/theoryTopics";

export function useTheories() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    let active = true;

    async function loadTheories() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTheories();
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

    loadTheories();

    return () => {
      active = false;
    };
  }, []);

  const createTheory = async (payload) => {
    const created = enrichTheory(await createTheoryRequest(payload));
    setTheories((current) => [created, ...current]);
    return created;
  };

  const voteTheory = async (theoryId, value) => {
    const updatedTheory = enrichTheory(await voteTheoryRequest(theoryId, value));
    setTheories((current) =>
      current.map((theory) => (theory.id === theoryId ? updatedTheory : theory)),
    );
    return updatedTheory;
  };

  const topicOptions = buildTopicOptions(theories);
  const filteredTheories = filterTheories(theories, {
    topic: activeTopic,
    query: deferredSearchQuery,
  });

  return {
    theories,
    filteredTheories,
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    createTheory,
    voteTheory,
  };
}
