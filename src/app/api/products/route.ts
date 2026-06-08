import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  price: z.number().min(0),
  quantity: z.number().int().min(0).default(0),
  category: z.string().optional(),
  location: z.string().optional(),
  shippingInfo: z.string().optional(),
  bulkDiscountQty: z.number().int().optional(),
  bulkDiscountPrice: z.number().optional(),
  shopId: z.string().min(1),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')

  const where: any = shopId ? { shopId } : { shop: { ownerId: user.id } }

  const products = await prisma.product.findMany({
    where,
    include: { shop: { select: { id: true, name: true } }, media: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const body = await req.json()
  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const shop = await prisma.shop.findUnique({ where: { id: parsed.data.shopId } })
  if (!shop || shop.ownerId !== user.id)
    return NextResponse.json({ error: 'House Market not found or forbidden' }, { status: 403 })

  const product = await prisma.product.create({ data: parsed.data })
  return NextResponse.json(product, { status: 201 })
}
