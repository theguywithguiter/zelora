"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
} = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to sign in.");
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
      <div className="auth-field">
        <label htmlFor="login-email">Email address</label>
        <input
        suppressHydrationWarning
          id="login-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">Password</label>
        <div className="auth-input-wrap">
          <input
          suppressHydrationWarning
            id="login-password"
            className="auth-input auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      <div className="auth-forgot">
        <a href="/account/forgot-password" onClick={(event) => event.preventDefault()}>
          FORGOT PASSWORD?
        </a>
      </div>

      {error ? <div className="auth-error" role="alert">{error}</div> : null}

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? "SIGNING IN..." : "SIGN IN  →"}
      </button>
    </form>
  );
}
