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
                Swal.fire('Success', 'Image uploaded successfully!', 'success');
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
                text: 'Welcome to BloodDonate!',
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input type="text" {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
                        <select {...register('bloodGroup', { required: 'Blood Group is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
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

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
                        <select {...register('district', { required: 'District is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option value="">Select District</option>
                            {/* We use ID as value now for easier filtering */}
                            {districts.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.bn_name})</option>
                            ))}
                        </select>
                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Upazila</label>
                        <select {...register('upazila', { required: 'Upazila is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map(u => (
                                <option key={u.id} value={u.name}>{u.name} ({u.bn_name})</option>
                            ))}
                        </select>
                        {errors.upazila && <p className="text-red-500 text-xs mt-1">{errors.upazila.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Avatar Upload (ImageBB)</label>
                        <div className="flex space-x-2">
                            <input type="file" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" accept="image/*" />
                        </div>
                        {uploading && <p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                        {avatarUrl && <p className="text-green-500 text-xs mt-1">Image uploaded!</p>}
                        <div className="mt-2 text-xs text-gray-500 text-center">OR enter URL manually</div>
                        <input type="text" {...register('avatar')} placeholder="http://..." className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" {...register('password', { required: 'Password is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input type="password" {...register('confirm_password', { required: 'Confirm Password is required' })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                        {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">Register</button>
                    </div>

                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-red-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
