import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getByPath, translations } from "../i18n/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "aaa-lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && translations[saved] ? saved : "en";
  });

  const setLang = (next) => {
    if (!translations[next]) return;
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.lang = lang === "ne" ? "ne" : lang === "hi" ? "hi" : "en";
  }, [lang]);

  const t = (path) => {
    const value = getByPath(translations[lang], path);
    if (value == null) return getByPath(translations.en, path) ?? path;
    return value;
  };

  const localized = (obj) => {
    if (obj == null || typeof obj !== "object" || Array.isArray(obj)) return obj;
    return obj[lang] ?? obj.en;
  };

  const value = useMemo(() => ({ lang, setLang, t, localized }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
