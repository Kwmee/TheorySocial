import { useEffect, useState } from "react";
import { createTheory as createTheoryRequest, fetchTheories } from "../services/api";

export function useTheories() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTheories() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTheories();
        if (active) {
          setTheories(data);
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
    const created = await createTheoryRequest(payload);
    setTheories((current) => [created, ...current]);
    return created;
  };

  return {
    theories,
    loading,
    error,
    createTheory,
  };
}
