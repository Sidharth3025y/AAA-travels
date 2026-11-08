import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchBlogPosts } from "../api/blog";
import { FaArrowRight, FaCalendarAlt, FaUser } from "react-icons/fa";

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
};

/* ============ Keyframes (injected once) ============ */
const KEY_ID = "aa-blogpage-kf";
function useBlogPageKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaBlogFadeUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaBlogShimmer {
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

/* ============ Skeleton ============ */
function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        background: "#fff",
        border: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          background: `linear-gradient(90deg, ${C.cream} 0%, ${C.butter} 50%, ${C.cream} 100%)`,
          backgroundSize: "200% 100%",
          animation: "aaBlogShimmer 1.4s linear infinite",
        }}
      />
      <div style={{ padding: "20px" }}>
        <div
          style={{
            height: "14px",
            width: "35%",
            borderRadius: "6px",
            background: C.cream,
            marginBottom: "12px",
          }}
        />
        <div
          style={{
            height: "20px",
            width: "85%",
            borderRadius: "6px",
            background: C.cream,
            marginBottom: "10px",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "100%",
            borderRadius: "6px",
            background: C.cream,
            marginBottom: "6px",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "70%",
            borderRadius: "6px",
            background: C.cream,
          }}
        />
      </div>
    </div>
  );
}

/* ============ Reading time ============ */
function readingTime(text) {
  if (!text) return 1;
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ============ Card ============ */
function BlogCard({ post, index }) {
  const [hover, setHover] = useState(false);

  const dateLabel = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : null;

  const minutes = readingTime(post.content);

  return (
    <Reveal delay={index * 70}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "18px",
          background: "#fff",
          border: `1px solid ${hover ? C.gold : C.line}`,
          boxShadow: hover
            ? "0 24px 44px -22px rgba(188,157,44,0.4), 0 0 0 1px rgba(188,157,44,0.2)"
            : "0 1px 2px rgba(122,95,20,0.04)",
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          transition:
            "transform 340ms cubic-bezier(0.22,1,0.36,1), box-shadow 340ms ease, border-color 260ms ease",
        }}
      >
        <Link
          to={`/blog/${post.slug}`}
          style={{
            display: "block",
            position: "relative",
            overflow: "hidden",
            aspectRatio: "16 / 10",
            background: C.cream,
          }}
          aria-label={`Open ${post.title}`}
        >
          {post.image ? (
            <img
              src={post.image}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hover ? "scale(1.06)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
              }}
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${C.cream}, ${C.butter})`,
              }}
            />
          )}

          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              padding: "5px 10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(6px)",
              color: C.goldDark,
              fontSize: "10.5px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            Article
          </span>
        </Link>

        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
              fontSize: "11.5px",
              color: C.muted,
              fontWeight: 600,
            }}
          >
            {post.author && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <FaUser aria-hidden="true" style={{ color: C.gold, fontSize: "10px" }} />
                {post.author}
              </span>
            )}
            {dateLabel && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <FaCalendarAlt aria-hidden="true" style={{ color: C.gold, fontSize: "10px" }} />
                {dateLabel}
              </span>
            )}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "999px",
                background: C.cream,
                border: `1px solid ${C.lineStrong}`,
                color: C.goldDark,
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {minutes} min
            </span>
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "19px",
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            <Link
              to={`/blog/${post.slug}`}
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.goldDark)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.ink)}
            >
              {post.title}
            </Link>
          </h2>

          <p
            style={{
              margin: "0 0 16px",
              fontSize: "14px",
              lineHeight: 1.65,
              color: C.body,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt || (post.content ? post.content.slice(0, 150) : "")}…
          </p>

          <Link
            to={`/blog/${post.slug}`}
            style={{
              marginTop: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: C.goldDark,
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textDecoration: "none",
              transition: "gap 220ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "14px")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
          >
            Read more
            <FaArrowRight aria-hidden="true" style={{ fontSize: "11px" }} />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/* ============ Main page ============ */
export default function BlogPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useBlogPageKeyframes();

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const list = Array.isArray(posts) ? posts : [];

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
              "radial-gradient(600px circle at 15% 0%, rgba(255,237,155,0.5), transparent 60%), radial-gradient(520px circle at 85% 100%, rgba(255,237,155,0.35), transparent 60%)",
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
              animation: "aaBlogFadeUp 600ms cubic-bezier(0.22,1,0.36,1) 60ms forwards",
            }}
          >
            Journal
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
              animation: "aaBlogFadeUp 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
            }}
          >
            {t("blog.title")}
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "600px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: C.body,
              opacity: 0,
              animation: "aaBlogFadeUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
            }}
          >
            {t("blog.subtitle")}
          </p>

          <div
            aria-hidden="true"
            style={{
              height: "3px",
              width: "56px",
              margin: "24px auto 0",
              borderRadius: "3px",
              background: `linear-gradient(90deg, ${C.gold}, ${C.butter})`,
            }}
          />
        </div>
      </header>

      {/* ============ POSTS ============ */}
      <section style={{ padding: "56px 20px 80px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "22px",
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div
              style={{
                maxWidth: "520px",
                margin: "40px auto",
                textAlign: "center",
                background: C.cream,
                border: `1px solid ${C.line}`,
                borderRadius: "20px",
                padding: "48px 32px",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  margin: "0 auto 18px",
                  display: "grid",
                  placeItems: "center",
                  background: "#fff",
                  border: `1px solid ${C.lineStrong}`,
                  color: C.gold,
                  fontSize: "24px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 700,
                }}
              >
                ✎
              </div>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: C.ink,
                }}
              >
                {t("blog.noPosts") || "No posts yet"}
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: C.body, lineHeight: 1.7 }}>
                Check back soon — new travel stories are on the way.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "22px",
              }}
            >
              {list.map((post, i) => (
                <BlogCard key={post.slug || post._id || i} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}