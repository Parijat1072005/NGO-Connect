import { Donation } from '../models/Donation.js';

export const getUserDonations = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find successful donations for this user, sorted by newest first
        const donations = await Donation.find({userId}).sort({ createdAt: -1 });

        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donation history" });
    }
};