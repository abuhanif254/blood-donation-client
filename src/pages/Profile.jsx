import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import axios from 'axios'; // For ImgBB
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUserEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: user
    });
    const [isEditing, setIsEditing] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Watch fields for updates
    const selectedDistrict = watch('district');
    const currentAvatar = watch('avatar');

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

    useEffect(() => {
        if (selectedDistrict && upazilas.length > 0) {
            // Logic to filter upazilas based on district selection
            // If district is standard name, find its ID first
            const distObj = districts.find(d => d.name === selectedDistrict);
            if (distObj) {
                const filtered = upazilas.filter(u => u.district_id === distObj.id);
                setFilteredUpazilas(filtered);
            } else {
                // Fallback if district not found (or initial load issues)
                setFilteredUpazilas([]);
            }
        }
    }, [selectedDistrict, districts, upazilas]);


    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);

            if (res.data.success) {
                const newUrl = res.data.data.url;
                setValue('avatar', newUrl); // Update form state
                Swal.fire({
                    icon: 'success',
                    title: 'Upload Successful',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to upload image.', 'error');
        } finally {
            setUploading(false);
        }
    };

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
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-transparent"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        <img
                            src={currentAvatar || user.avatar}
                            alt="Avatar"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                        {isEditing && (
                            <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
                                <FaCamera className="w-6 h-6" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <span className="px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full uppercase tracking-wide">
                                {user.role}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</span>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 btn-primary px-6 py-2.5 shadow-lg"
                        >
                            <FaUserEdit /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Details Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                    {isEditing && <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Editing Mode</span>}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Full Name</label>
                            <input
                                type="text"
                                {...register('name')}
                                disabled={!isEditing}
                                className={`input-field ${!isEditing ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="input-field opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Blood Group</label>
                            {isEditing ? (
                                <select {...register('bloodGroup')} className="input-field">
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    {...register('bloodGroup')}
                                    disabled
                                    className="input-field opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                                />
                            )}
                        </div>
                        {/* Hidden Avatar Input to store URL */}
                        <input type="hidden" {...register('avatar')} />

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">District</label>
                            {isEditing ? (
                                <select {...register('district')} className="input-field">
                                    {districts.map(d => (
                                        <option key={d.id} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    {...register('district')}
                                    disabled
                                    className="input-field opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Upazila</label>
                            {isEditing ? (
                                <select {...register('upazila')} className="input-field">
                                    {filteredUpazilas.length > 0 ? filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.name}>{u.name}</option>
                                    )) : <option value="">Select District First</option>}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    {...register('upazila')}
                                    disabled
                                    className="input-field opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
                                />
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); reset(user); }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                <FaTimes /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 btn-primary px-8 py-2.5 shadow-lg"
                            >
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
