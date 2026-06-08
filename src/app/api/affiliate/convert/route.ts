import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, productId } = await req.json();
  if (!code || !productId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const link = await prisma.affiliateLink.findFirst({ where: { code, productId } });
  if (!link) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  await prisma.affiliateLink.update({
    where: { id: link.id },
    data: { conversions: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
