import Link from "next/link";

const POLICY_LINKS = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund-policy", label: "Return & Refund" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
];

export default function PolicyNav() {
  return (
    <nav
      aria-label="Policy navigation"
      style={{
        borderBottom: "1px solid #262626",
        padding: "16px 0",
        marginBottom: "36px",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22, minWidth: "max-content" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
          ZELORA
        </Link>
        <span aria-hidden="true" style={{ color: "#555" }}>/</span>
        {POLICY_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ color: "#aaa", textDecoration: "none" }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
