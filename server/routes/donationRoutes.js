import express from 'express';
import { getUserDonations } from '../controllers/donationController.js';

const router = express.Router();

// Route to fetch successful donations for a specific user
router.get('/user/:userId', getUserDonations);

export default router;