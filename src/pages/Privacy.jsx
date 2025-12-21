const Privacy = () => {
    return (
        <div className="py-16 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600">
                    <p>Last updated: December 2025</p>

                    <h2 className="text-xl font-bold text-gray-800">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you register as a donor, request blood, or contact us.
                        This includes your name, email address, phone number, blood group, and location data.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to connect blood donors with recipients, verify accounts, and communicate with you about your account and our services.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800">3. Data Security</h2>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800">4. Sharing of Information</h2>
                    <p>
                        We do not share your personal information with third parties except as described in this policy.
                        Donor contact information is only visible to registered users who need to contact you for blood donation purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
