import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useFlashMessages } from '../../context/FlashMessagesContext';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../layouts/Default';
import Skeleton from 'react-loading-skeleton';
import { Product } from '../../types/Product';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AddReviewPage: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const { addMessage } = useFlashMessages();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v2/shop/products/${code}`);
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error('Error loading product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (code) fetchProduct();
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/v2/shop/product-reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    rating,
                    comment,
                    email,
                    product: `/api/v2/shop/products/${code}`,
                }),
            });

            if (!res.ok) throw new Error('Failed to submit review');

            addMessage('success', 'Success — Your review is waiting for the acceptation.');
            navigate(`/product/${code}`);
        } catch (err) {
            console.error('Error submitting review:', err);
            addMessage('error', 'Failed to submit your review');
        }
    };

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <div className="row">
                    <Breadcrumbs
                        paths={[
                            { label: 'Home', url: '/' },
                            { label: product?.name || 'Product', url: `/product/${code}` },
                            { label: 'Add Review', url: `/product/${code}/review/new` },
                        ]}
                    />

                    <div className="col-12 col-md-5 col-lg-4">
                        {loading ? (
                            <Skeleton height={400}/>
                        ) : (
                            product && <ProductCard product={product}/>
                        )}
                    </div>

                    <div className="col-12 col-md-7 col-lg-8">
                        <h1>Add Your Review</h1>
                        <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label d-block">Rating <span className="text-danger">*</span></label>
                                    <div className="star-rating" role="radiogroup" aria-label="Rating">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                type="button"
                                                key={value}
                                                className={`fs-1 star ${value <= rating ? 'active' : ''}`}
                                                onClick={() => setRating(value)}
                                                aria-label={`${value} star`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Comment <span className="text-danger">*</span></label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary px-4">
                                    Add
                                </button>
                            </form>
                        </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddReviewPage;
