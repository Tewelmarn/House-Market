import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function ownsItem(userId: string, itemId: string) {
  return prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
  });
}

const updateSchema = z.object({ quantity: z.number().int().min(1) });

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await ownsItem(session.user.id, params.itemId);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await prisma.cartItem.update({
    where: { id: params.itemId },
    data: { quantity: parsed.data.quantity },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await ownsItem(session.user.id, params.itemId);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id: params.itemId } });
  return NextResponse.json({ success: true });
}