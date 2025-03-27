import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductPage from "./pages/ProductPage";
import ProductList from './pages/ProductList';
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';
import AddressPage from "./pages/Checkout/AddressPage";
import ShippingPage from "./pages/Checkout/ShippingPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import SummaryPage from "./pages/Checkout/SummaryPage";
import ThankYouPage from "./pages/Checkout/ThankYouPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/account/DashboardPage";

import './assets/scss/main.scss';
import {OrderProvider} from "./context/OrderContext";
import {CustomerProvider} from "./context/CustomerContext";

const App: React.FC = () => {
    return (
    <Router>
        <CustomerProvider>
            <OrderProvider>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/:parentCode/:childCode" element={<ProductList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout/address" element={<AddressPage />} />
                    <Route path="/checkout/select-shipping" element={<ShippingPage />} />
                    <Route path="/checkout/select-payment" element={<PaymentPage />} />
                    <Route path="/checkout/complete" element={<SummaryPage />} />
                    <Route path="/order/thank-you" element={<ThankYouPage />} />
                    <Route path="/product/:code" element={<ProductPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/account/dashboard" element={<DashboardPage />} />
                </Routes>
            </OrderProvider>
        </CustomerProvider>
    </Router>
  );
};

export default App;
