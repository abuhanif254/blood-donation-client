import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateDonationRequest = () => {
    const { user } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [error, setError] = useState('');

    const selectedDistrict = watch('recipientDistrict');

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
        if (selectedDistrict) {
            const dist = districts.find(d => d.name === selectedDistrict);
            if (dist) {
                const filtered = upazilas.filter(u => u.district_id === dist.id);
                setFilteredUpazilas(filtered);
            } else {
                setFilteredUpazilas([]);
            }
        }
    }, [selectedDistrict, districts, upazilas]);


    const onSubmit = async (data) => {
        if (user.status === 'blocked') {
            Swal.fire({
                icon: 'error',
                title: 'Blocked!',
                text: 'You are blocked and cannot create requests',
            });
            return;
        }

        try {
            await api.post('/donation-requests', data);
            await Swal.fire({
                icon: 'success',
                title: 'Request Created!',
                text: 'Your donation request has been posted successfully.',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/dashboard/my-donation-requests');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: err.response?.data?.message || 'Failed to create request',
            });
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Request</h2>
                <p className="text-gray-500 text-sm">Need blood? Fill out the form below to connect with donors.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Requester Info Section */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                            Requester Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">My Name</label>
                                <input type="text" value={user.name} readOnly className="input-field bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-70" />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">My Email</label>
                                <input type="text" value={user.email} readOnly className="input-field bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-70" />
                            </div>
                        </div>
                    </div>

                    {/* Patient / Recipient Info Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Recipient & Hospital Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Recipient Name</label>
                                <input type="text" {...register('recipientName', { required: 'Recipient Name is required' })} className="input-field" placeholder="Patient's full name" />
                                {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Hospital Name</label>
                                <input type="text" {...register('hospitalName', { required: 'Hospital Name is required' })} className="input-field" placeholder="e.g. Dhaka Medical College" />
                                {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Blood Group Needed</label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Date</label>
                                    <input type="date" {...register('donationDate', { required: 'Date is required' })} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Time</label>
                                    <input type="time" {...register('donationTime', { required: 'Time is required' })} className="input-field" />
                                </div>
                            </div>
                            {errors.donationDate && <p className="text-red-500 text-xs mt-1 md:col-span-2">{errors.donationDate.message}</p>}
                            {errors.donationTime && <p className="text-red-500 text-xs mt-1 md:col-span-2">{errors.donationTime.message}</p>}

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">District</label>
                                <select {...register('recipientDistrict', { required: 'District is required' })} className="input-field">
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.name}>{d.name} ({d.bn_name})</option>
                                    ))}
                                </select>
                                {errors.recipientDistrict && <p className="text-red-500 text-xs mt-1">{errors.recipientDistrict.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Upazila</label>
                                <select {...register('recipientUpazila', { required: 'Upazila is required' })} className="input-field">
                                    <option value="">Select Upazila</option>
                                    {filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.name}>{u.name} ({u.bn_name})</option>
                                    ))}
                                </select>
                                {errors.recipientUpazila && <p className="text-red-500 text-xs mt-1">{errors.recipientUpazila.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Full Address</label>
                                <input type="text" {...register('fullAddress', { required: 'Address is required' })} className="input-field" placeholder="Detailed location information" />
                                {errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Message (Why is blood needed?)</label>
                                <textarea {...register('requestMessage', { required: 'Message is required' })} className="input-field" rows="3" placeholder="Explain the situation or add specific instructions..."></textarea>
                                {errors.requestMessage && <p className="text-red-500 text-xs mt-1">{errors.requestMessage.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full md:w-auto btn-primary py-3 px-8 text-lg shadow-lg">
                            Post Donation Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDonationRequest;
