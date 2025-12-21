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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Donation Request Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-gray-700">Requester Details</h3>
                    <p>Name: {request.requesterName}</p>
                    <p>Email: {request.requesterEmail}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700">Recipient Details</h3>
                    <p>Name: {request.recipientName}</p>
                    <p>District: {request.recipientDistrict}</p>
                    <p>Upazila: {request.recipientUpazila}</p>
                    <p>Hospital: {request.hospitalName}</p>
                    <p>Address: {request.fullAddress}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700">Donation Info</h3>
                    <p>Blood Group: <span className="font-bold text-red-600">{request.bloodGroup}</span></p>
                    <p>Date: {request.donationDate}</p>
                    <p>Time: {request.donationTime}</p>
                    <p>Status: <span className={`px-2 py-1 rounded text-xs ${request.donationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{request.donationStatus}</span></p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-700">Message</h3>
                    <p className="bg-gray-50 p-4 rounded">{request.requestMessage}</p>
                </div>
            </div>

            {/* Donate Button: Visible if status is pending, and user is not the requester */
                request.donationStatus === 'pending' && user._id !== request.requesterId && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
                        >
                            Donate Now
                        </button>
                    </div>
                )}

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
