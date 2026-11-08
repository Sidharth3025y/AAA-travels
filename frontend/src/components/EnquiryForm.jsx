import { useState } from "react";
import { useI18n } from "../context/LanguageContext";
import { mailtoFallback, sendEnquiry } from "../api/services";
import { Link } from "react-router-dom";

export default function EnquiryForm({ packageTitle = "" }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    people: "1",
    notes: "",
  });
  const inputCls =
    "w-full rounded-xl border border-[#e9e0b8] bg-white px-4 py-3 text-[15px] text-[#1f1f1f] placeholder:text-[#a39c86] transition focus:border-[#bc9d2c] focus:outline-none focus:ring-4 focus:ring-[#bc9d2c]/15";

  const onChange = (e) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const message = [
      packageTitle ? `Package: ${packageTitle}` : "",
      form.date ? `Preferred date: ${form.date}` : "",
      form.people ? `Travellers: ${form.people}` : "",
      form.notes,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await sendEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        packageTitle,
        preferredDate: form.date,
        people: form.people,
        message,
      });
      setStatus("ok");
      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        people: "1",
        notes: "",
      });
      setAgreed(false);
    } catch {
      mailtoFallback({ ...form, message });
      setStatus("mail");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
      <input name="name" required placeholder={t("enquire.name")} value={form.name} onChange={onChange} className={inputCls} />
      <input name="email" type="email" required placeholder={t("enquire.email")} value={form.email} onChange={onChange} className={inputCls} />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <input name="phone" placeholder={t("enquire.phone")} value={form.phone} onChange={onChange} className={inputCls} />
        <input name="date" type="date" aria-label={t("enquire.date")} value={form.date} min={today} onChange={onChange} className={inputCls} />
      </div>
      <input name="people" type="number" min="1" placeholder={t("enquire.people")} value={form.people} onChange={onChange} className={inputCls} />
      <textarea name="notes" rows="4" placeholder={t("enquire.notes")} value={form.notes} onChange={onChange} className={`${inputCls} resize-y`} />

      <label className="mt-2 flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-[#3a3626]">
        <input
          type="checkbox"
          name="terms"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#bc9d2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2"
        />
        <span>
          {t("enquire.terms")}{" "}
          <Link to="/terms-conditions" onClick={(e) => e.stopPropagation()} className="font-semibold text-[#7a5f14] underline decoration-[#bc9d2c]/40 underline-offset-2 hover:text-[#5e4910]">
            {t("enquire.termsLink")}
          </Link>{" "}
          {t("enquire.and")}{" "}
          <Link to="/privacy-policy" onClick={(e) => e.stopPropagation()} className="font-semibold text-[#7a5f14] underline decoration-[#bc9d2c]/40 underline-offset-2 hover:text-[#5e4910]">
            {t("enquire.privacyLink")}
          </Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#1f1f1f] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#3a3626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("contact.sending") : t("enquire.submit")}
      </button>

      {status === "ok" && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {t("contact.success")}
        </p>
      )}
      {status === "mail" && (
        <p role="alert" className="rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]">
          {t("contact.error")}
        </p>
      )}
    </form>
  );
}
