import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchPackages } from "../api/packages";
import PackageCard from "../components/PackageCard";
import Testimonials from "../components/Testimonials";
import AssociatePartners from "./AssociatePatners";
import { COUNTRIES } from "../data/options";

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

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1610997686651-98492fd08108?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1601062196432-0e267ba1e1eb?auto=format&fit=crop&w=2000&q=80",
];

const CATS = [
  { id: "trekking", to: "/packages?category=trekking" },
  { id: "adventure", to: "/packages?category=adventure" },
  { id: "heli", to: "/packages?category=heli" },
  { id: "tour", to: "/packages?category=tour" },
];

/* ============ Global keyframes (injected once) ============ */
const KEY_ID = "aa-home-kf";
function useHomeKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaHomeFadeUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaHomeFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes aaHomeKen {
        0%   { transform: scale(1.06); }
        100% { transform: scale(1.14); }
      }
      @keyframes aaHomeGoldPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(188,157,44,0.32); }
        50%      { box-shadow: 0 0 0 10px rgba(188,157,44,0); }
      }
      @keyframes aaHomeShimmer {
        0%   { background-position: -180% 0; }
        100% { background-position: 180% 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(el);
  }, []);
}

/* ============ Intersection reveal ============ */
function useInView(threshold = 0.15) {
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

function Reveal({ children, delay = 0, as: Tag = "div", style, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============ Component ============ */
export default function Home() {
  const { t } = useI18n();
  useHomeKeyframes();

  const [slide, setSlide] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whyHover, setWhyHover] = useState(null);
  const [catHover, setCatHover] = useState(null);
  const [ctaHover, setCtaHover] = useState(false);
  const [heroBtnHover, setHeroBtnHover] = useState(false);
  const [searchHover, setSearchHover] = useState(false);

  const slides = Array.isArray(t("hero.slides")) ? t("hero.slides") : [];
  const featured = packages.filter((p) => p.featured);
  const shown = featured.length ? featured : packages.slice(0, 6);
  const current = slides[slide] || slides[0];

  const whyItems = t("why.items");
  const whyList = Array.isArray(whyItems) ? whyItems : [];

  useEffect(() => {
    if (!slides.length) return undefined;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        style={{
          position: "relative",
          minHeight: "clamp(480px, 78vh, 720px)",
          overflow: "hidden",
          background: C.dark,
        }}
      >
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== slide}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === slide ? 1 : 0,
              transition: "opacity 1200ms ease",
              animation: i === slide ? "aaHomeKen 9s ease-out forwards" : "none",
            }}
          />
        ))}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11,27,48,0.45) 0%, rgba(11,27,48,0.55) 40%, rgba(11,27,48,0.85) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "100px 20px 120px",
            minHeight: "clamp(480px, 78vh, 720px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            color: "#fff",
          }}
        >
          <Reveal delay={100}>
            <p
              style={{
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(255,237,155,0.14)",
                border: `1px solid rgba(255,237,155,0.4)`,
                color: C.butter,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                width: "fit-content",
              }}
            >
              {t("brand")}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <h1
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(32px, 5.2vw, 62px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                maxWidth: "820px",
              }}
            >
              {current?.title}
            </h1>
          </Reveal>

          <Reveal delay={340}>
            <p
              style={{
                margin: 0,
                maxWidth: "620px",
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.86)",
              }}
            >
              {current?.subtitle}
            </p>
          </Reveal>

          <Reveal delay={460}>
            <Link
              to="/packages"
              onMouseEnter={() => setHeroBtnHover(true)}
              onMouseLeave={() => setHeroBtnHover(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "12px",
                padding: "14px 28px",
                borderRadius: "999px",
                background: heroBtnHover ? C.gold : C.butter,
                color: heroBtnHover ? "#fff" : C.goldDark,
                fontWeight: 800,
                fontSize: "15px",
                textDecoration: "none",
                border: `1px solid ${heroBtnHover ? C.gold : C.lineStrong}`,
                boxShadow: heroBtnHover
                  ? "0 14px 30px -14px rgba(188,157,44,0.85)"
                  : "0 6px 18px -8px rgba(0,0,0,0.4)",
                transform: heroBtnHover ? "translateY(-2px)" : "translateY(0)",
                transition:
                  "background 220ms ease, color 220ms ease, box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease",
                width: "fit-content",
              }}
            >
              {current?.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 2,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? "32px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: i === slide ? C.butter : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 300ms cubic-bezier(0.22,1,0.36,1)",
                boxShadow:
                  i === slide ? "0 0 0 4px rgba(255,237,155,0.2)" : "none",
              }}
            />
          ))}
        </div>
      </section>

      {/* ===================== SEARCH BAR ===================== */}
      <section
        style={{
          position: "relative",
          marginTop: "-64px",
          padding: "0 20px 40px",
          zIndex: 5,
        }}
      >
        <Reveal delay={120}>
          <form
            action="/packages"
            onMouseEnter={() => setSearchHover(true)}
            onMouseLeave={() => setSearchHover(false)}
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              background: "#fff",
              border: `1px solid ${C.line}`,
              borderRadius: "20px",
              padding: "26px",
              boxShadow: searchHover
                ? "0 24px 48px -22px rgba(122,95,20,0.35)"
                : "0 12px 30px -20px rgba(122,95,20,0.35)",
              transition: "box-shadow 320ms ease",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "20px",
                fontWeight: 700,
                color: C.ink,
                letterSpacing: "-0.01em",
              }}
            >
              {t("search.title")}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                alignItems: "end",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                {t("search.category")}
                <select
                  name="category"
                  defaultValue="all"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${C.line}`,
                    background: C.cream,
                    color: C.ink,
                    fontSize: "14px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">{t("search.all")}</option>
                  <option value="trekking">{t("search.trekking")}</option>
                  <option value="adventure">{t("search.adventure")}</option>
                  <option value="heli">{t("search.heli")}</option>
                  <option value="tour">{t("search.tour")}</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                {t("search.duration")}
                <select
                  name="duration"
                  defaultValue="all"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${C.line}`,
                    background: C.cream,
                    color: C.ink,
                    fontSize: "14px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">{t("search.all")}</option>
                  <option value="1-3">{t("search.days13")}</option>
                  <option value="4-7">{t("search.days47")}</option>
                  <option value="8-12">{t("search.days812")}</option>
                  <option value="13+">{t("search.days13plus")}</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                {t("search.destination")}
                <select
                  name="destination"
                  defaultValue="all"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${C.line}`,
                    background: C.cream,
                    color: C.ink,
                    fontSize: "14px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">{t("search.all")}</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                style={{
                  minHeight: "48px",
                  padding: "12px 22px",
                  borderRadius: "12px",
                  background: C.ink,
                  color: "#fff",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "background 200ms ease, transform 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.ink;
                }}
              >
                {t("search.search")}
              </button>
            </div>
          </form>
        </Reveal>
      </section>

      {/* ===================== WHY US ===================== */}
      <section style={{ padding: "56px 20px", background: "#fff" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                {t("why.eyebrow")}
              </p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(24px, 3.2vw, 34px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                  lineHeight: 1.15,
                }}
              >
                {t("why.title")}
              </h2>
              <p
                style={{
                  margin: "12px auto 0",
                  maxWidth: "560px",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: C.body,
                }}
              >
                {t("why.subtitle")}
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {whyList.map((item, i) => {
              const hov = whyHover === item.title;
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <article
                    onMouseEnter={() => setWhyHover(item.title)}
                    onMouseLeave={() => setWhyHover(null)}
                    style={{
                      position: "relative",
                      height: "100%",
                      background: hov ? C.cream : "#fff",
                      border: `1px solid ${hov ? C.gold : C.line}`,
                      borderRadius: "16px",
                      padding: "24px",
                      transform: hov ? "translateY(-4px)" : "translateY(0)",
                      boxShadow: hov
                        ? "0 20px 36px -22px rgba(188,157,44,0.4)"
                        : "0 1px 2px rgba(122,95,20,0.04)",
                      transition:
                        "background 260ms ease, border-color 260ms ease, transform 260ms ease, box-shadow 260ms ease",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: "40px",
                        height: "4px",
                        borderRadius: "4px",
                        background: hov ? C.gold : C.lineStrong,
                        marginBottom: "14px",
                        transition: "background 260ms ease",
                      }}
                    />
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: C.ink,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: 1.7,
                        color: C.body,
                      }}
                    >
                      {item.desc}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section style={{ padding: "56px 20px", background: C.cream }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(24px, 3.2vw, 34px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                  lineHeight: 1.15,
                }}
              >
                {t("categories.title")}
              </h2>
              <p
                style={{
                  margin: "12px auto 0",
                  maxWidth: "560px",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: C.body,
                }}
              >
                {t("categories.subtitle")}
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {CATS.map((c, i) => {
              const hov = catHover === c.id;
              return (
                <Reveal key={c.id} delay={i * 80}>
                  <Link
                    to={c.to}
                    onMouseEnter={() => setCatHover(c.id)}
                    onMouseLeave={() => setCatHover(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "100px",
                      padding: "20px 22px",
                      borderRadius: "16px",
                      background: hov ? C.ink : "#fff",
                      color: hov ? "#fff" : C.ink,
                      border: `1px solid ${hov ? C.ink : C.line}`,
                      textDecoration: "none",
                      fontWeight: 700,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "17px",
                      letterSpacing: "-0.01em",
                      transform: hov ? "translateY(-3px)" : "translateY(0)",
                      boxShadow: hov
                        ? "0 18px 34px -22px rgba(31,31,31,0.55)"
                        : "0 1px 2px rgba(122,95,20,0.05)",
                      transition:
                        "background 240ms ease, color 240ms ease, border-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
                    }}
                  >
                    <span>{t(`search.${c.id}`)}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "999px",
                        background: hov ? C.butter : C.cream,
                        color: C.goldDark,
                        transition: "background 240ms ease, transform 240ms ease",
                        transform: hov ? "translateX(3px)" : "translateX(0)",
                        fontSize: "14px",
                      }}
                    >
                      →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PACKAGES ===================== */}
      <section style={{ padding: "56px 20px 72px", background: "#fff" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(24px, 3.2vw, 34px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                  lineHeight: 1.15,
                }}
              >
                {t("featured.title")}
              </h2>
              <p
                style={{
                  margin: "12px auto 0",
                  maxWidth: "560px",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: C.body,
                }}
              >
                {t("featured.subtitle")}
              </p>
            </div>
          </Reveal>

          {loading ? (
            <p style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
              {t("detail.loading")}
            </p>
          ) : shown.length === 0 ? (
            <p style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
              {t("tours.noResults")}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 380px))",
                justifyContent: "center",
                gap: "22px",
              }}
            >
              {shown.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 70}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={120}>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link
                to="/packages"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 26px",
                  borderRadius: "999px",
                  background: "transparent",
                  color: C.goldDark,
                  border: `1px solid ${C.gold}`,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  transition: "background 220ms ease, color 220ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.gold;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = C.goldDark;
                }}
              >
                {t("featured.all")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== TESTIMONIALS + PARTNERS ===================== */}
      <Testimonials />
      <AssociatePartners />

      {/* ===================== CTA BAND ===================== */}
      <section
        style={{
          position: "relative",
          padding: "80px 20px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkSoft} 100%)`,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px circle at 20% 20%, rgba(201,162,39,0.18), transparent 60%), radial-gradient(520px circle at 85% 80%, rgba(255,237,155,0.14), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "820px", margin: "0 auto" }}>
          <Reveal>
            <h2
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(26px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {t("cta.title")}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p
              style={{
                margin: "16px auto 0",
                maxWidth: "620px",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {t("cta.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <Link
              to="/contact"
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "28px",
                padding: "15px 32px",
                borderRadius: "999px",
                background: ctaHover ? C.gold : C.butter,
                color: ctaHover ? "#fff" : C.goldDark,
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 800,
                border: "none",
                boxShadow: ctaHover
                  ? "0 18px 34px -16px rgba(188,157,44,0.7)"
                  : "0 8px 22px -10px rgba(0,0,0,0.45)",
                transform: ctaHover ? "translateY(-2px)" : "translateY(0)",
                transition:
                  "background 220ms ease, color 220ms ease, box-shadow 220ms ease, transform 220ms ease",
                animation: "aaHomeGoldPulse 3s ease-in-out infinite",
              }}
            >
              {t("cta.button")}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}