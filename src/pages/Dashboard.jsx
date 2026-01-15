import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { FaUser, FaHeartbeat, FaHandHoldingHeart, FaDollarSign } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        pendingRequests: 0,
        totalFunding: 0
    });
    const [chartData, setChartData] = useState([]);
    const [bloodGroupData, setBloodGroupData] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [moneyDonors, setMoneyDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await api.get('/admin/dashboard-stats');
                const { totalUsers, totalRequests, pendingRequests, bloodGroupStats, monthlyStats } = statsRes.data;

                // Fetch Funding Data
                const fundingRes = await api.get('/payment/funds');
                const fundsData = fundingRes.data || [];
                const totalFunding = fundsData.reduce((sum, fund) => sum + (fund.fundAmount || 0), 0);

                setStats({
                    totalUsers,
                    totalRequests,
                    pendingRequests,
                    totalFunding
                });
                setBloodGroupData(bloodGroupStats);
                setChartData(monthlyStats);
                setMoneyDonors(fundsData.slice(0, 10)); // Top 10 recent donors

                // Fetch recent requests
                const requestsRes = await api.get('/donation-requests');
                const requests = requestsRes.data || [];
                setRecentRequests(requests.slice(0, 5));

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-600 dark:text-gray-300">Welcome back, <span className="text-primary font-semibold">{user.name}</span>!</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center gap-4 transition hover:shadow-lg">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                        <FaUser className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Donors</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center gap-4 transition hover:shadow-lg">
                    <div className="p-4 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
                        <FaHeartbeat className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center gap-4 transition hover:shadow-lg">
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
                        <FaHandHoldingHeart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Requests</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center gap-4 transition hover:shadow-lg">
                    <div className="p-4 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
                        <FaDollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Funding</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalFunding.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Donation Requests Activity</h3>
                    <div className="h-80 w-full min-w-0">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4B5563" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', border: 'none', color: '#fff' }} />
                                    <Line type="monotone" dataKey="requests" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">No activity data available</div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requests by Blood Group</h3>
                    <div className="h-80 w-full min-w-0">
                        {bloodGroupData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bloodGroupData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4B5563" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', border: 'none', color: '#fff' }} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">No blood group data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Money Donors List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Money Donors</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Donor Name</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {moneyDonors.length > 0 ? (
                                moneyDonors.map((donor) => (
                                    <tr key={donor._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{donor.donorName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{donor.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                                            ${donor.fundAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {new Date(donor.fundingDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                                {donor.transactionId.substring(0, 20)}...
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No funding donations yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Requests Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Blood Donation Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Recipient</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentRequests.length > 0 ? (
                                recentRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{request.recipientName}</div>
                                            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{request.bloodGroup}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {request.recipientUpazila}, {request.recipientDistrict}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {request.donationDate} <span className="text-xs text-gray-500 dark:text-gray-400">{request.donationTime}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${request.donationStatus === 'inprogress' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                                                    request.donationStatus === 'done' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                                                        request.donationStatus === 'canceled' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                                                            'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                                }`}>
                                                {request.donationStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No recent requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
