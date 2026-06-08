import { Router } from 'express';
import { awardPoints, getSellerGamification } from '../services/gamification.service.js';
import { getLevelProgress } from '../data/sellerLevels.js';

const router = Router();

router.get('/:sellerId', async (req, res) => {
  try {
    const data = await getSellerGamification(req.params.sellerId);
    const progress = getLevelProgress(data.total_points);
    res.json({ ...data, progress });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post('/:sellerId/award', async (req, res) => {
  const { pts, reason } = req.body;
  if (!pts || !reason) return res.status(400).json({ error: 'pts and reason required' });
  try {
    const result = await awardPoints(req.params.sellerId, pts, reason);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
