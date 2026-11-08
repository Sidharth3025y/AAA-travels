import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import {
  FaArrowRight,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaPlaneDeparture,
  FaHandshake,
  FaHeart,
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

/* ============ Team data ============ */
const TEAM = [
  {
    name: "Krishna Kumar Giri",
    role: "Founder & Managing Director",
    bio: "Two decades of guiding travellers across Nepal, Tibet, and Bhutan. Founded AAA Travels to make mountain journeys both safe and soulful.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiNRLcGLZS_sTdKdyEdTDu1wA1q4Suc72HhwHmwEEaeA&s=10?auto=format&fit=crop&w=600&q=80",
    email: "aaatravel@gmail.com",
    phone: "",
    linkedin: "",
  },
  {
    name: "Gita Giri",
    role: "Head of Operations",
    bio: "Coordinates ground logistics, permits, and airline partners. Known for answering 3 AM WhatsApp questions during trekking season.",
    image:
      "https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-6/867157968_4680151775598496_6396488401971326231_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1966x1966&ctp=s1966x1966&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFwk3egDrRRlivH60tVaBCbw5Dzzz9KpObDkPPPP0qk5ngM_PhOoOqNDzOodtRrM-pL2gsD6XeqEkZAvrmFihyJ&_nc_ohc=B8WSYJu0kMMQ7kNvwGNF9ew&_nc_oc=AdpMY7ZoGVd7XLNCVWH9F3pHtI7it5SQW_RB_gXSq9r7Gr9j3sS_SUnhaHJ7cFtjYiqHrtSx0Mdat7rdzaUU-F0r&_nc_zt=23&_nc_ht=scontent.fpkr1-1.fna&_nc_gid=GWDD6HV3yug2S6dC12fckA&_nc_ss=7b2a8&oh=00_AQQQl132LIdEM-61VygUNA6w1dOt_LmmcBbY9G6i-uD3dA&oe=6AF626C3?auto=format&fit=crop&w=600&q=80",
    email: "aaatravel@gmail.com",
    phone: "",
    linkedin: "",
  },
];

/* ============ Keyframes ============ */
const KEY_ID = "aa-about-kf";
function useAboutKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaAboutFadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaAboutFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes aaAboutKen {
        0%   { transform: scale(1.04); }
        100% { transform: scale(1.1); }
      }
      @keyframes aaAboutCount {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `;
    document.head.appendChild(el);
  }, []);
}

/* ============ Intersection reveal ============ */
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
        transform: seen ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============ Team Card ============ */
function TeamCard({ member, index }) {
  const [hover, setHover] = useState(false);

  return (
    <Reveal delay={index * 80}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          border: `1px solid ${hover ? C.gold : C.line}`,
          borderRadius: "20px",
          overflow: "hidden",
          height: "100%",
          boxShadow: hover
            ? "0 26px 48px -24px rgba(188,157,44,0.4), 0 0 0 1px rgba(188,157,44,0.2)"
            : "0 1px 2px rgba(122,95,20,0.04)",
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          transition:
            "transform 340ms cubic-bezier(0.22,1,0.36,1), box-shadow 340ms ease, border-color 260ms ease",
        }}
      >
        {/* Photo */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: C.cream,
          }}
        >
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.06)" : "scale(1)",
              transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "50%",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(11,27,48,0.65) 100%)",
              opacity: hover ? 1 : 0,
              transition: "opacity 320ms ease",
            }}
          />

          {(member.email || member.phone || member.linkedin) && (
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                display: "flex",
                gap: "8px",
                opacity: hover ? 1 : 0,
                transform: hover ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 320ms ease, transform 320ms ease",
              }}
            >
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "34px",
                    height: "34px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.95)",
                    color: C.goldDark,
                    textDecoration: "none",
                    fontSize: "13px",
                  }}
                >
                  <FaEnvelope aria-hidden="true" />
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone.replace(/\s+/g, "")}`}
                  aria-label={`Call ${member.name}`}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "34px",
                    height: "34px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.95)",
                    color: C.goldDark,
                    textDecoration: "none",
                    fontSize: "13px",
                  }}
                >
                  <FaPhone aria-hidden="true" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn ${member.name}`}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "34px",
                    height: "34px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.95)",
                    color: C.goldDark,
                    textDecoration: "none",
                    fontSize: "13px",
                  }}
                >
                  <FaLinkedinIn aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 22px" }}>
          <h3
            style={{
              margin: "0 0 4px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            {member.name}
          </h3>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.gold,
            }}
          >
            {member.role}
          </p>
          <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.65, color: C.body }}>
            {member.bio}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* ============ Main page ============ */
export default function About() {
  const { t } = useI18n();
  useAboutKeyframes();

  const statsRaw = t("about.stats");
  const stats = Array.isArray(statsRaw) ? statsRaw : [];

  const [imgHover, setImgHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

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
              animation: "aaAboutFadeUp 600ms cubic-bezier(0.22,1,0.36,1) 60ms forwards",
            }}
          >
            <FaHeart aria-hidden="true" style={{ color: C.gold }} />
            About AAA Travels
          </p>
          <h1
            style={{
              margin: "0 0 14px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(30px, 4.6vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: C.ink,
              opacity: 0,
              animation: "aaAboutFadeUp 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
            }}
          >
            {t("about.title")}
          </h1>
          <div
            aria-hidden="true"
            style={{
              height: "3px",
              width: "56px",
              margin: "20px auto 0",
              borderRadius: "3px",
              background: `linear-gradient(90deg, ${C.gold}, ${C.butter})`,
            }}
          />
        </div>
      </header>

      {/* ============ INTRO SPLIT ============ */}
      <section style={{ padding: "64px 20px" }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "40px",
            alignItems: "center",
          }}
          className="aa-about-grid"
        >
          <Reveal>
            <div
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: imgHover
                  ? "0 30px 60px -24px rgba(122,95,20,0.4)"
                  : "0 16px 34px -20px rgba(122,95,20,0.28)",
                transform: imgHover ? "translateY(-2px)" : "translateY(0)",
                transition: "box-shadow 340ms ease, transform 340ms ease",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  transform: imgHover ? "scale(1.04)" : "scale(1)",
                  transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(6px)",
                  color: C.goldDark,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                <FaPlaneDeparture aria-hidden="true" style={{ color: C.gold }} />
                Pokhara · Nepal
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div>
              <p
                style={{
                  margin: "0 0 18px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "20px",
                  lineHeight: 1.5,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {t("about.intro")}
              </p>
              <p style={{ margin: "0 0 22px", fontSize: "15.5px", lineHeight: 1.75, color: C.body }}>
                {t("about.body")}
              </p>

              <div
                style={{
                  padding: "18px 20px",
                  marginBottom: "24px",
                  background: C.cream,
                  border: `1px solid ${C.lineStrong}`,
                  borderLeft: `4px solid ${C.gold}`,
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.gold,
                  }}
                >
                  {t("about.missionTitle")}
                </h3>
                <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.7, color: C.body }}>
                  {t("about.mission")}
                </p>
              </div>

              <Link
                to="/contact"
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  borderRadius: "999px",
                  background: ctaHover ? C.gold : C.ink,
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  boxShadow: ctaHover
                    ? "0 18px 32px -14px rgba(188,157,44,0.7)"
                    : "0 10px 22px -12px rgba(31,31,31,0.6)",
                  transform: ctaHover ? "translateY(-2px)" : "translateY(0)",
                  transition:
                    "background 220ms ease, box-shadow 220ms ease, transform 220ms ease",
                }}
              >
                {t("nav.enquire")}
                <FaArrowRight aria-hidden="true" style={{ fontSize: "11px" }} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STATS BAND ============ */}
      {stats.length > 0 && (
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "56px 20px",
            background: `linear-gradient(135deg, ${C.dark} 0%, #122c4d 100%)`,
            color: "#fff",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(560px circle at 15% 30%, rgba(201,162,39,0.18), transparent 60%), radial-gradient(520px circle at 85% 80%, rgba(255,237,155,0.12), transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              maxWidth: "1120px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "32px",
              textAlign: "center",
            }}
          >
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 100}>
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "clamp(30px, 4vw, 44px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      background: `linear-gradient(135deg, ${C.butter} 0%, ${C.gold} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: "aaAboutCount 800ms cubic-bezier(0.22,1,0.36,1) both",
                    }}
                  >
                    {s.n}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: "10px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {s.l}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ TEAM ============ */}
      <section style={{ padding: "72px 20px", background: "#fff" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: C.gold,
                }}
              >
                <FaHandshake aria-hidden="true" />
                Our Team
              </p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(24px, 3.4vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                  lineHeight: 1.15,
                }}
              >
                Meet the people behind your journey
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
                Local guides, planners, and travel consultants who know every
                trail, teahouse, and timezone by heart.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 360px))",
              justifyContent: "center",
              gap: "22px",
            }}
          >
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section
        style={{
          padding: "72px 20px",
          background: C.cream,
          borderTop: `1px solid ${C.line}`,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <Reveal>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: C.ink,
                lineHeight: 1.2,
              }}
            >
              Ready to plan your next trip?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ margin: "0 0 24px", fontSize: "15px", lineHeight: 1.7, color: C.body }}>
              Tell us where you want to go and we'll craft an itinerary that
              feels like it was made for you — because it was.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link
              to="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "999px",
                background: C.ink,
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 800,
                transition: "background 220ms ease, transform 220ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.gold;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.ink;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Contact us
              <FaArrowRight aria-hidden="true" style={{ fontSize: "11px" }} />
            </Link>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .aa-about-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}