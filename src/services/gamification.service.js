import pool from '../db/pool.js';
import { getLevelByPoints } from '../data/sellerLevels.js';

export async function awardPoints(sellerId, pts, reason) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO point_events (seller_id, points, reason, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [sellerId, pts, reason]
    );

    const { rows } = await client.query(
      `UPDATE sellers
       SET total_points = total_points + $1
       WHERE id = $2
       RETURNING total_points`,
      [pts, sellerId]
    );

    const newTotal = rows[0].total_points;
    const newLevel = getLevelByPoints(newTotal);

    await client.query(
      `UPDATE sellers SET level = $1, level_name = $2 WHERE id = $3`,
      [newLevel.level, newLevel.name, sellerId]
    );

    await client.query('COMMIT');
    return { totalPoints: newTotal, level: newLevel };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getSellerGamification(sellerId) {
  const { rows } = await pool.query(
    `SELECT total_points, level, level_name FROM sellers WHERE id = $1`,
    [sellerId]
  );
  if (!rows.length) throw new Error('Seller not found');
  return rows[0];
}
