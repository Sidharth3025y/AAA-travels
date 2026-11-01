import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchPackage } from "../api/packages";
import EnquiryForm from "../components/EnquiryForm";

export default function PackageDetail() {
  const { id } = useParams();
  const { t, localized } = useI18n();
  const [pkg, setPkg] = useState(null);
  const [loadedId, setLoadedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPackage(id)
      .then((data) => {
        if (!cancelled) setPkg(data);
      })
      .catch(() => {
        if (!cancelled) setPkg(null);
      })
      .finally(() => {
        if (!cancelled) setLoadedId(id);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loaded = loadedId === id;

  if (!loaded) {
    return (
      <div className="page">
        <p className="empty">{t("detail.loading")}</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="page">
        <p className="empty">{t("tours.noResults")}</p>
        <Link to="/packages">{t("detail.back")}</Link>
      </div>
    );
  }

  const title = localized(pkg.title);

  const highlights = localized(pkg.highlights) || [];
  const itinerary = localized(pkg.itinerary) || [];
  const includes = localized(pkg.includes) || [];

  return (
    <div className="page">
      <div className="detail-hero" style={{ backgroundImage: `url(${pkg.image})` }}>
        <div>
          <Link to="/packages" className="back-link">
            ← {t("detail.back")}
          </Link>
          <h1>{title}</h1>
          <p>
            {pkg.days} {t("featured.days")} · {pkg.destination} · {t(`search.${pkg.category}`)}
          </p>
        </div>
      </div>
      <section className="section detail-layout">
        <div>
          <h2>{t("detail.overview")}</h2>
          <p>{localized(pkg.overview)}</p>
          <h2>{t("detail.highlights")}</h2>
          <ul className="check-list">
            {highlights.map((h, i) => (
              <li key={`${h}-${i}`}>{h}</li>
            ))}
          </ul>
          <h2>{t("detail.itinerary")}</h2>
          <ol className="itinerary">
            {itinerary.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <h2>{t("detail.includes")}</h2>
          <ul className="check-list">
            {includes.map((h, i) => (
              <li key={`${h}-${i}`}>{h}</li>
            ))}
          </ul>
        </div>
        <aside className="detail-aside">
          <p className="price">
            {t("featured.from")} US${Number(pkg.priceUsd || pkg.price) || ""}
            <small> {t("detail.perPerson")}</small>
          </p>
          <p>
            <strong>NPR:</strong> {pkg.priceNpr != null ? pkg.priceNpr : "—"}
          </p>
          <p>
            <strong>{t("detail.duration")}:</strong> {pkg.days} {t("featured.days")}
          </p>
          <p>
            <strong>{t("detail.destination")}:</strong> {pkg.destination}
          </p>
          <p>
            <strong>{t("detail.category")}:</strong> {t(`search.${pkg.category}`)}
          </p>
          <h3>{t("detail.enquire")}</h3>
          <EnquiryForm packageTitle={title} />
        </aside>
      </section>
    </div>
  );
}
