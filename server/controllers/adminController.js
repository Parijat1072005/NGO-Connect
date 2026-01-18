import { User } from '../models/User.js';
import { Donation } from '../models/Donation.js';

export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const donations = await Donation.find({ status: 'success' });
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

        res.status(200).json({ totalUsers, totalAmount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};