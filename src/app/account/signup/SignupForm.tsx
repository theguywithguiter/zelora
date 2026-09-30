"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!accepted) {
      setError("Please accept the Terms & Privacy Policy.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
  success?: boolean;
  message?: string;
};

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      router.replace("/accounts");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form 
      suppressHydrationWarning
    className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-name-row">
        <div className="auth-field">
          <label htmlFor="signup-first-name">First name</label>
          <input
            suppressHydrationWarning
            id="signup-first-name"
            className="auth-input"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            placeholder="First name"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-last-name">Last name</label>
          <input
          suppressHydrationWarning
            id="signup-last-name"
            className="auth-input"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => update("lastName", event.target.value)}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email">Email address</label>
        <input
          suppressHydrationWarning
          id="signup-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-phone">Phone number</label>
        <input
          suppressHydrationWarning
          id="signup-phone"
          className="auth-input"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          placeholder="+91 98765 43210"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password">Password</label>
        <div className="auth-input-wrap">
          <input
            suppressHydrationWarning
            id="signup-password"
            className="auth-input auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-confirm-password">Confirm password</label>
        <div className="auth-input-wrap">
          <input
            suppressHydrationWarning
            id="signup-confirm-password"
            className="auth-input auth-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            placeholder="Repeat your password"
            required
          />
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowConfirmPassword((current) => !current)}
          >
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      {error ? <div className="auth-error" role="alert">{error}</div> : null}

      <label className="auth-terms">
        <input
          suppressHydrationWarning
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/terms-and-conditions">Terms</a> and{" "}
          <a href="/privacy-policy">Privacy Policy</a>.
        </span>
      </label>

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT  →"}
      </button>
    </form>
  );
}
