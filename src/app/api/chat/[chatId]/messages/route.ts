import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { chatId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await prisma.message.findMany({
    where: { chatId: params.chatId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(messages)
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  const { content } = await req.json()

  const message = await prisma.message.create({
    data: { chatId: params.chatId, senderId: user.id, content },
    include: { sender: { select: { id: true, name: true } } }
  })

  await prisma.chat.update({ where: { id: params.chatId }, data: { updatedAt: new Date() } })

  return NextResponse.json(message, { status: 201 })
}
