import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyDonationRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchRequests();
    }, [user, filter]);

    const fetchRequests = async () => {
        try {
            let url = `/donation-requests?requesterId=${user._id}`;
            if (filter !== 'all') {
                url += `&status=${filter}`;
            }
            const { data } = await api.get(url);
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/donation-requests/${id}/status`, { status: newStatus });
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Request status changed to ${newStatus}`,
                timer: 1500,
                showConfirmButton: false
            });
            fetchRequests();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update status',
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/donation-requests/${id}`);
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    fetchRequests();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Failed to delete request.',
                        'error'
                    )
                }
            }
        })
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Donation Requests</h2>

            <div className="mb-4">
                <label className="mr-2 font-semibold">Filter by Status:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recipient Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Blood Group</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor Info</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(req => (
                            <tr key={req._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.recipientName}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.donationDate} {req.donationTime}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.bloodGroup}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${req.donationStatus === 'done' ? 'bg-green-200 text-green-900' :
                                        req.donationStatus === 'canceled' ? 'bg-red-200 text-red-900' :
                                            req.donationStatus === 'inprogress' ? 'bg-yellow-200 text-yellow-900' :
                                                'bg-blue-200 text-blue-900'
                                        }`}>
                                        <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                                        <span className="relative">{req.donationStatus}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {req.donationStatus === 'inprogress' && req.donorName ? (
                                        <div>
                                            <p className="font-semibold">{req.donorName}</p>
                                            <p className="text-gray-500 text-xs">{req.donorEmail}</p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex space-x-2">
                                        {req.donationStatus === 'inprogress' && (
                                            <>
                                                <button onClick={() => handleStatusChange(req._id, 'done')} className="text-green-600 hover:text-green-900">Done</button>
                                                <button onClick={() => handleStatusChange(req._id, 'canceled')} className="text-red-600 hover:text-red-900">Cancel</button>
                                            </>
                                        )}
                                        <Link to={`/dashboard/donation-requests/${req._id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                                        <Link to={`/dashboard/donation-requests/edit/${req._id}`} className="text-gray-600 hover:text-gray-900">Edit</Link>
                                        <button onClick={() => handleDelete(req._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <p className="p-5 text-gray-500">No requests found.</p>}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
