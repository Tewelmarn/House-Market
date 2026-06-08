"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export default function CartBadge() {
  const { data: session } = useSession();
  const { summary, fetchCart } = useCartStore();

  useEffect(() => {
    if (session) fetchCart();
  }, [session]);

  const count = summary?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <Link href="/cart" style={{ position: "relative", display: "inline-flex", color: "#1b1c1a" }}>
      <ShoppingCart size={22} />
      {count > 0 && (
        <span style={{
          position: "absolute", top: -6, right: -8,
          background: "#af101a", color: "#fff",
          fontSize: 10, fontWeight: 700,
          borderRadius: 99, padding: "1px 5px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}>{count}</span>
      )}
    </Link>
  );
}
