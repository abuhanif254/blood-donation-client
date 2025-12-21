import api from '../api/axios';
import { useEffect, useState } from 'react';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            let url = '/users';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            const { data } = await api.get(url);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/users/${id}/status`, { status });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await api.put(`/users/${id}/role`, { role });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    // State to track which dropdown is open (by user ID)
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // Close dropdown when clicking outside (simple implementation: backdrop or just leave it manual toggle for now for simplicity in this challenge context, or add a window click listener if essential. I'll stick to a simple toggle for minimizing complexity unless broken.)
    // Better: Add click listener to close on outside click.
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>

            <div className="mb-6 flex items-center bg-white p-4 rounded-lg shadow-sm">
                <label className="mr-3 font-semibold text-gray-700">Filter by Status:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-gray-200" />
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium text-gray-700">{user.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-600">{user.email}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="relative dropdown-container">
                                            <button onClick={() => toggleDropdown(user._id)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                                </svg>
                                            </button>

                                            {openDropdownId === user._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => { handleStatusChange(user._id, 'blocked'); setOpenDropdownId(null); }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                Block User
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => { handleStatusChange(user._id, 'active'); setOpenDropdownId(null); }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                Unblock User
                                                            </button>
                                                        )}

                                                        {user.role !== 'volunteer' && (
                                                            <button
                                                                onClick={() => { handleRoleChange(user._id, 'volunteer'); setOpenDropdownId(null); }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                Make Volunteer
                                                            </button>
                                                        )}

                                                        {user.role !== 'admin' && (
                                                            <button
                                                                onClick={() => { handleRoleChange(user._id, 'admin'); setOpenDropdownId(null); }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                Make Admin
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
