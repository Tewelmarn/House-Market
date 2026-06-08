import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const existing = await prisma.affiliateLink.findFirst({
    where: { userId: session.user.id, productId },
  });
  if (existing) return NextResponse.json(existing);

  const code = nanoid(10);
  const link = await prisma.affiliateLink.create({
    data: { userId: session.user.id, productId, code },
  });

  return NextResponse.json(link, { status: 201 });
}
