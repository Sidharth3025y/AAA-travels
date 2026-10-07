import { useState } from "react";
import { useI18n } from "../context/LanguageContext";
import { bookFlight } from "../api/services";
import { Link } from "react-router-dom";

export default function Flights() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    contact: "",
    from: "",
    to: "",
    date: "",
    people: 1,
    terms: "agreed",
  });
  const today = new Date().toISOString().split("T")[0];
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await bookFlight(form);
      setStatus("ok");
      setForm({
        guestName: "",
        guestEmail: "",
        contact: "",
        from: "",
        to: "",
        date: "",
        terms: "I agree to the",
        termsLink: "Terms & Conditions",
        and: "and",
        privacyLink: "Privacy Policy",

        people: "1",
      });
    } catch {
      setStatus("err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{t("flights.title")}</h1>
        <p>{t("flights.subtitle")}</p>
      </header>
      <section className="section contact-grid">
        <form className="enquiry-form" onSubmit={onSubmit}>
          <input name="guestName" required placeholder={t("enquire.name")} value={form.guestName} onChange={onChange} />
          <input name="guestEmail" type="email" required placeholder={t("enquire.email")} value={form.guestEmail} onChange={onChange} />
          <input name="contact" required placeholder={t("enquire.phone")} value={form.contact} onChange={onChange} />
          <input name="from" required placeholder={t("flights.from")} value={form.from} onChange={onChange} />
          <input name="to" required placeholder={t("flights.to")} value={form.to} onChange={onChange} />
          <input name="date" type="date" required value={form.date} min={today}
            onChange={onChange} />
          <input name="people" type="number" min="1" required placeholder={t("flights.pax")} value={form.people} onChange={onChange} />
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              marginTop: "15px",
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            <input
              type="checkbox"
              name="terms"
              required
              style={{
                width: "16px",
                height: "16px",
                marginTop: "3px",
                flexShrink: 0,
                cursor: "pointer",
              }}
            />

            <span>
              {t("enquire.terms")}{" "}

              <Link
                to="/terms-conditions"
                style={{
                  color: "#d32f2f",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {t("enquire.termsLink")}
              </Link>{" "}

              {t("enquire.and")}{" "}

              <Link
                to="/privacy-policy"
                style={{
                  color: "#d32f2f",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {t("enquire.privacyLink")}
              </Link>
            </span>
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("contact.sending") : t("flights.submit")}
          </button>
          {status === "ok" && <p className="form-ok">{t("flights.success")}</p>}
          {status === "err" && <p className="form-err">{t("contact.error")}</p>}
        </form>
        <div className="contact-cards">
          <article>
            <h3>{t("flights.helpTitle")}</h3>
            <p>{t("flights.helpBody")}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
