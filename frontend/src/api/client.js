const API_BASE = "https://aaa-travels-m9tq.onrender.com";

export function apiUrl(path) {
  if (!path) return API_BASE;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

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
