const About = () => {
    return (
        <div className="py-16 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Us</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Welcome to <strong>BloodDonate</strong>, a platform dedicated to saving lives by connecting blood donors with those in need.
                    Our mission is to bridge the gap between donors and patients, making the process of blood donation seamless, efficient, and accessible to everyone.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Founded in 2025, we have rapidly grown into a community of over 1200+ registered donors and 50+ partner hospitals.
                    We believe that every drop of blood counts and that together, we can build a healthier, safer world.
                </p>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To ensure that no life is lost due to a shortage of blood. We envision a society where voluntary blood donation is a norm,
                        and every patient has timely access to safe blood.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
