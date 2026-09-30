 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProductPage.module.css";

type Product = {
  id: number;
  name: string;
  slug?: string | null;
  category?: string | null;
  price: number;
  stock?: number | null;
  image?: string | null;
  description?: string | null;
  images?: Array<{ url: string; position?: number }> | null;
  personalization?: {
    enabled?: boolean;
    fields?: Array<{
      id: string;
      type: "text" | "select" | "image";
      label: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
      options?: string[];
    }>;
  } | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Personalized Black Bracelet",
    category: "Bracelets",
    price: 1299,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=90",
  },
  {
    id: 2,
    name: "Classic Leather Wallet",
    category: "Wallets",
    price: 1899,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1400&q=90",
  },
  {
    id: 3,
    name: "Engraved Bar Necklace",
    category: "Necklaces & Pendants",
    price: 1499,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=90",
  },
  {
    id: 4,
    name: "Black Gold Ring",
    category: "Rings",
    price: 1199,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=90",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.6Z"
        fill={filled ? "currentColor" : "none"}
      />
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

function normalizeProduct(item: any): Product {
  return {
    id: Number(item?.id ?? 0),
    name: String(item?.name ?? "ZELORA Piece"),
    slug: typeof item?.slug === "string" ? item.slug : null,
    category:
      typeof item?.category === "string"
        ? item.category
        : String(item?.category?.name ?? "Accessories"),
    price: Number(item?.price ?? 0),
    stock: Number(item?.stock ?? 0),
    image: typeof item?.image === "string" ? item.image : null,
    description:
      typeof item?.description === "string" ? item.description : null,
    images: Array.isArray(item?.images)
      ? item.images
          .filter((x: any) => x && typeof x.url === "string")
          .sort(
            (a: any, b: any) =>
              Number(a.position ?? 0) - Number(b.position ?? 0)
          )
      : null,
    personalization:
      item?.personalization && typeof item.personalization === "object"
        ? item.personalization
        : { enabled: false, fields: [] },
  };
}

function magneticMove(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;

  element.style.setProperty("--mag-x", `${x}px`);
  element.style.setProperty("--mag-y", `${y}px`);
}

function magneticLeave(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.style.setProperty("--mag-x", "0px");
  element.style.setProperty("--mag-y", "0px");
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params?.id ?? "");
  const pageRef = useRef<HTMLElement | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [personalizationValues, setPersonalizationValues] =
    useState<Record<string, string>>({});
  const [personalizationImages, setPersonalizationImages] =
    useState<Record<string, string>>({});
  const [uploadingPersonalizationImage, setUploadingPersonalizationImage] =
    useState<Record<string, boolean>>({});
  const [wishlist, setWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const direct = await fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        });

        if (direct.ok) {
          const data = await direct.json();
          const found = data?.product ?? data;

          if (!cancelled && found?.id) {
            setProduct(normalizeProduct(found));
          }
        }

        const listResponse = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        if (listResponse.ok) {
          const data = await listResponse.json();
          const raw = Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
              ? data.products
              : [];

          const normalized = raw
            .map((item: any) => normalizeProduct(item?.product ?? item))
            .filter((item: Product) => item.id && item.name);

          if (!cancelled) {
            setAllProducts(normalized);

            const found = normalized.find(
              (item: Product) =>
                String(item.id) === productId || item.slug === productId
            );

            if (found) setProduct(found);
          }
        }

        if (!cancelled) {
          setProduct((current) => {
            if (current) return current;

            return (
              FALLBACK_PRODUCTS.find(
                (item) => String(item.id) === productId
              ) ?? null
            );
          });
        }
      } catch (error) {
        console.error("ZELORA product error:", error);

        if (!cancelled) {
          setProduct(
            FALLBACK_PRODUCTS.find(
              (item) => String(item.id) === productId
            ) ?? null
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    async function loadWishlistState() {
      try {
        const response = await fetch("/api/accounts/wishlist", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const items = Array.isArray(data?.items) ? data.items : [];

        if (!cancelled) {
          setWishlist(
            items.some(
              (item: any) =>
                Number(item?.productId) === Number(productId)
            )
          );
        }
      } catch (error) {
        console.error("ZELORA wishlist state error:", error);
      }
    }

    loadWishlistState();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleWishlist() {
    if (!product) return;

    if (wishlistBusy) return;

    setWishlistBusy(true);

    try {
      const response = wishlist
        ? await fetch(
            `/api/accounts/wishlist?productId=${encodeURIComponent(
              String(product.id)
            )}`,
            {
              method: "DELETE",
            }
          )
        : await fetch("/api/accounts/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product.id,
            }),
          });

      if (response.status === 401) {
        router.push("/account/login");
        return;
      }

      const data = await response.json();

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message || "Unable to update wishlist."
        );
      }

      setWishlist(!wishlist);
    } catch (error) {
      console.error("ZELORA wishlist error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to update wishlist."
      );
    } finally {
      setWishlistBusy(false);
    }
  }

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  const images = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE];

    const combined = [
      ...(product.image ? [product.image] : []),
      ...(product.images ?? []).map((item) => item.url),
    ].filter(Boolean) as string[];

    const unique = Array.from(new Set(combined));

    return unique.length ? unique : [FALLBACK_IMAGE];
  }, [product]);

  const personalizationFields = useMemo(
    () =>
      product?.personalization?.enabled
        ? product.personalization.fields ?? []
        : [],
    [product]
  );

  function setPersonalizationValue(fieldId: string, value: string) {
    setPersonalizationValues((current) => ({
      ...current,
      [fieldId]: value,
    }));
  }

  async function handlePersonalizationImage(
    fieldId: string,
    file: File | null
  ) {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      window.alert("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert("Image must be 10 MB or smaller.");
      return;
    }

    setUploadingPersonalizationImage((current) => ({
      ...current,
      [fieldId]: true,
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "personalization");

      const response = await fetch("/api/personalization-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.message || "Image upload failed.");
      }

      setPersonalizationImages((current) => ({
        ...current,
        [fieldId]: String(data.url),
      }));
    } catch (error) {
      console.error("Personalization image upload error:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to upload the image."
      );
    } finally {
      setUploadingPersonalizationImage((current) => ({
        ...current,
        [fieldId]: false,
      }));
    }
  }

  function removePersonalizationImage(fieldId: string) {
    setPersonalizationImages((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  }

  function getPersonalizationSummary() {
    return personalizationFields
      .map((field) => {
        if (field.type === "image") {
          return personalizationImages[field.id]
            ? `${field.label}: Image uploaded`
            : "";
        }

        const value = personalizationValues[field.id]?.trim();
        return value ? `${field.label}: ${value}` : "";
      })
      .filter(Boolean)
      .join(" • ");
  }

  function getPersonalizationData() {
    return JSON.stringify(
      personalizationFields
        .map((field) => ({
          id: field.id,
          label: field.label,
          type: field.type,
          value:
            field.type === "image"
              ? personalizationImages[field.id] || ""
              : personalizationValues[field.id]?.trim() || "",
        }))
        .filter((field) => field.value)
    );
  }

  const related = useMemo(() => {
    const source = allProducts.length ? allProducts : FALLBACK_PRODUCTS;

    return source
      .filter((item) => String(item.id) !== String(product?.id))
      .slice(0, 4);
  }, [allProducts, product?.id]);

  const stock = Number(product?.stock ?? 0);
  const outOfStock = stock <= 0;
  const price = Number(product?.price ?? 0);
  const formattedPrice = price.toLocaleString("en-IN");

  async function addToCart(goToCart = false) {
    if (!product || outOfStock) return;

    try {
      const authCheck = await fetch("/api/accounts/wishlist", {
        cache: "no-store",
      });

      if (authCheck.status === 401) {
        router.push("/account/login");
        return;
      }
    } catch (error) {
      console.error("ZELORA authentication check error:", error);
      return;
    }

    const missingRequired = personalizationFields.find((field) => {
      if (!field.required) return false;
      return field.type === "image"
        ? !personalizationImages[field.id]
        : !personalizationValues[field.id]?.trim();
    });

    if (missingRequired) {
      window.alert(`${missingRequired.label} is required.`);
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("zelora-cart") || "[]");
      const personalizationSummary = getPersonalizationSummary();

      const index = cart.findIndex(
        (item: any) =>
          Number(item.id) === Number(product.id) &&
          String(item.personalization || "") === personalizationSummary
      );

      if (index >= 0) {
        cart[index].quantity += quantity;

        // Keep the complete personalization payload with the cart item.
        // This is especially important for uploaded customer images.
        cart[index].personalization = personalizationSummary;
        cart[index].personalizationData = getPersonalizationData();
        cart[index].personalizationImageUrl =
          personalizationFields
            .filter((field) => field.type === "image")
            .map((field) => personalizationImages[field.id] || "")
            .find(Boolean) || "";
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: images[0],
          quantity,
          personalization: personalizationSummary,
          personalizationData: getPersonalizationData(),
          personalizationImageUrl:
            personalizationFields.find((field) => field.type === "image")
              ? personalizationFields
                  .filter((field) => field.type === "image")
                  .map((field) => personalizationImages[field.id] || "")
                  .find(Boolean) || ""
              : "",
        });
      }

      localStorage.setItem("zelora-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("zelora-cart-updated"));

      if (goToCart) {
        router.push("/cart");
        return;
      }

      setAdded(true);
      window.setTimeout(() => setAdded(false), 2200);
    } catch (error) {
      console.error("Cart error:", error);
    }
  }

  function moveImage(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

    setImageOffset({ x, y });
  }

  function resetImage() {
    setImageOffset({ x: 0, y: 0 });
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null || images.length <= 1) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = endX - touchStartX;

    if (Math.abs(distance) >= 45) {
      setSelectedImage((current) => {
        if (distance < 0) return (current + 1) % images.length;
        return (current - 1 + images.length) % images.length;
      });
    }

    setTouchStartX(null);
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.skeletonShell}>
          <div className={styles.skeletonNav} />
          <div className={styles.skeletonGrid}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonInfo}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <span>ZELORA</span>
          <h1>This piece has moved.</h1>
          <p>The product could not be found.</p>

          <Link
            href="/shop"
            className={styles.goldPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            Back to shop <ArrowIcon />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={pageRef}
      className={styles.page}
      style={
        {
          "--cursor-x": `${cursor.x}px`,
          "--cursor-y": `${cursor.y}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.ambient} />
      <div className={styles.cursorGlow} />
      <div className={styles.grain} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            ZELORA
            <small>CRAFTED FOR EVERY STORY</small>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/shop" className={styles.activeNav}>
              Shop
            </Link>
            <Link href="/#story">Our Story</Link>
          </nav>

          <Link
            href="/cart"
            className={styles.bagPill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            Bag <span>→</span>
          </Link>
        </div>
      </header>

      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <em>{product.name}</em>
      </div>

      <section className={styles.productSection}>
        <div className={styles.gallery}>
          <div
            className={styles.heroImage}
            onMouseMove={moveImage}
            onMouseLeave={resetImage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              style={{
                transform: `scale(1.055) translate3d(${imageOffset.x}px, ${imageOffset.y}px, 0)`,
              }}
            />

            <div className={styles.imageShade} />
            <div className={styles.imageSweep} />
            <div className={styles.imageVignette} />

            <button
              type="button"
              className={`${styles.wishlist} ${
                wishlist ? styles.wishlistActive : ""
              }`}
              onClick={handleWishlist}
              aria-label={
                wishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              disabled={wishlistBusy}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
            >
              <HeartIcon filled={wishlist} />
            </button>

            <div className={styles.imageLabel}>
              {product.category || "ZELORA"}
            </div>

            <div className={styles.imageCounter}>
              {String(selectedImage + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
              {images.length > 1 && <small>SWIPE</small>}
            </div>
          </div>

          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={index === selectedImage ? styles.thumbActive : ""}
                onClick={() => setSelectedImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <div className={`${styles.eyebrow} ${styles.reveal1}`}>
            <span />
            {product.category || "THE ZELORA EDIT"}
          </div>

          <h1 className={styles.reveal2}>{product.name}</h1>

          <div className={`${styles.rating} ${styles.reveal3}`}>
            <strong>★★★★★</strong>
            <span>4.9 · 127 reviews</span>
          </div>

          <div className={`${styles.priceRow} ${styles.reveal4}`}>
            <strong>₹{formattedPrice}</strong>
            <span className={outOfStock ? styles.soldOut : styles.inStock}>
              {outOfStock
                ? "OUT OF STOCK"
                : stock <= 5
                  ? `ONLY ${stock} LEFT`
                  : "IN STOCK"}
            </span>
          </div>

          <div className={`${styles.description} ${styles.reveal5}`}>
            {product.description ||
              "A piece made to carry something personal. Designed with a timeless silhouette and crafted to become part of your story."}
          </div>

          {personalizationFields.length > 0 && (
            <div className={`${styles.personalize} ${styles.reveal6}`}>
  {/* MAIN PERSONALIZATION HEADING — KEEP ONLY THIS ONE */}
  <div className={styles.fieldHeading}>
    <div>
      <span>CUSTOMISE YOUR PIECE</span>
      <p> </p> 
      <div>
      </div>
      
    </div>
    <small>REQUIRED FIELDS MARKED *</small>
  </div>

  <div className={styles.personalizationStack}>
    {personalizationFields.map((field) => {
      const value = personalizationValues[field.id] || "";

      return (
        <div
          className={styles.personalizationField}
          key={field.id}
        >
          {/* FIELD LABEL */}
          {field.label &&
            field.label.toUpperCase() !== "PERSONALIZATION" && (
              <label>
                {field.label}
                {field.required ? " *" : ""}
              </label>
            )}

          {/* IMAGE UPLOAD */}
{field.type === "image" ? (
  <div className={styles.imageUploadField}>
    {personalizationImages[field.id] ? (
      <div className={styles.imageUploadPreview}>
        <div className={styles.imageUploadPreviewFrame}>
          <img
            src={personalizationImages[field.id]}
            alt="Your uploaded customization"
          />

          <div className={styles.imageUploadPreviewOverlay}>
            <span>UPLOADED</span>
          </div>
        </div>

        <div className={styles.imageUploadPreviewMeta}>
          <div>
            <strong>Customization image</strong>
            <span>Ready to use with your order</span>
          </div>

          <div className={styles.imageUploadActions}>
            <label className={styles.imageUploadReplace}>
              Replace

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                disabled={uploadingPersonalizationImage[field.id]}
                onChange={(event) => {
                  handlePersonalizationImage(
                    field.id,
                    event.target.files?.[0] || null
                  );

                  event.target.value = "";
                }}
              />
            </label>

            <button
              type="button"
              className={styles.imageUploadRemove}
              onClick={() =>
                removePersonalizationImage(field.id)
              }
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    ) : (
      <label
        className={`${styles.imageUploadZone} ${
          uploadingPersonalizationImage[field.id]
            ? styles.imageUploadZoneLoading
            : ""
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          disabled={uploadingPersonalizationImage[field.id]}
          onChange={(event) => {
            handlePersonalizationImage(
              field.id,
              event.target.files?.[0] || null
            );

            event.target.value = "";
          }}
        />

        <span className={styles.imageUploadIcon}>
          ↑
        </span>

        <span className={styles.imageUploadTitle}>
          {uploadingPersonalizationImage[field.id]
            ? "Uploading image"
            : "Upload your image"}
        </span>

        <span className={styles.imageUploadDescription}>
          {uploadingPersonalizationImage[field.id]
            ? "Please wait while we prepare your image."
            : "Click to browse or drag & drop your image here"}
        </span>

        <span className={styles.imageUploadFormats}>
          JPG · PNG · WEBP <i /> MAX 10 MB
        </span>

        {!uploadingPersonalizationImage[field.id] && (
          <span className={styles.imageUploadButton}>
            Choose image
          </span>
        )}

        {uploadingPersonalizationImage[field.id] && (
          <span className={styles.imageUploadProgress}>
            <i />
            <i />
            <i />
          </span>
        )}
      </label>
    )}
  </div>

          ) : field.type === "select" ? (
            <div className={styles.inputWrap}>
              <select
                value={value}
                onChange={(event) =>
                  setPersonalizationValue(field.id, event.target.value)
                }
              >
                <option value="">
                  {field.placeholder || `Choose ${field.label}`}
                </option>
                {(field.options ?? []).map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className={styles.inputWrap}>
              <input
                value={value}
                onChange={(event) =>
                  setPersonalizationValue(field.id, event.target.value)
                }
                maxLength={field.maxLength || 30}
                placeholder={field.placeholder || `${field.label}...`}
              />
              <span>
                {value.length}/{field.maxLength || 30}
              </span>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
          )}

          <div className={`${styles.quantityRow} ${styles.reveal7}`}>
            <span>QUANTITY</span>

            <div className={styles.quantity}>
              <button
                type="button"
                onClick={() =>
                  setQuantity((value) => Math.max(1, value - 1))
                }
                aria-label="Decrease quantity"
                onMouseMove={magneticMove}
                onMouseLeave={magneticLeave}
              >
                <MinusIcon />
              </button>

              <strong key={quantity} className={styles.quantityValue}>
                {quantity}
              </strong>

              <button
                type="button"
                disabled={outOfStock || quantity >= stock}
                onClick={() =>
                  setQuantity((value) =>
                    Math.min(stock || 99, value + 1)
                  )
                }
                aria-label="Increase quantity"
                onMouseMove={magneticMove}
                onMouseLeave={magneticLeave}
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          <div className={`${styles.ctaGrid} ${styles.reveal8}`}>
            <button
              type="button"
              className={styles.primaryCta}
              disabled={outOfStock}
              onClick={() => addToCart(false)}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
            >
              <span>{added ? "Added to bag ✓" : "Add to bag"}</span>
              {!added && <ArrowIcon />}
              <i />
              <b />
            </button>

            <button
              type="button"
              className={styles.secondaryCta}
              disabled={outOfStock}
              onClick={() => addToCart(true)}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
            >
              Buy now
            </button>
          </div>

          <div className={`${styles.trust} ${styles.reveal9}`}>
            <div>
              <strong>CRAFTED</strong>
              <span>With care</span>
            </div>
            <div>
              <strong>SECURE</strong>
              <span>Checkout</span>
            </div>
            <div>
              <strong>PREMIUM</strong>
              <span>Packaging</span>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.detailsButton} ${styles.reveal10}`}
            onClick={() => setDetailsOpen((value) => !value)}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            <span>PRODUCT DETAILS</span>
            <b className={detailsOpen ? styles.plusOpen : ""}>+</b>
          </button>

          <div
            className={`${styles.detailsPanel} ${
              detailsOpen ? styles.detailsOpen : ""
            }`}
          >
            <div>
              <p>
                Designed for everyday wear and made to become part of your
                story. Personalization details are prepared according to the
                options available for this piece.
              </p>
              <p>
                Please review your personalization carefully before placing
                your order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.sectionHead}>
          <div>
            <span>COMPLETE YOUR STORY</span>
            <h2>YOU MAY ALSO LIKE</h2>
          </div>

          <Link
            href="/shop"
            className={styles.outlinePill}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
          >
            View all <ArrowIcon />
          </Link>
        </div>

        <div className={styles.relatedGrid}>
          {related.map((item, index) => (
            <Link
              href={`/shop/${item.id}`}
              className={styles.relatedCard}
              key={item.id}
              style={{ "--card-index": index } as React.CSSProperties}
            >
              <div className={styles.relatedImage}>
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                />
                <div />
                <span>VIEW PIECE</span>
              </div>

              <span>{item.category || "ZELORA"}</span>

              <div>
                <h3>{item.name}</h3>
                <strong>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalOrb} />
        <span>MADE FOR YOU</span>
        <h2>
          YOUR STORY.
          <br />
          <em>YOUR WAY.</em>
        </h2>
        <p>
          Every ZELORA piece is designed to mean something. Make it personal
          and make it yours.
        </p>

        <Link
          href="/shop"
          className={styles.goldPill}
          onMouseMove={magneticMove}
          onMouseLeave={magneticLeave}
        >
          Explore ZELORA <ArrowIcon />
        </Link>
      </section>

      <footer className={styles.footer}>
        <strong>ZELORA</strong>
        <span>CRAFTED FOR EVERY STORY.</span>
        <Link href="/">Back home ↑</Link>
      </footer>

      <div className={styles.mobileBar}>
        <div>
          <span>{product.name}</span>
          <strong>₹{formattedPrice}</strong>
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addToCart(false)}
          onMouseMove={magneticMove}
          onMouseLeave={magneticLeave}
        >
          {added ? "Added ✓" : "Add to bag"}
        </button>
      </div>
    </main>
  );
}
