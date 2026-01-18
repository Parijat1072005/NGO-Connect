import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Join the Cause</h2>
                <input type="text" placeholder="Name" className="w-full mb-4 p-2 border rounded" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="w-full mb-6 p-2 border rounded" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
                <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;