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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await req.json();
  const flag = await prisma.featureFlag.update({ where: { id: params.id }, data });
  return NextResponse.json(flag);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (admin.role !== "ADMIN") return NextResponse.json({ error: "Super admin only" }, { status: 403 });
  await prisma.featureFlag.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}