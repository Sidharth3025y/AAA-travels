import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export default function About() {
  const { t } = useI18n();
  const stats = t("about.stats");

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{t("about.title")}</h1>
      </header>
      <section className="section about-grid">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
          alt=""
        />
        <div>
          <p className="lead">{t("about.intro")}</p>
          <p>{t("about.body")}</p>
          <h3>{t("about.missionTitle")}</h3>
          <p>{t("about.mission")}</p>
          <Link to="/contact" className="btn btn-primary">
            {t("nav.enquire")}
          </Link>
        </div>
      </section>
      <section className="stats-band">
        {stats.map((s) => (
          <div key={s.l}>
            <strong>{s.n}</strong>
            <span>{s.l}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
