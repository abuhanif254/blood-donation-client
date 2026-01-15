import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        // Here you would typically send the data to your backend
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you for contacting us. We will get back to you shortly.',
            confirmButtonColor: '#D32F2F'
        });
        reset();
    };

    return (
        <div className="bg-neutral dark:bg-gray-900 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions or suggestions? We'd love to hear from you. Reach out to us and let's work together to save lives.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Info & Map */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-primary">
                                        <FaMapMarkerAlt className="w-6 h-6" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Our Office</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            House #12, Road #5, Dhanmondi,<br />
                                            Dhaka-1209, Bangladesh
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600">
                                        <FaPhoneAlt className="w-6 h-6" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">+880 1712 345 678</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Mon-Fri from 9am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-600">
                                        <FaEnvelope className="w-6 h-6" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">support@bloodunity.com</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">We respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Embedded Map */}
                        <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902442430139!2d90.39108031543166!3d23.750858194680884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b888ad3dd41d%3A0xde446f018e748d6f!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Google Maps Location"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">My Name</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        className="input-field"
                                        placeholder="Your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">My Email</label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email is required' })}
                                        className="input-field"
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    {...register('subject', { required: 'Subject is required' })}
                                    className="input-field"
                                    placeholder="What is this about?"
                                />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    {...register('message', { required: 'Message is required' })}
                                    rows="4"
                                    className="input-field"
                                    placeholder="Write your message here..."
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                            </div>

                            <button type="submit" className="w-full btn-primary py-4 text-lg shadow-xl flex items-center justify-center gap-2">
                                <FaPaperPlane /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
