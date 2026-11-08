import { useEffect, useRef, useState } from "react";
import { FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";

/* ===== Tokens (light, white + soft yellow) ===== */
const C = {
    cream: "#fdfaed",
    butter: "#ffed9b",
    gold: "#bc9d2c",
    goldDark: "#7a5f14",
    ink: "#1f1f1f",
    body: "#5b5646",
    muted: "#8a8676",
    border: "#efe9cf",
    borderStrong: "#e6d9a3",
};

/* ===== Keyframes (injected once) ===== */
const KEY_ID = "aa-partners-kf";
function usePartnersKeyframes() {
    useEffect(() => {
        if (typeof document === "undefined" || document.getElementById(KEY_ID)) return;
        const el = document.createElement("style");
        el.id = KEY_ID;
        el.textContent = `
      @keyframes aaPUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes aaPShimmer {
        0%   { background-position: -180% 0; }
        100% { background-position: 180% 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }
    `;
        document.head.appendChild(el);
    }, []);
}

/* ===== In-view observer ===== */
function useInView() {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") {
            setSeen(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setSeen(true);
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return [ref, seen];
}

/* ===== Partner data ===== */
const PARTNERS = [
    {
        key: "iata",
        name: "IATA",
        full: "International Air Transport Association",
        href: "https://www.iata.org/",
        accent: "#0b3d6e",
        glyph: "IA",
        note: "Accredited agency",
    },
    {
        key: "ntb",
        name: "NTB",
        full: "Nepal Tourism Board",
        href: "https://ntb.gov.np/",
        accent: "#a01b1b",
        glyph: "NT",
        note: "Government of Nepal",
    },
    {
        key: "naata",
        name: "NAATA",
        full: "Nepal Association of Tour & Travel Agents — Gandaki",
        href: "https://nattagandaki.org.np/member/aaa-travels-pvt-ltd/",
        accent: "#0f6b4f",
        glyph: "NA",
        note: "Member · Gandaki",
    },
];

export default function AssociatePartners() {
    usePartnersKeyframes();
    const [ref, seen] = useInView();
    const [hover, setHover] = useState(null);

    return (
        <section
            ref={ref}
            aria-labelledby="aa-partners-h"
            style={{
                position: "relative",
                background: `linear-gradient(180deg, #ffffff 0%, ${C.cream} 100%)`,
                padding: "72px 20px 80px",
                overflow: "hidden",
                borderTop: `1px solid ${C.border}`,
            }}
        >
            {/* Decorative soft-yellow blobs */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                        "radial-gradient(560px circle at 12% 0%, rgba(255,237,155,0.45), transparent 60%), radial-gradient(520px circle at 88% 100%, rgba(255,237,155,0.35), transparent 60%)",
                }}
            />

            <div style={{ position: "relative", maxWidth: "1120px", margin: "0 auto" }}>
                {/* Header */}
                <header style={{ textAlign: "center", marginBottom: "48px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 14px",
                            borderRadius: "999px",
                            background: "#fff",
                            border: `1px solid ${C.borderStrong}`,
                            color: C.goldDark,
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            marginBottom: "18px",
                            opacity: seen ? 1 : 0,
                            transform: seen ? "translateY(0)" : "translateY(10px)",
                            transition: "opacity 600ms ease, transform 600ms ease",
                        }}
                    >
                        <FaShieldAlt aria-hidden="true" style={{ color: C.gold }} />
                        Association Partners
                    </div>

                    <h2
                        id="aa-partners-h"
                        style={{
                            margin: 0,
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "clamp(26px, 3.4vw, 36px)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: C.ink,
                            lineHeight: 1.15,
                            opacity: seen ? 1 : 0,
                            transform: seen ? "translateY(0)" : "translateY(12px)",
                            transition: "opacity 700ms ease 80ms, transform 700ms ease 80ms",
                        }}
                    >
                        Our Associate Partners
                    </h2>

                    {/* Gold rule */}
                    <div
                        aria-hidden="true"
                        style={{
                            height: "3px",
                            width: "56px",
                            margin: "16px auto 0",
                            borderRadius: "3px",
                            background: `linear-gradient(90deg, ${C.gold}, ${C.butter})`,
                            transformOrigin: "center",
                            transform: seen ? "scaleX(1)" : "scaleX(0)",
                            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
                        }}
                    />

                    <p
                        style={{
                            margin: "18px auto 0",
                            maxWidth: "560px",
                            fontSize: "15px",
                            lineHeight: 1.7,
                            color: C.body,
                            opacity: seen ? 1 : 0,
                            transform: seen ? "translateY(0)" : "translateY(12px)",
                            transition: "opacity 700ms ease 200ms, transform 700ms ease 200ms",
                        }}
                    >
                        Trusted by the best in the travel industry
                    </p>
                </header>

                {/* Cards */}
                <div
                    role="list"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {PARTNERS.map((p, i) => {
                        const isHover = hover === p.key;
                        return (
                            <a
                                key={p.key}
                                role="listitem"
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${p.name} — ${p.full} (opens in new tab)`}
                                onMouseEnter={() => setHover(p.key)}
                                onMouseLeave={() => setHover(null)}
                                onFocus={() => setHover(p.key)}
                                onBlur={() => setHover(null)}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    padding: "24px 22px",
                                    borderRadius: "18px",
                                    background: "#ffffff",
                                    border: `1px solid ${isHover ? C.gold : C.border}`,
                                    textDecoration: "none",
                                    color: "inherit",
                                    transform: isHover ? "translateY(-6px)" : "translateY(0)",
                                    boxShadow: isHover
                                        ? "0 24px 44px -22px rgba(188,157,44,0.5), 0 0 0 1px rgba(188,157,44,0.25)"
                                        : "0 1px 2px rgba(122,95,20,0.05), 0 10px 24px -18px rgba(122,95,20,0.25)",
                                    transition:
                                        "transform 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 340ms ease, border-color 200ms ease",
                                    opacity: seen ? 1 : 0,
                                    animation: seen
                                        ? `aaPUp 640ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 100}ms both`
                                        : "none",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Top logo row */}
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            flexShrink: 0,
                                            width: "58px",
                                            height: "58px",
                                            borderRadius: "14px",
                                            display: "grid",
                                            placeItems: "center",
                                            background: p.accent,
                                            color: "#fff",
                                            fontFamily: "Georgia, 'Times New Roman', serif",
                                            fontWeight: 800,
                                            fontSize: "19px",
                                            letterSpacing: "-0.02em",
                                            boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.14), 0 8px 18px -10px ${p.accent}`,
                                            transform: isHover ? "scale(1.06) rotate(-3deg)" : "scale(1) rotate(0)",
                                            transition: "transform 340ms cubic-bezier(0.22, 1, 0.36, 1)",
                                        }}
                                    >
                                        {p.glyph}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "10.5px",
                                                fontWeight: 800,
                                                letterSpacing: "0.16em",
                                                textTransform: "uppercase",
                                                color: C.gold,
                                            }}
                                        >
                                            {p.note}
                                        </p>
                                        <strong
                                            style={{
                                                display: "block",
                                                marginTop: "4px",
                                                fontFamily: "Georgia, 'Times New Roman', serif",
                                                fontSize: "18px",
                                                fontWeight: 700,
                                                color: C.ink,
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {p.name}
                                        </strong>
                                    </div>
                                </div>

                                {/* Description */}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "13.5px",
                                        lineHeight: 1.6,
                                        color: C.body,
                                        minHeight: "40px",
                                    }}
                                >
                                    {p.full}
                                </p>

                                {/* CTA */}
                                <div
                                    style={{
                                        marginTop: "auto",
                                        paddingTop: "14px",
                                        borderTop: `1px solid ${C.border}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            letterSpacing: "0.04em",
                                            color: isHover ? C.goldDark : C.muted,
                                            transition: "color 180ms ease",
                                        }}
                                    >
                                        Visit partner site
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            display: "grid",
                                            placeItems: "center",
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "999px",
                                            background: isHover ? C.butter : C.cream,
                                            color: C.goldDark,
                                            transition: "background 200ms ease, transform 200ms ease",
                                            transform: isHover ? "translateX(3px)" : "translateX(0)",
                                        }}
                                    >
                                        <FaExternalLinkAlt style={{ fontSize: "11px" }} />
                                    </span>
                                </div>

                                {/* Hover shimmer */}
                                <div
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "18px",
                                        pointerEvents: "none",
                                        background:
                                            "linear-gradient(110deg, transparent 35%, rgba(255,237,155,0.55) 50%, transparent 65%)",
                                        backgroundSize: "200% 100%",
                                        opacity: isHover ? 1 : 0,
                                        animation: isHover ? "aaPShimmer 1.3s linear infinite" : "none",
                                        transition: "opacity 200ms ease",
                                    }}
                                />
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}