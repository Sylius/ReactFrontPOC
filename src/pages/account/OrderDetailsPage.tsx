import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Default from "../../layouts/Default";
import AccountLayout from "../../layouts/Account";
import Address from "../../components/Address";
import PaymentsCard from "../../components/order/PaymentsCard";
import ShipmentsCard from "../../components/order/ShipmentsCard";
import ProductRow from "../../components/order/ProductRow";
import { OrderItem, Order } from "../../types/Order";
import { formatPrice } from "../../utils/price";
import Skeleton from "react-loading-skeleton";

const OrderDetailsPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const tokenJwt = localStorage.getItem("jwtToken");
                if (!tokenJwt || !token) return;

                const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
                const orderRes = await fetch(`${baseUrl}/api/v2/shop/orders/${token}`, {
                    headers: { Authorization: `Bearer ${tokenJwt}` },
                });

                if (!orderRes.ok) throw new Error("Błąd pobierania zamówienia");
                const data = await orderRes.json();

                if (data.payments?.[0]?.['@id']) {
                    const paymentRes = await fetch(`${baseUrl}${data.payments[0]['@id']}`, {
                        headers: { Authorization: `Bearer ${tokenJwt}` },
                    });

                    if (paymentRes.ok) {
                        const fullPayment = await paymentRes.json();
                        data.payments[0] = fullPayment;
                        data.createdAt = fullPayment.createdAt;
                    }
                }

                setOrder(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    return (
        <Default>
            <AccountLayout
                breadcrumbs={
                    order
                        ? [
                            { label: "Home", url: "/" },
                            { label: "My account", url: "/account/dashboard" },
                            { label: "Order History", url: "/account/order-history" },
                            { label: `#${order.number}`, url: `/account/orders/${order.tokenValue}` },
                        ]
                        : []
                }
            >
                {loading ? (
                    <div className="col-12 col-md-9 pt-4">
                        <Skeleton height={30} width={200} className="mb-4" />
                        <Skeleton height={100} className="mb-3" count={2} />
                        <Skeleton height={200} className="mb-4" />
                    </div>
                ) : (
                    <div className="col-12 col-md-9 pt-4">
                        <h1 className="h5 mb-4">Order #{order?.number}</h1>

                        <div className="card border-0 bg-body-tertiary mb-3">
                            <div className="card-body d-flex flex-column gap-1">
                                <div className="row">
                                    <div className="col-12 col-sm-4">State</div>
                                    <div className="col">{order?.state || '-'}</div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-sm-4">Created at</div>
                                    <div className="col">
                                        {order?.createdAt
                                            ? new Date(order.createdAt).toLocaleString('en-GB', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-sm-4">Currency</div>
                                    <div className="col">{order?.currencyCode || '-'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    {order?.billingAddress && (
                                        <Address sectionName="Billing address" address={order.billingAddress} />
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    {order?.shippingAddress && (
                                        <Address sectionName="Shipping address" address={order.shippingAddress} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {order?.payments?.[0] && (
                            <PaymentsCard
                                payment={order.payments[0]}
                                total={order.total ?? 0}
                                paymentState={order.paymentState}
                            />
                        )}

                        <div className="card border-0 bg-body-tertiary mb-3">
                            <div className="card-header d-flex align-items-center">
                                <div className="me-auto">Shipments</div>
                                <div>{order?.state}</div>
                            </div>
                        </div>

                        {order?.shipments?.[0] && <ShipmentsCard shipment={order.shipments[0]} />}

                        <div className="table-responsive mt-4">
                            <table className="table table-borderless align-middle">
                                <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="text-end">Unit price</th>
                                    <th className="text-end">Qty</th>
                                    <th className="text-end">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order?.items?.map((item: OrderItem) => (
                                    <ProductRow key={item.id} orderItem={item} />
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <table className="table table-borderless align-middle ms-auto w-auto">
                            <tbody>
                            <tr>
                                <td className="text-end">Items total:</td>
                                <td className="text-end">${formatPrice(order?.itemsSubtotal)}</td>
                            </tr>
                            <tr>
                                <td className="text-end">Tax total:</td>
                                <td className="text-end">${formatPrice(order?.taxTotal)}</td>
                            </tr>
                            <tr>
                                <td className="text-end">Discount:</td>
                                <td className="text-end">${formatPrice(order?.orderPromotionTotal)}</td>
                            </tr>
                            <tr>
                                <td className="text-end">Shipping total:</td>
                                <td className="text-end">${formatPrice(order?.shippingTotal)}</td>
                            </tr>
                            <tr>
                                <td className="text-end fw-bold">Total:</td>
                                <td className="text-end fw-bold">${formatPrice(order?.total)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </AccountLayout>
        </Default>
    );
};

export default OrderDetailsPage;
