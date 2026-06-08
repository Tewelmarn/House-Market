'use client'
import { useEffect, useState, useRef } from 'react'
import { MessageSquare, Send, Store } from 'lucide-react'

export default function ChatPage() {
  const [chats, setChats] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<any>(null)

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(s => {
      if (s && s.user) { setUserId(s.user.id); setUserName(s.user.name || 'User') }
    })
    fetch('/api/chat').then(r => r.json()).then(d => { setChats(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const loadMessages = (chatId: string) => {
    fetch('/api/chat/' + chatId + '/messages').then(r => r.json()).then(d => {
      setMessages(Array.isArray(d) ? d : [])
      setTimeout(() => bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' }), 100)
    })
  }

  const openChat = (chat: any) => {
    setActiveChat(chat)
    loadMessages(chat.id)
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(() => loadMessages(chat.id), 3000)
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return
    const content = input.trim()
    setInput('')
    await fetch('/api/chat/' + activeChat.id + '/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    loadMessages(activeChat.id)
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const otherParticipant = (chat: any) => chat.participants && chat.participants.find((p: any) => p.id !== userId)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: '#fff', borderRadius: '16px', border: '1px solid #e4e2df', overflow: 'hidden' }}>

      {/* Chat List */}
      <div style={{ width: '300px', borderRight: '1px solid #e4e2df', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e4e2df' }}>
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: '20px', color: '#1b1c1a', margin: 0 }}>Ol Toktok</h2>
          <p style={{ color: '#5b403d', fontSize: '13px', marginTop: '4px' }}>Messages</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && <p style={{ padding: '20px', color: '#5b403d', fontSize: '14px' }}>Luk i go...</p>}
          {!loading && chats.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <MessageSquare size={32} color='#e4beba' style={{ marginBottom: '8px' }} />
              <p style={{ color: '#8f6f6c', fontSize: '13px' }}>Nogat toktok yet. Tokim wanpela selaman!</p>
            </div>
          )}
          {chats.map((chat: any) => {
            const other = otherParticipant(chat)
            const lastMsg = chat.messages && chat.messages[0]
            const isActive = activeChat && activeChat.id === chat.id
            return (
              <div key={chat.id} onClick={() => openChat(chat)} style={{ padding: '16px 20px', cursor: 'pointer', background: isActive ? '#fff5f5' : 'transparent', borderLeft: isActive ? '3px solid #af101a' : '3px solid transparent', borderBottom: '1px solid #f5f3f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#ffdad6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={18} color='#af101a' />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1b1c1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.shop && chat.shop.name}</div>
                    <div style={{ fontSize: '12px', color: '#8f6f6c' }}>{other && other.name}</div>
                  </div>
                </div>
                {lastMsg && <p style={{ fontSize: '12px', color: '#8f6f6c', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastMsg.content}</p>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Message Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeChat ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#8f6f6c' }}>
            <MessageSquare size={48} color='#e4beba' style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, fontSize: '16px', color: '#1b1c1a' }}>Makim wanpela toktok</p>
            <p style={{ fontSize: '13px' }}>Klikim chat long left bai lukim ol message.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e4e2df', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ffdad6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color='#af101a' />
              </div>
              <div>
                <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, color: '#1b1c1a' }}>{activeChat.shop && activeChat.shop.name}</div>
                <div style={{ fontSize: '12px', color: '#5b403d' }}>{otherParticipant(activeChat) && otherParticipant(activeChat).name}</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8f6f6c', fontSize: '14px', marginTop: '32px' }}>
                  <p>Stat toktok nau! Tok save long ol samting.</p>
                </div>
              )}
              {messages.map((msg: any) => {
                const isMe = msg.senderId === userId
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '65%' }}>
                      {!isMe && <div style={{ fontSize: '11px', color: '#8f6f6c', marginBottom: '3px', paddingLeft: '4px' }}>{msg.sender && msg.sender.name}</div>}
                      <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#af101a' : '#f5f3f0', color: isMe ? '#fff' : '#1b1c1a', fontSize: '14px', lineHeight: '1.5' }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8f6f6c', marginTop: '3px', textAlign: isMe ? 'right' : 'left', paddingLeft: '4px' }}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-PG', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e4e2df', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder='Raitim toktok bilong yu... (Enter na salim)'
                rows={1}
                style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid #e4e2df', background: '#fbf9f6', fontSize: '14px', color: '#1b1c1a', outline: 'none', resize: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <button onClick={sendMessage} style={{ width: '44px', height: '44px', background: '#af101a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
