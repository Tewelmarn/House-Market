"use client";
import { useEffect, useState } from "react";
import { Copy, Check, TrendingUp, MousePointerClick, ShoppingCart } from "lucide-react";
import Image from "next/image";

type AffLink = {
  id: string; code: string; clicks: number; conversions: number;
  shareUrl: string; createdAt: string;
  product: { id: string; name: string; price: number; media: { url: string }[] };
};

export default function AffiliatePage() {
  const [links, setLinks]       = useState<AffLink[]>([]);
  const [copied, setCopied]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/affiliate/my-links").then((r) => r.json()).then(setLinks);
  }, []);

  const copy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalClicks      = links.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = links.reduce((s, l) => s + l.conversions, 0);
  const convRate         = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0.0";

  return (
    <div style={{ padding: 40, fontFamily: "Plus Jakarta Sans, sans-serif", maxWidth: 900 }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 28, color: "#1b1c1a", margin: "0 0 8px" }}>Affiliate Links</h1>
      <p style={{ color: "#8f6f6c", fontSize: 14, margin: "0 0 32px" }}>Share product links and track clicks and conversions.</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Total Links",       value: links.length,      icon: TrendingUp,        color: "#875200" },
          { label: "Total Clicks",      value: totalClicks,       icon: MousePointerClick, color: "#af101a" },
          { label: "Conversion Rate",   value: `${convRate}%`,    icon: ShoppingCart,      color: "#6d5049" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1b1c1a", fontFamily: "Be Vietnam Pro, sans-serif" }}>{value}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#8f6f6c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Links list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {links.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#8f6f6c", background: "#fff", borderRadius: 12, border: "1px solid #e4e2df" }}>
            No affiliate links yet. Use the Share & Earn button on any product page.
          </div>
        )}
        {links.map((link) => (
          <div key={link.id} style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, padding: 20, display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 16, alignItems: "center" }}>
            {link.product.media[0]?.url ? (
              <Image src={link.product.media[0].url} alt={link.product.name} width={56} height={56} style={{ borderRadius: 8, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 56, height: 56, background: "#efeeeb", borderRadius: 8 }} />
            )}

            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1b1c1a" }}>{link.product.name}</p>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#875200", fontWeight: 600 }}>K{link.product.price.toFixed(2)}</p>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#8f6f6c" }}>
                <span><b style={{ color: "#1b1c1a" }}>{link.clicks}</b> clicks</span>
                <span><b style={{ color: "#1b1c1a" }}>{link.conversions}</b> conversions</span>
                <span>Code: <b style={{ fontFamily: "monospace", color: "#af101a" }}>{link.code}</b></span>
              </div>
            </div>

            <button onClick={() => copy(link.shareUrl, link.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e4beba", borderRadius: 8,
                background: copied === link.id ? "#af101a" : "#fff", color: copied === link.id ? "#fff" : "#5b403d",
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {copied === link.id ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
