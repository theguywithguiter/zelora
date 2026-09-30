 "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./search.css";

type Product = {
  id: number;
  name: string;
  slug?: string | null;
  category?: unknown;
  price: number;
  stock?: number;
  sku?: string | null;
  image?: string | null;
  description?: unknown;
  images?: Array<{ url: string; position?: number }> | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=88";

function textValue(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;

    for (const key of ["name", "title", "label", "slug", "value", "category"]) {
      if (typeof object[key] === "string") {
        return object[key] as string;
      }
    }
  }

  return fallback;
}

function normalizeProduct(item: any): Product {
  const images = Array.isArray(item?.images)
    ? item.images
        .filter((image: any) => image && typeof image.url === "string")
        .sort(
          (a: any, b: any) =>
            Number(a.position ?? 0) - Number(b.position ?? 0)
        )
    : [];

  return {
    id: Number(item?.id ?? 0),
    name: String(item?.name ?? "ZELORA Piece"),
    slug: typeof item?.slug === "string" ? item.slug : null,
    category: item?.category ?? null,
    price: Number(item?.price ?? 0),
    stock: Number(item?.stock ?? 0),
    sku: typeof item?.sku === "string" ? item.sku : null,
    image:
      typeof item?.image === "string"
        ? item.image
        : images[0]?.url ?? null,
    description: item?.description ?? null,
    images,
  };
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.7" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zelora-wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("zelora-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/admin/products", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            typeof data?.message === "string"
              ? data.message
              : `Failed to load products (${response.status})`
          );
        }

        const rawProducts = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        if (!cancelled) {
          setProducts(
            rawProducts
              .map(normalizeProduct)
              .filter((product: Product) => product.id && product.name)
          );
        }
      } catch (error) {
        console.error("Search products error:", error);

        if (!cancelled) {
          setProducts([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return products.filter((product) => {
      const name = textValue(product.name).toLowerCase();
      const category = textValue(product.category).toLowerCase();
      const description = textValue(product.description).toLowerCase();
      const sku = String(product.sku ?? "").toLowerCase();

      return (
        name.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        sku.includes(normalizedQuery)
      );
    });
  }, [products, normalizedQuery]);

  function toggleWishlist(id: number) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const formatPrice = (price: number) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  return (
    <main className="search-page">
      <section className="search-shell">
        <Link href="/" className="back-link">
          <span>←</span>
          BACK TO ZELORA
        </Link>

        <div className="search-heading">
          <p className="eyebrow">DISCOVER ZELORA</p>
          <h1>
            Find your
            <br />
            <span>signature piece.</span>
          </h1>
          <p className="intro">
            Search our collection for something made to mean more.
          </p>
        </div>

        <div className="search-box-wrap">
          <div className={`search-box ${query ? "has-value" : ""}`}>
            <SearchIcon />
            <input
            suppressHydrationWarning
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search necklaces, bracelets, wallets..."
              aria-label="Search products"
            />

            {query && (
              <button
                type="button"
                className="clear-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="search-meta">
            {loading ? (
              <span>CURATING THE COLLECTION...</span>
            ) : normalizedQuery ? (
              <span>
                {results.length} {results.length === 1 ? "PIECE" : "PIECES"} FOUND
              </span>
            ) : (
              <span>SEARCH BY PRODUCT, CATEGORY OR DETAIL</span>
            )}
          </div>
        </div>

        {!normalizedQuery && !loading && !loadError && (
          <section className="search-intro">
            <div className="intro-mark">✦</div>
            <p>WHAT ARE YOU LOOKING FOR?</p>
            <div className="suggestions">
              {["Necklaces", "Bracelets", "Rings", "Wallets"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                >
                  {term}
                  <ArrowIcon />
                </button>
              ))}
            </div>
          </section>
        )}

        {loadError && !loading && (
          <section className="load-error-state">
            <div className="empty-icon">!</div>
            <p>COLLECTION UNAVAILABLE</p>
            <h2>
              We couldn't load
              <br />
              <span>the collection.</span>
            </h2>
            <small>{loadError}</small>
            <button
              type="button"
              className="browse-button"
              onClick={() => window.location.reload()}
            >
              TRY AGAIN
              <ArrowIcon />
            </button>
          </section>
        )}

        {normalizedQuery && !loading && !loadError && (
          <section className="results-section">
            {results.length > 0 ? (
              <>
                <div className="results-header">
                  <div>
                    <p>SEARCH RESULTS</p>
                    <h2>
                      {results.length}{" "}
                      {results.length === 1 ? "piece" : "pieces"} for{" "}
                      <span>“{query.trim()}”</span>
                    </h2>
                  </div>

                  <Link href="/shop" className="view-all">
                    VIEW ALL PRODUCTS
                    <ArrowIcon />
                  </Link>
                </div>

                <div className="results-grid">
                  {results.map((product, index) => {
                    const isWishlisted = wishlist.includes(product.id);

                    return (
                      <article
                        className="product-card"
                        key={product.id}
                        style={{
                          animationDelay: `${Math.min(index, 9) * 55}ms`,
                        }}
                      >
                        <Link
                          href={`/shop/${product.id}`}
                          className="image-link"
                        >
                          <div className="image-wrap">
                            <img
                              src={product.image || FALLBACK_IMAGE}
                              alt={textValue(product.name, "ZELORA piece")}
                            />

                            <div className="image-shade" />

                            <span className="product-tag">
                              {index < 3 ? "CUSTOMISED" : "CRAFTED"}
                            </span>

                            <button
                              type="button"
                              className={`wishlist ${
                                isWishlisted ? "active" : ""
                              }`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              aria-label={
                                isWishlisted
                                  ? `Remove ${product.name} from wishlist`
                                  : `Add ${product.name} to wishlist`
                              }
                            >
                              <HeartIcon />
                            </button>

                            <div className="view-piece">
                              VIEW PIECE
                              <ArrowIcon />
                            </div>
                          </div>
                        </Link>

                        <div className="product-info">
                          <div>
                            <p className="category">
                              {textValue(product.category, "ZELORA")}
                            </p>
                            <h3>{textValue(product.name)}</h3>
                          </div>

                          <strong>{formatPrice(product.price)}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⌕</div>
                <p>NOTHING FOUND</p>
                <h2>
                  We couldn't find
                  <br />
                  <span>“{query.trim()}”</span>
                </h2>
                <small>
                  Try another product name, category or keyword.
                </small>
                <button
                  type="button"
                  className="browse-button"
                  onClick={() => setQuery("")}
                >
                  EXPLORE THE COLLECTION
                  <ArrowIcon />
                </button>
              </div>
            )}
          </section>
        )}
      </section>

    </main>
  );
}
