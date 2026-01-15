import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';

const DonationRequestDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const { data } = await api.get(`/donation-requests/${id}`);
                setRequest(data);
            } catch (error) {
                console.error("Failed to fetch request", error);
            }
        };
        fetchRequest();
    }, [id]);

    const handleDonate = async () => {
        try {
            await api.put(`/donation-requests/${id}/donate`);
            setIsModalOpen(false);
            // Refresh
            const { data } = await api.get(`/donation-requests/${id}`);
            setRequest(data);
        } catch (error) {
            console.error("Failed to donate", error);
        }
    }

    if (!request) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header / Title Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Donation Request Details</h1>
                <p className="text-gray-600 dark:text-gray-400">Please review the details below before donating.</p>
            </div>

            {/* Images & Media Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden relative group">
                    {/* Primary Image (Map Placeholder) */}
                    <img
                        src="https://images.unsplash.com/photo-1569383746724-6f1b88de1aea?auto=format&fit=crop&q=80&w=1000"
                        alt="Hospital Location Check"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                        <span className="bg-white/90 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Hospital Location</span>
                    </div>
                </div>
                <div className="h-64 md:h-80 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
                    <div className="text-center">
                        <div className="text-6xl font-black text-red-500 mb-2">{request.bloodGroup}</div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Blood Type Needed</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview & Key Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                This is an urgent request for <strong>{request.bloodGroup}</strong> blood donation at <strong>{request.hospitalName}</strong>.
                                The patient, {request.recipientName}, is in need of support. Please review the key information below and verify if you are eligible to donate.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ... existing details ... */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hospital Details</h3>
                                <p className="font-semibold text-gray-900 dark:text-white">{request.hospitalName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.fullAddress}</p>
                                <p className="text-sm text-gray-500 mt-1">{request.recipientDistrict}, {request.recipientUpazila}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Timing</h3>
                                <p className="font-semibold text-gray-900 dark:text-white">{request.donationDate}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">at {request.donationTime}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Message</h3>
                            <p className="text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-primary">
                                "{request.requestMessage}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    {/* ... existing action card ... */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Can you help?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            Please only confirm if you are sure you can donate on the requested date and time.
                        </p>

                        {request.donationStatus === 'pending' ? (
                            user && user._id !== request.requesterId ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full btn-primary py-4 text-lg shadow-xl"
                                >
                                    Donate Now
                                </button>
                            ) : user && user._id === request.requesterId ? (
                                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 text-sm">
                                    You created this request.
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="w-full btn-outline">
                                    Login to Donate
                                </button>
                            )
                        ) : (
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold rounded-lg border border-green-200 dark:border-green-800">
                                Donation In Progress
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-sm mb-3">Share this request</h4>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">Facebook</button>
                                <button className="flex-1 py-2 bg-sky-500 text-white rounded text-sm font-bold hover:bg-sky-600">Twitter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Requests Section */}
            <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Related Requests</h2>
                    <button className="text-primary font-bold hover:underline" onClick={() => navigate('/donation-requests')}>View All</button>
                </div>

                {/* Mock Related Grid for Visual Purposes */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="card h-full flex flex-col group overflow-hidden opacity-60 hover:opacity-100 transition">
                            <div className="h-32 bg-gray-200 rounded-t-xl mb-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">Showing similar requests near this location.</p>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Donation</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleDonate(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Donor Name</label>
                                <input type="text" value={user.name} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Donor Email</label>
                                <input type="email" value={user.email} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">Confirm Donation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestDetails;
