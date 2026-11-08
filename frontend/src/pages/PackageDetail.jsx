import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchPackage } from "../api/packages";
import EnquiryForm from "../components/EnquiryForm";
import {
  FaArrowLeft,
  FaCheck,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaMountain,
  FaRoute,
  FaBoxOpen,
  FaListUl,
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

/* ============ Keyframes ============ */
const KEY_ID = "aa-pkgdetail-kf";
function usePackageDetailKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaPDUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaPDKen {
        0%   { transform: scale(1.06); }
        100% { transform: scale(1.14); }
      }
      @keyframes aaPDShimmer {
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

/* ============ Loading state ============ */
function LoadingState({ t }) {
  return (
    <div style={{ background: "#fff", minHeight: "70vh" }}>
      <div
        style={{
          height: "340px",
          background: `linear-gradient(90deg, ${C.dark} 0%, ${C.darkSoft} 50%, ${C.dark} 100%)`,
          backgroundSize: "200% 100%",
          animation: "aaPDShimmer 1.6s linear infinite",
        }}
      />
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "48px 20px" }}>
        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {t("detail.loading") || "Loading…"}
        </p>
      </div>
    </div>
  );
}

/* ============ Error state ============ */
function ErrorState({ t, message }) {
  return (
    <div
      style={{
        background: C.cream,
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          textAlign: "center",
          background: "#fff",
          border: `1px solid ${C.line}`,
          borderRadius: "24px",
          padding: "48px 32px",
          boxShadow: "0 20px 40px -24px rgba(122,95,20,0.25)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "999px",
            margin: "0 auto 20px",
            display: "grid",
            placeItems: "center",
            background: C.cream,
            border: `1px solid ${C.lineStrong}`,
            color: C.gold,
            fontSize: "26px",
            fontWeight: 800,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          !
        </div>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "24px",
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {message || t("tours.noResults")}
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: "14.5px", lineHeight: 1.7, color: C.body }}>
          Try browsing other packages or contact us directly.
        </p>
        <Link
          to="/packages"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "999px",
            background: C.ink,
            color: "#fff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 800,
            transition: "background 220ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.ink)}
        >
          <FaArrowLeft aria-hidden="true" style={{ fontSize: "11px" }} />
          {t("detail.back")}
        </Link>
      </div>
    </div>
  );
}

/* ============ Section heading ============ */
function SectionHeading({ icon: Icon, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "16px",
        paddingBottom: "12px",
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "grid",
          placeItems: "center",
          width: "32px",
          height: "32px",
          borderRadius: "10px",
          background: C.cream,
          border: `1px solid ${C.lineStrong}`,
          color: C.goldDark,
          fontSize: "13px",
        }}
      >
        <Icon />
      </span>
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
        {children}
      </h2>
    </div>
  );
}

