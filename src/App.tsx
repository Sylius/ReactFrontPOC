import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductList from './pages/ProductList';
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';
import AddressPage from "./pages/Checkout/AddressPage";
import ShippingPage from "./pages/Checkout/ShippingPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import SummaryPage from "./pages/Checkout/SummaryPage";
import ThankYouPage from "./pages/Checkout/ThankYouPage";

import './assets/scss/main.scss';
import {OrderProvider} from "./context/OrderContext";

const App: React.FC = () => {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<OrderProvider><CartPage /></OrderProvider>} />
            <Route path="/checkout/address" element={<OrderProvider><AddressPage /></OrderProvider>} />
            <Route path="/checkout/select-shipping" element={<OrderProvider><ShippingPage /></OrderProvider>} />
            <Route path="/checkout/select-payment" element={<OrderProvider><PaymentPage /></OrderProvider>} />
            <Route path="/checkout/complete" element={<OrderProvider><SummaryPage /></OrderProvider>} />
            <Route path="/order/thank-you" element={<ThankYouPage />} />
        </Routes>
    </Router>
  );
};

export default App;
