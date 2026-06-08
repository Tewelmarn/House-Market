import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  const { shop_id, category, province } = req.query;
  let query = `SELECT p.*, s.name as shop_name FROM products p JOIN shops s ON s.id = p.shop_id WHERE p.is_active = true`;
  const params = [];
  if (shop_id)  { params.push(shop_id);  query += ` AND p.shop_id  = $${params.length}`; }
  if (category) { params.push(category); query += ` AND p.category = $${params.length}`; }
  if (province) { params.push(province); query += ` AND p.province = $${params.length}`; }
  query += ` ORDER BY p.created_at DESC`;
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, array_agg(pm.url ORDER BY pm.sort_order) FILTER (WHERE pm.url IS NOT NULL) as media
     FROM products p LEFT JOIN product_media pm ON pm.product_id = p.id
     WHERE p.id = $1 GROUP BY p.id`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

// POST /api/products
router.post('/', authenticate, async (req, res) => {
  const { shop_id, name, description, price, quantity, category, province, shipping_info } = req.body;
  if (!shop_id || !name || !price) return res.status(400).json({ error: 'shop_id, name, price required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (shop_id, name, description, price, quantity, category, province, shipping_info)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [shop_id, name, description, price, quantity ?? 0, category, province, shipping_info]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', authenticate, async (req, res) => {
  const { name, description, price, quantity, category, province, shipping_info, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, quantity=$4,
       category=$5, province=$6, shipping_info=$7, is_active=$8 WHERE id=$9 RETURNING *`,
      [name, description, price, quantity, category, province, shipping_info, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authenticate, async (req, res) => {
  const { rows } = await pool.query(`DELETE FROM products WHERE id=$1 RETURNING id`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Product not found' });
  res.json({ deleted: rows[0].id });
});

export default router;
