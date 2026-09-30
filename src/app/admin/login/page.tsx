"use client";

import { FormEvent, useState } from "react";
import styles from "./AdminLogin.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${styles.ring} ${styles.ringOne}`} aria-hidden="true" />
      <div className={`${styles.ring} ${styles.ringTwo}`} aria-hidden="true" />

      <section className={styles.shell}>
        <div className={styles.brand}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Private Access
            <span className={styles.eyebrowLine} />
          </div>

          <h1 className={styles.logo}>ZELORA</h1>
          <p className={styles.subtitle}>Administration Portal</p>
        </div>

        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@zelora.com"
                autoComplete="username"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submit}
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <div className={styles.footer}>
            <span className={styles.statusDot} />
            <span>Authorized ZELORA personnel only</span>
          </div>
        </div>

        <p className={styles.bottomMark}>ZELORA · PRIVATE ADMINISTRATION</p>
      </section>
    </main>
  );
}
