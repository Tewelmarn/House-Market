import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function getProductOrFail(productId: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { shop: true }
  })
  if (!product || product.shop.ownerId !== userId) return null
  return product
}

export async function GET(_: Request, { params }: { params: { productId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { shop: true, media: true }
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const product = await getProductOrFail(params.productId, user.id)
  if (!product) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.product.update({ where: { id: params.productId }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { productId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any

  const product = await getProductOrFail(params.productId, user.id)
  if (!product) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  await prisma.product.delete({ where: { id: params.productId } })
  return NextResponse.json({ success: true })
}
