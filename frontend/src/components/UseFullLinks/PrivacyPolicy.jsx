import React from "react";

// --- Tokens (cool, editorial / data-led, intentionally different palette) ---
const P = {
    page: "#f7f9fc",
    card: "#ffffff",
    ink: "#111827",
    body: "#3f4553",
    muted: "#7b8390",
    blue: "#1e5fa8",
    blueSoft: "#e8f0fb",
    blueLine: "#c9dbf4",
    rule: "#e3e8ef",
};

const pageStyle = {
    background: P.page,
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: P.ink,
};

const wrapStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "48px 24px 96px",
    display: "grid",
    gridTemplateColumns: "240px minmax(0, 1fr)",
    gap: "40px",
    alignItems: "start",
};

const railStyle = {
    position: "sticky",
    top: "24px",
    alignSelf: "start",
};

const railCardStyle = {
    background: P.card,
    border: `1px solid ${P.rule}`,
    borderRadius: "14px",
    padding: "20px",
};

const railKickerStyle = {
    margin: "0 0 4px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: P.blue,
};

const railTitleStyle = {
    margin: "0 0 12px",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "17px",
    fontWeight: 700,
    color: P.ink,
};

const railTextStyle = {
    margin: "0 0 14px",
    fontSize: "13px",
    lineHeight: 1.65,
    color: P.muted,
};

const railListStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const railItemStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
    fontSize: "12.5px",
    color: P.body,
    lineHeight: 1.5,
};

const railNumStyle = {
    color: P.blue,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    minWidth: "18px",
};

const mainStyle = { minWidth: 0 };

const headerStyle = {
    borderLeft: `4px solid ${P.blue}`,
    paddingLeft: "20px",
    marginBottom: "28px",
};

const h1Style = {
    margin: "6px 0 8px",
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800,
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
    color: P.ink,
};

const subStyle = {
    margin: 0,
    fontSize: "14px",
    color: P.muted,
};

const sectionStyle = {
    background: P.card,
    border: `1px solid ${P.rule}`,
    borderRadius: "12px",
    padding: "24px 26px",
    marginBottom: "14px",
};

const sectionHeadStyle = {
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    marginBottom: "10px",
};

const sectionNumStyle = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "13px",
    fontWeight: 700,
    color: P.blue,
    fontVariantNumeric: "tabular-nums",
    minWidth: "24px",
};

const h2Style = {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: P.ink,
    letterSpacing: "-0.01em",
};

const pStyle = {
    margin: "0 0 10px",
    fontSize: "15px",
    lineHeight: 1.75,
    color: P.body,
};

const ulStyle = {
    margin: "4px 0 10px",
    paddingLeft: "20px",
    fontSize: "15px",
    lineHeight: 1.75,
    color: P.body,
};

const liStyle = { marginBottom: "4px" };

const calloutStyle = {
    margin: "16px 0 0",
    padding: "14px 16px",
    borderRadius: "10px",
    background: P.blueSoft,
    border: `1px solid ${P.blueLine}`,
    color: "#173a63",
    fontSize: "14px",
    lineHeight: 1.65,
};

const contactStyle = {
    marginTop: "20px",
    background: P.card,
    border: `1px solid ${P.rule}`,
    borderRadius: "12px",
    padding: "24px 26px",
};

function Section({ number, title, children }) {
    return (
        <section style={sectionStyle}>
            <div style={sectionHeadStyle}>
                <span style={sectionNumStyle} aria-hidden="true">{number}</span>
                <h2 style={h2Style}>{title}</h2>
            </div>
            {children}
        </section>
    );
}

