"use client";
import { useEffect, useState } from "react";

type Entry = {
  id: string; name: string; points: number; badges: string[];
  rank: number; level: { name: string; color: string };
};

const RANK_STYLE: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: "#fff8e1", color: "#875200", label: "??" },
  2: { bg: "#f5f3f0", color: "#6d5049", label: "??" },
  3: { bg: "#fff2f0", color: "#af101a", label: "??" },
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/gamification/leaderboard").then((r) => r.json()).then(setEntries);
  }, []);

  const top3  = entries.slice(0, 3);
  const rest  = entries.slice(3);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 32, color: "#1b1c1a", margin: "0 0 8px", textAlign: "center" }}>Community Leaderboard</h1>
      <p style={{ textAlign: "center", color: "#8f6f6c", margin: "0 0 40px" }}>Top traders and sellers in the House Market community.</p>

      {/* Top 3 podium */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        {[top3[1], top3[0], top3[2]].filter(Boolean).map((e) => {
          const rs = RANK_STYLE[e.rank];
          return (
            <div key={e.id} style={{
              background: rs?.bg ?? "#fff", border: "1px solid #e4beba",
              borderRadius: 16, padding: 24, textAlign: "center",
              transform: e.rank === 1 ? "scale(1.05)" : "none",
              boxShadow: e.rank === 1 ? "0 4px 24px rgba(175,16,26,0.10)" : "none",
            }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>{rs?.label ?? e.rank}</p>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#1b1c1a" }}>{e.name}</p>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: e.level.color }}>{e.level.name}</p>
              <p style={{ margin: 0, fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 22, color: rs?.color ?? "#1b1c1a" }}>{e.points.toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#8f6f6c" }}>points</p>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, overflow: "hidden" }}>
        {rest.map((e, i) => (
          <div key={e.id} style={{
            display: "grid", gridTemplateColumns: "40px 1fr auto",
            alignItems: "center", gap: 16, padding: "14px 20px",
            borderTop: i > 0 ? "1px solid #f5f3f0" : "none",
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#8f6f6c", textAlign: "center" }}>#{e.rank}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#1b1c1a" }}>{e.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: e.level.color, fontWeight: 600 }}>{e.level.name}</p>
            </div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#1b1c1a", fontFamily: "Be Vietnam Pro, sans-serif" }}>{e.points.toLocaleString()}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <p style={{ textAlign: "center", padding: 48, color: "#8f6f6c" }}>No entries yet. Start earning points!</p>
        )}
      </div>
    </div>
  );
}
