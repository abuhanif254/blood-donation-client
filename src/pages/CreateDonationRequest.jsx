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
            navigate('/dashboard');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: err.response?.data?.message || 'Failed to create request',
            });
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Create Donation Request</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Requester Name</label>
                    <input type="text" value={user.name} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Requester Email</label>
                    <input type="text" value={user.email} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Recipient Name</label>
                    <input type="text" {...register('recipientName', { required: 'Recipient Name is required' })} className="w-full px-3 py-2 border rounded-lg" />
                    {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                    <input type="text" {...register('hospitalName', { required: 'Hospital Name is required' })} className="w-full px-3 py-2 border rounded-lg" />
                    {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
                    <select {...register('bloodGroup', { required: 'Blood Group is required' })} className="w-full px-3 py-2 border rounded-lg">
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Donation Date</label>
                    <input type="date" {...register('donationDate', { required: 'Date is required' })} className="w-full px-3 py-2 border rounded-lg" />
                    {errors.donationDate && <p className="text-red-500 text-xs mt-1">{errors.donationDate.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Donation Time</label>
                    <input type="time" {...register('donationTime', { required: 'Time is required' })} className="w-full px-3 py-2 border rounded-lg" />
                    {errors.donationTime && <p className="text-red-500 text-xs mt-1">{errors.donationTime.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Recipient District</label>
                    <select {...register('recipientDistrict', { required: 'District is required' })} className="w-full px-3 py-2 border rounded-lg">
                        <option value="">Select District</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.name}>{d.name} ({d.bn_name})</option>
                        ))}
                    </select>
                    {errors.recipientDistrict && <p className="text-red-500 text-xs mt-1">{errors.recipientDistrict.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Recipient Upazila</label>
                    <select {...register('recipientUpazila', { required: 'Upazila is required' })} className="w-full px-3 py-2 border rounded-lg">
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map(u => (
                            <option key={u.id} value={u.name}>{u.name} ({u.bn_name})</option>
                        ))}
                    </select>
                    {errors.recipientUpazila && <p className="text-red-500 text-xs mt-1">{errors.recipientUpazila.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Address</label>
                    <input type="text" {...register('fullAddress', { required: 'Address is required' })} className="w-full px-3 py-2 border rounded-lg" />
                    {errors.fullAddress && <p className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Request Message</label>
                    <textarea {...register('requestMessage', { required: 'Message is required' })} className="w-full px-3 py-2 border rounded-lg" rows="4"></textarea>
                    {errors.requestMessage && <p className="text-red-500 text-xs mt-1">{errors.requestMessage.message}</p>}
                </div>

                <div className="md:col-span-2 mt-4">
                    <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300">Request</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDonationRequest;
