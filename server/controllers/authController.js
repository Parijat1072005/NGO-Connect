import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await User.create({ name, email, password: hashedPassword });

        // Generate Token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Included 'email' in the response so the frontend can store and display it
        res.status(201).json({
            token,
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, portalType } = req.body; // Get portalType from frontend
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        // NEW LOGIC: Enforce Portal Access
        if (portalType === 'admin' && user.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Use User Login" });
        }

        if (portalType === 'user' && user.role === 'admin') {
            return res.status(403).json({ message: "Admins must use the Admin Portal" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            name: user.name,
            email: user.email,
            _id: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};