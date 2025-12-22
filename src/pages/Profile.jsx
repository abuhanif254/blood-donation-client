import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: user
    });
    const [isEditing, setIsEditing] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    // Handling District/Upazila is tricky if only one is updated.
    // I will simplify by fetching both lists and showing select options.

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const distRes = await api.get('/location/districts');
                const upaRes = await api.get('/location/upazilas');
                setDistricts(distRes.data);
                setUpazilas(upaRes.data);
            } catch (err) {
                console.error("Failed to fetch locations", err);
            }
        }
        fetchLocations();
    }, []);

    const onSubmit = async (data) => {
        try {
            const { data: updatedUser } = await api.put('/users/me', data);
            updateUser(updatedUser);
            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile information has been saved.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.',
            });
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Profile</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full mb-4 object-cover" />
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-600">{user.role}</p>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Blood Group</label>
                                <input
                                    type="text"
                                    {...register('bloodGroup')}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">District</label>
                                {isEditing ? (
                                    <select {...register('district')} className="w-full px-3 py-2 border rounded">
                                        {districts.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        {...register('district')}
                                        disabled
                                        className="w-full px-3 py-2 border rounded bg-gray-100"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Upazila</label>
                                {isEditing ? (
                                    <select {...register('upazila')} className="w-full px-3 py-2 border rounded">
                                        {upazilas.map(u => (
                                            <option key={u.id} value={u.name}>{u.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        {...register('upazila')}
                                        disabled
                                        className="w-full px-3 py-2 border rounded bg-gray-100"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Avatar URL</label>
                                <input
                                    type="text"
                                    {...register('avatar')}
                                    disabled={!isEditing}
                                    className={`w-full px-3 py-2 border rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => { setIsEditing(false); reset(user); }} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Save Changes</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
