import React from 'react';
import Header from './../components/layout/checkout/Header';
import Sidebar from './../components/layout/checkout/Sidebar';
import {OrderProvider} from "../context/OrderContext";

// @ts-ignore
const CheckoutLayout = ({ children }) => {
    return (
        <>
            <div className="d-flex flex-column min-vh-100 overflow-hidden">
                <Header />
                <div className="flex-grow-1 d-flex align-items-stretch">
                    <div className="container">
                        <div className="row h-100">
                            <OrderProvider>
                                { children }
                                <Sidebar />
                            </OrderProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutLayout;
