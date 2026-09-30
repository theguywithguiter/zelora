"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./faq.module.css";

type FAQ = {
  category: string;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    category: "CUSTOMIZATION",
    question: "Can I customize my jewellery with a name or text?",
    answer:
      "Yes. Many ZELORA pieces can be personalized with names, initials, dates, short messages or other available engraving options. The exact character limit and customization choices are shown on the individual product page.",
  },
  {
    category: "CUSTOMIZATION",
    question: "What can I personalize on a necklace?",
    answer:
      "Depending on the necklace, you may be able to personalize the pendant, name plate, engraving or other designated area. Please check the product page for the available personalization format, character limit and preview options.",
  },
  {
    category: "CUSTOMIZATION",
    question: "Can I add a special date or meaningful message?",
    answer:
      "Yes, where the selected product supports engraving or text personalization. Dates, initials and short meaningful messages are commonly suitable. We recommend checking the product's character limit before placing the order.",
  },
  {
    category: "CUSTOMIZATION",
    question: "Can I customize a bangle or bracelet?",
    answer:
      "Selected bangles and bracelets can be personalized with names, initials, dates or short text. Available customization depends on the specific design, so please review the customization options shown for the piece you choose.",
  },
  {
    category: "CUSTOMIZATION",
    question: "Can I personalize a ring?",
    answer:
      "Selected rings may support engraving or other personalization. The available area is usually limited, so the product page will specify the supported characters and personalization format.",
  },
  {
    category: "CUSTOMIZATION",
    question: "Can I order jewellery with multiple names?",
    answer:
      "This depends on the product. Some designs are suitable for multiple names or initials, while others have a limited personalization area. If the product supports it, the available character limit will be shown before checkout.",
  },
  {
    category: "ORDERING",
    question: "How do I place an order for customized jewellery?",
    answer:
      "Choose your piece, select the available variant, enter your personalization exactly as you want it produced, add the item to your bag and complete checkout. Please carefully review spelling, capitalization and dates before placing a personalized order.",
  },
  {
    category: "ORDERING",
    question: "Can I change my personalization after placing an order?",
    answer:
      "Please contact ZELORA as soon as possible if you notice an error. Personalized orders may move into preparation quickly, so changes cannot always be guaranteed once production or processing has started.",
  },
  {
    category: "ORDERING",
    question: "Can I order customized jewellery as a gift?",
    answer:
      "Absolutely. Personalized necklaces, rings, bangles and bracelets are designed to make meaningful gifts. You can enter the recipient's personalization during the ordering process and use the delivery address where you want the order sent.",
  },
  {
    category: "PRODUCTS",
    question: "What materials are ZELORA jewellery pieces made from?",
    answer:
      "Materials vary by product. Each product page should specify the material, finish or plating information applicable to that particular piece. Always refer to the individual product listing for the most accurate specifications.",
  },
  {
    category: "PRODUCTS",
    question: "Will the colour or finish look exactly like the photos?",
    answer:
      "We make every effort to represent our products accurately. However, lighting, photography, screen settings and the nature of individual finishes can cause slight differences between an image and the physical piece.",
  },
  {
    category: "PRODUCTS",
    question: "How do I choose the correct ring size?",
    answer:
      "Use the size information or size guide provided on the relevant product page. If you are between sizes, measure carefully before ordering because personalized or customized pieces may have additional restrictions on returns or exchanges.",
  },
  {
    category: "PRODUCTS",
    question: "How do I choose the right bangle or bracelet size?",
    answer:
      "Check the sizing information provided for the particular design. Measure your wrist using a flexible measuring tape or a strip of paper and compare the measurement with the product's size guide before ordering.",
  },
  {
    category: "CARE",
    question: "How should I care for my customized jewellery?",
    answer:
      "Keep your jewellery away from perfumes, sprays, harsh chemicals, prolonged moisture and unnecessary friction. When not wearing it, store the piece in a dry, clean place. Product-specific care instructions should always take priority.",
  },
  {
    category: "CARE",
    question: "Can I wear my jewellery while showering or swimming?",
    answer:
      "We recommend removing jewellery before showering, swimming, bathing or exercising unless the individual product is specifically described as water-resistant. Prolonged exposure to water, chlorine, salt and chemicals can affect finishes over time.",
  },
  {
    category: "SHIPPING",
    question: "How long does a customized jewellery order take?",
    answer:
      "Customized pieces may require additional processing time because they are prepared according to your selected personalization. The applicable processing and delivery estimates are provided during the ordering process or in our Shipping Policy.",
  },
  {
    category: "SHIPPING",
    question: "Can I track my ZELORA order?",
    answer:
      "Yes. Once tracking information is available, you can use the order-tracking option provided by ZELORA. Your tracking status may take some time to update after the shipment is handed to the carrier.",
  },
  {
    category: "RETURNS",
    question: "Can customized jewellery be returned or exchanged?",
    answer:
      "Personalized items may have different return or exchange conditions from standard products because they are made specifically for you. Please read ZELORA's Return & Refund Policy and the conditions shown on the product page before ordering.",
  },
  {
    category: "RETURNS",
    question: "What if my personalized jewellery arrives damaged or incorrect?",
    answer:
      "Contact ZELORA support as soon as possible with your order details and clear photographs of the issue. If the item is damaged, defective or does not match the confirmed order details, we will review the case according to our Return & Refund Policy.",
  },
  {
    category: "PAYMENTS",
    question: "What payment methods can I use?",
    answer:
      "Available payment methods are displayed during checkout. Depending on what is enabled for your order, this may include online payment options and Cash on Delivery. The checkout page will show the payment methods currently available to you.",
  },
  {
    category: "PAYMENTS",
    question: "Will I receive an order confirmation?",
    answer:
      "After successfully placing an order, you should receive an order confirmation through the contact details provided during checkout. For some orders, ZELORA may also contact you to confirm the order before processing it.",
  },
];

