import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { FaHandHoldingHeart, FaHistory, FaDonate, FaLock } from 'react-icons/fa';

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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Donation Amount (USD)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-field pl-8"
                        placeholder="Enter amount"
                    />
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-bold">Test Mode:</span> Use card <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded font-mono">4242 4242 4242 4242</code>, any future date, and any CVC.
                </p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
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
                            color: '#ef4444',
                        },
                    },
                }} />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full btn-primary py-3 flex justify-center items-center gap-2 shadow-lg ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {processing ? (
                    'Processing...'
                ) : (
                    <>
                        <FaLock className="w-4 h-4" /> Secure Donate
                    </>
                )}
            </button>
        </form>
    );
};

const Funding = () => {
    const [funds, setFunds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        Swal.fire({
            icon: 'success',
            title: 'Thank You!',
            text: 'Your contribution will help save lives.',
            confirmButtonColor: '#D32F2F',
            timer: 2000
        });
        fetchFunds();
    }

    return (
        <div className="py-12 px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Funding & Donations</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg">Support our mission to provide safe blood to everyone. Every dollar counts.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300 shadow-xl flex items-center gap-2 transform hover:scale-105"
                    >
                        <FaHandHoldingHeart className="w-5 h-5" /> Give Fund
                    </button>
                </div>

                {/* Funds Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <FaHistory className="text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Contributions</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold text-left">Donor</th>
                                    <th className="px-6 py-4 font-semibold text-left">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(fund => (
                                    <tr key={fund._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                    <FaDonate className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{fund.donorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/30">
                                                ${fund.fundAmount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                            {new Date(fund.fundingDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {funds.length === 0 && <div className="p-8 text-center text-gray-500">No funds recorded yet. Be the first to donate!</div>}
                    </div>

                    {/* Pagination Controls */}
                    {funds.length > itemsPerPage && (
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(funds.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(funds.length / itemsPerPage)}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4 transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FaHandHoldingHeart className="text-primary" /> Donate Funds
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <Elements stripe={stripePromise}>
                                <CheckoutForm onSuccess={handleSuccess} />
                            </Elements>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Funding;
