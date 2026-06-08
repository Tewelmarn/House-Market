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
  const { role, banned } = await req.json();
  if (role && admin.role !== "ADMIN") return NextResponse.json({ error: "Super admin only" }, { status: 403 });
  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { ...(role !== undefined && { role }), ...(banned !== undefined && { banned }) },
    select: { id: true, name: true, email: true, role: true, banned: true },
  });
  return NextResponse.json(updated);
}