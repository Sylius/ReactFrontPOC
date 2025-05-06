import React from "react";
import Default from "../../layouts/Default";
import AccountLayout from "../../layouts/Account";
import { useCustomer } from "../../context/CustomerContext";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../types/Order";

const fetchCustomerOrders = async (): Promise<Order[]> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Brak tokenu');

    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/api/v2/shop/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Błąd pobierania zamówień');
    }

    const data = await response.json();
    const basicOrders = data['hydra:member'] || [];

    const fullOrders = await Promise.all(
        basicOrders.map(async (order: any) => {
            try {
                const orderResponse = await fetch(`${baseUrl}/api/v2/shop/orders/${order.tokenValue}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!orderResponse.ok) {
                    throw new Error('Błąd pobierania pełnego zamówienia');
                }

                const fullOrderData = await orderResponse.json();

                let createdAt: string | undefined = undefined;

                if (fullOrderData.payments && fullOrderData.payments.length > 0) {
                    const paymentUrl = fullOrderData.payments[0]['@id'];
                    const paymentResponse = await fetch(`${baseUrl}${paymentUrl}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json();
                        createdAt = paymentData.createdAt;
                    }
                }

                return {
                    ...fullOrderData,
                    createdAt: createdAt ?? undefined,
                };
            } catch (error) {
                console.warn(`Failed to fetch full order for token: ${order.tokenValue}`, error);
                return order;
            }
        })
    );

    return fullOrders;
};

const OrderHistoryPage: React.FC = () => {
    const { customer } = useCustomer();

    const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
        queryKey: ['customerOrders', customer?.email],
        queryFn: fetchCustomerOrders,
        enabled: !!customer,
    });

    return (
        <Default>
            <AccountLayout
                breadcrumbs={[
                    { label: "Home", url: "/" },
                    { label: "My account", url: "/account/dashboard" },
                    { label: "Order History", url: "/account/order-history" }
                ]}>
                <div className="col-12 col-md-9">
                    <div className="mb-4">
                        <h1>Order history</h1>
                        Browse your orders from the past
                    </div>

                    <div className="card">
                        <div className="card-body border-bottom py-3">
                            <div className="d-flex border-bottom pb-3"></div>
                            <div className="table-responsive">
                                {isLoading && <p>Loading orders...</p>}
                                {isError && <p>Failed to load orders. Please try again later.</p>}
                                {!isLoading && !isError && (
                                    <table className="table card-table table-vcenter text-nowrap datatable">
                                        <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Date</th>
                                            <th>Ship to</th>
                                            <th>Total</th>
                                            <th>State</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(orders.length > 0 ? orders : [{ id: 'empty' }]).map((order: any) => (
                                            order.id !== 'empty' ? (
                                                <tr key={order.id || order.tokenValue} className="item">
                                                    <td>#{order.number}</td>
                                                    <td>
                                                        {order.createdAt
                                                            ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                            })
                                                            : '-'}
                                                    </td>
                                                    <td>
                                                        {order.shippingAddress
                                                            ? `${order.shippingAddress.firstName ?? ''} ${order.shippingAddress.lastName ?? ''}`.trim()
                                                            : '-'}
                                                    </td>
                                                    <td>${(order.itemsSubtotal / 100).toFixed(2)}</td>
                                                    <td>{order.state}</td>
                                                    <td>
                                                        <a href={`/account/orders/${order.tokenValue}`}
                                                           className="btn btn-sm btn-outline-gray">
                                                            Show
                                                        </a>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key="empty">
                                                    <td colSpan={6} className="text-center">No orders found.</td>
                                                </tr>
                                            )
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AccountLayout>
        </Default>
    );
};

export default OrderHistoryPage;
