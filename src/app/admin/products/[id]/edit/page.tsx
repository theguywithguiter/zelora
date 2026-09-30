"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug?: string;
};

type PersonalizationField = {
  id: string;
  type: "text" | "select" | "image";
  label: string;
  placeholder: string;
  required: boolean;
  maxLength: number;
  options: string[];
};

type Personalization = {
  enabled: boolean;
  fields: PersonalizationField[];
};

type ProductImage = {
  id?: number;
  url: string;
  alt?: string | null;
  position?: number;
};

type Product = {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  images?: ProductImage[];
  price: number;
  stock: number;
  sku?: string | null;

  category?: {
    id: number;
    name: string;
  } | null;

  personalization?: Personalization;
};

const emptyPersonalization: Personalization = {
  enabled: false,
  fields: [],
};

function normalizePersonalization(
  value: unknown
): Personalization {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return emptyPersonalization;
  }

  const data = value as Partial<Personalization>;

  return {
    enabled: data.enabled === true,
    fields: Array.isArray(data.fields)
      ? data.fields.map(
          (field, index) => ({
            id:
              field.id ||
              `field-${index + 1}`,

            type:
              field.type === "select"
                ? "select"
                : field.type === "image"
                  ? "image"
                  : "text",

            label:
              field.label ||
              "Personalization",

            placeholder:
              field.placeholder || "",

            required:
              Boolean(field.required),

            maxLength:
              field.type === "text" && Number(field.maxLength) > 0
                ? Number(field.maxLength)
                : field.type === "text"
                  ? 30
                  : 0,

            options:
              Array.isArray(field.options)
                ? field.options.filter(
                    (option) =>
                      typeof option ===
                      "string"
                  )
                : [],
          })
      )
      : [],
  };
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;

  const id = Array.isArray(rawId)
    ? rawId[0]
    : rawId;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [sku, setSku] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState("");

  const [images, setImages] =
    useState<string[]>([]);

  const [personalization, setPersonalization] =
    useState<Personalization>(
      emptyPersonalization
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load categories.");
        }

        if (!cancelled) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch (err) {
        console.error("LOAD CATEGORIES ERROR:", err);
        if (!cancelled) {
          setCategories([]);
          setCategoriesError(
            err instanceof Error ? err.message : "Unable to load categories."
          );
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/products/${id}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load product."
          );
        }

        const item =
          data?.product || data;

        if (cancelled) return;

        setProduct(item);

        setName(item.name || "");
        setSlug(item.slug || "");
        setSku(item.sku || "");
        setDescription(
          item.description || ""
        );

        setPrice(
          String(item.price ?? "")
        );

        setStock(
          String(item.stock ?? "")
        );

        setCategory(
          item.category?.name || ""
        );

        const loadedImages =
          Array.isArray(item.images)
            ? item.images
                .map(
                  (image: ProductImage) =>
                    image.url
                )
                .filter(Boolean)
            : item.image
              ? [item.image]
              : [];

        setImages(loadedImages);

        setPersonalization(
          normalizePersonalization(
            item.personalization
          )
        );
      } catch (err) {
        console.error(
          "LOAD EDIT PRODUCT ERROR:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateImage(
    index: number,
    value: string
  ) {
    setImages((current) =>
      current.map((image, i) =>
        i === index ? value : image
      )
    );
  }

  function addImage() {
    setImages((current) => [
      ...current,
      "",
    ]);
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  function updateField(
    index: number,
    changes: Partial<PersonalizationField>
  ) {
    setPersonalization(
      (current) => ({
        ...current,

        fields: current.fields.map(
          (field, i) =>
            i === index
              ? {
                  ...field,
                  ...changes,
                }
              : field
        ),
      })
    );
  }

  function addPersonalizationField() {
    setPersonalization(
      (current) => ({
        ...current,

        enabled: true,

        fields: [
          ...current.fields,

          {
            id: `field-${Date.now()}`,
            type: "text",
            label: "Personalization",
            placeholder:
              "Enter your text",
            required: false,
            maxLength: 30,
            options: [],
          },
        ],
      })
    );
  }

  function removePersonalizationField(
    index: number
  ) {
    setPersonalization(
      (current) => ({
        ...current,

        fields:
          current.fields.filter(
            (_, i) => i !== index
          ),
      })
    );
  }

  function updateOption(
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) {
    setPersonalization(
      (current) => ({
        ...current,

        fields: current.fields.map(
          (field, i) => {
            if (i !== fieldIndex) {
              return field;
            }

            return {
              ...field,

              options:
                field.options.map(
                  (option, oi) =>
                    oi === optionIndex
                      ? value
                      : option
                ),
            };
          }
        ),
      })
    );
  }

  function addOption(fieldIndex: number) {
    setPersonalization(
      (current) => ({
        ...current,

        fields: current.fields.map(
          (field, i) =>
            i === fieldIndex
              ? {
                  ...field,
                  options: [
                    ...field.options,
                    "",
                  ],
                }
              : field
        ),
      })
    );
  }

  function removeOption(
    fieldIndex: number,
    optionIndex: number
  ) {
    setPersonalization(
      (current) => ({
        ...current,

        fields: current.fields.map(
          (field, i) =>
            i === fieldIndex
              ? {
                  ...field,
                  options:
                    field.options.filter(
                      (_, oi) =>
                        oi !== optionIndex
                    ),
                }
              : field
        ),
      })
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id) {
      setError(
        "Invalid product ID."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const cleanImages =
        images
          .map((image) =>
            image.trim()
          )
          .filter(Boolean);

      const cleanPersonalization = {
        enabled:
          personalization.enabled,

        fields:
          personalization.fields.map(
            (field) => ({
              ...field,

              label:
                field.label.trim(),

              placeholder:
                field.placeholder.trim(),

              options:
                field.type === "select"
                  ? field.options
                      .map((option) =>
                        option.trim()
                      )
                      .filter(Boolean)
                  : [],
            })
          ),
      };

      const response = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            sku: sku.trim().toUpperCase(),
            description:
              description.trim(),

            images: cleanImages,

            image:
              cleanImages[0] || "",

            price: Number(price),
            stock: Number(stock),

            category:
              category.trim(),

            personalization:
              cleanPersonalization,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update product."
        );
      }

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (err) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="zelora-admin">
        <main>
          <div className="admin-loading">
            Loading product
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="zelora-admin">
        <main>
          <div className="empty-state">

            <h2>
              Product not found
            </h2>

            <p>
              {error ||
                "This product could not be found."}
            </p>

            <Link
              href="/admin/products"
              className="admin-primary"
            >
              ← Back to Products
            </Link>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="zelora-admin zelora-edit-product-page">

      <main>

        <div className="admin-page-header">

          <Link
            href="/admin/products"
            className="admin-secondary"
          >
            ← Back to Products
          </Link>

          <p className="admin-eyebrow">
            ZELORA ADMIN / PRODUCTS
          </p>

          <h1 className="admin-page-title">
            Edit Product
          </h1>

          <p className="admin-page-description">
            Update product information,
            images, inventory and
            personalization.
          </p>

        </div>

        {error && (
          <div className="products-error">
            <div>
              <strong>
                Unable to save product
              </strong>

              <span>
                {error}
              </span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>
                Basic Information
              </h2>

              <p>
                Main product information.
              </p>
            </div>

            <div
              className="form-grid"
              style={{
                padding: "24px",
              }}
            >

              <div>
                <label>
                  Product Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>
                  Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-grid-full">
                <label>
                  SKU
                </label>

                <input
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. ZELORA-BRC-001"
                  maxLength={100}
                  required
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "7px",
                    color: "var(--admin-muted)",
                    fontSize: "11px",
                  }}
                >
                  Internal product code. Only visible in the admin panel and orders.
                </small>
              </div>

              <div className="form-grid-full">
                <label>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="edit-product-category">
                  Category
                </label>

                <select
                  id="edit-product-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  disabled={categoriesLoading || categories.length === 0}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : categories.length === 0
                        ? "No categories available"
                        : "Select a category"}
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {categoriesError && (
                  <small style={{ color: "#e29b9b" }}>
                    {categoriesError}
                  </small>
                )}
              </div>

            </div>
          </section>

          {/* IMAGES */}

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>
                Product Images
              </h2>

              <p>
                Manage the images shown
                on the product page.
              </p>
            </div>

            <div
              style={{
                padding: "24px",
              }}
            >

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                }}
              >

                {images.length === 0 && (
                  <div className="empty-state">
                    <p>
                      No product images.
                    </p>
                  </div>
                )}

                {images.map(
                  (image, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "90px minmax(0, 1fr) auto",
                        gap: "14px",
                        alignItems:
                          "center",
                      }}
                    >

                      <div
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius:
                            "12px",
                          overflow: "hidden",
                          border:
                            "1px solid var(--admin-border)",
                          background:
                            "#111",
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height:
                                "100%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              color:
                                "var(--admin-muted)",
                            }}
                          >
                            ◇
                          </div>
                        )}
                      </div>

                      <div>
                        <label>
                          Image {index + 1}
                        </label>

                        <input
                          value={image}
                          onChange={(e) =>
                            updateImage(
                              index,
                              e.target.value
                            )
                          }
                          placeholder="Image URL"
                        />
                      </div>

                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>

              <button
                type="button"
                className="admin-secondary"
                style={{
                  marginTop: "18px",
                }}
                onClick={addImage}
              >
                + Add Image
              </button>

            </div>
          </section>

          {/* PRICE / STOCK */}

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>
                Pricing & Inventory
              </h2>

              <p>
                Manage price and stock.
              </p>
            </div>

            <div
              className="form-grid"
              style={{
                padding: "24px",
              }}
            >

              <div>
                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

            </div>
          </section>

          {/* PERSONALIZATION */}

          <section className="admin-card">

            <div className="admin-card-header">

              <h2>
                Personalization
              </h2>

              <p>
                Choose what customers can
                customize.
              </p>

            </div>

            <div
              style={{
                padding: "24px",
              }}
            >

              <button
                type="button"
                className={
                  personalization.enabled
                    ? "admin-primary"
                    : "admin-secondary"
                }
                onClick={() =>
                  setPersonalization(
                    (current) => ({
                      ...current,
                      enabled:
                        !current.enabled,
                    })
                  )
                }
              >
                {personalization.enabled
                  ? "Personalization Enabled"
                  : "Enable Personalization"}
              </button>

              {personalization.enabled && (
                <div
                  style={{
                    marginTop: "20px",
                    display: "grid",
                    gap: "14px",
                  }}
                >

                  {personalization.fields.map(
                    (
                      field,
                      fieldIndex
                    ) => (

                      <div
                        key={field.id}
                        style={{
                          padding:
                            "18px",
                          border:
                            "1px solid var(--admin-border)",
                          borderRadius:
                            "14px",
                          background:
                            "rgba(255,255,255,0.018)",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: "12px",
                          }}
                        >

                          <strong>
                            Field{" "}
                            {fieldIndex + 1}
                          </strong>

                          <button
                            type="button"
                            className="admin-danger"
                            onClick={() =>
                              removePersonalizationField(
                                fieldIndex
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                        <div
                          className="form-grid"
                          style={{
                            marginTop:
                              "16px",
                          }}
                        >

                          <div>
                            <label>
                              Field Label
                            </label>

                            <input
                              value={
                                field.label
                              }
                              onChange={(
                                e
                              ) =>
                                updateField(
                                  fieldIndex,
                                  {
                                    label:
                                      e
                                        .target
                                        .value,
                                  }
                                )
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Field Type
                            </label>

                            <select
                              value={
                                field.type
                              }
                              onChange={(
                                e
                              ) => {
                                const type =
                                  e.target
                                    .value ===
                                  "select"
                                    ? "select"
                                    : "text";

                                updateField(
                                  fieldIndex,
                                  {
                                    type,
                                    options:
                                      type ===
                                      "select"
                                        ? field
                                            .options
                                            .length
                                          ? field.options
                                          : [""]
                                        : [],
                                  }
                                );
                              }}
                            >
                              <option value="text">
                                Text input
                              </option>

                              <option value="select">
                                Dropdown
                              </option>

                              <option value="image">
                                Image upload
                              </option>
                            </select>
                          </div>

                          <div>
                            <label>
                              Placeholder
                            </label>

                            <input
                              value={
                                field.placeholder
                              }
                              onChange={(
                                e
                              ) =>
                                updateField(
                                  fieldIndex,
                                  {
                                    placeholder:
                                      e
                                        .target
                                        .value,
                                  }
                                )
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Maximum Length
                            </label>

                            <input
                              type="number"
                              min="1"
                              max="200"
                              value={
                                field.maxLength
                              }
                              onChange={(
                                e
                              ) =>
                                updateField(
                                  fieldIndex,
                                  {
                                    maxLength:
                                      Number(
                                        e
                                          .target
                                          .value
                                      ) || 30,
                                  }
                                )
                              }
                            />
                          </div>

                        </div>

                        {field.type === "image" && (
                          <div
                            style={{
                              marginTop: "16px",
                              padding: "12px 14px",
                              border: "1px solid var(--admin-border-soft)",
                              borderRadius: "12px",
                              color: "var(--admin-muted)",
                              fontSize: "10px",
                            }}
                          >
                            Customers will see an image picker. Accepted formats: JPG, PNG or WEBP, up to 10 MB.
                          </div>
                        )}

                        <button
                          type="button"
                          className={
                            field.required
                              ? "admin-primary"
                              : "admin-secondary"
                          }
                          style={{
                            marginTop:
                              "16px",
                          }}
                          onClick={() =>
                            updateField(
                              fieldIndex,
                              {
                                required:
                                  !field.required,
                              }
                            )
                          }
                        >
                          {field.required
                            ? "Required"
                            : "Optional"}
                        </button>

                        {field.type ===
                          "select" && (
                          <div
                            style={{
                              marginTop:
                                "18px",
                            }}
                          >

                            <label>
                              Dropdown Options
                            </label>

                            <div
                              style={{
                                display:
                                  "grid",
                                gap: "8px",
                                marginTop:
                                  "10px",
                              }}
                            >

                              {field.options.map(
                                (
                                  option,
                                  optionIndex
                                ) => (
                                  <div
                                    key={
                                      optionIndex
                                    }
                                    style={{
                                      display:
                                        "grid",
                                      gridTemplateColumns:
                                        "1fr auto",
                                      gap: "8px",
                                    }}
                                  >

                                    <input
                                      value={
                                        option
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateOption(
                                          fieldIndex,
                                          optionIndex,
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      placeholder={`Option ${
                                        optionIndex +
                                        1
                                      }`}
                                    />

                                    <button
                                      type="button"
                                      className="admin-danger"
                                      onClick={() =>
                                        removeOption(
                                          fieldIndex,
                                          optionIndex
                                        )
                                      }
                                    >
                                      ×
                                    </button>

                                  </div>
                                )
                              )}

                            </div>

                            <button
                              type="button"
                              className="admin-secondary"
                              style={{
                                marginTop:
                                  "10px",
                              }}
                              onClick={() =>
                                addOption(
                                  fieldIndex
                                )
                              }
                            >
                              + Add Option
                            </button>

                          </div>
                        )}

                      </div>
                    )
                  )}

                  <button
                    type="button"
                    className="admin-secondary"
                    onClick={
                      addPersonalizationField
                    }
                  >
                    + Add Personalization Field
                  </button>

                </div>
              )}

            </div>

          </section>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "12px",
              paddingBottom:
                "50px",
            }}
          >

            <Link
              href="/admin/products"
              className="admin-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="admin-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}