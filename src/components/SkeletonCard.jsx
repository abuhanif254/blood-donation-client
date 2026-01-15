const SkeletonCard = () => {
    return (
        <div className="donation-card">
            {/* Image Skeleton - Fixed Height matching DonationRequestCard */}
            <div className="skeleton h-48 w-full"></div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
                {/* Status Badge & Date Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                    <div className="skeleton h-4 w-16 rounded"></div>
                </div>

                {/* Title Skeleton */}
                <div className="skeleton h-6 w-3/4 rounded"></div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-4 w-2/3 rounded"></div>
                </div>

                {/* Meta Info Skeleton */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="skeleton h-4 w-4 rounded-full"></div>
                        <div className="skeleton h-4 w-32 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="skeleton h-4 w-4 rounded-full"></div>
                        <div className="skeleton h-4 w-24 rounded"></div>
                    </div>
                </div>

                {/* Button Skeleton */}
                <div className="skeleton h-10 w-full rounded-xl mt-4"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
