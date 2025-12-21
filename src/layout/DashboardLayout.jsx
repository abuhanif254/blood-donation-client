import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-red-600 md:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <span className="ml-4 text-lg font-bold text-red-600">Blood Donation Dashboard</span>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
