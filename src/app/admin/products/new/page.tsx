"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const emptyPersonalization: Personalization = {
  enabled: false,
  fields: [],
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Product gallery: uploaded files only. The first selected image becomes the main image.
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [galleryDragging, setGalleryDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const [personalization, setPersonalization] =
    useState<Personalization>(emptyPersonalization);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

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

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!slug || slug === createSlug(name)) setSlug(createSlug(value));
  }

  function validateImageFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Use JPG, PNG or WEBP images only.";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Each image must be 10 MB or smaller.";
    }
    return "";
  }

  function selectGalleryFiles(files: File[]) {
    const validFiles: File[] = [];

    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setImageError(validationError);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length) {
      setImageFiles((current) => [...current, ...validFiles]);
      setImageError("");
    }
  }

  function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    selectGalleryFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleGalleryDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setGalleryDragging(false);
    selectGalleryFiles(Array.from(event.dataTransfer.files || []));
  }

  function removeGalleryFile(index: number) {
    setImageFiles((current) => current.filter((_, i) => i !== index));
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data?.url) {
      throw new Error(data?.message || "Image upload failed.");
    }

    return String(data.url);
  }

  function updateField(index: number, changes: Partial<PersonalizationField>) {
    setPersonalization((current) => ({
      ...current,
      fields: current.fields.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...changes } : field
      ),
    }));
  }

  function addPersonalizationField() {
    setPersonalization((current) => ({
      enabled: true,
      fields: [
        ...current.fields,
        {
          id: `field-${Date.now()}`,
          type: "text",
          label: "Personalization",
          placeholder: "Enter your text",
          required: false,
          maxLength: 30,
          options: [],
        },
      ],
    }));
  }

  function removePersonalizationField(index: number) {
    setPersonalization((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  }

  function updateOption(fieldIndex: number, optionIndex: number, value: string) {
    setPersonalization((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: field.options.map((option, i) =>
                i === optionIndex ? value : option
              ),
            }
          : field
      ),
    }));
  }

  function addOption(fieldIndex: number) {
    setPersonalization((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? { ...field, options: [...field.options, ""] }
          : field
      ),
    }));
  }

  function removeOption(fieldIndex: number, optionIndex: number) {
    setPersonalization((current) => ({
      ...current,
      fields: current.fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: field.options.filter((_, i) => i !== optionIndex),
            }
          : field
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) return setError("Product name is required.");
    if (!sku.trim()) return setError("SKU is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!price || Number(price) < 0) return setError("Enter a valid price.");
    if (!stock || Number(stock) < 0) return setError("Enter a valid stock quantity.");

    try {
      setLoading(true);
      setUploadingImages(imageFiles.length > 0);

      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        uploadedUrls.push(await uploadFile(file));
      }

      const cleanImages = uploadedUrls;

      const cleanPersonalization = {
        enabled: personalization.enabled,
        fields: personalization.fields
          .map((field) => ({
            ...field,
            label: field.label.trim(),
            placeholder: field.type === "text" ? field.placeholder.trim() : "",
            maxLength:
              field.type === "text"
                ? Math.min(200, Math.max(1, Number(field.maxLength) || 30))
                : 0,
            options:
              field.type === "select"
                ? field.options.map((option) => option.trim()).filter(Boolean)
                : [],
          }))
          .filter((field) => field.label),
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || createSlug(name),
          sku: sku.trim().toUpperCase(),
          description: description.trim(),
          images: cleanImages,
          image: cleanImages[0] || "",
          price: Number(price),
          stock: Number(stock),
          category: category.trim(),
          personalization: cleanPersonalization,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to create product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the product."
      );
    } finally {
      setUploadingImages(false);
      setLoading(false);
    }
  }

  return (
    <div className="zelora-admin zelora-new-product-page">
      <main>
        <div className="new-product-shell">
          <div className="admin-page-header new-product-header">
            <div>
              <Link href="/admin/products" className="new-product-back">
                ← Back to Products
              </Link>
              <p className="admin-eyebrow new-product-eyebrow">
                ZELORA ADMIN / INVENTORY
              </p>
              <h1 className="admin-page-title">Add Product</h1>
              <p className="admin-page-description">
                Add a new product to your ZELORA store.
              </p>
            </div>
          </div>

          {error && (
            <div className="new-product-error" role="alert">
              <div className="new-product-error-icon">!</div>
              <div className="new-product-error-content">
                <strong>Unable to create product</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="new-product-form">
            <section className="admin-card new-product-card">
              <div className="new-product-card-header">
                <div>
                  <p className="new-product-section-number">01</p>
                  <h2>Basic Information</h2>
                  <p>Give your product a name and describe what makes it special.</p>
                </div>
              </div>
              <div className="new-product-fields">
                <div className="new-product-field new-product-field-full">
                  <label htmlFor="product-name">Product Name <span>*</span></label>
                  <input
                    id="product-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. ZELORA Signature Bracelet"
                    autoComplete="off"
                  />
                  <small>The name customers will see in your store.</small>
                </div>

                <div className="new-product-field new-product-field-full">
                  <label htmlFor="product-slug">Product Slug</label>
                  <div className="new-product-input-prefix">
                    <span>/</span>
                    <input
                      id="product-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="zelora-signature-bracelet"
                      autoComplete="off"
                    />
                  </div>
                  <small>Automatically generated from the product name. You can edit it manually.</small>
                </div>

                <div className="new-product-field new-product-field-full">
                  <label htmlFor="product-sku">SKU <span>*</span></label>
                  <input
                    id="product-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. ZELORA-BRC-001"
                    autoComplete="off"
                    maxLength={100}
                  />
                  <small>Internal product code. This is only visible to you in the admin panel and orders.</small>
                </div>

                <div className="new-product-field new-product-field-full">
                  <label htmlFor="product-description">Description <span>*</span></label>
                  <textarea
                    id="product-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={7}
                  />
                  <small>Tell customers about the product, materials, design, features, or anything else they should know.</small>
                </div>
              </div>
            </section>

            <section className="admin-card new-product-card">
              <div className="new-product-card-header">
                <div>
                  <p className="new-product-section-number">02</p>
                  <h2>Product Images</h2>
                  <p>Add multiple images. The first image becomes the main product image.</p>
                </div>
              </div>

              <div className="new-product-fields">
                <div className="new-product-field new-product-field-full">
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={handleGalleryChange}
                  />

                  <div
                    className={`new-product-upload-zone ${galleryDragging ? "is-dragging" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => galleryInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        galleryInputRef.current?.click();
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setGalleryDragging(true);
                    }}
                    onDragLeave={() => setGalleryDragging(false)}
                    onDrop={handleGalleryDrop}
                  >
                    <div className="new-product-upload-icon">↑</div>
                    <h3>Upload product images</h3>
                    <p>Click to browse or drag & drop multiple images here</p>
                    <span>JPG, PNG or WEBP · Maximum 10 MB each</span>
                    <div className="new-product-upload-button">Choose Images</div>
                  </div>

                  {imageError && <p className="new-product-image-error">{imageError}</p>}

                  {imagePreviews.length > 0 && (
                    <div className="new-product-gallery-editor">
                      <div className="new-product-gallery-editor-head">
                        <div>
                          <strong>Selected images</strong>
                          <span>First image becomes the main product image.</span>
                        </div>
                        <span>{imagePreviews.length} image{imagePreviews.length === 1 ? "" : "s"}</span>
                      </div>

                      <div className="new-product-gallery-grid">
                        {imagePreviews.map((preview, index) => (
                          <div
                            className={`new-product-gallery-item ${index === 0 ? "is-main" : ""}`}
                            key={`${preview}-${index}`}
                          >
                            <div className="new-product-gallery-image">
                              {index === 0 && (
                                <span className="new-product-main-badge">MAIN IMAGE</span>
                              )}
                              <img src={preview} alt={`Product image ${index + 1}`} />
                            </div>
                            <div className="new-product-gallery-meta">
                              <strong>{imageFiles[index]?.name || `Product image ${index + 1}`}</strong>
                              <span>
                                {imageFiles[index]
                                  ? `${(imageFiles[index].size / 1024 / 1024).toFixed(2)} MB`
                                  : ""}
                              </span>
                            </div>
                            <div className="new-product-gallery-actions">
                              <button
                                type="button"
                                className="admin-danger"
                                onClick={() => removeGalleryFile(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <small>
                    Images are uploaded securely to your server when you create the product.
                  </small>
                </div>
              </div>
            </section>

            <section className="admin-card new-product-card">
              <div className="new-product-card-header">
                <div>
                  <p className="new-product-section-number">03</p>
                  <h2>Pricing & Inventory</h2>
                  <p>Set the selling price and available stock.</p>
                </div>
              </div>
              <div className="new-product-fields new-product-fields-two">
                <div className="new-product-field">
                  <label htmlFor="product-price">Price <span>*</span></label>
                  <div className="new-product-price-input">
                    <span>₹</span>
                    <input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1299"
                    />
                  </div>
                  <small>Selling price displayed to customers.</small>
                </div>
                <div className="new-product-field">
                  <label htmlFor="product-stock">Stock <span>*</span></label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                  />
                  <small>Number of units currently available.</small>
                </div>
              </div>
            </section>

            <section className="admin-card new-product-card">
              <div className="new-product-card-header">
                <div>
                  <p className="new-product-section-number">04</p>
                  <h2>Category</h2>
                  <p>Organize the product inside your store catalog.</p>
                </div>
              </div>
              <div className="new-product-fields">
                <div className="new-product-field new-product-field-full">
                  <label htmlFor="product-category">Category <span>*</span></label>
                  <select
                    id="product-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                  <small>Choose from the categories created in your Categories Manager.</small>
                  {categoriesError && (
                    <small style={{ color: "#e29b9b" }}>{categoriesError}</small>
                  )}
                </div>
              </div>
            </section>

            <section className="admin-card new-product-card">
              <div className="new-product-card-header">
                <div>
                  <p className="new-product-section-number">05</p>
                  <h2>Personalization</h2>
                  <p>Choose what customers can customize before ordering.</p>
                </div>
              </div>

              <div className="new-product-fields">
                <div className="new-product-field new-product-field-full">
                  <div className="new-product-personalization-toggle">
                    <div>
                      <strong>Allow customer personalization</strong>
                      <span>Enable text, dropdown and image-upload customization fields.</span>
                    </div>
                    <button
                      type="button"
                      className={`new-product-switch ${personalization.enabled ? "is-on" : ""}`}
                      onClick={() =>
                        setPersonalization((current) => ({
                          ...current,
                          enabled: !current.enabled,
                        }))
                      }
                      aria-pressed={personalization.enabled}
                    >
                      <span />
                    </button>
                  </div>

                  {personalization.enabled && (
                    <div className="new-product-personalization-builder" style={{ marginTop: "16px" }}>
                      <div className="new-product-builder-head">
                        <div>
                          <strong>Personalization fields</strong>
                          <span>These fields appear on the customer product page.</span>
                        </div>
                      </div>

                      <div className="new-product-builder-list">
                        {personalization.fields.map((field, fieldIndex) => (
                          <div className="new-product-builder-item" key={field.id}>
                            <div className="new-product-builder-item-head">
                              <span>FIELD {fieldIndex + 1}</span>
                              <button
                                type="button"
                                className="admin-danger"
                                onClick={() => removePersonalizationField(fieldIndex)}
                              >
                                Remove
                              </button>
                            </div>

                            <div className="new-product-fields">
                              <div className="new-product-fields-two">
                                <div className="new-product-field">
                                  <label>Field Label</label>
                                  <input
                                    value={field.label}
                                    onChange={(e) => updateField(fieldIndex, { label: e.target.value })}
                                  />
                                </div>

                                <div className="new-product-field">
                                  <label>Field Type</label>
                                  <select
                                    value={field.type}
                                    onChange={(e) => {
                                      const type = e.target.value as PersonalizationField["type"];
                                      updateField(fieldIndex, {
                                        type,
                                        options:
                                          type === "select"
                                            ? field.options.length
                                              ? field.options
                                              : [""]
                                            : [],
                                        placeholder: type === "text" ? field.placeholder || "Enter your text" : "",
                                      });
                                    }}
                                  >
                                    <option value="text">Text input</option>
                                    <option value="select">Dropdown</option>
                                    <option value="image">Image upload</option>
                                  </select>
                                </div>
                              </div>

                              {field.type === "text" && (
                                <div className="new-product-fields-two">
                                  <div className="new-product-field">
                                    <label>Placeholder</label>
                                    <input
                                      value={field.placeholder}
                                      onChange={(e) => updateField(fieldIndex, { placeholder: e.target.value })}
                                    />
                                  </div>
                                  <div className="new-product-field">
                                    <label>Maximum Length</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="200"
                                      value={field.maxLength}
                                      onChange={(e) =>
                                        updateField(fieldIndex, {
                                          maxLength: Number(e.target.value) || 30,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              )}

                              {field.type === "image" && (
                                <div
                                  style={{
                                    marginTop: "12px",
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
                                className={field.required ? "admin-primary" : "admin-secondary"}
                                style={{ marginTop: "12px" }}
                                onClick={() => updateField(fieldIndex, { required: !field.required })}
                              >
                                {field.required ? "Required" : "Optional"}
                              </button>

                              {field.type === "select" && (
                                <div style={{ marginTop: "16px" }}>
                                  <label>Dropdown Options</label>
                                  <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                                    {field.options.map((option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px" }}
                                      >
                                        <input
                                          value={option}
                                          onChange={(e) => updateOption(fieldIndex, optionIndex, e.target.value)}
                                          placeholder={`Option ${optionIndex + 1}`}
                                        />
                                        <button
                                          type="button"
                                          className="admin-danger"
                                          onClick={() => removeOption(fieldIndex, optionIndex)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    className="admin-secondary"
                                    style={{ marginTop: "10px" }}
                                    onClick={() => addOption(fieldIndex)}
                                  >
                                    + Add Option
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="admin-secondary"
                          onClick={addPersonalizationField}
                        >
                          + Add Personalization Field
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="new-product-actions">
              <Link href="/admin/products" className="admin-secondary new-product-cancel">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="admin-primary new-product-submit">
                <span>
                  {loading
                    ? uploadingImages
                      ? "Uploading Images..."
                      : "Creating Product..."
                    : "Create Product"}
                </span>
                {!loading && <span>→</span>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
