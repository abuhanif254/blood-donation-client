import api from '../api/axios';
import { useEffect, useState } from 'react';
import { FaEllipsisV, FaCheck, FaBan, FaUserTag, FaSearch, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = '/users';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            const { data } = await api.get(url);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            Swal.fire('Error', 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/users/${id}/status`, { status });
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `User status changed to ${status}`,
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
            fetchUsers();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const handleRoleChange = async (id, role) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to make this user a ${role}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, update role!'
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/users/${id}/role`, { role });
                Swal.fire({
                    icon: 'success',
                    title: 'Role Updated!',
                    text: `User is now a ${role}`,
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchUsers();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to update role', 'error');
            }
        }
    };

    // State to track which dropdown is open (by user ID)
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage all registered users, their roles and statuses.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white w-full"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No users found matching your criteria.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={user.avatar}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1
                                                ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative dropdown-container inline-block text-left">
                                                <button onClick={() => toggleDropdown(user._id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                                                    <FaEllipsisV />
                                                </button>

                                                {openDropdownId === user._id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-100 dark:border-gray-700 py-1 ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => { handleStatusChange(user._id, 'blocked'); setOpenDropdownId(null); }}
                                                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <FaBan className="w-4 h-4 mr-2" /> Block User
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => { handleStatusChange(user._id, 'active'); setOpenDropdownId(null); }}
                                                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                            >
                                                                <FaCheck className="w-4 h-4 mr-2" /> Unblock User
                                                            </button>
                                                        )}

                                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                                        {user.role !== 'volunteer' && (
                                                            <button
                                                                onClick={() => { handleRoleChange(user._id, 'volunteer'); setOpenDropdownId(null); }}
                                                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                <FaUserTag className="w-4 h-4 mr-2" /> Make Volunteer
                                                            </button>
                                                        )}

                                                        {user.role !== 'admin' && (
                                                            <button
                                                                onClick={() => { handleRoleChange(user._id, 'admin'); setOpenDropdownId(null); }}
                                                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                <FaUserTag className="w-4 h-4 mr-2" /> Make Admin
                                                            </button>
                                                        )}
                                                    </div>
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
        </div>
    );
};

export default AllUsers;
