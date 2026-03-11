const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
const API_ORIGIN = API_URL.replace(/\/api$/, "");

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: isFormData
      ? { ...(options.headers ?? {}) }
      : {
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

export function resolveAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function fetchUserProfile(username) {
  return request(`/users/${encodeURIComponent(username)}`);
}

export function fetchUserSuggestions() {
  return request("/users/suggestions");
}

export function searchUsers(query) {
  return request(`/users/find?q=${encodeURIComponent(query)}`);
}

export function followUser(username) {
  return request(`/users/${encodeURIComponent(username)}/follow`, {
    method: "POST",
  });
}

export function unfollowUser(username) {
  return request(`/users/${encodeURIComponent(username)}/follow`, {
    method: "DELETE",
  });
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

export function fetchTheoryById(theoryId) {
  return request(`/theories/${theoryId}`);
}

export function fetchMyTheories() {
  return request("/theories/me");
}

export function fetchFavoriteTheories() {
  return request("/theories/favorites");
}

export function fetchFollowingTheories() {
  return request("/theories/following");
}

export function fetchTheoriesByUsername(username) {
  return request(`/theories/by-user/${encodeURIComponent(username)}`);
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

export function fetchTopTheories(options = {}) {
  const search = new URLSearchParams();

  if (options.limit) {
    search.set("limit", options.limit);
  }

  const suffix = search.size > 0 ? `?${search.toString()}` : "";
  return request(`/theories/top${suffix}`);
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

export function toggleFavoriteTheory(theoryId) {
  return request(`/theories/${theoryId}/favorite`, {
    method: "POST",
  });
}

export function deleteTheory(theoryId) {
  return request(`/theories/${theoryId}`, {
    method: "DELETE",
  });
}

export function updateTheory(theoryId, payload) {
  return request(`/theories/${theoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchTheoryResponses(theoryId) {
  return request(`/theories/${theoryId}/responses`);
}

export function createTheoryResponse(theoryId, payload) {
  return request(`/theories/${theoryId}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function voteTheoryResponse(responseId, value) {
  return request(`/responses/${responseId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value }),
  });
}

export function updateTheoryResponse(responseId, payload) {
  return request(`/responses/${responseId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTheoryResponse(responseId) {
  return request(`/responses/${responseId}`, {
    method: "DELETE",
  });
}

export function completeSwipeTutorial() {
  return request("/users/me/tutorials/swipe/complete", {
    method: "POST",
  });
}

export function updateProfileImage(profileImageUrl) {
  return request("/users/me/profile-image", {
    method: "PUT",
    body: JSON.stringify({ profileImageUrl }),
  });
}

export function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/users/me/profile-image/upload", {
    method: "POST",
    body: formData,
  });
}

export function updateMyProfile(payload) {
  return request("/users/me/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function pinMyTheory(theoryId) {
  return request(`/users/me/pinned-theory/${theoryId}`, {
    method: "PUT",
  });
}

export function unpinMyTheory() {
  return request("/users/me/pinned-theory", {
    method: "DELETE",
  });
}

export function fetchNotifications() {
  return request("/notifications");
}

export function fetchUnreadNotificationCount() {
  return request("/notifications/unread-count");
}

export function markNotificationRead(notificationId) {
  return request(`/notifications/${notificationId}/read`, {
    method: "POST",
  });
}

export function markAllNotificationsRead() {
  return request("/notifications/read-all", {
    method: "POST",
  });
}
