"use client";

import { useEffect, useState } from "react";
import {
  CursorGlow,
  MagneticElements,
  ZyraCardMotion,
  ZyraScrollMotion,
} from "@/components/ZyraMotion";
import CategoryShowcase from "@/components/CategoryShowcase";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string | null;
  description?: string | null;
};

type HeroBanner = {
  id: string;
  url: string;
  position: number;
  active: boolean;
};

type HomeCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

type Announcement = {
  id: number;
  text: string;
  position: number;
  active: boolean;
};

const collections = [
  {
    title: "THE NOIR",
    subtitle: "COLLECTION",
    text: "Bold. Timeless. Yours.",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "LEGACY",
    subtitle: "ESSENTIALS",
    text: "Classic wallets with curated personalization for you.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "SIGNATURE",
    subtitle: "COLLECTION",
    text: "Where elegance meets personalization.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85",
  },
];

const steps = [
  {
    number: "01",
    icon: "✦",
    title: "CHOOSE YOUR PRODUCT",
    text: "Pick what you love",
  },
  {
    number: "02",
    icon: "⌁",
    title: "PERSONALIZE DESIGN",
    text: "Add names, dates, symbols & more",
  },
  {
    number: "03",
    icon: "◇",
    title: "WE CRAFT IT",
    text: "Handcrafted with precision & care",
  },
  {
    number: "04",
    icon: "→",
    title: "DELIVERED TO YOU",
    text: "Beautifully packed and delivered with love",
  },
];

const testimonials = [
  {
    text: "The quality is outstanding and the personalization makes it so special. Perfect gift for my boyfriend!",
    name: "Priya S.",
    initial: "P",
  },
  {
    text: "Absolutely in love with my necklace! The engraving is so clean and elegant. Will definitely order again.",
    name: "Arjun M.",
    initial: "A",
  },
  {
    text: "Beautiful packaging and fast delivery. ZELORA never disappoints!",
    name: "Neha K.",
    initial: "N",
  },
];

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {direction === "left" ? (
        <>
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </>
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([
    { id: "fallback-1", url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=2200&q=90", position: 0, active: true },
    { id: "fallback-2", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2200&q=90", position: 1, active: true },
    { id: "fallback-3", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=2200&q=90", position: 2, active: true },
  ]);
  const [heroSlide, setHeroSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileCategoriesOpen(false);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const response = await fetch("/api/admin/announcements", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load announcements");
        }

        const data = await response.json();
        const items: Announcement[] = Array.isArray(data?.announcements)
          ? data.announcements
              .map((item: any) => ({
                id: Number(item?.id ?? 0),
                text: String(item?.text ?? "").trim(),
                position: Number(item?.position ?? 0),
                active: item?.active === true,
              }))
              .filter(
                (item: Announcement) =>
                  item.id > 0 && item.text && item.active
              )
              .sort((a: Announcement, b: Announcement) => a.position - b.position)
          : [];

        setAnnouncements(items);
        setAnnouncementIndex(0);
      } catch (error) {
        console.error("Announcements loading error:", error);
        setAnnouncements([]);
      }
    }

    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const timer = window.setInterval(() => {
      setAnnouncementIndex((current) =>
        (current + 1) % announcements.length
      );
    }, 3000);

    return () => window.clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();
        const rawCategories = Array.isArray(data?.categories)
          ? data.categories
          : [];

        const normalizedCategories: HomeCategory[] = rawCategories
          .map((category: any) => ({
            id: Number(category?.id ?? 0),
            name: String(category?.name ?? "").trim(),
            slug: String(category?.slug ?? "").trim(),
            description: String(category?.description ?? "").trim(),
            image: String(category?.image ?? "").trim(),
            productCount: Number(category?.productCount ?? 0),
          }))
          .filter(
            (category: HomeCategory) =>
              category.id > 0 &&
              category.name &&
              category.slug
          );

        setCategories(normalizedCategories);
      } catch (error) {
        console.error("Categories loading error:", error);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load products");
      }

      const data = await res.json();

      // API may return either:
      // [product, product]
      // or { products: [product, product] }
      const rawProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : [];

      // Make absolutely sure only valid product records enter state.
      const normalizedProducts: Product[] = rawProducts
        .map((item: any) => {
          // Handles accidental { product: {...} } responses too.
          const product =
            item?.product && typeof item.product === "object"
              ? item.product
              : item;

          return {
            id: Number(product?.id ?? 0),
            name: String(product?.name ?? ""),
            category:
              typeof product?.category === "string"
                ? product.category
                : String(product?.category?.name ?? "Accessories"),
            price: Number(product?.price ?? 0),
            stock: Number(product?.stock ?? 0),
            image:
              typeof product?.image === "string"
                ? product.image
                : "",
          };
        })
        .filter((product: Product) => product.id && product.name);

      setProducts(normalizedProducts);
    } catch (error) {
      console.error("Products loading error:", error);
      setProducts([]);
    }
  }

  loadProducts();
}, []);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const response = await fetch("/api/accounts/wishlist", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const ids = Array.isArray(data?.items)
          ? data.items
              .map((item: any) => Number(item?.productId ?? item?.product?.id ?? 0))
              .filter((id: number) => Number.isInteger(id) && id > 0)
          : [];

        setWishlistedProductIds(new Set(ids));
      } catch (error) {
        console.error("Wishlist loading error:", error);
      }
    }

    loadWishlist();
  }, []);

  useEffect(() => {
    async function loadHeroBanners() {
      try {
        const response = await fetch("/api/admin/hero-banners", { cache: "no-store" });
        const data = await response.json();
        const banners = Array.isArray(data?.banners)
          ? data.banners.filter((item: any) => item?.active !== false && typeof item?.url === "string" && item.url.trim())
          : [];
        if (banners.length) {
          setHeroBanners(banners);
          setHeroSlide(0);
        }
      } catch (error) {
        console.error("Hero banners loading error:", error);
      }
    }

    loadHeroBanners();
  }, []);

  useEffect(() => {
    if (!heroBanners.length) return;
    const timer = setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroBanners.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Personalized Black Bracelet",
    category: "Bracelets",
    price: 1299,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Classic Leather Wallet",
    category: "Wallets",
    price: 1899,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Engraved Bar Necklace",
    category: "Necklaces & Pendants",
    price: 1499,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Black Gold Ring",
    category: "Rings",
    price: 1199,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Leather Keychain",
    category: "Keychains",
    price: 699,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1585488430781-7f8d6c5f7f1b?auto=format&fit=crop&w=900&q=85",
  },
];

