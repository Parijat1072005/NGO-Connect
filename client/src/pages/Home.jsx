import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const ngoWork = [
        {
            title: "Education for All",
            desc: "Providing books and stationery to 500+ children.",
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Clean Water Project",
            desc: "Installing 20 new wells in rural communities.",
            img: "https://imgs.search.brave.com/kJY9vc-lbK1p16WjIz-RziQBksq6exOE4lGpNAsfgbc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXNv/dXJjZXMuaHVtYW5p/dHlmaXJzdGNhbmFk/YS5jYS9ibG9nLzA5/OWQzNWE1MjRhYTZj/NWVjOGQ3NmFkODg2/OTExNmJlLnBuZw"
        },
        {
            title: "Health & Wellness",
            desc: "Free medical checkup camps for elderly citizens.",
            img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="bg-blue-600 text-white py-20 px-8 text-center">
                <h1 className="text-5xl font-extrabold mb-4">Empower Change Today</h1>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                    Join our NGO platform. Register to support our cause and manage your contributions transparently.
                </p>
                <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition"
                >
                    Get Started / Donate
                </button>
            </header>

            {/* Impact Gallery Section */}
            <section className="py-16 px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Our Impact at a Glance</h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ngoWork.map((work, index) => (
                        <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all">
                            <img
                                src={work.img}
                                alt={work.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{work.title}</h3>
                                <p className="text-gray-600 text-sm">{work.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-gray-50 py-8 text-center text-gray-400 text-sm border-t">
                <p>&copy; 2026 NGO-Connect. Built for Transparency.</p>
            </footer>
        </div>
    );
};

export default Home;