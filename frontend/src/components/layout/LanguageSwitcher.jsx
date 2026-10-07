import { useI18n } from "../../context/LanguageContext";

const OPTIONS = [
  { id: "en", native: "English" },
  { id: "ne", native: "नेपाली" },
  { id: "hi", native: "हिन्दी" },
];

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, t } = useI18n();

  const selectClass =
    "cursor-pointer rounded-full border border-[#e6eaf0] bg-white text-[#0f2744] " +
    "transition hover:border-[#1d4ed8] " +
    "focus:border-[#1d4ed8] focus:outline-none focus:ring-4 focus:ring-[#1d4ed8]/12 " +
    (compact ? "px-3 py-1.5 text-xs " : "px-3.5 py-2 text-sm ");

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{t("lang.label")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label={t("lang.label")}
        className={selectClass}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.native}
          </option>
        ))}
      </select>
    </label>
  );
}