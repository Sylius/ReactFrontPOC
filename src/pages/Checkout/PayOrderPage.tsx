import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Default from '../../layouts/Default';
import { Order } from '../../types/Order';
import { IconCreditCard } from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface PaymentMethod {
    id: number;
    code: string;
    name: string;
    description?: string;
}

const PayOrderPage: React.FC = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const jwt = localStorage.getItem('jwtToken');
                const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

                if (!jwt || !token) return;

                const orderRes = await fetch(`${baseUrl}/api/v2/shop/orders/${token}`, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                if (!orderRes.ok) throw new Error('Failed to load order');
                const orderData: Order = await orderRes.json();
                setOrder(orderData);

                const payment = orderData.payments?.[0];
                if (!payment?.id) throw new Error('No payment ID found');

                const methodsRes = await fetch(
                    `${baseUrl}/api/v2/shop/orders/${token}/payments/${payment.id}/methods`,
                    { headers: { Authorization: `Bearer ${jwt}` } }
                );
                const methodsData = await methodsRes.json();
                let list = methodsData['hydra:member'] || [];

                if (list.length === 0) {
                    const fallbackRes = await fetch(`${baseUrl}/api/v2/shop/payment-methods`, {
                        headers: { Authorization: `Bearer ${jwt}` },
                    });
                    const fallbackData = await fallbackRes.json();
                    list = fallbackData['hydra:member'] || [];
                }

                setPaymentMethods(list);
                if (list.length > 0) setSelectedMethod(list[0].code);

                if (payment['@id']) {
                    const fullPaymentRes = await fetch(`${baseUrl}${payment['@id']}`, {
                        headers: { Authorization: `Bearer ${jwt}` },
                    });
                    if (fullPaymentRes.ok) {
                        const fullPayment = await fullPaymentRes.json();
                        setCreatedAt(fullPayment.createdAt);
                    }
                }
            } catch (err) {
                console.error('🔥 Error during fetchOrder:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order || !order.payments?.[0]?.id) return;

        setSubmitting(true);
        try {
            const jwt = localStorage.getItem('jwtToken');
            const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

            const res = await fetch(
                `${baseUrl}/api/v2/shop/orders/${token}/payments/${order.payments[0].id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/merge-patch+json',
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({ paymentMethod: selectedMethod }),
                }
            );

            if (!res.ok) throw new Error('❌ Failed to set payment method');

            navigate('/order/thank-you', {
                state: { tokenValue: token },
            });
        } catch (err) {
            console.error('🔥 Error submitting payment method:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Default>
            <div className="container my-5">
                <div className="col-lg-8 mx-auto">
                    <h1 className="h4 mb-2">
                        {loading ? <Skeleton width={300} /> : `Summary of your order #${order?.number}`}
                    </h1>
                    <p className="text-muted mb-4">
                        {loading ? (
                            <Skeleton width={250} />
                        ) : (
                            `${createdAt ? new Date(createdAt).toLocaleString('en-GB') : '-'} • $${((order?.total ?? 0) / 100).toFixed(2)} • ${order?.items?.length ?? 0} items`
                        )}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <h5 className="mb-4">Payment #1</h5>

                        {loading ? (
                            <div className="d-flex flex-column gap-3 mb-3">
                                <Skeleton height={64} />
                                <Skeleton height={64} />
                            </div>
                        ) : paymentMethods.length === 0 ? (
                            <div className="card bg-body-tertiary border-0 mb-3">
                                <div className="card-body">
                                    <h6 className="text-danger mb-1">Warning</h6>
                                    <p className="mb-0">No payment methods are available for this order.</p>
                                </div>
                            </div>
                        ) : (
                            paymentMethods.map((method) => (
                                <div className="card bg-body-tertiary border-0 mb-3" key={method.id}>
                                    <label className="card-body">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id={`payment-method-${method.id}`}
                                                name="paymentMethod"
                                                className="form-check-input"
                                                checked={selectedMethod === method.code}
                                                onChange={() => setSelectedMethod(method.code)}
                                            />
                                            <label className="form-check-label" htmlFor={`payment-method-${method.id}`}>
                                                {method.name}
                                            </label>
                                        </div>
                                        {method.description && (
                                            <div className="ps-4">
                                                <small className="text-muted">{method.description}</small>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            ))
                        )}

                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-primary btn-icon w-100" disabled={submitting}>
                                <IconCreditCard size={20} className="me-2" />
                                Pay
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Default>
    );
};

export default PayOrderPage;
