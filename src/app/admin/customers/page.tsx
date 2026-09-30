"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type NewsletterSubscriber = {
  id?: number | string;
  email?: string | null;
  createdAt?: string | null;
};

type Customer = {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt?: string | null;
  _count?: {
    orders?: number;
  };
  orders?: any[];
};

function getCustomerName(customer: Customer) {
  const name = String(customer?.name || "").trim();
  return name || "Customer";
}

function getCustomerEmail(customer: Customer) {
  return String(customer?.email || "").trim() || "—";
}

function getCustomerPhone(customer: Customer) {
  return String(customer?.phone || "").trim() || "—";
}

function getOrderCount(customer: Customer) {
  if (typeof customer?._count?.orders === "number") {
    return customer._count.orders;
  }

  if (Array.isArray(customer?.orders)) {
    return customer.orders.length;
  }

  return 0;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [copyingSubscribers, setCopyingSubscribers] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await fetch("/api/admin/customers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load customers."
        );
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.customers)
          ? data.customers
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
              ? data.data
              : [];

      setCustomers(list);
    } catch (err) {
      console.error("Customers loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadSubscribers = useCallback(async () => {
    try {
      setSubscribersLoading(true);

      const response = await fetch("/api/admin/newsletter", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load newsletter subscribers."
        );
      }

      setSubscribers(
        Array.isArray(data?.subscribers) ? data.subscribers : []
      );
    } catch (err) {
      console.error("Newsletter subscribers loading error:", err);
      setSubscribers([]);
    } finally {
      setSubscribersLoading(false);
    }
  }, []);

  const copyAllSubscribers = useCallback(async () => {
    const emails = subscribers
      .map((subscriber) => String(subscriber?.email || "").trim())
      .filter(Boolean)
      .join(", ");

    if (!emails) return;

    try {
      setCopyingSubscribers(true);
      await navigator.clipboard.writeText(emails);
      setCopyStatus("COPIED");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 1800);
    } catch (err) {
      console.error("Copy newsletter subscribers error:", err);
      setCopyStatus("COPY FAILED");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 1800);
    } finally {
      setCopyingSubscribers(false);
    }
  }, [subscribers]);

  useEffect(() => {
    loadCustomers();
    loadSubscribers();
  }, [loadCustomers, loadSubscribers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const name = getCustomerName(customer).toLowerCase();
      const email = getCustomerEmail(customer).toLowerCase();
      const phone = getCustomerPhone(customer).toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [customers, search]);

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #050505;
        }

        body {
          color: #f5f2eb;
          font-family:
            Inter,
            Manrope,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .customers-page {
          --gold: #d6ae62;
          --gold-light: #e8c879;
          --white: #f5f2eb;
          --muted: rgba(245, 242, 235, 0.56);
          --muted-2: rgba(245, 242, 235, 0.32);
          --line: rgba(255, 255, 255, 0.09);
          --line-soft: rgba(255, 255, 255, 0.055);

          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(214, 174, 98, 0.075),
              transparent 30%
            ),
            #050505;
          color: var(--white);
        }

        .customers-shell {
          position: relative;
          z-index: 1;
          width: min(1480px, calc(100% - 80px));
          margin: 0 auto;
          padding: 48px 0 80px;
        }

        .customers-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          padding-bottom: 34px;
          border-bottom: 1px solid var(--line);
        }

        .eyebrow {
          margin: 0 0 13px;
          color: var(--gold);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }

        .title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 6vw, 82px);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.055em;
        }

        .subtitle {
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .pill {
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.025);
          color: var(--muted);
          cursor: pointer;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pill:hover {
          color: var(--white);
          border-color: rgba(214, 174, 98, 0.45);
          background: rgba(214, 174, 98, 0.055);
        }

        .overview {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin: 58px 0 24px;
        }

        .section-label {
          margin: 0;
          color: var(--gold);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .section-title {
          margin: 9px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 35px;
          font-weight: 400;
          letter-spacing: -0.035em;
        }

        .count {
          color: var(--muted-2);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 25px 0 12px;
        }

        .search {
          width: min(390px, 100%);
          height: 46px;
          padding: 0 16px;
          border: 1px solid var(--line);
          border-radius: 999px;
          outline: none;
          background: rgba(255, 255, 255, 0.025);
          color: var(--white);
          font-size: 12px;
        }

        .search::placeholder {
          color: var(--muted-2);
        }

        .search:focus {
          border-color: rgba(214, 174, 98, 0.45);
        }

        .table-wrap {
          overflow-x: auto;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.012);
        }

        .customer-row {
          display: grid;
          grid-template-columns:
            minmax(260px, 1.5fr)
            minmax(230px, 1.2fr)
            minmax(150px, 0.8fr)
            minmax(100px, 0.6fr)
            minmax(130px, 0.7fr);
          align-items: center;
          min-height: 86px;
          padding: 0 25px;
          gap: 22px;
          border-bottom: 1px solid var(--line-soft);
        }

        .customer-row:last-child {
          border-bottom: 0;
        }

        .customer-head {
          min-height: 50px;
          color: var(--muted-2);
          background: rgba(255, 255, 255, 0.02);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .customer-main {
          min-width: 0;
        }

        .customer-name {
          margin: 0 0 7px;
          color: var(--white);
          font-size: 14px;
          font-weight: 500;
        }

        .customer-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 14px;
          color: var(--muted-2);
          font-size: 10px;
          line-height: 1.5;
        }

        .customer-contact span {
          overflow-wrap: anywhere;
        }

        .customer-email,
        .customer-phone {
          color: var(--muted);
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .orders-count {
          color: var(--gold);
          font-size: 12px;
        }

        .joined {
          color: var(--muted-2);
          font-size: 10px;
        }

        .view-link {
          justify-self: start;
          color: var(--gold);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .view-link:hover {
          color: var(--gold-light);
        }

        .empty {
          padding: 80px 25px;
          text-align: center;
          border: 1px solid var(--line);
          color: var(--muted-2);
        }

        .empty strong {
          display: block;
          margin-bottom: 10px;
          color: var(--white);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 400;
        }

        .error {
          padding: 18px 20px;
          border: 1px solid rgba(214, 174, 98, 0.25);
          color: var(--muted);
          font-size: 12px;
        }

        .newsletter-admin {
          margin-top: 52px;
          border-top: 1px solid var(--line);
          padding-top: 28px;
        }

        .newsletter-admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
        }

        .newsletter-admin-title {
          margin: 8px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 400;
          letter-spacing: -0.035em;
        }

        .newsletter-admin-count {
          color: var(--muted-2);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .copy-emails {
          min-height: 40px;
          padding: 0 16px;
          border: 1px solid rgba(214, 174, 98, 0.35);
          border-radius: 999px;
          background: rgba(214, 174, 98, 0.035);
          color: var(--gold-light);
          cursor: pointer;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .copy-emails:hover:not(:disabled) {
          background: rgba(214, 174, 98, 0.08);
          border-color: rgba(214, 174, 98, 0.55);
          transform: translateY(-1px);
        }

        .copy-emails:disabled {
          cursor: default;
          opacity: 0.5;
        }

        .subscriber-list {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.012);
        }

        .subscriber-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 58px;
          padding: 0 20px;
          border-bottom: 1px solid var(--line-soft);
        }

        .subscriber-row:last-child {
          border-bottom: 0;
        }

        .subscriber-email {
          color: var(--white);
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .subscriber-date {
          flex: 0 0 auto;
          color: var(--muted-2);
          font-size: 9px;
          letter-spacing: 0.04em;
        }

        .subscriber-empty {
          padding: 35px 20px;
          color: var(--muted-2);
          font-size: 11px;
        }

        .copy-status {
          margin-left: 10px;
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .footer {
          margin-top: 70px;
          padding-top: 25px;
          border-top: 1px solid var(--line);
          color: var(--muted-2);
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .footer span {
          color: var(--gold);
        }

        @media (max-width: 900px) {
          .customers-shell {
            width: min(100% - 32px, 1480px);
          }

          .customers-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .search {
            width: 100%;
          }

          .table-wrap {
            overflow-x: auto;
          }

          .customer-row {
            min-width: 900px;
          }
        }

        @media (max-width: 600px) {
          .newsletter-admin-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .copy-emails {
            width: 100%;
          }

          .subscriber-row {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            gap: 7px;
            padding: 12px 16px;
          }
        }

        @media (max-width: 480px) {
          .customers-shell {
            width: calc(100% - 20px);
            padding-top: 28px;
          }

          .title {
            font-size: 52px;
          }
        }
      `}</style>

      <main className="customers-page">
        <div className="customers-shell">
          <header className="customers-header">
            <div>
              <p className="eyebrow">ZELORA / ADMINISTRATION</p>
              <h1 className="title">Customers.</h1>
              <p className="subtitle">
                View and manage your customer database.
              </p>
            </div>

            <div className="header-actions">
              <Link href="/admin" className="pill">
                ← Dashboard
              </Link>

              <button
                type="button"
                className="pill"
                onClick={async () => {
                  setRefreshing(true);

                  try {
                    await Promise.all([
                      loadCustomers(),
                      loadSubscribers(),
                    ]);
                  } finally {
                    setRefreshing(false);
                  }
                }}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>
          </header>

          <section className="overview">
            <div>
              <p className="section-label">CUSTOMER DATABASE</p>
              <h2 className="section-title">
                Your customers.
              </h2>
            </div>

            <span className="count">
              {customers.length}{" "}
              {customers.length === 1 ? "CUSTOMER" : "CUSTOMERS"}
            </span>
          </section>

          <div className="toolbar">
            <p className="section-label">
              CUSTOMER DIRECTORY
            </p>

            <input
              className="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, phone or email..."
              aria-label="Search customers"
            />
          </div>

          {error ? (
            <div className="error">
              {error}
            </div>
          ) : loading ? (
            <div className="empty">
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty">
              <strong>
                {search ? "No customers found." : "No customers yet."}
              </strong>
              <p>
                {search
                  ? "Try a different name, phone number or email."
                  : "Customer accounts will appear here after checkout."}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <div className="customer-row customer-head">
                <span>Customer</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Orders</span>
                <span>Joined</span>
              </div>

              {filteredCustomers.map((customer, index) => (
                <div
                  className="customer-row"
                  key={customer.id ?? `${getCustomerEmail(customer)}-${index}`}
                >
                  <div className="customer-main">
                    <p className="customer-name">
                      {getCustomerName(customer)}
                    </p>

                    <div className="customer-contact">
                      <span>
                        {getCustomerEmail(customer)}
                      </span>
                      <span>
                        {getCustomerPhone(customer)}
                      </span>
                    </div>
                  </div>

                  <span className="customer-email">
                    {getCustomerEmail(customer)}
                  </span>

                  <span className="customer-phone">
                    {getCustomerPhone(customer)}
                  </span>

                  <span className="orders-count">
                    {getOrderCount(customer)}
                  </span>

                  <span className="joined">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <section className="newsletter-admin">
            <div className="newsletter-admin-header">
              <div>
                <p className="section-label">NEWSLETTER</p>
                <h2 className="newsletter-admin-title">
                  Email subscribers.
                </h2>
              </div>

              <div>
                <button
                  type="button"
                  className="copy-emails"
                  onClick={copyAllSubscribers}
                  disabled={
                    subscribersLoading ||
                    subscribers.length === 0 ||
                    copyingSubscribers
                  }
                >
                  {copyingSubscribers
                    ? "Copying..."
                    : copyStatus || "Copy All Emails"}
                </button>

                <span className="copy-status" aria-live="polite">
                  {copyStatus}
                </span>
              </div>
            </div>

            {subscribersLoading ? (
              <div className="subscriber-list">
                <div className="subscriber-empty">
                  Loading newsletter subscribers...
                </div>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="subscriber-list">
                <div className="subscriber-empty">
                  No newsletter emails have been submitted yet.
                </div>
              </div>
            ) : (
              <div className="subscriber-list">
                {subscribers.map((subscriber, index) => (
                  <div
                    className="subscriber-row"
                    key={
                      subscriber.id ??
                      `${subscriber.email || "subscriber"}-${index}`
                    }
                  >
                    <span className="subscriber-email">
                      {subscriber.email || "—"}
                    </span>

                    <span className="subscriber-date">
                      {formatDate(subscriber.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="footer">
            <span>ZELORA ADMIN</span>
            {" / "}
            Customer management / Internal dashboard
          </footer>
        </div>
      </main>
    </>
  );
}
