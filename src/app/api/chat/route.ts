import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')

  const where: any = shopId
    ? { shopId, participants: { some: { id: user.id } } }
    : { participants: { some: { id: user.id } } }

  const chats = await prisma.chat.findMany({
    where,
    include: {
      shop: { select: { id: true, name: true } },
      participants: { select: { id: true, name: true, role: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(chats)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { shopId } = await req.json()

  const shop = await prisma.shop.findUnique({ where: { id: shopId } })
  if (!shop) return NextResponse.json({ error: 'House Market not found' }, { status: 404 })

  const existing = await prisma.chat.findFirst({
    where: { shopId, participants: { some: { id: user.id } } }
  })
  if (existing) return NextResponse.json(existing)

  const chat = await prisma.chat.create({
    data: {
      shopId,
      participants: { connect: [{ id: user.id }, { id: shop.ownerId }] }
    },
    include: { shop: true, participants: true }
  })
  return NextResponse.json(chat, { status: 201 })
}
