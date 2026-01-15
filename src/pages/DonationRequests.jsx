import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';

import DonationRequestCard from '../components/DonationRequestCard';

const DonationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Public page shows all requests
                const { data } = await api.get('/donation-requests');
                setRequests(data);
            } catch (error) {
                console.error("Failed to fetch donation requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="py-10 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Blood Donation Requests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <SkeletonCard key={n} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Blood Donation Requests</h2>

                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {requests.map(req => (
                            <DonationRequestCard key={req._id} request={req} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No pending donation requests found.</p>
                        <Link to="/dashboard/create-donation-request" className="text-primary font-bold hover:underline mt-2 inline-block">Create a Request</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationRequests;
