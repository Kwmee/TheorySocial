import { useDeferredValue, useEffect, useState } from "react";
import {
  createTheory as createTheoryRequest,
  fetchPopularTheories,
  fetchTheories,
  toggleFavoriteTheory as toggleFavoriteTheoryRequest,
  voteTheory as voteTheoryRequest,
} from "../services/api";
import { buildTopicOptions, enrichTheory, filterTheories } from "../services/theoryTopics";

export function useTheories() {
  const [theories, setTheories] = useState([]);
  const [popularTheories, setPopularTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [error, setError] = useState("");
  const [popularError, setPopularError] = useState("");
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

    async function loadPopular() {
      setPopularLoading(true);
      setPopularError("");

      try {
        const data = await fetchPopularTheories({ days: 7, limit: 12 });
        if (active) {
          setPopularTheories(data.map(enrichTheory));
        }
      } catch (requestError) {
        if (active) {
          setPopularError(requestError.message);
        }
      } finally {
        if (active) {
          setPopularLoading(false);
        }
      }
    }

    loadTheories();
    loadPopular();

    return () => {
      active = false;
    };
  }, []);

  const reloadPopularTheories = async () => {
    setPopularLoading(true);
    setPopularError("");

    try {
      const data = await fetchPopularTheories({ days: 7, limit: 12 });
      setPopularTheories(data.map(enrichTheory));
      return data;
    } catch (requestError) {
      setPopularError(requestError.message);
      throw requestError;
    } finally {
      setPopularLoading(false);
    }
  };

  const createTheory = async (payload) => {
    const created = enrichTheory(await createTheoryRequest(payload));
    setTheories((current) => [created, ...current]);
    return created;
  };

  const syncTheory = (updatedTheory) => {
    setTheories((current) =>
      current.map((theory) => (theory.id === updatedTheory.id ? updatedTheory : theory)),
    );
    setPopularTheories((current) =>
      current.map((theory) => (theory.id === updatedTheory.id ? updatedTheory : theory)),
    );
  };

  const voteTheory = async (theoryId, value) => {
    const updatedTheory = enrichTheory(await voteTheoryRequest(theoryId, value));
    syncTheory(updatedTheory);
    setPopularTheories((current) => current.filter((theory) => theory.id !== theoryId));
    void reloadPopularTheories().catch(() => {});
    return updatedTheory;
  };

  const favoriteTheory = async (theoryId) => {
    const updatedTheory = enrichTheory(await toggleFavoriteTheoryRequest(theoryId));
    syncTheory(updatedTheory);
    return updatedTheory;
  };

  const dismissPopularTheory = (theoryId) => {
    setPopularTheories((current) => current.filter((theory) => theory.id !== theoryId));
  };

  const topicOptions = buildTopicOptions(theories);
  const filteredTheories = filterTheories(theories, {
    topic: activeTopic,
    query: deferredSearchQuery,
  });

  return {
    theories,
    popularTheories,
    filteredTheories,
    topicOptions,
    activeTopic,
    setActiveTopic,
    searchQuery,
    setSearchQuery,
    loading,
    popularLoading,
    error,
    popularError,
    createTheory,
    voteTheory,
    favoriteTheory,
    dismissPopularTheory,
    reloadPopularTheories,
  };
}
