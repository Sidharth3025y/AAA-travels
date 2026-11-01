import { apiFetch, apiUrl, authHeaders, mediaUrl } from "./client";

export function normalizePackage(pkg) {
  if (!pkg) return null;
  const overview = pkg.overview || "";
  return {
    id: pkg.slug || pkg._id,
    _id: pkg._id,
    slug: pkg.slug,
    title: pkg.name,
    name: pkg.name,
    summary: pkg.summary || overview.slice(0, 160),
    overview,
    highlights: pkg.highlights || [],
    itinerary: pkg.itinerary || [],
    includes: pkg.includes || [],
    days: pkg.duration,
    duration: pkg.duration,
    destination: pkg.destination,
    country: pkg.destination,
    category: pkg.category,
    price: pkg.priceUsd,
    priceUsd: pkg.priceUsd,
    priceNpr: pkg.priceNpr,
    image: mediaUrl(pkg.image),
    featured: Boolean(pkg.featured),
  };
}

export async function fetchPackages() {
  const list = await apiFetch("/api/packages");
  return (Array.isArray(list) ? list : []).map(normalizePackage);
}

export async function fetchPackage(id) {
  const pkg = await apiFetch(`/api/packages/${id}`);
  return normalizePackage(pkg);
}

export function filterPackages(
  packages,
  { category, duration, destination, q } = {},
) {
  return packages.filter((p) => {
    if (category && category !== "all" && p.category !== category) return false;
    if (destination && destination !== "all" && p.destination !== destination)
      return false;
    if (duration && duration !== "all") {
      if (duration === "1-3" && (p.days < 1 || p.days > 3)) return false;
      if (duration === "4-7" && (p.days < 4 || p.days > 7)) return false;
      if (duration === "8-12" && (p.days < 8 || p.days > 12)) return false;
      if (duration === "13+" && p.days < 13) return false;
    }
    if (q) {
      const s = q.toLowerCase();
      const hay =
        `${p.id} ${p.title} ${p.destination} ${p.summary}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
}

export async function savePackage(formData, id) {
  const path = id ? `/api/packages/${id}` : "/api/packages";
  const res = await fetch(apiUrl(path), {
    method: id ? "PUT" : "POST",
    credentials: "include",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || "Failed to save package");
  return data;
}

export function deletePackage(id) {
  return apiFetch(`/api/packages/${id}`, { method: "DELETE" });
}
