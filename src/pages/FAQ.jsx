import { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Who can donate blood?",
            answer: "Most people can donate blood if they are in good health. There are some basic requirements usually concerning age (18-60), weight (at least 45-50kg), and general health."
        },
        {
            question: "How often can I donate blood?",
            answer: "Men can donate blood every 3 months, and women can donate every 4 months. This allows your body enough time to replenish its iron stores."
        },
        {
            question: "Is it safe to donate blood?",
            answer: "Yes, it is completely safe. New, sterile, and disposable equipment is used for each donor, so there is no risk of contracting a blood-borne infection."
        },
        {
            question: "How does the platform help?",
            answer: "We connect those in need of blood with voluntary donors in their area. We maintain a database of willing donors to facilitate quick communication during emergencies."
        },
        {
            question: "Do I get paid for donating?",
            answer: "No, blood donation is a voluntary act of kindness. We encourage voluntary unpaid donation to save lives."
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <div className="py-16 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="font-bold text-gray-800">{faq.question}</span>
                                <span className="text-red-500 font-bold text-xl">
                                    {openIndex === index ? '-' : '+'}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
