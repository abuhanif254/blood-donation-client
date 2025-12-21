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

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={searchParams.bloodGroup}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
                            <select
                                name="district"
                                value={searchParams.district}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Select District</option>
                                {districts.map(d => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Upazila</label>
                            <select
                                name="upazila"
                                value={searchParams.upazila}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            >
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map(u => (
                                    <option key={u.id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300">
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Search Results ({donors.length})</h3>
                            {donors.length > 0 && (
                                <button
                                    onClick={downloadPDF}
                                    className="bg-green-600 text-white font-bold py-1 px-3 rounded hover:bg-green-700 text-sm"
                                >
                                    Download PDF
                                </button>
                            )}
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : donors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {donors.map(donor => (
                                    <div key={donor._id} className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                                        <img src={donor.avatar} alt={donor.name} className="w-16 h-16 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold">{donor.name}</h4>
                                            <p className="text-gray-600 text-sm">{donor.district}, {donor.upazila}</p>
                                            <p className="text-red-600 font-bold">Blood Group: {donor.bloodGroup}</p>
                                            <p className="text-sm mt-1">Email: {donor.email}</p>
                                            <button
                                                onClick={() => handleRequestClick(donor)}
                                                className="mt-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-600"
                                            >
                                                Request Donation
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">No donors found matching criteria.</div>
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
