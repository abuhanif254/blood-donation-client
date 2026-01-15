import { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import useAuth from '../hooks/useAuth';
import ThemeContext from '../context/ThemeProvider';
import {
    HiMenuAlt3,
    HiX,
    HiOutlineUserCircle,
    HiOutlineLogout,
    HiOutlineViewGrid,
    HiSun,
    HiMoon
} from 'react-icons/hi';
import logo from '../assets/fav.jpg'; // Make sure you have a logo placeholder or use text

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/donation-requests', label: 'Donation Requests' },
        { path: '/blog', label: 'Blog' },
        { path: '/funding', label: 'Funding' },
        { path: '/about', label: 'About' },
    ];

    // Additional links for logged-in users could be added here or handled via logic

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {/* Simple Drop Icon or Image */}
                            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                            Blood<span className="text-primary">Unity</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive
                                        ? 'text-primary font-semibold'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Theme Toggle & Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <HiSun className="w-6 h-6 text-yellow-500" />
                            ) : (
                                <HiMoon className="w-6 h-6 text-gray-600" />
                            )}
                        </button>

                        {user ? (
                            <div className="relative">
                                {/* ... user profile dropdown ... */}
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                >
                                    <img
                                        src={user.photoURL || 'https://i.ibb.co.com/M6h8732d/users-vector-icon-png-260862.jpg'}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                        {user.displayName}
                                    </span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 origin-top-right transform transition-all z-50">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <Link
                                            to="/dashboard/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <HiOutlineUserCircle className="w-4 h-4" /> My Profile
                                        </Link>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        <button
                                            onClick={handleLogOut}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <HiOutlineLogout className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl py-4 flex flex-col space-y-2 px-4 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { handleLogOut(); setIsMenuOpen(false); }}
                                    className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
