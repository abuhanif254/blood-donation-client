import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // User Menu Dropdown
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Nav Menu

    const handleLogout = () => {
        logout();
        Swal.fire({
            icon: 'success',
            title: 'Logged out successfully',
            showConfirmButton: false,
            timer: 1500
        });
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <div className="flex items-center sm:hidden mr-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Icon when menu is closed. */}
                                {!isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    /* Icon when menu is open. */
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <Link to="/" className="flex-shrink-0 flex items-center text-red-500 font-bold text-2xl tracking-wider">
                            BloodDonate
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                Home
                            </Link>
                            <Link to="/donation-requests" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                Donation Requests
                            </Link>
                            {user && (
                                <Link to="/funding" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                    Funding
                                </Link>
                            )}
                            <Link to="/blog" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                Blog
                            </Link>
                            <Link to="/search" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                Search
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="ml-3 relative group">
                                <div className="flex items-center cursor-pointer">
                                    <span className="text-gray-300 text-sm mr-3 font-medium hidden md:block">Hello, {user.name}</span>
                                    <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 border-2 border-red-500" id="user-menu" aria-haspopup="true">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="h-9 w-9 rounded-full object-cover" src={user.avatar} alt="" />
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                        </div>
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition duration-150" role="menuitem">Dashboard</Link>
                                        <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition duration-150" role="menuitem">Profile</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition duration-150 border-t border-gray-100" role="menuitem">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 transition duration-300">Login</Link>
                                <Link to="/register" className="bg-red-600 text-white px-5 py-2 rounded-full font-bold hover:bg-red-700 shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/donation-requests" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Donation Requests</Link>
                        {user && (
                            <Link to="/funding" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Funding</Link>
                        )}
                        <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Blog</Link>
                        <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Search</Link>

                        {!user && (
                            <div className="border-t border-gray-700 pt-4 pb-2 mt-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center mt-2 bg-red-600 text-white px-5 py-3 rounded-md font-bold hover:bg-red-700">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
