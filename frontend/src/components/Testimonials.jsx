import { useEffect, useState } from "react";
import {
  FaGoogle,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useI18n } from "../context/LanguageContext";
import { fetchTestimonials } from "../api/services";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=aaa+travels+pokhara#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,1";

const RATE_US_URL =
  "https://www.google.com/search?q=aaa+travels+pokhara#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,3";

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
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 600) setVisibleCards(1);
      else if (window.innerWidth <= 950) setVisibleCards(2);
      else setVisibleCards(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [reviews.length, visibleCards]);

  const maxIndex = Math.max(0, reviews.length - visibleCards);

  useEffect(() => {
    if (reviews.length <= visibleCards) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [reviews.length, visibleCards, maxIndex]);

  const nextSlide = () => {
    setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  const previousSlide = () => {
    setActiveIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const cardWidth =
    visibleCards === 1
      ? "100%"
      : visibleCards === 2
        ? "calc(50% - 11px)"
        : "calc(33.333% - 14.7px)";

  return (
    <section
      style={{
        padding: "85px 20px",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "45px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "8px 17px",
              borderRadius: "50px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 5px 18px rgba(15, 23, 42, 0.07)",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "18px",
            }}
          >
            <FaGoogle style={{ color: "#4285F4", fontSize: "18px" }} />
            Google Reviews
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: "800",
              color: "#14213d",
              letterSpacing: "-0.8px",
            }}
          >
            {t("testimonials.title")}
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              color: "#64748b",
              lineHeight: "1.75",
              fontSize: "16px",
            }}
          >
            {t("testimonials.subtitle")}
          </p>
        </div>

        {loading ? (
          <p className="empty">{t("detail.loading")}</p>
        ) : reviews.length === 0 ? (
          <p className="empty">{t("testimonials.empty")}</p>
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
                    left: -8,
                    top: "42%",
                    zIndex: 2,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
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
                    right: -8,
                    top: "42%",
                    zIndex: 2,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
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
                  gap: 22,
                  transform: `translateX(-${activeIndex * (100 / visibleCards)}%)`,
                  transition: "transform 0.45s ease",
                }}
              >
                {reviews.map((review) => (
                  <article
                    key={review._id || review.name}
                    style={{
                      flex: `0 0 ${cardWidth}`,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 18,
                      padding: 24,
                      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                      minHeight: 220,
                    }}
                  >
                    <div style={{ display: "flex", gap: 4, color: "#fbbc04", marginBottom: 12 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          style={{ opacity: i < (review.rating || 5) ? 1 : 0.25 }}
                        />
                      ))}
                    </div>
                    <p style={{ margin: "0 0 18px", color: "#334155", lineHeight: 1.7 }}>
                      “{review.quote}”
                    </p>
                    <strong style={{ display: "block", color: "#0f2744" }}>{review.name}</strong>
                    <span style={{ color: "#64748b", fontSize: 13 }}>
                      {review.location}
                      {review.reviewDate ? ` · ${review.reviewDate}` : ""}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "45px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 25px",
              borderRadius: "10px",
              background: "#1c89ad",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "700",
              boxShadow: "0 8px 20px rgba(20, 33, 61, 0.18)",
            }}
          >
            <FaGoogle />
            Read all reviews on Google
          </a>
          <a
            href={RATE_US_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 25px",
              borderRadius: "10px",
              background: "#257da6",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "700",
              boxShadow: "0 8px 20px rgba(20, 33, 61, 0.18)",
            }}
          >
            <FaGoogle />
            {t("testimonials.rateUs")}
          </a>
        </div>
      </div>
    </section>
  );
}
