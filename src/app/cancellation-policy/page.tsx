import type React from "react";
import type { Metadata } from "next";
import PolicyNav from "@/components/PolicyNav";

const SUPPORT_EMAIL = "help@shopzelora.in";
const LEGAL_NAME = "ZELORA";
const BUSINESS_ADDRESS = "Kolkata, India";
const GRIEVANCE_OFFICER = "SUBHOM DATTA";
const GRIEVANCE_EMAIL = "grievance@shopzelora.in";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#000",
  color: "#fff",
  fontFamily: "Arial, Helvetica, sans-serif",
  lineHeight: 1.7,
};

const shellStyle: React.CSSProperties = {
  width: "min(100% - 40px, 920px)",
  margin: "0 auto",
  padding: "28px 0 80px",
};

const titleStyle: React.CSSProperties = {
  fontSize: 36,
  lineHeight: 1.2,
  margin: "0 0 8px",
};

const mutedStyle: React.CSSProperties = {
  color: "#999",
  fontSize: 14,
};

const sectionStyle: React.CSSProperties = {
  marginTop: 34,
};

const h2Style: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.35,
  margin: "0 0 12px",
};

const listStyle: React.CSSProperties = {
  paddingLeft: 24,
};

const linkStyle: React.CSSProperties = {
  color: "#ddd",
};

function PolicyJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const baseUrl = "https://shopzelora.in";

  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${baseUrl}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "ZELORA",
      url: `${baseUrl}/`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: `${baseUrl}${path}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


export const metadata: Metadata = {
  title: "Cancellation Policy | ZELORA",
  description:
    "Learn about ZELORA order cancellation rules, cancellation eligibility, processing timelines and applicable refund conditions.",

  alternates: {
    canonical: "/cancellation-policy",
  },

  openGraph: {
    type: "website",
    title: "Cancellation Policy | ZELORA",
    description:
      "Learn about ZELORA order cancellation rules, cancellation eligibility, processing timelines and applicable refund conditions.",
    url: "/cancellation-policy",
    siteName: "ZELORA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZELORA — Crafted for Every Story",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cancellation Policy | ZELORA",
    description:
      "Learn about ZELORA order cancellation rules, cancellation eligibility, processing timelines and applicable refund conditions.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PolicyPage() {
  return (
    <main style={ pageStyle }>
      <PolicyJsonLd
        title="Cancellation Policy"
        description="ZELORA order cancellation and cancellation-refund terms."
        path="/cancellation-policy"
      />
      <div style={ shellStyle }>
        <PolicyNav />

        <header>
          <h1 style={ titleStyle }>Cancellation Policy</h1>
          <p style={ mutedStyle }>Last updated: 17 August 2026</p>
        </header>

        
        <section style={sectionStyle}>
          <p>
            This Cancellation Policy explains how customers may request cancellation of
            ZELORA orders. It applies together with the Return & Refund Policy and does not
            remove any cancellation or refund right that applies under mandatory law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Cancellation Requests</h2>
          <ul style={listStyle}>
            <li>Customers may request cancellation by contacting ZELORA at {SUPPORT_EMAIL} as soon as possible after placing the order.</li>
            <li>The request should include the order number, customer name and the contact details used for the order.</li>
            <li>A cancellation request is not automatically successful until ZELORA confirms it.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Before Processing or Personalization</h2>
          <ul style={listStyle}>
            <li>Where an order has not yet entered processing, packing or personalization, ZELORA will make reasonable efforts to cancel it when requested.</li>
            <li>If cancellation is accepted before payment is captured, no payment may be due.</li>
            <li>If payment has already been captured, an approved cancellation will be refunded in accordance with the applicable refund process.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Orders Already Being Processed</h2>
          <ul style={listStyle}>
            <li>Once an order has entered processing, packing, dispatch or personalization, cancellation may no longer be possible.</li>
            <li>For personalized or made-to-order products, cancellation may be restricted once personalization or production has begun, subject to mandatory consumer rights.</li>
            <li>If cancellation cannot be accepted, the customer may still have remedies under the Return & Refund Policy where applicable.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Cancellation by ZELORA</h2>
          <p>
            ZELORA may cancel an order where reasonably necessary because of product
            unavailability, payment failure, suspected fraud or misuse, material pricing or
            technical error, inability to verify required information, or another lawful
            reason. If a paid order is cancelled by ZELORA, the applicable refund will be
            processed as required by law and the circumstances of the cancellation.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Refund After Cancellation</h2>
          <ul style={listStyle}>
            <li>Where an approved cancellation results in a refund, ZELORA will initiate the refund to the applicable payment method or another permitted method.</li>
            <li>Accepted refund requests will be processed within a reasonable period and, where applicable consumer e-commerce guidance requires it, within 14 days.</li>
            <li>The time for the refund to appear in a bank or payment account depends on the relevant payment provider or bank.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Customer Refusal of Delivery</h2>
          <p>
            Refusing a delivery is not the same as requesting cancellation. If you no longer
            want an order, contact ZELORA before delivery whenever possible so that we can
            determine whether cancellation is still available. Where an order has already
            been dispatched, the Return & Refund Policy may apply instead.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. How to Contact Us</h2>
          <p>
            Send cancellation requests to {SUPPORT_EMAIL}. Please clearly write
            "Cancellation Request" and include your order number.
          </p>
        </section>


        <footer style={{ ...sectionStyle, borderTop: "1px solid #262626", paddingTop: 24 }}>
          <p style={{ color: "#777", fontSize: 13 }}>
            {LEGAL_NAME} · {BUSINESS_ADDRESS}
          </p>
          <p style={{ color: "#777", fontSize: 13 }}>
            Support: {SUPPORT_EMAIL} · Grievance Officer: {GRIEVANCE_OFFICER} ({GRIEVANCE_EMAIL})
          </p>
        </footer>
      </div>
    </main>
  );
}
