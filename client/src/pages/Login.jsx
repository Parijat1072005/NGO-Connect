import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user arrived here via the "Admin Login" button in Navbar
    const isAdminLogin = location.state?.isAdmin;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the intent (admin vs user) to the backend
            const res = await axios.post('/api/auth/login', {
                ...formData,
                portalType: isAdminLogin ? 'admin' : 'user'
            });

            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isAdminLogin ? "Admin Portal" : "User Login"}
                </h2>
                <input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input type="password" placeholder="Password" className="w-full mb-6 p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button className={`w-full p-2 rounded text-white ${isAdminLogin ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {isAdminLogin ? "Verify Admin Credentials" : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default Login;