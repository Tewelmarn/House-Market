import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/gamification";

export async function GET() {
  const users = await prisma.user.findMany({
    where:   { points: { gt: 0 } },
    orderBy: { points: "desc" },
    take:    20,
    select:  { id: true, name: true, points: true, badges: true, role: true },
  });

  const ranked = users.map((u, i) => ({
    ...u,
    rank:  i + 1,
    level: calculateLevel(u.points ?? 0),
  }));

  return NextResponse.json(ranked);
}
