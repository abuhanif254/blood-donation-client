import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaHome, FaUser, FaPlusCircle, FaList, FaUsers, FaFileAlt, FaTachometerAlt, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkBase = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group";
    const activeLink = "bg-primary text-white shadow-md";
    const inactiveLink = "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary";

    const getLinkClass = (path) => `${linkBase} ${isActive(path) ? activeLink : inactiveLink}`;

    return (
        <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <FaHome className="text-primary w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold font-heading text-gray-900 dark:text-white">BloodUnity</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="px-6 py-6 text-center">
                    <div className="relative inline-block">
                        <img
                            src={user?.avatar || "https://i.ibb.co.com/M6hj9K6/placeholder.jpg"}
                            alt={user?.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg mx-auto"
                        />
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide bg-primary/10 inline-block px-3 py-1 rounded-full mt-1">{user?.role}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Menu</p>

                    <Link className={getLinkClass('/dashboard')} to="/dashboard">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span>Overview</span>
                    </Link>

                    <Link className={getLinkClass('/dashboard/profile')} to="/dashboard/profile">
                        <FaUser className="w-5 h-5" />
                        <span>Profile</span>
                    </Link>

                    {/* Common User Links */}
                    <Link className={getLinkClass('/dashboard/create-donation-request')} to="/dashboard/create-donation-request">
                        <FaPlusCircle className="w-5 h-5" />
                        <span>Create Request</span>
                    </Link>

                    <Link className={getLinkClass('/dashboard/my-donation-requests')} to="/dashboard/my-donation-requests">
                        <FaList className="w-5 h-5" />
                        <span>My Requests</span>
                    </Link>

                    {/* Volunteer / Admin Links */}
                    {(user?.role === 'volunteer' || user?.role === 'admin') && (
                        <>
                            <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Volunteer</p>

                            <Link className={getLinkClass('/dashboard/all-blood-donation-request')} to="/dashboard/all-blood-donation-request">
                                <FaList className="w-5 h-5" />
                                <span>All Requests</span>
                            </Link>
                            <Link className={getLinkClass('/dashboard/content-management')} to="/dashboard/content-management">
                                <FaFileAlt className="w-5 h-5" />
                                <span>Content Management</span>
                            </Link>

                        </>
                    )}

                    {/* Admin Only Links */}
                    {user?.role === 'admin' && (
                        <>
                            <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administration</p>

                            <Link className={getLinkClass('/dashboard/all-users')} to="/dashboard/all-users">
                                <FaUsers className="w-5 h-5" />
                                <span>All Users</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer / Back to Home */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <Link to="/" className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <FaHome className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden glass"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
