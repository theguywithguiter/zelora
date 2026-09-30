"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PaymentSettings.module.css";

type PaymentSettings = {
  cod: boolean;
  upi: boolean;
  card: boolean;
};

const DEFAULT_SETTINGS: PaymentSettings = {
  cod: true,
  upi: true,
  card: true,
};

const methods = [
  {
    key: "cod" as const,
    eyebrow: "01",
    title: "Cash on Delivery",
    short: "COD",
    description: "Allow customers to pay when their ZELORA order arrives.",
    icon: "₹",
  },
  {
    key: "upi" as const,
    eyebrow: "02",
    title: "UPI / Digital Payment",
    short: "UPI",
    description: "Show UPI and supported digital payment options at checkout.",
    icon: "⌁",
  },
  {
    key: "card" as const,
    eyebrow: "03",
    title: "Card",
    short: "CARD",
    description: "Allow customers to choose debit or credit card payment.",
    icon: "◇",
  },
];

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/payment-settings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.success && data.settings) {
        setSettings({
          cod: data.settings.cod === true,
          upi: data.settings.upi === true,
          card: data.settings.card === true,
        });
      }
    } catch (error) {
      console.error("Payment settings load error:", error);
      setMessage("Could not load payment settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function toggle(key: keyof PaymentSettings) {
    setMessage("");

    setSettings((current) => {
      const next = {
        ...current,
        [key]: !current[key],
      };

      if (!next.cod && !next.upi && !next.card) {
        setMessage("Keep at least one payment method enabled.");
        return current;
      }

      return next;
    });
  }

  async function saveSettings() {
    if (!settings.cod && !settings.upi && !settings.card) {
      setMessage("Keep at least one payment method enabled.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save");
      }

      setSettings(data.settings);
      setMessage("Payment settings saved successfully.");
    } catch (error) {
      console.error("Payment settings save error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save payment settings."
      );
    } finally {
      setSaving(false);
    }
  }

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <main className={styles.page}>
      <div className={styles.ambient} />
      <div className={styles.grain} />

      <header className={styles.header}>
        <div>
          <p>ZELORA ADMIN</p>
          <h1>Payment settings</h1>
          <span>Control which payment methods customers can see at checkout.</span>
        </div>

        <div className={styles.headerActions}>
          <Link href="/admin" className={styles.darkPill}>
            ← Dashboard
          </Link>

          <Link href="/checkout" className={styles.outlinePill}>
            Preview checkout ↗
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>CHECKOUT CONTROL</p>
          <h2>Choose how customers <em>pay.</em></h2>
          <span>
            Turn individual payment methods on or off without editing your
            checkout page.
          </span>
        </div>

        <div className={styles.statusCard}>
          <span>ACTIVE METHODS</span>
          <strong>{enabledCount}<small>/3</small></strong>
          <p>Changes apply to the checkout after saving.</p>
        </div>
      </section>

      <section className={styles.methods}>
        {methods.map((method) => {
          const enabled = settings[method.key];

          return (
            <article
              className={`${styles.method} ${enabled ? styles.methodActive : ""}`}
              key={method.key}
            >
              <div className={styles.methodTop}>
                <span>{method.eyebrow}</span>
                <div className={styles.icon}>{method.icon}</div>
                <b>{method.short}</b>
              </div>

              <div className={styles.methodBody}>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
              </div>

              <button
                type="button"
                className={`${styles.switch} ${enabled ? styles.switchOn : ""}`}
                onClick={() => toggle(method.key)}
                aria-pressed={enabled}
              >
                <span>{enabled ? "Enabled" : "Disabled"}</span>
                <i />
              </button>
            </article>
          );
        })}
      </section>

      <section className={styles.bottomBar}>
        <div>
          <span className={styles.dot} />
          <p>
            {message ||
              "At least one payment method must remain enabled for checkout."}
          </p>
        </div>

        <button
          type="button"
          className={styles.save}
          onClick={saveSettings}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save payment settings"}
          <span>→</span>
        </button>
      </section>
    </main>
  );
}
