import React from "react";
import { Link } from "react-router-dom";
import Default from "../../layouts/Default";
import AccountLayout from "../../layouts/Account";
import { useCustomer } from "../../context/CustomerContext";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../types/Order";
import Skeleton from "react-loading-skeleton";

const fetchCustomerOrders = async (): Promise<Order[]> => {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("No Token");

    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/api/v2/shop/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Order download error");
    }

    const data = await response.json();
    const basicOrders = data["hydra:member"] as Partial<Order>[];

    const fullOrders = await Promise.all(
        basicOrders.map(async (order) => {
            try {
                const orderResponse = await fetch(`${baseUrl}/api/v2/shop/orders/${order.tokenValue}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!orderResponse.ok) {
                    throw new Error("Full order download error");
                }

                const fullOrderData = await orderResponse.json();

                let createdAt: string | undefined = undefined;

                if (fullOrderData.payments && fullOrderData.payments.length > 0) {
                    const paymentUrl = fullOrderData.payments[0]["@id"];
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
                return order as Order;
            }
        })
    );

    return fullOrders;
};

const OrderHistoryPage: React.FC = () => {
    const { customer } = useCustomer();

    const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
        queryKey: ["customerOrders", customer?.email],
        queryFn: fetchCustomerOrders,
        enabled: !!customer,
    });

    return (
        <Default>
            <AccountLayout
                breadcrumbs={[
                    { label: "Home", url: "/" },
                    { label: "My account", url: "/account/dashboard" },
                    { label: "Order History", url: "/account/order-history" },
                ]}
            >
                <div className="col-12 col-md-9">
                    <div className="mb-4">
                        <h1>Order history</h1>
                        Browse your orders from the past
                    </div>

                    <div className="card">
                        <div className="card-body border-bottom py-3">
                            <div className="d-flex border-bottom pb-3"></div>
                            <div className="table-responsive">
                                {isLoading ? (
                                    <table className="table card-table">
                                        <tbody>
                                        <tr>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={100} /></td>
                                            <td><Skeleton width={100} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={60} height={30} /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                ) : isError ? (
                                    <p>Failed to load orders. Please try again later.</p>
                                ) : (
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
                                        {orders.map((order: Order) => (
                                            <tr key={order.tokenValue} className="item">
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
                                                    <Link
                                                        to={`/account/orders/${order.tokenValue}`}
                                                        className="btn btn-sm btn-outline-gray"
                                                    >
                                                        Show
                                                    </Link>
                                                </td>
                                            </tr>
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
