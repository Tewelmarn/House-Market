import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function getShopOrFail(shopId: string, userId: string) {
  const shop = await prisma.shop.findUnique({ where: { id: shopId } })
  if (!shop) return null
  if (shop.ownerId !== userId) return null
  return shop
}

export async function GET(_: Request, { params }: { params: { shopId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const shop = await prisma.shop.findUnique({
    where: { id: params.shopId },
    include: { products: true, members: { include: { user: true } } }
  })
  if (!shop) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(shop)
}

export async function PATCH(req: Request, { params }: { params: { shopId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const shop = await getShopOrFail(params.shopId, user.id)
  if (!shop) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.shop.update({ where: { id: params.shopId }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { shopId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const shop = await getShopOrFail(params.shopId, user.id)
  if (!shop) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  await prisma.shop.delete({ where: { id: params.shopId } })
  return NextResponse.json({ success: true })
}
