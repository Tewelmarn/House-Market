import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/chat/conversations ? list my conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, s.name as shop_name,
              u.full_name as buyer_name,
              (SELECT body FROM messages m WHERE m.conversation_id = c.id
               ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages m WHERE m.conversation_id = c.id
               ORDER BY created_at DESC LIMIT 1) as last_message_at,
              (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id
               AND m.is_read = false AND m.sender_id != $1) as unread_count
       FROM conversations c
       JOIN shops s ON s.id = c.shop_id
       JOIN users u ON u.id = c.buyer_id
       WHERE c.buyer_id = $1 OR s.owner_id = $1
       ORDER BY last_message_at DESC NULLS LAST`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat/conversations/:id/messages
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, u.full_name as sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [req.params.id]
    );
    // mark as read
    await pool.query(
      `UPDATE messages SET is_read = true
       WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false`,
      [req.params.id, req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/conversations ? start or get existing conversation
router.post('/conversations', authenticate, async (req, res) => {
  const { shop_id } = req.body;
  if (!shop_id) return res.status(400).json({ error: 'shop_id required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO conversations (shop_id, buyer_id)
       VALUES ($1, $2)
       ON CONFLICT (shop_id, buyer_id) DO UPDATE SET updated_at = NOW()
       RETURNING *`,
      [shop_id, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/conversations/:id/messages ? send message (REST fallback)
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: 'body required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, body)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, req.user.id, body]
    );
    await pool.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
