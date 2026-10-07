import { Link } from "react-router-dom";
import { useI18n } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "../../assets/Logo.png";
import {
  FaFacebookF,
  FaWhatsapp,
  FaLocationArrow,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const footerLinkClass =
  "block py-1 text-sm text-[#c5d0de] transition hover:text-white";

const footerHeadingClass =
  "m-0 mb-4 font-serif text-base font-bold tracking-tight text-white";

const socialBtnClass =
  "grid h-12 w-12 place-items-center rounded-full text-[22px] text-white shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-transform hover:scale-110";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#0b1b30] px-5 pt-16 pb-6 text-[#d5dde8]">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* ---------- Brand / about ---------- */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={Logo}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-white/15 object-cover"
                />
                <h2 className="m-0 font-serif text-lg font-bold tracking-tight text-white">
                  {t("brand")}
                </h2>
              </div>

              <p className="m-0 max-w-[320px] text-sm leading-relaxed text-[#c5d0de]">
                {t("footer.about")}
              </p>

              <div className="mt-5">
                <LanguageSwitcher />
              </div>
            </div>

            {/* ---------- Useful links ---------- */}
            <div>
              <h4 className={footerHeadingClass}>Useful Links</h4>
              <Link to="/privacy-policy" className={footerLinkClass}>
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className={footerLinkClass}>
                Terms &amp; Conditions
              </Link>
            </div>

            {/* ---------- Contact ---------- */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className={footerHeadingClass}>{t("contact.title")}</h4>

              <p className="m-0 flex items-start gap-2.5 py-1 text-sm text-[#c5d0de]">
                <FaLocationArrow className="mt-1 flex-shrink-0 text-[#c9a227]" />
                <span>{t("contact.addressValue")}</span>
              </p>

              <p className="m-0 flex items-start gap-2.5 py-1 text-sm text-[#c5d0de]">
                <FaPhone className="mt-1 flex-shrink-0 text-[#c9a227]" />
                <span>{t("contact.phoneValue")}</span>
              </p>

              <p className="m-0 flex items-start gap-2.5 py-1 text-sm text-[#c5d0de]">
                <FaEnvelope className="mt-1 flex-shrink-0 text-[#c9a227]" />
                <span>{t("contact.emailValue")}</span>
              </p>
            </div>
          </div>

          {/* ---------- Bottom bar ---------- */}
          <div className="mt-10 border-t border-[#22364f] pt-5 text-center text-xs text-[#8fa0b6]">
            © {year} {t("brand")}. {t("footer.rights")}
          </div>
        </div>
      </footer>

      {/* ---------- Floating socials ---------- */}
      <div className="fixed bottom-6 right-5 z-[9999] flex flex-col gap-3">
        <a
          href="https://www.facebook.com/aaatravels"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={`${socialBtnClass} bg-[#1877F2]`}
        >
          <FaFacebookF />
        </a>

        <a
          href="https://wa.me/+9779856031570"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className={`${socialBtnClass} bg-[#25D366]`}
        >
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
}