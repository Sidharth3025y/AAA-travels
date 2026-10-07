export function parseLines(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(name) {
  const base = String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "package";
}

export async function uniqueSlug(Model, name, excludeId) {
  const base = slugify(name);
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.findOne(query).select("_id");
    if (!exists) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}
