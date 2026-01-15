import api from '../api/axios';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';

const Search = () => {
    const { user } = useAuth();
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [donors, setDonors] = useState([]);
    const [searchParams, setSearchParams] = useState({
        bloodGroup: '',
        district: '',
        upazila: ''
    });
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [requestData, setRequestData] = useState({
        recipientName: '',
        recipientDistrict: '',
        recipientUpazila: '',
        hospitalName: '',
        fullAddress: '',
        donationDate: '',
        donationTime: '',
        requestMessage: '',
    });

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Blood Donor Search Results", 14, 20);

        const tableColumn = ["Name", "Blood Group", "Dictrict", "Upazila", "Email"];
        const tableRows = [];

        donors.forEach(donor => {
            const donorData = [
                donor.name,
                donor.bloodGroup,
                donor.district,
                donor.upazila,
                donor.email,
            ];
            tableRows.push(donorData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 25,
        });

        doc.save("blood_donors_results.pdf");
    };

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
        if (searchParams.district) {
            const dist = districts.find(d => d.name === searchParams.district);
            if (dist) {
                const filtered = upazilas.filter(u => u.district_id === dist.id);
                setFilteredUpazilas(filtered);
            } else {
                setFilteredUpazilas([]);
            }
        }
    }, [searchParams.district, districts, upazilas]);

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            const { data } = await api.get(`/users/search?${query}`);
            setDonors(data);
        } catch (error) {
            console.error("Failed to search donors", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRequestClick = (donor) => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to send a donation request.',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                // Ideally navigate to login state
            });
            return;
        }
        setSelectedDonor(donor);
        setShowModal(true);
        // Pre-fill recipient district/upazila same as donor ideally? Or blank.
        // Let's keep blank or logical default.
    };

    const handleModalChange = (e) => {
        setRequestData({ ...requestData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {

            const payload = {
                ...requestData,
                bloodGroup: selectedDonor.bloodGroup, // Getting blood group from donor
                donorId: selectedDonor._id,
                donorName: selectedDonor.name,
                donorEmail: selectedDonor.email,
            };

            const res = await api.post('/donation-requests', payload);
            if (res.status === 201) {
                Swal.fire('Success', 'Donation Request Sent Successfully', 'success');
                setShowModal(false);
                setRequestData({
                    recipientName: '',
                    recipientDistrict: '',
                    recipientUpazila: '',
                    hospitalName: '',
                    fullAddress: '',
                    donationDate: '',
                    donationTime: '',
                    requestMessage: '',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to send request', 'error');
        }
    };

    return (
        <div className="py-10 px-4 min-h-screen bg-gray-50">
            <div className={`max-w-4xl mx-auto ${showModal ? 'opacity-50 pointer-events-none' : ''}`}>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Search Blood Donors</h2>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-12 border border-gray-100 dark:border-gray-700">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={searchParams.bloodGroup}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">District</label>
                            <select
                                name="district"
                                value={searchParams.district}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select District</option>
                                {districts.map(d => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Upazila</label>
                            <select
                                name="upazila"
                                value={searchParams.upazila}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map(u => (
                                    <option key={u.id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button type="submit" className="w-full btn-primary h-[46px]">
                                Search Donors
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold dark:text-white">Results <span className="text-gray-500 text-lg font-normal">({donors.length} found)</span></h3>
                            {donors.length > 0 && (
                                <button
                                    onClick={downloadPDF}
                                    className="btn-outline py-2 px-4 text-sm"
                                >
                                    Download PDF
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : donors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {donors.map(donor => (
                                    <div key={donor._id} className="card flex flex-col items-center text-center p-6 group">
                                        <div className="relative mb-4">
                                            <img
                                                src={donor.avatar || 'https://i.ibb.co.com/M6h8732d/users-vector-icon-png-260862.jpg'}
                                                alt={donor.name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 group-hover:border-primary transition-colors duration-300"
                                            />
                                            <span className="absolute bottom-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-gray-800">
                                                {donor.bloodGroup}
                                            </span>
                                        </div>

                                        <h4 className="text-xl font-bold mb-1 dark:text-white">{donor.name}</h4>
                                        <p className="text-gray-500 text-sm mb-4">{donor.district}, {donor.upazila}</p>

                                        <div className="w-full border-t border-gray-100 dark:border-gray-700 my-4"></div>

                                        <button
                                            onClick={() => handleRequestClick(donor)}
                                            className="w-full btn-primary py-2 text-sm"
                                        >
                                            Request Donation
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No donors found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4">Request Donation from {selectedDonor?.name}</h3>
                            <form onSubmit={handleModalSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Recipient Name</label>
                                        <input type="text" name="recipientName" required value={requestData.recipientName} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Hospital Name</label>
                                        <input type="text" name="hospitalName" required value={requestData.hospitalName} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Recipient District</label>
                                        <input type="text" name="recipientDistrict" required value={requestData.recipientDistrict} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Recipient Upazila</label>
                                        <input type="text" name="recipientUpazila" required value={requestData.recipientUpazila} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Full Address</label>
                                    <input type="text" name="fullAddress" required value={requestData.fullAddress} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Date</label>
                                        <input type="date" name="donationDate" required value={requestData.donationDate} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Time</label>
                                        <input type="time" name="donationTime" required value={requestData.donationTime} onChange={handleModalChange} className="w-full border rounded px-2 py-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Message</label>
                                    <textarea name="requestMessage" required value={requestData.requestMessage} onChange={handleModalChange} className="w-full border rounded px-2 py-1" rows="3"></textarea>
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Send Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
