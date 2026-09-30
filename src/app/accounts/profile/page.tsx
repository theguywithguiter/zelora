"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../accounts.module.css";

async function readJson(response: Response) {
  const text = await response.text();

  if (!text.trim()) {
    return {
      data: null as any,
      message: `Request failed (${response.status}).`,
    };
  }

  try {
    return {
      data: JSON.parse(text),
      message: "",
    };
  } catch {
    return {
      data: null as any,
      message: "The server returned an invalid response.",
    };
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/accounts/profile", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/account/login";
          return;
        }

        const { data, message: parseMessage } = await readJson(response);

        if (cancelled) return;

        if (!response.ok || !data?.success) {
          setMessage(
            data?.message || parseMessage || "Unable to load your profile."
          );
          return;
        }

        setUser(data.user);
      } catch {
        if (!cancelled) {
          setMessage("Unable to load your profile. Please try again.");
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/accounts/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.get("email"),
          name: form.get("name"),
          phone: form.get("phone"),
        }),
      });

      if (response.status === 401) {
        window.location.href = "/account/login";
        return;
      }

      const { data, message: parseMessage } = await readJson(response);

      if (!response.ok || !data?.success) {
        setMessage(
          data?.message || parseMessage || "Unable to update your profile."
        );
        return;
      }

      // Replace the displayed data with the values returned from
      // the database, not merely the values from the form.
      setUser(data.user);
      setMessage("Profile updated.");
    } catch {
      setMessage("Unable to update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>ZELORA / ACCOUNT</p>
            <h1 className={styles.title}>Profile</h1>
          </div>

          <Link href="/accounts" className={styles.back}>
            ← Account overview
          </Link>
        </div>

        <div className={styles.pageContent}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Personal details</h2>
            <p className={styles.muted}>
              Your ZELORA account information.
            </p>

            {!user ? (
              <p className={styles.muted}>
                {message || "Loading…"}
              </p>
            ) : (
              <form onSubmit={save} className={styles.formGrid}>
                <div className={`${styles.field} ${styles.full}`}>
                  <label htmlFor="profile-email">Email address</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="profile-name">Name</label>
                  <input
                    id="profile-name"
                    name="name"
                    defaultValue={user.name}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="profile-phone">Phone</label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone || ""}
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.button}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            )}

            {message && user && (
              <p className={styles.muted}>{message}</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
