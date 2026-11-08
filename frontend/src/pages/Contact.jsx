import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/LanguageContext";
import { mailtoFallback, sendEnquiry } from "../api/services";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWhatsapp,
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
};

/* ============ Keyframes (injected once) ============ */
const KEY_ID = "aa-contact-kf";
function useContactKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaContactUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaContactShimmer {
        0%   { background-position: -180% 0; }
        100% { background-position: 180% 0; }
      }
      .aa-contact-input:focus {
        border-color: #bc9d2c !important;
        box-shadow: 0 0 0 4px rgba(188,157,44,0.15) !important;
        outline: none !important;
      }
      .aa-contact-input::placeholder {
        color: #a39c86;
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

/* ============ Main component ============ */
export default function Contact() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [btnHover, setBtnHover] = useState(false);
  const [cardHover, setCardHover] = useState(null);

  useContactKeyframes();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await sendEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `${form.phone ? `Phone: ${form.phone}\n` : ""}${form.message}`,
      });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      mailtoFallback(form);
      setStatus("mail");
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

  const cards = [
    {
      key: "address",
      label: t("contact.address"),
      value: t("contact.addressValue"),
      Icon: FaMapMarkerAlt,
      href: null,
    },
    {
      key: "phone",
      label: t("contact.phone"),
      value: t("contact.phoneValue"),
      Icon: FaPhoneAlt,
      href: `tel:${String(t("contact.phoneValue") || "").replace(/\s+/g, "")}`,
    },
    {
      key: "email",
      label: t("contact.email"),
      value: t("contact.emailValue"),
      Icon: FaEnvelope,
      href: `mailto:${t("contact.emailValue") || ""}`,
    },
    {
      key: "hours",
      label: t("contact.hours"),
      value: t("contact.hoursValue"),
      Icon: FaClock,
      href: null,
    },
  ];

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
          background: `linear-gradient(180deg, ${C.cream} 0%, #ffffff 100%)`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(560px circle at 15% 0%, rgba(255,237,155,0.5), transparent 60%), radial-gradient(520px circle at 85% 100%, rgba(255,237,155,0.35), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "#fff",
              border: `1px solid ${C.lineStrong}`,
              color: C.goldDark,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              opacity: 0,
              animation: "aaContactUp 600ms cubic-bezier(0.22,1,0.36,1) 60ms forwards",
            }}
          >
            <FaPaperPlane aria-hidden="true" style={{ color: C.gold }} />
            Get in touch
          </p>
          <h1
            style={{
              margin: "0 0 12px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(30px, 4.6vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: C.ink,
              opacity: 0,
              animation: "aaContactUp 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
            }}
          >
            {t("contact.title")}
          </h1>
          <p
            style={{
              margin: "0 auto",
              maxWidth: "560px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: C.body,
              opacity: 0,
              animation: "aaContactUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
            }}
          >
            {t("contact.subtitle")}
          </p>
          <div
            aria-hidden="true"
            style={{
              height: "3px",
              width: "56px",
              margin: "22px auto 0",
              borderRadius: "3px",
              background: `linear-gradient(90deg, ${C.gold}, ${C.butter})`,
            }}
          />
        </div>
      </header>

      {/* ============ FORM + CONTACT CARDS ============ */}
      <section style={{ padding: "56px 20px 64px" }}>
        <div
          className="aa-contact-grid"
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Form */}
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
              <h2
                style={{
                  margin: "0 0 6px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Send us a message
              </h2>
              <p style={{ margin: "0 0 24px", fontSize: "14px", color: C.body, lineHeight: 1.6 }}>
                We usually reply within one business day.
              </p>

              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div
                  className="aa-contact-two"
                  style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}
                >
                  <input
                    className="aa-contact-input"
                    name="name"
                    required
                    placeholder={t("contact.name")}
                    value={form.name}
                    onChange={onChange}
                    style={inputStyle}
                  />
                  <input
                    className="aa-contact-input"
                    name="email"
                    type="email"
                    required
                    placeholder={t("contact.email")}
                    value={form.email}
                    onChange={onChange}
                    style={inputStyle}
                  />
                </div>

                <input
                  className="aa-contact-input"
                  name="phone"
                  placeholder={t("contact.phone")}
                  value={form.phone}
                  onChange={onChange}
                  style={inputStyle}
                />

                <textarea
                  className="aa-contact-input"
                  name="message"
                  required
                  rows="6"
                  placeholder={t("contact.message")}
                  value={form.message}
                  onChange={onChange}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "140px", lineHeight: 1.65 }}
                />

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
                  {loading ? t("contact.sending") : t("contact.send")}
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
                    {t("contact.success")}
                  </p>
                )}
                {status === "mail" && (
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

          {/* Contact cards */}
          <div
            className="aa-contact-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {cards.map((c, i) => {
              const hov = cardHover === c.key;
              const Wrapper = c.href ? "a" : "article";
              const extraProps = c.href
                ? { href: c.href, style: { textDecoration: "none", color: "inherit" } }
                : {};
              return (
                <Reveal key={c.key} delay={i * 90}>
                  <Wrapper
                    {...extraProps}
                    onMouseEnter={() => setCardHover(c.key)}
                    onMouseLeave={() => setCardHover(null)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      height: "100%",
                      padding: "22px",
                      borderRadius: "18px",
                      background: hov ? C.cream : "#fff",
                      border: `1px solid ${hov ? C.gold : C.line}`,
                      transform: hov ? "translateY(-4px)" : "translateY(0)",
                      boxShadow: hov
                        ? "0 20px 36px -22px rgba(188,157,44,0.4)"
                        : "0 1px 2px rgba(122,95,20,0.04)",
                      transition:
                        "background 240ms ease, border-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
                      ...(extraProps.style || {}),
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: hov ? C.butter : C.cream,
                        color: C.goldDark,
                        fontSize: "15px",
                        border: `1px solid ${C.lineStrong}`,
                        transition: "background 240ms ease",
                      }}
                    >
                      <c.Icon />
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: C.gold,
                      }}
                    >
                      {c.label}
                    </h3>
                    <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.65, color: C.ink }}>
                      {c.value}
                    </p>
                  </Wrapper>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MAP ============ */}
      <section style={{ padding: "0 20px 80px" }}>
        <Reveal>
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              borderRadius: "24px",
              overflow: "hidden",
              border: `1px solid ${C.line}`,
              boxShadow: "0 20px 44px -24px rgba(122,95,20,0.28)",
              background: C.cream,
            }}
          >
            <iframe
              title="map"
              src="https://www.google.com/maps?q=AAAtravels+Pokhara+Kaski+Nepal&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                display: "block",
                width: "100%",
                height: "clamp(320px, 44vh, 460px)",
                border: "none",
              }}
            />
          </div>
        </Reveal>
      </section>

      {/* Responsive: 2-col form rows + contact grid on desktop */}
      <style>{`
        @media (min-width: 720px) {
          .aa-contact-two { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 960px) {
          .aa-contact-grid { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}