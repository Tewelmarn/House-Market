"use client";
import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

type Props = { productId: string };

export default function ShareAffiliateButton({ productId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied">("idle");

  const handle = async () => {
    setStatus("loading");
    const res = await fetch("/api/affiliate/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) { setStatus("idle"); return; }
    const link = await res.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const url = `${appUrl}/api/affiliate/track?ref=${link.code}&pid=${productId}`;
    await navigator.clipboard.writeText(url);
    setStatus("copied");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <button onClick={handle} disabled={status === "loading"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 16px", border: "1px solid #875200", borderRadius: 8,
        background: status === "copied" ? "#875200" : "transparent",
        color: status === "copied" ? "#fff" : "#875200",
        fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 700,
        fontSize: 13, cursor: "pointer", transition: "all 0.2s",
      }}>
      {status === "loading" && <Loader2 size={14} />}
      {status === "copied"  && <Check size={14} />}
      {status === "idle"    && <Share2 size={14} />}
      {status === "copied" ? "Link Copied!" : "Share & Earn"}
    </button>
  );
}
