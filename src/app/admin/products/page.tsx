"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug?: string;
};

type Product = {
  id: number;
  name: string;
  slug?: string | null;
  sku?: string | null;
  description?: string | null;
  image?: string | null;
  price: number;
  stock: number;
  category?: Category | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load products."
        );
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("LOAD PRODUCTS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: number, name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete product."
        );
      }

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to delete this product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const slug =
        product.slug?.toLowerCase() || "";

      const sku =
        product.sku?.toLowerCase() || "";

      const category =
        product.category?.name?.toLowerCase() || "";

      return (
        name.includes(query) ||
        sku.includes(query) ||
        slug.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, search]);

  const totalStock = products.reduce(
    (total, product) =>
      total + (Number(product.stock) || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock) <= 0
  ).length;

  function formatPrice(price: number) {
    return `₹${Number(price || 0).toLocaleString(
      "en-IN"
    )}`;
  }

  function stockLabel(stock: number) {
    if (stock <= 0) {
      return {
        text: "Out of stock",
        className: "status-cancelled",
      };
    }

    if (stock <= 5) {
      return {
        text: "Low stock",
        className: "status-pending",
      };
    }

    return {
      text: "In stock",
      className: "status-paid",
    };
  }

  return (
    <div className="zelora-admin zelora-products-page">
      <main>
        <div className="products-shell">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="admin-page-header products-header">

            <div className="products-heading-copy">

              <p className="admin-eyebrow">
                ZELORA ADMIN / INVENTORY
              </p>

              <h1 className="admin-page-title">
                Products
              </h1>

              <p className="admin-page-description">
                Manage your store products, stock,
                pricing and availability.
              </p>

            </div>

            <Link
              href="/admin/products/new"
              className="admin-primary products-add-button"
            >
              <span className="products-add-icon">
                +
              </span>

              <span>
                ADD PRODUCT
              </span>

              <span className="products-add-arrow">
                →
              </span>
            </Link>

          </div>


          {/* =====================================================
              STATISTICS
          ===================================================== */}

          <div className="admin-stats products-stats">

            <div className="admin-stat">
              <div className="admin-stat-label">
                Products
              </div>

              <div className="admin-stat-value">
                {products.length}
              </div>

              <div className="products-stat-note">
                Total catalog
              </div>
            </div>


            <div className="admin-stat">
              <div className="admin-stat-label">
                Total Stock
              </div>

              <div className="admin-stat-value">
                {totalStock}
              </div>

              <div className="products-stat-note">
                Units available
              </div>
            </div>


            <div className="admin-stat">
              <div className="admin-stat-label">
                Low Stock
              </div>

              <div className="admin-stat-value">
                {lowStock}
              </div>

              <div className="products-stat-note">
                5 units or less
              </div>
            </div>


            <div className="admin-stat">
              <div className="admin-stat-label">
                Out of Stock
              </div>

              <div className="admin-stat-value">
                {outOfStock}
              </div>

              <div className="products-stat-note">
                Needs attention
              </div>
            </div>

          </div>


          {/* =====================================================
              PRODUCT CATALOG
          ===================================================== */}

          <section className="admin-card products-panel">

            {/* CATALOG HEADER */}

            <div className="products-toolbar">

              <div className="products-catalog-heading">

                <div className="products-catalog-kicker">
                </div>

                <div className="products-toolbar-title">
                </div>

                <div className="products-toolbar-subtitle">

                  <span className="products-count-number5">
                  </span>

                  <span>
                  </span>

                </div>

              </div>


              {/* SEARCH */}

              <div className="admin-search products-search">

                <span className="products-search-icon">
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by product, SKU or category..."
                  aria-label="Search products"
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div
                className="products-error"
                role="alert"
              >

                <div>

                  <strong>
                    Unable to load products
                  </strong>

                  <span>
                    {error}
                  </span>

                </div>

                <button
                  type="button"
                  className="admin-secondary"
                  onClick={loadProducts}
                >
                  Try again
                </button>

              </div>
            )}


            {/* LOADING */}

            {loading ? (
              <div className="admin-loading products-loading">
                Loading products
              </div>
            ) : filteredProducts.length === 0 ? (

              /* EMPTY STATE */

              <div className="empty-state products-empty">

                <div className="products-empty-icon">
                  ◇
                </div>

                <h2>
                  {search
                    ? "No products found"
                    : "No products yet"}
                </h2>

                <p>
                  {search
                    ? "Try a different search term."
                    : "Add your first product to start building your ZELORA store."}
                </p>

                {!search && (
                  <Link
                    href="/admin/products/new"
                    className="admin-primary"
                  >
                    Add your first product
                  </Link>
                )}

              </div>

            ) : (

              /* PRODUCT TABLE */

              <>

                <div className="admin-table-wrapper products-table-wrapper">

                  <table className="products-table">

                    <thead>

                      <tr>

                        <th>
                          Product
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Stock
                        </th>

                        <th>
                          Status
                        </th>

                        <th className="products-actions-heading">
                          Actions
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredProducts.map(
                        (product) => {

                          const stock =
                            stockLabel(
                              Number(product.stock)
                            );

                          return (

                            <tr
                              key={product.id}
                              className="zelora-product-row"
                            >

                              {/* PRODUCT */}

                              <td>

                                <div className="product-cell">

                                  <div className="product-thumb">

                                    {product.image ? (

                                      <img
                                        src={product.image}
                                        alt={product.name}
                                      />

                                    ) : (

                                      <span>
                                        ◇
                                      </span>

                                    )}

                                  </div>


                                  <div className="product-info">

                                    <p className="product-name">
                                      {product.name}
                                    </p>

                                    {/* SKU */}

                                    <p className="product-slug sku-text">
  <span>SKU:</span>{" "}
  <strong>{product.sku || "—"}</strong>
</p>

                                  </div>

                                </div>

                              </td>


                              {/* CATEGORY */}

                              <td>

                                <span className="product-category">
                                  {product.category?.name ||
                                    "Uncategorized"}
                                </span>

                              </td>


                              {/* PRICE */}

                              <td>

                                <span className="price">
                                  {formatPrice(
                                    product.price
                                  )}
                                </span>

                              </td>


                              {/* STOCK */}

                              <td>

                                <span
                                  className={`product-stock ${
                                    product.stock <= 0
                                      ? "is-out"
                                      : product.stock <= 5
                                        ? "is-low"
                                        : ""
                                  }`}
                                >
                                  {product.stock}
                                </span>

                              </td>


                              {/* STATUS */}

                              <td>

                                <span
                                  className={`status-badge ${stock.className}`}
                                >

                                  <span className="status-dot" />

                                  {stock.text}

                                </span>

                              </td>


                              {/* ACTIONS */}

                              <td>

                                <div className="product-actions">

                                  <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="admin-secondary product-edit"
                                    aria-label={`Edit ${product.name}`}
                                  >
                                    <span>
                                      Edit
                                    </span>

                                    <span className="product-action-arrow">
                                      ↗
                                    </span>
                                  </Link>


                                  <button
                                    type="button"
                                    disabled={
                                      deletingId ===
                                      product.id
                                    }
                                    onClick={() =>
                                      deleteProduct(
                                        product.id,
                                        product.name
                                      )
                                    }
                                    className="admin-danger product-delete"
                                  >

                                    {deletingId ===
                                    product.id
                                      ? "Deleting..."
                                      : "Delete"}

                                  </button>

                                </div>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>


                {/* FOOTER */}

                <div className="products-footer">

                  <span>

                    Showing{" "}

                    <strong>
                      {filteredProducts.length}
                    </strong>{" "}

                    of{" "}

                    <strong>
                      {products.length}
                    </strong>{" "}

                    products

                  </span>


                  {search && (

                    <button
                      type="button"
                      className="products-clear-search"
                      onClick={() =>
                        setSearch("")
                      }
                    >
                      Clear search
                    </button>

                  )}

                </div>

              </>

            )}

          </section>

        </div>
      </main>
    </div>
  );
}