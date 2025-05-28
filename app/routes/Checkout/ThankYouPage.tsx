import React from 'react';
import Layout from '../../layouts/Default';
import { useCustomer } from '../../context/CustomerContext';
import { useLocation } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
    const { customer } = useCustomer();
    const location = useLocation();
    const tokenValue = location.state?.tokenValue;

    return (
        <Layout>
            <div className="container text-center my-auto">
                <div className="row flex-column my-4">
                    <h1 className="h2">Thank you!</h1>
                    You have successfully placed an order.

                    <div className="d-flex flex-column flex-lg-row justify-content-center gap-2 mt-4">
                        {customer && tokenValue ? (
                            <a className="btn btn-primary" href={`/account/orders/${tokenValue}`}>
                                View order
                            </a>
                        ) : (
                            <>
                                <a className="btn btn-primary" href="/orderpay">
                                    Change payment method
                                </a>
                                <a className="btn btn-secondary" href="/register">
                                    Create an account
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ThankYouPage;
