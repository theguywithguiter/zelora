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
  title: "Shipping Policy | ZELORA",
  description:
    "Learn about ZELORA shipping, order processing, delivery timelines, tracking, delays and delivery-related information.",

  alternates: {
    canonical: "/shipping-policy",
  },

  openGraph: {
    type: "website",
    title: "Shipping Policy | ZELORA",
    description:
      "Learn about ZELORA shipping, order processing, delivery timelines, tracking, delays and delivery-related information.",
    url: "/shipping-policy",
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
    title: "Shipping Policy | ZELORA",
    description:
      "Learn about ZELORA shipping, order processing, delivery timelines, tracking, delays and delivery-related information.",
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
        title="Return & Refund Policy"
        description="ZELORA return, replacement and refund terms for online orders."
        path="/return-refund-policy"
      />
      <div style={ shellStyle }>
        <PolicyNav />

        <header>
          <h1 style={ titleStyle }>Return & Refund Policy</h1>
          <p style={ mutedStyle }>Last updated: 17 August 2026</p>
        </header>

        
        <section style={sectionStyle}>
          <p>
            This Return & Refund Policy explains when an order may be returned, exchanged,
            replaced or refunded. It applies together with the product-specific terms shown
            at the time of purchase and does not limit any consumer right that cannot legally
            be excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Eligibility for Return or Replacement</h2>
          <ul style={listStyle}>
            <li>Customers should contact ZELORA as soon as reasonably possible if an item is defective, damaged in transit, incorrect, spurious, materially different from the advertised characteristics/features, or otherwise eligible for a remedy under applicable law.</li>
            <li>Where ZELORA specifies a return window for a product, the request should be submitted within that stated period.</li>
            <li>Products must be returned in the condition required by the applicable return instructions.</li>
            <li>Proof of purchase and order details may be required.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Personalized Products</h2>
          <ul style={listStyle}>
            <li>Personalized, customized or made-to-order products may be non-returnable for a change-of-mind return because they are created for the individual customer.</li>
            <li>This exclusion does not apply where the product is defective, damaged, incorrect, spurious, or materially different from what was ordered or advertised, or where applicable law provides a different remedy.</li>
            <li>Customers should carefully check personalization details before submitting an order.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Items That May Not Be Accepted for Change-of-Mind Return</h2>
          <ul style={listStyle}>
            <li>Products specifically identified at checkout or on the product page as non-returnable.</li>
            <li>Personalized or customized products, subject to the exceptions above.</li>
            <li>Products returned after the applicable return period, except where a longer period or remedy is required by law.</li>
            <li>Products that cannot be resold because of customer-caused damage, misuse, alteration or missing components, subject to applicable consumer law.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. How to Request a Return</h2>
          <ol style={listStyle}>
            <li>Contact ZELORA at {SUPPORT_EMAIL} with your order number.</li>
            <li>Explain the reason for the request and provide photographs or other evidence where relevant.</li>
            <li>Wait for return instructions before sending an item back.</li>
            <li>Use the return method communicated by ZELORA.</li>
          </ol>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Return Shipping</h2>
          <ul style={listStyle}>
            <li>Where a return is required because ZELORA supplied a defective, damaged, incorrect, spurious or materially misdescribed product, ZELORA will provide the applicable resolution in accordance with law and the circumstances of the order.</li>
            <li>For any permitted change-of-mind return, the customer may be responsible for return shipping where this was clearly disclosed before purchase and is permitted by law.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Inspection and Resolution</h2>
          <ul style={listStyle}>
            <li>Returned products may be inspected to verify the reported issue and order details.</li>
            <li>Depending on the circumstances, the resolution may include replacement, repair, exchange, refund, or another remedy available under applicable law.</li>
            <li>ZELORA will not deny a legally required remedy solely because a customer did not comply with a voluntary procedure that was not disclosed before purchase.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Refunds</h2>
          <ul style={listStyle}>
            <li>Once a refund is approved, ZELORA will initiate the refund to the applicable payment method or use another legally permitted method.</li>
            <li>Accepted refund requests will be processed within a reasonable period and, where the applicable consumer e-commerce guidance requires it, within 14 days.</li>
            <li>The time taken for the amount to appear in the customer's bank or payment account may depend on the payment provider or bank.</li>
            <li>Any refund amount will be determined after considering the order terms, applicable law, the reason for return and any permitted deductions or charges that were clearly disclosed.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Wrong, Damaged or Defective Items</h2>
          <p>
            If you receive an item that is wrong, damaged, defective, spurious, or materially
            different from its advertised or agreed characteristics, contact us promptly at
            {` ${SUPPORT_EMAIL}`}. Keep the product, packaging and shipping materials until
            the issue has been reviewed where reasonably possible.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>9. Contact</h2>
          <p>
            Return and refund requests: {SUPPORT_EMAIL}. Please include your order number,
            registered contact details and a short description of the issue.
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
