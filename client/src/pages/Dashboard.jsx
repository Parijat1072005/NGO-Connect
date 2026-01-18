import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);
    const [adminData, setAdminData] = useState({ users: [], donations: [] });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfile, setShowProfile] = useState(false);

    // Admin Filter & Sort States
    const [sortType, setSortType] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');

    // Memoized data loader to ensure it can be called after payment
    const loadData = useCallback(async () => {
        if (!user?._id) return;
        try {
            if (user.role === 'admin') {
                const [uRes, dRes] = await Promise.all([
                    axios.get('/api/admin/users'),
                    axios.get('/api/admin/donations')
                ]);
                setAdminData({ users: uRes.data, donations: dRes.data });
            } else {
                const res = await axios.get(`/api/donations/user/${user._id}`);
                setHistory(res.data);
            }
        } catch (err) {
            console.error("Data fetch failed", err);
        }
    }, [user?._id, user?.role]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Admin Sorting and Filtering Logic
    const processedDonations = adminData.donations
        .filter(d => statusFilter === 'all' || d.status === statusFilter)
        .sort((a, b) => {
            if (sortType === 'biggest') return b.amount - a.amount; // Sort by amount descending
            return new Date(b.createdAt) - new Date(a.createdAt); // Default newest first
        });

    const filteredUsers = adminData.users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDonate = async () => {
        if (!amount || amount <= 0) return alert("Enter valid amount");
        setLoading(true);
        try {
            const { data: order } = await axios.post('/api/payments/order', {
                amount,
                userId: user._id
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "NGO Support",
                description: "Registration & Donation",
                order_id: order.id,
                handler: async (response) => {
                    await axios.post('/api/payments/verify', {
                        ...response,
                        userId: user._id,
                        amount
                    });
                    alert("Donation successful!");
                    setAmount('');
                    // Manual refresh to update user's specific history table
                    setTimeout(() => loadData(), 1000);
                },
                modal: {
                    ondismiss: async () => {
                        setLoading(false);
                        // Optional: Tell backend the user closed the modal so we can mark as failed
                        await axios.post('/api/payments/failure', { orderId: order.id });
                        loadData();
                    }
                },
                theme: { color: "#2563eb" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Payment initialization failed");
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Name,Email,Role"].concat(adminData.users.map(u => `${u.name},${u.email},${u.role}`)).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registrations.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            {showProfile && user && (
                <div className="fixed inset-0 backdrop-blur-sm bg-slate-500/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registration Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Full Name</p>
                                <p className="text-lg text-gray-700 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email Address</p>
                                <p className="text-lg text-gray-700 font-medium">{user.email || "Not Available"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Assigned Role</p>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold capitalize">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProfile(false)}
                            className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl transition font-bold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {user.role === 'admin' ? "Admin Control Center" : `Hello, ${user.name}`}
                    </h1>
                    <button
                        onClick={() => setShowProfile(true)}
                        className="text-blue-600 hover:underline text-sm font-medium mt-1"
                    >
                        View Registration Details →
                    </button>
                </div>
                {user.role === 'admin' && (
                    <button onClick={exportData} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow-sm font-bold">
                        Export to CSV
                    </button>
                )}
            </header>

            {user.role === 'admin' ? (
                <div className="space-y-8">
                    {/* Admin Dashboard Controls */}
                    <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 mb-1">SORT CONTRIBUTIONS</span>
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="newest">Latest First</option>
                                <option value="biggest">Biggest First</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-500 mb-1">STATUS FILTER</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="all">All Statuses</option>
                                <option value="success">Successful</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Registration Management</h2>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="border p-2 rounded text-sm w-1/2"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="overflow-y-auto max-h-96">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-gray-50 text-gray-600 text-sm">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(u => (
                                            <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                                                <td className="p-3 text-sm font-medium">{u.name}</td>
                                                <td className="p-3 text-sm text-gray-500">{u.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Donation Records</h2>
                            <div className="overflow-y-auto max-h-96 space-y-3">
                                {processedDonations.map(d => (
                                    <div key={d._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-700">₹{d.amount}</p>
                                            <p className="text-xs text-blue-600 font-medium">{d.userId?.name || 'User'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {d.status.toUpperCase()}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-blue-800">Support Our Cause</h2>
                        <div className="flex gap-4">
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Enter Amount (INR)" />
                            <button onClick={handleDonate} disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                                {loading ? "Processing..." : "Donate Now"}
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Contribution History</h2>
                        {history.length === 0 ? <p className="text-gray-400 italic">No donations yet.</p> : (
                            <div className="space-y-3">
                                {history.map(h => (
                                    <div key={h._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-700">₹{h.amount}</p>
                                            <p className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`font-bold px-3 py-1 rounded-full text-xs ${h.status === 'success' ? 'bg-green-100 text-green-600' :
                                                h.status === 'failed' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {h.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;