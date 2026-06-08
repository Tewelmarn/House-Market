import { Router } from 'express';
import pool from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// --- SHOP REVIEWS ---

// GET /api/reviews/shops/:shopId
router.get('/shops/:shopId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, u.full_name as reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.shop_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.shopId]
    );
    const avg = rows.reduce((sum, r) => sum + r.rating, 0) / (rows.length || 1);
    res.json({ reviews: rows, average_rating: parseFloat(avg.toFixed(1)), total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/shops/:shopId
router.post('/shops/:shopId', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ error: 'rating required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews (shop_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (shop_id, reviewer_id)
       DO UPDATE SET rating = $3, comment = $4
       RETURNING *`,
      [req.params.shopId, req.user.id, rating, comment ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/shops/:shopId
router.delete('/shops/:shopId', authenticate, async (req, res) => {
  const { rows } = await pool.query(
    `DELETE FROM reviews WHERE shop_id = $1 AND reviewer_id = $2 RETURNING id`,
    [req.params.shopId, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Review not found' });
  res.json({ deleted: rows[0].id });
});

// --- PRODUCT REVIEWS ---

// GET /api/reviews/products/:productId
router.get('/products/:productId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT pr.*, u.full_name as reviewer_name
       FROM product_reviews pr
       JOIN users u ON u.id = pr.reviewer_id
       WHERE pr.product_id = $1
       ORDER BY pr.created_at DESC`,
      [req.params.productId]
    );
    const avg = rows.reduce((sum, r) => sum + r.rating, 0) / (rows.length || 1);
    res.json({ reviews: rows, average_rating: parseFloat(avg.toFixed(1)), total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/products/:productId
router.post('/products/:productId', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ error: 'rating required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO product_reviews (product_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, reviewer_id)
       DO UPDATE SET rating = $3, comment = $4
       RETURNING *`,
      [req.params.productId, req.user.id, rating, comment ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/products/:productId
router.delete('/products/:productId', authenticate, async (req, res) => {
  const { rows } = await pool.query(
    `DELETE FROM product_reviews WHERE product_id = $1 AND reviewer_id = $2 RETURNING id`,
    [req.params.productId, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Review not found' });
  res.json({ deleted: rows[0].id });
});

export default router;
