import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Banner Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-24 px-4 text-center">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
                >
                    Donate Blood, Save Lives
                </motion.h1>
                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light"
                >
                    Your contribution can help save a life today. Be the hero someone is waiting for.
                </motion.p>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4"
                >
                    <Link to="/register" className="bg-white text-red-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                        Join as a Donor
                    </Link>
                    <Link to="/search" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-red-700 transition duration-300">
                        Search Donors
                    </Link>
                </motion.div>
            </div>

            {/* Featured Section */}
            <div className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Donate Blood?</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">There are many reasons to donate, but the most important one is saving lives.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Example of staggered animation could go here, for now simple fade in */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                        >
                            <div className="text-red-600 text-5xl mb-6 flex justify-center">❤️</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Save Lives</h3>
                            <p className="text-gray-600 leading-relaxed">One donation can save up to three lives. Your contribution makes a direct impact on emergency treatments.</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                        >
                            <div className="text-red-600 text-5xl mb-6 flex justify-center">🏥</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Emergency Support</h3>
                            <p className="text-gray-600 leading-relaxed">Blood is critical for surgeries, cancer treatments, chronic illnesses, and traumatic injuries.</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                        >
                            <div className="text-red-600 text-5xl mb-6 flex justify-center">🩺</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Health Benefits</h3>
                            <p className="text-gray-600 leading-relaxed">Regular donation can help reduce the risk of heart disease and cancer, and stimulates blood cell production.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Our Impact Section (Stats) */}
            <div className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="p-6">
                            <div className="text-5xl font-extrabold text-red-600 mb-2">1200+</div>
                            <p className="text-gray-600 font-medium">Donors Registered</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-extrabold text-red-600 mb-2">3500+</div>
                            <p className="text-gray-600 font-medium">Lives Saved</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-extrabold text-red-600 mb-2">800+</div>
                            <p className="text-gray-600 font-medium">Blood Units Collected</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-extrabold text-red-600 mb-2">50+</div>
                            <p className="text-gray-600 font-medium">Partner Hospitals</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Process Section */}
            <div className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">Donation Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Registration</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Sign up as a donor and complete your profile. It takes less than 2 minutes.</p>
                        </div>
                        <div className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Screening</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">A basic health check-up including weight, pressure, and hemoglobin test.</p>
                        </div>
                        <div className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Donation</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">The actual donation process takes only 10-15 minutes in a comfortable environment.</p>
                        </div>
                        <div className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">4</div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Refreshment</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Enjoy a snack and juice to replenish energy before you leave with a smile.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volunteer Section */}
            <div className="py-24 px-4 bg-gradient-to-r from-red-700 to-red-900 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Want to help differently?</h2>
                    <p className="text-xl mb-10 text-red-100">Join our volunteer team and help us organize camps, manage requests, and spread awareness.</p>
                    <Link to="/register" className="bg-white text-red-800 font-bold py-4 px-10 rounded-full hover:bg-gray-100 shadow-xl transition duration-300 transform hover:-translate-y-1 inline-block">
                        Join as a Volunteer
                    </Link>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="py-16 px-4">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Contact Us</h2>
                    <p className="text-center text-gray-600 mb-8">Have questions? Call us at <span className="font-bold text-red-600">+880 1234 567890</span> or send a message.</p>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Your Email" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Message</label>
                            <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" rows="4" placeholder="Your Message"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
