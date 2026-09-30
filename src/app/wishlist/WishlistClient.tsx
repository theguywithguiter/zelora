"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./WishlistPage.module.css";

type WishlistProduct = {
  id: number;
  name: string;
  slug?: string | null;
  price: number;
  stock?: number | null;
  image?: string | null;
  images?: Array<{ url: string; position?: number }> | null;
};

type WishlistItem = {
  id: number;
  productId: number;
  product: WishlistProduct;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const response = await fetch("/api/accounts/wishlist", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/account/login";
          return;
        }

        const data = await response.json();

        if (!response.ok || data?.success !== true) {
          throw new Error(
            data?.message || "Unable to load your wishlist."
          );
        }

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (error) {
        console.error("ZELORA wishlist page error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  async function removeItem(productId: number) {
    if (removingId !== null) return;

    setRemovingId(productId);

    try {
      const response = await fetch(
        `/api/accounts/wishlist?productId=${encodeURIComponent(String(productId))}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 401) {
        window.location.href = "/account/login";
        return;
      }

      const data = await response.json();

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message || "Unable to remove this piece."
        );
      }

      setItems((current) =>
        current.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("ZELORA wishlist remove error:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to remove this piece."
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.orb} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>ZELORA / COLLECTION</p>
            <h1 className={styles.title}>
              Your <em>wishlist.</em>
            </h1>
            <p className={styles.subtitle}>
              Pieces you have chosen to keep close.
            </p>
          </div>
          

          <Link href="/accounts" className={styles.continue}>
            Back to Accounts
            <span aria-hidden="true">←</span>
          </Link>
        </header>

        <section className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.loadingDot} />
              <span>Loading your saved pieces</span>
            </div>
          ) : !items.length ? (
            <div className={styles.empty}>
              <div className={styles.emptyMark} aria-hidden="true">
                ♡
              </div>

              <p className={styles.emptyEyebrow}>NOTHING SAVED YET</p>

              <h2>Your wishlist is waiting.</h2>

              <p>
                Save the pieces that feel like you. They will stay here
                until you are ready.
              </p>

              <Link href="/shop" className={styles.shopButton}>
                Discover ZELORA
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.collectionBar}>
                <div>
                  <span className={styles.collectionLabel}>
                    SAVED PIECES
                  </span>
                  <strong>
                    {String(items.length).padStart(2, "0")}
                  </strong>
                </div>

                <span className={styles.collectionHint}>
                  Your personal selection
                </span>
              </div>

              <div className={styles.grid}>
                {items.map((item, index) => {
                  const product = item.product;
                  const image =
                    product.image ||
                    product.images?.[0]?.url ||
                    null;
                  const outOfStock =
                    Number(product.stock ?? 0) <= 0;

                  return (
                    <article
                      className={styles.card}
                      key={item.id}
                      style={
                        {
                          "--delay": `${Math.min(index, 8) * 70}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <Link
                        href={`/shop/${product.id}`}
                        className={styles.imageLink}
                        aria-label={`View ${product.name}`}
                      >
                        <div className={styles.image}>
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                            />
                          ) : (
                            <div className={styles.imageFallback}>
                              ZELORA
                            </div>
                          )}

                          <div className={styles.imageShade} />

                          <span className={styles.savedBadge}>
                            SAVED
                          </span>

                          {outOfStock && (
                            <span className={styles.stockBadge}>
                              SOLD OUT
                            </span>
                          )}

                          <span className={styles.viewHint}>
                            View piece <span>→</span>
                          </span>
                        </div>
                      </Link>

                      <div className={styles.cardBody}>
                        <div className={styles.cardTop}>
                          <div>
                            <h2>{product.name}</h2>
                            <p>Personalized piece</p>
                          </div>

                          <strong>
                            ₹
                            {Number(product.price || 0).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                        <div className={styles.cardActions}>
                          <Link
                            href={`/shop/${product.id}`}
                            className={styles.viewButton}
                          >
                            View piece
                            <span aria-hidden="true">→</span>
                          </Link>

                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => removeItem(item.productId)}
                            disabled={removingId === item.productId}
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            {removingId === item.productId
                              ? "Removing…"
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
