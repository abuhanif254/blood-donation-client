import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllDonationRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchRequests = async () => {
        try {
            let url = '/donation-requests';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            const { data } = await api.get(url);
            setRequests(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/donation-requests/${id}/status`, { status });
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    }

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
                        'The request has been deleted.',
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
    }

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">All Donation Requests</h2>

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
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requester</th>
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
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="font-semibold">{req.requesterName}</p>
                                    <p className="text-xs text-gray-500">{req.requesterEmail}</p>
                                </td>
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
                                    {req.donationStatus === 'inprogress' || req.donationStatus === 'done' ? (
                                        req.donorName ? (
                                            <div>
                                                <p className="font-semibold">{req.donorName}</p>
                                                <p className="text-xs text-gray-500">{req.donorEmail}</p>
                                            </div>
                                        ) : <span className="text-gray-400">N/A</span>
                                    ) : null}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex flex-col space-y-2">
                                        <select
                                            className="text-xs border rounded p-1"
                                            value={req.donationStatus}
                                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">Inprogress</option>
                                            <option value="done">Done</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                        <div className="flex space-x-2">
                                            {user.role === 'admin' && (
                                                <>
                                                    <Link to={`/dashboard/donation-requests/edit/${req._id}`} className="text-blue-600 hover:text-blue-900 text-xs">Edit</Link>
                                                    <button onClick={() => handleDelete(req._id)} className="text-red-600 hover:text-red-900 text-xs">Delete</button>
                                                </>
                                            )}
                                            <Link to={`/dashboard/donation-requests/${req._id}`} className="text-gray-600 hover:text-gray-900 text-xs">View</Link>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <p className="p-5 text-gray-500">No requests found.</p>}
            </div>
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
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

export default AllDonationRequests;
