"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image?: string | null;
  };
};

type Order = {
  id: number;
  orderNumber?: string | null;
  status: string;
  trackingNumber?: string | null;
  trackingWebsite?: string | null;
  total: number;
  paymentMethod?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
};

const TRACKING_STEPS = [
  {
    key: "PENDING",
    label: "Order Placed",
    description: "Your order has been received.",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    description: "Your order has been confirmed by ZELORA.",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    description: "Your piece is being prepared.",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    description: "Your order is on its way.",
    

  },

  
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered.",
  },
] as const;

const STATUS_INDEX: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

function formatCurrency(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAddress(order: Order) {
  return [
    order.address,
    order.city,
    order.state,
    order.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatPayment(value?: string | null) {
  const method = String(value || "").toLowerCase();

  if (method === "cod") return "Cash on Delivery";
  if (method === "upi") return "UPI";
  if (method === "card") return "Card";

  return method
    ? method.charAt(0).toUpperCase() + method.slice(1)
    : "—";
}

export default function TrackOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const orderId = useMemo(() => Number(params?.id), [params?.id]);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      setError("This order could not be found.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadOrder(initial = false) {
      try {
        if (initial) {
          setLoading(true);
          setError(null);
        }

        const response = await fetch("/api/accounts/orders", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          router.replace("/account/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || data?.success !== true) {
          throw new Error(
            data?.message || "Unable to load this order."
          );
        }

        const found = Array.isArray(data.orders)
          ? data.orders.find(
              (item: Order) => Number(item.id) === orderId
            )
          : null;

        if (!found) {
          throw new Error(
            "This order does not belong to your account."
          );
        }

        if (!cancelled) {
          setOrder(found);
          setLastSynced(new Date());
          setError(null);
        }
      } catch (requestError) {
        console.error("Track order error:", requestError);

        if (!cancelled && initial) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load this order."
          );
        }
      } finally {
        if (!cancelled && initial) {
          setLoading(false);
        }
      }
    }

    loadOrder(true);

    /*
     * The admin order status is the source of truth.
     * Polling keeps this page in sync when an admin changes
     * the status without requiring the customer to refresh.
     */
    const interval = window.setInterval(() => {
      loadOrder(false);
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [orderId, router]);

  const currentStatus = order?.status || "PENDING";
  const currentIndex = STATUS_INDEX[currentStatus] ?? -1;
  const exceptionalStatus =
    currentStatus === "CANCELLED" ||
    currentStatus === "PAYMENT_FAILED";

  const statusTitle =
    currentStatus === "CANCELLED"
      ? "Order Cancelled"
      : currentStatus === "PAYMENT_FAILED"
        ? "Payment Failed"
        : TRACKING_STEPS[currentIndex]?.label || "Order Placed";

  async function copyTrackingNumber() {
    if (!order?.trackingNumber) return;

    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      window.setTimeout(() => setCopiedTracking(false), 1800);
    } catch (error) {
      console.error("Failed to copy tracking number:", error);
    }
  }

  return (
    <main className="zelora-track-page">
      <style jsx global>{`
        .zelora-track-page {
          --track-bg: #070605;
          --track-panel: rgba(255, 255, 255, 0.025);
          --track-panel-strong: rgba(255, 255, 255, 0.045);
          --track-gold: #fcb103ff;
          --track-gold-soft: #f0ab20ff;
          --track-white: #f5f1e8;
          --track-muted: rgba(245, 241, 232, 0.46);
          --track-line: rgba(213, 177, 93, 0.24);

          min-height: 100vh;
          padding: 118px 28px 80px;
          color: var(--track-white);
          background:
            radial-gradient(
              circle at 78% 7%,
              rgba(213, 177, 93, 0.085),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 92%,
              rgba(213, 177, 93, 0.045),
              transparent 26%
            ),
            var(--track-bg);
        }

        .zelora-track-inner {
          width: min(1080px, 100%);
          margin: 0 auto;
        }

        .zelora-track-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: rgba(245, 241, 232, 0.52);
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition:
            color 250ms ease,
            transform 250ms ease;
        }

        .zelora-track-back:hover {
          color: var(--track-gold);
          transform: translateX(-2px);
        }

        .zelora-track-header {
          margin-top: 52px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .zelora-track-eyebrow {
          margin: 0 0 12px;
          color: var(--track-gold-soft);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .zelora-track-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 6vw, 70px);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 0.96;
        }

        .zelora-track-number {
          margin: 16px 0 0;
          color: rgba(245, 241, 232, 0.48);
          font-size: 12px;
          letter-spacing: 0.08em;
        }

        .zelora-track-card {
          position: relative;
          margin-top: 30px;
          padding: clamp(26px, 5vw, 54px);
          border: 1px solid rgba(213, 177, 93, 0.14);
          border-radius: 26px;
          overflow: hidden;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.042),
              rgba(255, 255, 255, 0.012)
            );
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .zelora-track-card::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -220px;
          top: -260px;
          border-radius: 50%;
          background: rgba(213, 177, 93, 0.045);
          filter: blur(18px);
          pointer-events: none;
        }

        .zelora-track-current {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.075);
        }

        .zelora-track-current-label {
          margin: 0 0 8px;
          color: rgba(245, 241, 232, 0.38);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .zelora-track-current-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(27px, 4vw, 42px);
          font-weight: 400;
        }

        .zelora-track-current-note {
          margin: 9px 0 0;
          color: var(--track-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .zelora-track-scroll-hint {
          margin: 14px 0 0;
          color: #7ee6a2;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .zelora-track-live {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(84, 210, 132, 0.34);
          border-radius: 999px;
          color: #7ee6a2;
          background: rgba(46, 180, 96, 0.095);
          box-shadow: 0 0 22px rgba(46, 180, 96, 0.08), inset 0 0 14px rgba(46, 180, 96, 0.035);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .zelora-track-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #52d47d;
          box-shadow: 0 0 14px rgba(82, 212, 125, 0.72);
          animation: zeloraTrackPulse 1.8s ease-in-out infinite;
        }

        .zelora-track-timeline {
          position: relative;
          z-index: 1;
          margin-top: 50px;
        }

        .zelora-track-step {
          position: relative;
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          min-height: 118px;
        }

        .zelora-track-rail {
          position: absolute;
          left: 43px;
          top: 76px;
          bottom: -1px;
          width: 1px;
          background: rgba(255, 255, 255, 0.09);
        }

        .zelora-track-step.is-complete .zelora-track-rail {
          background:
            linear-gradient(
              to bottom,
              rgba(213, 177, 93, 0.72),
              rgba(213, 177, 93, 0.22)
            );
        }

        .zelora-track-disc-wrap {
          position: relative;
          z-index: 2;
          width: 88px;
          height: 88px;
          display: grid;
          place-items: center;
        }

        .zelora-track-disc {
          position: relative;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(213, 177, 93, 0.18) 0 6px,
              transparent 7px
            ),
            repeating-radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.055) 0 1px,
              transparent 1px 5px
            ),
            #0d0c0a;
          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.42),
            inset 0 0 0 7px rgba(255, 255, 255, 0.012),
            inset 0 -9px 13px rgba(0, 0, 0, 0.5),
            inset 8px 7px 12px rgba(255, 255, 255, 0.045);
          overflow: hidden;
          isolation: isolate;
          transition:
            border-color 400ms ease,
            box-shadow 400ms ease,
            transform 500ms ease;
        }

        .zelora-track-disc::before,
        .zelora-track-disc::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .zelora-track-disc::before {
          inset: 4px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          background: conic-gradient(
            from 18deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.18),
            rgba(0, 0, 0, 0.18),
            rgba(255, 255, 255, 0.025),
            rgba(255, 255, 255, 0.02)
          );
          opacity: 0.72;
          mix-blend-mode: screen;
        }

        .zelora-track-disc::after {
          width: 9px;
          height: 9px;
          border: 1px solid rgba(255, 182, 13, 0.62);
          background: radial-gradient(circle at 35% 30%, #2b261a, #090807 68%);
          box-shadow:
            2px 3px 5px rgba(0, 0, 0, 0.72),
            -1px -1px 3px rgba(255, 255, 255, 0.08),
            0 0 12px rgba(213, 177, 93, 0.2);
          z-index: 3;
        }

        .zelora-track-step.is-active .zelora-track-disc {
          border-color: rgba(213, 177, 93, 0.72);
          box-shadow:
            0 0 0 8px rgba(213, 177, 93, 0.035),
            0 0 34px rgba(213, 177, 93, 0.15),
            0 16px 35px rgba(0, 0, 0, 0.48);
          animation: zeloraTrackSpin 5.5s linear infinite;
          background:
            conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.015),
              rgba(213, 177, 93, 0.11),
              rgba(255, 255, 255, 0.17),
              rgba(0, 0, 0, 0.18),
              rgba(255, 255, 255, 0.015),
              rgba(255, 255, 255, 0.015)
            ),
            radial-gradient(circle at 50% 50%, rgba(213, 177, 93, 0.2) 0 6px, transparent 7px),
            repeating-radial-gradient(circle at center, rgba(255, 255, 255, 0.055) 0 1px, transparent 1px 5px),
            #0d0c0a;
        }

        .zelora-track-step.is-complete .zelora-track-disc {
          border-color: rgba(213, 177, 93, 0.42);
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(213, 177, 93, 0.55) 0 6px,
              transparent 7px
            ),
            repeating-radial-gradient(
              circle at center,
              rgba(213, 177, 93, 0.11) 0 1px,
              transparent 1px 5px
            ),
            #100f0c;
        }

        .zelora-track-step.is-complete .zelora-track-disc::after {
          width: 7px;
          height: 7px;
          border: 0;
          background: var(--track-gold);
          box-shadow: 0 0 13px rgba(213, 177, 93, 0.55);
        }

        .zelora-track-step-body {
          padding: 14px 0 32px 18px;
        }

        .zelora-track-step-kicker {
          margin: 0 0 7px;
          color: rgba(245, 241, 232, 0.28);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .zelora-track-step-title {
          margin: 0;
          color: rgba(245, 241, 232, 0.42);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-weight: 400;
          transition:
            color 350ms ease,
            transform 350ms ease;
        }

        .zelora-track-step-description {
          max-width: 520px;
          margin: 7px 0 0;
          color: rgba(245, 241, 232, 0.27);
          font-size: 11px;
          line-height: 1.7;
          transition: color 350ms ease;
        }

        .zelora-track-step.is-complete .zelora-track-step-title,
        .zelora-track-step.is-active .zelora-track-step-title {
          color: var(--track-white);
        }

        .zelora-track-step.is-active .zelora-track-step-title {
          transform: translateX(3px);
        }

        .zelora-track-step.is-complete .zelora-track-step-description,
        .zelora-track-step.is-active .zelora-track-step-description {
          color: rgba(245, 241, 232, 0.48);
        }

        .zelora-track-step.is-active .zelora-track-step-kicker {
          color: var(--track-gold);
        }

        .zelora-track-step.is-last {
          min-height: 88px;
        }

        .zelora-track-meta {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 22px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.015);
        }

        .zelora-track-meta-block {
          padding: 20px;
        }

        .zelora-track-meta-block + .zelora-track-meta-block {
          border-left: 1px solid rgba(255, 255, 255, 0.075);
        }

        .zelora-track-meta-label {
          margin: 0 0 8px;
          color: rgba(245, 241, 232, 0.3);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .zelora-track-meta-value {
          margin: 0;
          color: rgba(245, 241, 232, 0.75);
          font-size: 12px;
          line-height: 1.7;
        }

        .zelora-track-products {
          position: relative;
          z-index: 1;
          margin-top: 18px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.075);
        }

        .zelora-track-products-label {
          margin: 0 0 14px;
          color: rgba(245, 241, 232, 0.3);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .zelora-track-product {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 10px 0;
        }

        .zelora-track-product + .zelora-track-product {
          border-top: 1px solid rgba(255, 255, 255, 0.055);
        }

        .zelora-track-product-thumb {
          width: 46px;
          height: 54px;
          flex: 0 0 46px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          background: #12100e;
        }

        .zelora-track-product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .zelora-track-product-name {
          margin: 0;
          color: rgba(245, 241, 232, 0.78);
          font-size: 12px;
        }

        .zelora-track-product-sub {
          margin: 4px 0 0;
          color: rgba(245, 241, 232, 0.34);
          font-size: 10px;
        }

        .zelora-track-product-price {
          margin-left: auto;
          color: var(--track-gold-soft);
          font-size: 11px;
          white-space: nowrap;
        }

        .zelora-track-shipment {
          margin-top: 30px;
          padding: 20px;
          border: 1px solid rgba(82, 212, 125, 0.18);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(82, 212, 125, 0.045), rgba(255, 255, 255, 0.018));
        }

        .zelora-track-shipment-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .zelora-track-shipment-label {
          margin: 0;
          color: rgba(245, 241, 232, 0.38);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .zelora-track-shipment-title {
          margin: 5px 0 0;
          color: var(--track-white);
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 25px;
          font-weight: 500;
        }

        .zelora-track-shipment-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 29px;
          padding: 0 10px;
          border: 1px solid rgba(82, 212, 125, 0.22);
          border-radius: 999px;
          background: rgba(82, 212, 125, 0.065);
          color: #74df96;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .zelora-track-shipment-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #52d47d;
          box-shadow: 0 0 10px rgba(82, 212, 125, 0.65);
        }

        .zelora-track-shipment-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
          margin-top: 17px;
        }

        .zelora-track-shipment-item {
          min-width: 0;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .zelora-track-shipment-item-label {
          margin: 0 0 8px;
          color: rgba(245, 241, 232, 0.3);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .zelora-track-shipment-value-row {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .zelora-track-shipment-value {
          min-width: 0;
          margin: 0;
          color: rgba(245, 241, 232, 0.84);
          font-size: 12px;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .zelora-track-shipment-action {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: inline-grid;
          place-items: center;
          border: 1px solid rgba(212, 175, 85, 0.24);
          border-radius: 10px;
          background: rgba(212, 175, 85, 0.045);
          color: var(--track-gold);
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .zelora-track-shipment-action:hover {
          transform: translateY(-1px);
          border-color: rgba(212, 175, 85, 0.5);
          background: rgba(212, 175, 85, 0.09);
        }

        .zelora-track-shipment-action svg {
          width: 15px;
          height: 15px;
        }

        .zelora-track-shipment-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 34px;
          max-width: 100%;
          padding: 0 11px;
          border: 1px solid rgba(212, 175, 85, 0.24);
          border-radius: 10px;
          background: rgba(212, 175, 85, 0.045);
          color: var(--track-gold);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .zelora-track-shipment-link:hover {
          transform: translateY(-1px);
          border-color: rgba(212, 175, 85, 0.5);
          background: rgba(212, 175, 85, 0.09);
        }

        .zelora-track-shipment-link svg {
          width: 13px;
          height: 13px;
        }

        .zelora-track-exception {
          position: relative;
          z-index: 1;
          margin-top: 30px;
          padding: 18px 20px;
          border: 1px solid rgba(210, 100, 100, 0.2);
          border-radius: 14px;
          background: rgba(210, 100, 100, 0.035);
        }

        .zelora-track-exception strong {
          display: block;
          color: #e3aaaa;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .zelora-track-exception span {
          display: block;
          margin-top: 6px;
          color: rgba(245, 241, 232, 0.46);
          font-size: 11px;
          line-height: 1.7;
        }

        .zelora-track-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
          color: rgba(245, 241, 232, 0.3);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .zelora-track-footer a {
          color: rgba(245, 241, 232, 0.55);
          text-decoration: none;
          transition: color 250ms ease;
        }

        .zelora-track-footer a:hover {
          color: var(--track-gold);
        }

        .zelora-track-loading,
        .zelora-track-error {
          min-height: 440px;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px solid rgba(213, 177, 93, 0.14);
          border-radius: 26px;
          background: rgba(255, 255, 255, 0.02);
        }

        .zelora-track-loading-inner,
        .zelora-track-error-inner {
          padding: 40px;
        }

        .zelora-track-loader {
          width: 54px;
          height: 54px;
          margin: 0 auto 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--track-gold);
          border-radius: 50%;
          animation: zeloraTrackSpin 1s linear infinite;
        }

        .zelora-track-error-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 400;
        }

        .zelora-track-error-text {
          max-width: 430px;
          margin: 10px auto 20px;
          color: var(--track-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .zelora-track-error-link {
          display: inline-flex;
          padding: 12px 18px;
          border: 1px solid rgba(213, 177, 93, 0.32);
          border-radius: 999px;
          color: var(--track-white);
          text-decoration: none;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        @keyframes zeloraTrackSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes zeloraTrackPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 700px) {
          .zelora-track-shipment-head {
            flex-direction: column;
          }

          .zelora-track-shipment-grid {
            grid-template-columns: 1fr;
          }

          .zelora-track-page {
            padding: 92px 18px 52px;
          }

          .zelora-track-header {
            margin-top: 36px;
          }

          .zelora-track-current {
            align-items: flex-start;
            flex-direction: column;
          }

          .zelora-track-step {
            grid-template-columns: 68px minmax(0, 1fr);
            min-height: 112px;
          }

          .zelora-track-rail {
            left: 33px;
          }

          .zelora-track-disc-wrap {
            width: 68px;
          }

          .zelora-track-disc {
            width: 50px;
            height: 50px;
          }

          .zelora-track-step-body {
            padding-left: 10px;
          }

          .zelora-track-step-title {
            font-size: 21px;
          }

          .zelora-track-meta {
            grid-template-columns: 1fr;
          }

          .zelora-track-meta-block + .zelora-track-meta-block {
            border-top: 1px solid rgba(255, 255, 255, 0.075);
            border-left: 0;
          }
        }

        @media (max-width: 430px) {
          .zelora-track-page {
            padding-left: 14px;
            padding-right: 14px;
          }

          .zelora-track-card {
            padding: 22px 18px;
            border-radius: 20px;
          }

          .zelora-track-title {
            font-size: 42px;
          }

          .zelora-track-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .zelora-track-page *,
          .zelora-track-page *::before,
          .zelora-track-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="zelora-track-inner">
        <Link
          href="/accounts/orders"
          className="zelora-track-back"
        >
          ← Back to orders
        </Link>

        {loading ? (
          <div className="zelora-track-loading" style={{ marginTop: 42 }}>
            <div className="zelora-track-loading-inner">
              <div className="zelora-track-loader" />
              <p className="zelora-track-eyebrow">ZELORA / TRACKING</p>
              <p className="zelora-track-number">
                Retrieving your order journey...
              </p>
            </div>
          </div>
        ) : error || !order ? (
          <div className="zelora-track-error" style={{ marginTop: 42 }}>
            <div className="zelora-track-error-inner">
              <p className="zelora-track-eyebrow">ZELORA / TRACKING</p>
              <h1 className="zelora-track-error-title">
                We couldn&apos;t find this order.
              </h1>
              <p className="zelora-track-error-text">
                {error || "The requested order is unavailable."}
              </p>
              <Link
                href="/accounts/orders"
                className="zelora-track-error-link"
              >
                Return to orders
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="zelora-track-header">
              <p className="zelora-track-eyebrow">ZELORA / TRACKING</p>
              <h1 className="zelora-track-title">Track your order</h1>
              <p className="zelora-track-number">
                {order.orderNumber || `Order #${order.id}`} · Placed{" "}
                {formatDate(order.createdAt)}
              </p>
            </header>

            <section className="zelora-track-card">
              <div className="zelora-track-current">
                <div>
                  <p className="zelora-track-current-label">Current status</p>
                  <h2 className="zelora-track-current-title">
                    {statusTitle}
                  </h2>
                  <p className="zelora-track-current-note">
                    {exceptionalStatus
                      ? "There is an update requiring your attention."
                      : currentStatus === "DELIVERED"
                        ? "Your ZELORA order has completed its journey."
                        : TRACKING_STEPS[currentIndex]?.description}
                  </p>

                  {currentStatus === "SHIPPED" && (
                    <p className="zelora-track-scroll-hint">
                      SCROLL TO GET TRACKING DETAILS
                    </p>
                  )}
                </div>

                {!exceptionalStatus && currentStatus !== "DELIVERED" && (
                  <div className="zelora-track-live">
                    <span className="zelora-track-live-dot" />
                    Live status
                  </div>
                )}

                {currentStatus === "DELIVERED" && (
                  <div className="zelora-track-live">
                    <span className="zelora-track-live-dot" />
                    Complete
                  </div>
                )}
              </div>

              <div className="zelora-track-timeline">
                {TRACKING_STEPS.map((step, index) => {
                  const isComplete = currentIndex > index;
                  const isActive = currentIndex === index;
                  const isLast = index === TRACKING_STEPS.length - 1;

                  return (
                    <div
                      key={step.key}
                      className={[
                        "zelora-track-step",
                        isComplete ? "is-complete" : "",
                        isActive ? "is-active" : "",
                        isLast ? "is-last" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {!isLast && <span className="zelora-track-rail" />}

                      <div className="zelora-track-disc-wrap">
                        <div
                          className="zelora-track-disc"
                          aria-label={`${step.label} status`}
                        />
                      </div>

                      <div className="zelora-track-step-body">
                        <p className="zelora-track-step-kicker">
                          {isComplete
                            ? "Completed"
                            : isActive
                              ? "Current"
                              : ""}
                        </p>
                        <h3 className="zelora-track-step-title">
                          {step.label}
                        </h3>
                        <p className="zelora-track-step-description">
                          {step.description}
                        </p>
                        
                        
                      </div>
                    </div>
                  );
                })}
              </div>

              {(order.trackingNumber || order.trackingWebsite) && (
                <section className="zelora-track-shipment">
                  <div className="zelora-track-shipment-head">
                    <div>
                      <p className="zelora-track-shipment-label">Shipment tracking</p>
                      <h3 className="zelora-track-shipment-title">Track your parcel</h3>
                    </div>

                    <span className="zelora-track-shipment-status">
                      <span className="zelora-track-shipment-dot" />
                      Tracking available
                    </span>
                  </div>

                  <div className="zelora-track-shipment-grid">
                    {order.trackingNumber && (
                      <div className="zelora-track-shipment-item">
                        <p className="zelora-track-shipment-item-label">Tracking number</p>
                        <div className="zelora-track-shipment-value-row">
                          <p className="zelora-track-shipment-value">
                            {order.trackingNumber}
                          </p>
                          <button
                            type="button"
                            className="zelora-track-shipment-action"
                            onClick={copyTrackingNumber}
                            aria-label="Copy tracking number"
                            title={copiedTracking ? "Copied" : "Copy tracking number"}
                          >
                            {copiedTracking ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                                <rect x="8" y="8" width="11" height="11" rx="2" />
                                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" strokeLinecap="round" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {order.trackingWebsite && (
                      <div className="zelora-track-shipment-item">
                        <p className="zelora-track-shipment-item-label">Tracking website</p>
                        <div className="zelora-track-shipment-value-row">
                          <p className="zelora-track-shipment-value">
                            {order.trackingWebsite}
                          </p>
                          <a
                            href={order.trackingWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="zelora-track-shipment-link"
                            aria-label="Open tracking website"
                            title="Open tracking website"
                          >
                            <span>Open</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                              <path d="M14 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="m10 14 9-9" strokeLinecap="round" />
                              <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" strokeLinecap="round" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {exceptionalStatus && (
                <div className="zelora-track-exception">
                  <strong>
                    {currentStatus === "CANCELLED"
                      ? "Order cancelled"
                      : "Payment failed"}
                  </strong>
                  <span>
                    {currentStatus === "CANCELLED"
                      ? "This order is no longer moving through the standard delivery journey."
                      : "This order cannot proceed until the payment issue is resolved."}
                  </span>
                </div>
              )}

              <div className="zelora-track-meta">
                <div className="zelora-track-meta-block">
                  <p className="zelora-track-meta-label">
                    Delivery address
                  </p>
                  <p className="zelora-track-meta-value">
                    {formatAddress(order) || "—"}
                  </p>
                </div>

                <div className="zelora-track-meta-block">
                  <p className="zelora-track-meta-label">
                    Payment
                  </p>
                  <p className="zelora-track-meta-value">
                    {formatPayment(order.paymentMethod)}
                  </p>
                </div>
              </div>

              {order.items?.length > 0 && (
                <div className="zelora-track-products">
                  <p className="zelora-track-products-label">
                    Your pieces
                  </p>

                  {order.items.map((item) => (
                    <div
                      className="zelora-track-product"
                      key={item.id}
                    >
                      <div className="zelora-track-product-thumb">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt=""
                          />
                        )}
                      </div>

                      <div>
                        <p className="zelora-track-product-name">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="zelora-track-product-sub">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <span className="zelora-track-product-price">
                        {formatCurrency(
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="zelora-track-footer">
              <span>
                Last synced{" "}
                {lastSynced
                  ? lastSynced.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>

              <Link href="/accounts/orders">
                View all orders →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
