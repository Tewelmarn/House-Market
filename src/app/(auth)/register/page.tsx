"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        role: fd.get("role"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fbf9f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "448px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <Image src="/logo.png" alt="House Market" width={120} height={120} style={{ objectFit: "contain" }} />
          </div>
          <p style={{ color: "#5b403d", fontSize: "14px", marginTop: "4px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Create your account</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e4beba", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 12px rgba(78,52,46,0.08)" }}>
          <h2 style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1b1c1a", marginBottom: "24px", marginTop: 0 }}>
            Register
          </h2>

          {error && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "14px", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Your name" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1b1c1a", marginBottom: "6px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  minLength={field.name === "password" ? 6 : undefined}
                  placeholder={field.placeholder}
                  style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e4beba", backgroundColor: "#f5f3f0", fontSize: "14px", color: "#1b1c1a", outline: "none", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1b1c1a", marginBottom: "6px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                I am a…
              </label>
              <select
                name="role"
                style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e4beba", backgroundColor: "#f5f3f0", fontSize: "14px", color: "#1b1c1a", boxSizing: "border-box", fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                <option value="BUYER">Buyer — I want to shop</option>
                <option value="SELLER">Seller — I want to sell</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", backgroundColor: loading ? "#c94444" : "#af101a", color: "#ffffff", fontWeight: 600, fontSize: "15px", padding: "11px", borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#5b403d", marginTop: "24px", marginBottom: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#af101a", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
