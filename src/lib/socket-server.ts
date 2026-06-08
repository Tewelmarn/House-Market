import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer | null = null

export function getSocketServer(httpServer?: any): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
      path: '/api/socketio',
    })

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      socket.on('join_chat', (chatId: string) => {
        socket.join(chatId)
      })

      socket.on('send_message', async (data: { chatId: string; content: string; senderId: string; senderName: string }) => {
        io!.to(data.chatId).emit('receive_message', {
          id: Date.now().toString(),
          chatId: data.chatId,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          createdAt: new Date().toISOString(),
        })
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })
    })
  }
  return io
}
