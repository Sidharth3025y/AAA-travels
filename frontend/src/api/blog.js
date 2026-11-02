import { apiFetch, apiUrl, authHeaders, mediaUrl } from "./client";

function normalizeBlogPost(post) {
  return { ...post, image: mediaUrl(post.image) };
}

export async function fetchBlogPosts() {
  const list = await apiFetch("/api/blogs");
  return Array.isArray(list) ? list.map(normalizeBlogPost) : [];
}

export async function fetchAdminBlogPosts() {
  const list = await apiFetch("/api/blogs/admin");
  return Array.isArray(list) ? list.map(normalizeBlogPost) : [];
}

export async function fetchBlogPost(id) {
  const blog = await apiFetch(`/api/blogs/${id}`);
  return normalizeBlogPost(blog);
}

export async function saveBlogPost(blogData, id) {
  const path = id ? `/api/blogs/${id}` : "/api/blogs";
  const formData = new FormData();
  Object.entries(blogData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) formData.append(key, value);
  });
  const res = await fetch(apiUrl(path), {
    method: id ? "PUT" : "POST",
    credentials: "include",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || "Failed to save blog post");
  return data;
}

export function deleteBlogPost(id) {
  return apiFetch(`/api/blogs/${id}`, { method: "DELETE" });
}