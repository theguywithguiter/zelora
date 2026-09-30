"use client";

import { useEffect, useState } from "react";

const CONTACTS = [
  {
    number: "01",
    label: "TECHNICAL / QUERIES",
    title: "Technical support",
    email: "help@shopzelora.in",
    description:
      "Website issues, account problems, order queries, or anything technical.",
  },
  {
    number: "02",
    label: "RETURNS / REPLACEMENTS",
    title: "Returns & replacements",
    email: "returns@shopzelora.in",
    description:
      "Get help with replacement requests, returns, and post-purchase assistance.",
  },
  {
    number: "03",
    label: "WEBSITE DEVELOPER",
    title: "Connect with the developer",
    email: "developer@shopzelora.in",
    description:
      "Website feedback, technical collaboration, or matters for our developer.",
  },
  {
    number: "04",
    label: "CEO — DIRECT",
    title: "Connect with the CEO",
    email: "ceo@shopzelora.in",
    description:
      "For matters that require direct attention from the leadership of ZELORA.",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.2" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 8.7c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.4 4.4 0 0 1 8 4.4c1.5 0 3 .7 4 2 1-1.3 2.5-2 4-2a4.4 4.4 0 0 1 4.5 4.3Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.1" />
      <path d="M5.5 20c.7-3.6 3-5.4 6.5-5.4s5.8 1.8 6.5 5.4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8.5h14l-1 11H6l-1-11Z" />
      <path d="M9 8.5V6.7a3 3 0 0 1 6 0v1.8" />
    </svg>
  );
}

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="zelora-contact">
      <a href="/" className="zc-back-home">
        <span>BACK TO HOME</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </a>

      <section className="zc-hero">
        <div className="zc-hero-glow" />
        <div className="zc-hero-ring zc-ring-one" />
        <div className="zc-hero-ring zc-ring-two" />

        <div className="zc-hero-content">
          <div className="zc-kicker"><span /> ZELORA / CONTACT</div>

          <h1>
            We&apos;re here
            <br />
            <i>to listen.</i>
          </h1>

          <p>
            Whether you need help with an order, have a question,
            <br className="zc-desktop" />
            or simply want to reach someone at ZELORA — choose your line.
          </p>

          <div className="zc-hero-actions">
            <a
              href="https://wa.me/919907375437"
              target="_blank"
              rel="noreferrer"
              className="zc-pill zc-pill-gold"
            >
              <span>CHAT ON WHATSAPP</span>
              <Arrow />
            </a>
            <a href="#contact-lines" className="zc-pill zc-pill-ghost">
              <span>VIEW CONTACTS</span>
              <Arrow />
            </a>
          </div>
        </div>

        <div className="zc-hero-meta">
          <span>PERSONALIZED JEWELRY &amp; ACCESSORIES</span>
          <span className="zc-meta-line"><i /></span>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      <section className="zc-lines" id="contact-lines">
        <div className="zc-lines-head">
          <div>
            <span className="zc-section-label">CONTACT LINES</span>
            <h2>
              Choose your
              <br />
              <i>conversation.</i>
            </h2>
          </div>
          <p>
            No forms. No unnecessary steps. Pick the team you need and open
            your email directly.
          </p>
        </div>

        <div className="zc-contact-list">
          {CONTACTS.map((contact) => (
            <a
              className="zc-contact-row"
              href={`mailto:${contact.email}`}
              key={contact.email}
            >
              <span className="zc-row-number">{contact.number}</span>

              <div className="zc-row-title">
                <span>{contact.label}</span>
                <h3>{contact.title}</h3>
              </div>

              <div className="zc-row-description">{contact.description}</div>

              <div className="zc-row-action">
                <strong>{contact.email}</strong>
                <span className="zc-round-arrow"><ExternalArrow /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="zc-whatsapp">
        <div className="zc-wa-mark">WHATSAPP</div>
        <div className="zc-wa-main">
          <div>
            <span className="zc-section-label">FASTEST WAY TO REACH US</span>
            <h2>
              Prefer a
              <br />
              <i>conversation?</i>
            </h2>
          </div>

          <div className="zc-wa-right">
            <p>
              Start a direct WhatsApp chat with our team. It&apos;s the quickest
              way to ask a question or get help.
            </p>
            <a
              href="https://wa.me/919907375437"
              target="_blank"
              rel="noreferrer"
              className="zc-pill zc-pill-outline"
            >
              <span>+91 9907374537</span>
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="zc-footer">
        <div className="zc-footer-top">
          <div className="zc-footer-brand">
            <a href="/" className="zc-footer-logo">ZELORA</a>
            <p>CRAFTED FOR EVERY STORY</p>
          </div>

          <div className="zc-footer-column">
            <span>SHOP</span>
            <a href="/shop">All Products</a>
            <a href="/shop">Categories</a>
            <a href="/wishlist">Wishlist</a>
          </div>

          <div className="zc-footer-column">
            <span>HELP</span>
            <a href="/track-order">Track Order</a>
            <a href="/returns">Returns &amp; Replacements</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="zc-footer-column">
            <span>DIRECT</span>
            <a href="mailto:help@shopzelora.in">Technical</a>
            <a href="mailto:developer@shopzelora.in">Developer</a>
            <a href="mailto:ceo@shopzelora.in">CEO</a>
          </div>
        </div>

        <div className="zc-footer-bottom">
          <span>© 2026 ZELORA. ALL RIGHTS RESERVED.</span>
          <span>MADE WITH INTENTION.</span>
        </div>
      </footer>

      <style>{`
        .zelora-contact {
          --gold: #ecac16ff;
          --gold-light: #ffbc03ff;
          --cream: #e7e1d6ff;
          --muted: rgba(243,238,229,.48);
          --line: rgba(243,238,229,.105);
          min-height: 100vh;
          overflow-x: hidden;
          background: #050505;
          color: var(--cream);
          font-family: "Manrope", sans-serif;
        }

        .zelora-contact *,
        .zelora-contact *::before,
        .zelora-contact *::after { box-sizing: border-box; }

        .zelora-contact a { color: inherit; text-decoration: none; }

        .zc-announcement {
          position: fixed;
          z-index: 120;
          top: 0;
          left: 0;
          right: 0;
          height: 33px;
          display: flex;
          align-items: center;
          padding: 0 4.5vw;
          border-bottom: 1px solid rgba(255,255,255,.055);
          background: rgba(5,5,5,.92);
          backdrop-filter: blur(18px);
          color: rgba(243,238,229,.37);
          font-size: 8px;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .zc-announcement-brand { margin-right: 15px; color: var(--gold); font-size: 15px; }
        .zc-announcement-links { margin-left: auto; display: flex; gap: 25px; }
        .zc-announcement a { transition: color .25s ease; }
        .zc-announcement a:hover { color: var(--gold-light); }

        .zc-nav {
          position: fixed;
          z-index: 110;
          top: 33px;
          left: 0;
          right: 0;
          height: 83px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4.5vw;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(5,5,5,.15);
          transition: background .45s ease, border-color .45s ease, backdrop-filter .45s ease;
        }

        .zc-nav-scrolled {
          background: rgba(5,5,5,.86);
          border-color: rgba(214,178,95,.15);
          backdrop-filter: blur(22px);
        }

        .zc-nav-left, .zc-nav-right { display: flex; align-items: center; }
        .zc-nav-left { gap: 30px; }

        .zc-nav-left a {
          position: relative;
          color: rgba(243,238,229,.58);
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          transition: color .25s ease;
        }

        .zc-nav-left a:hover, .zc-nav-left .zc-nav-active { color: var(--cream); }
        .zc-nav-left a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -9px;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width .35s cubic-bezier(.16,1,.3,1);
        }
        .zc-nav-left a:hover::after, .zc-nav-left .zc-nav-active::after { width: 100%; }
        .zc-nav-left small { color: var(--gold); font-size: 9px; }

        .zc-logo {
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%,-50%);
        }
        .zc-logo strong {
          color: var(--gold);
          font-family: "Cormorant Garamond", serif;
          font-size: 31px;
          font-weight: 600;
          letter-spacing: .18em;
        }
        .zc-logo span {
          margin-top: -3px;
          color: rgba(243,238,229,.28);
          font-size: 6px;
          letter-spacing: .3em;
        }

        .zc-nav-right { gap: 7px; }
        .zc-icon {
          position: relative;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 50%;
          color: rgba(243,238,229,.75);
          transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .25s ease, background .25s ease, color .25s ease;
        }
        .zc-icon:hover {
          transform: translateY(-2px);
          border-color: rgba(214,178,95,.55);
          background: rgba(214,178,95,.08);
          color: var(--gold-light);
        }
        .zc-icon svg, .zc-pill svg, .zc-round-arrow svg, .zc-mobile-panel svg {
          width: 16px;
          height: 16px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.45;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .zc-bag b {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--gold);
          color: #050505;
          font-size: 7px;
        }

        .zc-menu-toggle, .zc-mobile-panel { display: none; }

        .zc-back-home {
          position: fixed;
          z-index: 120;
          top: 28px;
          right: 4.5vw;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 18px 0 21px;
          border: 1px solid rgba(214,178,95,.38);
          border-radius: 999px;
          background: rgba(5,5,5,.62);
          backdrop-filter: blur(16px);
          color: rgba(243,238,229,.78);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          transition: transform .4s cubic-bezier(.16,1,.3,1), background .3s ease, border-color .3s ease, color .3s ease;
        }
        .zc-back-home:hover {
          transform: translateY(-2px);
          border-color: rgba(214,178,95,.72);
          background: rgba(214,178,95,.08);
          color: var(--gold-light);
        }
        .zc-back-home svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform .3s ease;
        }
        .zc-back-home:hover svg { transform: translateX(-3px); }

        .zc-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 145px 4.5vw 95px;
          background:
            radial-gradient(circle at 76% 48%, rgba(214,178,95,.1), transparent 25%),
            radial-gradient(circle at 25% 72%, rgba(255,255,255,.035), transparent 30%),
            #050505;
        }

        .zc-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(5,5,5,.98) 0%, rgba(5,5,5,.75) 42%, rgba(5,5,5,.35) 100%);
        }

        .zc-hero-glow {
          position: absolute;
          right: 6%;
          top: 23%;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: rgba(214,178,95,.045);
          filter: blur(85px);
          animation: zcGlow 8s ease-in-out infinite;
        }

        .zc-hero-ring {
          position: absolute;
          right: -9%;
          top: 8%;
          border: 1px solid rgba(214,178,95,.105);
          border-radius: 50%;
          animation: zcFloat 12s ease-in-out infinite;
        }
        .zc-ring-one { width: 720px; height: 720px; }
        .zc-ring-two { width: 500px; height: 500px; right: 2%; top: 22%; animation-delay: -4s; opacity: .55; }

        .zc-hero-content {
          position: relative;
          z-index: 2;
          width: min(1250px, 100%);
          margin: 0 auto;
        }

        .zc-kicker, .zc-section-label {
          color: rgba(214,178,95,.82);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .3em;
          text-transform: uppercase;
        }
        .zc-kicker { display: flex; align-items: center; gap: 12px; animation: zcUp .9s .05s both; }
        .zc-kicker span { width: 34px; height: 1px; background: var(--gold); }

        .zc-hero h1 {
          margin: 31px 0 0;
          max-width: 900px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(76px, 10.5vw, 154px);
          font-weight: 400;
          line-height: .78;
          letter-spacing: -.055em;
          animation: zcUp 1s .15s both;
        }
        .zc-hero h1 i { color: var(--gold); font-style: italic; }
        .zc-hero-content > p {
          margin: 39px 0 0;
          color: rgba(243,238,229,.44);
          font-size: 12px;
          line-height: 1.9;
          letter-spacing: .02em;
          animation: zcUp 1s .3s both;
        }

        .zc-hero-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
          animation: zcUp 1s .43s both;
        }

        .zc-pill {
          min-height: 49px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 0 21px 0 24px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .4s ease, background .3s ease, border-color .3s ease, color .3s ease;
        }

        .zc-pill:hover { transform: translateY(-3px); }
        .zc-pill-gold {
          background: linear-gradient(110deg, #eaae21ff, #d69423ff);
          color: #000000;
          box-shadow: 0 12px 35px rgba(214,178,95,.12);
        }
        .zc-pill-gold:hover { box-shadow: 0 18px 50px rgba(214,178,95,.23); }
        .zc-pill-ghost, .zc-pill-outline {
          border: 1px solid rgba(214,178,95,.34);
          background: rgba(214,178,95,.025);
          color: rgba(240, 236, 226, 0.72);
        }
        .zc-pill-ghost:hover, .zc-pill-outline:hover {
          border-color: rgba(214,178,95,.7);
          background: rgba(214,178,95,.075);
          color: var(--gold-light);
        }
        .zc-pill svg { transition: transform .3s ease; }
        .zc-pill:hover svg { transform: translateX(4px); }

        .zc-hero-meta {
          position: absolute;
          z-index: 2;
          left: 4.5vw;
          right: 4.5vw;
          bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(243,238,229,.22);
          font-size: 8px;
          letter-spacing: .2em;
        }
        .zc-meta-line { width: 80px; height: 1px; overflow: hidden; background: rgba(255,255,255,.1); }
        .zc-meta-line i { display: block; width: 30%; height: 100%; background: var(--gold); animation: zcSlide 2.1s ease-in-out infinite; }

        .zc-lines {
          position: relative;
          padding: 135px 4.5vw 125px;
          background: #060606;
        }
        .zc-lines-head {
          width: min(1250px, 100%);
          margin: 0 auto 65px;
          display: grid;
          grid-template-columns: 1.5fr .7fr;
          gap: 80px;
          align-items: end;
        }
        .zc-lines-head h2, .zc-whatsapp h2 {
          margin: 23px 0 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(57px, 7vw, 100px);
          font-weight: 400;
          line-height: .82;
          letter-spacing: -.05em;
        }
        .zc-lines-head h2 i, .zc-whatsapp h2 i { color: rgba(243,238,229,.28); font-style: italic; }
        .zc-lines-head > p {
          max-width: 320px;
          margin: 0;
          color: rgba(243,238,229,.38);
          font-size: 11px;
          line-height: 1.9;
        }

        .zc-contact-list {
          width: min(1250px, 100%);
          margin: 0 auto;
          border-top: 1px solid var(--line);
        }

        .zc-contact-row {
          position: relative;
          min-height: 142px;
          display: grid;
          grid-template-columns: 70px 1.05fr .8fr 1.1fr;
          align-items: center;
          gap: 30px;
          border-bottom: 1px solid var(--line);
          transition: padding .55s cubic-bezier(.16,1,.3,1), background .4s ease;
        }
        .zc-contact-row::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--gold);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform .45s cubic-bezier(.16,1,.3,1);
        }
        .zc-contact-row:hover {
          padding-left: 20px;
          background: linear-gradient(90deg, rgba(214,178,95,.055), transparent 65%);
        }
        .zc-contact-row:hover::before { transform: scaleY(1); }

        .zc-row-number {
          color: rgba(243,238,229,.23);
          font-size: 9px;
          letter-spacing: .18em;
        }
        .zc-row-title > span {
          display: block;
          margin-bottom: 10px;
          color: rgba(214,178,95,.68);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .18em;
        }
        .zc-row-title h3 {
          margin: 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(27px, 3vw, 40px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -.02em;
          transition: color .3s ease;
        }
        .zc-contact-row:hover .zc-row-title h3 { color: var(--gold-light); }

        .zc-row-description {
          color: rgba(243,238,229,.36);
          font-size: 10px;
          line-height: 1.75;
        }

        .zc-row-action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
        }
        .zc-row-action strong {
          color: var(--cream);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .01em;
          white-space: nowrap;
        }
        .zc-round-arrow {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(214,178,95,.4);
          border-radius: 50%;
          color: var(--gold);
          transition: transform .45s cubic-bezier(.16,1,.3,1), background .3s ease, color .3s ease;
        }
        .zc-contact-row:hover .zc-round-arrow {
          transform: translate(4px,-3px);
          background: var(--gold);
          color: #050505;
        }

        .zc-whatsapp {
          position: relative;
          overflow: hidden;
          padding: 110px 4.5vw;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 80% 50%, rgba(214,178,95,.09), transparent 28%),
            #030303;
        }
        .zc-wa-mark {
          position: absolute;
          right: -25px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(214,178,95,.025);
          font-size: clamp(80px, 17vw, 250px);
          font-weight: 700;
          letter-spacing: -.07em;
          pointer-events: none;
          user-select: none;
        }
        .zc-wa-main {
          position: relative;
          z-index: 1;
          width: min(1250px, 100%);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 60px;
        }
        .zc-wa-right { width: min(390px, 100%); }
        .zc-wa-right p {
          margin: 0 0 25px;
          color: rgba(243,238,229,.38);
          font-size: 11px;
          line-height: 1.9;
        }

        .zc-footer {
          padding: 0 4.5vw;
          background: #030303;
        }
        .zc-footer-top {
          width: min(1250px, 100%);
          margin: 0 auto;
          padding: 78px 0;
          display: grid;
          grid-template-columns: 1.7fr 1fr 1fr 1fr;
          gap: 50px;
        }
        .zc-footer-logo {
          font-family: "Cormorant Garamond", serif;
          font-size: 31px;
          letter-spacing: .16em;
        }
        .zc-footer-brand p {
          margin: 7px 0 0;
          color: rgba(214,178,95,.6);
          font-family: "Cormorant Garamond", serif;
          font-size: 16px;
          font-style: italic;
        }
        .zc-footer-column {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .zc-footer-column > span {
          margin-bottom: 7px;
          color: var(--gold);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .2em;
        }
        .zc-footer-column a {
          width: fit-content;
          color: rgba(243,238,229,.38);
          font-size: 10px;
          transition: color .25s ease, transform .3s ease;
        }
        .zc-footer-column a:hover { color: var(--cream); transform: translateX(3px); }

        .zc-footer-bottom {
          width: min(1250px, 100%);
          margin: 0 auto;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--line);
          color: rgba(243,238,229,.2);
          font-size: 8px;
          letter-spacing: .1em;
        }

        @keyframes zcUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zcGlow {
          0%,100% { opacity: .4; transform: scale(1); }
          50% { opacity: .8; transform: scale(1.08); }
        }
        @keyframes zcFloat {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-24px,20px); }
        }
        @keyframes zcSlide {
          0% { transform: translateX(-35px); }
          50% { transform: translateX(35px); }
          100% { transform: translateX(-35px); }
        }

        @media (max-width: 900px) {
          .zc-back-home {
            top: 20px;
            right: 20px;
          }

          .zc-nav-left { display: none; }
          .zc-menu-toggle {
            width: 38px;
            height: 38px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 0;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 50%;
            background: transparent;
            color: var(--cream);
          }
          .zc-menu-toggle span { width: 13px; height: 1px; background: currentColor; transition: transform .3s ease, opacity .2s ease; }
          .zc-menu-toggle.is-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
          .zc-menu-toggle.is-open span:nth-child(2) { opacity: 0; }
          .zc-menu-toggle.is-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

          .zc-mobile-panel {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            padding: 10px 20px 20px;
            background: rgba(5,5,5,.97);
            border-bottom: 1px solid rgba(214,178,95,.15);
            backdrop-filter: blur(22px);
            opacity: 0;
            pointer-events: none;
            transform: translateY(-10px);
            transition: opacity .3s ease, transform .4s cubic-bezier(.16,1,.3,1);
          }
          .zc-mobile-panel.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
          .zc-mobile-panel a {
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,.07);
            color: rgba(243,238,229,.65);
            font-size: 9px;
            letter-spacing: .18em;
          }

          .zc-lines-head { grid-template-columns: 1fr; gap: 28px; }
          .zc-contact-row { grid-template-columns: 55px 1fr 1fr; }
          .zc-row-description { display: none; }
          .zc-row-action { justify-content: flex-end; }
          .zc-footer-top { grid-template-columns: 1.4fr 1fr 1fr; }
          .zc-footer-brand { grid-column: 1 / -1; }
        }

        @media (max-width: 560px) {
          .zc-announcement { padding: 0 16px; }
          .zc-announcement-copy { display: none; }
          .zc-announcement-links { gap: 14px; font-size: 7px; }

          .zc-nav { top: 33px; height: 70px; padding: 0 16px; }
          .zc-logo strong { font-size: 23px; }
          .zc-logo span { display: none; }
          .zc-nav-right { gap: 4px; }
          .zc-icon { width: 35px; height: 35px; }
          .zc-icon:nth-child(2) { display: none; }

          .zc-hero { min-height: 720px; padding: 125px 20px 80px; }
          .zc-hero-content { width: 100%; }
          .zc-hero h1 { font-size: 68px; }
          .zc-desktop { display: none; }
          .zc-hero-content > p { max-width: 340px; font-size: 11px; }
          .zc-hero-actions { flex-direction: column; align-items: stretch; max-width: 340px; }
          .zc-pill { width: 100%; }
          .zc-hero-meta { left: 20px; right: 20px; }
          .zc-hero-meta > span:first-child { display: none; }

          .zc-lines { padding: 90px 20px; }
          .zc-lines-head { margin-bottom: 45px; }
          .zc-lines-head h2, .zc-whatsapp h2 { font-size: 58px; }
          .zc-contact-row {
            min-height: 0;
            padding: 25px 0;
            grid-template-columns: 34px 1fr;
            gap: 15px;
          }
          .zc-contact-row:hover { padding-left: 12px; }
          .zc-row-title h3 { font-size: 31px; }
          .zc-row-action {
            grid-column: 2;
            justify-content: flex-start;
            padding-top: 12px;
          }
          .zc-row-action strong { font-size: 11px; }
          .zc-round-arrow { width: 35px; height: 35px; flex-basis: 35px; }

          .zc-whatsapp { padding: 85px 20px; }
          .zc-wa-main { flex-direction: column; align-items: flex-start; gap: 35px; }
          .zc-wa-right { width: 100%; }

          .zc-footer { padding: 0 20px; }
          .zc-footer-top { grid-template-columns: 1fr 1fr; gap: 35px 20px; padding: 60px 0; }
          .zc-footer-brand { grid-column: 1 / -1; }
          .zc-footer-bottom { flex-direction: column; gap: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .zelora-contact *, .zelora-contact *::before, .zelora-contact *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
