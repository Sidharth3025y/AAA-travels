import React from "react";

// --- Tokens (warm, editorial / contract-like) ---
const T = {
    paper: "#fdfaf2",
    card: "#ffffff",
    ink: "#1c1a14",
    body: "#3a3626",
    muted: "#8a8676",
    gold: "#bc9d2c",
    goldSoft: "#f4ecc8",
    rule: "#ece3c4",
    ruleStrong: "#d8c88a",
};

const pageStyle = {
    background: T.paper,
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

const wrapStyle = {
    maxWidth: "820px",
    margin: "0 auto",
    padding: "56px 24px 96px",
};

const headerCardStyle = {
    background: T.card,
    border: `1px solid ${T.rule}`,
    borderRadius: "18px",
    padding: "40px 40px 32px",
    marginBottom: "32px",
    boxShadow: "0 1px 2px rgba(120,95,20,0.04), 0 18px 40px -28px rgba(120,95,20,0.28)",
    position: "relative",
    overflow: "hidden",
};

const goldBarStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    background: `linear-gradient(180deg, ${T.gold} 0%, ${T.ruleStrong} 100%)`,
};

const eyebrowStyle = {
    margin: "0 0 10px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: T.gold,
};

const h1Style = {
    margin: 0,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(28px, 4vw, 38px)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    color: T.ink,
};

const metaRowStyle = {
    marginTop: "16px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    color: T.muted,
};

const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 11px",
    borderRadius: "999px",
    background: T.goldSoft,
    border: `1px solid ${T.ruleStrong}`,
    color: "#6b5310",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
};

const introStyle = {
    margin: "20px 0 0",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "#fbf6e3",
    border: `1px dashed ${T.ruleStrong}`,
    color: T.body,
    fontSize: "14px",
    lineHeight: 1.65,
};

const sectionStyle = {
    background: T.card,
    border: `1px solid ${T.rule}`,
    borderRadius: "14px",
    padding: "26px 28px",
    marginBottom: "16px",
};

const sectionHeadStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "12px",
};

const numberBadgeStyle = {
    flexShrink: 0,
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: T.ink,
    color: T.goldSoft,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "14px",
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    letterSpacing: "-0.02em",
};

const h2Style = {
    margin: 0,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "19px",
    fontWeight: 700,
    lineHeight: 1.35,
    color: T.ink,
    letterSpacing: "-0.01em",
    paddingTop: "3px",
};

const pStyle = {
    margin: "0 0 10px",
    fontSize: "15px",
    lineHeight: 1.75,
    color: T.body,
};

const ulStyle = {
    margin: "4px 0 10px",
    paddingLeft: "22px",
    fontSize: "15px",
    lineHeight: 1.75,
    color: T.body,
};

const liStyle = { marginBottom: "4px" };

const footerCardStyle = {
    marginTop: "28px",
    background: T.card,
    border: `1px solid ${T.rule}`,
    borderLeft: `4px solid ${T.gold}`,
    borderRadius: "14px",
    padding: "26px 28px",
};

function Section({ number, title, children }) {
    return (
        <section style={sectionStyle}>
            <div style={sectionHeadStyle}>
                <span style={numberBadgeStyle} aria-hidden="true">{number}</span>
                <h2 style={h2Style}>{title}</h2>
            </div>
            {children}
        </section>
    );
}

