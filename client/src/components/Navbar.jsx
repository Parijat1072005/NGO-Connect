import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navStyle = ({ isActive }) => 
        isActive 
            ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1" 
            : "text-gray-600 hover:text-blue-600 transition font-medium";

    return (
        <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
            <NavLink to="/" className="text-2xl font-bold text-blue-600">NGO-Connect</NavLink>
            <div className="space-x-6 flex items-center">
                <NavLink to="/" className="hover:text-blue-600">Home</NavLink>
                {user ? (
                    <>
                        <NavLink to="/dashboard" className="hover:text-blue-600">Dashboard</NavLink>
                        <button onClick={() => { logout(); navigate('/'); }} className="text-red-500">Logout</button>
                    </>
                ) : (
                    <>
                        {/* Admin Login Button - Passes state to Login.jsx */}
                        <button 
                            onClick={() => navigate('/login', { state: { isAdmin: true } })}
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Admin Login
                        </button>
                        
                        <NavLink to="/login" className="hover:text-blue-600">Login</NavLink>
                        <NavLink to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;