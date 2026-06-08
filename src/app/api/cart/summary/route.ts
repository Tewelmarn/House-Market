import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCartSummary, CartLineItem } from "@/lib/discount";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: { media: { take: 1 }, shop: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ items: [], subtotal: 0, totalSavings: 0, grandTotal: 0 });
  }

  const lineItems: CartLineItem[] = cart.items.map((ci) => ({
    productId: ci.product.id,
    name: ci.product.name,
    price: ci.product.price,
    quantity: ci.quantity,
    imageUrl: ci.product.media[0]?.url ?? undefined,
    shopName: ci.product.shop?.name ?? undefined,
    tiers: (ci.product.discountTiers as any) ?? undefined,
  }));

  return NextResponse.json(calculateCartSummary(lineItems));
}
