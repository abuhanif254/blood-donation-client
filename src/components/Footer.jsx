import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-red-500">BloodDonate</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting donors with those in need. Join our community to save lives and make a difference. Every drop counts.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaFacebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaTwitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaInstagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b-2 border-red-600 inline-block pb-2">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-red-500 transition duration-300">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-red-500 transition duration-300">About Us</Link></li>
                            <li><Link to="/search" className="text-gray-400 hover:text-red-500 transition duration-300">Find Donors</Link></li>
                            <li><Link to="/donation-requests" className="text-gray-400 hover:text-red-500 transition duration-300">Donation Requests</Link></li>
                            <li><Link to="/blog" className="text-gray-400 hover:text-red-500 transition duration-300">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b-2 border-red-600 inline-block pb-2">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="text-gray-400 hover:text-red-500 transition duration-300">Contact Us</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-red-500 transition duration-300">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-red-500 transition duration-300">Terms of Service</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-red-500 transition duration-300">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b-2 border-red-600 inline-block pb-2">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="text-red-500 mt-1 mr-3" />
                                <span className="text-gray-400 text-sm">123 Health Street, Medical City, Dhaka 1200, Bangladesh</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="text-red-500 mr-3" />
                                <span className="text-gray-400 text-sm">+880 1234 567890</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="text-red-500 mr-3" />
                                <span className="text-gray-400 text-sm">support@blooddonate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} BloodDonate. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
