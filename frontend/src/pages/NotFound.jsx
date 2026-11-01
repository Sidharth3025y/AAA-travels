import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="page">
      <header className="page-hero">
        <h1>404</h1>
        <p>{t("notFound.body")}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          {t("notFound.home")}
        </Link>
      </header>
    </div>
  );
}
