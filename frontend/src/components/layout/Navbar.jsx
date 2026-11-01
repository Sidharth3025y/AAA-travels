import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "../../assets/Logo.png";

const linkBase =
  "text-sm font-medium transition-colors text-[#0f2744] hover:text-[#1d4ed8]";
const linkActive = "text-[#1d4ed8]";

export default function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/packages", label: t("nav.tours") },
    { to: "/flights", label: t("nav.flights") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6eaf0] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-4 px-5 py-3">
        {/* ---------- Brand ---------- */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-3"
        >
          <img
            src={Logo}
            alt="AAA Travels and Tours"
            className="h-12 w-12 rounded-full border-2 border-[#e6eaf0] object-cover"
          />
          <span className="flex flex-col leading-tight">
            <strong className="font-serif text-base font-bold tracking-tight text-[#0f2744]">
              {t("brand")}
            </strong>
            <em className="hidden text-[0.72rem] not-italic text-[#5b6777] sm:block">
              {t("tagline")}
            </em>
          </span>
        </Link>

        {/* ---------- Desktop nav ---------- */}
        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* ---------- Actions ---------- */}
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <LanguageSwitcher />

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="hidden rounded-full bg-[#1d4ed8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#153e9e] sm:inline-flex"
          >
            {t("nav.enquire")}
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e6eaf0] text-[#0f2744] transition hover:bg-[#f6f4ef] lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ---------- Mobile nav ---------- */}
      {open && (
        <nav className="border-t border-[#e6eaf0] bg-white lg:hidden">
          <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-sm font-semibold transition ${isActive
                    ? "bg-[#f6f4ef] text-[#1d4ed8]"
                    : "text-[#0f2744] hover:bg-[#f6f4ef]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#153e9e]"
            >
              {t("nav.enquire")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}