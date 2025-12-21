import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkClass = (path) => `block px-4 py-2 mt-2 text-sm font-semibold rounded-lg transition duration-200 ${isActive(path) ? 'bg-red-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;

    return (
        <div className={`fixed inset-y-0 left-0 z-30 w-64 h-screen px-4 py-8 bg-gray-900 border-r border-gray-800 shadow-xl transition duration-300 transform md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-red-500 text-center tracking-wider w-full">Dashboard</h2>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col justify-between flex-1 mt-6 overflow-y-auto">
                <nav className="space-y-1">
                    <Link className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition duration-200" to="/">
                        ← Back to Home
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <Link className={linkClass('/dashboard')} to="/dashboard">Overview</Link>
                    <Link className={linkClass('/dashboard/profile')} to="/dashboard/profile">Profile</Link>

                    {/* Links visible to ALL authenticated users (Donors, Volunteers, Admins) */}
                    <Link className={linkClass('/dashboard/create-donation-request')} to="/dashboard/create-donation-request">Create Request</Link>
                    <Link className={linkClass('/dashboard/my-donation-requests')} to="/dashboard/my-donation-requests">My Requests</Link>

                    {/* Volunteer & Admin Only View */}
                    {(user.role === 'volunteer' || user.role === 'admin') && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volunteer</p>
                            </div>
                            <Link className={linkClass('/dashboard/all-blood-donation-request')} to="/dashboard/all-blood-donation-request">All Requests</Link>
                        </>
                    )}

                    {/* Admin Only View */}
                    {user.role === 'admin' && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</p>
                            </div>
                            <Link className={linkClass('/dashboard/all-users')} to="/dashboard/all-users">All Users</Link>
                            <Link className={linkClass('/dashboard/content-management')} to="/dashboard/content-management">Content</Link>
                        </>
                    )}
                </nav>
            </div>
            <div className="mt-auto">
                <div className="flex items-center px-4 py-3 bg-gray-800 rounded-lg">
                    <img className="h-8 w-8 rounded-full object-cover" src={user.avatar} alt={user.name} />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
