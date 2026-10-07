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
  "https://www.google.com/search?q=aaa+travels+pokhara&oq=aaa+travels+pokhara&sourceid=chrome&ie=UTF-8#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,1,,,,";

const RATE_US_URL = "https://www.google.com/search?q=aaa+travels+pokhara&oq=aaa+travels+pokhara&sourceid=chrome&ie=UTF-8#lrd=0x399594e6a95ea585:0xe9c99ae3f13a2033,3,,,,";
export default function Testimonials() {
  const { t } = useI18n();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  /*
   * LOAD REVIEWS
   */
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      try {
        const data = await fetchTestimonials();

        if (mounted) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);

        if (mounted) {
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * RESPONSIVE CARD COUNT
   */
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 600) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 950) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateCards();

    window.addEventListener("resize", updateCards);

    return () => {
      window.removeEventListener("resize", updateCards);
    };
  }, []);

  /*
   * RESET SLIDER
   */
  useEffect(() => {
    setActiveIndex(0);
  }, [reviews.length, visibleCards]);

  const maxIndex = Math.max(
    0,
    reviews.length - visibleCards
  );

  /*
   * AUTO SLIDE
   */
  useEffect(() => {
    if (reviews.length <= visibleCards) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= maxIndex) {
          return 0;
        }

        return current + 1;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [reviews.length, visibleCards, maxIndex]);

  const nextSlide = () => {
    setActiveIndex((current) => {
      if (current >= maxIndex) {
        return 0;
      }

      return current + 1;
    });
  };

  const previousSlide = () => {
    setActiveIndex((current) => {
      if (current <= 0) {
        return maxIndex;
      }

      return current - 1;
    });
  };

  /*
   * CARD WIDTH
   */
  const cardWidth =
    visibleCards === 1
      ? "100%"
      : visibleCards === 2
        ? "calc(50% - 11px)"
        : "calc(33.333% - 14.7px)";

  /*
   * INITIAL / EMPTY / LOADING
   */
  return (
    <section
      style={{
        padding: "85px 20px",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "45px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "8px 17px",
              borderRadius: "50px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 5px 18px rgba(15, 23, 42, 0.07)",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "18px",
            }}
          >
            <FaGoogle
              style={{
                color: "#4285F4",
                fontSize: "18px",
              }}
            />

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

        {/* GOOGLE SUMMARY */}





        <div
          style={{
            textAlign: "center",
            marginTop: "45px",
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
              boxShadow:
                "0 8px 20px rgba(20, 33, 61, 0.18)",
              marginRight: "150px",
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
              boxShadow:
                "0 8px 20px rgba(20, 33, 61, 0.18)",

            }}
          >
            <FaGoogle />
            Review Us
          </a>
        </div>
      </div>
    </section>
  );
}