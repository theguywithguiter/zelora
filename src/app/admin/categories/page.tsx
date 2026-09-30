"use client";

import { DragEvent, FormEvent, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 52,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid var(--admin-border)",
  background: "rgba(255,255,255,0.035)",
  color: "var(--admin-white)",
  outline: "none",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function makeSlug(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!editingId || !slug || slug === makeSlug(name)) setSlug(makeSlug(value));
  }

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to load categories.");
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setImageFile(null);
    setIsDraggingImage(false);
  }

  function editCategory(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setImage(category.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectImage(file: File | null) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Category image must be 10 MB or smaller.");
      return;
    }

    setError("");
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }

  function handleImageDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImage(false);
    selectImage(event.dataTransfer.files?.[0] ?? null);
  }

  async function uploadCategoryImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/categories/upload", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        text.trim() || `Image upload failed (${response.status}).`
      );
    }

    if (!response.ok || !data?.success || typeof data.url !== "string") {
      throw new Error(
        data?.message || "Failed to upload category image."
      );
    }

    return data.url as string;
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl = image.trim();

      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadCategoryImage(imageFile);
      }

      const response = await fetch("/api/admin/categories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          slug: slug.trim() || makeSlug(name),
          description: description.trim(),
          image: imageUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to save category.");
      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    if (category.productCount > 0) {
      alert("Reassign the products in this category before deleting it.");
      return;
    }
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/categories?id=${category.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to delete category.");
      if (editingId === category.id) resetForm();
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  return (
    <div className="zelora-admin">
      <main>
        <header>
          <div>
            <p className="admin-eyebrow">ZELORA ADMIN / CATALOG</p>
            <h1 className="admin-page-title">Categories</h1>
            <p className="admin-page-description">Create the categories that appear in your catalog and assign products to them.</p>
          </div>
          <Link href="/admin" className="admin-secondary" style={{ borderRadius: 999, padding: "12px 18px" }}>← Dashboard</Link>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 0.8fr) minmax(0, 1.4fr)", gap: 22, marginTop: 28 }}>
          <section className="admin-card">
            <div className="admin-card-header">
              <h2>{editingId ? "Edit category" : "Add category"}</h2>
              <p>{editingId ? "Update this catalog category." : "Create a reusable category for your products."}</p>
            </div>
            <form onSubmit={saveCategory} style={{ padding: 24, display: "grid", gap: 16 }}>
              <div>
                <label>Name</label>
                <input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Bracelets" style={inputStyle} required />
              </div>
              <div>
                <label>Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="bracelets" style={inputStyle} />
              </div>
              <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short category description" style={{ ...inputStyle, padding: 16, minHeight: 110, borderRadius: 18, resize: "vertical" }} />
              </div>
              <div>
                <label>Category image <span style={{ opacity: 0.5 }}>(1 image)</span></label>
                <input
                  id="category-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={(event) => selectImage(event.target.files?.[0] ?? null)}
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload category image"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      document.getElementById("category-image-input")?.click();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingImage(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsDraggingImage(false);
                  }}
                  onDrop={handleImageDrop}
                  onClick={() =>
                    document.getElementById("category-image-input")?.click()
                  }
                  style={{
                    position: "relative",
                    minHeight: 240,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: 24,
                    borderRadius: 20,
                    border: isDraggingImage
                      ? "1px solid rgba(212,175,85,.95)"
                      : "1px dashed rgba(212,175,85,.42)",
                    background: isDraggingImage
                      ? "rgba(212,175,85,.10)"
                      : "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018))",
                    boxShadow: isDraggingImage
                      ? "0 0 0 4px rgba(212,175,85,.07), inset 0 0 40px rgba(212,175,85,.06)"
                      : "inset 0 0 40px rgba(255,255,255,.015)",
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Category preview"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,.12) 0%, rgba(0,0,0,.72) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: "100%",
                          minHeight: 190,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "90%",
                            padding: "9px 14px",
                            borderRadius: 999,
                            background: "rgba(0,0,0,.55)",
                            border: "1px solid rgba(255,255,255,.14)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              color: "var(--admin-white)",
                              fontSize: 12,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {imageFile?.name || "Current category image"}
                          </strong>
                          <span
                            style={{
                              display: "block",
                              marginTop: 4,
                              color: "var(--admin-gold-light)",
                              fontSize: 9,
                              letterSpacing: ".12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Click or drop another image to replace
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          border: "1px solid rgba(212,175,85,.35)",
                          color: "var(--admin-gold-light)",
                          fontSize: 24,
                          background: "rgba(212,175,85,.06)",
                        }}
                      >
                        ↑
                      </div>
                      <strong
                        style={{
                          color: "var(--admin-white)",
                          fontSize: 14,
                          letterSpacing: ".04em",
                        }}
                      >
                        Drop your category image here
                      </strong>
                      <span
                        style={{
                          color: "var(--admin-muted)",
                          fontSize: 10,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                        }}
                      >
                        or click to browse
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,.38)",
                          fontSize: 9,
                          letterSpacing: ".10em",
                        }}
                      >
                        JPG · PNG · WEBP · MAX 10 MB · 1 IMAGE
                      </span>
                    </>
                  )}
                </div>
              </div>
              {error && <div style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(220,100,100,.3)", color: "#e29b9b", background: "rgba(220,100,100,.06)" }}>{error}</div>}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" className="admin-primary" disabled={saving} style={{ borderRadius: 999, padding: "13px 22px" }}>{uploadingImage ? "Uploading image..." : saving ? "Saving..." : editingId ? "Save changes →" : "Create category →"}</button>
                {editingId && <button type="button" className="admin-secondary" onClick={resetForm} style={{ borderRadius: 999, padding: "13px 22px" }}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>Your categories</h2>
              <p>{categories.length} {categories.length === 1 ? "category" : "categories"} available for product assignment.</p>
            </div>
            {loading ? (
              <div className="admin-loading">Loading categories</div>
            ) : categories.length === 0 ? (
              <div className="empty-state" style={{ padding: 50 }}><h2>No categories yet</h2><p>Create your first catalog category.</p></div>
            ) : (
              <div style={{ padding: 14 }}>
                {categories.map((category) => (
                  <div key={category.id} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto", gap: 16, alignItems: "center", padding: 16, borderBottom: "1px solid var(--admin-border-soft)" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,.04)", border: "1px solid var(--admin-border)", display: "grid", placeItems: "center", color: "var(--admin-gold)" }}>
                      {category.image ? <img src={category.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "◇"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ color: "var(--admin-white)", fontSize: 16 }}>{category.name}</strong>
                      <div style={{ color: "var(--admin-muted-2)", fontSize: 11, marginTop: 4 }}>/{category.slug} · {category.productCount} {category.productCount === 1 ? "product" : "products"}</div>
                      {category.description && <p style={{ margin: "7px 0 0", color: "var(--admin-muted)", fontSize: 11 }}>{category.description}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="admin-secondary" type="button" onClick={() => editCategory(category)} style={{ borderRadius: 999, padding: "9px 14px" }}>Edit</button>
                      <button className="admin-danger" type="button" onClick={() => deleteCategory(category)} style={{ borderRadius: 999, padding: "9px 14px" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