export default function PrivacyPolicy() {
    const toc = [
        ["01", "Introduction"],
        ["02", "Information We Collect"],
        ["03", "How We Use It"],
        ["04", "Payment Information"],
        ["05", "Cookies & Data"],
        ["06", "Sharing"],
        ["07", "Data Security"],
        ["08", "Third-Party Services"],
        ["09", "Your Rights"],
        ["10", "Policy Changes"],
        ["11", "Contact Us"],
    ];

    return (
        <div style={pageStyle}>
            <div
                style={wrapStyle}
                className="aa-privacy-grid"
            >
                {/* Sidebar rail */}
                <aside style={railStyle}>
                    <div style={railCardStyle}>
                        <p style={railKickerStyle}>Privacy</p>
                        <h2 style={railTitleStyle}>On this page</h2>
                        <p style={railTextStyle}>
                            How AAA Travels collects, uses, and protects your information.
                        </p>
                        <ol style={railListStyle}>
                            {toc.map(([num, label]) => (
                                <li key={num} style={railItemStyle}>
                                    <span style={railNumStyle}>{num}</span>
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>

                <main style={mainStyle}>
                    <header style={headerStyle}>
                        <p style={{ ...railKickerStyle, marginBottom: "2px" }}>Privacy Policy</p>
                        <h1 style={h1Style}>Your data, clearly explained</h1>
                        <p style={subStyle}>Last updated: September 28, 2026</p>
                    </header>

                    <Section number="01" title="Introduction">
                        <p style={pStyle}>
                            AAA Travels Pvt Ltd respects your privacy and is committed to
                            protecting the personal information you provide when using our
                            website and travel services.
                        </p>
                        <p style={pStyle}>
                            This Privacy Policy explains how we collect, use, store, and
                            protect your information when you visit our website, contact us,
                            or use our travel-related services.
                        </p>
                    </Section>

                    <Section number="02" title="Information We Collect">
                        <p style={pStyle}>Depending on the service you use, we may collect:</p>
                        <ul style={ulStyle}>
                            <li style={liStyle}>Your name</li>
                            <li style={liStyle}>Phone number</li>
                            <li style={liStyle}>Email address</li>
                            <li style={liStyle}>Travel and booking information</li>
                            <li style={liStyle}>Pickup or destination information</li>
                            <li style={liStyle}>Messages and enquiries submitted through our website</li>
                            <li style={liStyle}>Information you voluntarily provide when contacting us</li>
                        </ul>
                    </Section>

                    <Section number="03" title="How We Use Your Information">
                        <p style={pStyle}>Your information may be used to:</p>
                        <ul style={ulStyle}>
                            <li style={liStyle}>Process and manage travel bookings</li>
                            <li style={liStyle}>Respond to enquiries and customer requests</li>
                            <li style={liStyle}>Provide information about our services</li>
                            <li style={liStyle}>Contact you regarding your booking</li>
                            <li style={liStyle}>Improve our website and services</li>
                            <li style={liStyle}>Maintain records related to our business operations</li>
                            <li style={liStyle}>Prevent fraud, misuse, or unauthorized activity</li>
                        </ul>
                    </Section>

                    <Section number="04" title="Payment Information">
                        <p style={pStyle}>
                            Where payment services are provided through third-party payment
                            providers, payment information may be processed directly by those
                            providers. We do not intend to store complete payment card details
                            on our website unless specifically required and securely supported
                            by the relevant payment system.
                        </p>
                        <p style={calloutStyle}>
                            <strong>Note:</strong> card details are handled by our payment
                            partners and are not stored on AAA Travels servers.
                        </p>
                    </Section>

                    <Section number="05" title="Cookies and Website Data">
                        <p style={pStyle}>
                            Our website may use cookies or similar technologies to improve
                            functionality, remember preferences, maintain sessions, and
                            understand how visitors interact with our website.
                        </p>
                    </Section>

                    <Section number="06" title="Sharing of Information">
                        <p style={pStyle}>
                            We do not sell or rent your personal information. We may share
                            necessary information with relevant service providers, airlines,
                            hotels, transportation providers, activity operators, payment
                            providers, or other parties when required to provide the service
                            you requested.
                        </p>
                        <p style={pStyle}>
                            Information may also be disclosed where required by applicable law
                            or by a lawful government or regulatory request.
                        </p>
                    </Section>

                    <Section number="07" title="Data Security">
                        <p style={pStyle}>
                            We take reasonable measures to protect personal information from
                            unauthorized access, alteration, disclosure, or misuse. However,
                            no internet-based system can be guaranteed to be completely
                            secure.
                        </p>
                    </Section>

                    <Section number="08" title="Third-Party Services">
                        <p style={pStyle}>
                            Our website may contain links or integrations with third-party
                            websites and services. We are not responsible for the privacy
                            practices or content of third-party websites. We recommend
                            reviewing their privacy policies before providing personal
                            information.
                        </p>
                    </Section>

                    <Section number="09" title="Your Rights">
                        <p style={pStyle}>
                            You may contact us to request information about personal data we
                            hold about you, request correction of inaccurate information, or
                            ask questions about how your information is being used, subject to
                            applicable laws and legitimate business requirements.
                        </p>
                    </Section>

                    <Section number="10" title="Changes to This Privacy Policy">
                        <p style={pStyle}>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted on this page with an updated revision date.
                        </p>
                    </Section>

                    <div style={contactStyle}>
                        <div style={sectionHeadStyle}>
                            <span style={sectionNumStyle} aria-hidden="true">11</span>
                            <h2 style={h2Style}>Contact Us</h2>
                        </div>
                        <p style={pStyle}>
                            If you have questions about this Privacy Policy or how your
                            information is handled, please contact AAA Travels Pvt Ltd.
                        </p>
                        <p style={{ ...pStyle, margin: 0 }}>
                            <strong>Location:</strong> Sirjana Chowk 8, Pokhara, Nepal
                            <br />
                            <strong>Email:</strong> aaatravels@gmail.com
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}