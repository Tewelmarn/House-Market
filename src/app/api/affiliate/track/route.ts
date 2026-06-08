import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code      = searchParams.get("ref");
  const productId = searchParams.get("pid");

  if (!code || !productId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const link = await prisma.affiliateLink.findFirst({ where: { code, productId } });
  if (!link) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  await prisma.affiliateLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${base}/products/${productId}?ref=${code}`);
}