/* ============ Main ============ */
export default function PackageDetail() {
  const { id } = useParams();
  const { t, localized } = useI18n();
  const [pkg, setPkg] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [heroHover, setHeroHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  usePackageDetailKeyframes();

  useEffect(() => {
    let cancelled = false;
    fetchPackage(id)
      .then((data) => {
        if (!cancelled) {
          setPkg(data);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPkg(null);
          setLoadError(error.message || "Failed to load package details.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadedId(id);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loaded = loadedId === id;

  if (!loaded) return <LoadingState t={t} />;
  if (!pkg) return <ErrorState t={t} message={loadError} />;

  const title = localized(pkg.title);
  const overview = localized(pkg.overview);
  const summary = localized(pkg.summary);

  const highlightsRaw = localized(pkg.highlights);
  const itineraryRaw = localized(pkg.itinerary);
  const includesRaw = localized(pkg.includes);

  const highlights = Array.isArray(highlightsRaw) ? highlightsRaw : [];
  const itinerary = Array.isArray(itineraryRaw) ? itineraryRaw : [];
  const includes = Array.isArray(includesRaw) ? includesRaw : [];

  const usd = Number(pkg.priceUsd || pkg.price) || 0;
  const npr = pkg.priceNpr != null ? pkg.priceNpr : null;
  const categoryLabel = t(`search.${pkg.category}`);

  const scrollToEnquiry = () => {
    const el = document.getElementById("enquiry-card");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ============ HERO ============ */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "clamp(360px, 52vh, 520px)",
          display: "flex",
          alignItems: "flex-end",
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          onMouseEnter={() => setHeroHover(true)}
          onMouseLeave={() => setHeroHover(false)}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${pkg.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "aaPDKen 14s ease-out forwards",
            transform: heroHover ? "scale(1.03)" : undefined,
            transition: "transform 800ms ease",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11,27,48,0.15) 0%, rgba(11,27,48,0.55) 55%, rgba(11,27,48,0.92) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "120px 20px 40px",
          }}
        >
          <Link
            to="/packages"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "20px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backdropFilter: "blur(6px)",
            }}
          >
            <FaArrowLeft aria-hidden="true" style={{ fontSize: "10px" }} />
            {t("detail.back")}
          </Link>

          <h1
            style={{
              margin: "0 0 12px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(28px, 4.4vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "#fff",
              maxWidth: "820px",
              opacity: 0,
              animation: "aaPDUp 700ms cubic-bezier(0.22,1,0.36,1) 100ms forwards",
            }}
          >
            {title}
          </h1>

          {summary && (
            <p
              style={{
                margin: "0 0 16px",
                maxWidth: "680px",
                fontSize: "15.5px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
                opacity: 0,
                animation: "aaPDUp 700ms cubic-bezier(0.22,1,0.36,1) 200ms forwards",
              }}
            >
              {summary}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "6px",
              opacity: 0,
              animation: "aaPDUp 700ms cubic-bezier(0.22,1,0.36,1) 300ms forwards",
            }}
          >
            {[
              { Icon: FaClock, label: `${pkg.days} ${t("featured.days")}` },
              { Icon: FaMapMarkerAlt, label: pkg.destination },
              { Icon: FaTag, label: categoryLabel },
            ]
              .filter((item) => item.label)
              .map(({ Icon, label }, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.24)",
                    backdropFilter: "blur(8px)",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  <Icon aria-hidden="true" style={{ color: C.butter, fontSize: "11px" }} />
                  {label}
                </span>
              ))}
          </div>
        </div>
      </header>

      {/* ============ CONTENT ============ */}
      <section
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "48px 20px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "40px",
        }}
        className="aa-pkgdetail-grid"
      >
        {/* Main column */}
        <div>
          {/* Overview */}
          {overview && (
            <Reveal style={{ marginBottom: "40px" }}>
              <SectionHeading icon={FaMountain}>{t("detail.overview")}</SectionHeading>
              <p style={{ margin: 0, fontSize: "15.5px", lineHeight: 1.8, color: C.body }}>
                {overview}
              </p>
            </Reveal>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <Reveal delay={100} style={{ marginBottom: "40px" }}>
              <SectionHeading icon={FaListUl}>{t("detail.highlights")}</SectionHeading>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {highlights.map((h, i) => (
                  <li
                    key={`${h}-${i}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "10px 0",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: C.body,
                      borderBottom:
                        i < highlights.length - 1 ? `1px dashed ${C.line}` : "none",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        width: "22px",
                        height: "22px",
                        marginTop: "3px",
                        borderRadius: "999px",
                        background: C.cream,
                        border: `1px solid ${C.lineStrong}`,
                        color: C.goldDark,
                        fontSize: "10px",
                      }}
                    >
                      <FaCheck />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <Reveal delay={180} style={{ marginBottom: "40px" }}>
              <SectionHeading icon={FaRoute}>{t("detail.itinerary")}</SectionHeading>
              <ol
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  position: "relative",
                }}
              >
                {itinerary.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      position: "relative",
                      paddingLeft: "52px",
                      paddingBottom: i < itinerary.length - 1 ? "24px" : 0,
                    }}
                  >
                    {/* Connector line */}
                    {i < itinerary.length - 1 && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "15px",
                          top: "34px",
                          bottom: 0,
                          width: "2px",
                          background: C.lineStrong,
                        }}
                      />
                    )}
                    {/* Step number */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        display: "grid",
                        placeItems: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "999px",
                        background: C.ink,
                        color: C.butter,
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: C.body,
                        paddingTop: "4px",
                      }}
                    >
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {/* Includes */}
          {includes.length > 0 && (
            <Reveal delay={240}>
              <SectionHeading icon={FaBoxOpen}>{t("detail.includes")}</SectionHeading>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "10px",
                }}
              >
                {includes.map((inc, i) => (
                  <li
                    key={`${inc}-${i}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      background: C.cream,
                      border: `1px solid ${C.line}`,
                      borderRadius: "12px",
                      fontSize: "14px",
                      lineHeight: 1.55,
                      color: C.body,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        borderRadius: "999px",
                        background: C.gold,
                        color: "#fff",
                        fontSize: "9px",
                      }}
                    >
                      <FaCheck />
                    </span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        {/* ============ ASIDE ============ */}
        <aside id="enquiry-card" style={{ position: "relative" }}>
          <div
            className="aa-pkgdetail-aside-inner"
            style={{
              background: "#fff",
              border: `1px solid ${C.line}`,
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 20px 40px -26px rgba(122,95,20,0.28)",
              position: "sticky",
              top: "24px",
            }}
          >
            {/* Price block */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${C.ink} 0%, #2a2a2a 100%)`,
                color: "#fff",
                marginBottom: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(280px circle at 100% 0%, rgba(188,157,44,0.25), transparent 60%)",
                  pointerEvents: "none",
                }}
              />
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: C.butter,
                }}
              >
                {t("featured.from")}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "32px",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                US$ {usd || "—"}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {t("detail.perPerson")}
              </p>
              {npr != null && (
                <p
                  style={{
                    margin: "10px 0 0",
                    paddingTop: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.14)",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  NPR {npr}
                </p>
              )}
            </div>

            {/* Info rows */}
            <div style={{ marginBottom: "20px" }}>
              {[
                {
                  Icon: FaClock,
                  label: t("detail.duration"),
                  value: `${pkg.days} ${t("featured.days")}`,
                },
                { Icon: FaMapMarkerAlt, label: t("detail.destination"), value: pkg.destination },
                { Icon: FaTag, label: t("detail.category"), value: categoryLabel },
              ]
                .filter((row) => row.value)
                .map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "10px 0",
                      borderBottom: `1px dashed ${C.line}`,
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: C.muted,
                        fontWeight: 600,
                      }}
                    >
                      <Icon aria-hidden="true" style={{ color: C.gold, fontSize: "12px" }} />
                      {label}
                    </span>
                    <span style={{ color: C.ink, fontWeight: 700, textAlign: "right" }}>
                      {value}
                    </span>
                  </div>
                ))}
            </div>

            {/* CTA scroll */}
            <button
              type="button"
              onClick={scrollToEnquiry}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                width: "100%",
                padding: "13px 20px",
                borderRadius: "999px",
                background: ctaHover ? C.gold : C.butter,
                color: ctaHover ? "#fff" : C.goldDark,
                border: `1px solid ${ctaHover ? C.gold : C.lineStrong}`,
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "background 220ms ease, color 220ms ease, transform 220ms ease",
                transform: ctaHover ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {t("detail.enquire")}
            </button>

            {/* Enquiry form */}
            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${C.line}` }}>
              <h3
                style={{
                  margin: "0 0 14px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: C.ink,
                }}
              >
                {t("detail.enquire")}
              </h3>
              <EnquiryForm packageTitle={title} />
            </div>
          </div>
        </aside>
      </section>

      {/* ============ Responsive grid ============ */}
      <style>{`
        @media (min-width: 960px) {
          .aa-pkgdetail-grid {
            grid-template-columns: minmax(0, 1fr) 380px !important;
          }
        }
        @media (max-width: 959px) {
          .aa-pkgdetail-aside-inner {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}