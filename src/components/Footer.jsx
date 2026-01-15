import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                                Blood<span className="text-primary">Unity</span>
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Connecting donors with those in need. Join our community to save lives and make a difference today.
                        </p>
                        <div className="flex items-center space-x-4 pt-2">
                            <SocialLink href="#" icon={<FaFacebookF />} />
                            <SocialLink href="#" icon={<FaTwitter />} />
                            <SocialLink href="#" icon={<FaInstagram />} />
                            <SocialLink href="#" icon={<FaLinkedinIn />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/" label="Home" />
                            <FooterLink to="/about" label="About Us" />
                            <FooterLink to="/donation-requests" label="Find Blood" />
                            <FooterLink to="/blog" label="Latest News" />
                            <FooterLink to="/contact" label="Contact" />
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Support</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/faq" label="Help Center" />
                            <FooterLink to="/privacy" label="Privacy Policy" />
                            <FooterLink to="/terms" label="Terms of Service" />
                            <FooterLink to="/funding" label="Donate Funds" />
                            <FooterLink to="/register" label="Become a Volunteer" />
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                                <FaMapMarkerAlt className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <span>123 Life Saver Street, <br />Health City, HC 12345</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                                <FaPhoneAlt className="w-4 h-4 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                                <FaEnvelope className="w-4 h-4 text-primary shrink-0" />
                                <span>support@bloodunity.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} BloodUnity. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, label }) => (
    <li>
        <Link
            to={to}
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
        >
            {label}
        </Link>
    </li>
);

export default Footer;
