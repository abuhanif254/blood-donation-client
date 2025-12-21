import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentRequests, setRecentRequests] = useState([]);
    const [requestsForMe, setRequestsForMe] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, totalFunds: 0 });

    useEffect(() => {
        const fetchData = async () => {
            if (user.role === 'donor') {
                try {
                    const { data: myRequests } = await api.get(`/donation-requests?requesterId=${user._id}`);
                    setRecentRequests(myRequests.slice(0, 3));

                    const { data: forMe } = await api.get(`/donation-requests?donorId=${user._id}&status=pending`);
                    setRequestsForMe(forMe);

                } catch (error) {
                    console.error("Failed to fetch requests", error);
                }
            } else if (user.role === 'admin' || user.role === 'volunteer') {
                // Fetch stats (Mocked or real endpoints needed)
                // I'll fetch lists and count for now since I didn't create stat endpoints
                try {
                    let totalDonors = 0;
                    if (user.role === 'admin') {
                        try {
                            const usersRes = await api.get('/users?status=active');
                            totalDonors = usersRes.data ? usersRes.data.filter(u => u.role === 'donor').length : 0;
                        } catch (e) {
                            console.error("Failed to fetch users", e);
                        }
                    }

                    const reqRes = await api.get('/donation-requests');
                    const fundsRes = await api.get('/payment/funds');

                    const totalFunds = fundsRes.data ? fundsRes.data.reduce((acc, curr) => acc + curr.fundAmount, 0) : 0;

                    setStats({
                        totalUsers: totalDonors,
                        totalRequests: reqRes.data ? reqRes.data.length : 0,
                        totalFunds: totalFunds
                    });
                } catch (err) {
                    console.error('Dashboard Fetch Error:', err);
                }
            }
        };
        fetchData();
    }, [user]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/donation-requests/${id}/status`, { status: newStatus });
            // Refresh data
            const { data } = await api.get(`/donation-requests?requesterId=${user._id}`);
            setRecentRequests(data.slice(0, 3));
        } catch (error) {
            console.error("Failed to update status", error);
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
                    const { data } = await api.get(`/donation-requests?requesterId=${user._id}`);
                    setRecentRequests(data.slice(0, 3));
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

    // Mock Chart Data
    const chartData = [
        { name: 'Jan', requests: 40 },
        { name: 'Feb', requests: 30 },
        { name: 'Mar', requests: 20 },
        { name: 'Apr', requests: 27 },
        { name: 'May', requests: 18 },
        { name: 'Jun', requests: 23 },
        { name: 'Jul', requests: 34 },
    ];

    // Role-based Content
    if (user.role === 'donor') {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 👋</h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Requests For Me Section */}
                    {requestsForMe.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4 text-red-600">Donation Requests For Me</h2>
                            <div className="overflow-x-auto bg-red-50 rounded-lg p-2">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-red-200 bg-red-100 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Requester</th>
                                            <th className="px-5 py-3 border-b-2 border-red-200 bg-red-100 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Location</th>
                                            <th className="px-5 py-3 border-b-2 border-red-200 bg-red-100 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3 border-b-2 border-red-200 bg-red-100 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Message</th>
                                            <th className="px-5 py-3 border-b-2 border-red-200 bg-red-100 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsForMe.map(req => (
                                            <tr key={req._id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="font-bold">{req.requesterName}</p>
                                                    <p className="text-xs text-gray-500">{req.requesterEmail}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.donationDate} {req.donationTime}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs truncate" title={req.requestMessage}>{req.requestMessage}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <Link to={`/dashboard/donation-requests/${req._id}`} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">View & Donate</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {recentRequests.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold mb-4">My Recent Donation Requests</h2>
                            <div className="overflow-x-auto">
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
                                        {recentRequests.map(req => (
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
                            </div>
                            <div className="mt-4">
                                <Link to="/dashboard/my-donation-requests" className="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">View My All Requests</Link>
                            </div>
                        </>
                    )}

                    {requestsForMe.length === 0 && recentRequests.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">You haven't made or received any donation requests yet.</p>
                            <Link to="/dashboard/create-donation-request" className="mt-4 inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition duration-300">
                                Create a Request
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Admin/Volunteer View
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} ({user.role}) 👋</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 text-2xl">👥</div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Donors</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4 text-2xl">🩸</div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Requests</p>
                        <p className="text-2xl font-bold">{stats.totalRequests}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 text-2xl">💰</div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Funding</p>
                        <p className="text-2xl font-bold">${stats.totalFunds}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Donation Requests Over Time</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="requests" stroke="#ef4444" fill="#fee2e2" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
