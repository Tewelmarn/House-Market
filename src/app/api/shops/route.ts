import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createShopSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  category: z.string().min(1),
  location: z.string().optional(),
  whatsapp: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const shops = await prisma.shop.findMany({
    where: { ownerId: user.id },
    include: { _count: { select: { products: true, members: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(shops)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  if (!['SELLER','ADMIN'].includes(user.role))
    return NextResponse.json({ error: 'Only sellers can create shops' }, { status: 403 })

  const body = await req.json()
  const parsed = createShopSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const shop = await prisma.shop.create({
    data: { ...parsed.data, ownerId: user.id }
  })
  return NextResponse.json(shop, { status: 201 })
}