const displayProducts =
  products.length > 0 ? products.slice(0, 5) : fallbackProducts;

  return (
  <>
    <CursorGlow />
    <MagneticElements />
    <ZyraCardMotion />
    <ZyraScrollMotion />

    <main className="zelora">
      {/* ANNOUNCEMENT BAR */}
      <div className="announcement">
        <div className="announcement-left">
          <span className="truck" aria-hidden="true">◇</span>
          <span className="announcement-viewport" aria-live="polite">
            <span
              key={
                announcements.length > 0
                  ? announcements[announcementIndex]?.id
                  : "default-announcement"
              }
              className="announcement-message"
            >
              {announcements.length > 0
                ? announcements[announcementIndex]?.text
                : "FREE SHIPPING ON ALL ORDERS"}
            </span>
          </span>
        </div>

        <div className="announcement-right">
          <a href="/track-order">Track Order</a>
          <a href="/contact">Contact us</a>
          <a href="/wishlist">Wishlist ({wishlistedProductIds.size})</a>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="nav-left">
          <a href="/" className="nav-link active">
            HOME
          </a>

          <a href="/shop" className="nav-link nav-shop">
            SHOP
            <span>⌄</span>
          </a>

          <a href="/shop" className="nav-link">
            ALL PRODUCTS
          </a>

          <div className="nav-category-dropdown">
            <button
              type="button"
              className="nav-link nav-category-trigger"
              aria-haspopup="true"
            >
              CATEGORIES
              <span className="nav-category-arrow" aria-hidden="true">
                ⌄
              </span>
            </button>

            <div className="nav-category-menu">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/shop?category=${encodeURIComponent(
                      category.slug
                    )}`}
                    className="nav-category-item"
                  >
                    <span>{category.name}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                ))
              ) : (
                <span className="nav-category-empty">
                  No categories available
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`mobile-menu-toggle${mobileMenuOpen ? " is-open" : ""}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <a href="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <span>ZELORA</span>
          <small>CRAFTED FOR EVERY STORY</small>
        </a>

        <div className="nav-right">
          <a href="/search" className="icon-btn mobile-search-icon" aria-label="Search">
            <SearchIcon />
          </a>

          <a
            href="/wishlist"
            className="icon-btn mobile-wishlist"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </a>

          <a href="/account" className="icon-btn" aria-label="Account">
            <UserIcon />
          </a>

          <a href="/cart" className="cart-btn" aria-label="Cart">
            <BagIcon />
            <span className="cart-count">0</span>
          </a>
        </div>

        <div
          className={`mobile-menu${mobileMenuOpen ? " is-open" : ""}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mobile-menu-inner">
            <a
              href="/search"
              className="mobile-menu-row mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Search</span>
              <SearchIcon />
            </a>

            <a
              href="/track-order"
              className="mobile-menu-row mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Track my Order</span>
              <span className="mobile-menu-arrow" aria-hidden="true">→</span>
            </a>

            <div className="mobile-menu-category">
              <button
                type="button"
                className="mobile-menu-row mobile-menu-category-trigger"
                aria-expanded={mobileCategoriesOpen}
                onClick={() =>
                  setMobileCategoriesOpen((open) => !open)
                }
              >
                <span>Categories</span>
                <span
                  className={`mobile-menu-chevron${
                    mobileCategoriesOpen ? " is-open" : ""
                  }`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              <div
                className={`mobile-subcategory-wrap${
                  mobileCategoriesOpen ? " is-open" : ""
                }`}
              >
                <div className="mobile-subcategory-list">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <a
                        key={category.id}
                        href={`/shop?category=${encodeURIComponent(
                          category.slug
                        )}`}
                        className="mobile-subcategory-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{category.name}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    ))
                  ) : (
                    <span className="mobile-subcategory-empty">
                      No categories available
                    </span>
                  )}
                </div>
              </div>
            </div>

            <a
              href="/contact"
              className="mobile-menu-row mobile-menu-link mobile-menu-contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Contact Us</span>
              <span className="mobile-menu-arrow" aria-hidden="true">→</span>
            </a>

            <a
              href="/about-us"
              className="mobile-menu-row mobile-menu-link mobile-menu-about"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>About Us</span>
              <span className="mobile-menu-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div
          className={`hero-image hero-image-${heroSlide}`}
          style={{
            backgroundImage: `url("${heroBanners[heroSlide]?.url || heroBanners[0]?.url}")`,
          }}
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow">BEYOND ORDINARY</p>

          <h1>
            Crafted For
            <br />
            <span>Every Story.</span>
          </h1>

          <p className="hero-description">
            Personalized jewelry and accessories
            <br />
            that tell your story, your way.
          </p>

          <a href="/shop" className="gold-pill">
            EXPLORE COLLECTION
            <ArrowIcon />
          </a>
        </div>

        <button
          className="hero-arrow hero-arrow-left"
          onClick={() => setHeroSlide((heroSlide - 1 + heroBanners.length) % heroBanners.length)}
          aria-label="Previous slide"
        >
          <ArrowIcon direction="left" />
        </button>

        <button
          className="hero-arrow hero-arrow-right"
          onClick={() => setHeroSlide((heroSlide + 1) % heroBanners.length)}
          aria-label="Next slide"
        >
          <ArrowIcon />
        </button>

        <div className="hero-dots">
          {heroBanners.map((banner, dot) => (
            <button
              key={dot}
              className={heroSlide === dot ? "dot active" : "dot"}
              onClick={() => setHeroSlide(dot)}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY */}
      <section className="section category-section">
        <div className="section-heading">
          <p>DISCOVER ZELORA</p>
          <h2>SHOP BY CATEGORY</h2>
          <span />
        </div>

        <CategoryShowcase categories={categories} />
      </section>

      {/* COLLECTIONS */}
      <section className="section collection-section">
        <div className="section-heading">
          <p>CURATED FOR YOU</p>
          <h2>FEATURED COLLECTIONS</h2>
          <span />
        </div>

        <div className="collection-grid">
          {collections.map((collection) => (
            <a href="/shop" className="collection-card" key={collection.title}>
              <img src={collection.image} alt={collection.title} />

              <div className="collection-overlay" />

              <div className="collection-info">
                <p>
                  {collection.title}
                  <br />
                  <span>{collection.subtitle}</span>
                </p>

                <small>{collection.text}</small>

                <div className="collection-link">
                  EXPLORE
                  <ArrowIcon />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section best-section">
        <div className="section-heading">
          <p>THE ZELORA EDIT</p>
          <h2>BEST SELLERS</h2>
          <span />
        </div>

        <div className="products-grid">
          {displayProducts.map((product) => (
            <a
              href={`/shop/${product.id}`}
              className="product-card"
              key={product.id}
            >
              <div className="product-image">
                <img
                  src={
                    product.image ||
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
                  }
                  alt={product.name}
                />

                <button
                  className="wishlist"
                  style={
                    wishlistedProductIds.has(product.id)
                      ? { color: "#EFBF04" }
                      : undefined
                  }
                  aria-label={
                    wishlistedProductIds.has(product.id)
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                      const isWishlisted = wishlistedProductIds.has(product.id);
                      const response = await fetch(
                        isWishlisted
                          ? `/api/accounts/wishlist?productId=${product.id}`
                          : "/api/accounts/wishlist",
                        {
                          method: isWishlisted ? "DELETE" : "POST",
                          ...(isWishlisted
                            ? {}
                            : {
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ productId: product.id }),
                              }),
                        }
                      );

                      if (response.status === 401) {
                        window.location.href = "/account/login";
                        return;
                      }

                      if (!response.ok) return;

                      setWishlistedProductIds((current) => {
                        const next = new Set(current);

                        if (next.has(product.id)) {
                          next.delete(product.id);
                        } else {
                          next.add(product.id);
                        }

                        return next;
                      });
                    } catch (error) {
                      console.error("Wishlist action error:", error);
                    }
                  }}
                >
                  <HeartIcon filled={wishlistedProductIds.has(product.id)} />
                </button>

                <div className="quick-add">
                  QUICK VIEW
                </div>
              </div>

              <div className="product-info">
                <p className="product-category">{product.category}</p>

                <h3>{product.name}</h3>

                <p className="product-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <div className="rating">
                  <span>★★★★★</span>
                  <small>({Math.floor(50 + product.id * 19)})</small>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="center-button">
          <a href="/shop" className="outline-pill">
            VIEW ALL PRODUCTS
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* STORY / PERSONALIZATION */}
      <section className="story-section">
        <div className="section-heading">
          <p>MADE FOR YOU</p>
          <h2>YOUR STORY, YOUR WAY</h2>
          <span />
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <div className="step" key={step.number}>
              <div className="step-circle">
                {step.icon}
              </div>

              <div className="step-number">{step.number}</div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

              {index < steps.length - 1 && (
                <div className="step-line">
                  <span />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="story-cta">
          <a href="/shop" className="gold-pill">
            START PERSONALIZING
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="section-heading">
          <p>REAL STORIES</p>
          <h2>WHAT OUR CUSTOMERS SAY</h2>
          <span />
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <div className="testimonial" key={testimonial.name}>
              <div className="quote">“</div>

              <p>{testimonial.text}</p>

              <div className="customer">
                <div className="avatar">{testimonial.initial}</div>

                <div>
                  <strong>{testimonial.name}</strong>

                  <div className="customer-rating">
                    ★★★★★
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <p>THE ZELORA JOURNAL</p>
        <h2>Stay in the story.</h2>

        <span>
          Join our newsletter for exclusive offers, new arrivals
          <br />
          and stories from the world of ZELORA.
        </span>

        <form
          suppressHydrationWarning
          className="newsletter-form"
          onSubmit={async (event) => {
            event.preventDefault();

            const form = event.currentTarget;
            const input = form.elements.namedItem("email");

            if (!(input instanceof HTMLInputElement)) return;

            const email = input.value.trim();

            if (!email) return;

            try {
              const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data?.message || "Unable to subscribe.");
              }

              input.value = "";
            } catch (error) {
              console.error("Newsletter subscription error:", error);
            }
          }}
        >
          <input
            suppressHydrationWarning
            type="email"
            name="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            required
          />

          <button type="submit">
            JOIN
            <ArrowIcon />
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            ZELORA
          </a>

          <p>CRAFTED FOR EVERY STORY</p>

          <span>
            Personalized jewelry and accessories
            <br />
            designed to celebrate life's most
            <br />
            meaningful moments.
          </span>

          
        </div>

        <div className="footer-column">
          <h3>SHOP</h3>
          <a href="/shop?category=bracelets">Bracelets</a>
          <a href="/shop?category=wallets">Wallets</a>
          <a href="/shop?category=necklaces">Necklaces & Pendants</a>
          <a href="/shop?category=rings">Rings</a>
          <a href="/shop?category=keychains">Keychains</a>
          <a href="/shop?category=bangels">Bangels</a>
        </div>

        <div className="footer-column">
          <h3>LEGALS</h3>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/return-refund-policy">Returns & Refund</a>
          <a href="/shipping-">Shipping Policy</a>
          <a href="/terms-and-conditions">Terms & Conditions</a>
          <a href="/cancellation-policy">Cancellation Policy</a>
        </div>

        <div className="footer-column">
          <h3>ABOUT</h3>
          <a href="/about-us">About Us</a>
          <a href="/faq">FAQs</a>
          <a href="/track-order">Track Order</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ZELORA. ALL RIGHTS RESERVED.</span>

          <div className="payments">
            <span>PHONE PE</span>
            <span>●</span>
            <span>PAYTM</span>
            <span>●</span>
            <span>GOOGLE PAY</span>
            <span>●</span>
            <span>BHIM UPI</span>
            <span>●</span>
            <span>COD</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050505;
          color: #f4f1eb;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .zelora {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(239,191,4, 0.045),
              transparent 35%
            ),
            #050505;
        }

        /* ANNOUNCEMENT */

        .announcement {
          height: 34px;
          padding: 0 4vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          background: #000000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.72);
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        /* A restrained luxury hairline — intentionally static so the
           announcement itself remains the visual focus. */
        .announcement::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 96px;
          height: 1px;
          transform: translateX(-50%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(239,191,4,.65),
            transparent
          );
          opacity: .7;
          pointer-events: none;
        }

        .announcement-left,
        .announcement-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .announcement-left {
          color: #EFBF04;
          min-width: 0;
          flex: 1;
        }

        .announcement-viewport {
          position: relative;
          display: block;
          flex: 0 1 auto;
          min-width: 0;
          width: min(62vw, 760px);
          height: 34px;
          overflow: hidden;
          text-align: left;
          isolation: isolate;
        }

        /* Soft edge masks make the vertical movement disappear into the
           bar rather than visibly clipping at a hard edge. */
        .announcement-viewport::before,
        .announcement-viewport::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          z-index: 2;
          pointer-events: none;
        }

        .announcement-viewport::before {
          top: 0;
          background: linear-gradient(
            to bottom,
            #000000,
            rgba(8,8,8,0)
          );
        }

        .announcement-viewport::after {
          bottom: 0;
          background: linear-gradient(
            to top,
            #000000,
            rgba(8,8,8,0)
          );
        }

        .announcement-message {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: max-content;
          white-space: nowrap;
          padding: 0 14px;
          color: rgba(255,255,255,.82);
          text-shadow: 0 1px 14px rgba(0,0,0,.28);
          will-change: transform, opacity;
          animation: announcementLuxuryRoll 3800ms cubic-bezier(.22,.61,.36,1) both;
        }

        /*
         * True vertical editorial roll:
         * - enters from below
         * - settles with a long, quiet hold
         * - exits above
         *
         * The next keyed message mounts at the same cycle boundary, so
         * the announcement feels like one continuous vertical reel.
         */
        @keyframes announcementLuxuryRoll {
          0% {
            opacity: 0;
            transform: translate3d(0, 115%, 0);
          }

          13% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }

          76% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }

          100% {
            opacity: 0;
            transform: translate3d(0, -115%, 0);
          }
        }

        .truck {
          flex: 0 0 auto;
          font-size: 14px;
          line-height: 1;
          color: #EFBF04;
          text-shadow: 0 0 16px rgba(239,191,4,.16);
        }

        .announcement-right a {
          transition: color 0.3s ease;
        }

        .announcement-right a:hover {
          color: #EFBF04;
        }

        /* NAVBAR */

        .navbar {
          height: 72px;
          padding: 0 4.5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 20;
          background: #000000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.075);
        }

        .nav-left,
        .nav-right {
          display: flex;
          align-items: center;
        }

        .nav-left {
          gap: 31px;
        }

        .nav-right {
          gap: 20px;
        }

        .nav-link {
          position: relative;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.86);
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #EFBF04;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -11px;
          height: 1px;
          background: #EFBF04;
        }

        .nav-shop {
          display: flex;
          gap: 5px;
        }

        .nav-category-dropdown {
          position: relative;
          display: flex;
          align-items: center;
          height: 100%;
        }

        .nav-category-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          letter-spacing: 0.08em;
          line-height: normal;
          color: rgba(255, 255, 255, 0.86);
          white-space: nowrap;
        }

        .nav-category-trigger:hover,
        .nav-category-trigger:focus-visible {
          color: #EFBF04;
        }

        .nav-category-arrow {
          display: inline-block;
          font-size: 12px;
          line-height: 1;
          transform: translateY(-1px);
          transition:
            transform 0.3s ease,
            color 0.3s ease;
        }

        .nav-category-dropdown:hover .nav-category-arrow,
        .nav-category-dropdown:focus-within .nav-category-arrow {
          transform: translateY(1px) rotate(180deg);
          color: #EFBF04;
        }

        .nav-category-menu {
          position: absolute;
          top: 210%;
          left: 45%;
          min-width: 220px;
          padding: 10px;
          transform: translate(-50%, -8px);
          transform-origin: top center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          background:
            linear-gradient(
              145deg,
              rgba(30, 27, 21, 0.98),
              rgba(9, 9, 9, 0.99)
            );
          border: 1px solid rgba(213, 177, 93, 0.28);
          border-radius: 14px;
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.48),
            0 0 28px rgba(213, 177, 93, 0.07);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            opacity 0.22s ease,
            transform 0.22s cubic-bezier(.22, .61, .36, 1),
            visibility 0.22s ease;
          z-index: 100;
        }

        /* Invisible hover bridge: lets the cursor travel into the menu
           without closing it, while keeping the visible menu flush with nav. */
        .nav-category-menu::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -16px;
          height: 16px;
        }

        .nav-category-menu::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 50%;
          width: 11px;
          height: 11px;
          transform: translateX(-50%) rotate(45deg);
          background: #17150f;
          border-left: 1px solid rgba(213, 177, 93, 0.28);
          border-top: 1px solid rgba(213, 177, 93, 0.28);
        }

        .nav-category-dropdown:hover .nav-category-menu,
        .nav-category-dropdown:focus-within .nav-category-menu {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translate(-50%, 0);
        }

        .nav-category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 12px 13px;
          border-radius: 9px;
          color: rgba(255, 255, 255, 0.78) !important;
          font-size: 10px;
          letter-spacing: 0.08em;
          white-space: nowrap;
          text-decoration: none !important;
          position: relative;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            padding-left 0.2s ease;
        }

        .nav-category-item::before,
        .nav-category-item::after {
          content: none !important;
          display: none !important;
        }

        .nav-category-item + .nav-category-item {
          margin-top: 2px;
        }

        .nav-category-item span:last-child {
          color: #EFBF04;
          opacity: 0.7;
          transition: transform 0.2s ease;
        }

        .nav-category-item:hover,
        .nav-category-item:focus,
        .nav-category-item:focus-visible,
        .nav-category-item:active {
          color: #ffffff !important;
          background: rgba(213, 177, 93, 0.09);
          padding-left: 16px;
          text-decoration: none !important;
        }

        .nav-category-item:hover span:last-child,
        .nav-category-item:focus span:last-child {
          transform: translateX(3px);
        }

        .nav-category-empty {
          display: block;
          padding: 12px 13px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 10px;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        /* MOBILE NAVIGATION */
        .mobile-menu-toggle,
        .mobile-wishlist,
        .mobile-menu {
          display: none;
        }

        .mobile-menu-toggle {
          border: 0;
          padding: 0;
          margin: 0;
          width: 38px;
          height: 38px;
          position: relative;
          align-items: center;
          justify-content: center;
          flex: 0 0 38px;
          background: transparent;
          color: #f4f1eb;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          z-index: 130;
        }

        .mobile-menu-toggle span {
          position: absolute;
          left: 8px;
          width: 22px;
          height: 1.5px;
          border-radius: 999px;
          background: currentColor;
          transform-origin: center;
          transition:
            transform 700ms cubic-bezier(.16,1,.3,1),
            opacity 420ms ease,
            width 500ms cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }

        .mobile-menu-toggle span:nth-child(1) {
          transform: translateY(-6px);
        }

        .mobile-menu-toggle span:nth-child(2) {
          transform: translateY(0);
        }

        .mobile-menu-toggle span:nth-child(3) {
          transform: translateY(6px);
        }

        .mobile-menu-toggle.is-open span:nth-child(1) {
          transform: translateY(0) rotate(45deg);
        }

        .mobile-menu-toggle.is-open span:nth-child(2) {
          opacity: 0;
          width: 0;
        }

        .mobile-menu-toggle.is-open span:nth-child(3) {
          transform: translateY(0) rotate(-45deg);
        }

        .mobile-menu-toggle:active {
          transform: scale(.94);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          max-height: calc(100vh - 98px);
          overflow-y: auto;
          overscroll-behavior: contain;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(239,191,4,.08),
              transparent 34%
            ),
            rgba(5,5,5,.985);
          border-top: 1px solid rgba(239,191,4,.14);
          box-shadow:
            0 28px 80px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.025);
          backdrop-filter: blur(26px) saturate(125%);
          -webkit-backdrop-filter: blur(26px) saturate(125%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translate3d(0,-18px,0);
          clip-path: inset(0 0 100% 0);
          transition:
            opacity 550ms cubic-bezier(.16,1,.3,1),
            transform 700ms cubic-bezier(.16,1,.3,1),
            clip-path 750ms cubic-bezier(.16,1,.3,1),
            visibility 0s linear 750ms;
          z-index: 120;
        }

        .mobile-menu.is-open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translate3d(0,0,0);
          clip-path: inset(0 0 0 0);
          transition:
            opacity 450ms cubic-bezier(.16,1,.3,1),
            transform 700ms cubic-bezier(.16,1,.3,1),
            clip-path 750ms cubic-bezier(.16,1,.3,1),
            visibility 0s linear 0s;
        }

        .mobile-menu-inner {
          padding: 16px 24px 42px;
        }

        .mobile-menu-row {
          width: 100%;
          min-height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 0;
          border-bottom: 1px solid rgba(255,255,255,.09);
          border-radius: 0;
          background: transparent;
          color: rgba(255,255,255,.88);
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: .035em;
          text-align: left;
          transition:
            color 350ms ease,
            padding-left 500ms cubic-bezier(.16,1,.3,1),
            background 350ms ease;
        }

        .mobile-menu-link:active,
        .mobile-menu-category-trigger:active {
          color: #EFBF04;
        }

        .mobile-menu-link:hover {
          color: #EFBF04;
          padding-left: 5px;
        }

        .mobile-menu-link svg {
          width: 17px;
          height: 17px;
          opacity: .58;
        }

        .mobile-menu-arrow {
          color: #EFBF04;
          font-size: 16px;
          line-height: 1;
          opacity: .78;
          transform: translateX(0);
          transition:
            transform 450ms cubic-bezier(.16,1,.3,1),
            opacity 300ms ease;
        }

        .mobile-menu-link:hover .mobile-menu-arrow {
          transform: translateX(5px);
          opacity: 1;
        }

        .mobile-menu-category {
          margin: 0;
          padding: 0;
        }

        .mobile-menu-category-trigger {
          cursor: pointer;
          margin: 0;
          padding: 0 !important;
          padding-left: 0 !important;
          padding-right: 1px !important;
          text-indent: 0;
          appearance: none;
          -webkit-appearance: none;
          box-sizing: border-box;
        }

        .mobile-menu-category-trigger > span:first-child {
          margin-left: 0 !important;
          padding-left: 0 !important;
          text-indent: 0;
        }

        .mobile-menu-chevron {
          color: #EFBF04;
          font-size: 18px;
          line-height: 1;
          transform: translateY(-2px) rotate(0deg);
          transition:
            transform 550ms cubic-bezier(.16,1,.3,1),
            color 350ms ease;
        }

        .mobile-menu-chevron.is-open {
          transform: translateY(2px) rotate(180deg);
        }

        .mobile-subcategory-wrap {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition:
            grid-template-rows 650ms cubic-bezier(.16,1,.3,1),
            opacity 450ms ease;
        }

        .mobile-subcategory-wrap.is-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .mobile-subcategory-list {
          min-height: 0;
          overflow: hidden;
          padding-left: 17px;
        }

        .mobile-subcategory-link {
          min-height: 49px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(255,255,255,.055);
          color: rgba(255,255,255,.55);
          font-size: 12px;
          letter-spacing: .045em;
          transform: translateY(-7px);
          opacity: 0;
          transition:
            color 300ms ease,
            transform 550ms cubic-bezier(.16,1,.3,1),
            opacity 450ms ease;
        }

        .mobile-subcategory-wrap.is-open .mobile-subcategory-link {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-subcategory-link:hover {
          color: #EFBF04;
        }

        .mobile-subcategory-link span:last-child {
          color: #EFBF04;
          opacity: .7;
          transition: transform 400ms cubic-bezier(.16,1,.3,1);
        }

        .mobile-subcategory-link:hover span:last-child {
          transform: translateX(4px);
        }

        .mobile-subcategory-empty {
          display: block;
          padding: 18px 0;
          color: rgba(255,255,255,.35);
          font-size: 11px;
          letter-spacing: .05em;
        }

        .mobile-menu-category + .mobile-menu-link {
          border-top: 0;
        }

        .mobile-menu.is-open .mobile-menu-row,
        .mobile-menu.is-open .mobile-menu-category {
          animation: mobileMenuItemIn 700ms cubic-bezier(.16,1,.3,1) both;
        }

        .mobile-menu.is-open .mobile-menu-row:nth-child(1) {
          animation-delay: 80ms;
        }

        .mobile-menu.is-open .mobile-menu-row:nth-child(2) {
          animation-delay: 135ms;
        }

        .mobile-menu.is-open .mobile-menu-category {
          animation-delay: 190ms;
        }

        .mobile-menu.is-open .mobile-menu-contact {
          animation: mobileMenuItemIn 700ms cubic-bezier(.16,1,.3,1) both;
          animation-delay: 245ms;
        }

        .mobile-menu.is-open .mobile-menu-about {
          animation: mobileMenuItemIn 700ms cubic-bezier(.16,1,.3,1) both;
          animation-delay: 300ms;
        }

        @keyframes mobileMenuItemIn {
          from {
            opacity: 0;
            transform: translate3d(0,18px,0);
          }
          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        .logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #d3ae5b;
        }

        .logo span {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 31px;
          letter-spacing: 0.17em;
          line-height: 1;
        }

        .logo small {
          display: block;
          margin-top: 5px;
          font-size: 7px;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.6);
        }

        .icon-btn,
        .cart-btn {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          color: rgba(255, 255, 255, 0.9);
          transition:
            color 0.3s ease,
            transform 0.3s ease;
        }

        .icon-btn:hover,
        .cart-btn:hover {
          color: #EFBF04;
          transform: translateY(-2px);
        }

        .cart-btn {
          position: relative;
        }

        .cart-count {
          position: absolute;
          right: -7px;
          top: -7px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #EFBF04;
          color: #000000;
          font-size: 8px;
          font-weight: 700;
        }

        /* HERO */

        .hero {
          height: min(620px, calc(100vh - 106px));
          min-height: 520px;
          position: relative;
          overflow: hidden;
          background: #000000;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          animation: heroZoom 8s ease-out both;
          transition: opacity 0.6s ease;
        }

        @keyframes heroZoom {
          from {
            transform: scale(1.08);
          }

          to {
            transform: scale(1);
          }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(4, 4, 4, 0.96) 0%,
              rgba(4, 4, 4, 0.82) 28%,
              rgba(4, 4, 4, 0.25) 64%,
              rgba(4, 4, 4, 0.48) 100%
            ),
            linear-gradient(
              0deg,
              rgba(4, 4, 4, 0.55),
              transparent 40%,
              rgba(4, 4, 4, 0.18)
            );
        }

        .hero-content {
          position: absolute;
          left: 8.5vw;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
        }

        .eyebrow,
        .section-heading p,
        .newsletter > p {
          margin: 0 0 12px;
          color: #cba657;
          font-size: 10px;
          letter-spacing: 0.18em;
        }

        .hero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(48px, 5vw, 78px);
          line-height: 0.98;
          letter-spacing: -0.025em;
        }

        .hero h1 span {
          color: #EFBF04;
        }

        .hero-description {
          margin: 25px 0 28px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.8;
        }

        /* ALL PRIMARY BUTTONS ARE PILLS */

        .gold-pill,
        .outline-pill {
          min-height: 46px;
          padding: 0 24px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          font-size: 10px;
          letter-spacing: 0.13em;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            background 0.35s ease,
            color 0.35s ease;
        }

        .gold-pill {
          color: #000000;
          background: linear-gradient(135deg, #e1c06f, #b78c39);
          box-shadow: 0 7px 28px rgba(197, 154, 67, 0.16);
        }

        .gold-pill:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 35px rgba(197, 154, 67, 0.3),
            0 0 24px rgba(239,191,4, 0.12);
        }

        .outline-pill {
          color: #EFBF04;
          border: 1px solid rgba(213, 177, 93, 0.6);
          background: transparent;
        }

        .outline-pill:hover {
          transform: translateY(-3px);
          color: #090909;
          background: #EFBF04;
          border-color: #EFBF04;
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          z-index: 5;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: white;
          background: rgba(0, 0, 0, 0.22);
          display: grid;
          place-items: center;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }

        .hero-arrow:hover {
          color: #000000;
          background: #EFBF04;
          border-color: #EFBF04;
          transform: translateY(-50%) scale(1.08);
        }

        .hero-arrow-left {
          left: 3.5vw;
        }

        .hero-arrow-right {
          right: 3.5vw;
        }

        .hero-dots {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 6px;
          height: 6px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          transition: all 0.3s ease;
        }

        .dot.active {
          width: 24px;
          border-radius: 999px;
          background: #EFBF04;
        }

        /* SECTIONS */

        .section {
          padding: 72px 4.5vw 0;
        }

        .category-section {
          background: #000000;
        }

        .collection-section {
          background: #000000;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 28px;
        }

        .section-heading p {
          margin-bottom: 8px;
        }

        .section-heading h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: 27px;
          letter-spacing: 0.09em;
        }

        .section-heading > span {
          display: block;
          width: 48px;
          height: 1px;
          margin: 15px auto 0;
          background: #EFBF04;
          position: relative;
        }

        .section-heading > span::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          background: #EFBF04;
        }

        /* CATEGORY */

        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 9px;
        }

        .category-card {
          min-height: 250px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: #111;
        }

        .category-card img,
        .collection-card img,
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.2, 0.65, 0.2, 1);
        }

        .category-card:hover img,
        .collection-card:hover img {
          transform: scale(1.08);
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.08),
              rgba(0, 0, 0, 0.88)
            );
        }

        .category-info {
          position: absolute;
          left: 15px;
          right: 15px;
          bottom: 15px;
          z-index: 2;
        }

        .category-info h3 {
          margin: 0 0 7px;
          font-size: 11px;
          line-height: 1.4;
          letter-spacing: 0.05em;
        }

        .category-info span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #EFBF04;
          font-size: 9px;
          letter-spacing: 0.1em;
          transition: gap 0.3s ease;
        }

        .category-card:hover .category-info span {
          gap: 12px;
        }

        /* COLLECTIONS */

        .collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .collection-card {
          min-height: 290px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: #111;
        }

        .collection-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.83),
              rgba(0, 0, 0, 0.22)
            ),
            linear-gradient(0deg, rgba(0, 0, 0, 0.6), transparent 70%);
        }

        .collection-info {
          position: absolute;
          inset: 0;
          padding: 27px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          z-index: 2;
        }

        .collection-info > p {
          margin: 0 0 9px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          line-height: 0.95;
        }

        .collection-info > p span {
          color: #EFBF04;
        }

        .collection-info small {
          max-width: 210px;
          margin-bottom: 18px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .collection-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #EFBF04;
          font-size: 9px;
          letter-spacing: 0.13em;
          transition: gap 0.3s ease;
        }

        .collection-card:hover .collection-link {
          gap: 14px;
        }

        /* PRODUCTS */

        .best-section {
  padding-bottom: 72px;
  background: #000000;
}

        .products-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .product-card {
          min-width: 0;
          overflow: hidden;
        }

        .product-image {
          height: 310px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: #101010;
        }

        .product-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 65%,
            rgba(0, 0, 0, 0.35)
          );
          pointer-events: none;
        }

        .product-image img {
          filter: saturate(0.82) contrast(1.05);
        }

        .product-card:hover .product-image img {
          transform: scale(1.06);
        }

        .wishlist {
          position: absolute;
          z-index: 4;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          color: white;
          background: rgba(0, 0, 0, 0.48);
          display: grid;
          place-items: center;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .wishlist:hover {
          color: #000000;
          background: #EFBF04;
          border-color: #EFBF04;
        }

        .quick-add {
          position: absolute;
          z-index: 4;
          bottom: 12px;
          left: 50%;
          transform: translate(-50%, 15px);
          padding: 10px 18px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.95);
          color: #000000;
          font-size: 8px;
          letter-spacing: 0.14em;
          opacity: 0;
          transition: all 0.35s ease;
          white-space: nowrap;
        }

        .product-card:hover .quick-add {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .product-info {
          padding: 15px 4px 0;
        }

        .product-category {
          margin: 0 0 5px;
          color: #b99447;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .product-info h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.4;
        }

        .product-price {
          margin: 9px 0;
          color: #e5e0d7;
          font-size: 13px;
        }

        .rating {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .rating span,
        .customer-rating {
          color: #d9ae4f;
          letter-spacing: 0.06em;
          font-size: 11px;
        }

        .rating small {
          color: rgba(255, 255, 255, 0.42);
          font-size: 8px;
        }

        .center-button {
          text-align: center;
          margin-top: 36px;
        }

        /* STORY */

        .story-section {
          padding: 78px 4.5vw 82px;
          background: #000000;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .steps {
          width: 100%;
          max-width: 1200px;
          margin: 45px auto 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: start;
          justify-items: stretch;
        }

        .step {
          position: relative;
          text-align: center;
          padding: 0 15px;
        }

        .step-circle {
          width: 64px;
          height: 64px;
          margin: 0 auto 13px;
          border: 1px solid #b99142;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #EFBF04;
          font-size: 23px;
          background: rgba(197, 154, 67, 0.025);
          transition:
            transform 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }

        .step:hover .step-circle {
          transform: translateY(-5px);
          background: rgba(197, 154, 67, 0.09);
          box-shadow: 0 8px 30px rgba(239,191,4, 0.12);
        }

        .step-number {
          color: #b89148;
          font-size: 8px;
          letter-spacing: 0.14em;
          margin-bottom: 8px;
        }

        .step h3 {
          margin: 0;
          font-size: 9px;
          letter-spacing: 0.08em;
          font-weight: 500;
        }

        .step p {
          margin: 8px auto 0;
          max-width: 160px;
          color: rgba(255, 255, 255, 0.48);
          font-size: 9px;
          line-height: 1.6;
        }

        .step-line {
          position: absolute;
          width: calc(100% - 82px);
          left: calc(50% + 41px);
          top: 32px;
          border-top: 1px dotted rgba(205, 169, 88, 0.45);
        }

        .story-cta {
          margin-top: 44px;
          text-align: center;
        }

        /* TESTIMONIALS */

        .testimonials-section {
          padding-bottom: 82px;
          background: #000000;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .testimonial {
          min-height: 230px;
          padding: 27px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            );
          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease;
        }

        .testimonial:hover {
          transform: translateY(-5px);
          border-color: rgba(213, 177, 93, 0.35);
          background: rgba(213, 177, 93, 0.035);
        }

        .quote {
          font-family: Georgia, serif;
          color: #EFBF04;
          font-size: 42px;
          line-height: 0.7;
        }

        .testimonial > p {
          margin: 20px 0 25px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          line-height: 1.8;
        }

        .customer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #30261a, #8b6b34);
          color: #f5e3b4;
          font-family: Georgia, serif;
        }

        .customer strong {
          display: block;
          font-size: 10px;
          font-weight: 500;
        }

        /* NEWSLETTER */

        .newsletter {
          padding: 85px 20px;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background:
            radial-gradient(
              circle at center,
              rgba(205, 169, 88, 0.075),
              transparent 42%
            ),
            #000000;
        }

        .newsletter h2 {
          margin: 0 0 13px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          font-weight: 400;
        }

        .newsletter > span {
          display: block;
          color: rgba(255, 255, 255, 0.52);
          font-size: 11px;
          line-height: 1.7;
        }

        .newsletter-form {
          width: min(450px, 90vw);
          margin: 27px auto 0;
          padding: 4px;
          display: flex;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.025);
        }

        .newsletter-form input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          padding: 0 17px;
          background: transparent;
          color: white;
          font-size: 11px;
        }

        .newsletter-form input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .newsletter-form button {
          min-height: 39px;
          padding: 0 18px;
          border: 0;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #EFBF04;
          color: #090909;
          font-size: 9px;
          letter-spacing: 0.1em;
          transition: transform 0.3s ease;
        }

        .newsletter-form button:hover {
          transform: scale(1.03);
        }

        /* FOOTER */

        .footer {
          padding: 65px 4.5vw 25px;
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 50px;
          position: relative;
          background: #000000ff;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .footer-brand {
          padding-right: 30px;
        }

        .footer-logo {
          font-family: Georgia, "Times New Roman", serif;
          color: #EFBF04;
          font-size: 34px;
          letter-spacing: 0.17em;
        }

        .footer-brand > p {
          margin: 5px 0 16px;
          color: rgba(255, 255, 255, 0.48);
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .footer-brand > span {
          color: rgba(255, 255, 255, 0.43);
          font-size: 10px;
          line-height: 1.7;
        }

        .socials {
          display: flex;
          gap: 16px;
          margin-top: 23px;
        }

        .socials a {
          width: 26px;
          height: 26px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          transition: all 0.3s ease;
        }

        .socials a:hover {
          color: #090909;
          background: #EFBF04;
          border-color: #EFBF04;
          transform: translateY(-3px);
        }

        .footer-column h3 {
          margin: 4px 0 20px;
          color: #EFBF04;
          font-size: 9px;
          letter-spacing: 0.13em;
          font-weight: 500;
        }

        .footer-column a {
          display: block;
          margin-bottom: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 9px;
          transition: color 0.25s ease;
        }

        .footer-column a:hover {
          color: #EFBF04;
        }

        .footer-bottom {
          grid-column: 1 / -1;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255, 255, 255, 0.3);
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .payments {
          display: flex;
          gap: 12px;
          align-items: center;
          color: rgba(255, 255, 255, 0.55);
          font-size: 9px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .product-image {
            height: 340px;
          }
        }

        @media (max-width: 800px) {
          .announcement-right {
            display: none;
          }

          .announcement {
            justify-content: center;
            padding: 0 12px;
          }

          .announcement-left {
            width: 100%;
            flex: 1 1 100%;
            justify-content: center;
            text-align: center;
          }

          .announcement-viewport {
            width: 100%;
            max-width: 430px;
            margin: 0 auto;
            text-align: center;
          }

          .announcement-message {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            justify-content: center;
            padding: 0 18px;
            text-align: center;
          }

          .truck {
            display: none;
          }

          .navbar {
            height: 64px;
            padding: 0 18px;
          }

          .nav-left {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          /* The menu is hidden by default on desktop.
             On mobile it must participate in layout so the open-state
             opacity/clip-path animation can actually reveal the drawer. */
          .mobile-menu {
            display: block;
          }

          .mobile-search-icon,
          .cart-btn {
            display: none;
          }

          .mobile-wishlist {
            display: grid;
          }

          .mobile-wishlist svg {
            stroke-width: 0.85;
          }

          .nav-right {
            gap: 20px;
          }

          .icon-btn {
            width: 38px;
            height: 38px;
          }

          .mobile-wishlist svg {
            width: 34px;
            height: 34px;
          }

          .nav-right > a[href="/account"] svg {
            width: 29px;
            height: 29px;
          }

          .mobile-menu-inner {
            padding-left: 22px;
            padding-right: 22px;
          }

          .logo span {
            font-size: 27px;
          }

          .hero {
            min-height: 610px;
          }

          .hero-content {
            left: 7vw;
            right: 7vw;
          }

          .hero h1 {
            font-size: 52px;
          }

          .hero-description {
            font-size: 12px;
          }

          .section {
            padding-left: 5vw;
            padding-right: 5vw;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .collection-grid,
          .testimonial-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-image {
            height: 280px;
          }

          .steps {
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .step-line {
            display: none;
          }

          .footer {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 500px) {
          .announcement {
            font-size: 8px;
            padding: 0 14px;
          }

          .announcement-left {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .nav-right {
            gap: 0.5px;
          }

          .hero {
            min-height: 570px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .hero-arrow {
            width: 36px;
            height: 36px;
          }

          .hero-arrow-left {
            left: 4vw;
          }

          .hero-arrow-right {
            right: 4vw;
          }

          .category-grid {
            gap: 7px;
          }

          .category-card {
            min-height: 220px;
          }

          .products-grid {
            gap: 9px;
          }

          .product-image {
            height: 230px;
          }

          .quick-add {
            display: none;
          }

          .footer {
            grid-template-columns: 1fr 1fr;
            gap: 30px 20px;
          }

          .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }
        }


        /* =====================================================
           ZELORA ULTRA-PREMIUM MOTION LAYER
        ===================================================== */

        .navbar {
          transition:
            background 700ms cubic-bezier(.16,1,.3,1),
            border-color 700ms cubic-bezier(.16,1,.3,1),
            box-shadow 700ms cubic-bezier(.16,1,.3,1),
            backdrop-filter 700ms cubic-bezier(.16,1,.3,1);
        }

        .navbar.zelora-nav-scrolled {
          background: rgba(5,5,5,.72);
          backdrop-filter: blur(22px) saturate(130%);
          border-color: rgba(239,191,4,.16);
          box-shadow: 0 18px 60px rgba(0,0,0,.28);
        }

        .gold-pill,
        .outline-pill,
        .newsletter-form button,
        .hero-arrow,
        .icon-btn,
        .cart-btn,
        .wishlist,
        .socials a,
        .dot {
          will-change: transform;
        }

        .gold-pill,
        .outline-pill {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          border-radius: 9999px;
        }

        .gold-pill::before,
        .outline-pill::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,.5) 48%, transparent 76%);
          transform: translateX(-130%);
          transition: transform 900ms cubic-bezier(.16,1,.3,1);
          pointer-events: none;
          z-index: -1;
        }

        .gold-pill:hover::before,
        .outline-pill:hover::before {
          transform: translateX(130%);
        }

        .gold-pill svg,
        .outline-pill svg,
        .collection-link svg,
        .category-info svg {
          transition: transform 600ms cubic-bezier(.16,1,.3,1);
        }

        .gold-pill:hover svg,
        .outline-pill:hover svg,
        .collection-card:hover .collection-link svg,
        .category-card:hover .category-info svg {
          transform: translate3d(5px,-1px,0);
        }

        .hero {
          isolation: isolate;
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 72% 45%, rgba(239,191,4,.13), transparent 24%),
            radial-gradient(circle at 15% 80%, rgba(255,255,255,.04), transparent 24%);
          mix-blend-mode: screen;
          opacity: .65;
          animation: zeloraHeroAura 9s ease-in-out infinite alternate;
        }

        @keyframes zeloraHeroAura {
          from { transform: scale(1) translate3d(0,0,0); opacity: .42; }
          to { transform: scale(1.08) translate3d(-1%,1%,0); opacity: .78; }
        }

        .hero-content {
          animation: zeloraHeroContent 1.2s cubic-bezier(.16,1,.3,1) both;
        }

        .hero-content > * {
          opacity: 0;
          animation: zeloraHeroItem 1s cubic-bezier(.16,1,.3,1) both;
        }

        .hero-content > *:nth-child(1) { animation-delay: .12s; }
        .hero-content > *:nth-child(2) { animation-delay: .22s; }
        .hero-content > *:nth-child(3) { animation-delay: .34s; }
        .hero-content > *:nth-child(4) { animation-delay: .48s; }

        @keyframes zeloraHeroContent {
          from { opacity: 0; transform: translate3d(-24px,-50%,0); }
          to { opacity: 1; transform: translate3d(0,-50%,0); }
        }

        @keyframes zeloraHeroItem {
          from { opacity: 0; transform: translate3d(0,28px,0); filter: blur(5px); }
          to { opacity: 1; transform: translate3d(0,0,0); filter: blur(0); }
        }

        .hero-image {
          animation: heroZoomPremium 10s cubic-bezier(.16,1,.3,1) both;
          transition: opacity .8s ease, transform 1.2s cubic-bezier(.16,1,.3,1);
        }

        @keyframes heroZoomPremium {
          from { opacity: .35; transform: scale(1.10); filter: saturate(.78) brightness(.72); }
          to { opacity: 1; transform: scale(1.02); filter: saturate(.95) brightness(1); }
        }

        .category-card,
        .collection-card,
        .product-card,
        .testimonial,
        .step {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .category-card,
        .collection-card,
        .product-card,
        .testimonial {
          transition:
            transform 800ms cubic-bezier(.16,1,.3,1),
            border-color 650ms cubic-bezier(.16,1,.3,1),
            box-shadow 700ms cubic-bezier(.16,1,.3,1);
        }

        .category-card:hover,
        .collection-card:hover,
        .product-card:hover,
        .testimonial:hover {
          border-color: rgba(239,191,4,.30);
          box-shadow:
            0 26px 70px rgba(0,0,0,.48),
            0 0 35px rgba(239,191,4,.055);
        }

        .category-card::before,
        .collection-card::before,
        .product-image::before,
        .testimonial::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,.13) 48%, transparent 72%);
          transform: translateX(-130%);
          transition: transform 1.05s cubic-bezier(.16,1,.3,1);
        }

        .category-card:hover::before,
        .collection-card:hover::before,
        .product-card:hover .product-image::before,
        .testimonial:hover::before {
          transform: translateX(130%);
        }

        .category-card::after {
          inset: 8px;
          border-radius: 7px;
          border-color: transparent;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0);
          transition: border-color 700ms ease, box-shadow 700ms ease;
        }

        .category-card:hover::after {
          border-color: rgba(239,191,4,.42);
          box-shadow: inset 0 0 45px rgba(239,191,4,.055);
        }

        .category-card img,
        .collection-card img,
        .product-image img {
          will-change: transform;
        }

        .category-card:hover img,
        .collection-card:hover img {
          filter: saturate(1.08) contrast(1.04);
        }

        .product-card .product-info {
          transition: transform 650ms cubic-bezier(.16,1,.3,1);
        }

        .product-card:hover .product-info {
          transform: translate3d(0,-3px,0);
        }

        .product-info h3,
        .category-info h3,
        .collection-info > p,
        .testimonial > p {
          transition: color 450ms ease, letter-spacing 600ms cubic-bezier(.16,1,.3,1);
        }

        .product-card:hover .product-info h3,
        .category-card:hover .category-info h3,
        .collection-card:hover .collection-info > p {
          letter-spacing: .025em;
        }

        .wishlist {
          border-radius: 9999px;
          transition:
            transform 500ms cubic-bezier(.16,1,.3,1),
            color 300ms ease,
            background 350ms ease,
            border-color 350ms ease;
        }

        .wishlist:hover {
          box-shadow: 0 8px 28px rgba(239,191,4,.2);
        }

        .quick-add {
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 10px 35px rgba(0,0,0,.35);
          backdrop-filter: blur(14px);
        }

        .step-circle {
          position: relative;
          overflow: hidden;
        }

        .step-circle::after {
          content: "";
          position: absolute;
          inset: -60%;
          background: conic-gradient(from 0deg, transparent, rgba(239,191,4,.35), transparent 25%);
          animation: zeloraStepSpin 5s linear infinite;
        }

        @keyframes zeloraStepSpin {
          to { transform: rotate(360deg); }
        }

        .step:hover .step-circle {
          box-shadow: 0 12px 40px rgba(239,191,4,.18), inset 0 0 30px rgba(239,191,4,.06);
        }

        .section-heading {
          position: relative;
        }

        .section-heading > span {
          width: 52px;
          transition: width 800ms cubic-bezier(.16,1,.3,1), box-shadow 600ms ease;
        }

        .section-heading:hover > span {
          width: 105px;
          box-shadow: 0 0 18px rgba(239,191,4,.38);
        }

        .section-heading h2 {
          transition: letter-spacing 800ms cubic-bezier(.16,1,.3,1), transform 700ms cubic-bezier(.16,1,.3,1);
        }

        .section-heading:hover h2 {
          letter-spacing: .12em;
          transform: translateY(-2px);
        }

        .testimonial {
          position: relative;
          overflow: hidden;
        }

        .testimonial .avatar {
          transition: transform 500ms cubic-bezier(.16,1,.3,1), box-shadow 500ms ease;
        }

        .testimonial:hover .avatar {
          transform: scale(1.08) rotate(-5deg);
          box-shadow: 0 8px 28px rgba(239,191,4,.16);
        }

        .socials a,
        .icon-btn,
        .cart-btn,
        .hero-arrow {
          border-radius: 9999px;
        }

        .socials a:hover,
        .icon-btn:hover,
        .cart-btn:hover {
          box-shadow: 0 8px 28px rgba(239,191,4,.14);
        }

        .footer-column a {
          position: relative;
          width: fit-content;
        }

        .footer-column a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 100%;
          bottom: -4px;
          height: 1px;
          background: #EFBF04;
          transition: right 450ms cubic-bezier(.16,1,.3,1);
        }

        .footer-column a:hover::after {
          right: 0;
        }

        .newsletter-form {
          transition: border-color 500ms ease, box-shadow 500ms ease, transform 500ms cubic-bezier(.16,1,.3,1);
        }

        .newsletter-form:focus-within {
          border-color: rgba(239,191,4,.48);
          box-shadow: 0 0 0 5px rgba(239,191,4,.045), 0 16px 45px rgba(0,0,0,.25);
          transform: translateY(-2px);
        }

        .newsletter-form button {
          border-radius: 9999px;
        }

        .zelora-cursor-glow {
          position: fixed;
          left: 0;
          top: 0;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          background: radial-gradient(circle, rgba(239,191,4,.14) 0%, rgba(239,191,4,.045) 32%, transparent 70%);
          filter: blur(12px);
          mix-blend-mode: screen;
          opacity: .78;
          will-change: transform;
        }

        .zelora-reveal {
          opacity: 0;
          transform: translate3d(0,60px,0);
          transition:
            opacity 1100ms cubic-bezier(.16,1,.3,1),
            transform 1100ms cubic-bezier(.16,1,.3,1);
        }

        .zelora-reveal-visible {
          opacity: 1;
          transform: translate3d(0,0,0);
        }

        @media (hover: none), (pointer: coarse) {
          .zelora-cursor-glow { display: none; }
          .zelora-reveal { opacity: 1; transform: none; transition: none; }
          .category-card:hover,
          .collection-card:hover,
          .product-card:hover,
          .testimonial:hover { transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement::before,
          .announcement-message {
            animation: none !important;
          }

          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
          .zelora-cursor-glow { display: none; }
          .zelora-reveal { opacity: 1; transform: none; }
        }

      `}</style>
        

<style jsx>{`
  .navbar-logo,
  .nav-logo,
  .brand-logo,
  .logo span,
  .explore-collection,
  .start-personalizing {
    color: #EFBF04 !important;
  }

  .gold-pill {
    background: #EFBF04 !important;
    border-color: #EFBF04 !important;
    color: #080706 !important;
  }

  .gold-pill:hover,
  .gold-pill:focus-visible,
  .gold-pill:active {
    background: #EFBF04 !important;
    border-color: #EFBF04 !important;
    color: #080706 !important;
  }
`}</style>
</main>
  </>
  );
}