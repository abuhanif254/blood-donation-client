import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="py-16 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-red-500 text-xl mt-1 mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-700">Address</h3>
                                    <p className="text-gray-600">123 Health Street, Medical City<br />Dhaka 1200, Bangladesh</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-red-500 text-xl mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-700">Phone</h3>
                                    <p className="text-gray-600">+880 1234 567890</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="text-red-500 text-xl mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-700">Email</h3>
                                    <p className="text-gray-600">support@blooddonate.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Message</h2>
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
            </div>
        </div>
    );
};

export default Contact;
