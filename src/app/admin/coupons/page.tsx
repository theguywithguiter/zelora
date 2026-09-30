"use client";

import { useEffect, useState } from "react";

type Coupon = {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  async function loadCoupons() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/coupons", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        throw new Error(data?.message || "Failed to fetch coupons.");
      }

      setCoupons(data);
    } catch (error) {
      console.error("Coupons load error:", error);
      alert(error instanceof Error ? error.message : "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function createCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();
    const numericValue = Number(value);

    if (!normalizedCode || !numericValue || numericValue <= 0) {
      alert("Please enter a coupon code and a valid discount value.");
      return;
    }

    if (type === "PERCENTAGE" && numericValue > 100) {
      alert("Percentage discount cannot be greater than 100%.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalizedCode,
          type,
          value: numericValue,
          minOrder: Number(minOrder) || 0,
          maxUses: Number(maxUses) || 0,
          expiresAt: expiresAt || null,
          active: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create coupon.");
      }

      setCode("");
      setType("PERCENTAGE");
      setValue("");
      setMinOrder("");
      setMaxUses("");
      setExpiresAt("");

      await loadCoupons();
    } catch (error) {
      console.error("Coupon create error:", error);
      alert(error instanceof Error ? error.message : "Failed to create coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCoupon(coupon: Coupon) {
    try {
      setBusyId(coupon.id);

      const response = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon.id,
          active: !coupon.active,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update coupon.");
      }

      setCoupons((current) =>
        current.map((item) =>
          item.id === coupon.id
            ? { ...item, active: !coupon.active }
            : item
        )
      );
    } catch (error) {
      console.error("Coupon toggle error:", error);
      alert(error instanceof Error ? error.message : "Failed to update coupon.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteCoupon(coupon: Coupon) {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusyId(coupon.id);

      const response = await fetch(
        `/api/admin/coupons?id=${coupon.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to delete coupon.");
      }

      setCoupons((current) =>
        current.filter((item) => item.id !== coupon.id)
      );
    } catch (error) {
      console.error("Coupon delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete coupon.");
    } finally {
      setBusyId(null);
    }
  }

  function formatDiscount(coupon: Coupon) {
    return coupon.type === "PERCENTAGE"
      ? `${coupon.value}% OFF`
      : `₹${Number(coupon.value).toLocaleString("en-IN")} OFF`;
  }

  function formatExpiry(value: string | null) {
    if (!value) return "Never";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Never";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="zelora-admin zelora-coupons-page">
      <style jsx global>{`
        .zelora-coupons-page {
          min-height: 100vh;
          padding: 48px 30px 80px;
          background:
            radial-gradient(circle at 88% 0%, rgba(212,175,85,.09), transparent 28%),
            #050505;
          color: #f5f2eb;
        }

        .zelora-coupons-shell {
          width: min(1450px, 100%);
          margin: 0 auto;
        }

        .zelora-coupons-header {
          margin-bottom: 30px;
        }

        .zelora-coupons-eyebrow {
          margin: 0 0 9px;
          color: #d4af55;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .zelora-coupons-title {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(46px, 6vw, 70px);
          font-weight: 400;
          line-height: .9;
          letter-spacing: -.04em;
        }

        .zelora-coupons-subtitle {
          margin: 13px 0 0;
          color: rgba(245,242,235,.43);
          font-size: 12px;
        }

        .zelora-coupons-grid {
          display: grid;
          grid-template-columns: 360px minmax(0,1fr);
          gap: 22px;
          align-items: start;
        }

        .zelora-coupon-card {
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          background: rgba(255,255,255,.025);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
          overflow: hidden;
        }

        .zelora-coupon-card-head {
          padding: 22px 23px 18px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .zelora-coupon-card-title {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 26px;
          font-weight: 500;
        }

        .zelora-coupon-card-note {
          margin: 5px 0 0;
          color: rgba(245,242,235,.38);
          font-size: 10px;
        }

        .zelora-coupon-form {
          padding: 22px;
          display: grid;
          gap: 15px;
        }

        .zelora-coupon-field label {
          display: block;
          margin-bottom: 7px;
          color: rgba(245,242,235,.46);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .zelora-coupon-field input,
        .zelora-coupon-field select {
          width: 100%;
          height: 44px;
          box-sizing: border-box;
          padding: 0 13px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px;
          outline: none;
          background: rgba(255,255,255,.035);
          color: #f5f2eb;
          font: inherit;
          font-size: 11px;
          transition: border-color 180ms ease, background 180ms ease;
        }

        .zelora-coupon-field input:focus,
        .zelora-coupon-field select:focus {
          border-color: rgba(212,175,85,.5);
          background: rgba(212,175,85,.045);
        }

        .zelora-coupon-field select option {
          background: #111;
          color: #fff;
        }

        .zelora-create-coupon-button {
          height: 46px;
          margin-top: 5px;
          border: 1px solid rgba(212,175,85,.5);
          border-radius: 999px;
          background: linear-gradient(135deg,#e8c878,#d4af55);
          color: #080706;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .zelora-create-coupon-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(212,175,85,.16);
        }

        .zelora-create-coupon-button:disabled {
          opacity: .5;
          cursor: wait;
          transform: none;
        }

        .zelora-coupon-list {
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,.018);
        }

        .zelora-coupon-list-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 23px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .zelora-coupon-list-title {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 25px;
          font-weight: 500;
        }

        .zelora-coupon-count {
          color: rgba(245,242,235,.38);
          font-size: 9px;
        }

        .zelora-coupon-table-wrap {
          overflow-x: auto;
        }

        .zelora-coupon-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        .zelora-coupon-table th {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          color: rgba(245,242,235,.3);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .18em;
          text-align: left;
          text-transform: uppercase;
        }

        .zelora-coupon-table td {
          padding: 18px;
          border-bottom: 1px solid rgba(255,255,255,.055);
          color: rgba(245,242,235,.7);
          font-size: 10px;
          vertical-align: middle;
        }

        .zelora-coupon-table tr:last-child td {
          border-bottom: 0;
        }

        .zelora-coupon-table tbody tr {
          transition: background 180ms ease;
        }

        .zelora-coupon-table tbody tr:hover {
          background: rgba(212,175,85,.035);
        }

        .zelora-coupon-code {
          color: #f5f2eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
        }

        .zelora-coupon-discount {
          color: #e8c878;
          font-weight: 700;
        }

        .zelora-coupon-muted {
          color: rgba(245,242,235,.38);
        }

        .zelora-status-toggle {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-width: 92px;
          height: 32px;
          padding: 0 11px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
          color: rgba(245,242,235,.48);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .zelora-status-toggle:hover {
          border-color: rgba(212,175,85,.35);
          background: rgba(212,175,85,.06);
          color: #e8c878;
        }

        .zelora-status-toggle.is-active {
          border-color: rgba(105,211,169,.3);
          background: rgba(105,211,169,.08);
          color: #8ed9bd;
        }

        .zelora-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 10px currentColor;
        }

        .zelora-delete-button {
          height: 32px;
          padding: 0 12px;
          border: 1px solid rgba(220,120,120,.22);
          border-radius: 999px;
          background: rgba(220,120,120,.045);
          color: #d99a9a;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .zelora-delete-button:hover {
          border-color: rgba(220,120,120,.5);
          background: rgba(220,120,120,.1);
          color: #f0b4b4;
        }

        .zelora-delete-button:disabled,
        .zelora-status-toggle:disabled {
          opacity: .45;
          cursor: wait;
        }

        .zelora-coupon-empty {
          padding: 70px 25px;
          text-align: center;
        }

        .zelora-coupon-empty-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          margin: 0 auto 15px;
          border: 1px solid rgba(212,175,85,.25);
          border-radius: 50%;
          color: #d4af55;
        }

        .zelora-coupon-empty h2 {
          margin: 0;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 25px;
          font-weight: 500;
        }

        .zelora-coupon-empty p {
          margin: 7px 0 0;
          color: rgba(245,242,235,.35);
          font-size: 10px;
        }

        @media (max-width: 900px) {
          .zelora-coupons-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .zelora-coupons-page {
            padding: 32px 16px 60px;
          }

          .zelora-coupon-card-head,
          .zelora-coupon-form,
          .zelora-coupon-list-head {
            padding-left: 17px;
            padding-right: 17px;
          }
        }
      `}</style>

      <div className="zelora-coupons-shell">
        <header className="zelora-coupons-header">
          <p className="zelora-coupons-eyebrow">ZELORA ADMIN / MARKETING</p>
          <h1 className="zelora-coupons-title">Coupons</h1>
          <p className="zelora-coupons-subtitle">
            Create, activate and manage discount codes for your store.
          </p>
        </header>

        <div className="zelora-coupons-grid">
          <section className="zelora-coupon-card">
            <div className="zelora-coupon-card-head">
              <h2 className="zelora-coupon-card-title">Create Coupon</h2>
              <p className="zelora-coupon-card-note">
                New coupons are active immediately.
              </p>
            </div>

            <form onSubmit={createCoupon} className="zelora-coupon-form">
              <div className="zelora-coupon-field">
                <label>Coupon Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME20"
                  autoComplete="off"
                />
              </div>

              <div className="zelora-coupon-field">
                <label>Discount Type</label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "PERCENTAGE" | "FIXED")
                  }
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
              </div>

              <div className="zelora-coupon-field">
                <label>Discount Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={type === "PERCENTAGE" ? "20" : "200"}
                />
              </div>

              <div className="zelora-coupon-field">
                <label>Minimum Order Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="zelora-coupon-field">
                <label>Maximum Uses</label>
                <input
                  type="number"
                  min="0"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="0 = Unlimited"
                />
              </div>

              <div className="zelora-coupon-field">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="zelora-create-coupon-button"
              >
                {saving ? "Creating..." : "Create Coupon"}
              </button>
            </form>
          </section>

          <section className="zelora-coupon-list">
            <div className="zelora-coupon-list-head">
              <div>
                <h2 className="zelora-coupon-list-title">Your Coupons</h2>
                <span className="zelora-coupon-count">
                  {coupons.length} coupon{coupons.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="zelora-coupon-empty">
                <p className="zelora-coupon-muted">Loading coupons...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="zelora-coupon-empty">
                <div className="zelora-coupon-empty-icon">%</div>
                <h2>No coupons yet</h2>
                <p>Create your first coupon using the form.</p>
              </div>
            ) : (
              <div className="zelora-coupon-table-wrap">
                <table className="zelora-coupon-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Minimum</th>
                      <th>Usage</th>
                      <th>Expiry</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td>
                          <span className="zelora-coupon-code">
                            {coupon.code}
                          </span>
                        </td>
                        <td>
                          <span className="zelora-coupon-discount">
                            {formatDiscount(coupon)}
                          </span>
                        </td>
                        <td className="zelora-coupon-muted">
                          ₹{Number(coupon.minOrder || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="zelora-coupon-muted">
                          {coupon.usedCount} /{" "}
                          {coupon.maxUses > 0 ? coupon.maxUses : "∞"}
                        </td>
                        <td className="zelora-coupon-muted">
                          {formatExpiry(coupon.expiresAt)}
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={busyId === coupon.id}
                            onClick={() => toggleCoupon(coupon)}
                            className={`zelora-status-toggle ${
                              coupon.active ? "is-active" : ""
                            }`}
                            title="Click to toggle coupon availability"
                          >
                            <span className="zelora-status-dot" />
                            {coupon.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={busyId === coupon.id}
                            onClick={() => deleteCoupon(coupon)}
                            className="zelora-delete-button"
                          >
                            {busyId === coupon.id ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
