"use client";
import { useEffect, useState } from "react";
import { calculateLevel, Badge, Level } from "@/lib/gamification";

type GamData = {
  points:  number;
  level:   Level;
  earned:  Badge[];
  locked:  Badge[];
};

export default function GamificationCard() {
  const [data, setData] = useState<GamData | null>(null);

  useEffect(() => {
    fetch("/api/gamification/me").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return null;

  const { points, level, earned, locked } = data;

  return (
    <div style={{ background: "#fff", border: "1px solid #e4beba", borderRadius: 16, padding: 28, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Level header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#8f6f6c", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Level</p>
          <p style={{ margin: "4px 0 0", fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 24, color: level.color }}>{level.name}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1b1c1a", fontFamily: "Be Vietnam Pro, sans-serif" }}>{points.toLocaleString()}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#8f6f6c" }}>points</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8f6f6c", marginBottom: 6 }}>
          <span>Level {level.level}</span>
          <span>{level.progress}% to Level {level.level + 1}</span>
        </div>
        <div style={{ height: 8, background: "#efeeeb", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${level.progress}%`, background: level.color, borderRadius: 99, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8f6f6c", marginTop: 4 }}>
          <span>{level.minPoints.toLocaleString()} pts</span>
          <span>{level.maxPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Earned badges */}
      {earned.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#1b1c1a" }}>Earned Badges</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {earned.map((b) => (
              <div key={b.id} title={b.description} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", background: "#fff2f0",
                border: "1px solid #e4beba", borderRadius: 99,
                fontSize: 13, fontWeight: 600, color: "#af101a",
              }}>
                <span>{b.icon}</span> {b.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#8f6f6c" }}>Locked Badges</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {locked.map((b) => (
              <div key={b.id} title={b.description} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", background: "#f5f3f0",
                border: "1px solid #e4e2df", borderRadius: 99,
                fontSize: 13, color: "#8f6f6c", filter: "grayscale(1)",
              }}>
                <span>{b.icon}</span> {b.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
