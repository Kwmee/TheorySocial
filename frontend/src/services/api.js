const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.message ?? `API request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function fetchCurrentUser() {
  return request("/auth/me");
}

export function signup(payload) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function acceptTerms() {
  return request("/auth/terms/accept", {
    method: "POST",
  });
}

export function fetchTheories() {
  return request("/theories");
}

export function fetchPopularTheories(options = {}) {
  const search = new URLSearchParams();

  if (options.days) {
    search.set("days", options.days);
  }

  if (options.limit) {
    search.set("limit", options.limit);
  }

  const suffix = search.size > 0 ? `?${search.toString()}` : "";
  return request(`/theories/popular${suffix}`);
}

export function createTheory(payload) {
  return request("/theories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function voteTheory(theoryId, value) {
  return request(`/theories/${theoryId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value }),
  });
}

export function completeSwipeTutorial() {
  return request("/users/me/tutorials/swipe/complete", {
    method: "POST",
  });
}
