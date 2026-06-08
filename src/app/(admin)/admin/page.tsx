"use client";
import { useEffect, useState } from "react";
import { Users, Store, Package, AlertTriangle } from "lucide-react";

type Stats = {
  totalUsers: number; totalShops: number;
  totalProducts: number; totalReports: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#af101a", ADMIN_SUPPORT: "#875200", SELLER: "#6d5049", BUYER: "#5b403d",
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: "Total Users",    value: stats?.totalUsers,    icon: Users,          color: "#af101a" },
    { label: "Total Shops",    value: stats?.totalShops,    icon: Store,          color: "#875200" },
    { label: "Total Products", value: stats?.totalProducts, icon: Package,        color: "#6d5049" },
    { label: "Pending Reports",value: stats?.totalReports,  icon: AlertTriangle,  color: "#ba1a1a" },
  ];

  return (
    <div style={{ padding: 40, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 28, color: "#1b1c1a", margin: "0 0 32px" }}>Dashboard Overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#8f6f6c", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#1b1c1a", fontFamily: "Be Vietnam Pro, sans-serif" }}>{value ?? "—"}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e4e2df" }}>
          <h2 style={{ margin: 0, fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 700, fontSize: 16, color: "#1b1c1a" }}>Recent Signups</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f3f0" }}>
              {["Name", "Email", "Role", "Joined"].map((h) => (
                <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#8f6f6c", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats?.recentUsers.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid #f5f3f0" : "none" }}>
                <td style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#1b1c1a" }}>{u.name}</td>
                <td style={{ padding: "12px 24px", fontSize: 14, color: "#5b403d" }}>{u.email}</td>
                <td style={{ padding: "12px 24px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: ROLE_COLORS[u.role] ?? "#5b403d", background: (ROLE_COLORS[u.role] ?? "#5b403d") + "15", padding: "2px 8px", borderRadius: 99 }}>{u.role}</span>
                </td>
                <td style={{ padding: "12px 24px", fontSize: 13, color: "#8f6f6c" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
