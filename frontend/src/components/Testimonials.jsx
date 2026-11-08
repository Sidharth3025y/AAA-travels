import { useEffect, useState } from "react";
import { FaGoogle, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useI18n } from "../context/LanguageContext";
import { fetchTestimonials } from "../api/services";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=aaa+travels+pokhara#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,1";
const RATE_US_URL =
  "https://www.google.com/search?q=aaa+travels+pokhara#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,3";

const CREAM = "#fdfaed";
const BORDER = "#efe9cf";
const YELLOW = "#bc9d2c";
const YELLOW_DARK = "#7a5f14";
const INK = "#1f1f1f";
const BODY = "#3a3626";
const MUTED = "#8a8676";

export default function Testimonials() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    let mounted = true;
    const loadReviews = async () => {
      try {
        const data = await fetchTestimonials();
        if (mounted) setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadReviews();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 640) setVisibleCards(1);
      else if (window.innerWidth <= 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  useEffect(() => { setActiveIndex(0); }, [reviews.length, visibleCards]);

  const maxIndex = Math.max(0, reviews.length - visibleCards);

  useEffect(() => {
    if (reviews.length <= visibleCards) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((c) => (c >= maxIndex ? 0 : c + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length, visibleCards, maxIndex]);

  const nextSlide = () => setActiveIndex((c) => (c >= maxIndex ? 0 : c + 1));
  const previousSlide = () => setActiveIndex((c) => (c <= 0 ? maxIndex : c - 1));

  const cardWidth =
    visibleCards === 1 ? "100%" : visibleCards === 2 ? "calc(50% - 10px)" : "calc(33.333% - 13.4px)";

  return (
    <section style={{ background: CREAM, padding: "72px 20px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px", maxWidth: "640px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              color: YELLOW_DARK,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            <FaGoogle style={{ color: "#4285F4", fontSize: "14px" }} aria-hidden="true" />
            Google Reviews
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(28px, 3.4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: INK,
            }}
          >
            {t("testimonials.title")}
          </h2>
          <p style={{ marginTop: "12px", marginBottom: 0, fontSize: "16px", lineHeight: 1.7, color: BODY }}>
            {t("testimonials.subtitle")}
          </p>
        </div>

        {loading ? (
          <p style={{ padding: "60px 0", textAlign: "center", color: MUTED }}>{t("detail.loading")}</p>
        ) : reviews.length === 0 ? (
          <p style={{ padding: "60px 0", textAlign: "center", color: MUTED }}>{t("testimonials.empty")}</p>
        ) : (
          <div style={{ position: "relative" }}>
            {reviews.length > visibleCards && (
              <>
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous reviews"
                  style={{
                    position: "absolute",
                    left: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: 44,
                    height: 44,
                    borderRadius: "999px",
                    border: `1px solid ${BORDER}`,
                    background: "#fff",
                    color: YELLOW_DARK,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(122,95,20,0.08)",
                  }}
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next reviews"
                  style={{
                    position: "absolute",
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: 44,
                    height: 44,
                    borderRadius: "999px",
                    border: `1px solid ${BORDER}`,
                    background: "#fff",
                    color: YELLOW_DARK,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(122,95,20,0.08)",
                  }}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`,
                  transition: "transform 500ms ease",
                }}
              >
                {reviews.map((review) => (
                  <article
                    key={review._id || review.name}
                    style={{
                      flex: `0 0 ${cardWidth}`,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "240px",
                      background: "#fff",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 1px 2px rgba(122,95,20,0.04), 0 12px 28px -16px rgba(122,95,20,0.18)",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "4px", color: "#fbbc04", marginBottom: "16px" }}
                      aria-label={`${review.rating || 5} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          aria-hidden="true"
                          style={{ opacity: i < (review.rating || 5) ? 1 : 0.22 }}
                        />
                      ))}
                    </div>
                    <p style={{ margin: "0 0 20px", flex: 1, fontSize: "15px", lineHeight: 1.7, color: BODY }}>
                      “{review.quote}”
                    </p>
                    <div>
                      <strong style={{ display: "block", fontSize: "15px", fontWeight: 700, color: INK }}>
                        {review.name}
                      </strong>
                      <span style={{ fontSize: "12px", color: MUTED }}>
                        {review.location}
                        {review.reviewDate ? ` · ${review.reviewDate}` : ""}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "48px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "48px",
              padding: "12px 24px",
              borderRadius: "999px",
              background: INK,
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <FaGoogle aria-hidden="true" />
            Read all reviews on Google
          </a>
          <a
            href={RATE_US_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "48px",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              color: YELLOW_DARK,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <FaGoogle aria-hidden="true" />
            {t("testimonials.rateUs")}
          </a>
        </div>
      </div>
    </section>
  );
}