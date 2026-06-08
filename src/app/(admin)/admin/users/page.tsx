"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Ban, ShieldCheck } from "lucide-react";

type User = { id: string; name: string; email: string; role: string; banned: boolean; createdAt: string };

const ROLES = ["BUYER", "SELLER", "ADMIN_SUPPORT", "ADMIN"];
const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#af101a", ADMIN_SUPPORT: "#875200", SELLER: "#6d5049", BUYER: "#5b403d",
};

export default function AdminUsersPage() {
  const [users, setUsers]   = useState<User[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole]     = useState("");

  const load = useCallback(() => {
    const q = new URLSearchParams({ page: String(page), search, ...(role && { role }) });
    fetch(`/api/admin/users?${q}`).then((r) => r.json()).then((d) => { setUsers(d.users); setTotal(d.total); });
  }, [page, search, role]);

  useEffect(() => { load(); }, [load]);

  const toggleBan = async (id: string, banned: boolean) => {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ banned: !banned }) });
    load();
  };

  return (
    <div style={{ padding: 40, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 28, color: "#1b1c1a", margin: "0 0 24px" }}>Users <span style={{ fontSize: 16, fontWeight: 400, color: "#8f6f6c" }}>({total})</span></h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8f6f6c" }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name or email..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e4beba", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}
          style={{ padding: "10px 16px", border: "1px solid #e4beba", borderRadius: 8, fontSize: 14, fontFamily: "inherit", background: "#fff" }}>
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f3f0" }}>
              {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#8f6f6c", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid #f5f3f0" : "none" }}>
                <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 600, color: "#1b1c1a" }}>{u.name}</td>
                <td style={{ padding: "12px 20px", fontSize: 14, color: "#5b403d" }}>{u.email}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: ROLE_COLORS[u.role], background: ROLE_COLORS[u.role] + "15", padding: "2px 8px", borderRadius: 99 }}>{u.role}</span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: u.banned ? "#ba1a1a" : "#875200", background: u.banned ? "#ffdad615" : "#ffddba40", padding: "2px 8px", borderRadius: 99 }}>
                    {u.banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#8f6f6c" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px 20px" }}>
                  <button onClick={() => toggleBan(u.id, u.banned)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none",
                      borderColor: u.banned ? "#875200" : "#ba1a1a", color: u.banned ? "#875200" : "#ba1a1a" }}>
                    {u.banned ? <><ShieldCheck size={12} /> Unban</> : <><Ban size={12} /> Ban</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          style={{ padding: "8px 16px", border: "1px solid #e4e2df", borderRadius: 8, cursor: "pointer", background: "#fff", fontSize: 13 }}>Prev</button>
        <span style={{ padding: "8px 16px", fontSize: 13, color: "#5b403d" }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={users.length < 20}
          style={{ padding: "8px 16px", border: "1px solid #e4e2df", borderRadius: 8, cursor: "pointer", background: "#fff", fontSize: 13 }}>Next</button>
      </div>
    </div>
  );
}
