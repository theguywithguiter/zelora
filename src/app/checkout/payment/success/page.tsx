"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";
  const [copied, setCopied] = useState(false);

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <section style={styles.card}>
        <div style={styles.checkWrap}>
          <div style={styles.checkCircle} aria-hidden="true">
            <span style={styles.checkMark}>✓</span>
          </div>
          <div style={styles.checkRing} />
        </div>

        <p style={styles.eyebrow}>ORDER RECEIVED</p>

        <h1 style={styles.title}>Thank you for your order.</h1>

        <p style={styles.message}>
          We are verifying your payment status.
          <br />
          This usually takes 2-3 hours.
        </p>

        {orderNumber && (
          <>
            <div style={styles.orderBox}>
              <span style={styles.orderLabel}>ORDER NUMBER</span>
              <strong style={styles.orderId}>{orderNumber}</strong>
              <button
                type="button"
                style={styles.copyButton}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(orderNumber);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  } catch {}
                }}
                aria-label="Copy order number"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
            <p style={styles.orderTrackingNote}>
              Save this order number for tracking purpose
            </p>
          </>
        )}

        <Link
          href="/accounts/orders"
          style={styles.ordersButton}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "translateY(-3px)";
            event.currentTarget.style.boxShadow =
              "0 16px 38px rgba(212,175,85,.22)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(0)";
            event.currentTarget.style.boxShadow =
              "0 10px 28px rgba(212,175,85,.12)";
          }}
          onMouseDown={(event) => {
            event.currentTarget.style.transform = "scale(.98)";
          }}
          onMouseUp={(event) => {
            event.currentTarget.style.transform = "translateY(-3px)";
          }}
        >
          My Orders <span style={styles.buttonArrow}></span>
        </Link>

        <p style={styles.note}>
          You can track your order and check its latest status from My Orders.
        </p>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main style={styles.page}>
          <div style={styles.loading}>Loading…</div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    padding: "32px 20px",
    background:
      "radial-gradient(circle at 50% 35%, rgba(212,175,85,.08), transparent 28%), #050505",
    color: "#f5f1e8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  glowOne: {
    position: "fixed",
    width: 420,
    height: 420,
    left: "50%",
    top: "50%",
    pointerEvents: "none",
    borderRadius: "50%",
    background: "rgba(212,175,85,.07)",
    filter: "blur(80px)",
    transform: "translate(-50%, -50%)",
    animation: "zeloraSuccessGlow 5s ease-in-out infinite",
  },
  glowTwo: {
    position: "fixed",
    width: 220,
    height: 220,
    right: "-70px",
    top: "12%",
    pointerEvents: "none",
    borderRadius: "50%",
    background: "rgba(212,175,85,.045)",
    filter: "blur(60px)",
    animation: "zeloraSuccessFloat 7s ease-in-out infinite",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "min(620px, 100%)",
    padding: "52px 38px 38px",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 26,
    background:
      "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
    textAlign: "center",
    boxShadow:
      "0 35px 100px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.035)",
    animation: "zeloraSuccessCardIn 650ms cubic-bezier(.2,.8,.2,1) both",
  },
  checkWrap: {
    position: "relative",
    width: 76,
    height: 76,
    margin: "0 auto 23px",
    animation: "zeloraSuccessPop 650ms cubic-bezier(.2,1.4,.4,1) 120ms both",
  },
  checkCircle: {
    position: "relative",
    zIndex: 2,
    width: 70,
    height: 70,
    display: "grid",
    placeItems: "center",
    margin: "3px auto",
    border: "1px solid rgba(212,175,85,.65)",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #f8b611ff, #eeb335ff)",
    color: "#090909",
    boxShadow:
      "0 0 0 8px rgba(212,175,85,.045), 0 18px 42px rgba(212,175,85,.16)",
  },
  checkMark: {
    display: "block",
    fontSize: 30,
    fontWeight: 900,
    lineHeight: 1,
    animation: "zeloraCheckDraw 500ms ease 550ms both",
  },
  checkRing: {
    position: "absolute",
    inset: 0,
    border: "1px solid rgba(212,175,85,.25)",
    borderRadius: "50%",
    animation: "zeloraSuccessRing 2.2s ease-out 650ms infinite",
  },
  eyebrow: {
    margin: 0,
    color: "#ffb700ff",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: ".22em",
    animation: "zeloraSuccessUp 550ms ease 260ms both",
  },
  title: {
    margin: "14px 0 0",
    color: "#f5f1e8",
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: "clamp(34px, 6vw, 50px)",
    fontWeight: 500,
    lineHeight: 1.03,
    letterSpacing: "-.025em",
    animation: "zeloraSuccessUp 550ms ease 330ms both",
  },
  message: {
    margin: "18px auto 0",
    maxWidth: 470,
    color: "rgba(245,241,232,.58)",
    fontSize: 13,
    lineHeight: 1.75,
    animation: "zeloraSuccessUp 550ms ease 400ms both",
  },
  orderBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginTop: 25,
    padding: "11px 15px",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    background: "rgba(255,255,255,.025)",
    animation: "zeloraSuccessUp 550ms ease 470ms both",
  },
  orderLabel: {
    color: "rgba(245,241,232,.32)",
    fontSize: 7,
    fontWeight: 800,
    letterSpacing: ".16em",
  },
  orderId: {
    color: "#e8ac16ff",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 12,
    letterSpacing: ".05em",
  },
  copyButton: {
    border: "1px solid rgba(212,175,85,.18)",
    borderRadius: 8,
    padding: "6px 8px",
    background: "rgba(255,255,255,.025)",
    color: "#e8ac16ff",
    fontSize: 7,
    fontWeight: 900,
    letterSpacing: ".1em",
    cursor: "pointer",
  },
  orderTrackingNote: {
    margin: "9px 0 0",
    color: "rgba(245,241,232,.38)",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: ".02em",
    textAlign: "center",
    animation: "zeloraSuccessUp 550ms ease 500ms both",
  },
  ordersButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: "100%",
    minHeight: 54,
    marginTop: 30,
    border: "1px solid rgba(212,175,85,.18)",
    borderRadius: 14,
    background: "linear-gradient(135deg, #ffb804ff, #ffba18ff)",
    color: "#090909",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: ".16em",
    textDecoration: "none",
    textTransform: "uppercase",
    boxShadow: "0 10px 28px rgba(212,175,85,.12)",
    transition:
      "transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease, filter 180ms ease",
    animation: "zeloraSuccessUp 550ms ease 540ms both",
  },
  buttonArrow: {
    display: "inline-block",
    transition: "transform 180ms ease",
  },
  note: {
    margin: "14px 0 0",
    color: "rgba(245,241,232,.28)",
    fontSize: 9,
    lineHeight: 1.55,
    animation: "zeloraSuccessUp 550ms ease 600ms both",
  },
  loading: {
    color: "rgba(245,241,232,.5)",
    fontSize: 12,
  },
};

if (typeof document !== "undefined") {
  const styleId = "zelora-payment-success-animations";

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes zeloraSuccessCardIn {
        from { opacity: 0; transform: translateY(18px) scale(.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes zeloraSuccessPop {
        0% { opacity: 0; transform: scale(.55) rotate(-8deg); }
        70% { opacity: 1; transform: scale(1.08) rotate(2deg); }
        100% { opacity: 1; transform: scale(1) rotate(0); }
      }

      @keyframes zeloraCheckDraw {
        from { opacity: 0; transform: scale(.55); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes zeloraSuccessRing {
        0% { opacity: .55; transform: scale(.9); }
        70%, 100% { opacity: 0; transform: scale(1.45); }
      }

      @keyframes zeloraSuccessUp {
        from { opacity: 0; transform: translateY(9px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes zeloraSuccessGlow {
        0%, 100% { transform: translate(-50%, -50%) scale(.92); opacity: .7; }
        50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
      }

      @keyframes zeloraSuccessFloat {
        0%, 100% { transform: translateY(0); opacity: .5; }
        50% { transform: translateY(18px); opacity: .9; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
