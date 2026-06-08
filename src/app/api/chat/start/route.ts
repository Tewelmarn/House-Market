import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { shopId } = await req.json()

  const shop = await prisma.shop.findUnique({ where: { id: shopId } })
  if (!shop) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await prisma.chat.findFirst({
    where: { shopId, participants: { some: { id: user.id } } }
  })
  if (existing) return NextResponse.json({ chatId: existing.id })

  const chat = await prisma.chat.create({
    data: { shopId, participants: { connect: [{ id: user.id }, { id: shop.ownerId }] } }
  })
  return NextResponse.json({ chatId: chat.id })
}
