const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://aaa-travels-m9tq.onrender.com")
).replace(/\/+$/, "");
const AUTH_TOKEN_KEY = "aaa-travels-admin-token";

export function saveAuthToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function authHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiUrl(path) {
  if (!path) return API_BASE;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

// Handles token expiry: if JWT expires (2 hours), auto-logout
export async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...options.headers,
    },
  });

  // If token expired (401), clear it and throw for handler to redirect
  if (res.status === 401) {
    clearAuthToken();
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.msg || data.message || "Request failed");
  }
  return data;
}

export function mediaUrl(src) {
  if (!src) return "";
  if (
    src.startsWith("http") ||
    src.startsWith("blob:") ||
    src.startsWith("data:")
  )
    return src;
  return apiUrl(src);
}