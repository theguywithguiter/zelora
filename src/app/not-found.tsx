import Link from "next/link";

export default function NotFound() {
  return (
    <main className="zelora-404-page">
      <style>{`
        .zelora-404-page {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 40px 24px;
          background: #000000;
          color: #f5f1e8;
          isolation: isolate;
        }

        .zelora-404-page::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            radial-gradient(
              circle at 50% 44%,
              rgba(239, 191, 4, 0.075),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(239, 191, 4, 0.035),
              transparent 38%
            );
          pointer-events: none;
        }

        .zelora-404-page::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          opacity: 0.18;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          mask-image: radial-gradient(
            ellipse at center,
            black 0%,
            transparent 72%
          );
          pointer-events: none;
        }

        .zelora-404-orb {
          position: absolute;
          z-index: -1;
          width: min(520px, 75vw);
          aspect-ratio: 1;
          border: 1px solid rgba(239, 191, 4, 0.12);
          border-radius: 50%;
          box-shadow:
            0 0 100px rgba(239, 191, 4, 0.045),
            inset 0 0 80px rgba(239, 191, 4, 0.025);
          animation: zelora404Float 8s ease-in-out infinite;
          pointer-events: none;
        }

        .zelora-404-orb::before,
        .zelora-404-orb::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(239, 191, 4, 0.08);
        }

        .zelora-404-orb::before {
          inset: 9%;
        }

        .zelora-404-orb::after {
          inset: 22%;
        }

        .zelora-404-content {
          width: min(760px, 100%);
          text-align: center;
          animation: zelora404Reveal 900ms cubic-bezier(.16, 1, .3, 1) both;
        }

        .zelora-404-eyebrow {
          margin: 0;
          color: #EFBF04;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .zelora-404-number {
          margin: 18px 0 0;
          font-family:
            "Cormorant Garamond",
            "Times New Roman",
            Georgia,
            serif;
          font-size: clamp(150px, 27vw, 300px);
          font-weight: 300;
          line-height: 0.72;
          letter-spacing: -0.075em;
          color: transparent;
          background:
            linear-gradient(
              135deg,
              #D4AF37 0%,
              #E0C05A 42%,
              #C9A227 72%,
              #E8CF70 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow:
            0 0 60px rgba(239, 191, 4, 0.06);
        }

        .zelora-404-title {
          margin: 34px 0 0;
          font-family:
            "Cormorant Garamond",
            "Times New Roman",
            Georgia,
            serif;
          font-size: clamp(38px, 6vw, 68px);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.035em;
        }

        .zelora-404-title em {
          color: #EFBF04;
          font-style: italic;
        }

        .zelora-404-text {
          width: min(480px, 100%);
          margin: 20px auto 0;
          color: rgba(245, 241, 232, 0.48);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 12px;
          line-height: 1.85;
          letter-spacing: 0.02em;
        }

        .zelora-404-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 50px;
          margin-top: 32px;
          padding: 0 24px;
          border: 1px solid rgba(239, 191, 4, 0.42);
          border-radius: 999px;
          background:
            linear-gradient(
              135deg,
              rgba(239, 191, 4, 0.12),
              rgba(239, 191, 4, 0.035)
            );
          color: #EFBF04;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .zelora-404-button span {
          font-size: 15px;
          line-height: 1;
          transition: transform 220ms ease;
        }

        .zelora-404-button:hover {
          transform: translateY(-2px);
          border-color: rgba(239, 191, 4, 0.72);
          background:
            linear-gradient(
              135deg,
              rgba(239, 191, 4, 0.18),
              rgba(239, 191, 4, 0.06)
            );
          box-shadow: 0 12px 40px rgba(239, 191, 4, 0.08);
        }

        .zelora-404-button:hover span {
          transform: translateX(-4px);
        }

        .zelora-404-footer {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: rgba(245, 241, 232, 0.22);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .zelora-404-footer span:last-child {
          color: rgba(239, 191, 4, 0.38);
        }

        @keyframes zelora404Reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zelora404Float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-10px) scale(1.015);
          }
        }

        @media (max-width: 600px) {
          .zelora-404-page {
            padding: 30px 18px;
          }

          .zelora-404-number {
            font-size: clamp(130px, 42vw, 210px);
          }

          .zelora-404-title {
            margin-top: 28px;
          }

          .zelora-404-text {
            font-size: 11px;
          }

          .zelora-404-footer {
            left: 18px;
            right: 18px;
            bottom: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .zelora-404-page *,
          .zelora-404-page *::before,
          .zelora-404-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="zelora-404-orb" aria-hidden="true" />

      <div className="zelora-404-content">
        <p className="zelora-404-eyebrow">
          ZELORA / LOST IN THE COLLECTION
        </p>

        <div className="zelora-404-number" aria-hidden="true">
          404
        </div>

        <h1 className="zelora-404-title">
          This piece <em>doesn&apos;t exist.</em>
        </h1>

        <p className="zelora-404-text">
          The page you&apos;re looking for may have moved, disappeared,
          or was never part of the collection.
        </p>

        <Link href="/" className="zelora-404-button">
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>
      </div>

      <footer className="zelora-404-footer">
        <span>ZELORA / CRAFTED FOR EVERY STORY</span>
        <span>404</span>
      </footer>
    </main>
  );
}
