"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";

export default function CartPage() {
  const { data: session } = useSession();
  const { summary, loading, fetchCart, updateItem, removeItem } = useCartStore();

  useEffect(() => {
    if (session) fetchCart();
  }, [session]);

  if (!session) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <ShoppingBag size={48} color="#af101a" />
      <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "#5b403d" }}>Please <Link href="/login" style={{ color: "#af101a" }}>log in</Link> to view your cart.</p>
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: "center", padding: 64, fontFamily: "Plus Jakarta Sans, sans-serif", color: "#5b403d" }}>Loading cart...</div>
  );

  const items = summary?.items ?? [];

  if (items.length === 0) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <ShoppingBag size={48} color="#af101a" />
      <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: "#5b403d" }}>Your cart is empty.</p>
      <Link href="/" style={{ background: "#af101a", color: "#fff", padding: "10px 24px", borderRadius: 8, fontFamily: "Plus Jakarta Sans, sans-serif", textDecoration: "none" }}>Browse Products</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 32, color: "#1b1c1a", marginBottom: 32 }}>Your Cart</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: "#fff",
              border: "1px solid #e4beba",
              borderRadius: 12,
              padding: 20,
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 16,
              alignItems: "center",
            }}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} style={{ borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 80, height: 80, background: "#efeeeb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShoppingBag size={24} color="#8f6f6c" />
                </div>
              )}

              <div>
                <p style={{ fontWeight: 600, color: "#1b1c1a", margin: 0 }}>{item.name}</p>
                <p style={{ fontSize: 13, color: "#8f6f6c", margin: "2px 0 8px" }}>{item.shopName}</p>
                {item.discountPct > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fff2f0", color: "#af101a", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                    <Tag size={10} /> {item.discountPct}% bulk discount
                  </span>
                )}
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  {item.discountPct > 0 && (
                    <span style={{ textDecoration: "line-through", color: "#8f6f6c", fontSize: 13 }}>K{item.price.toFixed(2)}</span>
                  )}
                  <span style={{ fontWeight: 700, color: "#af101a" }}>K{item.discountedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e4e2df", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                    style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#5b403d" }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: 28, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)}
                    style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#5b403d" }}>
                    <Plus size={14} />
                  </button>
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#1b1c1a", margin: 0 }}>K{item.lineTotal.toFixed(2)}</p>
                <button onClick={() => removeItem(item.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ba1a20" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: "#fff", border: "1px solid #e4beba", borderRadius: 16, padding: 28, position: "sticky", top: 24 }}>
          <h2 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 700, fontSize: 20, color: "#1b1c1a", margin: "0 0 20px" }}>Order Summary</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#5b403d" }}>
              <span>Subtotal</span>
              <span>K{summary?.subtotal.toFixed(2)}</span>
            </div>
            {(summary?.totalSavings ?? 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#875200" }}>
                <span>Bulk Savings</span>
                <span>- K{summary?.totalSavings.toFixed(2)}</span>
              </div>
            )}
            <hr style={{ border: "none", borderTop: "1px solid #e4e2df", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, color: "#1b1c1a" }}>
              <span>Total</span>
              <span>K{summary?.grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button style={{
            width: "100%", marginTop: 24, padding: "14px 0",
            background: "#af101a", color: "#fff", border: "none",
            borderRadius: 8, fontFamily: "Be Vietnam Pro, sans-serif",
            fontWeight: 700, fontSize: 16, cursor: "pointer",
          }}>
            Proceed to Checkout
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#8f6f6c", marginTop: 12 }}>
            Payment via WhatsApp or bank transfer
          </p>
        </div>
      </div>
    </div>
  );
}