const categories = ["ALL", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const visibleFaqs =
    activeCategory === "ALL"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggle = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <main className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <span>ZELORA</span>
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <nav className={styles.navLinks} aria-label="Main navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/about-us">About Us</Link>
          </nav>

          <Link href="/" className={styles.homeLink}>
            ← Home
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`${styles.orbit} ${styles.orbitOne}`} />
        <div className={`${styles.orbit} ${styles.orbitTwo}`} />

        <div className={styles.heroInner}>
          <Link href="/" className={styles.backHome}>
            <span>←</span> Back to Home
          </Link>

          <div className={styles.eyebrow}>
            <span />
            ZELORA / FREQUENTLY ASKED QUESTIONS
          </div>

          <h1>
            Questions,
            <br />
            <em>answered.</em>
          </h1>

          <p>
            Everything you need to know about choosing, customizing, caring
            for and ordering your ZELORA piece.
          </p>

          <div className={styles.heroMeta}>
            <span>{faqs.length} QUESTIONS</span>
            <i />
            <span>JEWELLERY • PERSONALIZATION • CARE</span>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionTop}>
            <div>
              <span className={styles.sectionNumber}>01</span>
              <p>FIND YOUR ANSWER</p>
            </div>
            <span className={styles.questionCount}>
              {visibleFaqs.length} {visibleFaqs.length === 1 ? "QUESTION" : "QUESTIONS"}
            </span>
          </div>

          <div className={styles.categoryBar} aria-label="FAQ categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.categoryButton} ${
                  activeCategory === category ? styles.categoryActive : ""
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveIndex(null);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.faqList}>
            {visibleFaqs.map((faq, index) => {
              const isOpen = activeIndex === index;

              return (
                <article
                  className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}
                  key={`${faq.category}-${faq.question}`}
                >
                  <button
                    type="button"
                    className={styles.questionButton}
                    aria-expanded={isOpen}
                    onClick={() => toggle(index)}
                  >
                    <span className={styles.questionNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className={styles.questionText}>
                      <small>{faq.category}</small>
                      <strong>{faq.question}</strong>
                    </span>

                    <span className={styles.plus} aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </button>

                  <div
                    className={styles.answerWrap}
                    aria-hidden={!isOpen}
                  >
                    <div className={styles.answer}>
                      <span className={styles.answerRule} />
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaRing} />
        <div className={styles.ctaInner}>
          <span className={styles.eyebrow}>
            <span />
            STILL HAVE A QUESTION?
          </span>
          <h2>
            Let&apos;s talk about
            <br />
            <em>your story.</em>
          </h2>
          <p>
            If you could not find what you were looking for, our support team
            is here to help.
          </p>
          <Link href="/contact" className={styles.goldButton}>
            Contact ZELORA <span>→</span>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.footerLogo}>
            <span>ZELORA</span>
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <div className={styles.footerPolicies}>
            <Link href="/shipping-policy">Shipping</Link>
            <Link href="/return-refund-policy">Returns & Refunds</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/cancellation-policy">Cancellation</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} ZELORA. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED FOR EVERY STORY.</span>
        </div>
      </footer>
    </main>
  );
}
