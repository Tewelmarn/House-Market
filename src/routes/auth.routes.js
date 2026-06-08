import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;
  if (!email || !password || !full_name)
    return res.status(400).json({ error: 'email, password, full_name required' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role`,
      [email, hash, full_name, phone ?? null, role ?? 'buyer']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });
  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND is_active = true`, [email]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role, email: rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: rows[0].id, email: rows[0].email, full_name: rows[0].full_name, role: rows[0].role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
