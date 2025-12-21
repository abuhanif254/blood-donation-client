import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="py-10 px-4 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Blood Donation Requests</h2>

                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map(req => (
                            <div key={req._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{req.recipientName}</h3>
                                    <div className="flex items-center mb-4">
                                        <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                            {req.bloodGroup}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {req.recipientDistrict}, {req.recipientUpazila}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        <span className="font-semibold">Hospital:</span> {req.hospitalName}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        <span className="font-semibold">Date:</span> {req.donationDate} at {req.donationTime}
                                    </p>
                                    <Link to={`/dashboard/donation-requests/${req._id}`} className="block w-full text-center bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No pending donation requests found.</p>
                )}
            </div>
        </div>
    );
};

export default DonationRequests;
