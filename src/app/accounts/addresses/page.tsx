 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../accounts.module.css";

const emptyAddress = {
  label: "Home",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

async function readJson(response: Response) {
  const text = await response.text();

  if (!text.trim()) {
    return {
      data: null as any,
      message: `Request failed (${response.status}).`,
    };
  }

  try {
    return {
      data: JSON.parse(text),
      message: "",
    };
  } catch {
    return {
      data: null as any,
      message: "The server returned an invalid response.",
    };
  }
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyAddress);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetch("/api/accounts/addresses", {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/account/login";
        return;
      }

      const { data } = await readJson(response);

      if (!response.ok || !data?.success) {
        alert(data?.message || "Unable to load saved addresses.");
        return;
      }

      setAddresses(data.addresses || []);
    } catch {
      alert("Unable to load saved addresses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch("/api/accounts/addresses", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editing ? { ...form, id: editing } : form
        ),
      });

      if (response.status === 401) {
        window.location.href = "/account/login";
        return;
      }

      const { data } = await readJson(response);

      if (!response.ok || !data?.success) {
        alert(data?.message || "Unable to save address.");
        return;
      }

      setForm({ ...emptyAddress });
      setEditing(null);
      await load();
    } catch {
      alert("Unable to save address. Please try again.");
    }
  }

  function edit(address: any) {
    setEditing(address.id);
    setForm({
      ...emptyAddress,
      ...address,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    if (!window.confirm("Remove this saved address?")) return;

    try {
      const response = await fetch(
        `/api/accounts/addresses?id=${id}`,
        { method: "DELETE" }
      );

      const { data } = await readJson(response);

      if (!response.ok || !data?.success) {
        alert(data?.message || "Unable to delete address.");
        return;
      }

      if (editing === id) {
        setEditing(null);
        setForm({ ...emptyAddress });
      }

      await load();
    } catch {
      alert("Unable to delete address.");
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>ZELORA / ACCOUNT</p>
            <h1 className={styles.title}>Addresses</h1>
          </div>

          <Link href="/accounts" className={styles.back}>
            ← Account overview
          </Link>
        </div>

        <div className={styles.pageContent}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Saved addresses</h2>
            <p className={styles.muted}>
              Keep your delivery details ready for faster checkout.
            </p>

            {!loading && addresses.length > 0 && (
              <div className={styles.addressList}>
                {addresses.map((address) => (
                  <article
                    className={styles.address}
                    key={address.id}
                  >
                    <div className={styles.addressTop}>
                      <div>
                        <strong>{address.label}</strong>{" "}
                        {address.isDefault && (
                          <span className={styles.badge}>
                            Default
                          </span>
                        )}

                        <p className={styles.muted}>
                          {address.firstName} {address.lastName}
                          <br />
                          {address.address}
                          {address.apartment &&
                            `, ${address.apartment}`}
                          <br />
                          {address.city}, {address.state} —{" "}
                          {address.pincode}
                          <br />
                          {address.phone}
                        </p>
                      </div>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.button}
                          onClick={() => edit(address)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className={`${styles.button} ${styles.danger}`}
                          onClick={() => remove(address.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && addresses.length === 0 && (
              <div className={styles.empty}>
                No saved addresses yet.
              </div>
            )}

            <form onSubmit={save} className={styles.formGrid}>
              {[
                "label",
                "firstName",
                "lastName",
                "phone",
                "address",
                "apartment",
                "city",
                "state",
                "pincode",
              ].map((key) => (
                <div
                  className={`${styles.field} ${
                    ["address", "apartment"].includes(key)
                      ? styles.full
                      : ""
                  }`}
                  key={key}
                >
                  <label>
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>

                  <input
                    value={form[key] || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [key]: event.target.value,
                      })
                    }
                    required={key !== "apartment"}
                  />
                </div>
              ))}

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={Boolean(form.isDefault)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      isDefault: event.target.checked,
                    })
                  }
                />
                <span>Make this my default address</span>
              </label>

              <div className={styles.actions}>
                <button type="submit" className={styles.button}>
                  {editing ? "Update address" : "Save address"}
                </button>

                {editing && (
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      setEditing(null);
                      setForm({ ...emptyAddress });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
