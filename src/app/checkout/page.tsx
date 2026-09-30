 "use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./CheckoutPage.module.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  personalization?: string;
  personalizationData?: string;
  personalizationImageUrl?: string;
};

type PaymentSettings = {
  cod: boolean;
  upi: boolean;
  card: boolean;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=90";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function magneticMove(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
  element.style.setProperty("--mag-x", `${x}px`);
  element.style.setProperty("--mag-y", `${y}px`);
}

function magneticLeave(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.style.setProperty("--mag-x", "0px");
  element.style.setProperty("--mag-y", "0px");
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [payment, setPayment] = useState("cod");
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    cod: true,
    upi: true,
    card: true,
  });
  const [coupon, setCoupon] = useState("");
const [couponApplied, setCouponApplied] = useState(false);
const [couponData, setCouponData] = useState<{ type: string; value: number } | null>(null);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [placedTotal, setPlacedTotal] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
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
              personalizationData:
                typeof item?.personalizationData === "string"
                  ? item.personalizationData
                  : "",
              personalizationImageUrl:
                typeof item?.personalizationImageUrl === "string"
                  ? item.personalizationImageUrl
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
  }, []);

  useEffect(() => {
    fetch("/api/admin/payment-settings", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!data?.success || !data?.settings) return;

        const settings: PaymentSettings = {
          cod: data.settings.cod === true,
          upi: data.settings.upi === true,
          card: data.settings.card === true,
        };

        setPaymentSettings(settings);

        setPayment((current) => {
          if (settings[current as keyof PaymentSettings]) {
            return current;
          }

          if (settings.cod) return "cod";
          if (settings.upi) return "upi";
          if (settings.card) return "card";

          return current;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      if (params.get("upi") !== "completed") return;

      const raw = sessionStorage.getItem("zelora-upi-completed");
      if (!raw) return;

      const completed = JSON.parse(raw);

      setOrderNumber(String(completed.orderNumber || completed.orderId || ""));
      setPlacedTotal(Number(completed.amount || 0));
      setSuccess(true);
      sessionStorage.removeItem("zelora-upi-completed");
    } catch {
      // Best-effort recovery of the UPI completion state.
    }
  }, []);

  useEffect(() => {
    fetch("/api/accounts/addresses")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.success) {
          setSavedAddresses(data.addresses || []);
          const preferred = data.addresses?.find((a: any) => a.isDefault) ?? data.addresses?.[0];
          if (preferred) {
            setSelectedAddressId(String(preferred.id));
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedAddress = savedAddresses.find(
    (address) => String(address.id) === selectedAddressId
  );

  function applySavedAddress(id: string) {
    setSelectedAddressId(id);
    const address = savedAddresses.find((item) => String(item.id) === id);
    if (!address) return;

    const form = document.querySelector("form");
    if (!form) return;

    const values: Record<string, string> = {
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    Object.entries(values).forEach(([name, value]) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (input) input.value = value;
    });
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const couponDiscount = couponApplied && couponData
  ? (() => {
      const type = couponData.type.toLowerCase();
      const value = Number(couponData.value);

      if (!Number.isFinite(value) || value <= 0) return 0;

      if (
        type === "percentage" ||
        type === "percent" ||
        type === "%"
      ) {
        return Math.min(subtotal, (subtotal * value) / 100);
      }

      return Math.min(subtotal, value);
    })()
  : 0;

const upiDiscount = payment === "upi" ? subtotal * 0.1 : 0;
  const discount = couponDiscount + upiDiscount;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function selectPaymentMethod(method: string) {
    setPayment(method);

    setError("");
  }

  async function applyCoupon() {
  const value = coupon.trim().toUpperCase();

  if (!value) {
    setCouponApplied(false);
    setCouponData(null);
    setError("Enter a coupon code.");
    return;
  }

  try {
    const response = await fetch("/api/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: value,
        subtotal,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      setCouponApplied(false);
      setCouponData(null);
      setError(data?.message || "Unable to validate coupon.");
      return;
    }

    setCoupon(value);
    setCouponData({
      type: String(data.coupon?.type || ""),
      value: Number(data.coupon?.value || 0),
    });
    setCouponApplied(true);
    setError("");
  } catch {
    setCouponApplied(false);
    setCouponData(null);
    setError("Unable to validate coupon.");
  }
}

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your bag is empty. Add a ZELORA piece before checkout.");
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setPlacing(true);

    const formData = new FormData(form);

    const payload = {
      customer: {
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
      },
      shipping: {
        address: String(formData.get("address") || ""),
        apartment: String(formData.get("apartment") || ""),
        city: String(formData.get("city") || ""),
        state: String(formData.get("state") || ""),
        pincode: String(formData.get("pincode") || ""),
      },
      paymentMethod: payment,
      couponCode: couponApplied
  ? coupon.trim().toUpperCase()
  : coupon.trim(),
      saveAddress,
      savedAddressId: selectedAddress?.id ?? null,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        personalization: item.personalization || "",
        personalizationData: item.personalizationData || "",
        personalizationImageUrl: item.personalizationImageUrl || "",
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to place your order.");
      }

      const finalOrderTotal = Number(data.order.total || total);

      localStorage.removeItem("zelora-cart");
      localStorage.removeItem("zelora-checkout-draft");

      if (payment === "upi") {
        sessionStorage.setItem(
          "zelora-upi-payment",
          JSON.stringify({
            orderId: String(data.order.orderId),
            orderNumber: String(data.order.orderNumber || ""),
            amount: finalOrderTotal,
            createdAt: Date.now(),
          })
        );

        window.location.href = `/checkout/payment?orderId=${encodeURIComponent(
          String(data.order.orderId)
        )}&amount=${encodeURIComponent(finalOrderTotal)}&orderNumber=${encodeURIComponent(
          String(data.order.orderNumber || "")
        )}`;
        return;
      }

      setOrderNumber(data.order.orderNumber);
      setPlacedTotal(finalOrderTotal);
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  }

  if (!loaded) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.loadingOrb} />
          <p>Preparing secure checkout</p>
        </div>
      </main>
    );
  }

  if (!items.length && !success) {
    return (
      <main className={styles.page}>
        <div className={styles.ambient} />
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
              href="/"
              className={styles.headerPill}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
            >
              <span className={styles.desktopOnly}>Back to bag</span>
              <span className={styles.mobileOnly}>Back to home</span>
              <span aria-hidden="true"></span>
            </Link>
          </div>
        </header>

        <section className={styles.empty}>
          <div className={styles.emptyMark} aria-hidden="true">
            <img src="/zelora-z-logo.png" alt="" />
          </div>
          <span>YOUR BAG IS EMPTY</span>
          <h1>Nothing to checkout yet.</h1>
          <p>
            Choose a piece from the ZELORA collection and come back when your
            story is ready.
          </p>
          <Link
            href="/shop"
            className={styles.goldPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            Explore the collection <ArrowIcon />
          </Link>
        </section>
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

          <div className={styles.checkoutProgress}>
            <span className={styles.progressActive}>BAG</span>
            <i />
            <span className={styles.progressActive}>CHECKOUT</span>
            <i />
            <span>COMPLETE</span>
          </div>

          <Link
            href="/cart"
            className={styles.headerPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            <span className={styles.desktopOnly}>Back to Bag</span>
            <span className={styles.mobileOnly}>Back to home</span>
            
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <p>SECURE CHECKOUT</p>
        <h1>Complete your <em>story.</em></h1>
        <span>Your pieces are almost on their way to you.</span>
      </section>

      {success ? (
        <section className={styles.success}>
          <div className={styles.successIcon}>
            <CheckIcon />
          </div>
          <p>ORDERED</p>
          <h2>Your order has been  placed succesfully.</h2>
          <span>
            You'll receive a call from us to confirm the order.
            Please be available to confirm the order shortly.
          </span>
          <div className={styles.successActions}>
            <Link href="/shop" className={styles.outlinePill}>
              Continue shopping
            </Link>
            <Link href="/accounts/orders" className={styles.darkPill}>
              My Orders
            </Link>
          </div>
        </section>
      ) : (
        <form className={styles.checkoutGrid} onSubmit={submitCheckout}>
          <section className={styles.formColumn}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>
                <div>
                  <span>01</span>
                  <p>CONTACT</p>
                </div>
                <small>YOUR DETAILS</small>
              </div>

              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>EMAIL ADDRESS</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>PHONE NUMBER</span>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                </label>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>
                <div>
                  <span>02</span>
                  <p>DELIVERY</p>
                </div>
                <small>WHERE SHOULD WE SEND IT?</small>
              </div>

              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ color: "rgba(245,241,232,.42)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 10 }}>
                    SAVED ADDRESSES
                  </div>
                  <select
                    value={selectedAddressId}
                    onChange={(event) => applySavedAddress(event.target.value)}
                    style={{ width: "100%", padding: "14px", borderRadius: 10, background: "rgba(0,0,0,.18)", color: "#f5f1e8", border: "1px solid rgba(255,255,255,.1)" }}
                  >
                    <option value="">Choose a saved address</option>
                    {savedAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label}{address.isDefault ? " · Default" : ""} — {address.city}, {address.pincode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.fields}>
                <div className={styles.two}>
                  <label className={styles.field}>
                    <span>FIRST NAME</span>
                    <input
                      name="firstName"
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>LAST NAME</span>
                    <input
                      name="lastName"
                      placeholder="Last name"
                      autoComplete="family-name"
                      required
                    />
                  </label>
                </div>

                <label className={styles.field}>
                  <span>ADDRESS</span>
                  <input
                    name="address"
                    placeholder="House number and street"
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>APARTMENT / LANDMARK <small>OPTIONAL</small></span>
                  <input
                    name="apartment"
                    placeholder="Apartment, floor, landmark..."
                    autoComplete="address-line2"
                  />
                </label>

                <div className={styles.three}>
                  <label className={styles.field}>
                    <span>CITY</span>
                    <input
                      name="city"
                      placeholder="Kolkata"
                      autoComplete="address-level2"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>STATE</span>
                    <input
                      name="state"
                      placeholder="West Bengal"
                      autoComplete="address-level1"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>PINCODE</span>
                    <input
                      name="pincode"
                      placeholder="700001"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      required
                    />
                  </label>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2, color: "rgba(245,241,232,.52)", fontSize: 11 }}>
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(event) => setSaveAddress(event.target.checked)}
                  />
                  Save address for faster checkouts
                </label>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>
                <div>
                  <span>03</span>
                  <p>PAYMENT</p>
                </div>
                <small>SELECT METHOD</small>
              </div>

              <div className={styles.paymentOptions}>
                {paymentSettings.cod && (
                  <button
                    type="button"
                    className={`${styles.paymentOption} ${
                      payment === "cod" ? styles.paymentActive : ""
                    }`}
                    onClick={() => selectPaymentMethod("cod")}
                  >
                    <span className={styles.radio}>
                      {payment === "cod" && <i />}
                    </span>
                    <span>
                      <strong>Cash on Delivery</strong>
                      <small>Pay when your ZELORA piece arrives.</small>
                    </span>
                    <b>COD</b>
                  </button>
                )}

                {paymentSettings.upi && (
                  <button
                    type="button"
                    className={`${styles.paymentOption} ${
                      payment === "upi" ? styles.paymentActive : ""
                    }`}
                    onClick={() => selectPaymentMethod("upi")}
                  >
                    <span className={styles.radio}>
                      {payment === "upi" && <i />}
                    </span>
                    <span>
                      <strong>UPI / Digital Payment</strong>
                      <small>Google Pay, PhonePe, Paytm & more · Get 10% off instantly.</small>
                    </span>
                    <b>UPI</b>
                  </button>
                )}

                {paymentSettings.card && (
                  <button
                    type="button"
                    className={`${styles.paymentOption} ${
                      payment === "card" ? styles.paymentActive : ""
                    }`}
                    onClick={() => selectPaymentMethod("card")}
                  >
                    <span className={styles.radio}>
                      {payment === "card" && <i />}
                    </span>
                    <span>
                      <strong>Card</strong>
                      <small>Visa, Mastercard and supported cards.</small>
                    </span>
                    <b>CARD</b>
                  </button>
                )}
              </div>

              <div className={styles.secureNote}>
                <span>◇</span>
                <p>
                  <strong>SECURE CHECKOUT</strong>
                  Your information is protected and handled securely.
                </p>
              </div>
            </div>
          </section>

          <aside className={styles.summary}>
            <div className={styles.summaryGlow} />

            <div className={styles.summaryInner}>
              <p className={styles.eyebrow}>YOUR ZELORA EDIT</p>
              <h2>Order summary.</h2>

              <div className={styles.productList}>
                {items.map((item) => (
                  <div className={styles.product} key={`${item.id}-${item.personalization}`}>
                    <div className={styles.productImage}>
                      <img src={item.image || FALLBACK_IMAGE} alt={item.name} />
                      <span>{item.quantity}</span>
                    </div>

                    <div className={styles.productInfo}>
                      <p>{item.name}</p>
                      {item.personalization ? (
                        <small>“{item.personalization}”</small>
                      ) : (
                        <small>Personalized for your story</small>
                      )}
                    </div>

                    <strong>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className={styles.coupon}>
                <label htmlFor="checkout-coupon">HAVE A CODE?</label>
                <div>
                  <input
                    id="checkout-coupon"
                    value={coupon}
                    onChange={(event) => {
                      setCoupon(event.target.value);
if (couponApplied) setCouponApplied(false);
setCouponData(null);
setError("");
                    }}
                    placeholder={payment === "upi" ? "WELCOME10" : "WELCOME10"}
                    autoComplete="off"
                    
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
                {payment === "upi" && couponApplied ? (
                  <p>10% UPI discount and additional {couponData?.value ?? 0}% coupon discount applied.</p>
                  
                ) : payment === "upi" ? (
                  <p>10% UPI discount applied automatically.</p>
                ) : couponApplied ? (
                  <p>
  {couponData?.type?.toLowerCase() === "percentage" ||
  couponData?.type?.toLowerCase() === "percent" ||
  couponData?.type === "%"
    ? `${couponData.value}% discount applied.`
    : "Coupon discount applied."}
</p>
                ) : null}
              </div>

              <div className={styles.totals}>
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
                    <span>{payment === "upi" ? "Discount" : "Discount"}</span>
                    <strong className={styles.discount}>
                      -₹{discount.toLocaleString("en-IN")}
                    </strong>
                  </div>
                )}
              </div>

              <div className={styles.total}>
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.placeOrder}
                disabled={placing}
                onMouseMove={magneticMove}
                onMouseLeave={magneticLeave}
              >
                <span>{placing ? "Preparing..." : "Place Order"}</span>
                {!placing && <ArrowIcon />}
              </button>

              <p className={styles.terms}>
                By continuing, you agree to ZELORA's terms, privacy policy and
                shipping conditions.
              </p>
            </div>
          </aside>
        </form>
      )}

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerLogo}>
          ZELORA
          <small>CRAFTED FOR EVERY STORY</small>
        </Link>
        <span>© 2026 ZELORA. Every piece tells a story.</span>
      </footer>
    </main>
  );
}
