"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Flag = { id: string; name: string; enabled: boolean; description?: string };

export default function FeatureFlagsPage() {
  const [flags, setFlags]   = useState<Flag[]>([]);
  const [name, setName]     = useState("");
  const [desc, setDesc]     = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/feature-flags").then((r) => r.json()).then(setFlags);
  useEffect(() => { load(); }, []);

  const toggle = async (flag: Flag) => {
    await fetch(`/api/admin/feature-flags/${flag.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !flag.enabled }),
    });
    load();
  };

  const create = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await fetch("/api/admin/feature-flags", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: desc.trim(), enabled: false }),
    });
    setName(""); setDesc(""); setSaving(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this flag?")) return;
    await fetch(`/api/admin/feature-flags/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div style={{ padding: 40, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 28, color: "#1b1c1a", margin: "0 0 8px" }}>Feature Flags</h1>
      <p style={{ color: "#8f6f6c", fontSize: 14, margin: "0 0 32px" }}>Toggle platform features without redeployment.</p>

      {/* Create */}
      <div style={{ background: "#fff", border: "1px solid #e4beba", borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 700, fontSize: 16, color: "#1b1c1a", margin: "0 0 16px" }}>New Flag</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="flag_name (snake_case)"
            style={{ flex: "1 1 180px", padding: "10px 14px", border: "1px solid #e4beba", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)"
            style={{ flex: "2 1 240px", padding: "10px 14px", border: "1px solid #e4beba", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
          <button onClick={create} disabled={saving || !name.trim()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#af101a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Be Vietnam Pro, sans-serif" }}>
            <Plus size={16} /> Add Flag
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {flags.map((flag) => (
          <div key={flag.id} style={{ background: "#fff", border: "1px solid #e4e2df", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => toggle(flag)}
              style={{ width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                background: flag.enabled ? "#af101a" : "#e4e2df", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: 3, left: flag.enabled ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1b1c1a", fontFamily: "monospace" }}>{flag.name}</p>
              {flag.description && <p style={{ margin: "2px 0 0", fontSize: 13, color: "#8f6f6c" }}>{flag.description}</p>}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: flag.enabled ? "#af101a" : "#8f6f6c", background: flag.enabled ? "#fff2f0" : "#f5f3f0", padding: "3px 10px", borderRadius: 99 }}>
              {flag.enabled ? "ON" : "OFF"}
            </span>
            <button onClick={() => remove(flag.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#8f6f6c", padding: 4 }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {flags.length === 0 && (
          <p style={{ textAlign: "center", color: "#8f6f6c", padding: 40 }}>No flags yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
