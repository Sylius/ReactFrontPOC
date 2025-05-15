import React from 'react';
import { ProductReview } from '../../types/Product';

interface ReviewSummaryProps {
    reviews: ProductReview[];
    productCode: string;
    allReviewCount: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews, productCode, allReviewCount }) => {
    const averageRating =
        reviews.length > 0
            ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
            : 0;

    return allReviewCount > 0 ? (
        <div className="row mb-2">
            <div className="col-md-auto fs-4 review-stars">
                {'★'.repeat(averageRating)}
                {'☆'.repeat(5 - averageRating)}
            </div>
            <div className="col-md-auto">
                {allReviewCount} review{allReviewCount !== 1 && 's'}
            </div>
            <a href={`/product/${productCode}/review/new`} className="col-md-auto">
                Add your review
            </a>
        </div>
    ) : (
        <div className="row mb-2">
            <div className="col-md-auto fs-4 review-stars">
                {'☆'.repeat(5)}
            </div>
            <div className="col-md-auto">
                0 reviews
            </div>
            <a href={`/product/${productCode}/review/new`} className="col-md-auto">
                Add your review
            </a>
        </div>
    );
};

export default ReviewSummary;
