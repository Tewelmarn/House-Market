import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BADGES, calculateLevel } from "@/lib/gamification";

// Internal-only: called server-side after events (product created, sale, review, etc.)
export async function POST(req: NextRequest) {
  const { userId, points, badgeId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true, badges: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newPoints  = (user.points ?? 0) + (points ?? 0);
  const badges     = (user.badges as string[]) ?? [];
  const newBadges  = badgeId && !badges.includes(badgeId) ? [...badges, badgeId] : badges;

  // Auto-award level badges
  const level = calculateLevel(newPoints);
  const levelBadge = BADGES.find((b) => b.type === "level" && b.requiredLevel === level.level);
  if (levelBadge && !newBadges.includes(levelBadge.id)) newBadges.push(levelBadge.id);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, badges: newBadges },
    select: { id: true, points: true, badges: true },
  });

  return NextResponse.json({ ...updated, level: calculateLevel(newPoints) });
}
