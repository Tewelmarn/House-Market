import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  if (product.quantity !== null && quantity > product.quantity) {
    return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
  }

  let cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } });
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
    : await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });

  return NextResponse.json(item, { status: 201 });
}
