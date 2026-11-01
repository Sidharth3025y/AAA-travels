import { useState } from "react";
import { useI18n } from "../context/LanguageContext";
import { mailtoFallback, sendEnquiry } from "../api/services";

export default function Contact() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await sendEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `${form.phone ? `Phone: ${form.phone}\n` : ""}${form.message}`,
      });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      mailtoFallback(form);
      setStatus("mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-hero">
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.subtitle")}</p>
      </header>
      <section className="section contact-grid">
        <form className="enquiry-form" onSubmit={onSubmit}>
          <input name="name" required placeholder={t("contact.name")} value={form.name} onChange={onChange} />
          <input name="email" type="email" required placeholder={t("contact.email")} value={form.email} onChange={onChange} />
          <input name="phone" placeholder={t("contact.phone")} value={form.phone} onChange={onChange} />
          <textarea name="message" required rows="6" placeholder={t("contact.message")} value={form.message} onChange={onChange} />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t("contact.sending") : t("contact.send")}
          </button>
          {status === "ok" && <p className="form-ok">{t("contact.success")}</p>}
          {status === "mail" && <p className="form-err">{t("contact.error")}</p>}
        </form>
        <div className="contact-cards">
          <article>
            <h3>{t("contact.address")}</h3>
            <p>{t("contact.addressValue")}</p>
          </article>
          <article>
            <h3>{t("contact.phone")}</h3>
            <p>{t("contact.phoneValue")}</p>
          </article>
          <article>
            <h3>{t("contact.email")}</h3>
            <p>{t("contact.emailValue")}</p>
          </article>
          <article>
            <h3>{t("contact.hours")}</h3>
            <p>{t("contact.hoursValue")}</p>
          </article>
        </div>
      </section>
      <section className="section map-wrap">
        <iframe
          title="map"
          src="https://www.google.com/maps?q=AAAtravels+Pokhara+Kaski+Nepal&output=embed"
          className="map-frame"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
