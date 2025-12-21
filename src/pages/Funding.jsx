import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';

// Use your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // 1. Create PaymentIntent on backend
            const { data: { clientSecret } } = await api.post('/payment/create-payment-intent', {
                amount: parseFloat(amount)
            });

            // 2. Confirm Payment on client
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Save funding info to backend
                    await api.post('/payment/funds', {
                        fundAmount: parseFloat(amount),
                        transactionId: result.paymentIntent.id
                    });
                    setProcessing(false);
                    onSuccess();
                }
            }
        } catch (err) {
            console.error("Payment Error:", err);
            setError(err.response?.data?.message || err.message);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Amount (USD)</label>
                <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter amount"
                />
            </div>
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-700">
                    <span className="font-bold">Test Mode:</span> Use card <code className="bg-blue-100 px-1 rounded font-mono">4242 4242 4242 4242</code>, any future date (e.g., 12/30), and any CVC (e.g., 123456).
                </p>
            </div>
            <div className="p-3 border rounded">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
                {processing ? 'Processing...' : 'Donate'}
            </button>
        </form>
    );
};

const Funding = () => {
    const [funds, setFunds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { user } = useAuth();

    const fetchFunds = async () => {
        try {
            const { data } = await api.get('/payment/funds');
            setFunds(data);
        } catch (error) {
            console.error("Failed to fetch funds", error);
        }
    };

    useEffect(() => {
        fetchFunds();
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        // Sweet alert here if requested, plain alert for now
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Donation Successful! Thank you.',
            showConfirmButton: false,
            timer: 1500
        });
        fetchFunds();
    }

    return (
        <div className="py-10 px-4 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Funding</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition duration-300 shadow-lg"
                    >
                        Give Fund
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(fund => (
                                <tr key={fund._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{fund.donorName}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">${fund.fundAmount}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(fund.fundingDate).toLocaleDateString()}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {funds.length === 0 && <p className="p-5 text-gray-500 text-center">No funds recorded yet. Be the first!</p>}

                    {/* Pagination Controls */}
                    {funds.length > itemsPerPage && (
                        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                            <span className="text-xs xs:text-sm text-gray-900">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, funds.length)} of {funds.length} Entries
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(funds.length / itemsPerPage)))}
                                    disabled={currentPage === Math.ceil(funds.length / itemsPerPage)}
                                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Donate Funds</h3>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm onSuccess={handleSuccess} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Funding;
