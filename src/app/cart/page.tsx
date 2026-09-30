 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./CartPage.module.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  personalization?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function magneticMove(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 9;

  element.style.setProperty("--mag-x", `${x}px`);
  element.style.setProperty("--mag-y", `${y}px`);
}

function magneticLeave(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.style.setProperty("--mag-x", "0px");
  element.style.setProperty("--mag-y", "0px");
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem("zelora-cart") || "[]");

      const normalized = Array.isArray(raw)
        ? raw
            .map((item: any) => ({
              id: Number(item?.id ?? 0),
              name: String(item?.name ?? "ZELORA Piece"),
              price: Number(item?.price ?? 0),
              image:
                typeof item?.image === "string" && item.image
                  ? item.image
                  : FALLBACK_IMAGE,
              quantity: Math.max(1, Number(item?.quantity ?? 1)),
              personalization:
                typeof item?.personalization === "string"
                  ? item.personalization
                  : "",
            }))
            .filter((item: CartItem) => item.id && item.name)
        : [];

      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadCart();

    const handler = () => loadCart();
    window.addEventListener("zelora-cart-updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("zelora-cart-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("zelora-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("zelora-cart-updated"));
  }

  function changeQuantity(index: number, amount: number) {
    const next = [...items];
    const nextQuantity = Math.max(1, next[index].quantity + amount);
    next[index] = { ...next[index], quantity: nextQuantity };
    persist(next);
  }

  function removeItem(index: number) {
    setRemoving(index);
    window.setTimeout(() => {
      const next = items.filter((_, itemIndex) => itemIndex !== index);
      persist(next);
      setRemoving(null);
    }, 260);
  }

  function clearCart() {
    persist([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  async function validateCoupon(code: string, showMessage = true) {
    const normalized = code.trim().toUpperCase();

    if (!normalized) {
      setCouponApplied("");
      setDiscount(0);
      if (showMessage) setCouponMessage("Enter a coupon code.");
      return false;
    }

    if (subtotal <= 0) {
      setCouponApplied("");
      setDiscount(0);
      if (showMessage) setCouponMessage("Add a product before applying a coupon.");
      return false;
    }

    setCouponLoading(true);

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: normalized,
          subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setCouponApplied("");
        setDiscount(0);
        if (showMessage) {
          setCouponMessage(data?.message || "This coupon cannot be applied.");
        }
        return false;
      }

      setCouponApplied(data.coupon.code);
      setDiscount(Number(data.discount) || 0);
      if (showMessage) {
        setCouponMessage(data.message || "Coupon applied.");
      }
      return true;
    } catch (error) {
      console.error("Coupon validation error:", error);
      setCouponApplied("");
      setDiscount(0);
      if (showMessage) {
        setCouponMessage("Unable to validate this coupon right now.");
      }
      return false;
    } finally {
      setCouponLoading(false);
    }
  }

  async function applyCoupon() {
    await validateCoupon(coupon, true);
  }

  useEffect(() => {
    if (!loaded || subtotal <= 0 || !couponApplied) return;

    void validateCoupon(couponApplied, false);
  }, [subtotal]);

  if (!loaded) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingOrb} />
          <p>Preparing your ZELORA bag</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} />
      <div className={styles.grain} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            ZELORA
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/#story">Our Story</Link>
          </nav>

          <Link
            href="/shop"
            className={styles.backPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            Continue Shopping <span>→</span>
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroEyebrow}>YOUR ZELORA EDIT</div>
        <h1>Your Bag<span>.</span></h1>
        <p>
          Pieces chosen for your story, waiting to become part of it.
        </p>
      </section>

      {items.length === 0 ? (
        <section className={styles.empty}>
          <div className={styles.emptyMark}>Z</div>
          <p className={styles.eyebrow}>NOTHING HERE YET</p>
          <h2>Your story starts with a piece.</h2>
          <p className={styles.emptyText}>
            Discover personalized jewelry and accessories crafted to feel
            uniquely yours.
          </p>

          <Link
            href="/shop"
            className={styles.goldPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            Explore the Collection
            <ArrowIcon />
          </Link>
        </section>
      ) : (
        <section className={styles.cartLayout}>
          <div className={styles.itemsPanel}>
            <div className={styles.panelTop}>
              <div>
                <p className={styles.eyebrow}>YOUR SELECTION</p>
                <h2>{items.length} {items.length === 1 ? "piece" : "pieces"}</h2>
              </div>

              <button
                type="button"
                className={styles.textButton}
                onClick={clearCart}
              >
                Clear bag
              </button>
            </div>

            <div className={styles.items}>
              {items.map((item, index) => (
                <article
                  className={`${styles.item} ${
                    removing === index ? styles.removing : ""
                  }`}
                  key={`${item.id}-${index}`}
                >
                  <Link
                    href={`/shop/${item.id}`}
                    className={styles.itemImage}
                  >
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                    />
                    <span>VIEW</span>
                  </Link>

                  <div className={styles.itemContent}>
                    <div className={styles.itemMain}>
                      <div>
                        <p className={styles.itemCategory}>ZELORA / PERSONALIZED</p>
                        <h3>{item.name}</h3>

                        {item.personalization ? (
                          <p className={styles.personalization}>
                            <span>Personalization</span>
                            “{item.personalization}”
                          </p>
                        ) : (
                          <p className={styles.noPersonalization}>
                            Personalization not added
                          </p>
                        )}
                      </div>

                      <p className={styles.itemPrice}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className={styles.itemBottom}>
                      <div className={styles.quantity}>
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => changeQuantity(index, -1)}
                        >
                          <MinusIcon />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => changeQuantity(index, 1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(index)}
                      >
                        <TrashIcon />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.summary}>
            <div className={styles.summaryGlow} />

            <div className={styles.summaryInner}>
              <p className={styles.eyebrow}>ORDER SUMMARY</p>
              <h2>Complete your story.</h2>

              <div className={styles.lineItems}>
                <div>
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong className={styles.free}>FREE</strong>
                </div>

                {discount > 0 && (
                  <div>
                    <span>Discount</span>
                    <strong>-₹{discount.toLocaleString("en-IN")}</strong>
                  </div>
                )}
              </div>

              <div className={styles.coupon}>
                <label htmlFor="coupon">HAVE A CODE?</label>
                <div className={styles.couponRow}>
                  <input
                    id="coupon"
                    value={coupon}
                    onChange={(event) => {
                      setCoupon(event.target.value.toUpperCase());
                      setCouponApplied("");
                      setDiscount(0);
                      setCouponMessage("");
                    }}
                    placeholder="Enter coupon"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? "Checking..." : couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>

                {couponMessage && <p>{couponMessage}</p>}
              </div>

              <div className={styles.total}>
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <Link
                href="/checkout"
                className={styles.checkout}
                onClick={() => {
                  if (couponApplied) {
                    localStorage.setItem(
                      "zelora-applied-coupon",
                      couponApplied
                    );
                  } else {
                    localStorage.removeItem("zelora-applied-coupon");
                  }
                }}
                onMouseMove={magneticMove}
                onMouseLeave={magneticLeave}
              >
                <span>Proceed to Checkout</span>
                <ArrowIcon />
              </Link>

              <div className={styles.trust}>
                <div>
                  <span>✦</span>
                  <p><strong>CRAFTED</strong> With care</p>
                </div>
                <div>
                  <span>◇</span>
                  <p><strong>SECURE</strong> Checkout</p>
                </div>
                <div>
                  <span>○</span>
                  <p><strong>PREMIUM</strong> Packaging</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      )}

      <section className={styles.promise}>
        <div>
          <span>01</span>
          <h3>FREE SHIPPING</h3>
          <p>On every ZELORA order.</p>
        </div>
        <div>
          <span>02</span>
          <h3>MADE TO MEAN</h3>
          <p>Personalized for your story.</p>
        </div>
        <div>
          <span>03</span>
          <h3>PACKED WITH CARE</h3>
          <p>Premium presentation, always.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerLogo}>
          ZELORA
          <small>CRAFTED FOR EVERY STORY</small>
        </Link>
        <p>© 2026 ZELORA. Every piece tells a story.</p>
      </footer>
    </main>
  );
}
