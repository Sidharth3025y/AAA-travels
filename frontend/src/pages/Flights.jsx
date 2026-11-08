import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { bookFlight } from "../api/services";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaExchangeAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeadset,
} from "react-icons/fa";

/* ============ Tokens ============ */
const C = {
  white: "#ffffff",
  cream: "#fdfaed",
  butter: "#ffed9b",
  gold: "#bc9d2c",
  goldDark: "#7a5f14",
  ink: "#1f1f1f",
  body: "#3a3626",
  muted: "#8a8676",
  line: "#efe9cf",
  lineStrong: "#e6d9a3",
  dark: "#0b1b30",
  darkSoft: "#122c4d",
};

const emptyForm = {
  guestName: "",
  guestEmail: "",
  contact: "",
  from: "",
  to: "",
  date: "",
  people: 1,
};

/* ============ Keyframes ============ */
const KEY_ID = "aa-flights-kf";
function useFlightsKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaFlUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaFlFly {
        from { transform: translateX(-20%) translateY(4px); opacity: 0; }
        to   { transform: translateX(20%) translateY(-4px); opacity: 1; }
      }
      .aa-fl-input:focus {
        border-color: #bc9d2c !important;
        box-shadow: 0 0 0 4px rgba(188,157,44,0.15) !important;
        outline: none !important;
      }
      .aa-fl-input::placeholder {
        color: #a39c86;
      }
      .aa-fl-input[type="date"] {
        color-scheme: light;
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(el);
  }, []);
}

