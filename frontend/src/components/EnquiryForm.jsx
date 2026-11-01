import { useState } from "react";
import { useI18n } from "../context/LanguageContext";
import { mailtoFallback, sendEnquiry } from "../api/services";
import { Link } from "react-router-dom";

export default function EnquiryForm({ packageTitle = "" }) {
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    people: "2",
    notes: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const message = [
      packageTitle ? `Package: ${packageTitle}` : "General enquiry",
      form.date ? `Preferred date: ${form.date}` : "",
      form.people ? `Travellers: ${form.people}` : "",
      form.notes,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await sendEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        packageTitle,
        preferredDate: form.date,
        people: form.people,
        message: `${form.phone ? `Phone: ${form.phone}\n` : ""}${message}`,
      });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", date: "", people: "2", notes: "" });
      setAgreed(false);
    } catch {
      mailtoFallback({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message,
      });
      setStatus("mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="enquiry-form" onSubmit={onSubmit}>
      <input name="name" required placeholder={t("enquire.name")} value={form.name} onChange={onChange} />
      <input name="email" type="email" required placeholder={t("enquire.email")} value={form.email} onChange={onChange} />
      <input name="phone" placeholder={t("enquire.phone")} value={form.phone} onChange={onChange} />
      <input name="date" type="date" placeholder={t("enquire.date")} value={form.date} min={new Date().toISOString().split("T")[0]}
        onChange={onChange} />
      <input name="people" type="number" min="1" placeholder={t("enquire.people")} value={form.people} onChange={onChange} />
      <textarea name="notes" rows="4" placeholder={t("enquire.notes")} value={form.notes} onChange={onChange} />
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
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
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
        {loading ? t("contact.sending") : t("enquire.submit")}
      </button>
      {status === "ok" && <p className="form-ok">{t("contact.success")}</p>}
      {status === "mail" && <p className="form-err">{t("contact.error")}</p>}
    </form>
  );
}
