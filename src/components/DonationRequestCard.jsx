import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DonationRequestCard = ({ request }) => {
    const {
        _id,
        recipientName,
        bloodGroup,
        recipientDistrict,
        recipientUpazila,
        donationDate,
        donationTime,
        donationStatus,
        hospitalName,
    } = request;

    // Status badge styling
    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-info',
            inprogress: 'badge-warning',
            done: 'badge-success',
            canceled: 'badge-error',
        };
        return `badge ${badges[status] || 'badge-info'}`;
    };

    return (
        <Link to={`/donation-requests/${_id}`} className="donation-card group">
            {/* Image Section - Fixed Aspect Ratio */}
            <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 overflow-hidden flex items-center justify-center">
                {/* Blood Drop Icon/Illustration */}
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/50 dark:border-slate-800/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {/* Blood Group Badge */}
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900">
                        {bloodGroup}
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Status Badge & Date */}
                <div className="flex items-center justify-between mb-3">
                    <span className={getStatusBadge(donationStatus)}>
                        {donationStatus === 'inprogress' ? 'In Progress' : donationStatus}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {donationDate}
                    </span>
                </div>

                {/* Recipient Name */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {recipientName}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    Urgent request for <span className="font-semibold text-primary">{bloodGroup}</span> blood at {hospitalName}.
                </p>

                {/* Location & Hospital Info */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4 mt-0.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{recipientUpazila}, {recipientDistrict}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{donationTime}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full btn-primary py-2.5 text-sm mt-auto">
                    View Details
                </button>
            </div>
        </Link>
    );
};

DonationRequestCard.propTypes = {
    request: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        recipientName: PropTypes.string.isRequired,
        bloodGroup: PropTypes.string.isRequired,
        recipientDistrict: PropTypes.string.isRequired,
        recipientUpazila: PropTypes.string.isRequired,
        donationDate: PropTypes.string.isRequired,
        donationTime: PropTypes.string.isRequired,
        donationStatus: PropTypes.string.isRequired,
        hospitalName: PropTypes.string,
    }).isRequired,
};

export default DonationRequestCard;