/* ============ In-view reveal ============ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, seen] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============ Main ============ */
export default function Flights() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [btnHover, setBtnHover] = useState(false);
  const [termsHover, setTermsHover] = useState(false);

  useFlightsKeyframes();

  const today = new Date().toISOString().split("T")[0];
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await bookFlight(form);
      setStatus("ok");
      setForm(emptyForm);
      setAgreed(false);
    } catch {
      setStatus("err");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1px solid ${C.line}`,
    background: "#fff",
    color: C.ink,
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: C.gold,
  };

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ============ HERO ============ */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 20px 60px",
          background: `linear-gradient(180deg, ${C.dark} 0%, ${C.darkSoft} 100%)`,
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px circle at 15% 20%, rgba(201,162,39,0.18), transparent 60%), radial-gradient(520px circle at 85% 80%, rgba(255,237,155,0.14), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Animated plane trail */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "20%",
            right: "8%",
            color: C.butter,
            fontSize: "28px",
            opacity: 0.35,
            animation: "aaFlFly 6s ease-in-out infinite alternate",
          }}
        >
          <FaPlaneDeparture />
        </div>

        <div
          style={{
            position: "relative",
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(255,237,155,0.14)",
              border: "1px solid rgba(255,237,155,0.4)",
              color: C.butter,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0,
              animation: "aaFlUp 600ms cubic-bezier(0.22,1,0.36,1) 60ms forwards",
            }}
          >
            <FaPlaneDeparture aria-hidden="true" />
            International flight booking
          </p>
          <h1
            style={{
              margin: "0 0 12px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(30px, 4.6vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "#fff",
              opacity: 0,
              animation: "aaFlUp 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
            }}
          >
            {t("flights.title")}
          </h1>
          <p
            style={{
              margin: "0 auto",
              maxWidth: "560px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
              opacity: 0,
              animation: "aaFlUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
            }}
          >
            {t("flights.subtitle")}
          </p>
        </div>
      </header>

      {/* ============ FORM + HELP ============ */}
      <section style={{ padding: "56px 20px 80px" }}>
        <div
          className="aa-flights-grid"
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Form card */}
          <Reveal>
            <div
              style={{
                background: "#fff",
                border: `1px solid ${C.line}`,
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 20px 40px -28px rgba(122,95,20,0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: C.cream,
                    border: `1px solid ${C.lineStrong}`,
                    color: C.goldDark,
                    fontSize: "16px",
                  }}
                >
                  <FaPlaneDeparture />
                </span>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: C.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Book your flight
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: C.body }}>
                    Fill in your trip details and we'll get back with options.
                  </p>
                </div>
              </div>

              <div style={{ height: "1px", background: C.line, margin: "20px 0 24px" }} />

              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Passenger */}
                <div
                  className="aa-fl-two"
                  style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}
                >
                  <label style={labelStyle}>
                    Passenger
                    <input
                      className="aa-fl-input"
                      name="guestName"
                      required
                      placeholder={t("enquire.name")}
                      value={form.guestName}
                      onChange={onChange}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Email
                    <input
                      className="aa-fl-input"
                      name="guestEmail"
                      type="email"
                      required
                      placeholder={t("enquire.email")}
                      value={form.guestEmail}
                      onChange={onChange}
                      style={inputStyle}
                    />
                  </label>
                </div>

                <label style={labelStyle}>
                  Contact number
                  <input
                    className="aa-fl-input"
                    name="contact"
                    required
                    placeholder={t("enquire.phone")}
                    value={form.contact}
                    onChange={onChange}
                    style={inputStyle}
                  />
                </label>

                {/* From / To */}
                <div
                  className="aa-fl-fromto"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "14px",
                    alignItems: "end",
                  }}
                >
                  <label style={labelStyle}>
                    From
                    <div style={{ position: "relative" }}>
                      <input
                        className="aa-fl-input"
                        name="from"
                        required
                        placeholder={t("flights.from")}
                        value={form.from}
                        onChange={onChange}
                        style={{ ...inputStyle, paddingLeft: "42px" }}
                      />
                      <FaPlaneDeparture
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: C.gold,
                          fontSize: "13px",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </label>

                  <div
                    aria-hidden="true"
                    className="aa-fl-swap"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "36px",
                      height: "36px",
                      margin: "0 auto",
                      borderRadius: "999px",
                      background: C.cream,
                      border: `1px solid ${C.lineStrong}`,
                      color: C.goldDark,
                      fontSize: "12px",
                    }}
                  >
                    <FaExchangeAlt />
                  </div>

                  <label style={labelStyle}>
                    To
                    <div style={{ position: "relative" }}>
                      <input
                        className="aa-fl-input"
                        name="to"
                        required
                        placeholder={t("flights.to")}
                        value={form.to}
                        onChange={onChange}
                        style={{ ...inputStyle, paddingLeft: "42px" }}
                      />
                      <FaPlaneArrival
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: C.gold,
                          fontSize: "13px",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </label>
                </div>

                {/* Date / People */}
                <div
                  className="aa-fl-two"
                  style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}
                >
                  <label style={labelStyle}>
                    Departure date
                    <div style={{ position: "relative" }}>
                      <input
                        className="aa-fl-input"
                        name="date"
                        type="date"
                        required
                        value={form.date}
                        min={today}
                        onChange={onChange}
                        style={{ ...inputStyle, paddingLeft: "42px" }}
                      />
                      <FaCalendarAlt
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: C.gold,
                          fontSize: "13px",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </label>

                  <label style={labelStyle}>
                    Passengers
                    <div style={{ position: "relative" }}>
                      <input
                        className="aa-fl-input"
                        name="people"
                        type="number"
                        min="1"
                        required
                        placeholder={t("flights.pax")}
                        value={form.people}
                        onChange={onChange}
                        style={{ ...inputStyle, paddingLeft: "42px" }}
                      />
                      <FaUserFriends
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: C.gold,
                          fontSize: "13px",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </label>
                </div>

                {/* Terms */}
                <label
                  onMouseEnter={() => setTermsHover(true)}
                  onMouseLeave={() => setTermsHover(false)}
                  style={{
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: C.body,
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: termsHover ? C.cream : "transparent",
                    border: `1px dashed ${termsHover ? C.gold : C.line}`,
                    transition: "background 200ms ease, border-color 200ms ease",
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      marginTop: "3px",
                      flexShrink: 0,
                      cursor: "pointer",
                      accentColor: C.gold,
                    }}
                  />
                  <span>
                    {t("enquire.terms")}{" "}
                    <Link
                      to="/terms-conditions"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: C.goldDark,
                        fontWeight: 700,
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      {t("enquire.termsLink")}
                    </Link>{" "}
                    {t("enquire.and")}{" "}
                    <Link
                      to="/privacy-policy"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: C.goldDark,
                        fontWeight: 700,
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                      }}
                    >
                      {t("enquire.privacyLink")}
                    </Link>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    marginTop: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minHeight: "52px",
                    padding: "14px 24px",
                    borderRadius: "999px",
                    background: loading ? C.ink : btnHover ? C.gold : C.ink,
                    color: "#fff",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    boxShadow: btnHover
                      ? "0 16px 30px -14px rgba(188,157,44,0.65)"
                      : "0 10px 22px -12px rgba(31,31,31,0.55)",
                    transform: btnHover && !loading ? "translateY(-2px)" : "translateY(0)",
                    transition:
                      "background 220ms ease, box-shadow 220ms ease, transform 220ms ease",
                  }}
                >
                  {loading ? t("contact.sending") : t("flights.submit")}
                  {!loading && <FaPaperPlane aria-hidden="true" style={{ fontSize: "12px" }} />}
                </button>

                {status === "ok" && (
                  <p
                    role="status"
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      color: "#047857",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <FaCheckCircle aria-hidden="true" />
                    {t("flights.success")}
                  </p>
                )}
                {status === "err" && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: "#fef3f2",
                      border: "1px solid #fecdca",
                      color: "#b42318",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <FaExclamationTriangle aria-hidden="true" />
                    {t("contact.error")}
                  </p>
                )}
              </form>
            </div>
          </Reveal>

          {/* Help card */}
          <Reveal delay={140}>
            <aside
              style={{
                background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkSoft} 100%)`,
                color: "#fff",
                border: `1px solid ${C.darkSoft}`,
                borderRadius: "24px",
                padding: "32px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 44px -24px rgba(11,27,48,0.35)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(360px circle at 100% 0%, rgba(201,162,39,0.24), transparent 60%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(255,237,155,0.16)",
                    border: `1px solid rgba(255,237,155,0.4)`,
                    color: C.butter,
                    fontSize: "20px",
                    marginBottom: "18px",
                  }}
                >
                  <FaHeadset />
                </span>

                <h3
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "#fff",
                    lineHeight: 1.2,
                  }}
                >
                  {t("flights.helpTitle")}
                </h3>
                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: "14.5px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {t("flights.helpBody")}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    margin: "0 0 22px",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {[
                    "Best available fares at the time of booking",
                    "Visa and transit guidance on request",
                    "24/7 support for schedule changes",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "13.5px",
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <FaCheckCircle
                        aria-hidden="true"
                        style={{
                          color: C.butter,
                          fontSize: "12px",
                          flexShrink: 0,
                          marginTop: "3px",
                        }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div
                  aria-hidden="true"
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.14)",
                    margin: "0 0 18px",
                  }}
                />

                <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255,255,255,0.6)" }}>
                  Prefer to talk? Reach us on WhatsApp from the button in the
                  bottom-right corner.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (min-width: 720px) {
          .aa-fl-two { grid-template-columns: 1fr 1fr !important; }
          .aa-fl-fromto { grid-template-columns: 1fr auto 1fr !important; }
        }
        @media (min-width: 960px) {
          .aa-flights-grid { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) !important; gap: 40px !important; }
        }
        @media (max-width: 719px) {
          .aa-fl-swap { display: none !important; }
        }
      `}</style>
    </div>
  );
}