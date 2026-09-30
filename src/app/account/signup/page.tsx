import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
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

        <section className="auth-card" aria-labelledby="signup-title">
          <div className="auth-heading">
            <span>CREATE YOUR ZELORA</span>
            <h1 id="signup-title">
              Make it
              <br />
              <em>personal.</em>
            </h1>
            <p>Create your account and keep your pieces, orders and creations together.</p>
          </div>

          <SignupForm />

          <p className="auth-switch">
            Already have an account?{" "}
            <Link href="/account/login">SIGN IN →</Link>
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
          width: min(100% - 36px, 600px);
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
          margin-bottom: 38px;
        }

        .auth-card {
          width: 100%;
          padding: 44px clamp(20px, 6vw, 55px) 38px;
          border: 1px solid rgba(213, 169, 72, .18);
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
          box-shadow: 0 30px 100px rgba(0,0,0,.38), inset 0 1px rgba(255,255,255,.035);
          backdrop-filter: blur(18px);
        }

        .auth-heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-heading > span {
          color: #f5b011ff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .28em;
        }

        .auth-heading h1 {
          margin: 15px 0 13px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(39px, 7vw, 56px);
          line-height: .99;
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .auth-heading h1 em {
          color: #f2b10fff;
          font-style: normal;
        }

        .auth-heading p {
          max-width: 430px;
          margin: 0 auto;
          color: rgba(255,255,255,.45);
          font-size: 12px;
          line-height: 1.7;
        }

        .auth-form {
          display: grid;
          gap: 15px;
        }

        .auth-name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
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
          height: 54px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 999px;
          outline: none;
          padding: 0 18px;
          background: rgba(255,255,255,.035);
          color: #fff;
          font: inherit;
          font-size: 13px;
          transition: 200ms ease;
        }

        .auth-input:focus {
          border-color: rgba(233, 177, 37, 0.65);
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
          height: 36px;
          min-width: 44px;
          padding: 0 11px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255,255,255,.4);
          cursor: pointer;
          font-size: 8px;
          letter-spacing: .12em;
        }

        .auth-toggle:hover {
          color: #e7b638ff;
        }

        .auth-submit {
          height: 56px;
          margin-top: 5px;
          border: 1px solid #f7b40bff;
          border-radius: 999px;
          background: #f4b209ff;
          color: #000000;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .2em;
          transition: 220ms ease;
        }

        .auth-submit:hover:not(:disabled) {
          background: #fad167ff;
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

        .auth-terms {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: rgba(255,255,255,.34);
          font-size: 9px;
          line-height: 1.55;
        }

        .auth-terms input {
          width: 14px;
          height: 14px;
          margin: 1px 0 0;
          accent-color: #dcb451;
          flex: 0 0 auto;
        }

        .auth-terms a {
          color: rgba(255,255,255,.62);
        }

        .auth-switch {
          margin: 27px 0 0;
          text-align: center;
          color: rgba(255,255,255,.4);
          font-size: 10px;
        }

        .auth-switch a {
          margin-left: 4px;
          color: #f0be41ff;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: .12em;
        }

        .auth-switch a:hover {
          color: #fff;
        }

        .auth-footer {
          margin: 25px 0 0;
        }

        .auth-footer a {
          color: rgba(255,255,255,.26);
          text-decoration: none;
          font-size: 8px;
          letter-spacing: .24em;
        }

        .auth-footer a:hover {
          color: #f3c03fff;
        }

        @media (max-width: 520px) {
          .auth-shell {
            width: min(100% - 24px, 600px);
            padding-top: 24px;
          }

          .auth-brand {
            margin-bottom: 25px;
          }

          .auth-card {
            padding: 36px 16px 28px;
            border-radius: 24px;
          }

          .auth-name-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .auth-heading {
            margin-bottom: 26px;
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
