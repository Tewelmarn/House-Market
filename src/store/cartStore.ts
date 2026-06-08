import { create } from "zustand";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  discountPct: number;
  discountedPrice: number;
  lineTotal: number;
  savings: number;
  imageUrl?: string;
  shopName?: string;
};

export type CartSummary = {
  items: CartItem[];
  subtotal: number;
  totalSavings: number;
  grandTotal: number;
};

type CartStore = {
  summary: CartSummary | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearStore: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  summary: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cart/summary");
      if (res.ok) set({ summary: await res.json() });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity) => {
    await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    // Re-fetch summary
    const res = await fetch("/api/cart/summary");
    if (res.ok) set({ summary: await res.json() });
  },

  updateItem: async (itemId, quantity) => {
    await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const res = await fetch("/api/cart/summary");
    if (res.ok) set({ summary: await res.json() });
  },

  removeItem: async (itemId) => {
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    const res = await fetch("/api/cart/summary");
    if (res.ok) set({ summary: await res.json() });
  },

  clearStore: () => set({ summary: null }),
}));
