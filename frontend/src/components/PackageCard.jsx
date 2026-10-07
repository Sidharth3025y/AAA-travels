import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export default function PackageCard({ pkg }) {
  const { t, localized } = useI18n();
  const catLabel = t(`search.${pkg.category}`);
  return (
    <article className="pkg-card">
      <Link to={`/packages/${pkg.id}`} className="pkg-media">
        <img src={pkg.image} alt="" />
        <span className="pkg-days">
          {pkg.days} {t("featured.days")}
        </span>
      </Link>
      <div className="pkg-body">
        <p className="pkg-meta">
          {pkg.destination} · {catLabel}
        </p>
        <h3>
          <Link to={`/packages/${pkg.id}`}>{localized(pkg.title)}</Link>
        </h3>
        <p>{localized(pkg.summary)}</p>
        <div className="pkg-foot">
          <strong>
            {t("featured.from")} US$ {pkg.priceUsd ?? pkg.price}
            {pkg.priceNpr != null ? ` · NPR ${pkg.priceNpr}` : ""}
          </strong>
          <Link to={`/packages/${pkg.id}`}>{t("featured.view")}</Link>
        </div>
      </div>
    </article>
  );
}
