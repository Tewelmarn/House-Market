"use client";
import { useEffect, useState } from "react";

type Props = { points: number; message?: string; onDone?: () => void };

export default function PointsToast({ points, message = "Points earned!", onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.(); }, 2800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: "#1b1c1a", color: "#fff", borderRadius: 12,
      padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      animation: "slideUp 0.3s ease",
    }}>
      <span style={{ fontSize: 22 }}>?</span>
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>+{points} points</p>
        <p style={{ margin: 0, fontSize: 12, color: "#e4beba" }}>{message}</p>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
