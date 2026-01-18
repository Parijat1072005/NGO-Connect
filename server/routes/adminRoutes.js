import express from 'express';
import { getStats, getAllUsers } from '../controllers/adminController.js';
import { Donation } from '../models/Donation.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/donations', async (req, res) => {
    const donations = await Donation.find().populate('userId', 'name email');
    res.json(donations);
});

export default router;