import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaEye, FaFilter, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const MyDonationRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchRequests();
    }, [user, filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let url = `/donation-requests?requesterId=${user._id}`;
            if (filter !== 'all') {
                url += `&status=${filter}`;
            }
            const { data } = await api.get(url);
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
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
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
            fetchRequests();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update status', });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/donation-requests/${id}`);
                    Swal.fire('Deleted!', 'Request has been deleted.', 'success');
                    fetchRequests();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to delete request.', 'error');
                }
            }
        })
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'done': return 'bg-green-100 text-green-800 border-green-200';
            case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Requests</h2>
                    <p className="text-gray-500 text-sm mt-1">Track and manage your blood donation requests.</p>
                </div>

                <div className="relative w-full sm:w-auto">
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white w-full shadow-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Recipient</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Donation Info</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading requests...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No requests found. Create one to get started!</td></tr>
                            ) : (
                                currentItems.map(req => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{req.recipientName}</div>
                                            <div className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">{req.bloodGroup}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <FaMapMarkerAlt className="mr-1.5 text-gray-400" />
                                                {req.recipientUpazila}, {req.recipientDistrict}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <FaCalendarAlt className="mr-1.5 text-gray-400" />
                                                {req.donationDate}
                                            </div>
                                            <div className="text-xs text-gray-400 ml-5">{req.donationTime}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(req.donationStatus)}`}>
                                                {req.donationStatus}
                                            </span>
                                            {req.donationStatus === 'inprogress' && req.donorName && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Donor: <span className="font-medium">{req.donorName}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.donationStatus === 'inprogress' && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(req._id, 'done')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100 transition">Done</button>
                                                        <button onClick={() => handleStatusChange(req._id, 'canceled')} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-100 transition">Cancel</button>
                                                    </>
                                                )}

                                                <Link to={`/donation-requests/${req._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition" title="View Details">
                                                    <FaEye />
                                                </Link>
                                                <Link to={`/dashboard/donation-requests/edit/${req._id}`} className="p-2 text-gray-400 hover:text-yellow-600 transition" title="Edit">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(req._id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
