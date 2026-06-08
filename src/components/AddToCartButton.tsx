"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

type Props = {
  productId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ productId, disabled }: Props) {
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handle = async () => {
    setStatus("loading");
    await addItem(productId, qty);
    setStatus("done");
    setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="number" min={1} value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        style={{ width: 60, padding: "8px 10px", border: "1px solid #e4beba", borderRadius: 8, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14 }}
      />
      <button
        onClick={handle}
        disabled={disabled || status === "loading"}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: status === "done" ? "#875200" : "#af101a",
          color: "#fff", border: "none", borderRadius: 8,
          padding: "10px 20px", fontFamily: "Be Vietnam Pro, sans-serif",
          fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "done"    && <Check size={16} />}
        {status === "idle"    && <ShoppingCart size={16} />}
        {status === "done" ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
