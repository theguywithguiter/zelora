"use client";

import { useEffect, useRef } from "react";

const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The search page has a large capsule search UI and must not
    // render the global cursor-glow over it.
    if (window.location.pathname === "/search") {
      el.style.display = "none";
      return;
    }

    if (isTouch()) {
      el.style.display = "none";
      return;
    }

    el.style.display = "";

    let raf = 0;
    let x = -400;
    let y = -400;
    let tx = -400;
    let ty = -400;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.11;
      y += (ty - y) * 0.11;
      el.style.transform = `translate3d(${x - 175}px, ${y - 175}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="zelora-cursor-glow" aria-hidden="true" />;
}

export function MagneticElements() {
  useEffect(() => {
    if (isTouch()) return;

    const selector = [
      ".gold-pill",
      ".outline-pill",
      ".newsletter-form button",
      /* Banner arrows intentionally excluded from magnetic motion. */
      ".icon-btn",
      ".cart-btn",
      ".wishlist",
      /* Quick View buttons intentionally excluded from magnetic motion. */
      ".socials a",
      ".dot",
      "[data-magnetic]",
    ].join(",");

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const cleanups: Array<() => void> = [];

    elements.forEach((el) => {
      if (el.dataset.zeloraMagnetic === "1") return;
      el.dataset.zeloraMagnetic = "1";

      const strength = el.matches(".gold-pill, .outline-pill") ? 0.18 : 0.12;
      let raf = 0;
      let x = 0;
      let y = 0;
      let tx = 0;
      let ty = 0;

      const loop = () => {
        x += (tx - x) * 0.2;
        y += (ty - y) * 0.2;
        el.style.setProperty("--mag-x", `${x}px`);
        el.style.setProperty("--mag-y", `${y}px`);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        if (Math.abs(tx - x) > 0.03 || Math.abs(ty - y) > 0.03) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = 0;
        }
      };

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      };

      const leave = () => {
        tx = 0;
        ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = "";
        delete el.dataset.zeloraMagnetic;
      });
    });

    return () => cleanups.forEach((fn) => fn());
  });

  return null;
}

export function ZyraCardMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch() || reduce) return;

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".product-card, .category-card, .collection-card, .testimonial, .step"
      )
    );

    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      if (card.dataset.zeloraMotion === "1") return;
      card.dataset.zeloraMotion = "1";
      card.style.willChange = "transform";
      card.style.transformStyle = "preserve-3d";

      const image = card.querySelector<HTMLElement>("img");
      let raf = 0;
      let rx = 0;
      let ry = 0;
      let tx = 0;
      let ty = 0;

      const loop = () => {
        rx += (tx - rx) * 0.12;
        ry += (ty - ry) * 0.12;
        card.style.transform = `perspective(1200px) translate3d(0,0,0) rotateX(${rx}deg) rotateY(${ry}deg)`;
        if (Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = 0;
        }
      };

      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry = ry;
        tx = -py * 3.5;
        ty = px * 4.5;
        if (image) {
          image.style.transform = `scale(1.075) translate3d(${px * 7}px, ${py * 7}px, 0)`;
        }
        if (!raf) raf = requestAnimationFrame(loop);
      };

      const enter = () => {
        card.classList.add("zelora-card-active");
      };

      const leave = () => {
        tx = 0;
        ty = 0;
        if (image) image.style.transform = "";
        if (!raf) raf = requestAnimationFrame(loop);
        card.classList.remove("zelora-card-active");
      };

      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
        if (image) image.style.transform = "";
        delete card.dataset.zeloraMotion;
      });
    });

    return () => cleanups.forEach((fn) => fn());
  });

  return null;
}

export function ZyraScrollMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.querySelector<HTMLElement>(".navbar");
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".section, .story-section, .newsletter, .footer, .section-heading, .category-card, .collection-card, .product-card, .testimonial, .step"
      )
    );

    const updateNav = () => {
      if (!nav) return;
      nav.classList.toggle("zelora-nav-scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();

    if (reduce) return () => window.removeEventListener("scroll", updateNav);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("zelora-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el, index) => {
      if (el.classList.contains("hero")) return;
      el.classList.add("zelora-reveal", "zelora-reveal-up");
      el.style.transitionDelay = `${Math.min((index % 5) * 70, 280)}ms`;
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", updateNav);
      observer.disconnect();
    };
  });

  return null;
}
