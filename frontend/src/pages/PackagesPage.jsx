import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import { fetchPackages, filterPackages } from "../api/packages";
import PackageCard from "../components/PackageCard";
import { COUNTRIES } from "../data/options";

export default function PackagesPage() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = params.get("category") || "all";
  const duration = params.get("duration") || "all";
  const destination = params.get("destination") || "all";

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(
    () => filterPackages(packages, { category, duration, destination }),
    [packages, category, duration, destination]
  );

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{t("tours.title")}</h1>
        <p>{t("tours.subtitle")}</p>
      </header>
      <section className="section">
        <div className="filters">
          <label>
            {t("search.category")}
            <select value={category} onChange={(e) => update("category", e.target.value)}>
              <option value="all">{t("search.all")}</option>
              <option value="trekking">{t("search.trekking")}</option>
              <option value="adventure">{t("search.adventure")}</option>
              <option value="heli">{t("search.heli")}</option>
              <option value="tour">{t("search.tour")}</option>
            </select>
          </label>
          <label>
            {t("search.duration")}
            <select value={duration} onChange={(e) => update("duration", e.target.value)}>
              <option value="all">{t("search.all")}</option>
              <option value="1-3">{t("search.days13")}</option>
              <option value="4-7">{t("search.days47")}</option>
              <option value="8-12">{t("search.days812")}</option>
              <option value="13+">{t("search.days13plus")}</option>
            </select>
          </label>
          <label>
            {t("search.destination")}
            <select value={destination} onChange={(e) => update("destination", e.target.value)}>
              <option value="all">{t("search.all")}</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <p className="empty">{t("detail.loading")}</p>
        ) : list.length === 0 ? (
          <p className="empty">{t("tours.noResults")}</p>
        ) : (
          <div className="pkg-grid">
            {list.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
