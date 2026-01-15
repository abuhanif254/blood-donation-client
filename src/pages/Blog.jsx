import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const posts = [
        {
            id: 1,
            title: "The Health Benefits of Donating Blood",
            excerpt: "Did you know that donating blood can help reduce the risk of heart disease and cancer? Learn about the surprising health benefits for donors.",
            author: "Dr. Sarah Smith",
            date: "Jan 15, 2024",
            category: "Health",
            image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "Who Can Donate Blood? Eligibility Guide",
            excerpt: "Confused about eligibility requirements? We break down the age, weight, and health criteria for becoming a blood donor.",
            author: "John Doe",
            date: "Jan 10, 2024",
            category: "Guide",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "World Blood Donor Day 2024",
            excerpt: "Join us in celebrating the heroes who save lives every day. Check out our upcoming events and donation drives.",
            author: "Community Team",
            date: "Dec 28, 2023",
            category: "Events",
            image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 4,
            title: "Preparing for Your First Donation",
            excerpt: "Nervous about your first time? Here are 5 tips to help you prepare and ensure a smooth donation experience.",
            author: "Nurse Emily",
            date: "Dec 15, 2023",
            category: "Tips",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 5,
            title: "Understanding Blood Types",
            excerpt: "A (positive/negative), B, AB, O? What do they mean and who can you help? A simple guide to blood compatibility.",
            author: "Dr. Alex Wong",
            date: "Nov 30, 2023",
            category: "Education",
            image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 6,
            title: "Post-Donation Care: Do's and Don'ts",
            excerpt: "How to take care of yourself after donating blood to ensure quick recovery and energy levels.",
            author: "Wellness Expert",
            date: "Nov 22, 2023",
            category: "Health",
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-6">
                        Latest <span className="text-primary">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay updated with the latest news, health tips, and inspiring stories from the blood donation community.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm pl-14 transition-all"
                    />
                    <HiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><HiOutlineCalendar /> {post.date}</span>
                                        <span className="flex items-center gap-1"><HiOutlineUser /> {post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto">
                                        <Link to="#" className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1">
                                            Read Full Article →
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                            No articles found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;
