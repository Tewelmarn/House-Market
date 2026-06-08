import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.affiliateLink.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: { id: true, name: true, price: true, media: { take: 1 } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const enriched = links.map((l) => ({
    ...l,
    shareUrl: `${appUrl}/api/affiliate/track?ref=${l.code}&pid=${l.productId}`,
  }));

  return NextResponse.json(enriched);
}
