import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminSetup, loginAdmin, registerAdmin } from "../../api/services";

export default function AdminLoginPage() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetchAdminSetup()
      .then((data) => {
        if (data.needsSetup) {
          setNeedsSetup(true);
          setMode("register");
        }
      })
      .catch(() => { });
  }, []);

  if (!loading && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        const data = await registerAdmin({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setUser(data.user);
        navigate("/admin", { replace: true });
        return;
      }
      const data = await loginAdmin({ email: form.email, password: form.password });
      setUser(data.user);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e6eaf0] bg-white px-3.5 py-3 text-sm text-[#1a2332] placeholder:text-[#9aa5b3] transition focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-[#1d4ed8]/15";

  const labelClass =
    "flex flex-col gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#5b6777]";

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0f2744] p-6">
      {/* Decorative background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 15% 20%, rgba(29,78,216,0.35), transparent 55%), radial-gradient(500px circle at 85% 80%, rgba(201,162,39,0.22), transparent 55%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#c9a227]/60 bg-[#0f2744] font-serif text-lg font-bold text-[#c9a227]">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <strong className="font-serif text-[1.05rem] font-bold tracking-tight text-white">
              Admin Portal
            </strong>
            <em className="text-[0.68rem] uppercase not-italic tracking-[0.16em] text-[#c5d0de]">
              Secure access
            </em>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e6eaf0] bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-9">
          <div className="mb-6">
            <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#c9a227]">
              {needsSetup ? "First-time setup" : "Welcome back"}
            </p>
            <h1 className="m-0 mb-2 font-serif text-2xl font-bold tracking-tight text-[#0f2744]">
              {needsSetup ? "Create admin account" : "Sign in"}
            </h1>
            <p className="m-0 text-sm leading-relaxed text-[#5b6777]">
              {needsSetup
                ? "Set up the first administrator. You'll be taken straight to the dashboard."
                : "Sign in to manage packages, bookings, and enquiries."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <label className={labelClass}>
                Full name
                <input
                  name="name"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={onChange}
                  className={inputClass}
                />
              </label>
            )}

            <label className={labelClass}>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={onChange}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                className={inputClass}
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#153e9e] focus:outline-none focus:ring-4 focus:ring-[#1d4ed8]/25 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Log in"
                  : "Create admin and continue"}
            </button>

            {error && (
              <p
                role="alert"
                className="m-0 flex items-center gap-2 rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]"
              >
                <span aria-hidden>⚠</span> {error}
              </p>
            )}

            {!needsSetup && (
              <>
                <div className="my-1 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#9aa5b3]">
                  <span className="h-px flex-1 bg-[#e6eaf0]" />
                  <em className="not-italic">or</em>
                  <span className="h-px flex-1 bg-[#e6eaf0]" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-[#0f2744] bg-transparent px-5 py-2.5 text-sm font-bold text-[#0f2744] transition hover:bg-[#f6f4ef]"
                >
                  {mode === "login"
                    ? "Need the first admin account?"
                    : "Already registered? Log in"}
                </button>
              </>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-[0.7rem] uppercase tracking-[0.16em] text-[#c5d0de]">
          Protected area · Authorized personnel only
        </p>
      </div>
    </div>
  );
}