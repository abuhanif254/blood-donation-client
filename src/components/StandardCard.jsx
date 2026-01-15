import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * StandardCard - Uniform card component for consistent design across the app
 * 
 * @param {Object} props
 * @param {string} props.image - Image URL
 * @param {string} props.title - Card title
 * @param {string} props.description - Short description (max 2-3 lines)
 * @param {Object} props.meta - Meta information object
 * @param {string} props.linkTo - Navigation link
 * @param {string} props.buttonText - Button text (default: "View Details")
 * @param {Function} props.onClick - Optional click handler
 * @param {boolean} props.loading - Show skeleton loader
 */
const StandardCard = ({
    image,
    title,
    description,
    meta = {},
    linkTo,
    buttonText = "View Details",
    onClick,
    loading = false,
    className = ""
}) => {
    if (loading) {
        return (
            <div className={`donation-card ${className}`}>
                <div className="skeleton h-48 w-full rounded-t-2xl"></div>
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <div className="skeleton h-6 w-3/4 rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-2/3 rounded"></div>
                    <div className="mt-auto">
                        <div className="skeleton h-10 w-full rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    const CardContent = () => (
        <>
            {/* Image Section - Fixed Aspect Ratio */}
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                    src={image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed flex-1">
                    {description}
                </p>

                {/* Meta Information */}
                {Object.keys(meta).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                        {Object.entries(meta).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                                    {key}:
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">{value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={onClick}
                    className="w-full btn-primary py-2.5 text-sm mt-auto"
                >
                    {buttonText}
                </button>
            </div>
        </>
    );

    // If linkTo is provided, wrap in Link, otherwise render as div
    if (linkTo) {
        return (
            <Link to={linkTo} className={`donation-card group ${className}`}>
                <CardContent />
            </Link>
        );
    }

    return (
        <div className={`donation-card group ${className}`} onClick={onClick}>
            <CardContent />
        </div>
    );
};

StandardCard.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    meta: PropTypes.object,
    linkTo: PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default StandardCard;
