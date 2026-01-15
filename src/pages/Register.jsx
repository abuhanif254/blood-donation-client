import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [error, setError] = useState('');

    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

    const selectedDistrictId = watch('district');

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
        if (selectedDistrictId && upazilas.length > 0) {
            // Filter by ID instead of Name for better robustness
            const filtered = upazilas.filter(u => u.district_id == selectedDistrictId);
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId, upazilas]);

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            // NOTE: Using environment variable for ImageBB API Key
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);

            if (res.data.success) {
                setAvatarUrl(res.data.data.url);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Image uploaded successfully!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to upload image. Please try again or use the URL input.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (data.password !== data.confirm_password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            return;
        }

        // Map the district ID back to Name for the backend
        const distName = districts.find(d => d.id == data.district)?.name || data.district;

        // Use the name for the backend payload
        const finalData = {
            ...data,
            district: distName,
            avatar: avatarUrl || data.avatar
        };

        try {
            await registerUser(finalData);
            await Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Welcome to BloodUnity!',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/dashboard');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.message || 'Something went wrong',
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral dark:bg-gray-950 py-12 px-4">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join BloodUnity</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Create an account to donate blood and save lives</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Full Name</label>
                        <input type="text" {...register('name', { required: 'Name is required' })} className="input-field" placeholder="Enter your full name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email Address</label>
                        <input type="email" {...register('email', { required: 'Email is required' })} className="input-field" placeholder="Enter your email" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Blood Group</label>
                        <select {...register('bloodGroup', { required: 'Blood Group is required' })} className="input-field">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Avatar</label>
                        <div className="relative">
                            <input type="file" onChange={handleImageUpload} className="hidden" id="file-upload" accept="image/*" />
                            <label htmlFor="file-upload" className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <span className="text-sm text-gray-600 dark:text-gray-300">{uploading ? 'Uploading...' : 'Choose File'}</span>
                            </label>
                            {avatarUrl && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                        </div>
                        {avatarUrl && <p className="text-green-600 text-xs mt-1">Image uploaded successfully!</p>}
                        {!avatarUrl && <input type="text" {...register('avatar')} placeholder="Or enter image URL" className="input-field mt-2 text-xs" />}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">District</label>
                        <select {...register('district', { required: 'District is required' })} className="input-field">
                            <option value="">Select District</option>
                            {/* We use ID as value now for easier filtering */}
                            {districts.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.bn_name})</option>
                            ))}
                        </select>
                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Upazila</label>
                        <select {...register('upazila', { required: 'Upazila is required' })} className="input-field">
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map(u => (
                                <option key={u.id} value={u.name}>{u.name} ({u.bn_name})</option>
                            ))}
                        </select>
                        {errors.upazila && <p className="text-red-500 text-xs mt-1">{errors.upazila.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
                        <input type="password" {...register('password', { required: 'Password is required' })} className="input-field" placeholder="Create a password" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Confirm Password</label>
                        <input type="password" {...register('confirm_password', { required: 'Confirm Password is required' })} className="input-field" placeholder="Confirm your password" />
                        {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <button type="submit" className="w-full btn-primary py-3 text-lg shadow-lg">
                            Register Account
                        </button>
                    </div>

                </form>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
