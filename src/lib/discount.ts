export type DiscountTier = {
  minQty: number;
  discountPct: number; // 0-100
};

// Default PNG marketplace tiers — override per product via product.discountTiers JSON field
export const DEFAULT_TIERS: DiscountTier[] = [
  { minQty: 5,  discountPct: 5  },
  { minQty: 10, discountPct: 10 },
  { minQty: 20, discountPct: 15 },
  { minQty: 50, discountPct: 20 },
];

export function getDiscount(quantity: number, tiers: DiscountTier[] = DEFAULT_TIERS): number {
  const applicable = [...tiers]
    .filter((t) => quantity >= t.minQty)
    .sort((a, b) => b.minQty - a.minQty);
  return applicable[0]?.discountPct ?? 0;
}

export type CartLineItem = {
  productId: string;
  name: string;
  price: number;       // base price in PGK (stored as float in DB)
  quantity: number;
  imageUrl?: string;
  shopName?: string;
  tiers?: DiscountTier[];
};

export type CartSummary = {
  items: (CartLineItem & {
    discountPct: number;
    discountedPrice: number;
    lineTotal: number;
    savings: number;
  })[];
  subtotal: number;
  totalSavings: number;
  grandTotal: number;
};

export function calculateCartSummary(items: CartLineItem[]): CartSummary {
  const enriched = items.map((item) => {
    const discountPct = getDiscount(item.quantity, item.tiers);
    const discountedPrice = item.price * (1 - discountPct / 100);
    const lineTotal = discountedPrice * item.quantity;
    const savings = (item.price - discountedPrice) * item.quantity;
    return { ...item, discountPct, discountedPrice, lineTotal, savings };
  });

  const subtotal = enriched.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalSavings = enriched.reduce((s, i) => s + i.savings, 0);
  const grandTotal = subtotal - totalSavings;

  return { items: enriched, subtotal, totalSavings, grandTotal };
}
