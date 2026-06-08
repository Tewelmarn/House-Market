import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !["ADMIN", "ADMIN_SUPPORT"].includes(user.role)) return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const flags = await prisma.featureFlag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(flags);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { name, enabled, description } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const flag = await prisma.featureFlag.upsert({
    where: { name },
    update: { enabled, description },
    create: { name, enabled: enabled ?? false, description },
  });
  return NextResponse.json(flag);
}