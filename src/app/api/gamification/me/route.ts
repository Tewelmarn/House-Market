import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel, BADGES } from "@/lib/gamification";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, points: true, badges: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const level    = calculateLevel(user.points ?? 0);
  const earned   = BADGES.filter((b) => (user.badges as string[])?.includes(b.id));
  const locked   = BADGES.filter((b) => !(user.badges as string[])?.includes(b.id));

  return NextResponse.json({ ...user, level, earned, locked });
}
