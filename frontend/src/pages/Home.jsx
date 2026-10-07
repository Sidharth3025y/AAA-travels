import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchPackages } from "../api/packages";
import PackageCard from "../components/PackageCard";
import Testimonials from "../components/Testimonials";
import { COUNTRIES } from "../data/options";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
];

const CATS = [
  { id: "trekking", to: "/packages?category=trekking" },
  { id: "adventure", to: "/packages?category=adventure" },
  { id: "heli", to: "/packages?category=heli" },
  { id: "tour", to: "/packages?category=tour" },
];

export default function Home() {
  const { t } = useI18n();
  const [slide, setSlide] = useState(0);
  const [packages, setPackages] = useState([]);
  const slides = t("hero.slides");
  const featured = packages.filter((p) => p.featured);
  const shown = featured.length ? featured : packages.slice(0, 6);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch(() => setPackages([]));
  }, []);

  return (
    <>
      <section className="hero">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`hero-bg ${i === slide ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="hero-content">
          <p className="eyebrow">{t("brand")}</p>
          <h1>{slides[slide].title}</h1>
          <p className="hero-sub">{slides[slide].subtitle}</p>
          <Link to="/packages" className="btn btn-primary">
            {slides[slide].cta}
          </Link>
        </div>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === slide ? "is-active" : ""}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      <section className="search-bar">
        <form className="search-card" action="/packages">
          <h2>{t("search.title")}</h2>
          <div className="search-grid">
            <label>
              {t("search.category")}
              <select name="category" defaultValue="all">
                <option value="all">{t("search.all")}</option>
                <option value="trekking">{t("search.trekking")}</option>
                <option value="adventure">{t("search.adventure")}</option>
                <option value="heli">{t("search.heli")}</option>
                <option value="tour">{t("search.tour")}</option>
              </select>
            </label>
            <label>
              {t("search.duration")}
              <select name="duration" defaultValue="all">
                <option value="all">{t("search.all")}</option>
                <option value="1-3">{t("search.days13")}</option>
                <option value="4-7">{t("search.days47")}</option>
                <option value="8-12">{t("search.days812")}</option>
                <option value="13+">{t("search.days13plus")}</option>
              </select>
            </label>
            <label>
              {t("search.destination")}
              <select name="destination" defaultValue="all">
                <option value="all">{t("search.all")}</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary" type="submit">
              {t("search.search")}
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">{t("why.eyebrow")}</p>
          <h2>{t("why.title")}</h2>
          <p>{t("why.subtitle")}</p>
        </div>
        <div className="why-grid">
          {t("why.items").map((item) => (
            <article key={item.title} className="why-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="section-head">
          <h2>{t("categories.title")}</h2>
          <p>{t("categories.subtitle")}</p>
        </div>
        <div className="cat-grid">
          {CATS.map((c) => (
            <Link key={c.id} to={c.to} className="cat-card">
              <span>{t(`search.${c.id}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t("featured.title")}</h2>
          <p>{t("featured.subtitle")}</p>
        </div>
        {shown.length === 0 ? (
          <p className="empty">{t("tours.noResults")}</p>
        ) : (
          <div className="pkg-grid">
            {shown.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
        <div className="center">
          <Link to="/packages" className="btn btn-outline">
            {t("featured.all")}
          </Link>
        </div>
      </section>

      <Testimonials />

      <section className="cta-band">
        <h2>{t("cta.title")}</h2>
        <p>{t("cta.subtitle")}</p>
        <Link to="/contact" className="btn btn-light">
          {t("cta.button")}
        </Link>
      </section>
    </>
  );
}
