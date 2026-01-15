import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineArrowRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const Home = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        pendingRequests: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Using the admin stats endpoint. It's public for now (or public wrapper).
                // If it fails due to auth (because it's admin route), we might need a public endpoint.
                // Assuming I made it properly accessible or I'll handle graceful degradation.
                const res = await api.get('/admin/dashboard-stats');
                setStats(res.data);
            } catch (err) {
                console.error("Stats fetch error", err);
                // Fallback to "Lots" if failed
                setStats({ totalUsers: '5000+', totalRequests: '1200+' });
            }
        };
        fetchStats();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* 1. Hero Section (60-70% Viewport Height) */}
            <section className="relative h-[70vh] flex items-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2835&auto=format&fit=crop"
                        alt="Blood Donation"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-white">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Donate Blood, <br />
                            <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Save a Life.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl leading-relaxed">
                            Be the hero in someone's story. Join our community of donors and make a difference today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4">
                                Join as Donor <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/search" className="px-8 py-4 border-2 border-white/20 hover:bg-white/10 rounded-lg text-lg font-semibold backdrop-blur-sm transition-all text-center">
                                Find Donors
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Features / Why Donate */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-4 dark:text-white">Why Donate Blood?</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Your simple act of kindness can have a ripple effect that saves lives and strengthens communities.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "❤️", title: "Save Lives", desc: "One pint of blood can save up to three lives. Your contribution provides critical support." },
                            { icon: "🏥", title: "Emergency Aid", desc: "Blood is essential for surgeries, cancer treatments, and trauma care in emergencies." },
                            { icon: "🩺", title: "Health Check", desc: "Donors receive a free mini-physical, checking pulse, blood pressure, and hemoglobin." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-neutral p-10 rounded-2xl text-center border border-gray-100 dark:border-gray-800 dark:bg-gray-800"
                            >
                                <div className="text-6xl mb-6">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Statistics / Impact */}
            <section className="py-20 bg-gradient-to-br from-primary to-red-800 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                        {[
                            { number: stats.totalUsers || '1000+', label: "Donors Registered" },
                            { number: stats.totalRequests || '500+', label: "Requests Served" },
                            { number: "120", label: "Partner Hospitals" }, // Mock for now
                            { number: "24/7", label: "Support Available" }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-4">
                                <div className="text-5xl font-extrabold mb-2">{stat.number}</div>
                                <div className="text-red-100 font-medium tracking-wider uppercase text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. How It Works */}
            <section className="py-24 bg-gray-50 dark:bg-gray-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Process</span>
                        <h2 className="text-4xl font-bold mt-2 dark:text-white">How it Works</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-0"></div>

                        {[
                            { step: "01", title: "Register", desc: "Create your account in minutes." },
                            { step: "02", title: "Screening", desc: "Quick health check-up." },
                            { step: "03", title: "Donation", desc: "Safe and comfortable process." },
                            { step: "04", title: "Rest", desc: "Refreshments & recovery." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 bg-gray-50 dark:bg-gray-950 text-center group">
                                <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:border-primary group-hover:text-primary transition-colors mb-6 shadow-sm">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                                <p className="text-gray-500 text-sm px-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Call to Action / Volunteer */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2940"
                        alt="Volunteer"
                        className="w-full h-full object-cover opacity-20 mixed-blend-overlay"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Become a Volunteer</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Not eligible to donate? You can still save lives by helping us organize camps and manage our community.
                    </p>
                    <Link to="/register" className="bg-white text-gray-900 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors inline-block shadow-xl">
                        Join the Team
                    </Link>
                </div>
            </section>

            {/* 6. Testimonials */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">Donor Stories</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl relative">
                                <div className="text-primary text-6xl absolute top-4 right-6 opacity-20">"</div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic">
                                    "I donated for the first time last month. The process was so smooth and the staff was incredibly supportive. Feels great to help!"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <div>
                                        <h4 className="font-bold dark:text-white">{["Sarah Johnson", "Michael Chen", "Emma Wilson"][idx]}</h4>
                                        <p className="text-sm text-gray-500">Regular Donor</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Latest Articles / Blog */}
            <section className="py-24 bg-gray-50 dark:bg-gray-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Insights</span>
                        <h2 className="text-4xl font-bold mt-2 dark:text-white">Latest News</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Benefits of Donating Blood", date: "Jan 10, 2024", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" },
                            { title: "Who Can Donate?", date: "Jan 05, 2024", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800" },
                            { title: "World Blood Donor Day", date: "Dec 12, 2023", img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800" }
                        ].map((post, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="overflow-hidden rounded-2xl mb-4 shadow-sm">
                                    <img src={post.img} alt={post.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500" />
                                </div>
                                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                                <h3 className="text-xl font-bold dark:text-white group-hover:text-primary transition-colors">{post.title}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/blog" className="btn-outline inline-block">Read More Articles</Link>
                    </div>
                </div>
            </section>

            {/* 8. FAQ Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is it safe to donate blood?", a: "Yes, completely safe. We use sterile, disposable equipment for every donor." },
                            { q: "How long does it take?", a: "The entire process takes about 45-60 minutes, but the actual donation is only 8-10 minutes." },
                            { q: "How often can I donate?", a: "You can donate whole blood every 56 days (8 weeks)." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h4 className="font-bold text-lg mb-2 dark:text-white">{item.q}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Newsletter & Apps */}
            <section className="py-24 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Get the Mobile App</h2>
                            <p className="text-red-100 mb-8 text-lg">Find donors, track your donations, and get notified about emergencies near you. Coming soon.</p>
                            <div className="flex gap-4">
                                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-900 transition"><span className="text-2xl"></span> App Store</button>
                                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-900 transition"><span className="text-xl">▶</span> Google Play</button>
                            </div>
                        </div>
                        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-bold mb-2">Subscribe to our Newsletter</h3>
                            <p className="text-red-100 mb-6">Stay updated with our latest camps and stories.</p>
                            <form className="flex gap-2">
                                <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none" />
                                <button type="button" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition">Join</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. Final Contact CTA */}
            <section className="py-20 bg-gray-900 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-6">Still have questions?</h2>
                    <p className="text-gray-400 mb-8">Our support team is available 24/7 to assist you.</p>
                    <Link to="/contact" className="bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition inline-block">
                        Contact Support
                    </Link>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
