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
  title: "Terms & Conditions | ZELORA",
  description:
    "Read the terms governing use of the ZELORA website, purchases, orders, payments, personalized jewellery and related services.",

  alternates: {
    canonical: "/terms-and-conditions",
  },

  openGraph: {
    type: "website",
    title: "Terms & Conditions | ZELORA",
    description:
      "Read the terms governing use of the ZELORA website, purchases, orders, payments, personalized jewellery and related services.",
    url: "/terms-and-conditions",
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
    title: "Terms & Conditions | ZELORA",
    description:
      "Read the terms governing use of the ZELORA website, purchases, orders, payments, personalized jewellery and related services.",
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
        title="Terms & Conditions"
        description="Terms governing use of the ZELORA website and purchases."
        path="/terms-and-conditions"
      />
      <div style={ shellStyle }>
        <PolicyNav />

        <header>
          <h1 style={ titleStyle }>Terms & Conditions</h1>
          <p style={ mutedStyle }>Last updated: 17 August 2026</p>
        </header>

        
        <section style={sectionStyle}>
          <p>
            These Terms & Conditions govern access to and use of the ZELORA website and
            purchases made through it. By using the website or placing an order, you agree
            to these Terms, together with the policies linked above, to the extent permitted
            by applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Business and Website</h2>
          <ul style={listStyle}>
            <li>ZELORA operates an online retail website for products offered through the platform.</li>
            <li>Legal business name: {LEGAL_NAME}.</li>
            <li>Registered/business address: {BUSINESS_ADDRESS}.</li>
            <li>Customer support: {SUPPORT_EMAIL}.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Eligibility and Account Responsibility</h2>
          <ul style={listStyle}>
            <li>You must provide accurate information when creating an account or placing an order.</li>
            <li>You are responsible for keeping your account credentials and OTPs confidential.</li>
            <li>You must not use the website for unlawful, fraudulent or abusive purposes.</li>
            <li>ZELORA may restrict or suspend access where reasonably necessary for security, fraud prevention, legal compliance or material breach of these Terms.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Product Information</h2>
          <ul style={listStyle}>
            <li>We aim to provide accurate product names, descriptions, images, prices, availability and specifications.</li>
            <li>Product images may vary slightly because of lighting, display settings, photography and manufacturing variation.</li>
            <li>Personalization instructions must be reviewed carefully before an order is placed.</li>
            <li>Where a product page contains a specific term or specification, that product-specific information will apply to the relevant purchase.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Pricing and Taxes</h2>
          <ul style={listStyle}>
            <li>Prices are displayed in Indian Rupees unless stated otherwise.</li>
            <li>The final amount payable, including applicable charges and taxes, will be shown before the order is submitted.</li>
            <li>If an obvious pricing or technical error occurs, ZELORA may contact the customer and provide the available options under applicable law.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Orders and Acceptance</h2>
          <ul style={listStyle}>
            <li>Submitting an order is a request to purchase the selected products.</li>
            <li>ZELORA may verify order information and, where appropriate, contact the customer to confirm an order.</li>
            <li>An order may be declined or cancelled where there is a genuine issue involving availability, payment, suspected fraud, inaccurate information, a technical error or another lawful reason.</li>
            <li>If ZELORA cancels a paid order, any applicable refund will be processed in accordance with the Return & Refund and Cancellation Policies and applicable law.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Payment</h2>
          <ul style={listStyle}>
            <li>Available payment methods are displayed at checkout.</li>
            <li>Payment processing may be performed by third-party payment providers.</li>
            <li>You authorize the applicable payment provider to process the amount due for your order.</li>
            <li>ZELORA does not ask customers to disclose passwords, OTPs or PINs through unofficial channels.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Shipping, Returns and Cancellation</h2>
          <p>
            Orders are subject to the Shipping Policy, Return & Refund Policy and
            Cancellation Policy linked in the policy navigation above. Those policies form
            part of these Terms to the extent applicable to your order.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Personalization</h2>
          <ul style={listStyle}>
            <li>You are responsible for ensuring names, dates, spellings, symbols and other personalization information are correct.</li>
            <li>ZELORA may decline personalization that is unlawful, threatening, hateful, defamatory, infringing, obscene, fraudulent or otherwise inappropriate.</li>
            <li>Personalized items may be subject to special return and cancellation conditions disclosed before purchase.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>9. Intellectual Property</h2>
          <ul style={listStyle}>
            <li>Website content, branding, logos, graphics, product photography, text, software and other materials are owned by or licensed to ZELORA unless otherwise stated.</li>
            <li>You may not reproduce, modify, distribute, scrape, sell or commercially exploit website content without permission, except where permitted by law.</li>
            <li>Customers retain ownership of content they lawfully submit, subject to any permissions required to provide the requested service.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>10. Prohibited Use</h2>
          <ul style={listStyle}>
            <li>Do not use the website for fraud, impersonation, unauthorized access, interference, malicious code, unlawful scraping or infringement of third-party rights.</li>
            <li>Do not attempt to bypass security or access areas not intended for you.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>11. Third-Party Services</h2>
          <p>
            Payment providers, logistics companies, analytics services, hosting providers
            and other third parties may provide services connected with the website. Their
            own terms and privacy policies may apply to the services they provide.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>12. Availability and Errors</h2>
          <p>
            We aim to keep the website available and accurate, but temporary outages,
            maintenance, technical errors, third-party failures and other interruptions may
            occur. Nothing in these Terms excludes liability or consumer rights that cannot
            legally be excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>13. Consumer Rights</h2>
          <p>
            Nothing in these Terms is intended to contract out of mandatory consumer rights
            or remedies available under applicable law. ZELORA will comply with applicable
            consumer-protection requirements for its ecommerce operations.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>14. Governing Law and Disputes</h2>
          <p>
            These Terms are intended to be governed by the laws applicable to ZELORA's
            registered business and its customers, subject to mandatory consumer-protection
            jurisdictional rights. Any dispute will be handled through the legally available
            dispute-resolution mechanisms and courts having jurisdiction under applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>15. Changes to These Terms</h2>
          <p>
            ZELORA may update these Terms from time to time. The updated version will be
            published on this page and will apply prospectively to future use and purchases,
            subject to applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>16. Grievance Contact</h2>
          <p>
            Grievance Officer: {GRIEVANCE_OFFICER}<br />
            Email: {GRIEVANCE_EMAIL}<br />
            Address: {BUSINESS_ADDRESS}
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
