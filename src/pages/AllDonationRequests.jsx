import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaEye, FaFilter, FaUser, FaMapMarkerAlt, FaTint } from 'react-icons/fa';

const AllDonationRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/donation-requests/${id}/status`, { status });
            Swal.fire({
                icon: 'success',
                title: 'Updated',
                text: 'Status updated successfully',
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Request?',
            text: "This action cannot be undone.",
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
    }

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requests.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'done': return 'bg-green-100 text-green-800 border-green-200';
            case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Requests</h2>
                    <p className="text-gray-500 text-sm mt-1">Volunteer view: manage all blood donation requests.</p>
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
                                <th className="px-6 py-4 font-semibold">Requester</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Blood Group</th>
                                <th className="px-6 py-4 font-semibold">Status / Donor</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No requests found.</td></tr>
                            ) : (
                                currentItems.map(req => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-500">
                                                    <FaUser className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{req.requesterName}</div>
                                                    <div className="text-xs text-gray-500">{req.requesterEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                {req.recipientUpazila}, {req.recipientDistrict}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 pl-4">{req.donationDate} {req.donationTime}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FaTint className="text-primary" />
                                                <span className="font-bold text-gray-900 dark:text-white">{req.bloodGroup}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className={`text-xs border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary ${getStatusColor(req.donationStatus)}`}
                                                    value={req.donationStatus}
                                                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="inprogress">Inprogress</option>
                                                    <option value="done">Done</option>
                                                    <option value="canceled">Canceled</option>
                                                </select>

                                                {req.donorName && (
                                                    <div className="text-xs text-gray-500">
                                                        Donor: <span className="font-medium">{req.donorName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/donation-requests/${req._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition" title="View">
                                                    <FaEye />
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <>
                                                        <Link to={`/dashboard/donation-requests/edit/${req._id}`} className="p-2 text-gray-400 hover:text-yellow-600 transition" title="Edit">
                                                            <FaEdit />
                                                        </Link>
                                                        <button onClick={() => handleDelete(req._id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
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
