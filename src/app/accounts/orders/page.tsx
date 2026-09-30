"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../accounts.module.css";

function formatCurrency(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatPaymentMethod(value: unknown) {
  const method = String(value || "").toLowerCase();

  if (method === "cod") return "Cash on Delivery";
  if (method === "upi") return "UPI";
  if (method === "card") return "Card";

  return method
    ? method.charAt(0).toUpperCase() + method.slice(1)
    : "—";
}

function formatAddress(order: any) {
  return [
    order.address,
    order.city,
    order.state,
    order.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [copiedOrderId, setCopiedOrderId] = useState<number | string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (response.status === 401) {
          window.location.href = "/account/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load orders (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setOrders(
            Array.isArray(data?.orders)
              ? data.orders
              : []
          );
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    };

    loadOrders();

    // Re-fetch whenever the customer returns to this page/tab.
    // This prevents the order history from staying on an older
    // browser-cached response after a new order is placed.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadOrders();
      }
    };

    const handleFocus = () => {
      loadOrders();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    window.addEventListener("focus", handleFocus);

    return () => {
      cancelled = true;
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <main className={styles.shell}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>ZELORA / ACCOUNT</p>
            <h1 className={styles.title}>Orders</h1>
          </div>

          <Link href="/accounts" className={styles.back}>
            ← Account overview
          </Link>
        </div>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Order history</h2>

          <p className={styles.muted}>
            Every order placed from your ZELORA account.
          </p>

          {!orders.length ? (
            <div className={styles.empty}>
              No orders yet.
              <br />
              <Link href="/shop" className={styles.back}>
                Explore the collection →
              </Link>
            </div>
          ) : (
            <div className={styles.cards}>
              {orders.map((o) => {
                const subtotal = (o.items || []).reduce(
                  (sum: number, item: any) =>
                    sum +
                    Number(item.price || 0) *
                      Number(item.quantity || 0),
                  0
                );

                const shippingFee = Number(o.shippingFee || 0);
                const discount = Number(o.discount || 0);
                const total = Number(o.total || 0);

                return (
                  <article className={styles.order} key={o.id}>
                    <div className={styles.orderHead}>
                      <div>
                        <div className={styles.label}>Order iD</div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                          }}
                        >
                          <div
                            className={styles.value}
                            style={{ color: "#ecb337ff" }}
                          >
                            {o.orderNumber}
                          </div>

                          <button
                            type="button"
                            aria-label={`Copy order number ${o.orderNumber}`}
                            title={
                              copiedOrderId === o.id
                                ? "Copied"
                                : "Copy order number"
                            }
                            onClick={async () => {
  try {
    const text = String(o.orderNumber);

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopiedOrderId(o.id);
    window.setTimeout(() => {
      setCopiedOrderId((current) =>
        current === o.id ? null : current
      );
                                }, 1600);
                              } catch (copyError) {
                                console.error(
                                  "Copy order number error:",
                                  copyError
                                );
                              }
                            }}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid rgba(201, 162, 77, 0.28)",
                              borderRadius: "8px",
                              background: "rgba(201, 162, 77, 0.06)",
                              color: "#ebb133ff",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            {copiedOrderId === o.id ? (
                              <span
                                aria-hidden="true"
                                style={{ fontSize: "15px", lineHeight: 1 }}
                              >
                                ✓
                              </span>
                            ) : (
                              <svg
                                aria-hidden="true"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="9"
                                  y="9"
                                  width="11"
                                  height="11"
                                  rx="2"
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </button>
                        </div>

                        <div className={styles.muted}>
                          {new Date(o.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      <div className={styles.orderAmount}>
                        <div className={styles.label}>Total</div>

                        <strong>
                          {formatCurrency(total)}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.items}>
                      {o.items.map((i: any) => {
                        const lineTotal =
                          Number(i.price || 0) *
                          Number(i.quantity || 0);

                        return (
                          <div className={styles.item} key={i.id}>
                            <div className={styles.thumb}>
                              {i.product?.image && (
                                <img
                                  src={i.product.image}
                                  alt=""
                                />
                              )}
                            </div>

                            <div className={styles.itemInfo}>
                              <div className={styles.itemName}>
                                {i.product?.name}
                              </div>

                              <div className={styles.muted}>
                                Qty {i.quantity} ·{" "}
                                {formatCurrency(i.price)}
                              </div>
                            </div>

                            <div className={styles.price}>
                              {formatCurrency(lineTotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.orderLower}>
                      <div className={styles.orderMeta}>
                        <div className={styles.detailBlock}>
                          <div className={styles.sectionLabel}>
                            Delivery address
                          </div>

                          <div className={styles.detailValue}>
                            {formatAddress(o) || "—"}
                          </div>
                        </div>

                        <div className={styles.detailBlock}>
                          <div className={styles.sectionLabel}>
                            Payment method
                          </div>

                          <div className={styles.detailValue}>
                            {formatPaymentMethod(o.paymentMethod)}
                          </div>
                        </div>
                      </div>

                      <div className={styles.breakup}>
                        <div className={styles.sectionLabel}>
                          Price details
                        </div>

                        <div className={styles.breakupRows}>
                          <div className={styles.breakupRow}>
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>

                          <div className={styles.breakupRow}>
                            <span>Shipping</span>
                            <span>
                              {shippingFee > 0
                                ? formatCurrency(shippingFee)
                                : "Free"}
                            </span>
                          </div>

                          {discount > 0 && (
                            <div className={styles.breakupRow}>
                              <span>
                                Discount
                                {o.couponCode
                                  ? ` · ${o.couponCode}`
                                  : ""}
                              </span>

                              <span className={styles.discountValue}>
                                −{formatCurrency(discount)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`${styles.breakupRow} ${styles.breakupTotal}`}
                          >
                            <span>Total</span>
                            <strong>{formatCurrency(total)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.orderActions}>
                      <Link
                        href={`/accounts/orders/${o.id}/track`}
                        className={`${styles.button} ${styles.trackButton}`}
                      >
                        Track shipment
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
