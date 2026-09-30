import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ZELORA — Crafted for Every Story",
  description:
    "Discover the story behind ZELORA, our philosophy and our approach to personalized jewellery crafted for meaningful moments.",

  alternates: {
    canonical: "/about-us",
  },

  openGraph: {
    type: "website",
    title: "About ZELORA — Crafted for Every Story",
    description:
      "Discover the story behind ZELORA, our philosophy and our approach to personalized jewellery crafted for meaningful moments.",
    url: "/about-us",
    siteName: "ZELORA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZELORA — Crafted for Every Story",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About ZELORA — Crafted for Every Story",
    description:
      "Discover the story behind ZELORA, our philosophy and our approach to personalized jewellery crafted for meaningful moments.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.8 13.7 10.3 21.2 12l-7.5 1.7L12 21.2l-1.7-7.5L2.8 12l7.5-1.7L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function AboutUsPage() {
  return (
    <main className="about-page">
      <header className="about-nav">
        <div className="about-nav-inner">
          <Link href="/" className="about-logo" aria-label="ZELORA home">
            <span>ZELORA</span>
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <nav className="about-nav-links" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/personalize">Personalize</Link>
          </nav>

          <Link href="/cart" className="about-bag">
            Bag <span>→</span>
          </Link>
        </div>
      </header>

      <section className="about-hero">
        <div className="about-hero-orbit about-orbit-one" />
        <div className="about-hero-orbit about-orbit-two" />
        <div className="about-hero-glow" />
        <div className="about-grain" />

        <div className="about-hero-content">
          <Link href="/" className="back-home">
            <span className="back-home-arrow">←</span>
            Back to Home
          </Link>

          <div className="about-eyebrow">
            <span />
        
          </div>

          <h1>
            Made for
            <br />
            <em>your story.</em>
          </h1>

          <p>
            We believe the things you wear should feel like they belong to you.
            ZELORA creates thoughtful jewelry and accessories designed to turn
            memories, moments and meaning into something you can keep close.
          </p>

          <div className="hero-scroll-note">
            <span>01</span>
            <i />
            DISCOVER ZELORA
          </div>
        </div>
      </section>

      <div className="gold-rule">
        <span />
      </div>

      <section className="about-intro">
        <div className="about-container intro-grid">
          <div className="section-kicker">
            <span>01</span>
            <p>WHY WE EXIST</p>
          </div>

          <div>
            <h2>
              Not just an accessory.
              <br />
              <em>A piece of you.</em>
            </h2>

            <p className="intro-copy">
              ZELORA was built around a simple idea: personal things deserve
              personal design. From the first detail to the final finish, we
              focus on creating pieces that feel intentional, timeless and
              unmistakably yours.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-container">
          <div className="section-heading">
            <div>
              <span className="about-eyebrow">
                <span />
                
              </span>
              <h2>
                Three things
                <br />
                <em>we never compromise.</em>
              </h2>
            </div>
            <p>
              Every ZELORA piece is shaped by the same principles — thoughtful
              design, meaningful personalization and a finish that feels
              worthy of the story behind it.
            </p>
          </div>

          <div className="value-grid">
            <article className="value-card">
              <span className="value-number">01</span>
              <div className="value-icon">
                <SparkIcon />
              </div>
              <h3>Meaning</h3>
              <p>
                Your piece should mean something. We design with memories,
                people and moments in mind.
              </p>
              <span className="value-line" />
            </article>

            <article className="value-card">
              <span className="value-number">02</span>
              <div className="value-icon">
                <SparkIcon />
              </div>
              <h3>Craft</h3>
              <p>
                Details matter. We care about the small decisions that make a
                piece feel considered rather than ordinary.
              </p>
              <span className="value-line" />
            </article>

            <article className="value-card">
              <span className="value-number">03</span>
              <div className="value-icon">
                <SparkIcon />
              </div>
              <h3>You</h3>
              <p>
                There is no single way to tell a story. Personalization lets
                every piece become distinctly yours.
              </p>
              <span className="value-line" />
            </article>
          </div>
        </div>
      </section>

      <section className="about-manifesto">
        <div className="manifesto-frame" />
        <div className="manifesto-glow" />

        <div className="about-container manifesto-content">
          <span className="about-eyebrow">
            <span />
            THE ZELORA MINDSET
          </span>

          <blockquote>
            “The best pieces
            <br />
            <em>carry a story.</em>”
          </blockquote>

          <p>
            A name. A date. A feeling. A memory you never want to forget.
            ZELORA exists to give those details a form you can hold, wear and
            return to.
          </p>
        </div>
      </section>

      <section className="about-process">
        <div className="about-container">
          <div className="process-header">
            <div className="section-kicker">
              <span>02</span>
              <p>THE EXPERIENCE</p>
            </div>
            <h2>
              From an idea
              <br />
              <em>to something yours.</em>
            </h2>
          </div>

          <div className="process-list">
            <div className="process-item">
              <span>01</span>
              <div>
                <h3>Choose</h3>
                <p>Find the piece that speaks to your story.</p>
              </div>
              <ArrowIcon />
            </div>

            <div className="process-item">
              <span>02</span>
              <div>
                <h3>Personalize</h3>
                <p>Add the details that make it uniquely yours.</p>
              </div>
              <ArrowIcon />
            </div>

            <div className="process-item">
              <span>03</span>
              <div>
                <h3>Keep</h3>
                <p>Receive a piece made to become part of your story.</p>
              </div>
              <ArrowIcon />
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-ring" />
        <div className="about-container about-cta-content">
          <span className="about-eyebrow">
            <span />
            YOUR STORY STARTS HERE
          </span>

          <h2>
            Find something
            <br />
            <em>worth keeping.</em>
          </h2>

          <Link href="/shop" className="gold-button">
            Explore the collection
            <ArrowIcon />
          </Link>

          <Link href="/" className="subtle-home-link">
            ← Back to Home
          </Link>
        </div>
      </section>

      <footer className="about-footer">
        <div className="about-container footer-top">
          <Link href="/" className="footer-logo">
            <span>ZELORA</span>
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <div className="footer-links">
            <div>
              <span>EXPLORE</span>
              <Link href="/shop">Shop</Link>
              <Link href="/shop">Collections</Link>
              <Link href="/shop">Personalize</Link>
            </div>

            <div>
              <span>COMPANY</span>
              <Link href="/about-us">About Us</Link>
              <Link href="/contact">Help Center</Link>
              <Link href="/track-order">Track Order</Link>
            </div>

            <div>
              <span>ACCOUNT</span>
              <Link href="/account">Account</Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/cart">Bag</Link>
            </div>
          </div>
        </div>

        <div className="about-container footer-bottom">
          <span>© {new Date().getFullYear()} ZELORA. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED FOR EVERY STORY.</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-page {
          --about-gold: #efbf04;
          --about-gold-deep: #c9a227;
          --about-gold-light: #e0c05a;
          --about-black: #000;
          --about-ivory: #f4f1eb;
          --about-muted: rgba(255, 255, 255, 0.46);
          min-height: 100vh;
          overflow: hidden;
          background: #000;
          color: #fff;
          font-family: "Manrope", sans-serif;
        }

        .about-page :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .about-container {
          width: min(1400px, calc(100% - 80px));
          margin: 0 auto;
        }

        .about-nav {
          position: absolute;
          inset: 0 0 auto;
          z-index: 50;
          height: 82px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(18px);
        }

        .about-nav-inner {
          width: min(1400px, calc(100% - 80px));
          height: 100%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .about-logo,
        .footer-logo {
          display: inline-flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .about-logo span,
        .footer-logo span {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.38em;
        }

        .about-logo small,
        .footer-logo small {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 6px;
          letter-spacing: 0.24em;
        }

        .about-logo:hover span {
          color: var(--about-gold);
        }

        .about-nav-links {
          display: flex;
          align-items: center;
          gap: 34px;
        }

        .about-nav-links a {
          position: relative;
          color: rgba(255, 255, 255, 0.58);
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color 300ms ease;
        }

        .about-nav-links a::after {
          content: "";
          position: absolute;
          right: 100%;
          bottom: -8px;
          left: 0;
          height: 1px;
          background: var(--about-gold);
          transition: right 350ms cubic-bezier(.16, 1, .3, 1);
        }

        .about-nav-links a:hover {
          color: #fff;
        }

        .about-nav-links a:hover::after {
          right: 0;
        }

        .about-bag {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 11px 17px 11px 19px;
          border: 1px solid rgba(239, 191, 4, 0.42);
          border-radius: 999px;
          color: #000 !important;
          background: linear-gradient(
            135deg,
            var(--about-gold-light),
            var(--about-gold-deep)
          );
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: transform 400ms ease, box-shadow 400ms ease;
        }

        .about-bag span {
          font-size: 15px;
          transition: transform 300ms ease;
        }

        .about-bag:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(239, 191, 4, 0.18);
        }

        .about-bag:hover span {
          transform: translateX(4px);
        }

        .about-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #000;
        }

        .about-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 72% 46%,
              rgba(239, 191, 4, 0.09),
              transparent 25%
            ),
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.98) 0%,
              rgba(0, 0, 0, 0.72) 55%,
              rgba(0, 0, 0, 0.94) 100%
            );
          pointer-events: none;
        }

        .about-hero-orbit {
          position: absolute;
          border: 1px solid rgba(239, 191, 4, 0.11);
          border-radius: 50%;
          pointer-events: none;
        }

        .about-orbit-one {
          right: -160px;
          top: 13%;
          width: 760px;
          height: 760px;
          animation: aboutOrbit 14s ease-in-out infinite;
        }

        .about-orbit-two {
          right: 45px;
          top: 28%;
          width: 490px;
          height: 490px;
          border-color: rgba(239, 191, 4, 0.06);
          animation: aboutOrbitReverse 11s ease-in-out infinite;
        }

        .about-hero-glow {
          position: absolute;
          right: 9%;
          top: 27%;
          width: 430px;
          height: 430px;
          border-radius: 50%;
          background: rgba(239, 191, 4, 0.055);
          filter: blur(90px);
          animation: aboutPulse 7s ease-in-out infinite;
          pointer-events: none;
        }

        .about-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
        }

        .about-hero-content {
          position: relative;
          z-index: 5;
          width: min(1400px, calc(100% - 80px));
          margin: auto;
          padding-top: 85px;
        }

        .back-home {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 76px;
          padding: 10px 15px 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            border-color 350ms ease,
            color 350ms ease,
            background 350ms ease,
            transform 350ms ease;
        }

        .back-home-arrow {
          display: inline-flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(239, 191, 4, 0.4);
          border-radius: 50%;
          color: var(--about-gold);
          font-size: 14px;
          transition: transform 350ms ease;
        }

        .back-home:hover {
          transform: translateY(-2px);
          border-color: rgba(239, 191, 4, 0.4);
          background: rgba(239, 191, 4, 0.04);
          color: #fff !important;
        }

        .back-home:hover .back-home-arrow {
          transform: translateX(-3px);
        }

        .about-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: rgba(239, 191, 4, 0.82);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }

        .about-eyebrow > span {
          width: 34px;
          height: 1px;
          background: var(--about-gold);
        }

        .about-hero h1 {
          max-width: 950px;
          margin: 31px 0 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(76px, 11vw, 158px);
          font-weight: 400;
          line-height: 0.76;
          letter-spacing: -0.055em;
          text-transform: uppercase;
        }

        .about-hero h1 em {
          color: var(--about-gold);
          font-style: italic;
          text-transform: lowercase;
        }

        .about-hero-content > p {
          max-width: 505px;
          margin: 48px 0 0;
          color: rgba(255, 255, 255, 0.47);
          font-size: 13px;
          font-weight: 300;
          line-height: 1.95;
        }

        .hero-scroll-note {
          position: absolute;
          right: 0;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 13px;
          color: rgba(255, 255, 255, 0.28);
          font-size: 8px;
          letter-spacing: 0.25em;
        }

        .hero-scroll-note span {
          color: var(--about-gold);
        }

        .hero-scroll-note i {
          width: 60px;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .gold-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.07);
        }

        .gold-rule span {
          display: block;
          width: 72px;
          height: 1px;
          margin: auto;
          background: var(--about-gold);
          box-shadow: 0 0 22px rgba(239, 191, 4, 0.5);
        }

        .about-intro,
        .about-values,
        .about-process {
          padding: 150px 0;
          background: #000;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 70px;
        }

        .section-kicker {
          display: flex;
          align-items: center;
          gap: 16px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 8px;
          letter-spacing: 0.23em;
        }

        .section-kicker span {
          color: var(--about-gold);
        }

        .section-kicker p {
          margin: 0;
        }

        .intro-grid h2,
        .section-heading h2,
        .process-header h2,
        .about-cta h2 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(55px, 7vw, 105px);
          font-weight: 400;
          line-height: 0.86;
          letter-spacing: -0.05em;
        }

        .intro-grid h2 em,
        .section-heading h2 em,
        .process-header h2 em,
        .about-cta h2 em {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }

        .intro-copy {
          max-width: 540px;
          margin: 48px 0 0;
          color: rgba(255, 255, 255, 0.42);
          font-size: 13px;
          line-height: 2;
        }

        .about-values {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .section-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 70px;
          align-items: end;
          margin-bottom: 70px;
        }

        .section-heading h2 {
          margin-top: 31px;
        }

        .section-heading > p {
          margin: 0 0 6px;
          color: rgba(255, 255, 255, 0.38);
          font-size: 12px;
          line-height: 1.9;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .value-card {
          position: relative;
          min-height: 380px;
          padding: 35px 38px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition:
            background 500ms ease,
            transform 500ms ease;
        }

        .value-card:last-child {
          border-right: 0;
        }

        .value-card:hover {
          background: rgba(239, 191, 4, 0.025);
          transform: translateY(-5px);
        }

        .value-number {
          color: rgba(255, 255, 255, 0.27);
          font-size: 9px;
          letter-spacing: 0.2em;
        }

        .value-icon {
          display: flex;
          width: 44px;
          height: 44px;
          margin-top: 60px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(239, 191, 4, 0.28);
          border-radius: 50%;
          color: var(--about-gold);
          transition:
            transform 500ms ease,
            background 500ms ease;
        }

        .value-card:hover .value-icon {
          transform: rotate(90deg);
          background: rgba(239, 191, 4, 0.08);
        }

        .value-card h3 {
          margin: 28px 0 13px;
          font-family: "Cormorant Garamond", serif;
          font-size: 42px;
          font-weight: 400;
        }

        .value-card p {
          max-width: 250px;
          margin: 0;
          color: rgba(255, 255, 255, 0.36);
          font-size: 11px;
          line-height: 1.85;
        }

        .value-line {
          position: absolute;
          right: 38px;
          bottom: 35px;
          width: 38px;
          height: 1px;
          background: rgba(239, 191, 4, 0.55);
          transition: width 500ms ease;
        }

        .value-card:hover .value-line {
          width: 70px;
        }

        .about-manifesto {
          position: relative;
          min-height: 680px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background:
            radial-gradient(
              circle at 76% 50%,
              rgba(239, 191, 4, 0.07),
              transparent 27%
            ),
            #000;
        }

        .manifesto-frame {
          position: absolute;
          right: -100px;
          top: 50%;
          width: 620px;
          height: 620px;
          border: 1px solid rgba(239, 191, 4, 0.1);
          transform: translateY(-50%) rotate(18deg);
        }

        .manifesto-frame::after {
          content: "";
          position: absolute;
          inset: 45px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .manifesto-glow {
          position: absolute;
          right: 7%;
          top: 50%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(239, 191, 4, 0.045);
          filter: blur(80px);
          transform: translateY(-50%);
        }

        .manifesto-content {
          position: relative;
          z-index: 2;
        }

        .manifesto-content blockquote {
          max-width: 900px;
          margin: 35px 0 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(65px, 9vw, 130px);
          font-weight: 400;
          line-height: 0.8;
          letter-spacing: -0.05em;
        }

        .manifesto-content blockquote em {
          color: var(--about-gold);
          font-style: italic;
        }

        .manifesto-content > p {
          max-width: 480px;
          margin: 45px 0 0;
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          line-height: 1.95;
        }

        .process-header {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 70px;
          margin-bottom: 75px;
        }

        .process-header h2 {
          max-width: 900px;
        }

        .process-list {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .process-item {
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr) 28px;
          align-items: center;
          gap: 28px;
          min-height: 125px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: padding 450ms ease, background 450ms ease;
        }

        .process-item > span {
          color: var(--about-gold);
          font-size: 9px;
          letter-spacing: 0.2em;
        }

        .process-item h3 {
          margin: 0 0 7px;
          font-family: "Cormorant Garamond", serif;
          font-size: 34px;
          font-weight: 400;
        }

        .process-item p {
          margin: 0;
          color: rgba(255, 255, 255, 0.34);
          font-size: 10px;
        }

        .process-item > svg {
          color: rgba(239, 191, 4, 0.7);
          transition: transform 350ms ease;
        }

        .process-item:hover {
          padding: 0 20px;
          background: rgba(239, 191, 4, 0.018);
        }

        .process-item:hover > svg {
          transform: translateX(5px);
        }

        .about-cta {
          position: relative;
          min-height: 650px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          background: #000;
        }

        .about-cta-ring {
          position: absolute;
          width: 520px;
          height: 520px;
          border: 1px solid rgba(239, 191, 4, 0.1);
          border-radius: 50%;
          box-shadow: 0 0 90px rgba(239, 191, 4, 0.035);
          animation: aboutOrbit 13s ease-in-out infinite;
        }

        .about-cta-content {
          position: relative;
          z-index: 2;
        }

        .about-cta-content .about-eyebrow {
          justify-content: center;
        }

        .about-cta h2 {
          margin: 35px auto 0;
          max-width: 900px;
        }

        .gold-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 25px;
          margin-top: 43px;
          padding: 16px 21px 16px 25px;
          overflow: hidden;
          border: 1px solid rgba(239, 191, 4, 0.55);
          border-radius: 999px;
          color: #000 !important;
          background:
            linear-gradient(
              120deg,
              #d4af37 0%,
              #e0c05a 45%,
              #c9a227 100%
            );
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            transform 400ms ease,
            box-shadow 400ms ease;
        }

        .gold-button::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 65%
          );
          transform: translateX(-130%);
          transition: transform 800ms cubic-bezier(.16, 1, .3, 1);
        }

        .gold-button > * {
          position: relative;
          z-index: 1;
        }

        .gold-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 18px 50px rgba(239, 191, 4, 0.2),
            0 0 30px rgba(239, 191, 4, 0.08);
        }

        .gold-button:hover::before {
          transform: translateX(130%);
        }

        .gold-button:hover svg {
          transform: translateX(4px);
        }

        .gold-button svg {
          transition: transform 300ms ease;
        }

        .subtle-home-link {
          display: block;
          margin-top: 23px;
          color: rgba(255, 255, 255, 0.32) !important;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color 300ms ease;
        }

        .subtle-home-link:hover {
          color: var(--about-gold) !important;
        }

        .about-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: #000;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          gap: 80px;
          padding: 85px 0;
        }

        .footer-logo span {
          font-size: 28px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 140px);
          gap: 55px;
        }

        .footer-links div {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footer-links div > span {
          margin-bottom: 6px;
          color: var(--about-gold);
          font-size: 8px;
          letter-spacing: 0.2em;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.38);
          font-size: 10px;
          transition: color 250ms ease;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.2);
          font-size: 8px;
          letter-spacing: 0.1em;
        }

        @keyframes aboutOrbit {
          0%, 100% {
            transform: translate(0, -50%) rotate(0deg);
          }
          50% {
            transform: translate(-18px, calc(-50% + 14px)) rotate(4deg);
          }
        }

        @keyframes aboutOrbitReverse {
          0%, 100% {
            transform: translate(0) rotate(0deg);
          }
          50% {
            transform: translate(14px, -12px) rotate(-4deg);
          }
        }

        @keyframes aboutPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.78;
            transform: scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-orbit-one,
          .about-orbit-two,
          .about-hero-glow,
          .about-cta-ring {
            animation: none;
          }

          .about-page *,
          .about-page *::before,
          .about-page *::after {
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 900px) {
          .about-nav-links {
            gap: 18px;
          }

          .about-nav-links a:nth-child(n + 3) {
            display: none;
          }

          .intro-grid,
          .process-header {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .section-heading {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .value-grid {
            grid-template-columns: 1fr;
          }

          .value-card {
            min-height: 330px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .value-card:last-child {
            border-bottom: 0;
          }

          .footer-top {
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .about-container,
          .about-nav-inner,
          .about-hero-content {
            width: min(100% - 40px, 1400px);
          }

          .about-nav {
            height: 70px;
          }

          .about-logo span {
            font-size: 17px;
          }

          .about-logo small {
            display: none;
          }

          .about-nav-links {
            display: none;
          }

          .about-bag {
            padding: 9px 14px;
            font-size: 8px;
          }

          .about-hero-content {
            padding-top: 75px;
          }

          .back-home {
            margin-bottom: 55px;
          }

          .about-hero h1 {
            font-size: clamp(64px, 18vw, 100px);
          }

          .about-hero-content > p {
            max-width: 100%;
            margin-top: 38px;
            font-size: 12px;
          }

          .hero-scroll-note {
            right: auto;
            left: 0;
            bottom: -105px;
          }

          .about-intro,
          .about-values,
          .about-process {
            padding: 100px 0;
          }

          .intro-grid h2,
          .section-heading h2,
          .process-header h2,
          .about-cta h2 {
            font-size: clamp(54px, 15vw, 82px);
          }

          .section-heading {
            margin-bottom: 50px;
          }

          .value-card {
            padding: 30px 24px;
          }

          .value-icon {
            margin-top: 48px;
          }

          .about-manifesto {
            min-height: 560px;
          }

          .manifesto-frame {
            right: -250px;
            width: 500px;
            height: 500px;
          }

          .manifesto-content blockquote {
            font-size: clamp(60px, 17vw, 90px);
          }

          .process-item {
            grid-template-columns: 38px minmax(0, 1fr) 20px;
            gap: 15px;
            min-height: 112px;
          }

          .process-item h3 {
            font-size: 30px;
          }

          .process-item p {
            line-height: 1.5;
          }

          .about-cta {
            min-height: 560px;
          }

          .about-cta-ring {
            width: 390px;
            height: 390px;
          }

          .footer-top {
            padding: 65px 0;
          }

          .footer-links {
            grid-template-columns: 1fr 1fr;
            gap: 35px 25px;
          }

          .footer-links div:last-child {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            line-height: 1.7;
          }
        }
      ` }} />
    </main>
  );
}
