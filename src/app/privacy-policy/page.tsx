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
  title: "Privacy Policy | ZELORA",
  description:
    "Learn how ZELORA collects, uses, stores and protects personal information and how you can manage your privacy rights.",

  alternates: {
    canonical: "/privacy-policy",
  },

  openGraph: {
    type: "website",
    title: "Privacy Policy | ZELORA",
    description:
      "Learn how ZELORA collects, uses, stores and protects personal information and how you can manage your privacy rights.",
    url: "/privacy-policy",
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
    title: "Privacy Policy | ZELORA",
    description:
      "Learn how ZELORA collects, uses, stores and protects personal information and how you can manage your privacy rights.",
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
        title="Privacy Policy"
        description="How ZELORA collects, uses, stores and protects personal data."
        path="/privacy-policy"
      />
      <div style={ shellStyle }>
        <PolicyNav />

        <header>
          <h1 style={ titleStyle }>Privacy Policy</h1>
          <p style={ mutedStyle }>Last updated: 17 August 2026</p>
        </header>

        
        <section style={sectionStyle}>
          <p>
            This Privacy Policy explains how ZELORA collects, uses, stores, shares and
            protects personal data when you use our website, create an account, place an
            order, contact us, or otherwise interact with our services.
          </p>
          <p>
            This policy is intended to be read with applicable Indian data-protection and
            consumer laws, including the Digital Personal Data Protection Act, 2023 and
            applicable rules and commencement provisions. It should be updated as ZELORA's
            actual data practices and legal obligations evolve.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Data We May Collect</h2>
          <ul style={listStyle}>
            <li>Name and contact details, such as email address and phone number.</li>
            <li>Billing and delivery information, including address, city, state and PIN code.</li>
            <li>Account information, such as login credentials and account preferences.</li>
            <li>Order information, including products purchased, personalization details, order status and transaction-related information.</li>
            <li>Customer-support communications and information you provide in messages, forms or complaints.</li>
            <li>Technical information such as IP address, browser type, device information, log information and website interaction data, where collected through our systems or service providers.</li>
            <li>Cookie or similar technology information where such technologies are used and permitted.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Why We Use Personal Data</h2>
          <ul style={listStyle}>
            <li>To create and maintain customer accounts.</li>
            <li>To process, confirm, fulfil and deliver orders.</li>
            <li>To process refunds, returns, cancellations and customer-service requests.</li>
            <li>To communicate about orders, delivery, account security and service matters.</li>
            <li>To provide personalization and other features requested by the customer.</li>
            <li>To prevent fraud, misuse, unauthorized access and security incidents.</li>
            <li>To maintain, troubleshoot and improve our website and services.</li>
            <li>To comply with applicable legal, regulatory, accounting and record-keeping obligations.</li>
            <li>To send marketing communications where permitted and where the required consent or other lawful basis applies.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Consent and Other Lawful Grounds</h2>
          <p>
            Where consent is required, ZELORA will seek consent in the manner required by
            applicable law. Certain processing may also be necessary to provide a requested
            product or service, fulfil a contract, comply with a legal obligation, protect
            security, or for another lawful purpose recognized by applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Payment Information</h2>
          <ul style={listStyle}>
            <li>Payments may be processed through third-party payment service providers.</li>
            <li>Where a payment provider processes card, UPI or other payment credentials, those credentials may be handled directly by that provider according to its own terms and privacy practices.</li>
            <li>ZELORA receives and retains only the payment and transaction information reasonably necessary for order processing, reconciliation, support, fraud prevention and legal compliance.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Service Providers and Sharing</h2>
          <p>
            ZELORA may share personal data with service providers that help operate the
            website and fulfil orders, such as payment processors, hosting providers,
            technology providers, logistics and delivery partners, customer-support tools,
            analytics providers and professional advisers, where appropriate.
          </p>
          <p>
            We seek to limit access to information to what is reasonably necessary for the
            relevant purpose and require appropriate contractual or security protections where
            applicable.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Data Retention</h2>
          <p>
            We retain personal data for as long as reasonably necessary for the purpose for
            which it was collected, to provide services, maintain business and transaction
            records, resolve disputes, prevent fraud, and comply with applicable legal or
            regulatory requirements. When retention is no longer necessary, information may
            be deleted, anonymized or otherwise handled as permitted by law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Security</h2>
          <p>
            ZELORA uses reasonable technical and organizational measures appropriate to the
            nature of the personal data and processing activities. No internet transmission
            or storage system can be guaranteed to be completely secure.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Your Rights and Requests</h2>
          <ul style={listStyle}>
            <li>You may request information about personal data processed by ZELORA, subject to applicable law.</li>
            <li>You may request correction of inaccurate or incomplete personal data.</li>
            <li>You may request deletion or erasure where applicable and subject to legal retention requirements.</li>
            <li>You may withdraw consent where processing is based on consent, subject to applicable law and consequences explained at the time.</li>
            <li>You may raise a grievance regarding our handling of personal data.</li>
            <li>Requests may be sent to {GRIEVANCE_EMAIL}. We may need to verify identity before acting on a request.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>9. Cookies and Similar Technologies</h2>
          <p>
            ZELORA may use cookies or similar technologies for essential functionality,
            authentication, preferences, analytics, security and, where applicable,
            marketing. The specific technologies used may change as the website evolves.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>10. Children's Data</h2>
          <p>
            ZELORA does not knowingly seek to collect personal data from children in a manner
            prohibited by applicable law. Where age-related consent or parental/guardian
            requirements apply, ZELORA will follow the applicable requirements.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy when our practices, services or applicable law
            change. The updated version will be posted on this page with a revised effective
            or updated date.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>12. Privacy Grievance Contact</h2>
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
