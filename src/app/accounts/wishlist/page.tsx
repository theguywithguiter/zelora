"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../accounts.module.css";
export default function WishlistPage() {
  const active = "Wishlist";
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{fetch("/api/accounts/wishlist").then(async r=>{if(r.status===401){location.href="/account/login";return;}const d=await r.json();setItems(d.items||[]);});},[]);
 async function remove(id:number){await fetch("/api/accounts/wishlist?productId="+id,{method:"DELETE"});setItems(v=>v.filter(x=>x.productId!==id));}
 return <main className={styles.shell}>
  <div className={styles.inner}>
    <div className={styles.top}>
      <div><p className={styles.eyebrow}>ZELORA / ACCOUNT</p><h1 className={styles.title}>Wishlist</h1></div>
      <Link href="/accounts" className={styles.back}>← Account overview</Link>
    </div>
    <div className={styles.grid}>
      <nav className={styles.nav}>
        <Link href="/accounts/profile">Profile</Link>
<Link href="/accounts/orders">My Orders</Link>
<Link href="/accounts/wishlist" className={styles.active}>My Wishlist</Link>
<Link href="/accounts/addresses">Saved Addresses</Link>
      </nav>
      <section className={styles.panel}>
 <h2 className={styles.panelTitle}>Saved pieces</h2><p className={styles.muted}>Pieces you've chosen to keep close.</p>
 {!items.length?<div className={styles.empty}>Your wishlist is empty.<br/><Link href="/shop" className={styles.back}>Discover ZELORA →</Link></div>:
 <div className={styles.productGrid}>{items.map(i=><article className={styles.product} key={i.id}><Link href={"/product/"+i.product.slug}><div className={styles.productImg}>{i.product.image&&<img src={i.product.image} alt={i.product.name}/>}</div></Link><div className={styles.productBody}><div className={styles.productName}>{i.product.name}</div><div className={styles.productMeta}><span>₹{Number(i.product.price).toLocaleString("en-IN")}</span><button className={`${styles.button} ${styles.danger}`} onClick={()=>remove(i.productId)}>Remove</button></div></div></article>)}</div>}
</section>
    </div>
  </div>
</main>
}