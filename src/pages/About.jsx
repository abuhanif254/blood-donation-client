import { FaUsers, FaHandHoldingHeart, FaGlobeAsia } from 'react-icons/fa';

const About = () => {
    return (
        <div className="bg-neutral dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://i.ibb.co.com/XkcfR19/grid.png')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        One Platform, <span className="text-primary">Countless Lives Saved</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                        BloodUnity is more than just an app; it's a movement to bridge the gap between donors and those in need, creating a world where no life is lost due to blood shortage.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
                            <FaHandHoldingHeart className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                            To create a unified digital ecosystem that simplifies blood donation, connects willing donors with recipients instantly, and fosters a community of compassion and care across the nation.
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            A future where safe blood is universally accessible, and every citizen is empowered to be a lifesaver, ensuring health equity for all.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src="https://i.ibb.co.com/8z8hHwH/team-work.jpg"
                            alt="Team Collaboration"
                            className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs hidden md:block">
                            <p className="font-bold text-gray-900 dark:text-white text-lg">"Together, we can make miracles happen every day."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-primary py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-5xl font-extrabold mb-2">5000+</div>
                            <div className="text-red-100 text-lg font-medium">Active Donors</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold mb-2">1200+</div>
                            <div className="text-red-100 text-lg font-medium">Lives Saved</div>
                        </div>
                        <div>
                            <div className="text-5xl font-extrabold mb-2">64</div>
                            <div className="text-red-100 text-lg font-medium">Districts Covered</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Introduction (Mock) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet The Team</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">The passionate individuals working behind the scenes to keep the heart of BloodUnity beating.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { name: "Rafiqul Islam", role: "Founder & CEO", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                        { name: "Sarah Ahmed", role: "Head of Operations", img: "https://randomuser.me/api/portraits/women/44.jpg" },
                        { name: "Tanvir Hasan", role: "Lead Developer", img: "https://randomuser.me/api/portraits/men/86.jpg" },
                        { name: "Nusrat Jahan", role: "Community Manager", img: "https://randomuser.me/api/portraits/women/68.jpg" }
                    ].map((member, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                            <div className="h-48 overflow-hidden">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                                <p className="text-sm text-primary font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
