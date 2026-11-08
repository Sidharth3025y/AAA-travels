import { Link } from "react-router-dom";
import { useState } from "react";
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



/* ===== Tokens ===== */
const C = {
  bg: "#0b1b30",
  ink: "#d5dde8",
  inkSoft: "#c5d0de",
  inkMuted: "#8fa0b6",
  gold: "#c9a227",
  line: "#22364f",
};


/* ===== Shared styles ===== */
const footerHeadingStyle = {
  margin: "0 0 16px",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  color: "#ffffff",
  position: "relative",
  paddingBottom: "10px",
};

const underlineStyle = {
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "28px",
  height: "2px",
  background: C.gold,
  borderRadius: "2px",
};

const footerLinkBase = {
  display: "block",
  padding: "5px 0",
  fontSize: "14px",
  textDecoration: "none",
  transition: "color 180ms ease, transform 180ms ease",
};

const socialBtnBase = {
  display: "grid",
  placeItems: "center",
  height: "52px",
  width: "52px",
  borderRadius: "999px",
  color: "#fff",
  fontSize: "22px",
  textDecoration: "none",
  boxShadow: "0 6px 18px rgba(0,0,0,0.32)",
  transition: "transform 200ms ease, box-shadow 200ms ease",
};

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const [hovered, setHovered] = useState(null);
  const [fbHover, setFbHover] = useState(false);
  const [waHover, setWaHover] = useState(false);

  const quickLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/packages", label: t("nav.tours") },
    { to: "/flights", label: t("nav.flights") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const legalLinks = [
    { to: "/privacy-policy", label: t("enquire.privacyLink") },
    { to: "/terms-conditions", label: t("enquire.termsLink") },
  ];

  const contacts = [
    { Icon: FaLocationArrow, value: t("contact.addressValue") },
    { Icon: FaPhone, value: t("contact.phoneValue") },
    { Icon: FaEnvelope, value: t("contact.emailValue") },
  ];

  return (
    <>
      <footer
        style={{
          background: C.bg,
          padding: "64px 20px 24px",
          color: C.ink,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {/* Top grid */}
          <div
            className="aa-footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
              gap: "40px",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={Logo}
                  alt="AAA Travels and Tours"
                  style={{
                    height: "48px",
                    width: "48px",
                    borderRadius: "999px",
                    border: "2px solid rgba(255,255,255,0.15)",
                    objectFit: "cover",
                  }}
                />
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "#fff",
                  }}
                >
                  {t("brand")}
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  maxWidth: "320px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: C.inkSoft,
                }}
              >
                {t("footer.about")}
              </p>

              <div style={{ marginTop: "20px" }}>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={footerHeadingStyle}>
                {t("footer.quick")}
                <span aria-hidden="true" style={underlineStyle} />
              </h4>
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    ...footerLinkBase,
                    color: hovered === l.to ? "#fff" : C.inkSoft,
                    transform: hovered === l.to ? "translateX(4px)" : "translateX(0)",
                  }}
                  onMouseEnter={() => setHovered(l.to)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={footerHeadingStyle}>
                {t("footer.legal")}
                <span aria-hidden="true" style={underlineStyle} />
              </h4>
              {legalLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    ...footerLinkBase,
                    color: hovered === l.to ? "#fff" : C.inkSoft,
                    transform: hovered === l.to ? "translateX(4px)" : "translateX(0)",
                  }}
                  onMouseEnter={() => setHovered(l.to)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={footerHeadingStyle}>
                {t("contact.title")}
                <span aria-hidden="true" style={underlineStyle} />
              </h4>
              {contacts.map(({ Icon, value }, i) => (
                <p
                  key={i}
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "5px 0",
                    fontSize: "14px",
                    lineHeight: 1.55,
                    color: C.inkSoft,
                  }}
                >
                  <Icon
                    aria-hidden="true"
                    style={{ marginTop: "4px", flexShrink: 0, color: C.gold }}
                  />
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: "48px",
              paddingTop: "20px",
              borderTop: `1px solid ${C.line}`,
              textAlign: "center",
              fontSize: "12px",
              color: C.inkMuted,
              letterSpacing: "0.02em",
            }}
          >
            © {year} {t("brand")}. {t("footer.rights")}
          </div>
        </div>
      </footer>

      {/* Floating socials */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <a
          href="https://www.facebook.com/aaatravels"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          onMouseEnter={() => setFbHover(true)}
          onMouseLeave={() => setFbHover(false)}
          style={{
            ...socialBtnBase,
            background: "#1877F2",
            transform: fbHover ? "scale(1.1) translateY(-2px)" : "scale(1)",
            boxShadow: fbHover
              ? "0 12px 26px rgba(24,119,242,0.5)"
              : "0 6px 18px rgba(0,0,0,0.32)",
          }}
        >
          <FaFacebookF aria-hidden="true" />
        </a>

        <a
          href="https://wa.me/9779856031570"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          onMouseEnter={() => setWaHover(true)}
          onMouseLeave={() => setWaHover(false)}
          style={{
            ...socialBtnBase,
            background: "#25D366",
            transform: waHover ? "scale(1.1) translateY(-2px)" : "scale(1)",
            boxShadow: waHover
              ? "0 12px 26px rgba(37,211,102,0.5)"
              : "0 6px 18px rgba(0,0,0,0.32)",
          }}
        >
          <FaWhatsapp aria-hidden="true" />
        </a>
      </div>

      {/* Responsive grid — one external rule for footer columns */}
      <style>{`
        @media (max-width: 1024px) {
          .aa-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .aa-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </>
  );
}