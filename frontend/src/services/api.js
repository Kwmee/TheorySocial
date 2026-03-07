const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchTheories() {
  return request("/theories");
}

export function createTheory(payload) {
  return request("/theories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
