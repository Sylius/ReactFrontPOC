import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ReviewSummarySkeleton: React.FC = () => {
    return (
        <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex gap-1 fs-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Skeleton key={idx} width={18} height={18} circle />
                    ))}
                </div>

                <Skeleton width={60} height={16} />

                <Skeleton width={100} height={16} />
            </div>
        </div>
    );
};

export default ReviewSummarySkeleton;
