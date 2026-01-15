import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-neutral dark:bg-gray-950 text-center px-4">
            <div className="relative">
                <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 tracking-widest select-none">404</h1>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-8 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                    <FaExclamationTriangle className="text-red-500 w-8 h-8" />
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Page Not Found</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Error Code: 404</p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xl font-medium text-gray-700 dark:text-gray-300 md:text-2xl">
                Whoops! We assume you're lost.
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link to="/" className="mt-8 btn-primary px-8 py-3 flex items-center gap-2 shadow-lg hover:shadow-red-500/30">
                <FaArrowLeft /> Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
