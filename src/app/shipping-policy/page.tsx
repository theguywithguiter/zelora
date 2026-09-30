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
        title="Shipping Policy"
        description="ZELORA shipping, processing, delivery, tracking and delayed-shipment information."
        path="/shipping-policy"
      />
      <div style={ shellStyle }>
        <PolicyNav />

        <header>
          <h1 style={ titleStyle }>Shipping Policy</h1>
          <p style={ mutedStyle }>Last updated: 17 August 2026</p>
        </header>

        
        <section style={sectionStyle}>
          <p>
            This Shipping Policy explains how ZELORA processes and delivers orders placed
            through our website. Shipping terms shown at checkout for a particular order
            form part of that order.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Order Processing</h2>
          <ul style={listStyle}>
            <li>Orders are normally processed after the order is successfully placed and the required order details are received.</li>
            <li>Processing may include order verification, payment confirmation, personalization review, packing and dispatch preparation.</li>
            <li>Personalized or made-to-order products may require additional processing time. Any specific estimate displayed on the product page or at checkout will apply to that order.</li>
            <li>If an order requires clarification, ZELORA may contact the customer using the contact details provided at checkout.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Shipping Charges</h2>
          <ul style={listStyle}>
            <li>Applicable shipping charges, if any, will be displayed during checkout before the order is submitted.</li>
            <li>Where ZELORA offers free shipping, the applicable offer conditions will be displayed on the website or checkout.</li>
            <li>Customers are responsible for reviewing the final order total before placing an order.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Delivery Time</h2>
          <ul style={listStyle}>
            <li>Estimated delivery times are estimates and are not guaranteed unless expressly stated otherwise.</li>
            <li>Delivery time may vary based on destination, courier capacity, weather, public holidays, service interruptions and other circumstances outside ZELORA's reasonable control.</li>
            <li>If a specific delivery schedule is stated for an order, ZELORA will make reasonable efforts to meet that schedule.</li>
            <li>Customers should ensure that the delivery address, PIN code and contact number supplied at checkout are accurate.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Tracking</h2>
          <ul style={listStyle}>
            <li>Where tracking is available, tracking information may be provided after dispatch.</li>
            <li>Tracking information is supplied by the relevant logistics provider and may take time to update after pickup or movement.</li>
            <li>Customers may use the ZELORA order-tracking facility where available.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Delivery Attempts and Incorrect Addresses</h2>
          <ul style={listStyle}>
            <li>The customer is responsible for providing a complete and accurate delivery address.</li>
            <li>If a shipment cannot be delivered because of an incorrect or incomplete address, unavailable recipient, refusal to accept delivery, or repeated failed delivery attempts, additional delivery or reshipping arrangements may be required.</li>
            <li>Any additional charge will be communicated to the customer before it is imposed.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Delayed, Lost or Damaged Shipments</h2>
          <ul style={listStyle}>
            <li>If an order is materially delayed, lost, damaged, defective, wrong, spurious, or does not match the characteristics/features advertised or agreed, customers should contact ZELORA promptly.</li>
            <li>ZELORA will investigate the issue with the relevant logistics provider and determine the appropriate resolution under the applicable law and the Return & Refund Policy.</li>
            <li>ZELORA will not use this policy to exclude consumer rights that cannot legally be excluded.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Force Majeure</h2>
          <p>
            ZELORA will not be responsible for delivery delays caused by events beyond its
            reasonable control, including natural disasters, severe weather, government
            restrictions, strikes, civil disruption, major transport disruption, network
            failures or other force majeure events. This does not remove rights that apply
            to consumers under mandatory law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Contact</h2>
          <p>
            For shipping questions, contact <span>{SUPPORT_EMAIL}</span> and include your
            order number where applicable.
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
