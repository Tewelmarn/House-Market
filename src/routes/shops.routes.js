import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// GET /api/shops
router.get('/', async (req, res) => {
  const { province, category } = req.query;
  let query = `SELECT * FROM shops WHERE is_active = true`;
  const params = [];
  if (province) { params.push(province); query += ` AND province = $${params.length}`; }
  if (category) { params.push(category); query += ` AND category = $${params.length}`; }
  query += ` ORDER BY created_at DESC`;
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET /api/shops/:id
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM shops WHERE id = $1`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Shop not found' });
  res.json(rows[0]);
});

// POST /api/shops
router.post('/', authenticate, authorize('seller', 'super_admin'), async (req, res) => {
  const { name, description, category, province, whatsapp } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO shops (owner_id, name, description, category, province, whatsapp)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, name, description, category, province, whatsapp]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/shops/:id
router.put('/:id', authenticate, async (req, res) => {
  const { name, description, category, province, whatsapp, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE shops SET name=$1, description=$2, category=$3, province=$4,
       whatsapp=$5, is_active=$6 WHERE id=$7 AND owner_id=$8 RETURNING *`,
      [name, description, category, province, whatsapp, is_active, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Shop not found or unauthorized' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/shops/:id
router.delete('/:id', authenticate, async (req, res) => {
  const { rows } = await pool.query(
    `DELETE FROM shops WHERE id=$1 AND owner_id=$2 RETURNING id`,
    [req.params.id, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Shop not found or unauthorized' });
  res.json({ deleted: rows[0].id });
});

export default router;
