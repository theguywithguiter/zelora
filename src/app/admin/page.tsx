"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
  };
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  items: OrderItem[];
};

type Stats = {
  products: number;
  orders: number;
  customers: number;
  coupons: number;
};

type HeroBanner = {
  id: string;
  url: string;
  position: number;
  active: boolean;
};

type PaymentSettings = {
  cod: boolean;
  upi: boolean;
  card: boolean;
};

type Announcement = {
  id: number;
  text: string;
  position: number;
  active: boolean;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    customers: 0,
    coupons: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroMessage, setHeroMessage] = useState("");

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    cod: true,
    upi: true,
    card: true,
  });
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState("");

  async function handleAdminLogout() {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHeroBanners() {
    try {
      setHeroLoading(true);
      const response = await fetch("/api/admin/hero-banners", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to load hero banners.");
      setHeroBanners(Array.isArray(data.banners) ? data.banners : []);
    } catch (error) {
      console.error("Hero banners error:", error);
      setHeroMessage(error instanceof Error ? error.message : "Failed to load hero banners.");
    } finally {
      setHeroLoading(false);
    }
  }

  async function saveHeroBanners(next = heroBanners) {
    try {
      setHeroSaving(true);
      setHeroMessage("");
      const response = await fetch("/api/admin/hero-banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: next }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to save hero banners.");
      setHeroBanners(data.banners || []);
      setHeroMessage("Hero banner changes saved.");
    } catch (error) {
      setHeroMessage(error instanceof Error ? error.message : "Failed to save hero banners.");
    } finally {
      setHeroSaving(false);
    }
  }

  async function uploadHeroImages(files: FileList | null) {
    if (!files?.length) return;
    try {
      setHeroUploading(true);
      setHeroMessage("");
      const uploaded: HeroBanner[] = [];
      for (const file of Array.from(files)) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          throw new Error(`${file.name}: use JPG, PNG or WEBP.`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name}: image must be 10 MB or smaller.`);
        }
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok || !data?.url) throw new Error(data?.message || `Upload failed for ${file.name}.`);
        uploaded.push({
          id: `hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: String(data.url),
          position: heroBanners.length + uploaded.length,
          active: true,
        });
      }
      const next = [...heroBanners, ...uploaded];
      setHeroBanners(next);
      await saveHeroBanners(next);
    } catch (error) {
      setHeroMessage(error instanceof Error ? error.message : "Hero image upload failed.");
    } finally {
      setHeroUploading(false);
    }
  }

  function removeHero(id: string) {
    setHeroBanners((current) => current.filter((item) => item.id !== id).map((item, index) => ({ ...item, position: index })));
    setHeroMessage("Click Save banners to publish the new order.");
  }

  function moveHero(index: number, direction: -1 | 1) {
    setHeroBanners((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, position) => ({ ...item, position }));
    });
    setHeroMessage("Click Save banners to publish the new order.");
  }

  async function loadPaymentSettings() {
    try {
      const response = await fetch("/api/admin/payment-settings", { cache: "no-store" });
      const data = await response.json();
      if (response.ok && data?.success && data.settings) {
        setPaymentSettings({
          cod: data.settings.cod === true,
          upi: data.settings.upi === true,
          card: data.settings.card === true,
        });
      }
    } catch (error) {
      console.error("Payment settings error:", error);
      setPaymentMessage("Could not load payment settings.");
    }
  }

  function togglePayment(key: keyof PaymentSettings) {
    setPaymentSettings((current) => {
      const next = { ...current, [key]: !current[key] };
      if (!next.cod && !next.upi && !next.card) {
        setPaymentMessage("Keep at least one payment method enabled.");
        return current;
      }
      setPaymentMessage("");
      return next;
    });
  }

  async function savePaymentSettings() {
    if (!paymentSettings.cod && !paymentSettings.upi && !paymentSettings.card) {
      setPaymentMessage("Keep at least one payment method enabled.");
      return;
    }
    try {
      setPaymentSaving(true);
      setPaymentMessage("");
      const response = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentSettings),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to save payment settings.");
      setPaymentSettings(data.settings);
      setPaymentMessage("Payment settings saved.");
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : "Could not save payment settings.");
    } finally {
      setPaymentSaving(false);
    }
  }

  async function loadAnnouncements() {
    try {
      setAnnouncementLoading(true);
      const response = await fetch("/api/admin/announcements", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load announcements.");
      }

      setAnnouncements(
        Array.isArray(data.announcements) ? data.announcements : []
      );
    } catch (error) {
      console.error("Announcements error:", error);
      setAnnouncementMessage(
        error instanceof Error
          ? error.message
          : "Failed to load announcements."
      );
    } finally {
      setAnnouncementLoading(false);
    }
  }

  async function saveAnnouncements(next: Announcement[]) {
    try {
      setAnnouncementSaving(true);
      setAnnouncementMessage("");

      const response = await fetch("/api/admin/announcements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcements: next.map((item, position) => ({
            id: item.id,
            text: item.text,
            active: item.active,
            position,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save announcements.");
      }

      setAnnouncements(
        Array.isArray(data.announcements) ? data.announcements : next
      );
      setAnnouncementMessage("Announcements saved.");
    } catch (error) {
      setAnnouncementMessage(
        error instanceof Error
          ? error.message
          : "Failed to save announcements."
      );
    } finally {
      setAnnouncementSaving(false);
    }
  }

  async function addAnnouncement() {
    const text = newAnnouncement.trim();

    if (!text) {
      setAnnouncementMessage("Enter an announcement first.");
      return;
    }

    try {
      setAnnouncementSaving(true);
      setAnnouncementMessage("");

      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to add announcement.");
      }

      setAnnouncements((current) => [
        ...current,
        data.announcement,
      ]);
      setNewAnnouncement("");
      setAnnouncementMessage("Announcement added.");
    } catch (error) {
      setAnnouncementMessage(
        error instanceof Error
          ? error.message
          : "Failed to add announcement."
      );
    } finally {
      setAnnouncementSaving(false);
    }
  }

  async function deleteAnnouncement(id: number) {
    try {
      setAnnouncementSaving(true);
      setAnnouncementMessage("");

      const response = await fetch(
        `/api/admin/announcements?id=${id}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to delete announcement.");
      }

      setAnnouncements((current) =>
        current
          .filter((item) => item.id !== id)
          .map((item, position) => ({ ...item, position }))
      );
      setAnnouncementMessage("Announcement deleted.");
    } catch (error) {
      setAnnouncementMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete announcement."
      );
    } finally {
      setAnnouncementSaving(false);
    }
  }

  function updateAnnouncement(
    id: number,
    patch: Partial<Announcement>
  ) {
    setAnnouncements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
    setAnnouncementMessage("Click Save announcements to publish changes.");
  }

  function moveAnnouncement(index: number, direction: -1 | 1) {
    setAnnouncements((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];

      return next.map((item, position) => ({
        ...item,
        position,
      }));
    });

    setAnnouncementMessage("Click Save announcements to publish the new order.");
  }

  useEffect(() => {
    let active = true;

    async function verifyAdminSession() {
      try {
        const response = await fetch("/api/admin/auth", {
          cache: "no-store",
        });
        const data = await response.json();

        if (active && (!response.ok || !data?.authenticated)) {
          window.location.href = "/admin/login";
          return;
        }

        if (active) {
          loadDashboard();
          loadHeroBanners();
          loadPaymentSettings();
          loadAnnouncements();
        }
      } catch {
        if (active) {
          window.location.href = "/admin/login";
        }
      }
    }

    verifyAdminSession();

    return () => {
      active = false;
    };
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <style jsx>{`
        .admin {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(212, 175, 55, 0.07),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(212, 175, 55, 0.04),
              transparent 25%
            ),
            #050505;
          color: #f5f2eb;
          padding: 70px 32px;
          font-family:
            Inter,
            Manrope,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 45px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #d4af37;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 0.95;
        }

        .subtitle {
          margin: 12px 0 0;
          color: rgba(245, 242, 235, 0.45);
          font-size: 13px;
        }

        .refresh {
          appearance: none;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.05);
          color: #e3c47c;
          padding: 13px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: 0.3s ease;
        }

        .refresh:hover {
          background: rgba(212, 175, 55, 0.12);
          border-color: rgba(212, 175, 55, 0.55);
          transform: translateY(-2px);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 35px;
        }

        .stat {
          position: relative;
          display: block;
          min-width: 0;
          min-height: 185px;
          padding: 0 !important;
          box-sizing: border-box;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            );
          overflow: hidden;
          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease;
        }

        /* Dedicated inner wrapper prevents global admin CSS from
           removing the visual breathing room inside stat cards. */
        .statInner {
          position: relative;
          width: 100%;
          height: 100%;
          min-width: 0;
          padding: 25px 40px!important;
          box-sizing: border-box;
        }

        .stat::before {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          right: -80px;
          top: -80px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.07);
          filter: blur(25px);
        }

        .stat:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 55, 0.35);
          background: rgba(255, 255, 255, 0.065);
        }

        .statLabel {
          position: relative;
          color: rgba(245, 242, 235, 0.42);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .statNumber {
          position: relative;
          margin-top: 30px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 48px;
          font-weight: 400;
          line-height: 1;
        }

        .statLink {
          position: relative;
          display: inline-block;
          margin-top: 25px;
          color: #d4af37;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .orders {
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.025);
          overflow: hidden;
        }

        .ordersHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 25px 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ordersTitle {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 400;
        }

        .ordersSubtitle {
          margin: 7px 0 0;
          color: rgba(245, 242, 235, 0.4);
          font-size: 12px;
        }

        .viewAll {
          color: rgba(245, 242, 235, 0.5);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: 0.3s ease;
        }

        .viewAll:hover {
          color: #d4af37;
        }

        .order {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 22px 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: background 0.3s ease;
        }

        .order:last-child {
          border-bottom: 0;
        }

        .order:hover {
          background: rgba(255, 255, 255, 0.025);
        }

        .orderNumber {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .customer {
          margin: 7px 0 0;
          color: rgba(245, 242, 235, 0.55);
          font-size: 12px;
        }

        .date {
          margin: 5px 0 0;
          color: rgba(245, 242, 235, 0.28);
          font-size: 10px;
        }

        .orderRight {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .status {
          padding: 7px 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.06);
          color: #d4af37;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .items {
          color: rgba(245, 242, 235, 0.4);
          font-size: 11px;
        }

        .empty {
          padding: 70px 30px;
          text-align: center;
        }

        .emptyTitle {
          color: rgba(245, 242, 235, 0.7);
          font-size: 14px;
        }

        .emptyText {
          margin-top: 8px;
          color: rgba(245, 242, 235, 0.3);
          font-size: 12px;
        }

        .loading {
          padding: 60px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          color: rgba(245, 242, 235, 0.4);
          text-align: center;
        }

        @media (max-width: 1000px) {
          .container {
            width: 100%;
            max-width: none;
            margin-left: auto;
            margin-right: auto;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .admin {
            padding: 40px 18px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .ordersHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .order {
            align-items: flex-start;
            flex-direction: column;
          }

          .orderRight {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <main className="admin">
        <div className="container">

          <header className="header">
            <div>
              <p className="eyebrow">Store Management</p>

              <h1 className="title">ZELORA ADMIN</h1>

              <p className="subtitle">
                Manage your store from one place.
              </p>
            </div>

            <div className="headerActions">
              <button className="refresh" onClick={loadDashboard}>
                Refresh
              </button>
              <button className="refresh" onClick={handleAdminLogout}>
                Logout
              </button>
            </div>
          </header>

          {loading ? (
            <div className="loading">
              Loading dashboard...
            </div>
          ) : (
            <>
              <section className="stats">

                <Link href="/admin/products" className="stat">
                  <div className="statInner">
                    <div className="statLabel">Products</div>
                    <div className="statNumber">{stats.products}</div>
                    <div className="statLink">
                      Manage products →
                    </div>
                  </div>
                </Link>

                <Link href="/admin/orders" className="stat">
                  <div className="statInner">
                    <div className="statLabel">Orders</div>
                    <div className="statNumber">{stats.orders}</div>
                    <div className="statLink">
                      Manage orders →
                    </div>
                  </div>
                </Link>

                <Link href="/admin/customers" className="stat">
                  <div className="statInner">
                    <div className="statLabel">Customers</div>
                    <div className="statNumber">{stats.customers}</div>
                    <div className="statLink">
                      View customers →
                    </div>
                  </div>
                </Link>

                <Link href="/admin/coupons" className="stat">
                  <div className="statInner">
                    <div className="statLabel">Coupons</div>
                    <div className="statNumber">{stats.coupons}</div>
                    <div className="statLink">
                      Manage coupons →
                    </div>
                  </div>
                </Link>

              </section>

              <section style={{ marginBottom: 18 }}>
                <div style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))", overflow: "hidden" }}>
                  <div style={{ padding: "24px 26px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                    <p className="eyebrow">STOREFRONT CONTROL</p>
                    <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 400 }}>Announcement bar</h2>
                    <p style={{ margin: "7px 0 0", color: "rgba(245,242,235,.45)", fontSize: 12 }}>
                      Control the rotating messages shown at the very top of the homepage.
                    </p>
                  </div>

                  <div style={{ padding: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 10, marginBottom: 14 }}>
                      <input
                        value={newAnnouncement}
                        onChange={(e) => setNewAnnouncement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addAnnouncement();
                        }}
                        placeholder="e.g. USE COUPON ZELORA10 FOR 10% OFF"
                        maxLength={160}
                        style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, background: "rgba(255,255,255,.035)", color: "#f5f2eb", padding: "13px 15px", outline: "none", fontSize: 12 }}
                      />
                      <button
                        type="button"
                        onClick={addAnnouncement}
                        disabled={announcementSaving}
                        className="refresh"
                      >
                        + Add
                      </button>
                    </div>

                    {announcementLoading ? (
                      <div style={{ color: "rgba(245,242,235,.45)", padding: 20 }}>
                        Loading announcements...
                      </div>
                    ) : announcements.length === 0 ? (
                      <div style={{ color: "rgba(245,242,235,.45)", padding: 20, border: "1px dashed rgba(255,255,255,.1)", borderRadius: 14 }}>
                        No custom announcements yet. The homepage will use its default message.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 9 }}>
                        {announcements.map((item, index) => (
                          <div
                            key={item.id}
                            style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 10, alignItems: "center", padding: 10, border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, background: item.active ? "rgba(212,175,85,.045)" : "rgba(255,255,255,.018)" }}
                          >
                            <button
                              type="button"
                              onClick={() => updateAnnouncement(item.id, { active: !item.active })}
                              title={item.active ? "Disable" : "Enable"}
                              style={{ width: 76, borderRadius: 999, padding: "8px 10px", border: `1px solid ${item.active ? "rgba(212,175,85,.4)" : "rgba(255,255,255,.1)"}`, background: item.active ? "rgba(212,175,85,.12)" : "transparent", color: item.active ? "#e8c878" : "rgba(245,242,235,.45)", fontSize: 9, letterSpacing: ".12em", cursor: "pointer" }}
                            >
                              {item.active ? "ACTIVE" : "OFF"}
                            </button>

                            <input
                              value={item.text}
                              onChange={(e) => updateAnnouncement(item.id, { text: e.target.value })}
                              maxLength={160}
                              style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(255,255,255,.08)", borderRadius: 11, background: "rgba(255,255,255,.025)", color: "#f5f2eb", padding: "10px 12px", outline: "none", fontSize: 11 }}
                            />

                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                              <button type="button" onClick={() => moveAnnouncement(index, -1)} disabled={index === 0} style={{ borderRadius: 999, padding: "7px 10px", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#ddd", cursor: index === 0 ? "default" : "pointer" }}>↑</button>
                              <button type="button" onClick={() => moveAnnouncement(index, 1)} disabled={index === announcements.length - 1} style={{ borderRadius: 999, padding: "7px 10px", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#ddd", cursor: index === announcements.length - 1 ? "default" : "pointer" }}>↓</button>
                              <button type="button" onClick={() => deleteAnnouncement(item.id)} disabled={announcementSaving} style={{ borderRadius: 999, padding: "7px 11px", border: "1px solid rgba(220,100,100,.25)", background: "rgba(220,100,100,.05)", color: "#e29b9b", cursor: "pointer" }}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                      <span style={{ color: "rgba(245,242,235,.45)", fontSize: 10 }}>
                        {announcementMessage || `${announcements.filter((item) => item.active).length} active message${announcements.filter((item) => item.active).length === 1 ? "" : "s"}.`}
                      </span>
                      <button
                        type="button"
                        onClick={() => saveAnnouncements(announcements)}
                        disabled={announcementSaving || announcementLoading}
                        className="refresh"
                      >
                        {announcementSaving ? "Saving..." : "Save announcements"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)", gap: 18, marginBottom: 35 }}>
                <div style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))", overflow: "hidden" }}>
                  <div style={{ padding: "24px 26px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                    <p className="eyebrow">STOREFRONT CONTROL</p>
                    <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 400 }}>Hero banners</h2>
                    <p style={{ margin: "7px 0 0", color: "rgba(245,242,235,.45)", fontSize: 12 }}>Upload multiple images, reorder them and control the homepage hero carousel.</p>
                  </div>
                  <div style={{ padding: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 110, border: "1px dashed rgba(212,175,85,.35)", borderRadius: 18, background: "rgba(212,175,85,.025)", cursor: "pointer", color: "#e8c878", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", textAlign: "center", padding: 20 }}>
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => uploadHeroImages(e.target.files)} />
                      {heroUploading ? "Uploading images..." : "+ Choose multiple hero images"}
                    </label>
                    <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                      {heroLoading ? <div style={{ color: "rgba(245,242,235,.45)", padding: 20 }}>Loading banners...</div> : heroBanners.length === 0 ? <div style={{ color: "rgba(245,242,235,.45)", padding: 20 }}>No hero banners yet.</div> : heroBanners.map((banner, index) => (
                        <div key={banner.id} style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1fr) auto", gap: 12, alignItems: "center", padding: 10, border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.02)" }}>
                          <img src={banner.url} alt={`Hero ${index + 1}`} style={{ width: 90, height: 58, objectFit: "cover", borderRadius: 11 }} />
                          <div style={{ minWidth: 0 }}><strong style={{ fontSize: 12 }}>Banner {index + 1}</strong><p style={{ margin: "4px 0 0", color: "rgba(245,242,235,.35)", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{banner.url}</p></div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button type="button" onClick={() => moveHero(index, -1)} disabled={index === 0} style={{ borderRadius: 999, padding: "7px 10px", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#ddd" }}>↑</button>
                            <button type="button" onClick={() => moveHero(index, 1)} disabled={index === heroBanners.length - 1} style={{ borderRadius: 999, padding: "7px 10px", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#ddd" }}>↓</button>
                            <button type="button" onClick={() => removeHero(banner.id)} style={{ borderRadius: 999, padding: "7px 11px", border: "1px solid rgba(220,100,100,.25)", background: "rgba(220,100,100,.05)", color: "#e29b9b" }}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14 }}>
                      <span style={{ color: "rgba(245,242,235,.45)", fontSize: 10 }}>{heroMessage || `${heroBanners.length} banner${heroBanners.length === 1 ? "" : "s"} configured.`}</span>
                      <button type="button" onClick={() => saveHeroBanners()} disabled={heroSaving || heroUploading} className="refresh">{heroSaving ? "Saving..." : "Save banners"}</button>
                    </div>
                  </div>
                </div>

                <div style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))", overflow: "hidden" }}>
                  <div style={{ padding: "24px 26px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                    <p className="eyebrow">CHECKOUT CONTROL</p>
                    <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 400 }}>Payment methods</h2>
                    <p style={{ margin: "7px 0 0", color: "rgba(245,242,235,.45)", fontSize: 12 }}>Choose what customers can see at checkout.</p>
                  </div>
                  <div style={{ padding: 20, display: "grid", gap: 10 }}>
                    {[
                      ["cod", "Cash on Delivery", "COD"],
                      ["upi", "UPI / Digital Payment", "UPI"],
                      ["card", "Debit / Credit Card", "CARD"],
                    ].map(([key, title, short]) => {
                      const enabled = paymentSettings[key as keyof PaymentSettings];
                      return <button key={key} type="button" onClick={() => togglePayment(key as keyof PaymentSettings)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", padding: "15px 16px", borderRadius: 16, border: `1px solid ${enabled ? "rgba(212,175,85,.3)" : "rgba(255,255,255,.08)"}`, background: enabled ? "rgba(212,175,85,.06)" : "rgba(255,255,255,.02)", color: "#f5f2eb", textAlign: "left" }}>
                        <span><strong style={{ display: "block", fontSize: 12 }}>{title}</strong><small style={{ color: "rgba(245,242,235,.35)" }}>{short}</small></span>
                        <span style={{ minWidth: 70, textAlign: "center", padding: "7px 10px", borderRadius: 999, background: enabled ? "#d4af55" : "rgba(255,255,255,.08)", color: enabled ? "#080706" : "rgba(245,242,235,.5)", fontSize: 9, fontWeight: 800, letterSpacing: ".12em" }}>{enabled ? "ON" : "OFF"}</span>
                      </button>;
                    })}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
                      <span style={{ color: "rgba(245,242,235,.45)", fontSize: 10 }}>{paymentMessage || "At least one method must remain enabled."}</span>
                      <button type="button" onClick={savePaymentSettings} disabled={paymentSaving} className="refresh">{paymentSaving ? "Saving..." : "Save"}</button>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 15, marginBottom: 35, padding: "18px 22px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, background: "rgba(255,255,255,.02)" }}>
                <div><strong style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 400 }}>Catalog categories</strong><p style={{ margin: "4px 0 0", color: "rgba(245,242,235,.4)", fontSize: 11 }}>Create categories once, then select them while adding or editing products.</p></div>
                <Link href="/admin/categories" className="refresh">Manage categories →</Link>
              </section>

              <section className="orders">

                <div className="ordersHeader">
                  <div>
                    <h2 className="ordersTitle">
                      Recent Orders
                    </h2>

                    <p className="ordersSubtitle">
                      Latest activity from your store.
                    </p>
                  </div>

                  <Link
                    href="/admin/orders"
                    className="viewAll"
                  >
                    View all →
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="empty">
                    <div className="emptyTitle">
                      No orders yet.
                    </div>

                    <div className="emptyText">
                      Customer orders will appear here.
                    </div>
                  </div>
                ) : (
                  <div>
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="order"
                      >
                        <div>
                          <p className="orderNumber">
                            Order #{order.id}
                          </p>

                          <p className="customer">
                            {order.user?.name ||
                              order.user?.email ||
                              "Customer"}
                          </p>

                          <p className="date">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="orderRight">
                          <span className="status">
                            {order.status}
                          </span>

                          <span className="items">
                            {order.items.length} item
                            {order.items.length !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>
            </>
          )}

        </div>
      </main>
    </>
  );
}