export function getRefFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("ref");
}

export function storeRef(code: string) {
  sessionStorage.setItem("affiliate_ref", code);
}

export function getStoredRef(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("affiliate_ref");
}

export function clearRef() {
  sessionStorage.removeItem("affiliate_ref");
}

export async function recordConversion(productId: string) {
  const code = getStoredRef();
  if (!code) return;
  await fetch("/api/affiliate/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, productId }),
  });
  clearRef();
}