export default function TermsConditions() {
    return (
        <div style={pageStyle}>
            <div style={wrapStyle}>
                <header style={headerCardStyle}>
                    <div style={goldBarStyle} aria-hidden="true" />
                    <p style={eyebrowStyle}>Legal · Booking Terms</p>
                    <h1 style={h1Style}>Terms &amp; Conditions</h1>
                    <div style={metaRowStyle}>
                        <span style={pillStyle}>Version 2026.09</span>
                        <span>Last updated: September 28, 2026</span>
                    </div>
                    <p style={introStyle}>
                        Please read these terms carefully before booking any service with AAA
                        Travels Pvt Ltd. They describe the rights and responsibilities that
                        apply to every booking made through our website or staff.
                    </p>
                </header>

                <Section number="01" title="Acceptance of Terms">
                    <p style={pStyle}>
                        By accessing or using the AAA Travels Pvt Ltd website or booking our
                        services, you agree to comply with these Terms &amp; Conditions. If you
                        do not agree with any part of these terms, please do not use our
                        website or services.
                    </p>
                </Section>

                <Section number="02" title="Our Services">
                    <p style={pStyle}>
                        AAA Travels Pvt Ltd provides travel-related services, which may
                        include flight tickets, bus tickets, tour packages, trekking,
                        helicopter services, adventure activities, transportation,
                        accommodation, and other travel assistance.
                    </p>
                    <p style={pStyle}>
                        Availability, prices, schedules, and service conditions may vary
                        depending on the relevant airline, hotel, transportation company,
                        activity provider, or other third-party service provider.
                    </p>
                </Section>

                <Section number="03" title="Booking Information">
                    <p style={pStyle}>
                        Customers are responsible for providing accurate and complete
                        information when making a booking.
                    </p>
                    <p style={pStyle}>
                        Incorrect names, passport details, contact information, travel dates,
                        or other booking information may result in additional charges,
                        cancellation, or inability to use the service.
                    </p>
                </Section>

                <Section number="04" title="Prices and Payments">
                    <p style={pStyle}>
                        Prices displayed on our website may change based on availability,
                        supplier pricing, taxes, fees, exchange rates, and other applicable
                        charges.
                    </p>
                    <p style={pStyle}>
                        A booking may not be considered confirmed until the required payment
                        or confirmation process has been completed.
                    </p>
                </Section>

                <Section number="05" title="Flight and Transportation Services">
                    <p style={pStyle}>
                        Flight schedules, routes, baggage allowances, fares, and other
                        conditions are determined by the relevant airline. Airlines may
                        change schedules, cancel flights, or impose additional requirements.
                    </p>
                    <p style={pStyle}>
                        Similar conditions may apply to bus, vehicle, helicopter, and other
                        transportation services provided by third-party operators.
                    </p>
                </Section>

                <Section number="06" title="Cancellation and Refunds">
                    <p style={pStyle}>
                        Cancellation and refund policies may vary depending on the service
                        provider and type of booking.
                    </p>
                    <p style={pStyle}>
                        Airline tickets, hotel reservations, tours, transportation, and
                        activity bookings may have different cancellation fees,
                        non-refundable conditions, or refund timelines.
                    </p>
                    <p style={pStyle}>
                        Customers should confirm the applicable cancellation and refund
                        conditions before completing a booking.
                    </p>
                </Section>

                <Section number="07" title="Travel Documents">
                    <p style={pStyle}>
                        Customers are responsible for ensuring that they have valid
                        passports, visas, permits, identification documents, travel
                        insurance, vaccination documents, and any other documents required
                        for their journey.
                    </p>
                    <p style={pStyle}>
                        AAA Travels Pvt Ltd is not responsible for losses resulting from
                        incomplete, invalid, expired, or incorrect travel documents.
                    </p>
                </Section>

                <Section number="08" title="Third-Party Providers">
                    <p style={pStyle}>
                        Some services are provided by independent third-party companies,
                        including airlines, hotels, transportation operators, activity
                        providers, and other suppliers.
                    </p>
                    <p style={pStyle}>
                        Their individual terms, policies, schedules, safety requirements, and
                        cancellation conditions may apply to your booking.
                    </p>
                </Section>

                <Section number="09" title="Changes and Delays">
                    <p style={pStyle}>
                        Travel schedules may be affected by weather, operational issues,
                        government regulations, strikes, technical problems, natural events,
                        or other circumstances beyond our control.
                    </p>
                    <p style={pStyle}>
                        Where possible, we will assist customers in communicating with the
                        relevant service provider regarding changes or disruptions.
                    </p>
                </Section>

                <Section number="10" title="Website Information">
                    <p style={pStyle}>
                        We make reasonable efforts to keep information on our website
                        accurate and updated. However, prices, availability, schedules, and
                        other information may change without prior notice.
                    </p>
                </Section>

                <Section number="11" title="Limitation of Responsibility">
                    <p style={pStyle}>
                        AAA Travels Pvt Ltd acts as a travel service provider and/or
                        intermediary for certain third-party services. Our responsibility for
                        third-party services is subject to the applicable terms and
                        conditions of those providers and applicable law.
                    </p>
                </Section>

                <Section number="12" title="Prohibited Use">
                    <p style={pStyle}>You agree not to use our website to:</p>
                    <ul style={ulStyle}>
                        <li style={liStyle}>Provide false or misleading information</li>
                        <li style={liStyle}>Attempt unauthorized access to our systems</li>
                        <li style={liStyle}>Interfere with the operation of the website</li>
                        <li style={liStyle}>Use the website for unlawful purposes</li>
                        <li style={liStyle}>Submit fraudulent booking or payment information</li>
                    </ul>
                </Section>

                <Section number="13" title="Changes to These Terms">
                    <p style={pStyle}>
                        AAA Travels Pvt Ltd may update these Terms &amp; Conditions from time
                        to time. Updated terms will be published on this page and will become
                        effective when posted.
                    </p>
                </Section>

                <div style={footerCardStyle}>
                    <p style={{ ...eyebrowStyle, marginBottom: "8px" }}>14 · Contact Us</p>
                    <p style={pStyle}>
                        For questions regarding these Terms &amp; Conditions, please contact
                        AAA Travels Pvt Ltd.
                    </p>
                    <p style={{ ...pStyle, margin: 0 }}>
                        <strong>Location:</strong> Sirjana Chowk 8, Pokhara, Nepal
                        <br />
                        <strong>Email:</strong> aaatravel@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}