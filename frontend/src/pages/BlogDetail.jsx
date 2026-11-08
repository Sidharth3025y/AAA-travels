import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchBlogPost } from "../api/blog";
import {
  FaFacebookF,
  FaWhatsapp,
  FaLink,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
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
const KEY_ID = "aa-blogdetail-kf";
function useBlogKeyframes() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
    const el = document.createElement("style");
    el.id = KEY_ID;
    el.textContent = `
      @keyframes aaBlogFadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaBlogFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
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

/* ============ Reading progress hook ============ */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return progress;
}

/* ============ Reading time helper ============ */
function estimateReadingTime(text) {
  if (!text) return 1;
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ============ Loading skeleton ============ */
function LoadingState({ t }) {
  return (
    <div style={{ background: "#fff", minHeight: "60vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 20px" }}>
        <div
          style={{
            width: "100%",
            height: "320px",
            borderRadius: "20px",
            background: `linear-gradient(90deg, ${C.cream} 0%, ${C.butter} 50%, ${C.cream} 100%)`,
            backgroundSize: "200% 100%",
            animation: "aaBlogShimmer 1.6s linear infinite",
            marginBottom: "32px",
          }}
        />
        <div
          style={{
            width: "60%",
            height: "32px",
            borderRadius: "8px",
            background: C.cream,
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            width: "40%",
            height: "16px",
            borderRadius: "8px",
            background: C.cream,
            marginBottom: "40px",
          }}
        />
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

/* ============ Not-found state ============ */
function NotFoundState({ t }) {
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
          ?
        </div>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "26px",
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {t("blog.notFound") || "Post not found"}
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: "14.5px", lineHeight: 1.7, color: C.body }}>
          The article you're looking for may have been moved or removed.
        </p>
        <Link
          to="/blog"
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
          <FaArrowLeft aria-hidden="true" style={{ fontSize: "12px" }} />
          Back to blog
        </Link>
      </div>
    </div>
  );
}

/* ============ Main component ============ */
export default function BlogDetail() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hoverShare, setHoverShare] = useState(null);
  const [imageHover, setImageHover] = useState(false);
  const articleRef = useRef(null);
  const progress = useReadingProgress();

  useBlogKeyframes();

  useEffect(() => {
    setLoading(true);
    fetchBlogPost(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (loading) return <LoadingState t={t} />;
  if (!post) return <NotFoundState t={t} />;

  const readTime = estimateReadingTime(post.content);
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(
    shareTitle + " — " + shareUrl
  )}`;

  return (
    <div style={{ background: "#fff", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Reading progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${C.gold}, ${C.butter})`,
          zIndex: 100,
          transition: "width 80ms linear",
        }}
      />

      {/* Hero */}
      <header
        style={{
          position: "relative",
          background: `linear-gradient(180deg, ${C.cream} 0%, #ffffff 100%)`,
          padding: "56px 20px 32px",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "20px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "#fff",
              border: `1px solid ${C.lineStrong}`,
              color: C.goldDark,
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0,
              animation: "aaBlogFadeUp 600ms cubic-bezier(0.22,1,0.36,1) 60ms forwards",
            }}
          >
            <FaArrowLeft aria-hidden="true" style={{ fontSize: "10px" }} />
            All articles
          </Link>

          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(28px, 4.4vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: C.ink,
              opacity: 0,
              animation: "aaBlogFadeUp 700ms cubic-bezier(0.22,1,0.36,1) 140ms forwards",
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                margin: "0 0 22px",
                fontSize: "17px",
                lineHeight: 1.7,
                color: C.body,
                maxWidth: "700px",
                opacity: 0,
                animation: "aaBlogFadeUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              fontSize: "13px",
              color: C.muted,
              opacity: 0,
              animation: "aaBlogFadeIn 700ms ease 300ms forwards",
            }}
          >
            {post.author && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <FaUser aria-hidden="true" style={{ color: C.gold }} />
                {post.author}
              </span>
            )}
            {post.createdAt && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <FaCalendarAlt aria-hidden="true" style={{ color: C.gold }} />
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                background: C.cream,
                border: `1px solid ${C.lineStrong}`,
                color: C.goldDark,
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {readTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main
        ref={articleRef}
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "40px 20px 72px",
        }}
      >
        {/* Cover image */}
        {post.image && (
          <div
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              marginBottom: "36px",
              boxShadow: imageHover
                ? "0 30px 60px -24px rgba(122,95,20,0.4)"
                : "0 14px 30px -18px rgba(122,95,20,0.3)",
              transform: imageHover ? "translateY(-2px)" : "translateY(0)",
              transition: "box-shadow 340ms ease, transform 340ms ease",
              opacity: 0,
              animation: "aaBlogFadeUp 800ms cubic-bezier(0.22,1,0.36,1) 120ms forwards",
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                transform: imageHover ? "scale(1.03)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        )}

        {/* Content */}
        <article
          style={{
            fontSize: "17px",
            lineHeight: 1.8,
            color: C.body,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            opacity: 0,
            animation: "aaBlogFadeUp 800ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
          }}
        >
          {post.content}
        </article>

        {/* Share row */}
        <div
          style={{
            marginTop: "56px",
            paddingTop: "28px",
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.gold,
            }}
          >
            Share this article
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href={facebookShare}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              onMouseEnter={() => setHoverShare("fb")}
              onMouseLeave={() => setHoverShare(null)}
              style={{
                display: "grid",
                placeItems: "center",
                width: "42px",
                height: "42px",
                borderRadius: "999px",
                background: hoverShare === "fb" ? "#1877F2" : C.cream,
                color: hoverShare === "fb" ? "#fff" : C.goldDark,
                border: `1px solid ${C.lineStrong}`,
                textDecoration: "none",
                transition: "background 200ms ease, color 200ms ease, transform 200ms ease",
                transform: hoverShare === "fb" ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <FaFacebookF aria-hidden="true" />
            </a>

            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              onMouseEnter={() => setHoverShare("wa")}
              onMouseLeave={() => setHoverShare(null)}
              style={{
                display: "grid",
                placeItems: "center",
                width: "42px",
                height: "42px",
                borderRadius: "999px",
                background: hoverShare === "wa" ? "#25D366" : C.cream,
                color: hoverShare === "wa" ? "#fff" : C.goldDark,
                border: `1px solid ${C.lineStrong}`,
                textDecoration: "none",
                transition: "background 200ms ease, color 200ms ease, transform 200ms ease",
                transform: hoverShare === "wa" ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <FaWhatsapp aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Link copied" : "Copy link"}
              onMouseEnter={() => setHoverShare("copy")}
              onMouseLeave={() => setHoverShare(null)}
              style={{
                display: "grid",
                placeItems: "center",
                width: "42px",
                height: "42px",
                borderRadius: "999px",
                background:
                  copied ? "#10b981" : hoverShare === "copy" ? C.gold : C.cream,
                color: copied || hoverShare === "copy" ? "#fff" : C.goldDark,
                border: `1px solid ${C.lineStrong}`,
                cursor: "pointer",
                transition: "background 200ms ease, color 200ms ease, transform 200ms ease",
                transform: hoverShare === "copy" ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <FaLink aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "transparent",
              border: `1px solid ${C.gold}`,
              color: C.goldDark,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 800,
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
            <FaArrowLeft aria-hidden="true" style={{ fontSize: "11px" }} />
            Back to all articles
          </Link>
        </div>
      </main>
    </div>
  );
}