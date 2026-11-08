import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "../../assets/Logo.png";

export default function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/packages", label: t("nav.tours") },
    { to: "/flights", label: t("nav.flights") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/blog", label: t("nav.blog") },
  ];

  /* ---------- shared link styles ---------- */
  const desktopLink = (isActive) =>
    [
      // Increased text size from text-sm (14px) to text-[15px] or text-base (16px)
      "relative rounded-full px-3 py-2 text-[15px] font-medium tracking-[-0.01em]",
      "transition-colors duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2",
      "after:pointer-events-none after:absolute after:inset-x-4 after:bottom-1 after:h-[2px]",
      "after:origin-center after:scale-x-0 after:rounded-full after:bg-[#bc9d2c]",
      "after:transition-transform after:duration-300 after:ease-out",
      isActive
        ? "text-[#bc9d2c] after:scale-x-100"
        : "text-[#2d2d2d]/75 hover:text-[#2d2d2d] hover:after:scale-x-100",
    ].join(" ");

  const mobileLink = (isActive) =>
    [
      // Increased text size for mobile links
      "group relative flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2",
      "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2",
      "before:rounded-full before:bg-[#bc9d2c] before:transition-opacity before:duration-300",
      isActive
        ? "bg-[#fdfaed] text-[#bc9d2c] before:opacity-100"
        : "text-[#2d2d2d] before:opacity-0 hover:bg-[#fdfaed] hover:translate-x-0.5",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_0_rgba(188,157,44,0.1),0_10px_30px_-24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      {/* Thin accent line matching logo gold */}
      <div className="h-0.75 w-full bg-linear-to-r from-[#fdfaed] via-[#bc9d2c] to-[#fdfaed]" />

      <div className="mx-auto flex h-16 max-w-295 items-center gap-3 px-4 sm:h-20 sm:px-5">
        {/* ---------- Brand ---------- */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex min-w-0 shrink-0 items-center gap-3.5"
        >
          <img
            src={Logo}
            alt="AAA Travels and Tours"
            className="h-10 w-10 rounded-full border-2 border-[#f0ebd5] bg-white object-cover transition-all duration-500 ease-out group-hover:border-[#bc9d2c]/50 group-hover:shadow-[0_0_0_4px_rgba(188,157,44,0.15)] sm:h-14 sm:w-14"
          />
          <span className="flex min-w-0 flex-col leading-tight">
            {/* Brand name increased to text-lg on desktop */}
            <strong className="truncate font-serif text-base font-bold tracking-tight text-[#1f1f1f] transition-colors duration-300 group-hover:text-[#bc9d2c] sm:text-lg">
              {t("brand")}
            </strong>
            {/* Tagline slightly increased to text-xs (12px) */}
            <em className="hidden truncate text-xs not-italic tracking-wide text-[#6b6b6b] sm:block">
              {t("tagline")}
            </em>
          </span>
        </Link>

        {/* ---------- Desktop nav ---------- */}
        <nav className="mx-auto hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => desktopLink(isActive)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* ---------- Actions ---------- */}
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <LanguageSwitcher />

          {/* CTA Button text increased to text-base (16px) */}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="group relative hidden overflow-hidden rounded-full border border-[#f0ebd5] bg-[#ffed9b] px-6 py-3 text-base font-bold text-[#8a6d1c] shadow-[0_4px_12px_-4px_rgba(188,157,44,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#bc9d2c] hover:bg-[#bc9d2c] hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(188,157,44,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2 active:translate-y-0 xl:inline-flex xl:items-center xl:gap-2"
          >
            <span className="relative z-10">{t("nav.enquire")}</span>
            <svg
              className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          </Link>

          {/* ---------- Hamburger ---------- */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#f0ebd5] bg-white text-[#2d2d2d] transition-colors duration-300 hover:border-[#bc9d2c]/50 hover:bg-[#fdfaed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2 xl:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300 ease-out ${open ? "scale-x-0 opacity-0" : "opacity-100"
                  }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-out ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ---------- Mobile nav (animated collapse) ---------- */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-all duration-300 ease-out xl:hidden ${open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="border-t border-[#f0ebd5] bg-white">
            <div className="mx-auto flex max-w-295 flex-col gap-1.5 px-5 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => mobileLink(isActive)}
                >
                  {l.label}
                  <svg
                    className="h-5 w-5 opacity-30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </NavLink>
              ))}

              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#f0ebd5] bg-[#fdfaed] px-5 py-3.5 text-base font-bold text-[#8a6d1c] transition-colors duration-300 hover:border-[#bc9d2c] hover:bg-[#bc9d2c] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bc9d2c] focus-visible:ring-offset-2"
              >
                {t("nav.enquire")}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}