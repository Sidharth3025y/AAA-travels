import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  deletePackage,
  fetchPackages,
  savePackage,
} from "../../api/packages";
import {
  createAdmin,
  deleteBooking,
  deleteEnquiry,
  fetchBookings,
  fetchEnquiries,
  updateBookingStatus,
} from "../../api/services";
import { CATEGORIES, COUNTRIES } from "../../data/options";

const emptyForm = {
  name: "",
  summary: "",
  overview: "",
  highlights: "",
  itinerary: "",
  includes: "",
  duration: "",
  destination: "Nepal",
  category: "trekking",
  priceNpr: "",
  priceUsd: "",
  featured: false,
  image: null,
};

function formatWhen(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

/* ---------- shared class strings ---------- */
const inputBase =
  "w-full px-3.5 py-2.5 text-sm text-[#1a2332] bg-white border border-[#e6eaf0] rounded-xl " +
  "placeholder:text-[#9aa5b3] transition " +
  "focus:outline-none focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/12";

const labelBase =
  "flex flex-col gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5b6777]";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-4 disabled:opacity-55 disabled:cursor-not-allowed";

const btnPrimary =
  `${btnBase} bg-[#1d4ed8] text-white hover:bg-[#153e9e] focus:ring-[#1d4ed8]/25`;

const btnOutline =
  `${btnBase} border border-[#0f2744] bg-transparent text-[#0f2744] hover:bg-[#f6f4ef] focus:ring-[#0f2744]/15`;

const btnDanger =
  `${btnBase} bg-[#b42318] text-white hover:bg-[#8f1b12] focus:ring-[#b42318]/25`;

const btnLight =
  `${btnBase} bg-white text-[#0f2744] hover:bg-[#f6f4ef] focus:ring-white/40`;

const btnGhost =
  `${btnBase} border border-[#e6eaf0] bg-white text-[#0f2744] hover:bg-[#f6f4ef] focus:ring-[#0f2744]/10`;

const cardClass =
  "bg-white border border-[#e6eaf0] rounded-2xl shadow-[0_1px_2px_rgba(15,39,68,0.04),0_8px_24px_rgba(15,39,68,0.06)]";

const sectionTitleClass =
  "m-0 mb-5 text-xl font-serif font-bold tracking-tight text-[#0f2744]";

const tabIdle =
  "bg-transparent text-[#5b6777] hover:bg-[#f6f4ef] hover:text-[#0f2744]";
const tabActive =
  "bg-[#0f2744] text-white shadow-[0_4px_14px_rgba(15,39,68,0.28)]";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();

  const [tab, setTab] = useState("packages");
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [staff, setStaff] = useState({ name: "", email: "", password: "" });

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // NEW: controls whether the package form is visible
  const [showForm, setShowForm] = useState(false);

  const [deleteBookingId, setDeleteBookingId] = useState(null);

  const loadAll = async () => {
    const [pkgs, books, msgs] = await Promise.all([
      fetchPackages(),
      fetchBookings(),
      fetchEnquiries(),
    ]);
    setPackages(pkgs);
    setBookings(Array.isArray(books) ? books : []);
    setEnquiries(Array.isArray(msgs) ? msgs : []);
  };

  useEffect(() => {
    if (user?.role !== "admin") return undefined;
    loadAll().catch((err) =>
      setError(err.message || "Failed to load admin data")
    );
  }, [user]);

  if (loading)
    return (
      <p className="py-12 text-center text-sm text-[#5b6777]">Loading…</p>
    );

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login-page" replace />;
  }

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setForm((f) => ({ ...f, image: file }));
      setPreview(file ? URL.createObjectURL(file) : "");
      return;
    }
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onUpdateBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to update booking status");
    }
  };

  const onDeleteBooking = async (id) => {
    try {
      await deleteBooking(id);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to delete booking");
    }
  };

  const startEdit = (pkg) => {
    setEditingId(pkg._id);
    setForm({
      name: pkg.name,
      summary: pkg.summary || "",
      overview: pkg.overview || "",
      highlights: (pkg.highlights || []).join("\n"),
      itinerary: (pkg.itinerary || []).join("\n"),
      includes: (pkg.includes || []).join("\n"),
      duration: pkg.duration || pkg.days,
      destination: COUNTRIES.includes(pkg.destination)
        ? pkg.destination
        : "Nepal",
      category: pkg.category,
      priceNpr: pkg.priceNpr,
      priceUsd: pkg.priceUsd ?? pkg.price,
      featured: Boolean(pkg.featured),
      image: null,
    });
    setPreview(pkg.image || "");
    setTab("packages");
    setShowForm(true); // NEW: open the form when editing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
  };

  // NEW: close form + reset
  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value && editingId) return;
          if (value) data.append("image", value);
          return;
        }
        data.append(key, value);
      });
      await savePackage(data, editingId);
      setMessage(editingId ? "Package updated" : "Package added");
      resetForm();
      setShowForm(false); // NEW: hide after save
      await loadAll();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onDeletePkg = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    await deletePackage(id);
    await loadAll();
  };

  const onDeleteEnquiry = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((item) => item._id !== id));
    loadAll();
  };

  const onAddAdmin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await createAdmin(staff);
      setStaff({ name: "", email: "", password: "" });
      setMessage("New admin added. They can log in at /admin-login-page");
    } catch (err) {
      setError(err.message || "Could not add admin");
    } finally {
      setBusy(false);
    }
  };

  const stats = [
    { label: "Packages", value: packages.length, hint: "Live listings" },
    { label: "Bookings", value: bookings.length, hint: "All-time" },
    {
      label: "Pending",
      value: bookings.filter((b) => (b.status || "Pending") === "Pending").length,
      hint: "Needs review",
    },
    { label: "Enquiries", value: enquiries.length, hint: "Messages" },
  ];

  const tabs = [
    { id: "packages", label: "Packages" },
    { id: "bookings", label: "Bookings" },
    { id: "enquiries", label: "Enquiries" },
    { id: "admins", label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f2744] text-white">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#c9a227]/60 bg-[#0f2744] font-serif text-lg font-bold text-[#c9a227]">
              A
            </div>
            <div className="leading-tight">
              <h1 className="m-0 font-serif text-lg font-bold tracking-tight">
                Admin dashboard
              </h1>
              <p className="m-0 text-xs text-white/70">
                {user.name} · {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Signed in
            </span>
            <button type="button" onClick={logout} className={btnLight}>
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="mx-auto max-w-[1180px] px-5 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`${cardClass} p-5`}>
              <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#5b6777]">
                {s.label}
              </p>
              <p className="m-0 mt-2 font-serif text-3xl font-bold text-[#0f2744]">
                {s.value}
              </p>
              <p className="m-0 mt-1 text-xs text-[#9aa5b3]">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-[#e6eaf0] bg-white p-1 shadow-sm">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${tab === id ? tabActive : tabIdle}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {message && (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <span aria-hidden>✓</span> {message}
          </p>
        )}
        {error && (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-[#b42318]">
            <span aria-hidden>⚠</span> {error}
          </p>
        )}

        {/* ================= PACKAGES ================= */}
        {tab === "packages" && (
          <>
            {/* Toggle bar: shows "Add new package" when form is hidden,
                or the full-width form when visible */}
            {!showForm ? (
              <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
                <h2 className={sectionTitleClass}>Existing packages</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className={btnPrimary}
                >
                  + Add new package
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSave}
                className={`${cardClass} mb-9 flex w-full flex-col gap-5 p-7 md:p-9`}
              >
                {/* Form header with cancel on the right */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e6eaf0] pb-4">
                  <div>
                    <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#c9a227]">
                      {editingId ? "Editing" : "New listing"}
                    </p>
                    <h2 className="m-0 mt-1 text-xl font-serif font-bold text-[#0f2744]">
                      {editingId ? "Update package" : "Add package"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeForm}
                    className={btnGhost}
                  >
                    Cancel
                  </button>
                </div>

                {/* Two-column layout on large screens for a
                    "full screen" feel without stretching fields too wide */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
                  {/* Left column */}
                  <div className="flex flex-col gap-5">
                    <label className={labelBase}>
                      Package name
                      <input
                        name="name"
                        required
                        placeholder="Everest Base Camp Trek"
                        value={form.name}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <label className={labelBase}>
                      Description
                      <textarea
                        name="overview"
                        required
                        rows={5}
                        placeholder="Full package description"
                        value={form.overview}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <label className={labelBase}>
                      Short summary (optional)
                      <textarea
                        name="summary"
                        rows={3}
                        placeholder="Shown on package cards"
                        value={form.summary}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <label className={labelBase}>
                        Days
                        <input
                          name="duration"
                          type="number"
                          min="1"
                          required
                          placeholder="12"
                          value={form.duration}
                          onChange={onChange}
                          className={inputBase}
                        />
                      </label>
                      <label className={labelBase}>
                        Price (USD)
                        <input
                          name="priceUsd"
                          type="number"
                          min="0"
                          required
                          placeholder="1290"
                          value={form.priceUsd}
                          onChange={onChange}
                          className={inputBase}
                        />
                      </label>
                      <label className={labelBase}>
                        Price (NPR)
                        <input
                          name="priceNpr"
                          type="number"
                          min="0"
                          required
                          placeholder="175000"
                          value={form.priceNpr}
                          onChange={onChange}
                          className={inputBase}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className={labelBase}>
                        Country
                        <select
                          name="destination"
                          required
                          value={form.destination}
                          onChange={onChange}
                          className={inputBase}
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className={labelBase}>
                        Category
                        <select
                          name="category"
                          required
                          value={form.category}
                          onChange={onChange}
                          className={inputBase}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className={labelBase}>
                      Package image{" "}
                      {editingId && (
                        <span className="font-normal normal-case tracking-normal text-[#9aa5b3]">
                          (leave empty to keep current)
                        </span>
                      )}
                      <input
                        name="image"
                        type="file"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={onChange}
                        required={!editingId}
                        className="text-sm text-[#5b6777] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#f6f4ef] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#0f2744] hover:file:bg-[#e6eaf0]"
                      />
                    </label>

                    {preview && (
                      <img
                        src={preview}
                        alt=""
                        className="max-h-60 w-full rounded-xl border border-[#e6eaf0] object-cover"
                      />
                    )}
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col gap-5">
                    <label className={labelBase}>
                      Highlights (one per line)
                      <textarea
                        name="highlights"
                        rows={6}
                        value={form.highlights}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <label className={labelBase}>
                      Itinerary (one per line)
                      <textarea
                        name="itinerary"
                        rows={6}
                        value={form.itinerary}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <label className={labelBase}>
                      What's included (one per line)
                      <textarea
                        name="includes"
                        rows={6}
                        value={form.includes}
                        onChange={onChange}
                        className={inputBase}
                      />
                    </label>

                    <label className="flex cursor-pointer flex-row items-center gap-2.5 rounded-xl border border-[#e6eaf0] bg-[#f6f4ef] px-4 py-3 text-sm font-medium normal-case tracking-normal text-[#1a2332]">
                      <input
                        name="featured"
                        type="checkbox"
                        checked={form.featured}
                        onChange={onChange}
                        className="h-4 w-4 cursor-pointer accent-[#1d4ed8]"
                      />
                      Show in popular packages
                    </label>
                  </div>
                </div>

                {/* Sticky-feeling action row at the bottom */}
                <div className="mt-2 flex flex-wrap justify-end gap-3 border-t border-[#e6eaf0] pt-5">
                  <button
                    type="button"
                    onClick={closeForm}
                    className={btnOutline}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className={btnPrimary}
                  >
                    {busy
                      ? "Saving…"
                      : editingId
                        ? "Update package"
                        : "Add package"}
                  </button>
                </div>
              </form>
            )}

            {/* Packages grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <article
                  key={pkg._id}
                  className={`${cardClass} flex flex-col overflow-hidden transition hover:shadow-[0_8px_30px_rgba(15,39,68,0.12)]`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {pkg.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#c9a227] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="m-0 font-serif text-base font-bold text-[#0f2744]">
                      {pkg.name}
                    </h3>
                    <p className="m-0 text-xs text-[#5b6777]">
                      {pkg.destination} · {pkg.days} days · US$ {pkg.priceUsd}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(pkg)}
                        className={`${btnPrimary} px-4 py-1.5 text-xs`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePkg(pkg._id)}
                        className={`${btnGhost} px-4 py-1.5 text-xs`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* ================= BOOKINGS ================= */}
        {tab === "bookings" && (
          <div className={`${cardClass} overflow-hidden`}>
            {bookings.length === 0 ? (
              <p className="m-4 rounded-xl border border-dashed border-[#e6eaf0] px-6 py-12 text-center text-[#5b6777]">
                No bookings yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead className="bg-[#f6f4ef]">
                    <tr>
                      {[
                        "Date & time",
                        "Type",
                        "Details",
                        "Travel date",
                        "Pax",
                        "Contact",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap border-b border-[#e6eaf0] px-4 py-3.5 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5b6777]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b._id}
                        className="border-b border-[#e6eaf0] transition last:border-b-0 hover:bg-[#faf9f5]"
                      >
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {formatWhen(b.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {b.serviceType}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {b.serviceTitle}
                          {b.from && b.to ? ` (${b.from} → ${b.to})` : ""}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {formatWhen(b.date)}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {b.people}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {b.guestName || b.user?.name || "—"}
                          <br />
                          <span className="text-[#5b6777]">
                            {b.contact}
                            {b.guestEmail || b.user?.email
                              ? ` · ${b.guestEmail || b.user?.email}`
                              : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          <select
                            value={b.status || "Pending"}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "Delete") {
                                setDeleteBookingId(b._id);
                                return;
                              }
                              onUpdateBookingStatus(b._id, value);
                            }}
                            className="cursor-pointer rounded-lg border border-[#e6eaf0] bg-white px-2.5 py-1.5 text-sm font-semibold text-[#1a2332] transition hover:border-[#1d4ed8] focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-[#1d4ed8]/12"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                            <option value="Delete">Delete</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= ENQUIRIES ================= */}
        {tab === "enquiries" && (
          <div className={`${cardClass} overflow-hidden`}>
            {enquiries.length === 0 ? (
              <p className="m-4 rounded-xl border border-dashed border-[#e6eaf0] px-6 py-12 text-center text-[#5b6777]">
                No enquiries yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead className="bg-[#f6f4ef]">
                    <tr>
                      {[
                        "Date & time",
                        "Name",
                        "Email",
                        "Phone",
                        "Package",
                        "Message",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap border-b border-[#e6eaf0] px-4 py-3.5 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5b6777]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((m) => (
                      <tr
                        key={m._id}
                        className="border-b border-[#e6eaf0] transition last:border-b-0 hover:bg-[#faf9f5]"
                      >
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {formatWhen(m.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {m.name}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {m.email}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {m.phone || "—"}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {m.packageTitle || "General"}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm text-[#1a2332]">
                          {m.message}
                        </td>
                        <td className="px-4 py-3.5 align-top text-sm">
                          <button
                            type="button"
                            onClick={() => onDeleteEnquiry(m._id)}
                            className={`${btnGhost} px-4 py-1.5 text-xs`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= ADMINS ================= */}
        {tab === "admins" && (
          <form
            onSubmit={onAddAdmin}
            className={`${cardClass} flex max-w-3xl flex-col gap-4 p-7`}
          >
            <div className="border-b border-[#e6eaf0] pb-4">
              <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#c9a227]">
                Team access
              </p>
              <h2 className="m-0 mt-1 text-lg font-serif font-bold text-[#0f2744]">
                Add another admin
              </h2>
              <p className="m-0 mt-1 text-sm text-[#5b6777]">
                They'll be able to log in at{" "}
                <code className="rounded bg-[#f6f4ef] px-1.5 py-0.5 text-xs text-[#0f2744]">
                  /admin-login-page
                </code>{" "}
                and manage the site.
              </p>
            </div>

            <label className={labelBase}>
              Full name
              <input
                name="name"
                required
                placeholder="Full name"
                value={staff.name}
                onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                className={inputBase}
              />
            </label>

            <label className={labelBase}>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                value={staff.email}
                onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                className={inputBase}
              />
            </label>

            <label className={labelBase}>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Temporary password"
                value={staff.password}
                onChange={(e) =>
                  setStaff({ ...staff, password: e.target.value })
                }
                className={inputBase}
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className={`${btnPrimary} self-start`}
            >
              {busy ? "Saving…" : "Add admin"}
            </button>
          </form>
        )}
      </main>

      {/* ================= DELETE BOOKING MODAL ================= */}
      {deleteBookingId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f2744]/55 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl shadow-black/30">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-2xl">
              <span aria-hidden>🗑</span>
            </div>
            <h2 className="m-0 mb-2 font-serif text-xl font-bold text-[#0f2744]">
              Delete booking?
            </h2>
            <p className="m-0 mb-6 text-sm leading-relaxed text-[#5b6777]">
              This will permanently remove the booking.
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteBookingId(null)}
                className={btnOutline}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteBooking(deleteBookingId);
                  setDeleteBookingId(null);
                }}
                className={btnDanger}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}