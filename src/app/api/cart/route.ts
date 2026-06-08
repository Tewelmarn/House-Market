import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              media: { take: 1 },
              shop: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(cart ?? { items: [] });
}
