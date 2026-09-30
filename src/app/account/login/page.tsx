import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/accounts");
  }

  return (
    <main className="auth-page">
      <div className="auth-ambient" aria-hidden="true" />

      <div className="auth-shell">
        <Link href="/" className="auth-brand" aria-label="ZELORA home">
          ZELORA
        </Link>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-heading">
            <span>WELCOME BACK</span>
            <h1 id="login-title">
              Your pieces
              <br />
              <em>are waiting.</em>
            </h1>
            <p>Sign in to continue to your private ZELORA space.</p>
          </div>

          <LoginForm />

          <p className="auth-switch">
            New to ZELORA?{" "}
            <Link href="/account/signup">CREATE AN ACCOUNT →</Link>
          </p>
        </section>

        <p className="auth-footer">
          <Link href="/">RETURN TO ZELORA</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 18%, rgba(204, 160, 61, .11), transparent 31%),
            #060606;
          color: #f5f0e7;
        }

        .auth-ambient {
          position: absolute;
          width: 520px;
          height: 520px;
          left: 50%;
          top: 10%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205, 164, 67, .07), transparent 68%);
          pointer-events: none;
        }

        .auth-shell {
          width: min(100% - 36px, 560px);
          min-height: 100vh;
          margin: 0 auto;
          padding: 34px 0 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .auth-brand {
          color: #f5f0e7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .38em;
          margin-bottom: 42px;
        }

        .auth-card {
          width: 100%;
          padding: 46px clamp(24px, 6vw, 58px) 40px;
          border: 1px solid rgba(213, 169, 72, .18);
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
          box-shadow: 0 30px 100px rgba(0,0,0,.38), inset 0 1px rgba(255,255,255,.035);
          backdrop-filter: blur(18px);
        }

        .auth-heading {
          text-align: center;
          margin-bottom: 34px;
        }

        .auth-heading > span {
          color: #f4b115ff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .28em;
        }

        .auth-heading h1 {
          margin: 15px 0 14px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 7vw, 58px);
          line-height: .99;
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .auth-heading h1 em {
          color: #f9b404ff;
          font-style: normal;
        }

        .auth-heading p {
          max-width: 390px;
          margin: 0 auto;
          color: rgba(255,255,255,.45);
          font-size: 12px;
          line-height: 1.7;
        }

        .auth-form {
          display: grid;
          gap: 17px;
        }

        .auth-field {
          display: grid;
          gap: 8px;
        }

        .auth-field label {
          margin-left: 4px;
          color: rgba(255,255,255,.42);
          font-size: 8px;
          letter-spacing: .2em;
          font-weight: 600;
          text-transform: uppercase;
        }

        .auth-input-wrap {
          position: relative;
        }

        .auth-input {
          width: 100%;
          height: 56px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 999px;
          outline: none;
          padding: 0 19px;
          background: rgba(255,255,255,.035);
          color: #fff;
          font: inherit;
          font-size: 13px;
          transition: 200ms ease;
        }

        .auth-input:focus {
          border-color: rgba(252, 181, 2, 0.65);
          background: rgba(220,180,81,.035);
          box-shadow: 0 0 0 3px rgba(220,180,81,.055);
        }

        .auth-input::placeholder {
          color: rgba(255,255,255,.24);
        }

        .auth-password {
          padding-right: 62px;
        }

        .auth-toggle {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          height: 38px;
          min-width: 44px;
          padding: 0 12px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255,255,255,.4);
          cursor: pointer;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .auth-toggle:hover {
          color: #eeb420ff;
        }

        .auth-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
        }

        .auth-forgot a,
        .auth-switch a {
          color: #e9aa09ff;
          text-decoration: none;
          transition: color 180ms ease;
        }

        .auth-forgot a {
          font-size: 9px;
          letter-spacing: .12em;
        }

        .auth-forgot a:hover,
        .auth-switch a:hover {
          color: #fff;
        }

        .auth-submit {
          height: 56px;
          margin-top: 4px;
          border: 1px solid #f3b30fff;
          border-radius: 999px;
          background: #f7b40aff;
          color: #000000;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .2em;
          transition: 220ms ease;
        }

        .auth-submit:hover:not(:disabled) {
          background: #f9ce60ff;
          transform: translateY(-1px);
          box-shadow: 0 12px 35px rgba(220,180,81,.15);
        }

        .auth-submit:disabled {
          opacity: .55;
          cursor: wait;
        }

        .auth-error {
          padding: 12px 15px;
          border: 1px solid rgba(215,92,92,.25);
          border-radius: 16px;
          background: rgba(215,92,92,.055);
          color: #e6a2a2;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .auth-switch {
          margin: 28px 0 0;
          text-align: center;
          color: rgba(255,255,255,.4);
          font-size: 10px;
          letter-spacing: .05em;
        }

        .auth-switch a {
          margin-left: 4px;
          font-weight: 600;
          letter-spacing: .12em;
        }

        .auth-footer {
          margin: 26px 0 0;
        }

        .auth-footer a {
          color: rgba(255,255,255,.26);
          text-decoration: none;
          font-size: 8px;
          letter-spacing: .24em;
        }

        .auth-footer a:hover {
          color: #dcb451;
        }

        @media (max-width: 520px) {
          .auth-shell {
            width: min(100% - 24px, 560px);
            padding-top: 24px;
          }

          .auth-brand {
            margin-bottom: 28px;
          }

          .auth-card {
            padding: 38px 18px 30px;
            border-radius: 24px;
          }

          .auth-heading {
            margin-bottom: 28px;
          }

          .auth-heading h1 {
            font-size: 43px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-input,
          .auth-submit {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
