import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800">
            <h1 className="text-9xl font-extrabold text-red-600 tracking-widest">404</h1>
            <div className="bg-red-100 px-2 text-sm rounded rotate-12 absolute">
                Page Not Found
            </div>
            <p className="mt-8 text-xl font-medium md:text-2xl">
                Whoops! We lost that page.
            </p>
            <p className="mt-4 text-gray-500 text-center max-w-lg">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition duration-300 shadow-lg">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
