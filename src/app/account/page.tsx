import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getSession();

  if (session) {
    redirect("/accounts");
  }

  return (
    <main className="account-gateway">
      <div className="account-ambient account-ambient-one" aria-hidden="true" />
      <div className="account-ambient account-ambient-two" aria-hidden="true" />

      <div className="account-gateway-shell">
        <Link href="/" className="account-brand" aria-label="ZELORA home">
          ZELORA
        </Link>

        <section className="account-gateway-card" aria-labelledby="account-title">
          <div className="account-eyebrow">YOUR PRIVATE SPACE</div>

          <h1 id="account-title">
            Welcome to
            <br />
            <em>your ZELORA.</em>
          </h1>

          <p className="account-intro">
            Sign in to access your orders, saved pieces and personalized
            creations — or create your private ZELORA space.
          </p>

          <div className="account-actions">
            <Link href="/account/login" className="account-primary">
              SIGN IN
              <span>→</span>
            </Link>

            <Link href="/account/signup" className="account-secondary">
              CREATE AN ACCOUNT
              <span>→</span>
            </Link>
          </div>

          <div className="account-divider">
            <span />
            <small>WELCOME TO ZELORA</small>
            <span />
          </div>

          <div className="account-features">
            <div>
              <span className="account-feature-icon">◷</span>
              <p>
                <strong>YOUR ORDERS</strong>
                Track every piece from creation to delivery.
              </p>
            </div>

            <div>
              <span className="account-feature-icon">♡</span>
              <p>
                <strong>SAVED PIECES</strong>
                Keep your favourites close for later.
              </p>
            </div>

            <div>
              <span className="account-feature-icon">◇</span>
              <p>
                <strong>YOUR CREATIONS</strong>
                Keep your personalized ZELORA pieces together.
              </p>
            </div>
          </div>
        </section>

        <p className="account-return">
          <Link href="/">RETURN TO ZELORA</Link>
        </p>
      </div>

      <style>{`
        .account-gateway {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(214, 171, 70, 0.095),
              transparent 27%
            ),
            #060606;
          color: #f5f0e7;
          isolation: isolate;
        }

        .account-ambient {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          filter: blur(1px);
        }

        .account-ambient-one {
          width: 560px;
          height: 560px;
          top: -230px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(
            circle,
            rgba(220, 180, 81, 0.075),
            transparent 68%
          );
        }

        .account-ambient-two {
          width: 420px;
          height: 420px;
          right: -230px;
          bottom: -190px;
          background: radial-gradient(
            circle,
            rgba(220, 180, 81, 0.045),
            transparent 70%
          );
        }

        .account-gateway-shell {
          width: min(calc(100% - 32px), 660px);
          min-height: 100svh;
          margin: 0 auto;
          padding: 34px 0 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .account-brand {
          margin-bottom: 34px;
          color: #f5f0e7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.38em;
          transition: color 180ms ease;
        }

        .account-brand:hover {
          color: #dcb451;
        }

        .account-gateway-card {
          width: 100%;
          box-sizing: border-box;
          padding: 52px clamp(22px, 7vw, 68px) 42px;
          border: 1px solid rgba(213, 169, 72, 0.18);
          border-radius: 32px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.052),
              rgba(255, 255, 255, 0.014)
            );
          box-shadow:
            0 34px 110px rgba(0, 0, 0, 0.44),
            inset 0 1px rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .account-eyebrow {
          text-align: center;
          color: #e7ab1fff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.28em;
        }

        .account-gateway-card h1 {
          margin: 17px 0 16px;
          text-align: center;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(43px, 8vw, 68px);
          line-height: 0.98;
          font-weight: 400;
          letter-spacing: -0.045em;
        }

        .account-gateway-card h1 em {
          color: #f7b206ff;
          font-style: normal;
        }

        .account-intro {
          max-width: 455px;
          margin: 0 auto;
          color: rgba(255, 255, 255, 0.44);
          text-align: center;
          font-size: 12px;
          line-height: 1.75;
        }

        .account-actions {
          margin-top: 34px;
          display: grid;
          gap: 11px;
        }

        .account-actions a {
          min-height: 56px;
          box-sizing: border-box;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 0 24px;
          text-decoration: none;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          transition:
            transform 220ms ease,
            background 220ms ease,
            border-color 220ms ease,
            color 220ms ease,
            box-shadow 220ms ease;
        }

        .account-actions a span {
          font-size: 16px;
          line-height: 1;
          font-weight: 400;
          transition: transform 220ms ease;
        }

        .account-primary {
          border: 1px solid #dcb451;
          background: #f6b204ff;
          color: #000000;
          box-shadow: 0 10px 30px rgba(220, 180, 81, 0.055);
        }

        .account-primary:hover {
          background: #f1c13dff;
          transform: translateY(-2px);
          box-shadow: 0 14px 38px rgba(220, 180, 81, 0.14);
        }

        .account-secondary {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.78);
        }

        .account-secondary:hover {
          border-color: rgba(255, 183, 0, 0.5);
          background: rgba(220, 180, 81, 0.045);
          color: #fdcd0dff;
          transform: translateY(-2px);
        }

        .account-actions a:hover span {
          transform: translateX(4px);
        }

        .account-divider {
          margin: 38px 0 27px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .account-divider span {
          height: 1px;
          flex: 1;
          background: rgba(255, 255, 255, 0.075);
        }

        .account-divider small {
          color: rgba(255, 255, 255, 0.24);
          font-size: 7px;
          letter-spacing: 0.2em;
          white-space: nowrap;
        }

        .account-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .account-features > div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .account-feature-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(220, 180, 81, 0.16);
          border-radius: 50%;
          color: #dcb451;
          font-size: 15px;
          margin-bottom: 11px;
        }

        .account-features p {
          margin: 0;
          color: rgba(255, 255, 255, 0.34);
          font-size: 9px;
          line-height: 1.55;
        }

        .account-features strong {
          display: block;
          margin-bottom: 5px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .account-return {
          margin: 25px 0 0;
        }

        .account-return a {
          color: rgba(255, 255, 255, 0.24);
          text-decoration: none;
          font-size: 8px;
          letter-spacing: 0.24em;
          transition: color 180ms ease;
        }

        .account-return a:hover {
          color: #dcb451;
        }

        @media (max-width: 560px) {
          .account-gateway-shell {
            width: min(calc(100% - 24px), 660px);
            padding: 24px 0 24px;
          }

          .account-brand {
            margin-bottom: 24px;
          }

          .account-gateway-card {
            padding: 39px 17px 30px;
            border-radius: 25px;
          }

          .account-gateway-card h1 {
            font-size: 44px;
          }

          .account-intro {
            font-size: 11px;
            line-height: 1.7;
          }

          .account-actions {
            margin-top: 28px;
          }

          .account-actions a {
            min-height: 54px;
            padding: 0 18px;
          }

          .account-divider {
            margin: 31px 0 23px;
          }

          .account-features {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .account-features > div {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 11px;
          }

          .account-feature-icon {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            margin: 0;
          }

          .account-features p {
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .account-actions a,
          .account-actions a span,
          .account-brand,
          .account-return a {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
