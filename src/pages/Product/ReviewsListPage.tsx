import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../layouts/Default';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProductCard from '../../components/ProductCard';
import Reviews from '../../components/product/Reviews';
import { Product, ProductReview } from '../../types/Product';
import Skeleton from 'react-loading-skeleton';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ReviewsListPage: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v2/shop/products/${code}`);
                const data = await res.json();
                setProduct(data);

                if (Array.isArray(data.reviews) && data.reviews.length > 0) {
                    const detailed = await Promise.all(
                        data.reviews.map(async (ref: { '@id': string }) => {
                            const res = await fetch(`${API_URL}${ref['@id']}`);
                            return await res.json();
                        })
                    );

                    const sorted = detailed.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                    setReviews(sorted);
                }
            } catch (err) {
                console.error('Failed to load product or reviews', err);
            } finally {
                setLoading(false);
            }
        };

        if (code) fetchProduct();
    }, [code]);

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <Breadcrumbs
                    paths={[
                        { label: 'Home', url: '/' },
                        { label: product?.name || 'Product', url: `/product/${code}` },
                        { label: 'Reviews', url: `/product/${code}/reviews` },
                    ]}
                />

                <div className="row">
                    <div className="col-12 col-md-5 col-lg-4">
                        {loading ? (
                            <Skeleton height={400} />
                        ) : (
                            product && <ProductCard product={product} />
                        )}
                    </div>

                    <div className="col-12 col-md-7 col-lg-8">
                        {loading ? (
                            <>
                                <Skeleton height={30} width={150} className="mb-2" />
                                <Skeleton height={20} width={100} className="mb-4" />
                                <Skeleton height={40} count={5} className="mb-3" />
                            </>
                        ) : (
                            <>
                                <div className="d-sm-flex gap-3">
                                    <div className="flex-grow-1 mb-3">
                                        <h1>Reviews</h1>
                                        <div>{reviews.length} vote{reviews.length !== 1 && 's'}</div>
                                    </div>
                                    <div className="mb-3">
                                        <a href={`/product/${code}/review/new`} className="btn btn-primary">
                                            Add your review
                                        </a>
                                    </div>
                                </div>

                                <Reviews reviews={reviews} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ReviewsListPage;
