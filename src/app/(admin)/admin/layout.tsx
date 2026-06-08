"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, ToggleLeft, Flag, ShieldAlert } from "lucide-react";

const NAV = [
  { href: "/admin",               label: "Overview",      icon: LayoutDashboard },
  { href: "/admin/users",         label: "Users",         icon: Users           },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: ToggleLeft      },
  { href: "/admin/reports",       label: "Reports",       icon: Flag            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (!["ADMIN", "ADMIN_SUPPORT"].includes(role)) router.push("/");
    }
  }, [status, session]);

  if (status === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Plus Jakarta Sans, sans-serif", color: "#5b403d" }}>
      Loading...
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fbf9f6" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#1b1c1a", display: "flex", flexDirection: "column", padding: "32px 0" }}>
        <div style={{ padding: "0 24px 32px", borderBottom: "1px solid #30312f" }}>
          <p style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", margin: 0 }}>House Market</p>
          <p style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 12, color: "#8f6f6c", margin: "4px 0 0" }}>Admin Panel</p>
        </div>
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, color: "#e4e2df",
              textDecoration: "none", fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 14, fontWeight: 500,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#30312f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", padding: "16px 24px", borderTop: "1px solid #30312f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={16} color="#875200" />
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{(session?.user as any)?.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#8f6f6c", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{(session?.user as any)?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
