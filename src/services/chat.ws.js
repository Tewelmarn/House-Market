import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const rooms = new Map(); // conversationId -> Set of ws clients

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws/chat' });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.replace('/ws/chat?', ''));
    const token  = params.get('token');
    const convId = params.get('conversation_id');

    if (!token || !convId) return ws.close(1008, 'Missing token or conversation_id');

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return ws.close(1008, 'Invalid token');
    }

    ws.userId = user.id;
    ws.convId  = convId;

    if (!rooms.has(convId)) rooms.set(convId, new Set());
    rooms.get(convId).add(ws);

    ws.on('message', async (raw) => {
      let data;
      try { data = JSON.parse(raw); } catch { return; }

      if (data.type === 'message' && data.body) {
        try {
          const { rows } = await pool.query(
            `INSERT INTO messages (conversation_id, sender_id, body)
             VALUES ($1, $2, $3) RETURNING *`,
            [convId, user.id, data.body]
          );
          await pool.query(
            `UPDATE conversations SET updated_at = NOW() WHERE id = $1`, [convId]
          );
          const payload = JSON.stringify({ type: 'message', message: rows[0] });
          rooms.get(convId)?.forEach(client => {
            if (client.readyState === 1) client.send(payload);
          });
        } catch (err) {
          ws.send(JSON.stringify({ type: 'error', error: err.message }));
        }
      }

      if (data.type === 'typing') {
        const payload = JSON.stringify({ type: 'typing', userId: user.id });
        rooms.get(convId)?.forEach(client => {
          if (client !== ws && client.readyState === 1) client.send(payload);
        });
      }
    });

    ws.on('close', () => {
      rooms.get(convId)?.delete(ws);
      if (rooms.get(convId)?.size === 0) rooms.delete(convId);
    });
  });

  console.log('WebSocket chat server ready at /ws/chat');
}
